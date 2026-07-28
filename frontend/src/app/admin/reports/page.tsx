"use client";

import { useState } from "react";
import { Card, Button, Space, Typography, Row, Col, DatePicker, Spin, Statistic, message } from "antd";
import {
  DownloadOutlined,
  FileExcelOutlined,
  DollarOutlined,
  ShoppingOutlined,
  InboxOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { fundApi } from "@/lib/api/fund";
import { inventoryApi } from "@/lib/api/inventory";
import type { Dayjs } from "dayjs";

const { Title, Text } = Typography;
const { RangePicker } = DatePicker;

function downloadBlob(blob: Blob, filename: string) {
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  window.URL.revokeObjectURL(url);
}

export default function AdminReportsPage() {
  const [donationDateRange, setDonationDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);
  const [expenseDateRange, setExpenseDateRange] = useState<[Dayjs | null, Dayjs | null] | null>(null);
  const [downloadingDonation, setDownloadingDonation] = useState<string | null>(null);
  const [downloadingExpense, setDownloadingExpense] = useState<string | null>(null);
  const [downloadingInventory, setDownloadingInventory] = useState<string | null>(null);

  const { data: fundSummary, isLoading: loadingSummary } = useQuery({
    queryKey: ["admin-fund-summary"],
    queryFn: () => fundApi.getSummary(),
  });

  const { data: inventorySummary, isLoading: loadingInventory } = useQuery({
    queryKey: ["admin-inventory-summary"],
    queryFn: () => inventoryApi.getSummary(),
  });

  const handleDonationExport = async (format: "csv" | "xlsx") => {
    try {
      setDownloadingDonation(format);
      const blob = await fundApi.exportReport({ format, type: "donations" });
      const ext = format === "xlsx" ? "xlsx" : "csv";
      downloadBlob(blob, `donations-report.${ext}`);
      message.success("Donation report downloaded");
    } catch {
      message.error("Failed to download donation report");
    } finally {
      setDownloadingDonation(null);
    }
  };

  const handleExpenseExport = async (format: "csv" | "xlsx") => {
    try {
      setDownloadingExpense(format);
      const blob = await fundApi.exportReport({ format, type: "expenses" });
      const ext = format === "xlsx" ? "xlsx" : "csv";
      downloadBlob(blob, `expenses-report.${ext}`);
      message.success("Expense report downloaded");
    } catch {
      message.error("Failed to download expense report");
    } finally {
      setDownloadingExpense(null);
    }
  };

  const handleInventoryExport = async (format: "csv" | "xlsx") => {
    try {
      setDownloadingInventory(format);
      const blob = await inventoryApi.exportReport({ format });
      const ext = format === "xlsx" ? "xlsx" : "csv";
      downloadBlob(blob, `inventory-report.${ext}`);
      message.success("Inventory report downloaded");
    } catch {
      message.error("Failed to download inventory report");
    } finally {
      setDownloadingInventory(null);
    }
  };

  return (
    <div>
      <Title level={3} style={{ marginBottom: 24 }}>Reports</Title>

      <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Donations"
              value={fundSummary?.total_donations ?? 0}
              prefix={<DollarOutlined />}
              precision={2}
              loading={loadingSummary}
              valueStyle={{ color: "#52c41a" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Total Expenses"
              value={fundSummary?.total_expenses ?? 0}
              prefix={<ShoppingOutlined />}
              precision={2}
              loading={loadingSummary}
              valueStyle={{ color: "#f5222d" }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={8}>
          <Card>
            <Statistic
              title="Inventory Items"
              value={inventorySummary?.total_items ?? 0}
              prefix={<InboxOutlined />}
              loading={loadingInventory}
              valueStyle={{ color: "#1677ff" }}
            />
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]}>
        <Col xs={24} lg={8}>
          <Card
            title="Donation Report"
            extra={<DollarOutlined style={{ color: "#52c41a" }} />}
          >
            <div style={{ marginBottom: 16 }}>
              <Text type="secondary">Select a date range (optional)</Text>
              <div style={{ marginTop: 8 }}>
                <RangePicker
                  style={{ width: "100%" }}
                  value={donationDateRange}
                  onChange={(dates) => setDonationDateRange(dates)}
                />
              </div>
            </div>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Button
                block
                icon={<DownloadOutlined />}
                loading={downloadingDonation === "csv"}
                onClick={() => handleDonationExport("csv")}
              >
                Download CSV
              </Button>
              <Button
                block
                type="primary"
                icon={<FileExcelOutlined />}
                loading={downloadingDonation === "xlsx"}
                onClick={() => handleDonationExport("xlsx")}
              >
                Download Excel
              </Button>
            </Space>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            title="Expense Report"
            extra={<ShoppingOutlined style={{ color: "#f5222d" }} />}
          >
            <div style={{ marginBottom: 16 }}>
              <Text type="secondary">Select a date range (optional)</Text>
              <div style={{ marginTop: 8 }}>
                <RangePicker
                  style={{ width: "100%" }}
                  value={expenseDateRange}
                  onChange={(dates) => setExpenseDateRange(dates)}
                />
              </div>
            </div>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Button
                block
                icon={<DownloadOutlined />}
                loading={downloadingExpense === "csv"}
                onClick={() => handleExpenseExport("csv")}
              >
                Download CSV
              </Button>
              <Button
                block
                type="primary"
                icon={<FileExcelOutlined />}
                loading={downloadingExpense === "xlsx"}
                onClick={() => handleExpenseExport("xlsx")}
              >
                Download Excel
              </Button>
            </Space>
          </Card>
        </Col>

        <Col xs={24} lg={8}>
          <Card
            title="Inventory Report"
            extra={<InboxOutlined style={{ color: "#1677ff" }} />}
          >
            <div style={{ marginBottom: 16 }}>
              <Text type="secondary">Export current inventory data</Text>
            </div>
            <Space direction="vertical" style={{ width: "100%" }}>
              <Button
                block
                icon={<DownloadOutlined />}
                loading={downloadingInventory === "csv"}
                onClick={() => handleInventoryExport("csv")}
              >
                Download CSV
              </Button>
              <Button
                block
                type="primary"
                icon={<FileExcelOutlined />}
                loading={downloadingInventory === "xlsx"}
                onClick={() => handleInventoryExport("xlsx")}
              >
                Download Excel
              </Button>
            </Space>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
