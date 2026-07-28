"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Card,
  Tag,
  Button,
  Input,
  Spin,
  Empty,
  Badge,
  Timeline,
  Statistic,
  message,
  Modal,
  Result,
} from "antd";
import {
  UserOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  ThunderboltOutlined,
  CheckCircleOutlined,
  ClockCircleOutlined,
  SyncOutlined,
  PlayCircleOutlined,
  PlusOutlined,
  ArrowRightOutlined,
  HeartOutlined,
  ToolOutlined,
  TeamOutlined,
} from "@ant-design/icons";
import { motion } from "framer-motion";
import AppHeader from "@/components/layout/AppHeader";
import AppFooter from "@/components/layout/AppFooter";
import { useAuth } from "@/providers/AuthProvider";
import { volunteerApi } from "@/lib/api/volunteer";
import { crisisApi } from "@/lib/api/crisis";
import type { Volunteer, Crisis } from "@/lib/types";

const { TextArea } = Input;

const taskStatusConfig: Record<string, { color: string; icon: React.ReactNode; label: string; tagColor: string }> = {
  assigned: { color: "text-blue-600", icon: <ClockCircleOutlined />, label: "Assigned — Waiting to Start", tagColor: "blue" },
  in_progress: { color: "text-orange-600", icon: <SyncOutlined spin />, label: "In Progress", tagColor: "orange" },
  completed: { color: "text-green-600", icon: <CheckCircleOutlined />, label: "Completed", tagColor: "green" },
  requesting_new: { color: "text-purple-600", icon: <PlusOutlined />, label: "Requesting New Task", tagColor: "purple" },
};

