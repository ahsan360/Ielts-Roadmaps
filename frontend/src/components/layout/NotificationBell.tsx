"use client";

import { useState } from "react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Badge, Popover, List, Button, Empty, Spin } from "antd";
import { BellOutlined, CheckOutlined } from "@ant-design/icons";
import { notificationApi } from "@/lib/api/notification";
import type { Notification } from "@/lib/api/notification";
import { useAuth } from "@/providers/AuthProvider";

const typeIcons: Record<string, string> = {
  crisis_approved: "🔥",
  volunteer_assigned: "👤",
  donation_received: "💰",
  task_update: "📋",
  system: "🔔",
};

export default function NotificationBell() {
  const { isAuthenticated } = useAuth();
  const queryClient = useQueryClient();
  const [open, setOpen] = useState(false);

  const { data: countData } = useQuery({
    queryKey: ["notification-count"],
    queryFn: () => notificationApi.getUnreadCount(),
    enabled: isAuthenticated,
    refetchInterval: 30000, // Poll every 30s
  });

  const { data: notifData, isLoading } = useQuery({
    queryKey: ["notifications"],
    queryFn: () => notificationApi.list({ limit: 10 }),
    enabled: isAuthenticated && open,
  });

  const markReadMutation = useMutation({
    mutationFn: (id: string) => notificationApi.markAsRead(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notification-count"] });
    },
  });

  const markAllMutation = useMutation({
    mutationFn: () => notificationApi.markAllRead(),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["notifications"] });
      queryClient.invalidateQueries({ queryKey: ["notification-count"] });
    },
  });

  if (!isAuthenticated) return null;

  const unread = countData?.unread || 0;

  const content = (
    <div style={{ width: 340, maxHeight: 400, overflow: "auto" }}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "8px 12px", borderBottom: "1px solid #f0f0f0" }}>
        <span style={{ fontWeight: 600 }}>Notifications</span>
        {unread > 0 && (
          <Button type="link" size="small" onClick={() => markAllMutation.mutate()}>
            Mark all read
          </Button>
        )}
      </div>
      {isLoading ? (
        <div style={{ textAlign: "center", padding: 24 }}><Spin /></div>
      ) : notifData?.data?.length ? (
        <List
          dataSource={notifData.data}
          renderItem={(item: Notification) => (
            <List.Item
              style={{
                padding: "10px 12px", cursor: "pointer",
                background: item.is_read ? "transparent" : "#f0f9ff",
              }}
              onClick={() => !item.is_read && markReadMutation.mutate(item.id)}
            >
              <List.Item.Meta
                avatar={<span style={{ fontSize: 20 }}>{typeIcons[item.type] || "🔔"}</span>}
                title={<span style={{ fontSize: 13, fontWeight: item.is_read ? 400 : 600 }}>{item.title}</span>}
                description={
                  <div>
                    <div style={{ fontSize: 12, color: "#666" }}>{item.message}</div>
                    <div style={{ fontSize: 11, color: "#999", marginTop: 2 }}>
                      {new Date(item.created_at).toLocaleString()}
                    </div>
                  </div>
                }
              />
            </List.Item>
          )}
        />
      ) : (
        <Empty image={Empty.PRESENTED_IMAGE_SIMPLE} description="No notifications" style={{ padding: 24 }} />
      )}
    </div>
  );

  return (
    <Popover content={content} trigger="click" placement="bottomRight" open={open} onOpenChange={setOpen}>
      <Badge count={unread} size="small" offset={[-2, 2]}>
        <button className="p-2 rounded-lg transition-all cursor-pointer border-0 bg-transparent text-gray-400 hover:text-gray-600 hover:bg-gray-100">
          <BellOutlined style={{ fontSize: 20 }} />
        </button>
      </Badge>
    </Popover>
  );
}
