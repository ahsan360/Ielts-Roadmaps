"use client";

import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Table, Tag, Badge, Select, Input, Row, Col, Typography, Spin } from "antd";
import { SearchOutlined, TeamOutlined } from "@ant-design/icons";
import PublicLayout from "@/components/layout/PublicLayout";
import { volunteerApi } from "@/lib/api/volunteer";
import type { Volunteer } from "@/lib/types";

const { Title } = Typography;

const volunteerStatusMap: Record<string, "success" | "processing" | "default"> = {
  available: "success",
  assigned: "processing",
  inactive: "default",
};

export default function VolunteerPage() {
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<{ status?: string; search?: string }>({});

  const { data, isLoading } = useQuery({
    queryKey: ["volunteers", page, filters],
    queryFn: () =>
      volunteerApi.list({
        page,
        limit: 10,
        status: filters.status,
        search: filters.search,
      }),
  });

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Age",
      dataIndex: "age",
      key: "age",
      render: (val: number | undefined) => val ?? "-",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
    },
    {
      title: "Skills",
      dataIndex: "skills",
      key: "skills",
      render: (skills: string[]) => (
        <>
          {skills?.map((skill) => (
            <Tag color="blue" key={skill}>{skill}</Tag>
          ))}
        </>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      render: (status: string) => (
        <Badge status={volunteerStatusMap[status] || "default"} text={status} />
      ),
    },
    {
      title: "Assigned Task",
      dataIndex: "assigned_task",
      key: "assigned_task",
      render: (val: string | undefined) => val || "-",
    },
    {
      title: "Task Status",
      dataIndex: "task_status",
      key: "task_status",
      render: (val: string | undefined) => {
        if (!val) return "-";
        const colorMap: Record<string, string> = {
          assigned: "blue",
          in_progress: "orange",
          completed: "green",
          requesting_new: "purple",
        };
        return <Tag color={colorMap[val] || "default"}>{val.replace("_", " ")}</Tag>;
      },
    },
  ];

  return (
    <PublicLayout>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Title level={2}><TeamOutlined /> Volunteers</Title>

        {/* Filters */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={8}>
            <Select
              placeholder="Filter by Status"
              allowClear
              style={{ width: "100%" }}
              onChange={(val) => { setFilters((f) => ({ ...f, status: val })); setPage(1); }}
            >
              <Select.Option value="available">Available</Select.Option>
              <Select.Option value="assigned">Assigned</Select.Option>
              <Select.Option value="inactive">Inactive</Select.Option>
            </Select>
          </Col>
          <Col xs={24} sm={8}>
            <Input
              placeholder="Search volunteers..."
              prefix={<SearchOutlined />}
              allowClear
              onChange={(e) => { setFilters((f) => ({ ...f, search: e.target.value })); setPage(1); }}
            />
          </Col>
        </Row>

        <Table
          dataSource={data?.data || []}
          columns={columns}
          rowKey="id"
          loading={isLoading}
          pagination={{
            current: page,
            total: data?.meta?.total || 0,
            pageSize: data?.meta?.limit || 10,
            onChange: (p) => setPage(p),
            showSizeChanger: false,
          }}
        />
      </div>
    </PublicLayout>
  );
}
