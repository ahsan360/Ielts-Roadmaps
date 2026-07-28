"use client";

import { useState } from "react";
import {
  Table,
  Tag,
  Button,
  Space,
  Input,
  Select,
  Popconfirm,
  Typography,
  Row,
  Col,
  message,
  Dropdown,
} from "antd";
import {
  CheckOutlined,
  DeleteOutlined,
  SearchOutlined,
  SwapOutlined,
} from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { crisisApi } from "@/lib/api/crisis";
import type { Crisis, CrisisStatus, Severity } from "@/lib/types";
import type { ColumnsType } from "antd/es/table";

const { Title } = Typography;

const severityColors: Record<string, string> = {
  low: "green",
  medium: "blue",
  high: "orange",
  critical: "red",
};

const statusColors: Record<string, string> = {
  pending: "default",
  approved: "processing",
  ongoing: "warning",
  resolved: "success",
};

export default function AdminCrisesPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [severityFilter, setSeverityFilter] = useState<string | undefined>();
  const [search, setSearch] = useState("");

  const queryKey = ["admin-crises", page, pageSize, statusFilter, severityFilter, search];

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: () =>
      crisisApi.listAdmin({
        page,
        limit: pageSize,
        status: statusFilter,
        severity: severityFilter,
        search: search || undefined,
      }),
  });

  const approveMutation = useMutation({
    mutationFn: (id: string) => crisisApi.approve(id),
    onSuccess: () => {
      message.success("Crisis approved successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-crises"] });
    },
    onError: () => {
      message.error("Failed to approve crisis");
    },
  });

  const changeStatusMutation = useMutation({
    mutationFn: ({ id, status }: { id: string; status: string }) => crisisApi.changeStatus(id, status),
    onSuccess: () => {
      message.success("Status updated successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-crises"] });
    },
    onError: () => {
      message.error("Failed to update status");
    },
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => crisisApi.delete(id),
    onSuccess: () => {
      message.success("Crisis deleted successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-crises"] });
    },
    onError: () => {
      message.error("Failed to delete crisis");
    },
  });

  const columns: ColumnsType<Crisis> = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      ellipsis: true,
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      ellipsis: true,
    },
    {
      title: "Severity",
      dataIndex: "severity",
      key: "severity",
      width: 100,
      render: (severity: Severity) => (
        <Tag color={severityColors[severity]}>{severity.toUpperCase()}</Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 110,
      render: (status: CrisisStatus) => (
        <Tag color={statusColors[status]}>{status.toUpperCase()}</Tag>
      ),
    },
    {
      title: "Reported By",
      dataIndex: "reported_by_name",
      key: "reported_by_name",
      ellipsis: true,
    },
    {
      title: "Date",
      dataIndex: "created_at",
      key: "created_at",
      width: 110,
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      width: 220,
      render: (_: unknown, record: Crisis) => (
        <Space size="small">
          {record.status === "pending" && (
            <Button
              type="primary"
              size="small"
              icon={<CheckOutlined />}
              loading={approveMutation.isPending}
              onClick={() => approveMutation.mutate(record.id)}
            >
              Approve
            </Button>
          )}
          {(record.status === "approved" || record.status === "ongoing") && (
            <Dropdown
              menu={{
                items: [
                  ...(record.status === "approved"
                    ? [{ key: "ongoing", label: "Set Ongoing" }]
                    : []),
                  { key: "resolved", label: "Set Resolved" },
                ],
                onClick: ({ key }) =>
                  changeStatusMutation.mutate({ id: record.id, status: key }),
              }}
              trigger={["click"]}
            >
              <Button size="small" icon={<SwapOutlined />}>
                Status
              </Button>
            </Dropdown>
          )}
          <Popconfirm
            title="Delete this crisis?"
            description="This action cannot be undone."
            onConfirm={() => deleteMutation.mutate(record.id)}
            okText="Delete"
            okButtonProps={{ danger: true }}
          >
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={3} style={{ marginBottom: 24 }}>Manage Crises</Title>

      <Row gutter={[12, 12]} style={{ marginBottom: 16 }}>
        <Col xs={24} sm={8} md={6}>
          <Select
            placeholder="Filter by status"
            allowClear
            style={{ width: "100%" }}
            value={statusFilter}
            onChange={(val) => {
              setStatusFilter(val);
              setPage(1);
            }}
            options={[
              { value: "pending", label: "Pending" },
              { value: "approved", label: "Approved" },
              { value: "ongoing", label: "Ongoing" },
              { value: "resolved", label: "Resolved" },
            ]}
          />
        </Col>
        <Col xs={24} sm={8} md={6}>
          <Select
            placeholder="Filter by severity"
            allowClear
            style={{ width: "100%" }}
            value={severityFilter}
            onChange={(val) => {
              setSeverityFilter(val);
              setPage(1);
            }}
            options={[
              { value: "low", label: "Low" },
              { value: "medium", label: "Medium" },
              { value: "high", label: "High" },
              { value: "critical", label: "Critical" },
            ]}
          />
        </Col>
        <Col xs={24} sm={8} md={6}>
          <Input
            placeholder="Search crises..."
            prefix={<SearchOutlined />}
            value={search}
            onChange={(e) => {
              setSearch(e.target.value);
              setPage(1);
            }}
            allowClear
          />
        </Col>
      </Row>

      <Table
        columns={columns}
        dataSource={data?.data ?? []}
        rowKey="id"
        loading={isLoading}
        pagination={{
          current: page,
          pageSize,
          total: data?.meta?.total ?? 0,
          showSizeChanger: true,
          showTotal: (total) => `Total ${total} crises`,
          onChange: (p, ps) => {
            setPage(p);
            setPageSize(ps);
          },
        }}
        scroll={{ x: 900 }}
      />
    </div>
  );
}
