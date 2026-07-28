"use client";

import { useQuery } from "@tanstack/react-query";
import { Timeline, Spin, Empty } from "antd";
import {
  CheckCircleOutlined,
  ExclamationCircleOutlined,
  EditOutlined,
  TeamOutlined,
  HeartOutlined,
  FileTextOutlined,
  ClockCircleOutlined,
} from "@ant-design/icons";
import { crisisApi } from "@/lib/api/crisis";

const actionConfig: Record<string, { color: string; icon: React.ReactNode }> = {
  created: { color: "blue", icon: <ExclamationCircleOutlined /> },
  approved: { color: "green", icon: <CheckCircleOutlined /> },
  status_changed: { color: "orange", icon: <EditOutlined /> },
  volunteer_assigned: { color: "purple", icon: <TeamOutlined /> },
  donation_received: { color: "gold", icon: <HeartOutlined /> },
  supply_dispatched: { color: "cyan", icon: <FileTextOutlined /> },
  note_added: { color: "gray", icon: <FileTextOutlined /> },
};

interface CrisisTimelineProps {
  crisisId: string;
}

export default function CrisisTimeline({ crisisId }: CrisisTimelineProps) {
  const { data, isLoading } = useQuery({
    queryKey: ["crisis-timeline", crisisId],
    queryFn: () => crisisApi.getTimeline(crisisId, { limit: 50 }),
  });

  if (isLoading) return <div style={{ textAlign: "center", padding: 24 }}><Spin /></div>;
  if (!data?.data?.length) return <Empty description="No activity yet" image={Empty.PRESENTED_IMAGE_SIMPLE} />;

  const items = data.data.map((log: any) => {
    const config = actionConfig[log.action] || { color: "gray", icon: <ClockCircleOutlined /> };
    return {
      color: config.color,
      dot: config.icon,
      children: (
        <div>
          <div style={{ fontWeight: 500, fontSize: 14 }}>{log.description}</div>
          <div style={{ fontSize: 12, color: "#999", marginTop: 2 }}>
            {log.actor_name && <span style={{ marginRight: 8 }}>by {log.actor_name}</span>}
            {new Date(log.created_at).toLocaleString()}
          </div>
        </div>
      ),
    };
  });

  return <Timeline items={items} />;
}
