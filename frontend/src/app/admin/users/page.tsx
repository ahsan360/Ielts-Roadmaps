"use client";

import { useState } from "react";
import {
  Table,
  Tag,
  Button,
  Space,
  Input,
  Select,
  Typography,
  Popconfirm,
  message,
  Badge,
} from "antd";
import {
  SearchOutlined,
  CheckOutlined,
  ArrowUpOutlined,
  ArrowDownOutlined,
} from "@ant-design/icons";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { authApi } from "@/lib/api/auth";
import { useAuth } from "@/providers/AuthProvider";
import type { User } from "@/lib/types";
import type { ColumnsType } from "antd/es/table";

const { Title } = Typography;

export default function AdminUsersPage() {
  const { user: currentUser } = useAuth();
  const queryClient = useQueryClient();
  const [page, setPage] = useState(1);
  const [roleFilter, setRoleFilter] = useState<string | undefined>();
  const [search, setSearch] = useState("");

  const { data, isLoading } = useQuery({
    queryKey: ["admin-users", page, roleFilter, search],
    queryFn: () =>
      authApi.listUsers({
        page,
        limit: 10,
        role: roleFilter,
        search: search || undefined,
      }),
  });

  const verifyMutation = useMutation({
    mutationFn: (userId: string) => authApi.verifyUser(userId),
    onSuccess: () => {
      message.success("User verified");
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: () => message.error("Failed to verify user"),
  });

  const changeRoleMutation = useMutation({
    mutationFn: ({ userId, role }: { userId: string; role: "admin" | "volunteer" }) =>
      authApi.changeRole(userId, role),
    onSuccess: (_, { role }) => {
      message.success(`User role changed to ${role}`);
      queryClient.invalidateQueries({ queryKey: ["admin-users"] });
    },
    onError: (err: any) =>
      message.error(err?.response?.data?.error?.message || "Failed to change role"),
  });

  const columns: ColumnsType<User> = [
    {
      title: "Username",
      dataIndex: "username",
      key: "username",
      render: (username: string, record: User) => (
        <Space>
          <span className="font-semibold">{username}</span>
          {record.id === currentUser?.id && (
            <Tag color="blue">You</Tag>
          )}
        </Space>
      ),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
    },
    {
      title: "Phone",
      dataIndex: "phone",
      key: "phone",
      render: (phone: string) => phone || "—",
    },
    {
      title: "Role",
      dataIndex: "role",
      key: "role",
      width: 120,
      render: (role: string) => (
        <Tag color={role === "admin" ? "red" : "blue"} style={{ fontWeight: 600 }}>
          {role.toUpperCase()}
        </Tag>
      ),
    },
    {
      title: "Verified",
      dataIndex: "is_verified",
      key: "is_verified",
      width: 100,
      render: (verified: boolean) => (
        <Badge status={verified ? "success" : "warning"} text={verified ? "Yes" : "No"} />
      ),
    },
    {
      title: "Joined",
      dataIndex: "created_at",
      key: "created_at",
      width: 120,
      render: (date: string) => new Date(date).toLocaleDateString(),
    },
    {
      title: "Actions",
      key: "actions",
      width: 260,
      render: (_: unknown, record: User) => {
        const isSelf = record.id === currentUser?.id;
        return (
          <Space size="small">
            {!record.is_verified && (
              <Button
                size="small"
                type="primary"
                ghost
                icon={<CheckOutlined />}
                onClick={() => verifyMutation.mutate(record.id)}
              >
                Verify
              </Button>
            )}
            {record.role === "volunteer" && (
              <Popconfirm
                title="Promote to Admin?"
                description={`This will give ${record.username} full admin access.`}
                onConfirm={() =>
                  changeRoleMutation.mutate({ userId: record.id, role: "admin" })
                }
                okText="Yes, promote"
              >
                <Button size="small" type="primary" icon={<ArrowUpOutlined />}>
                  Make Admin
                </Button>
              </Popconfirm>
            )}
            {record.role === "admin" && !isSelf && (
              <Popconfirm
                title="Demote to Volunteer?"
                description={`This will remove admin access from ${record.username}.`}
                onConfirm={() =>
                  changeRoleMutation.mutate({ userId: record.id, role: "volunteer" })
                }
                okText="Yes, demote"
                okButtonProps={{ danger: true }}
              >
                <Button size="small" danger icon={<ArrowDownOutlined />}>
                  Demote
                </Button>
              </Popconfirm>
            )}
          </Space>
        );
      },
    },
  ];

  return (
    <div>
      <Title level={3} style={{ marginBottom: 24 }}>Manage Users</Title>

      <div style={{ display: "flex", gap: 12, marginBottom: 16, flexWrap: "wrap" }}>
        <Select
          placeholder="Filter by role"
          allowClear
          style={{ width: 160 }}
          value={roleFilter}
          onChange={(val) => { setRoleFilter(val); setPage(1); }}
          options={[
            { value: "admin", label: "Admins" },
            { value: "volunteer", label: "Volunteers" },
          ]}
        />
        <Input
          placeholder="Search by name or email..."
          prefix={<SearchOutlined />}
          allowClear
          style={{ maxWidth: 300 }}
          onChange={(e) => { setSearch(e.target.value); setPage(1); }}
        />
      </div>

      <Table
        columns={columns}
        dataSource={data?.data || []}
        rowKey="id"
        loading={isLoading}
        pagination={{
          current: page,
          total: data?.meta?.total || 0,
          pageSize: 10,
          onChange: (p) => setPage(p),
          showSizeChanger: false,
        }}
      />
    </div>
  );
}
