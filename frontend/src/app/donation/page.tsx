"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  Row,
  Col,
  Statistic,
  Table,
  Form,
  Input,
  InputNumber,
  Button,
  Spin,
  Typography,
  message,
} from "antd";
import { DollarOutlined } from "@ant-design/icons";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import PublicLayout from "@/components/layout/PublicLayout";
import { fundApi } from "@/lib/api/fund";
import type { Donation, DonationCreate, ChartData } from "@/lib/types";

const { Title } = Typography;
const { TextArea } = Input;

export default function DonationPage() {
  const queryClient = useQueryClient();
  const [form] = Form.useForm();
  const [donationPage, setDonationPage] = useState(1);

  const { data: totalData, isLoading: loadingTotal } = useQuery({
    queryKey: ["donationTotal"],
    queryFn: () => fundApi.getDonationTotal(),
  });

  const { data: chartData, isLoading: loadingChart } = useQuery({
    queryKey: ["fundChartData"],
    queryFn: () => fundApi.getChartData(),
  });

  const { data: donationsData, isLoading: loadingDonations } = useQuery({
    queryKey: ["donations", donationPage],
    queryFn: () => fundApi.listDonations({ page: donationPage, limit: 10 }),
  });

  const donateMutation = useMutation({
    mutationFn: (values: DonationCreate) => fundApi.donate(values),
    onSuccess: () => {
      message.success("Thank you for your donation!");
      form.resetFields();
      queryClient.invalidateQueries({ queryKey: ["donationTotal"] });
      queryClient.invalidateQueries({ queryKey: ["donations"] });
      queryClient.invalidateQueries({ queryKey: ["fundChartData"] });
    },
    onError: (err: any) => {
      message.error(err?.response?.data?.error?.message || "Donation failed. Please try again.");
    },
  });

  const onDonate = (values: DonationCreate) => {
    donateMutation.mutate(values);
  };

  const columns = [
    {
      title: "Donor",
      dataIndex: "donor_name",
      key: "donor_name",
    },
    {
      title: "Email",
      dataIndex: "donor_email",
      key: "donor_email",
    },
    {
      title: "Amount",
      dataIndex: "amount",
      key: "amount",
      render: (val: number) => `$${val.toFixed(2)}`,
    },
    {
      title: "Message",
      dataIndex: "message",
      key: "message",
      render: (val: string) => val || "-",
    },
    {
      title: "Date",
      dataIndex: "created_at",
      key: "created_at",
      render: (val: string) => new Date(val).toLocaleDateString(),
    },
  ];

  return (
    <PublicLayout>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Title level={2}><DollarOutlined /> Donations</Title>

        {/* Total */}
        <Card style={{ marginBottom: 24 }}>
          {loadingTotal ? (
            <Spin />
          ) : (
            <Statistic
              title="Total Donations"
              value={totalData?.total ?? 0}
              prefix="$"
              precision={2}
              valueStyle={{ fontSize: 36 }}
            />
          )}
        </Card>

        {/* Chart */}
        <Card title="Daily Donations vs Expenses" style={{ marginBottom: 24 }}>
          {loadingChart ? (
            <div style={{ textAlign: "center", padding: 48 }}><Spin /></div>
          ) : (
            <ResponsiveContainer width="100%" height={350}>
              <BarChart data={chartData || []}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="period" />
                <YAxis />
                <Tooltip />
                <Legend />
                <Bar dataKey="total_donations" fill="#1890ff" name="Donations" />
                <Bar dataKey="total_expenses" fill="#ff4d4f" name="Expenses" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </Card>

        {/* Donation Form */}
        <Card title="Make a Donation" style={{ marginBottom: 24 }}>
          <Form form={form} layout="vertical" onFinish={onDonate} style={{ maxWidth: 500 }}>
            <Form.Item
              name="donor_name"
              label="Your Name"
              rules={[{ required: true, message: "Please enter your name" }]}
            >
              <Input placeholder="Full name" />
            </Form.Item>
            <Form.Item
              name="donor_email"
              label="Your Email"
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input placeholder="your@email.com" />
            </Form.Item>
            <Form.Item
              name="amount"
              label="Amount ($)"
              rules={[{ required: true, message: "Please enter an amount" }]}
            >
              <InputNumber min={1} style={{ width: "100%" }} placeholder="Enter amount" />
            </Form.Item>
            <Form.Item name="message" label="Message (optional)">
              <TextArea rows={3} placeholder="Leave a message..." />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={donateMutation.isPending}>
                Donate
              </Button>
            </Form.Item>
          </Form>
        </Card>

        {/* Recent Donations Table */}
        <Card title="Recent Donations">
          <Table
            dataSource={donationsData?.data || []}
            columns={columns}
            rowKey="id"
            loading={loadingDonations}
            pagination={{
              current: donationPage,
              total: donationsData?.meta?.total || 0,
              pageSize: donationsData?.meta?.limit || 10,
              onChange: (p) => setDonationPage(p),
              showSizeChanger: false,
            }}
          />
        </Card>
      </div>
    </PublicLayout>
  );
}
