"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Card, Form, Input, Button, Spin, Typography, message, Tag } from "antd";
import { UserOutlined, ThunderboltOutlined, CheckCircleOutlined, PlayCircleOutlined, PlusCircleOutlined } from "@ant-design/icons";
import PublicLayout from "@/components/layout/PublicLayout";
import { useAuth } from "@/providers/AuthProvider";
import { authApi } from "@/lib/api/auth";
import { volunteerApi } from "@/lib/api/volunteer";

const { Title } = Typography;

export default function AccountPage() {
  const router = useRouter();
  const { user, loading, isAuthenticated } = useAuth();
  const [form] = Form.useForm();

  useEffect(() => {
    if (!loading && !isAuthenticated) {
      router.push("/login");
    }
  }, [loading, isAuthenticated, router]);

  useEffect(() => {
    if (user) {
      form.setFieldsValue({
        username: user.username,
        email: user.email,
        phone: user.phone || "",
      });
    }
  }, [user, form]);

  const updateMutation = useMutation({
    mutationFn: (values: { username: string; email: string; phone?: string }) =>
      authApi.updateMe(values),
    onSuccess: () => {
      message.success("Profile updated successfully!");
    },
    onError: (err: any) => {
      message.error(err?.response?.data?.error?.message || "Failed to update profile.");
    },
  });

  const onSave = (values: { username: string; email: string; phone?: string }) => {
    updateMutation.mutate(values);
  };

  if (loading) {
    return (
      <PublicLayout>
        <div style={{ textAlign: "center", padding: 48 }}>
          <Spin size="large" />
        </div>
      </PublicLayout>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <PublicLayout>
      <div style={{ maxWidth: 600, margin: "0 auto" }}>
        <Title level={2}><UserOutlined /> My Account</Title>

        <Card>
          <div style={{ marginBottom: 24 }}>
            <p><strong>Role:</strong> {user?.role}</p>
            <p><strong>Verified:</strong> {user?.is_verified ? "Yes" : "No"}</p>
            <p><strong>Member since:</strong> {user?.created_at ? new Date(user.created_at).toLocaleDateString() : "-"}</p>
          </div>

          <Form form={form} layout="vertical" onFinish={onSave}>
            <Form.Item
              name="username"
              label="Username"
              rules={[{ required: true, message: "Please enter a username" }]}
            >
              <Input placeholder="Username" />
            </Form.Item>
            <Form.Item
              name="email"
              label="Email"
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input placeholder="Email" />
            </Form.Item>
            <Form.Item name="phone" label="Phone">
              <Input placeholder="Phone number" />
            </Form.Item>
            <Form.Item>
              <Button type="primary" htmlType="submit" loading={updateMutation.isPending}>
                Save Changes
              </Button>
            </Form.Item>
          </Form>
        </Card>

        {user?.role === "volunteer" && <VolunteerTaskSection />}
      </div>
    </PublicLayout>
  );
}

function VolunteerTaskSection() {
  const queryClient = useQueryClient();
  const [taskNotes, setTaskNotes] = useState("");

  const { data: profile, isLoading } = useQuery({
    queryKey: ["volunteerProfile"],
    queryFn: () => volunteerApi.getMyProfile(),
  });

  const updateTaskMutation = useMutation({
    mutationFn: (data: { task_status: string; task_notes?: string }) =>
      volunteerApi.updateTask(data),
    onSuccess: () => {
      message.success("Task status updated!");
      setTaskNotes("");
      queryClient.invalidateQueries({ queryKey: ["volunteerProfile"] });
    },
    onError: (err: any) => {
      message.error(err?.response?.data?.error?.message || "Failed to update task status.");
    },
  });

  const handleUpdateStatus = (newStatus: string) => {
    updateTaskMutation.mutate({
      task_status: newStatus,
      ...(taskNotes.trim() ? { task_notes: taskNotes.trim() } : {}),
    });
  };

  if (isLoading) {
    return (
      <Card style={{ marginTop: 24 }}>
        <div style={{ textAlign: "center", padding: 24 }}>
          <Spin />
        </div>
      </Card>
    );
  }

  const taskStatus = profile?.task_status;
  const statusColorMap: Record<string, string> = {
    assigned: "blue",
    in_progress: "orange",
    completed: "green",
    requesting_new: "purple",
  };

  return (
    <Card style={{ marginTop: 24 }}>
      <Title level={4}><ThunderboltOutlined /> My Current Task</Title>

      <div style={{ marginBottom: 16 }}>
        <p>
          <strong>Assigned Task:</strong>{" "}
          {profile?.assigned_task || <span style={{ color: "#999" }}>No task assigned</span>}
        </p>
        <p>
          <strong>Task Status:</strong>{" "}
          {taskStatus ? (
            <Tag color={statusColorMap[taskStatus] || "default"}>
              {taskStatus.replace("_", " ")}
            </Tag>
          ) : (
            <span style={{ color: "#999" }}>N/A</span>
          )}
        </p>
      </div>

      <div style={{ marginBottom: 16 }}>
        <label style={{ display: "block", marginBottom: 8, fontWeight: 500 }}>Task Notes (optional):</label>
        <Input.TextArea
          rows={3}
          placeholder="Add notes about your task progress..."
          value={taskNotes}
          onChange={(e) => setTaskNotes(e.target.value)}
        />
      </div>

      <div style={{ display: "flex", gap: 12, flexWrap: "wrap" }}>
        {taskStatus === "assigned" && (
          <Button
            type="primary"
            icon={<PlayCircleOutlined />}
            loading={updateTaskMutation.isPending}
            onClick={() => handleUpdateStatus("in_progress")}
          >
            Start Task
          </Button>
        )}
        {taskStatus === "in_progress" && (
          <Button
            type="primary"
            style={{ backgroundColor: "#22c55e", borderColor: "#22c55e" }}
            icon={<CheckCircleOutlined />}
            loading={updateTaskMutation.isPending}
            onClick={() => handleUpdateStatus("completed")}
          >
            Complete Task
          </Button>
        )}
        {(taskStatus === "completed" || !taskStatus || !profile?.assigned_task) && (
          <Button
            type="primary"
            style={{ backgroundColor: "#8b5cf6", borderColor: "#8b5cf6" }}
            icon={<PlusCircleOutlined />}
            loading={updateTaskMutation.isPending}
            onClick={() => handleUpdateStatus("requesting_new")}
          >
            Request New Task
          </Button>
        )}
      </div>
    </Card>
  );
}
