import React, { useState } from 'react';
import {
  Row,
  Col,
  Card,
  Button,
  Tag,
  Avatar,
  Typography,
  Modal,
  Form,
  Input,
  InputNumber,
  Space,
  Rate,
  Switch,
  message,
} from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import {
  UserAddOutlined,
  PhoneOutlined,
  StarFilled,
  TrophyOutlined,
  TeamOutlined,
} from '@ant-design/icons';
import { useTheme } from '../theme/ThemeContext';
import { addTrainer } from '../redux/slices/gymSlice';

const { Title, Text, Paragraph } = Typography;

export const Trainers = () => {
  const dispatch = useDispatch();
  const { isDarkMode } = useTheme();
  const { trainers } = useSelector((state) => state.gym);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [form] = Form.useForm();

  const handleAddTrainer = (values) => {
    const newTrainer = {
      id: Date.now().toString(),
      name: values.name,
      specialty: values.specialty,
      experienceYears: values.experienceYears,
      rating: 4.9,
      reviewsCount: 1,
      clientsCount: 0,
      phone: values.phone,
      status: 'AVAILABLE',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=300&auto=format&fit=crop',
    };
    dispatch(addTrainer(newTrainer));
    message.success(`Trainer ${values.name} onboarded to gym roster!`);
    setIsModalOpen(false);
    form.resetFields();
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
            Trainers & Staff Roster
          </Title>
          <Text style={{ color: isDarkMode ? '#888888' : '#64748b', fontSize: 14 }}>
            Manage staff trainers, assigned member clients, and floor availability.
          </Text>
        </div>

        <Button
          type="primary"
          icon={<UserAddOutlined />}
          onClick={() => setIsModalOpen(true)}
          style={{
            backgroundColor: '#003882',
            borderColor: '#003882',
            fontWeight: 700,
            borderRadius: 'var(--radius-base)',
            height: 42,
          }}
        >
          Add Trainer
        </Button>
      </div>

      {/* Trainers Cards Grid */}
      <Row gutter={[24, 24]}>
        {trainers.map((trainer) => (
          <Col xs={24} sm={12} lg={8} key={trainer.id}>
            <Card
              style={{
                backgroundColor: isDarkMode ? '#0d0d0d' : '#ffffff',
                borderColor: isDarkMode ? '#222222' : '#e2e8f0',
                borderRadius: 'var(--radius-base)',
              }}
            >
              <div style={{ display: 'flex', gap: 16, alignItems: 'center', marginBottom: 16 }}>
                <Avatar
                  src={trainer.avatar}
                  size={64}
                  style={{ border: '2px solid #1677ff', flexShrink: 0 }}
                />
                <div>
                  <h3 style={{ margin: 0, fontSize: 17, fontWeight: 700, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                    {trainer.name}
                  </h3>
                  <div style={{ fontSize: 13, color: '#1677ff', fontWeight: 600, marginTop: 2 }}>
                    {trainer.specialty}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
                    <Rate disabled defaultValue={trainer.rating} allowHalf style={{ fontSize: 13 }} />
                    <span style={{ fontSize: 12, fontWeight: 700, color: isDarkMode ? '#cccccc' : '#475569' }}>
                      {trainer.rating} ({trainer.reviewsCount})
                    </span>
                  </div>
                </div>
              </div>

              <div
                style={{
                  padding: '12px 14px',
                  borderRadius: 'var(--radius-base)',
                  backgroundColor: isDarkMode ? '#141414' : '#f8fafc',
                  border: `1px solid ${isDarkMode ? '#222222' : '#e2e8f0'}`,
                  marginBottom: 16,
                  display: 'flex',
                  justifyContent: 'space-between',
                }}
              >
                <div>
                  <div style={{ fontSize: 11, color: isDarkMode ? '#888888' : '#64748b' }}>Experience</div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                    {trainer.experienceYears} Years
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: isDarkMode ? '#888888' : '#64748b' }}>Active Clients</div>
                  <div style={{ fontWeight: 700, fontSize: 13, color: '#00bf62' }}>
                    {trainer.clientsCount} Members
                  </div>
                </div>
                <div>
                  <div style={{ fontSize: 11, color: isDarkMode ? '#888888' : '#64748b' }}>Status</div>
                  <Tag color={trainer.status === 'AVAILABLE' ? 'success' : 'warning'} style={{ margin: 0, fontWeight: 600 }}>
                    {trainer.status}
                  </Tag>
                </div>
              </div>

              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: 13, color: isDarkMode ? '#888888' : '#64748b' }}>
                  <PhoneOutlined style={{ marginRight: 6 }} />
                  {trainer.phone}
                </span>
                <Button
                  size="small"
                  onClick={() => message.info(`Contacted ${trainer.name} via WhatsApp.`)}
                  style={{ borderRadius: 8, fontSize: 12 }}
                >
                  Message
                </Button>
              </div>
            </Card>
          </Col>
        ))}
      </Row>

      {/* ADD TRAINER MODAL */}
      <Modal
        title="Add Fitness Trainer"
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleAddTrainer}>
          <Form.Item label="Trainer Name" name="name" rules={[{ required: true }]}>
            <Input placeholder="e.g. Suresh Raina" />
          </Form.Item>

          <Form.Item label="Specialty / Certifications" name="specialty" rules={[{ required: true }]}>
            <Input placeholder="e.g. Strength & Conditioning Specialist" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item label="Experience (Years)" name="experienceYears" initialValue={4} rules={[{ required: true }]}>
                <InputNumber style={{ width: '100%' }} min={1} />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Contact Phone" name="phone" rules={[{ required: true }]}>
                <Input placeholder="+91 98401 00000" />
              </Form.Item>
            </Col>
          </Row>

          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 20 }}>
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              style={{
                backgroundColor: '#003882',
            borderColor: '#003882',
                fontWeight: 700,
              }}
            >
              Add Trainer
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default Trainers;