export default function VolunteerDashboard() {
  const { user, isAuthenticated, isVolunteer, loading: authLoading } = useAuth();
  const router = useRouter();
  const queryClient = useQueryClient();
  const [taskNotes, setTaskNotes] = useState("");
  const [updateModalOpen, setUpdateModalOpen] = useState(false);
  const [pendingAction, setPendingAction] = useState<string>("");

  const { data: profile, isLoading: profileLoading } = useQuery({
    queryKey: ["my-volunteer-profile"],
    queryFn: () => volunteerApi.getMyProfile(),
    enabled: isAuthenticated && isVolunteer,
    retry: false,
  });

  const { data: assignedCrisis } = useQuery({
    queryKey: ["assigned-crisis", profile?.assigned_crisis_id],
    queryFn: () => crisisApi.getById(profile!.assigned_crisis_id!),
    enabled: !!profile?.assigned_crisis_id,
  });

  const updateTaskMutation = useMutation({
    mutationFn: (data: { task_status: string; task_notes?: string }) => volunteerApi.updateTask(data),
    onSuccess: () => {
      message.success("Task updated successfully");
      setUpdateModalOpen(false);
      setTaskNotes("");
      queryClient.invalidateQueries({ queryKey: ["my-volunteer-profile"] });
    },
    onError: (err: any) => {
      message.error(err?.response?.data?.error?.message || "Failed to update task");
    },
  });

  const handleTaskAction = (action: string) => {
    setPendingAction(action);
    if (action === "completed" || action === "requesting_new") {
      setUpdateModalOpen(true); // Ask for notes
    } else {
      updateTaskMutation.mutate({ task_status: action });
    }
  };

  const confirmAction = () => {
    updateTaskMutation.mutate({
      task_status: pendingAction,
      task_notes: taskNotes || undefined,
    });
  };

  if (authLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <Spin size="large" />
      </div>
    );
  }

  if (!isAuthenticated) {
    router.push("/login");
    return null;
  }

  if (!isVolunteer) {
    return (
      <div className="min-h-screen bg-gray-50">
        <AppHeader />
        <div className="pt-24 max-w-xl mx-auto px-4">
          <Result
            status="info"
            title="Volunteer Dashboard"
            subTitle="This dashboard is for volunteers. You are logged in as admin."
            extra={<Button type="primary" onClick={() => router.push("/admin")}>Go to Admin Dashboard</Button>}
          />
        </div>
        <AppFooter />
      </div>
    );
  }

  const hasProfile = !!profile;
  const isAssigned = profile?.status === "assigned" && profile?.assigned_crisis_id;
  const taskStatus = profile?.task_status;
  const statusInfo = taskStatus ? taskStatusConfig[taskStatus] : null;

  return (
    <div className="min-h-screen bg-gray-50">
      <AppHeader />
      <div className="pt-20" />

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-8"
        >
          <h1 className="text-3xl font-bold text-gray-900">Welcome, {profile?.name || user?.username}</h1>
          <p className="text-gray-500 mt-1">Your volunteer dashboard — track tasks, update progress, and stay connected.</p>
        </motion.div>

        {!hasProfile && !profileLoading ? (
          /* No profile — prompt to create */
          <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }}>
            <Card className="text-center py-12">
              <TeamOutlined className="text-5xl text-blue-400 mb-4" />
              <h2 className="text-xl font-bold text-gray-900 mb-2">Create Your Volunteer Profile</h2>
              <p className="text-gray-500 mb-6">Set up your profile to get assigned to crises and start helping.</p>
              <Button type="primary" size="large" onClick={() => router.push("/account")}>
                Create Profile
              </Button>
            </Card>
          </motion.div>
        ) : profileLoading ? (
          <div className="text-center py-12"><Spin size="large" /></div>
        ) : (
          <>
            {/* Stats Row */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
              {[
                {
                  icon: <UserOutlined className="text-blue-500 text-xl" />,
                  label: "Status",
                  value: profile?.status || "—",
                  bg: "bg-blue-50",
                  render: (
                    <Badge
                      status={profile?.status === "available" ? "success" : profile?.status === "assigned" ? "processing" : "default"}
                      text={<span className="font-semibold capitalize">{profile?.status}</span>}
                    />
                  ),
                },
                {
                  icon: <ThunderboltOutlined className="text-orange-500 text-xl" />,
                  label: "Current Task",
                  value: taskStatus || "none",
                  bg: "bg-orange-50",
                  render: statusInfo ? (
                    <Tag color={statusInfo.tagColor} icon={statusInfo.icon}>{statusInfo.label}</Tag>
                  ) : (
                    <span className="text-gray-400">No task assigned</span>
                  ),
                },
                {
                  icon: <EnvironmentOutlined className="text-green-500 text-xl" />,
                  label: "Location",
                  value: profile?.location || "—",
                  bg: "bg-green-50",
                  render: <span className="font-medium text-gray-700 text-sm">{profile?.location}</span>,
                },
                {
                  icon: <ToolOutlined className="text-purple-500 text-xl" />,
                  label: "Skills",
                  value: profile?.skills?.length || 0,
                  bg: "bg-purple-50",
                  render: (
                    <div className="flex flex-wrap gap-1">
                      {profile?.skills?.slice(0, 3).map((s) => (
                        <Tag key={s} className="m-0 text-xs">{s.replace("_", " ")}</Tag>
                      ))}
                      {(profile?.skills?.length || 0) > 3 && <Tag className="m-0 text-xs">+{profile!.skills!.length - 3}</Tag>}
                    </div>
                  ),
                },
              ].map((stat, i) => (
                <motion.div
                  key={stat.label}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                >
                  <Card className="h-full">
                    <div className="flex items-start gap-3">
                      <div className={`w-10 h-10 rounded-xl ${stat.bg} flex items-center justify-center shrink-0`}>
                        {stat.icon}
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 font-medium uppercase">{stat.label}</div>
                        <div className="mt-1">{stat.render}</div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              ))}
            </div>

            <div className="grid lg:grid-cols-3 gap-6">
              {/* Main: Current Task */}
              <div className="lg:col-span-2 space-y-6">
                {/* Active Task Card */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
                  <Card
                    title={
                      <div className="flex items-center gap-2">
                        <ThunderboltOutlined className="text-orange-500" />
                        <span>Current Assignment</span>
                      </div>
                    }
                  >
                    {isAssigned && assignedCrisis ? (
                      <div>
                        {/* Crisis info */}
                        <div className="bg-gray-50 rounded-xl p-4 mb-4">
                          <div className="flex items-start justify-between">
                            <div>
                              <h3 className="font-bold text-gray-900 text-lg mb-1">{assignedCrisis.title}</h3>
                              <p className="text-gray-500 text-sm flex items-center gap-1">
                                <EnvironmentOutlined /> {assignedCrisis.location}
                              </p>
                            </div>
                            <Tag color={assignedCrisis.severity === "critical" ? "red" : assignedCrisis.severity === "high" ? "orange" : "blue"}>
                              {assignedCrisis.severity.toUpperCase()}
                            </Tag>
                          </div>
                        </div>

                        {/* Task details */}
                        <div className="mb-4">
                          <div className="text-sm text-gray-400 font-medium mb-1">Your Task</div>
                          <div className="text-base font-semibold text-gray-800">{profile?.assigned_task}</div>
                        </div>

                        {/* Task status */}
                        <div className="mb-4">
                          <div className="text-sm text-gray-400 font-medium mb-1">Task Status</div>
                          {statusInfo && (
                            <Tag color={statusInfo.tagColor} icon={statusInfo.icon} className="text-sm px-3 py-1">
                              {statusInfo.label}
                            </Tag>
                          )}
                        </div>

                        {/* Task notes */}
                        {profile?.task_notes && (
                          <div className="mb-4">
                            <div className="text-sm text-gray-400 font-medium mb-1">Your Notes</div>
                            <div className="bg-blue-50 rounded-lg p-3 text-sm text-blue-800">{profile.task_notes}</div>
                          </div>
                        )}

                        {/* Action Buttons */}
                        <div className="flex flex-wrap gap-3 pt-4 border-t border-gray-100">
                          {taskStatus === "assigned" && (
                            <Button
                              type="primary"
                              icon={<PlayCircleOutlined />}
                              size="large"
                              onClick={() => handleTaskAction("in_progress")}
                              loading={updateTaskMutation.isPending}
                            >
                              Start Task
                            </Button>
                          )}
                          {taskStatus === "in_progress" && (
                            <Button
                              type="primary"
                              icon={<CheckCircleOutlined />}
                              size="large"
                              style={{ background: "#16a34a" }}
                              onClick={() => handleTaskAction("completed")}
                              loading={updateTaskMutation.isPending}
                            >
                              Mark as Completed
                            </Button>
                          )}
                          {(taskStatus === "completed" || taskStatus === "requesting_new") && (
                            <Button
                              type="primary"
                              icon={<PlusOutlined />}
                              size="large"
                              style={{ background: "#7c3aed" }}
                              onClick={() => handleTaskAction("requesting_new")}
                              loading={updateTaskMutation.isPending}
                            >
                              Request New Task
                            </Button>
                          )}
                          <Button
                            onClick={() => router.push(`/crisis/${profile?.assigned_crisis_id}`)}
                            icon={<ArrowRightOutlined />}
                          >
                            View Crisis Details
                          </Button>
                        </div>
                      </div>
                    ) : (
                      /* No assignment */
                      <div className="text-center py-8">
                        <ClockCircleOutlined className="text-4xl text-gray-300 mb-4" />
                        <h3 className="text-lg font-semibold text-gray-600 mb-2">No Active Assignment</h3>
                        <p className="text-gray-400 mb-4">You are currently available. An admin will assign you to a crisis when help is needed.</p>
                        {taskStatus === "requesting_new" && (
                          <Tag color="purple" icon={<SyncOutlined />} className="text-sm px-3 py-1">
                            New task requested — waiting for admin
                          </Tag>
                        )}
                      </div>
                    )}
                  </Card>
                </motion.div>

                {/* Profile Summary */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.3 }}>
                  <Card
                    title="My Profile"
                    extra={<Button type="link" onClick={() => router.push("/account")}>Edit Profile</Button>}
                  >
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div>
                        <div className="text-xs text-gray-400 mb-1">Full Name</div>
                        <div className="font-medium">{profile?.name}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 mb-1">Age</div>
                        <div className="font-medium">{profile?.age || "—"}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 mb-1">Phone</div>
                        <div className="font-medium flex items-center gap-1"><PhoneOutlined /> {profile?.phone}</div>
                      </div>
                      <div>
                        <div className="text-xs text-gray-400 mb-1">Location</div>
                        <div className="font-medium flex items-center gap-1"><EnvironmentOutlined /> {profile?.location}</div>
                      </div>
                      <div className="sm:col-span-2">
                        <div className="text-xs text-gray-400 mb-1">Skills</div>
                        <div className="flex flex-wrap gap-1.5">
                          {profile?.skills?.map((s) => (
                            <Tag key={s} color="blue">{s.replace("_", " ")}</Tag>
                          ))}
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              </div>

              {/* Sidebar */}
              <div className="space-y-6">
                {/* Quick Actions */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.4 }}>
                  <Card title="Quick Actions">
                    <div className="space-y-3">
                      <Button block onClick={() => router.push("/crisis")} icon={<ThunderboltOutlined />}>
                        View Active Crises
                      </Button>
                      <Button block onClick={() => router.push("/donation")} icon={<HeartOutlined />}>
                        Donate to Relief Fund
                      </Button>
                      <Button block onClick={() => router.push("/inventory")} icon={<ToolOutlined />}>
                        Manage Inventory
                      </Button>
                      <Button block onClick={() => router.push("/account")} icon={<UserOutlined />}>
                        Edit My Profile
                      </Button>
                    </div>
                  </Card>
                </motion.div>

                {/* Task History */}
                <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.5 }}>
                  <Card title="Task Flow">
                    <Timeline
                      items={[
                        {
                          color: "blue",
                          children: (
                            <div>
                              <div className="font-medium text-sm">Admin Assigns Task</div>
                              <div className="text-xs text-gray-400">You get notified with task details</div>
                            </div>
                          ),
                        },
                        {
                          color: "orange",
                          children: (
                            <div>
                              <div className="font-medium text-sm">Start Task</div>
                              <div className="text-xs text-gray-400">Click &quot;Start Task&quot; when you begin</div>
                            </div>
                          ),
                        },
                        {
                          color: "green",
                          children: (
                            <div>
                              <div className="font-medium text-sm">Complete Task</div>
                              <div className="text-xs text-gray-400">Mark as done with your notes</div>
                            </div>
                          ),
                        },
                        {
                          color: "purple",
                          children: (
                            <div>
                              <div className="font-medium text-sm">Request New Task</div>
                              <div className="text-xs text-gray-400">Admin assigns you a new one</div>
                            </div>
                          ),
                        },
                      ]}
                    />
                  </Card>
                </motion.div>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Task Update Modal */}
      <Modal
        title={pendingAction === "completed" ? "Complete Task" : "Request New Task"}
        open={updateModalOpen}
        onOk={confirmAction}
        onCancel={() => { setUpdateModalOpen(false); setTaskNotes(""); }}
        confirmLoading={updateTaskMutation.isPending}
        okText={pendingAction === "completed" ? "Mark Completed" : "Send Request"}
      >
        <div className="py-2">
          <p className="text-gray-600 mb-3">
            {pendingAction === "completed"
              ? "Great work! Add any notes about what was accomplished:"
              : "Let the admin know you are ready for a new assignment:"}
          </p>
          <TextArea
            rows={4}
            placeholder={
              pendingAction === "completed"
                ? "e.g., Evacuated 150 people from sector 3. All medical supplies distributed."
                : "e.g., Task completed successfully. Ready for next assignment in the same area."
            }
            value={taskNotes}
            onChange={(e) => setTaskNotes(e.target.value)}
          />
        </div>
      </Modal>

      <AppFooter />
    </div>
  );
}
