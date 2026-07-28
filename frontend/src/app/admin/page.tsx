"use client";

import { Row, Col, Card, Statistic, Table, List, Typography, Button, Tag, Badge, Spin, Avatar } from "antd";
import {
  WarningOutlined,
  ClockCircleOutlined,
  DollarOutlined,
  TeamOutlined,
  ArrowRightOutlined,
  CheckCircleOutlined,
  UserOutlined,
  FileTextOutlined,
  SafetyCertificateOutlined,
  RiseOutlined,
  FallOutlined,
} from "@ant-design/icons";
import { useQuery } from "@tanstack/react-query";
import { useRouter } from "next/navigation";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
} from "recharts";
import { crisisApi } from "@/lib/api/crisis";
import { fundApi } from "@/lib/api/fund";
import { volunteerApi } from "@/lib/api/volunteer";
import type { Crisis, Volunteer } from "@/lib/types";

const { Title, Text } = Typography;

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

const PIE_COLORS: Record<string, string> = {
  low: "#52c41a",
  medium: "#1677ff",
  high: "#fa8c16",
  critical: "#f5222d",
};

export default function AdminDashboard() {
  const router = useRouter();

  const { data: crisisStats, isLoading: loadingCrisis } = useQuery({
    queryKey: ["admin-crisis-stats"],
    queryFn: () => crisisApi.getStats(),
  });

  const { data: donationTotal, isLoading: loadingDonation } = useQuery({
    queryKey: ["admin-donation-total"],
    queryFn: () => fundApi.getDonationTotal(),
  });

  const { data: volunteerStats, isLoading: loadingVolunteer } = useQuery({
    queryKey: ["admin-volunteer-stats"],
    queryFn: () => volunteerApi.getStats(),
  });

  const { data: recentCrises, isLoading: loadingRecent } = useQuery({
    queryKey: ["admin-recent-crises"],
    queryFn: () => crisisApi.listAdmin({ page: 1, limit: 5 }),
  });

  const { data: chartData, isLoading: loadingChart } = useQuery({
    queryKey: ["admin-chart-data"],
    queryFn: () => fundApi.getChartData(),
  });

  const { data: assignedVolunteers, isLoading: loadingAssigned } = useQuery({
    queryKey: ["admin-assigned-volunteers"],
    queryFn: () => volunteerApi.list({ status: "assigned", limit: 5 }),
  });

  const isLoading = loadingCrisis || loadingDonation || loadingVolunteer;

  if (isLoading) {
    return (
      <div style={{ display: "flex", justifyContent: "center", alignItems: "center", padding: 80, minHeight: 400 }}>
        <Spin size="large" />
      </div>
    );
  }

  // Prepare pie chart data from severity stats
  const severityPieData = crisisStats?.by_severity
    ? Object.entries(crisisStats.by_severity).map(([key, value]) => ({
        name: key.charAt(0).toUpperCase() + key.slice(1),
        value: value as number,
        key,
      }))
    : [];

  // Table columns for recent crises
  const crisisColumns = [
    {
      title: "Title",
      dataIndex: "title",
      key: "title",
      ellipsis: true,
      render: (text: string, record: Crisis) => (
        <a onClick={() => router.push(`/admin/crises`)} className="font-medium text-gray-800 hover:text-blue-600 cursor-pointer">
          {text}
        </a>
      ),
    },
    {
      title: "Location",
      dataIndex: "location",
      key: "location",
      ellipsis: true,
      responsive: ["md" as const],
      render: (text: string) => <Text type="secondary" className="text-sm">{text}</Text>,
    },
    {
      title: "Severity",
      dataIndex: "severity",
      key: "severity",
      width: 100,
      render: (severity: string) => (
        <Tag color={severityColors[severity]} className="uppercase text-xs font-semibold">
          {severity}
        </Tag>
      ),
    },
    {
      title: "Status",
      dataIndex: "status",
      key: "status",
      width: 110,
      render: (status: string) => (
        <Tag color={statusColors[status]}>{status}</Tag>
      ),
    },
    {
      title: "Date",
      dataIndex: "created_at",
      key: "created_at",
      width: 110,
      responsive: ["lg" as const],
      render: (date: string) => (
        <Text type="secondary" className="text-xs">
          {new Date(date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })}
        </Text>
      ),
    },
  ];

  return (
    <div>
      <div className="mb-6">
        <Title level={3} style={{ marginBottom: 4 }}>Dashboard</Title>
        <Text type="secondary">Overview of crisis management, donations, and volunteer activity</Text>
      </div>

      {/* Row 1: Stat Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm hover:shadow-md transition-shadow" bordered={false}>
            <Statistic
              title={<span className="text-gray-500 font-medium">Total Crises</span>}
              value={crisisStats?.total ?? 0}
              prefix={
                <div className="w-10 h-10 rounded-lg bg-blue-50 flex items-center justify-center mr-2">
                  <WarningOutlined style={{ color: "#1677ff", fontSize: 20 }} />
                </div>
              }
              valueStyle={{ color: "#1677ff", fontSize: 28, fontWeight: 700 }}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm hover:shadow-md transition-shadow" bordered={false}>
            <Statistic
              title={<span className="text-gray-500 font-medium">Pending Crises</span>}
              value={crisisStats?.by_status?.pending ?? 0}
              prefix={
                <div className="w-10 h-10 rounded-lg bg-amber-50 flex items-center justify-center mr-2">
                  <ClockCircleOutlined style={{ color: "#faad14", fontSize: 20 }} />
                </div>
              }
              valueStyle={{ color: "#faad14", fontSize: 28, fontWeight: 700 }}
            />
            {(crisisStats?.by_status?.pending ?? 0) > 0 && (
              <div className="mt-2">
                <Badge status="warning" text={<Text type="secondary" className="text-xs">Requires attention</Text>} />
              </div>
            )}
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm hover:shadow-md transition-shadow" bordered={false}>
            <Statistic
              title={<span className="text-gray-500 font-medium">Total Donations</span>}
              value={donationTotal?.total ?? 0}
              prefix={
                <div className="w-10 h-10 rounded-lg bg-green-50 flex items-center justify-center mr-2">
                  <DollarOutlined style={{ color: "#52c41a", fontSize: 20 }} />
                </div>
              }
              precision={2}
              valueStyle={{ color: "#52c41a", fontSize: 28, fontWeight: 700 }}
              suffix={<span className="text-sm text-gray-400 font-normal">BDT</span>}
            />
          </Card>
        </Col>
        <Col xs={24} sm={12} lg={6}>
          <Card className="shadow-sm hover:shadow-md transition-shadow" bordered={false}>
            <Statistic
              title={<span className="text-gray-500 font-medium">Active Volunteers</span>}
              value={volunteerStats?.active ?? volunteerStats?.total ?? 0}
              prefix={
                <div className="w-10 h-10 rounded-lg bg-purple-50 flex items-center justify-center mr-2">
                  <TeamOutlined style={{ color: "#722ed1", fontSize: 20 }} />
                </div>
              }
              valueStyle={{ color: "#722ed1", fontSize: 28, fontWeight: 700 }}
            />
          </Card>
        </Col>
      </Row>

      {/* Row 2: Charts */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={14}>
          <Card
            title={
              <span className="font-semibold text-gray-800 flex items-center gap-2">
                <RiseOutlined className="text-blue-500" /> Donations vs Expenses
              </span>
            }
            className="shadow-sm"
            bordered={false}
            loading={loadingChart}
          >
            <div style={{ width: "100%", height: 320 }}>
              {chartData && chartData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={chartData} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
                    <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
                    <XAxis
                      dataKey="period"
                      tick={{ fontSize: 12, fill: "#8c8c8c" }}
                      tickFormatter={(val: string) => {
                        const d = new Date(val);
                        return d.toLocaleDateString("en-US", { month: "short", day: "numeric" });
                      }}
                    />
                    <YAxis tick={{ fontSize: 12, fill: "#8c8c8c" }} />
                    <Tooltip
                      contentStyle={{ borderRadius: 8, border: "1px solid #f0f0f0", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
                      formatter={(value: number, name: string) => [
                        `BDT ${value.toLocaleString()}`,
                        name === "total_donations" ? "Donations" : "Expenses",
                      ]}
                      labelFormatter={(label: string) => {
                        const d = new Date(label);
                        return d.toLocaleDateString("en-US", { month: "long", day: "numeric", year: "numeric" });
                      }}
                    />
                    <Legend
                      formatter={(value: string) => (value === "total_donations" ? "Donations" : "Expenses")}
                    />
                    <Bar dataKey="total_donations" fill="#52c41a" radius={[4, 4, 0, 0]} maxBarSize={40} />
                    <Bar dataKey="total_expenses" fill="#f5222d" radius={[4, 4, 0, 0]} maxBarSize={40} />
                  </BarChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <div className="text-center">
                    <FallOutlined style={{ fontSize: 40, marginBottom: 12 }} />
                    <div>No chart data available yet</div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card
            title={
              <span className="font-semibold text-gray-800 flex items-center gap-2">
                <WarningOutlined className="text-orange-500" /> Crisis by Severity
              </span>
            }
            className="shadow-sm"
            bordered={false}
          >
            <div style={{ width: "100%", height: 320 }}>
              {severityPieData.length > 0 ? (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={severityPieData}
                      cx="50%"
                      cy="50%"
                      innerRadius={60}
                      outerRadius={100}
                      paddingAngle={4}
                      dataKey="value"
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    >
                      {severityPieData.map((entry) => (
                        <Cell key={entry.key} fill={PIE_COLORS[entry.key] || "#8884d8"} />
                      ))}
                    </Pie>
                    <Tooltip
                      contentStyle={{ borderRadius: 8, border: "1px solid #f0f0f0", boxShadow: "0 2px 8px rgba(0,0,0,0.1)" }}
                      formatter={(value: number, name: string) => [`${value} crises`, name]}
                    />
                    <Legend />
                  </PieChart>
                </ResponsiveContainer>
              ) : (
                <div className="flex items-center justify-center h-full text-gray-400">
                  <div className="text-center">
                    <WarningOutlined style={{ fontSize: 40, marginBottom: 12 }} />
                    <div>No crisis data available yet</div>
                  </div>
                </div>
              )}
            </div>
          </Card>
        </Col>
      </Row>

      {/* Row 3: Recent Crises & Volunteers */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} lg={14}>
          <Card
            title={
              <span className="font-semibold text-gray-800 flex items-center gap-2">
                <ClockCircleOutlined className="text-blue-500" /> Recent Crises
              </span>
            }
            className="shadow-sm"
            bordered={false}
            extra={
              <Button type="link" size="small" onClick={() => router.push("/admin/crises")}>
                View All <ArrowRightOutlined />
              </Button>
            }
            loading={loadingRecent}
          >
            <Table
              dataSource={recentCrises?.data ?? []}
              columns={crisisColumns}
              rowKey="id"
              pagination={false}
              size="small"
              locale={{ emptyText: "No crises reported yet." }}
            />
          </Card>
        </Col>
        <Col xs={24} lg={10}>
          <Card
            title={
              <span className="font-semibold text-gray-800 flex items-center gap-2">
                <TeamOutlined className="text-purple-500" /> Assigned Volunteers
              </span>
            }
            className="shadow-sm"
            bordered={false}
            extra={
              <Button type="link" size="small" onClick={() => router.push("/admin/volunteers")}>
                Manage <ArrowRightOutlined />
              </Button>
            }
            loading={loadingAssigned}
          >
            <List
              dataSource={assignedVolunteers?.data ?? []}
              renderItem={(volunteer: Volunteer) => (
                <List.Item
                  actions={[
                    <Button
                      key="assign"
                      type="link"
                      size="small"
                      onClick={() => router.push("/admin/volunteers")}
                    >
                      Assign New Task
                    </Button>,
                  ]}
                >
                  <List.Item.Meta
                    avatar={
                      <Avatar
                        style={{ backgroundColor: "#722ed1" }}
                        icon={<UserOutlined />}
                      />
                    }
                    title={<span className="font-medium">{volunteer.name}</span>}
                    description={
                      <div>
                        <Text type="secondary" className="text-xs block">
                          {volunteer.assigned_task || "No task assigned"}
                        </Text>
                        <div className="mt-1">
                          {volunteer.skills?.slice(0, 2).map((skill) => (
                            <Tag key={skill} className="text-xs" color="purple">
                              {skill}
                            </Tag>
                          ))}
                        </div>
                      </div>
                    }
                  />
                </List.Item>
              )}
              locale={{ emptyText: "No assigned volunteers." }}
            />
          </Card>
        </Col>
      </Row>

      {/* Row 4: Quick Actions */}
      <Row gutter={[16, 16]}>
        <Col xs={24}>
          <Card
            title={
              <span className="font-semibold text-gray-800 flex items-center gap-2">
                <ArrowRightOutlined className="text-green-500" /> Quick Actions
              </span>
            }
            className="shadow-sm"
            bordered={false}
          >
            <Row gutter={[16, 16]}>
              <Col xs={24} sm={12} md={6}>
                <Card
                  hoverable
                  className="text-center border-blue-100 hover:border-blue-300 transition-colors"
                  onClick={() => router.push("/admin/crises")}
                >
                  <CheckCircleOutlined style={{ fontSize: 32, color: "#1677ff", marginBottom: 12 }} />
                  <div className="font-semibold text-gray-800">Approve Crises</div>
                  <Text type="secondary" className="text-xs">Review pending crisis reports</Text>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card
                  hoverable
                  className="text-center border-purple-100 hover:border-purple-300 transition-colors"
                  onClick={() => router.push("/admin/volunteers")}
                >
                  <TeamOutlined style={{ fontSize: 32, color: "#722ed1", marginBottom: 12 }} />
                  <div className="font-semibold text-gray-800">Manage Volunteers</div>
                  <Text type="secondary" className="text-xs">Assign tasks and manage team</Text>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card
                  hoverable
                  className="text-center border-green-100 hover:border-green-300 transition-colors"
                  onClick={() => router.push("/admin/users")}
                >
                  <SafetyCertificateOutlined style={{ fontSize: 32, color: "#52c41a", marginBottom: 12 }} />
                  <div className="font-semibold text-gray-800">Manage Users</div>
                  <Text type="secondary" className="text-xs">User accounts and roles</Text>
                </Card>
              </Col>
              <Col xs={24} sm={12} md={6}>
                <Card
                  hoverable
                  className="text-center border-orange-100 hover:border-orange-300 transition-colors"
                  onClick={() => router.push("/admin/reports")}
                >
                  <FileTextOutlined style={{ fontSize: 32, color: "#fa8c16", marginBottom: 12 }} />
                  <div className="font-semibold text-gray-800">Export Reports</div>
                  <Text type="secondary" className="text-xs">Download donation and expense reports</Text>
                </Card>
              </Col>
            </Row>
          </Card>
        </Col>
      </Row>
    </div>
  );
}
