import React, { useState } from 'react';
import {
  Row,
  Col,
  Card,
  Button,
  Tag,
  Typography,
  Modal,
  Form,
  Input,
  InputNumber,
  Space,
  Popconfirm,
  message,
  Badge,
} from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import {
  PlusOutlined,
  DollarCircleOutlined,
  CheckOutlined,
  DeleteOutlined,
  EditOutlined,
  ThunderboltFilled,
} from '@ant-design/icons';
import { useTheme } from '../theme/ThemeContext';
import { addPlan, deletePlan } from '../redux/slices/gymSlice';

const { Title, Text, Paragraph } = Typography;

export const Plans = () => {
  const dispatch = useDispatch();
  const { isDarkMode } = useTheme();
  const { plans } = useSelector((state) => state.gym);

  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [form] = Form.useForm();

  const handleAddPlan = (values) => {
    const newPlan = {
      id: `plan_${Date.now()}`,
      name: values.name,
      duration: values.duration,
      price: Number(values.price),
      activeSubscribers: 0,
      badge: values.badge || 'New Tier',
      description: values.description,
    };
    dispatch(addPlan(newPlan));
    message.success(`Plan "${values.name}" created and synced with the member mobile app!`);
    setIsAddModalOpen(false);
    form.resetFields();
  };

  const handleDeletePlan = (id) => {
    dispatch(deletePlan(id));
    message.info('Membership plan removed.');
  };

  return (
    <div>
      {/* Header */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
          marginBottom: 28,
        }}
      >
        <div>
          <Title level={2} style={{ margin: 0, color: isDarkMode ? '#ffffff' : '#0f172a', fontWeight: 650 }}>
            Membership Plans & Pricing
          </Title>
          <Text style={{ color: isDarkMode ? '#888888' : '#64748b', fontSize: 14 }}>
            Configure gym pass tariffs and membership subscription durations.
          </Text>
        </div>

        <Button
          type="primary"
          icon={<PlusOutlined />}
          onClick={() => setIsAddModalOpen(true)}
          style={{
            backgroundColor: '#003882',
            borderColor: '#003882',
            fontWeight: 700,
            borderRadius: 'var(--radius-base)',
            height: 42,
          }}
        >
          Create New Plan
        </Button>
      </div>

      {/* Plans Grid */}
      <Row gutter={[24, 24]}>
        {plans.map((plan) => (
          <Col xs={24} sm={12} lg={8} key={plan.id}>
            <Card
              style={{
                height: '100%',
                display: 'flex',
                flexDirection: 'column',
                justifyContent: 'space-between',
                backgroundColor: isDarkMode ? '#0d0d0d' : '#ffffff',
                borderColor: isDarkMode ? '#222222' : '#e2e8f0',
                borderRadius: 'var(--radius-base)',
                position: 'relative',
              }}
            >
              <div>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: 12 }}>
                  <Tag color="blue" style={{ fontWeight: 700, borderRadius: 6, fontSize: 12 }}>
                    {plan.badge}
                  </Tag>
                  <Popconfirm
                    title="Delete Plan"
                    description="Remove this plan from public member listings?"
                    onConfirm={() => handleDeletePlan(plan.id)}
                    okText="Yes"
                    cancelText="No"
                  >
                    <Button type="text" danger size="small" icon={<DeleteOutlined />} />
                  </Popconfirm>
                </div>

                <h3 style={{ fontSize: 18, fontWeight: 800, color: isDarkMode ? '#ffffff' : '#0f172a', marginBottom: 6 }}>
                  {plan.name}
                </h3>
                <Paragraph style={{ color: isDarkMode ? '#888888' : '#64748b', fontSize: 13, marginBottom: 16 }}>
                  {plan.description}
                </Paragraph>

                <div style={{ display: 'flex', alignItems: 'baseline', gap: 6, marginBottom: 16 }}>
                  <span style={{ fontSize: 32, fontWeight: 900, color: '#1677ff' }}>
                    ₹{plan.price}
                  </span>
                  <span style={{ fontSize: 13, color: isDarkMode ? '#888888' : '#64748b' }}>
                    / {plan.duration}
                  </span>
                </div>
              </div>

              <div
                style={{
                  borderTop: `1px solid ${isDarkMode ? '#1e1e1e' : '#e2e8f0'}`,
                  paddingTop: 14,
                  marginTop: 10,
                  display: 'flex',
                  justifyContent: 'space-between',
                  alignItems: 'center',
                }}
              >
                <div style={{ fontSize: 12, color: isDarkMode ? '#888888' : '#64748b' }}>
                  Active Subscribers:
                </div>
                <Tag color="cyan" style={{ fontWeight: 700, borderRadius: 6 }}>
                  {plan.activeSubscribers} Members
                </Tag>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* CREATE PLAN MODAL */}
      <Modal
        title="Create Membership Plan"
        open={isAddModalOpen}
        onCancel={() => setIsAddModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleAddPlan}>
          <Form.Item
            label="Plan Name"
            name="name"
            rules={[{ required: true, message: 'Please enter plan name' }]}
          >
            <Input placeholder="e.g. Student 6-Month Pass" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Duration"
                name="duration"
                rules={[{ required: true, message: 'Please enter duration' }]}
              >
                <Input placeholder="e.g. 180 Days / 6 Months" />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Price (₹ INR)"
                name="price"
                rules={[{ required: true, message: 'Please enter price' }]}
              >
                <InputNumber style={{ width: '100%' }} min={1} placeholder="e.g. 4999" />
              </Form.Item>
            </Col>
          </Row>

          <Form.Item label="Highlight Badge" name="badge" initialValue="Popular Offer">
            <Input placeholder="e.g. Best Value, Save 20%" />
          </Form.Item>

          <Form.Item
            label="Description & Inclusions"
            name="description"
            rules={[{ required: true, message: 'Please enter details' }]}
          >
            <Input.TextArea rows={3} placeholder="Full gym access, steam room, locker facility included." />
          </Form.Item>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
            <Button onClick={() => setIsAddModalOpen(false)}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                backgroundColor: '#003882',
            borderColor: '#003882',
                fontWeight: 700,
              }}
            >
              Publish Plan
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default Plans;
