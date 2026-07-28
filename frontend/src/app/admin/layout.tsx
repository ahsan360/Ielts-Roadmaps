"use client";

import { useState, useEffect } from "react";
import { useRouter, usePathname } from "next/navigation";
import { Layout, Menu, Button, Spin, Result, Typography, theme } from "antd";
import {
  DashboardOutlined,
  WarningOutlined,
  TeamOutlined,
  FileTextOutlined,
  LogoutOutlined,
  MenuFoldOutlined,
  MenuUnfoldOutlined,
  UserSwitchOutlined,
} from "@ant-design/icons";
import { useAuth } from "@/providers/AuthProvider";

const { Sider, Header, Content } = Layout;
const { Text } = Typography;

const menuItems = [
  { key: "/admin", icon: <DashboardOutlined />, label: "Dashboard" },
  { key: "/admin/crises", icon: <WarningOutlined />, label: "Crises" },
  { key: "/admin/volunteers", icon: <TeamOutlined />, label: "Volunteers" },
  { key: "/admin/users", icon: <UserSwitchOutlined />, label: "Users" },
  { key: "/admin/reports", icon: <FileTextOutlined />, label: "Reports" },
];

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const { user, isAdmin, loading, logout } = useAuth();
  const router = useRouter();
  const pathname = usePathname();
  const [collapsed, setCollapsed] = useState(false);
  const {
    token: { colorBgContainer, borderRadiusLG },
  } = theme.useToken();

  useEffect(() => {
    if (!loading && !isAdmin) {
      router.push("/login");
    }
  }, [loading, isAdmin, router]);

  if (loading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", height: "100vh" }}>
        <Spin size="large" tip="Loading..." />
      </div>
    );
  }

  if (!isAdmin) {
    return (
      <Result
        status="403"
        title="Access Denied"
        subTitle="You do not have permission to access the admin panel."
        extra={
          <Button type="primary" onClick={() => router.push("/login")}>
            Go to Login
          </Button>
        }
      />
    );
  }

  const selectedKey = menuItems
    .filter((item) => pathname.startsWith(item.key))
    .sort((a, b) => b.key.length - a.key.length)[0]?.key || "/admin";

  return (
    <Layout style={{ minHeight: "100vh" }}>
      <Sider
        collapsible
        collapsed={collapsed}
        onCollapse={setCollapsed}
        breakpoint="lg"
        style={{ overflow: "auto", height: "100vh", position: "fixed", left: 0, top: 0, bottom: 0 }}
      >
        <div
          style={{
            height: 48,
            margin: 16,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
          }}
        >
          <Text strong style={{ color: "#fff", fontSize: collapsed ? 14 : 18, whiteSpace: "nowrap" }}>
            {collapsed ? "DM" : "Disaster Mgmt"}
          </Text>
        </div>
        <Menu
          theme="dark"
          mode="inline"
          selectedKeys={[selectedKey]}
          items={menuItems}
          onClick={({ key }) => router.push(key)}
        />
      </Sider>
      <Layout style={{ marginLeft: collapsed ? 80 : 200, transition: "margin-left 0.2s" }}>
        <Header
          style={{
            padding: "0 24px",
            background: colorBgContainer,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            borderBottom: "1px solid #f0f0f0",
          }}
        >
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Button
              type="text"
              icon={collapsed ? <MenuUnfoldOutlined /> : <MenuFoldOutlined />}
              onClick={() => setCollapsed(!collapsed)}
            />
            <Text strong style={{ fontSize: 18 }}>Admin Panel</Text>
          </div>
          <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
            <Text>{user?.username} ({user?.email})</Text>
            <Button type="text" icon={<LogoutOutlined />} onClick={logout} danger>
              Logout
            </Button>
          </div>
        </Header>
        <Content
          style={{
            margin: 24,
            padding: 24,
            background: colorBgContainer,
            borderRadius: borderRadiusLG,
            minHeight: 360,
          }}
        >
          {children}
        </Content>
      </Layout>
    </Layout>
  );
}
