"use client";

import { useState } from "react";
import { Form, Input, Button, Card, message, Typography } from "antd";
import { UserOutlined, MailOutlined, LockOutlined, PhoneOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";
import type { RegisterRequest } from "@/lib/types";

const { Title } = Typography;

export default function RegisterPage() {
  const { register } = useAuth();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: any) => {
    setLoading(true);
    try {
      await register({ ...values, role: "volunteer" });
      message.success("Registration successful!");
    } catch (err: any) {
      message.error(err?.response?.data?.error?.message || "Registration failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        background: "#f5f5f5",
      }}
    >
      <Card style={{ width: 440 }} title={<Title level={3} style={{ margin: 0, textAlign: "center" }}>Register</Title>}>
        <Form layout="vertical" onFinish={onFinish} autoComplete="off">
          <Form.Item
            name="username"
            label="Username"
            rules={[{ required: true, message: "Please enter a username" }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Username" />
          </Form.Item>

          <Form.Item
            name="email"
            label="Email"
            rules={[
              { required: true, message: "Please enter your email" },
              { type: "email", message: "Please enter a valid email" },
            ]}
          >
            <Input prefix={<MailOutlined />} placeholder="Email" />
          </Form.Item>

          <Form.Item
            name="password"
            label="Password"
            rules={[
              { required: true, message: "Please enter a password" },
              { min: 6, message: "Password must be at least 6 characters" },
            ]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item name="phone" label="Phone (optional)">
            <Input prefix={<PhoneOutlined />} placeholder="Phone number" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Register
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: "center" }}>
          Already have an account? <Link href="/login">Login here</Link>
        </div>
      </Card>
    </div>
  );
}
