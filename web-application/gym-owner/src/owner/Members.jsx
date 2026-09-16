import React, { useState } from 'react';
import {
  Table,
  Button,
  Input,
  Select,
  Tag,
  Space,
  Avatar,
  Modal,
  Form,
  Row,
  Col,
  Card,
  Typography,
  Popconfirm,
  message,
  Divider,
} from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import {
  UserAddOutlined,
  SearchOutlined,
  DeleteOutlined,
  EyeOutlined,
  UserOutlined,
  PhoneOutlined,
  MailOutlined,
  CalendarOutlined,
  CheckCircleOutlined,
} from '@ant-design/icons';
import { useTheme } from '../theme/ThemeContext';
import { addMember, deleteMember } from '../redux/slices/gymSlice';

const { Title, Text } = Typography;
const { Option } = Select;

export const Members = () => {
  const dispatch = useDispatch();
  const { isDarkMode } = useTheme();
  const { members, trainers, plans } = useSelector((state) => state.gym);

  const [searchText, setSearchText] = useState('');
  const [filterPlan, setFilterPlan] = useState('ALL');
  const [filterStatus, setFilterStatus] = useState('ALL');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [selectedMember, setSelectedMember] = useState(null);
  const [form] = Form.useForm();

  const handleAddMember = (values) => {
    const newMember = {
      key: Date.now().toString(),
      id: `CUST${Math.floor(100000 + Math.random() * 900000)}`,
      name: values.name,
      email: values.email,
      phone: values.phone,
      plan: values.plan,
      status: 'ACTIVE',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '2026-06-30',
      totalCheckIns: 0,
      avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop',
      assignedTrainer: values.assignedTrainer || 'Unassigned',
    };

    dispatch(addMember(newMember));
    message.success(`New member ${values.name} added successfully!`);
    setIsAddModalOpen(false);
    form.resetFields();
  };

  const handleDeleteMember = (id) => {
    dispatch(deleteMember(id));
    message.info('Member record removed.');
  };

  const filteredMembers = members.filter((m) => {
    const matchesSearch =
      m.name.toLowerCase().includes(searchText.toLowerCase()) ||
      m.email.toLowerCase().includes(searchText.toLowerCase()) ||
      m.phone.includes(searchText) ||
      m.id.toLowerCase().includes(searchText.toLowerCase());

    const matchesPlan = filterPlan === 'ALL' || m.plan.includes(filterPlan);
    const matchesStatus = filterStatus === 'ALL' || m.status === filterStatus;

    return matchesSearch && matchesPlan && matchesStatus;
  });

  const columns = [
    {
      title: 'Member Info',
      key: 'name',
      render: (_, record) => (
        <Space size={12}>
          <Avatar src={record.avatar} size={42} style={{ border: '2px solid #1677ff' }} />
          <div>
            <div style={{ fontWeight: 700, fontSize: 14, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
              {record.name}
            </div>
            <div style={{ fontSize: 12, color: isDarkMode ? '#888888' : '#64748b' }}>
              {record.id} • {record.phone}
            </div>
          </div>
        </Space>
      ),
    },
    {
      title: 'Subscription Plan',
      dataIndex: 'plan',
      key: 'plan',
      render: (plan) => (
        <Tag color="blue" style={{ fontWeight: 600, borderRadius: 6 }}>
          {plan}
        </Tag>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => (
        <Tag color={status === 'ACTIVE' ? 'success' : 'error'} style={{ fontWeight: 700, borderRadius: 6 }}>
          {status}
        </Tag>
      ),
    },
    {
      title: 'Assigned Trainer',
      dataIndex: 'assignedTrainer',
      key: 'assignedTrainer',
      render: (trainer) => (
        <Text style={{ color: isDarkMode ? '#cccccc' : '#334155', fontWeight: 500 }}>
          {trainer || 'None'}
        </Text>
      ),
    },
    {
      title: 'Total Check-Ins',
      dataIndex: 'totalCheckIns',
      key: 'totalCheckIns',
      render: (count) => (
        <span style={{ fontWeight: 700, color: '#1677ff' }}>{count} sessions</span>
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      render: (_, record) => (
        <Space size={8}>
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => setSelectedMember(record)}
          />
          <Popconfirm
            title="Delete member"
            description="Are you sure you want to remove this member profile?"
            onConfirm={() => handleDeleteMember(record.id)}
            okText="Yes"
            cancelText="No"
          >
            <Button size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

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
          marginBottom: 24,
        }}
      >
        <div>
          <Title level={2} style={{ margin: 0, color: isDarkMode ? '#ffffff' : '#0f172a', fontWeight: 650 }}>
            Members CRM & Access Pass
          </Title>
          <Text style={{ color: isDarkMode ? '#888888' : '#64748b', fontSize: 14 }}>
            Manage fitness center members, plan statuses, and assigned personal trainers.
          </Text>
        </div>

        <Button
          type="primary"
          icon={<UserAddOutlined />}
          onClick={() => setIsAddModalOpen(true)}
          style={{
            backgroundColor: '#003882',
            borderColor: '#003882',
            fontWeight: 700,
            borderRadius: 'var(--radius-base)',
            height: 42,
          }}
        >
          Add New Member
        </Button>
      </div>

      {/* Filter Toolbar */}
      <Card
        style={{
          backgroundColor: isDarkMode ? '#0d0d0d' : '#ffffff',
          borderColor: isDarkMode ? '#222222' : '#e2e8f0',
          borderRadius: 'var(--radius-base)',
          marginBottom: 20,
        }}
      >
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={10}>
            <Input
              prefix={<SearchOutlined style={{ color: '#1677ff' }} />}
              placeholder="Search by member name, customer ID, or phone..."
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              allowClear
              style={{
                backgroundColor: isDarkMode ? '#141414' : '#ffffff',
                borderColor: isDarkMode ? '#333333' : '#d9d9d9',
                color: isDarkMode ? '#ffffff' : '#0f172a',
              }}
            />
          </Col>
          <Col xs={12} sm={6} md={7}>
            <Select
              value={filterPlan}
              onChange={setFilterPlan}
              style={{ width: '100%' }}
            >
              <Option value="ALL">All Membership Plans</Option>
              <Option value="Annual">Annual Membership</Option>
              <Option value="Quarterly">Quarterly Membership</Option>
              <Option value="Monthly">Monthly Membership</Option>
            </Select>
          </Col>
          <Col xs={12} sm={6} md={7}>
            <Select
              value={filterStatus}
              onChange={setFilterStatus}
              style={{ width: '100%' }}
            >
              <Option value="ALL">All Statuses</Option>
              <Option value="ACTIVE">Active Only</Option>
              <Option value="EXPIRED">Expired Only</Option>
            </Select>
          </Col>
        </Row>
      </Card>

      {/* Members Table */}
      <Card
        style={{
          backgroundColor: isDarkMode ? '#0d0d0d' : '#ffffff',
          borderColor: isDarkMode ? '#222222' : '#e2e8f0',
          borderRadius: 'var(--radius-base)',
        }}
      >
        <Table
          columns={columns}
          dataSource={filteredMembers}
          pagination={{ pageSize: 8 }}
        />
      </Card>

      {/* ADD MEMBER MODAL */}
      <Modal
        title="Enroll New Gym Member"
        open={isAddModalOpen}
        onCancel={() => setIsAddModalOpen(false)}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleAddMember}>
          <Form.Item
            label="Full Name"
            name="name"
            rules={[{ required: true, message: 'Please enter member name' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="e.g. Ramesh Varma" />
          </Form.Item>

          <Form.Item
            label="Phone Number"
            name="phone"
            rules={[{ required: true, message: 'Please enter phone number' }]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="e.g. +91 98765 00000" />
          </Form.Item>

          <Form.Item
            label="Email Address"
            name="email"
            rules={[{ required: true, type: 'email', message: 'Please enter valid email' }]}
          >
            <Input prefix={<MailOutlined />} placeholder="e.g. ramesh@gmail.com" />
          </Form.Item>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Select Plan"
                name="plan"
                initialValue="Annual Membership"
                rules={[{ required: true }]}
              >
                <Select>
                  {plans.map((p) => (
                    <Option key={p.id} value={p.name}>
                      {p.name} (₹{p.price})
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item label="Assign Trainer" name="assignedTrainer" initialValue="Rohit Sharma">
                <Select>
                  <Option value="Unassigned">Unassigned</Option>
                  {trainers.map((t) => (
                    <Option key={t.id} value={t.name}>
                      {t.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

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
              Enroll Member
            </Button>
          </div>
        </Form>
      </Modal>

      {/* VIEW MEMBER DETAILS MODAL */}
      <Modal
        title="Member Profile Details"
        open={!!selectedMember}
        onCancel={() => setSelectedMember(null)}
        footer={[
          <Button key="close" type="primary" onClick={() => setSelectedMember(null)}>
            Close
          </Button>,
        ]}
      >
        {selectedMember && (
          <div style={{ padding: '8px 0' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 16, marginBottom: 20 }}>
              <Avatar src={selectedMember.avatar} size={64} style={{ border: '3px solid #1677ff' }} />
              <div>
                <h3 style={{ margin: 0, fontSize: 18 }}>{selectedMember.name}</h3>
                <div style={{ color: '#1677ff', fontWeight: 600 }}>{selectedMember.id}</div>
                <Tag color={selectedMember.status === 'ACTIVE' ? 'success' : 'error'} style={{ marginTop: 4 }}>
                  {selectedMember.status}
                </Tag>
              </div>
            </div>

            <Divider style={{ margin: '16px 0' }} />

            <div style={{ lineHeight: '2' }}>
              <div><strong>Phone:</strong> {selectedMember.phone}</div>
              <div><strong>Email:</strong> {selectedMember.email}</div>
              <div><strong>Plan:</strong> {selectedMember.plan}</div>
              <div><strong>Start Date:</strong> {selectedMember.startDate}</div>
              <div><strong>Expiry Date:</strong> {selectedMember.endDate}</div>
              <div><strong>Assigned Trainer:</strong> {selectedMember.assignedTrainer}</div>
              <div><strong>Total Turnstile Check-Ins:</strong> {selectedMember.totalCheckIns}</div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  );
};

export default Members;
