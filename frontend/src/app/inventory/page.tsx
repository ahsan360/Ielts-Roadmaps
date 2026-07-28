"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import {
  Table,
  Tag,
  Button,
  Modal,
  Form,
  Input,
  InputNumber,
  Select,
  Row,
  Space,
  Spin,
  Typography,
  message,
} from "antd";
import { PlusOutlined, EditOutlined, AppstoreOutlined } from "@ant-design/icons";
import PublicLayout from "@/components/layout/PublicLayout";
import { useAuth } from "@/providers/AuthProvider";
import { inventoryApi } from "@/lib/api/inventory";
import type { InventoryItem } from "@/lib/types";

const { Title } = Typography;

const categoryColors: Record<string, string> = {
  food: "green",
  water: "blue",
  medicine: "red",
  shelter: "orange",
  clothing: "purple",
  equipment: "cyan",
};

const typeColors: Record<string, string> = {
  relief: "blue",
  expense: "volcano",
};

export default function InventoryPage() {
  const router = useRouter();
  const queryClient = useQueryClient();
  const { loading: authLoading, isAuthenticated } = useAuth();
  const [addForm] = Form.useForm();
  const [adjustForm] = Form.useForm();
  const [addModalOpen, setAddModalOpen] = useState(false);
  const [adjustModalOpen, setAdjustModalOpen] = useState(false);
  const [adjustingItem, setAdjustingItem] = useState<InventoryItem | null>(null);
  const [page, setPage] = useState(1);

  useEffect(() => {
    if (!authLoading && !isAuthenticated) {
      router.push("/login");
    }
  }, [authLoading, isAuthenticated, router]);

  const { data, isLoading } = useQuery({
    queryKey: ["inventory", page],
    queryFn: () => inventoryApi.list({ page, limit: 10 }),
    enabled: isAuthenticated,
  });

  const createMutation = useMutation({
    mutationFn: (values: { name: string; category: string; quantity: number; unit: string; type: string }) =>
      inventoryApi.create(values),
    onSuccess: () => {
      message.success("Item added successfully!");
      setAddModalOpen(false);
      addForm.resetFields();
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
    onError: (err: any) => {
      message.error(err?.response?.data?.error?.message || "Failed to add item.");
    },
  });

  const adjustMutation = useMutation({
    mutationFn: ({ id, adjustment }: { id: string; adjustment: number }) =>
      inventoryApi.adjustQuantity(id, adjustment),
    onSuccess: () => {
      message.success("Quantity adjusted successfully!");
      setAdjustModalOpen(false);
      setAdjustingItem(null);
      adjustForm.resetFields();
      queryClient.invalidateQueries({ queryKey: ["inventory"] });
    },
    onError: (err: any) => {
      message.error(err?.response?.data?.error?.message || "Failed to adjust quantity.");
    },
  });

  const handleAddSubmit = () => {
    addForm.validateFields().then((values) => {
      createMutation.mutate(values);
    });
  };

  const handleAdjustSubmit = () => {
    adjustForm.validateFields().then((values) => {
      if (adjustingItem) {
        adjustMutation.mutate({ id: adjustingItem.id, adjustment: values.adjustment });
      }
    });
  };

  const openAdjustModal = (item: InventoryItem) => {
    setAdjustingItem(item);
    adjustForm.resetFields();
    setAdjustModalOpen(true);
  };

  const columns = [
    {
      title: "Name",
      dataIndex: "name",
      key: "name",
    },
    {
      title: "Category",
      dataIndex: "category",
      key: "category",
      render: (val: string) => <Tag color={categoryColors[val] || "default"}>{val}</Tag>,
    },
    {
      title: "Quantity",
      dataIndex: "quantity",
      key: "quantity",
    },
    {
      title: "Unit",
      dataIndex: "unit",
      key: "unit",
    },
    {
      title: "Type",
      dataIndex: "type",
      key: "type",
      render: (val: string) => <Tag color={typeColors[val] || "default"}>{val}</Tag>,
    },
    {
      title: "Actions",
      key: "actions",
      render: (_: any, record: InventoryItem) => (
        <Button icon={<EditOutlined />} size="small" onClick={() => openAdjustModal(record)}>
          Adjust Qty
        </Button>
      ),
    },
  ];

  if (authLoading) {
    return (
      <PublicLayout>
        <div style={{ textAlign: "center", padding: 48 }}><Spin size="large" /></div>
      </PublicLayout>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  return (
    <PublicLayout>
      <div style={{ maxWidth: 1200, margin: "0 auto" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: 24 }}>
          <Title level={2} style={{ margin: 0 }}><AppstoreOutlined /> Inventory</Title>
          <Button type="primary" icon={<PlusOutlined />} onClick={() => setAddModalOpen(true)}>
            Add Item
          </Button>
        </div>

        <Table
          dataSource={data?.data || []}
          columns={columns}
          rowKey="id"
          loading={isLoading}
          pagination={{
            current: page,
            total: data?.meta?.total || 0,
            pageSize: data?.meta?.limit || 10,
            onChange: (p) => setPage(p),
            showSizeChanger: false,
          }}
        />

        {/* Add Item Modal */}
        <Modal
          title="Add Inventory Item"
          open={addModalOpen}
          onOk={handleAddSubmit}
          onCancel={() => { setAddModalOpen(false); addForm.resetFields(); }}
          confirmLoading={createMutation.isPending}
          okText="Add"
        >
          <Form form={addForm} layout="vertical">
            <Form.Item name="name" label="Name" rules={[{ required: true, message: "Please enter item name" }]}>
              <Input placeholder="Item name" />
            </Form.Item>
            <Form.Item name="category" label="Category" rules={[{ required: true, message: "Please select a category" }]}>
              <Select placeholder="Select category">
                <Select.Option value="food">Food</Select.Option>
                <Select.Option value="water">Water</Select.Option>
                <Select.Option value="medicine">Medicine</Select.Option>
                <Select.Option value="shelter">Shelter</Select.Option>
                <Select.Option value="clothing">Clothing</Select.Option>
                <Select.Option value="equipment">Equipment</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="quantity" label="Quantity" rules={[{ required: true, message: "Please enter quantity" }]}>
              <InputNumber min={0} style={{ width: "100%" }} placeholder="Quantity" />
            </Form.Item>
            <Form.Item name="unit" label="Unit" rules={[{ required: true, message: "Please select a unit" }]}>
              <Select placeholder="Select unit">
                <Select.Option value="pieces">Pieces</Select.Option>
                <Select.Option value="kg">Kg</Select.Option>
                <Select.Option value="liters">Liters</Select.Option>
                <Select.Option value="boxes">Boxes</Select.Option>
                <Select.Option value="packs">Packs</Select.Option>
              </Select>
            </Form.Item>
            <Form.Item name="type" label="Type" rules={[{ required: true, message: "Please select a type" }]}>
              <Select placeholder="Select type">
                <Select.Option value="relief">Relief</Select.Option>
                <Select.Option value="expense">Expense</Select.Option>
              </Select>
            </Form.Item>
          </Form>
        </Modal>

        {/* Adjust Quantity Modal */}
        <Modal
          title={`Adjust Quantity: ${adjustingItem?.name || ""}`}
          open={adjustModalOpen}
          onOk={handleAdjustSubmit}
          onCancel={() => { setAdjustModalOpen(false); setAdjustingItem(null); adjustForm.resetFields(); }}
          confirmLoading={adjustMutation.isPending}
          okText="Adjust"
        >
          <p>Current quantity: <strong>{adjustingItem?.quantity}</strong> {adjustingItem?.unit}</p>
          <Form form={adjustForm} layout="vertical">
            <Form.Item
              name="adjustment"
              label="Adjustment (use negative to decrease)"
              rules={[{ required: true, message: "Please enter adjustment value" }]}
            >
              <InputNumber style={{ width: "100%" }} placeholder="e.g. +10 or -5" />
            </Form.Item>
          </Form>
        </Modal>
      </div>
    </PublicLayout>
  );
}
