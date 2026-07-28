"use client";

import { useState } from "react";
import { Form, Input, Button, Card, message, Typography } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import Link from "next/link";
import { useAuth } from "@/providers/AuthProvider";
import type { LoginRequest } from "@/lib/types";

const { Title } = Typography;

export default function LoginPage() {
  const { login } = useAuth();
  const [loading, setLoading] = useState(false);

  const onFinish = async (values: LoginRequest) => {
    setLoading(true);
    try {
      await login(values);
      message.success("Login successful!");
    } catch (err: any) {
      message.error(err?.response?.data?.error?.message || "Login failed. Please try again.");
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
      <Card style={{ width: 400 }} title={<Title level={3} style={{ margin: 0, textAlign: "center" }}>Login</Title>}>
        <Form layout="vertical" onFinish={onFinish} autoComplete="off">
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
            rules={[{ required: true, message: "Please enter your password" }]}
          >
            <Input.Password prefix={<LockOutlined />} placeholder="Password" />
          </Form.Item>

          <Form.Item>
            <Button type="primary" htmlType="submit" loading={loading} block>
              Log In
            </Button>
          </Form.Item>
        </Form>

        <div style={{ textAlign: "center" }}>
          Don&apos;t have an account? <Link href="/register">Register here</Link>
        </div>
      </Card>
    </div>
  );
}
