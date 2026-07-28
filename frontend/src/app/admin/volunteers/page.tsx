"use client";

import { useState } from "react";
import {
  Table,
  Tag,
  Badge,
  Button,
  Space,
  Input,
  Select,
  Modal,
  Form,
  Typography,
  Row,
  Col,
  message,
} from "antd";
import { SearchOutlined, UserSwitchOutlined, StopOutlined } from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { volunteerApi } from "@/lib/api/volunteer";
import type { Volunteer } from "@/lib/types";
import type { ColumnsType } from "antd/es/table";

const { Title } = Typography;

const statusBadgeMap: Record<string, "success" | "processing" | "default"> = {
  available: "success",
  assigned: "processing",
  inactive: "default",
};

export default function AdminVolunteersPage() {
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(10);
  const [statusFilter, setStatusFilter] = useState<string | undefined>();
  const [search, setSearch] = useState("");
  const [assignModalOpen, setAssignModalOpen] = useState(false);
  const [selectedVolunteer, setSelectedVolunteer] = useState<Volunteer | null>(null);
  const [form] = Form.useForm();

  const queryKey = ["admin-volunteers", page, pageSize, statusFilter, search];

  const { data, isLoading } = useQuery({
    queryKey,
    queryFn: () =>
      volunteerApi.list({
        page,
        limit: pageSize,
        status: statusFilter,
        search: search || undefined,
      }),
  });

  const assignMutation = useMutation({
    mutationFn: ({ id, data }: { id: string; data: { crisis_id: string; task: string } }) =>
      volunteerApi.assign(id, data),
    onSuccess: () => {
      message.success("Volunteer assigned successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-volunteers"] });
      setAssignModalOpen(false);
      setSelectedVolunteer(null);
      form.resetFields();
    },
    onError: () => {
      message.error("Failed to assign volunteer");
    },
  });

  const unassignMutation = useMutation({
    mutationFn: (id: string) => volunteerApi.unassign(id),
    onSuccess: () => {
      message.success("Volunteer unassigned successfully");
      queryClient.invalidateQueries({ queryKey: ["admin-volunteers"] });
    },
    onError: () => {
      message.error("Failed to unassign volunteer");
    },
  });

  const handleAssign = () => {
    form.validateFields().then((values) => {
      if (selectedVolunteer) {
        assignMutation.mutate({
          id: selectedVolunteer.id,
          data: { crisis_id: values.crisis_id, task: values.task },
        });
      }
    });
  };

  const columns: ColumnsType<Volunteer> = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      width: 140,
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      ellipsis: true,
    },
    {
      title: "Skills",
      dataIndex: "skills",
      key: "skills",
      render: (skills: string[]) => (
        <Space size={[0, 4]} wrap>
          {skills?.map((skill) => (
            <Tag key={skill} color="blue">
              {skill}
            </Tag>
          ))}
        </Space>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 110,
      render: (status: string) => (
        <Badge status={statusBadgeMap[status] ?? "default"} text={status.charAt(0).toUpperCase() + status.slice(1)} />
      ),
    },
    {
      title: "Assigned Task",
      dataIndex: "assigned_task",
      key: "assigned_task",
      ellipsis: true,
      render: (task: string | undefined) => task ?? "-",
    },
    {
      title: "Actions",
      key: "actions",
      width: 200,
      render: (_: unknown, record: Volunteer) => (
        <Space size="small">
          <Button
            size="small"
            type="primary"
            icon={<UserSwitchOutlined />}
            onClick={() => {
              setSelectedVolunteer(record);
              setAssignModalOpen(true);
            }}
          >
            Assign
          </Button>
          {record.status === "assigned" && (
            <Button
              size="small"
              danger
              icon={<StopOutlined />}
              loading={unassignMutation.isPending}
              onClick={() => unassignMutation.mutate(record.id)}
            >
              Unassign
            </Button>
          )}
        </Space>
      ),
    },
  ];

  return (
    <div>
      <Title level={3} style={{ marginBottom: 24 }}>Manage Volunteers</Title>

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
              { value: "available", label: "Available" },
              { value: "assigned", label: "Assigned" },
              { value: "inactive", label: "Inactive" },
            ]}
          />
        </Col>
        <Col xs={24} sm={8} md={6}>
          <Input
            placeholder="Search volunteers..."
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
          showTotal: (total) => `Total ${total} volunteers`,
          onChange: (p, ps) => {
            setPage(p);
            setPageSize(ps);
          },
        }}
        scroll={{ x: 900 }}
      />

      <Modal
        title={`Assign ${selectedVolunteer?.name ?? "Volunteer"}`}
        open={assignModalOpen}
        onOk={handleAssign}
        onCancel={() => {
          setAssignModalOpen(false);
          setSelectedVolunteer(null);
          form.resetFields();
        }}
        confirmLoading={assignMutation.isPending}
        okText="Assign"
      >
        <Form form={form} layout="vertical" style={{ marginTop: 16 }}>
          <Form.Item
            name="crisis_id"
            label="Crisis ID"
            rules={[{ required: true, message: "Please enter the crisis ID" }]}
          >
            <Input placeholder="Enter crisis ID to assign" />
          </Form.Item>
          <Form.Item
            name="task"
            label="Task Description"
            rules={[{ required: true, message: "Please enter a task description" }]}
          >
            <Input.TextArea rows={3} placeholder="Describe the task for this volunteer" />
          </Form.Item>
        </Form>
      </Modal>
    </div>
  );
}
