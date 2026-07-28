"use client";
import { useEffect, useState } from "react"; 
import { useQuery } from "@tanstack/react-query";
import {
  Card,
  Row,
  Col,
  Tag,
  Button,
  Select,
  Space,
  Spin,
  Pagination,
  Typography,
  Input,
} from "antd";
import { PlusOutlined, SearchOutlined, InfoCircleOutlined } from "@ant-design/icons"; 
import PublicLayout from "@/components/layout/PublicLayout";
import { crisisApi } from "@/lib/api/crisis";
import type { Crisis } from "@/lib/types";

const { Title } = Typography;

const severityColor: Record<string, string> = {
  low: "green",
  medium: "blue",
  high: "orange",
  critical: "red",
};

const statusColor: Record<string, string> = {
  pending: "default",
  approved: "processing",
  ongoing: "warning",
  resolved: "success",
};

export default function CrisisPage() {  
  const [showBanner, setShowBanner] = useState(false);

useEffect(() => {
  const params = new URLSearchParams(window.location.search);
  setShowBanner(params.get("reported") === "true");
}, []);
  const [page, setPage] = useState(1);
  const [filters, setFilters] = useState<{
    severity?: string;
    status?: string;
    search?: string;
  }>({});

  const { data, isLoading } = useQuery({
    queryKey: ["crises", page, filters],
    queryFn: () =>
      crisisApi.list({
        page,
        limit: 12,
        severity: filters.severity,
        status: filters.status,
        search: filters.search,
      }),
  });

  return (
    <PublicLayout>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <Row justify="space-between" align="middle" style={{ marginBottom: 24 }}>
          <Col>
            <Title level={2} style={{ margin: 0 }}>Crises</Title>
          </Col>
          <Col>
            <Button
              type="primary"
              icon={<PlusOutlined />}
              size="large"
              href="/crisis/report"
            >
              Report a Crisis
            </Button>
          </Col>
        </Row>

        {/* Success banner after submission */}
        {showBanner && (
          <div style={{
            marginBottom: 24,
            padding: "16px 24px",
            background: "linear-gradient(135deg, #f0f9ff, #e0f2fe)",
            border: "1px solid #bae6fd",
            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            gap: 12,
          }}>
            <InfoCircleOutlined style={{ fontSize: 24, color: "#0284c7" }} />
            <div>
              <div style={{ fontWeight: 600, color: "#0369a1", fontSize: 15 }}>
                Crisis Reported Successfully!
              </div>
              <div style={{ color: "#0c4a6e", fontSize: 13 }}>
                Your report has been submitted and is pending admin review. It will appear in the list once approved by an administrator.
              </div>
            </div>
            <Button type="text" size="small" onClick={() => setShowBanner(false)} style={{ marginLeft: "auto", color: "#0284c7" }}>
              Dismiss
            </Button>
          </div>
        )}

        {/* Filters */}
        <Row gutter={16} style={{ marginBottom: 24 }}>
          <Col xs={24} sm={8}>
            <Select
              placeholder="Filter by Severity"
              allowClear
              style={{ width: "100%" }}
              onChange={(val) => { setFilters((f) => ({ ...f, severity: val })); setPage(1); }}
            >
              <Select.Option value="low">Low</Select.Option>
              <Select.Option value="medium">Medium</Select.Option>
              <Select.Option value="high">High</Select.Option>
              <Select.Option value="critical">Critical</Select.Option>
            </Select>
          </Col>
          <Col xs={24} sm={8}>
            <Select
              placeholder="Filter by Status"
              allowClear
              style={{ width: "100%" }}
              onChange={(val) => { setFilters((f) => ({ ...f, status: val })); setPage(1); }}
            >
              <Select.Option value="approved">Approved</Select.Option>
              <Select.Option value="ongoing">Ongoing</Select.Option>
              <Select.Option value="resolved">Resolved</Select.Option>
            </Select>
          </Col>
          <Col xs={24} sm={8}>
            <Input
              placeholder="Search crises..."
              prefix={<SearchOutlined />}
              allowClear
              onChange={(e) => { setFilters((f) => ({ ...f, search: e.target.value })); setPage(1); }}
            />
          </Col>
        </Row>

        {/* Crisis List */}
        {isLoading ? (
          <div style={{ textAlign: "center", padding: 48 }}><Spin size="large" /></div>
        ) : (
          <>
            <Row gutter={[16, 16]}>
              {data?.data?.map((crisis: Crisis) => (
                <Col xs={24} sm={12} md={8} lg={6} key={crisis.id}>
                  <Card
                    hoverable
                    onClick={() => window.location.href = `/crisis/${crisis.id}`}
                    style={{ cursor: "pointer" }}
                    cover={
                      <div style={{ height: 160, overflow: "hidden" }}>
                        <img
                          src={
                            crisis.image_url ||
                            (crisis.title.toLowerCase().includes("flood")
                              ? "https://images.unsplash.com/photo-1547683905-f686c993aae5?w=400&h=200&fit=crop"
                              : crisis.title.toLowerCase().includes("earthquake")
                              ? "https://images.unsplash.com/photo-1573481078935-b9605167e06b?w=400&h=200&fit=crop"
                              : crisis.title.toLowerCase().includes("fire")
                              ? "https://images.unsplash.com/photo-1602524206684-fdf1ff697355?w=400&h=200&fit=crop"
                              : "https://images.unsplash.com/photo-1469571486292-0ba58a3f068b?w=400&h=200&fit=crop")
                          }
                          alt={crisis.title}
                          style={{ width: "100%", height: "100%", objectFit: "cover" }}
                        />
                      </div>
                    }
                  >
                    <Card.Meta title={crisis.title} description={crisis.location} />
                    <Space wrap style={{ marginTop: 12 }}>
                      <Tag color={severityColor[crisis.severity]}>{crisis.severity.toUpperCase()}</Tag>
                      <Tag color={statusColor[crisis.status]}>{crisis.status.toUpperCase()}</Tag>
                    </Space>
                    <p style={{ color: "#888", fontSize: 12, marginBottom: 0, marginTop: 8 }}>
                      {new Date(crisis.created_at).toLocaleDateString()}
                    </p>
                  </Card>
                </Col>
              ))}
            </Row>
            {data?.meta && (
              <div style={{ textAlign: "center", marginTop: 24 }}>
                <Pagination
                  current={page}
                  total={data.meta.total}
                  pageSize={data.meta.limit}
                  onChange={(p) => setPage(p)}
                  showSizeChanger={false}
                />
              </div>
            )}
          </>
        )}
      </div>
    </PublicLayout>
  );
}
