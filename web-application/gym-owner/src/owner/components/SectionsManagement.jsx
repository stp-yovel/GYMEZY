import React, { useState, useEffect, useCallback } from 'react';
import {
  Card,
  Row,
  Col,
  Typography,
  Tag,
  Button,
  Input,
  Select,
  Modal,
  Form,
  InputNumber,
  Switch,
  Space,
  Tooltip,
  Popconfirm,
  Table,
  Avatar,
  message,
  Spin,
  Empty,
  DatePicker,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  ClockCircleOutlined,
  UserOutlined,
  TeamOutlined,
  EditOutlined,
  DeleteOutlined,
  ThunderboltOutlined,
  FireOutlined,
  HeartOutlined,
  TrophyOutlined,
  AppstoreOutlined,
  CalendarOutlined,
  ReloadOutlined,
} from '@ant-design/icons';
import { useTheme } from '../../theme/ThemeContext';
import { apiClient } from '../../services/apiClient';

const { Text } = Typography;
const { Option } = Select;

// Section Category Definitions
export const SECTION_CATEGORIES = [
  { key: 'all', label: 'All Sections', icon: <TrophyOutlined /> },
  { key: 'yoga', label: 'Yoga Classes', icon: <HeartOutlined />, color: '#7c3aed' },
  { key: 'gym', label: 'Gym Access', icon: <ThunderboltOutlined />, color: '#003882' },
  { key: 'zumba', label: 'Zumba Sessions', icon: <FireOutlined />, color: '#db2777' },
  { key: 'crossfit', label: 'CrossFit', icon: <ThunderboltOutlined />, color: '#ea580c' },
  { key: 'hiit', label: 'HIIT Workouts', icon: <FireOutlined />, color: '#e11d48' },
  { key: 'pilates', label: 'Pilates', icon: <HeartOutlined />, color: '#059669' },
  { key: 'boxing', label: 'Boxing / MMA', icon: <TrophyOutlined />, color: '#d97706' },
  { key: 'other', label: 'Other Classes', icon: <AppstoreOutlined />, color: '#4b5563' },
];

export const TIME_SLOTS = [
  '05:00 AM', '05:30 AM', '06:00 AM', '06:30 AM', '07:00 AM', '07:30 AM',
  '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
  '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM',
  '08:00 PM', '08:30 PM', '09:00 PM', '09:30 PM', '10:00 PM', '10:30 PM',
  '11:00 PM',
];

export const DAYS_OPTIONS = [
  { label: 'Mon', value: 'Mon' },
  { label: 'Tue', value: 'Tue' },
  { label: 'Wed', value: 'Wed' },
  { label: 'Thu', value: 'Thu' },
  { label: 'Fri', value: 'Fri' },
  { label: 'Sat', value: 'Sat' },
  { label: 'Sun', value: 'Sun' },
];

export const SectionsManagement = () => {
  const { isDarkMode } = useTheme();

  // Data States
  const [sections, setSections] = useState([]);
  const [trainers, setTrainers] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Filters
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [form] = Form.useForm();

  // Fetch sections from live API
  const fetchSections = useCallback(async () => {
    setIsLoading(true);
    try {
      const response = await apiClient.get('/sections');
      if (response.data?.success && Array.isArray(response.data.data)) {
        setSections(response.data.data);
      } else {
        setSections([]);
      }
    } catch (err) {
      console.error('Failed to fetch sections:', err);
      message.error(err.message || 'Failed to fetch sections from server.');
    } finally {
      setIsLoading(false);
    }
  }, []);

  // Fetch gym trainers (strictly referencing them by ID)
  const fetchTrainers = useCallback(async () => {
    try {
      const response = await apiClient.get('/employees', { params: { limit: 'all' } });
      const rawData = response.data?.data;
      const allEmployees = Array.isArray(rawData) ? rawData : rawData?.employees || [];

      if (allEmployees.length > 0) {
        // Filter active employees whose role is Trainer or coach
        const gymTrainers = allEmployees.filter(
          (emp) =>
            emp.status !== 'Deactivated' &&
            (!emp.role || emp.role.toLowerCase().includes('trainer') || emp.role.toLowerCase().includes('coach'))
        );
        const resolved = gymTrainers.length > 0 ? gymTrainers : allEmployees;
        setTrainers(resolved);

        // Auto-select first trainer if not set
        if (!form.getFieldValue('trainerId') && resolved.length > 0) {
          form.setFieldsValue({ trainerId: String(resolved[0]._id || resolved[0].id) });
        }
      }
    } catch (err) {
      console.warn('Could not load gym trainers:', err.message);
    }
  }, [form]);

  useEffect(() => {
    fetchSections();
    fetchTrainers();
  }, [fetchSections, fetchTrainers]);

  // Trainer Select Options
  const trainerOptions = React.useMemo(() => {
    return trainers.map((t) => ({
      value: String(t._id || t.id),
      label: (
        <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
          <Avatar size="small" src={t.avatar} icon={<UserOutlined />} />
          <span style={{ fontWeight: 600 }}>{t.name}</span>
          {t.employeeId ? (
            <span style={{ color: '#94a3b8', fontSize: 12 }}>({t.employeeId})</span>
          ) : null}
        </div>
      ),
    }));
  }, [trainers]);

  // Open Create/Edit Modal
  const handleOpenModal = (section = null) => {
    setEditingSection(section);
    setIsModalOpen(true);

    setTimeout(() => {
      if (section) {
        const tid = section.trainerId?._id ? String(section.trainerId._id) : String(section.trainerId || '');
        form.setFieldsValue({
          title: section.title,
          category: section.category || 'yoga',
          trainerId: tid || undefined,
          cost: section.cost,
          startDate: section.startDate ? section.startDate.split('T')[0] : '',
          durationDays: section.durationDays || 20,
          startTime: section.startTime || '06:00 AM',
          endTime: section.endTime || '07:00 AM',
          activeDays: section.activeDays || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
          maxCapacity: section.maxCapacity || 25,
          description: section.description || '',
          isActive: section.isActive !== undefined ? section.isActive : true,
        });
      } else {
        form.resetFields();
        const defaultTrainerId = trainers[0]?._id
          ? String(trainers[0]._id)
          : (trainers[0]?.id ? String(trainers[0].id) : undefined);
        form.setFieldsValue({
          title: '',
          category: 'yoga',
          trainerId: defaultTrainerId,
          cost: 1500,
          startDate: new Date().toISOString().split('T')[0],
          durationDays: 20,
          startTime: '06:00 AM',
          endTime: '07:00 AM',
          activeDays: ['Mon', 'Wed', 'Fri'],
          maxCapacity: 20,
          description: '',
          isActive: true,
        });
      }
    }, 0);
  };

  // Save Section (Create / Update)
  const handleSaveSection = async (values) => {
    setIsSubmitting(true);
    try {
      const payload = {
        title: values.title.trim(),
        category: values.category,
        trainerId: values.trainerId, // Connected strictly by ID
        cost: Number(values.cost),
        startDate: values.startDate,
        durationDays: Number(values.durationDays) || 20,
        startTime: values.startTime,
        endTime: values.endTime,
        activeDays: values.activeDays,
        maxCapacity: Number(values.maxCapacity) || 25,
        description: values.description || '',
        isActive: values.isActive !== undefined ? values.isActive : true,
      };

      if (editingSection?._id) {
        // Update existing section
        const response = await apiClient.put(`/sections/${editingSection._id}`, payload);
        if (response.data?.success) {
          message.success('Workout section updated successfully!');
          fetchSections();
          setIsModalOpen(false);
        }
      } else {
        // Create new section
        const response = await apiClient.post('/sections', payload);
        if (response.data?.success) {
          message.success('New workout section created & published!');
          fetchSections();
          setIsModalOpen(false);
        }
      }
    } catch (err) {
      console.error('Failed to save section:', err);
      message.error(err.message || 'Failed to save section.');
    } finally {
      setIsSubmitting(false);
    }
  };

  // Toggle Section Status
  const handleToggleStatus = async (id, currentStatus) => {
    try {
      const response = await apiClient.patch(`/sections/${id}/status`, {
        isActive: !currentStatus,
      });
      if (response.data?.success) {
        setSections((prev) =>
          prev.map((sec) => (sec._id === id ? { ...sec, isActive: !currentStatus } : sec))
        );
        message.info(`Section status ${!currentStatus ? 'Activated' : 'Paused'}.`);
      }
    } catch (err) {
      message.error(err.message || 'Failed to update section status.');
    }
  };

  // Delete Section
  const handleDeleteSection = async (id) => {
    try {
      const response = await apiClient.delete(`/sections/${id}`);
      if (response.data?.success) {
        setSections((prev) => prev.filter((sec) => sec._id !== id));
        message.success('Section removed permanently.');
      }
    } catch (err) {
      message.error(err.message || 'Failed to delete section.');
    }
  };

  // Filtered Sections
  const filteredSections = sections.filter((sec) => {
    const matchesCategory = activeCategory === 'all' || sec.category === activeCategory;
    const trainerName =
      (typeof sec.trainerId === 'object' ? sec.trainerId?.name : '') || '';
    const matchesSearch =
      (sec.title || '').toLowerCase().includes(searchQuery.toLowerCase()) ||
      trainerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (sec.category || '').toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Category Color Helper
  const getCategoryColor = (catKey) => {
    const found = SECTION_CATEGORIES.find((c) => c.key === catKey);
    return found?.color || '#003882';
  };

  // Table Columns Definition
  const columns = [
    {
      title: 'Section & Category',
      dataIndex: 'title',
      key: 'title',
      width: 280,
      render: (text, record) => {
        const catColor = getCategoryColor(record.category);
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 4 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <Tag color={catColor} style={{ fontWeight: 700, fontSize: 11, margin: 0, textTransform: 'uppercase' }}>
                {record.category || 'Class'}
              </Tag>
              <Text strong style={{ fontSize: 14, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                {text}
              </Text>
            </div>
            {record.description ? (
              <Text type="secondary" style={{ fontSize: 12 }} ellipsis={{ tooltip: record.description }}>
                {record.description}
              </Text>
            ) : null}
          </div>
        );
      },
    },
    {
      title: 'Assigned Trainer',
      dataIndex: 'trainerId',
      key: 'trainer',
      width: 220,
      render: (trainerObj) => {
        const name = typeof trainerObj === 'object' ? trainerObj?.name : 'Assigned Trainer';
        const avatar = typeof trainerObj === 'object' ? trainerObj?.avatar : null;
        const empId = typeof trainerObj === 'object' ? trainerObj?.employeeId : '';
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <Avatar
              src={avatar}
              icon={<UserOutlined />}
              size={32}
              style={{ backgroundColor: '#003882', flexShrink: 0 }}
            />
            <div style={{ display: 'flex', flexDirection: 'column' }}>
              <Text strong style={{ fontSize: 13, color: isDarkMode ? '#e6edf3' : '#0f172a' }}>
                {name || 'Unassigned'}
              </Text>
              {empId ? (
                <Text type="secondary" style={{ fontSize: 11 }}>
                  ID: {empId}
                </Text>
              ) : null}
            </div>
          </div>
        );
      },
    },
    {
      title: 'Cost',
      dataIndex: 'cost',
      key: 'cost',
      width: 120,
      sorter: (a, b) => a.cost - b.cost,
      render: (cost, record) => (
        <Tag
          color="green"
          style={{
            fontSize: 13,
            fontWeight: 700,
            borderRadius: 'var(--radius-base)',
            padding: '2px 8px',
            margin: 0,
          }}
        >
          ₹{Number(cost || 0).toLocaleString('en-IN')}
        </Tag>
      ),
    },
    {
      title: 'Daily Timings',
      key: 'timings',
      width: 180,
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <ClockCircleOutlined style={{ color: '#d97706', fontSize: 14 }} />
          <Text strong style={{ fontSize: 12, color: isDarkMode ? '#e6edf3' : '#334155' }}>
            {record.startTime || '06:00 AM'} - {record.endTime || '07:00 AM'}
          </Text>
        </div>
      ),
    },
    {
      title: 'Start Date & Duration',
      key: 'schedule',
      width: 200,
      render: (_, record) => {
        const dateStr = record.startDate
          ? new Date(record.startDate).toLocaleDateString('en-IN', {
              day: 'numeric',
              month: 'short',
              year: 'numeric',
            })
          : '—';
        return (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <CalendarOutlined style={{ color: '#003882', fontSize: 13 }} />
              <Text style={{ fontSize: 12 }}>{dateStr}</Text>
            </div>
            <Tag color="blue" style={{ width: 'fit-content', fontSize: 10, margin: 0, borderRadius: 4 }}>
              {record.durationDays || 20} Days Program
            </Tag>
          </div>
        );
      },
    },
    {
      title: 'Weekly Days',
      dataIndex: 'activeDays',
      key: 'activeDays',
      width: 180,
      render: (days) => (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 4 }}>
          {Array.isArray(days) && days.length === 7 ? (
            <Tag color="cyan">Daily (All 7 Days)</Tag>
          ) : Array.isArray(days) && days.length > 0 ? (
            days.map((d) => (
              <Tag key={d} style={{ fontSize: 10, margin: 0 }}>
                {d}
              </Tag>
            ))
          ) : (
            <Text type="secondary">—</Text>
          )}
        </div>
      ),
    },
    {
      title: 'Capacity',
      key: 'capacity',
      width: 130,
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
          <TeamOutlined style={{ color: '#003882' }} />
          <Text strong style={{ fontSize: 13, color: isDarkMode ? '#e6edf3' : '#1e293b' }}>
            {record.enrolledCount || 0} / {record.maxCapacity || 25}
          </Text>
        </div>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 100,
      render: (isActive, record) => (
        <Switch
          checked={isActive}
          onChange={() => handleToggleStatus(record._id, isActive)}
          size="small"
        />
      ),
    },
    {
      title: 'Action',
      key: 'action',
      width: 100,
      align: 'center',
      fixed: 'right',
      render: (_, record) => (
        <Space size={4}>
          <Tooltip title="Edit Section">
            <Button
              type="text"
              size="small"
              icon={<EditOutlined />}
              onClick={() => handleOpenModal(record)}
            />
          </Tooltip>
          <Popconfirm
            title="Delete Section?"
            description="Are you sure you want to remove this section permanently?"
            onConfirm={() => handleDeleteSection(record._id)}
            okText="Delete"
            cancelText="Cancel"
            okButtonProps={{ danger: true }}
          >
            <Button type="text" size="small" danger icon={<DeleteOutlined />} />
          </Popconfirm>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ paddingBottom: 48 }}>
      {/* 1. Header Toolbar: Category Pills, Search, Refresh, Add Action */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          flexWrap: 'wrap',
          gap: 16,
          marginBottom: 20,
        }}
      >
        {/* Category Pills */}
        <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
          {SECTION_CATEGORIES.map((cat) => {
            const isSelected = activeCategory === cat.key;
            return (
              <Button
                key={cat.key}
                onClick={() => setActiveCategory(cat.key)}
                style={{
                  borderRadius: 'var(--radius-base)',
                  fontWeight: isSelected ? 700 : 500,
                  backgroundColor: isSelected
                    ? '#003882'
                    : isDarkMode
                    ? '#161b22'
                    : '#ffffff',
                  color: isSelected ? '#ffffff' : isDarkMode ? '#c9d1d9' : '#334155',
                  borderColor: isSelected ? '#003882' : isDarkMode ? '#30363d' : '#cbd5e1',
                  display: 'flex',
                  alignItems: 'center',
                  gap: 6,
                }}
              >
                {cat.icon}
                {cat.label}
              </Button>
            );
          })}
        </div>

        {/* Search & Add Action */}
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <div style={{ width: 240 }}>
            <Input
              prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
              placeholder="Search section or trainer..."
              allowClear
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              style={{
                borderRadius: 'var(--radius-base)',
                backgroundColor: isDarkMode ? '#161b22' : '#ffffff',
                borderColor: isDarkMode ? '#30363d' : '#cbd5e1',
              }}
            />
          </div>

          <Tooltip title="Reload Sections">
            <Button
              icon={<ReloadOutlined spin={isLoading} />}
              onClick={fetchSections}
              style={{ borderRadius: 'var(--radius-base)' }}
            />
          </Tooltip>

          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => handleOpenModal()}
            style={{
              backgroundColor: '#003882',
              borderRadius: 'var(--radius-base)',
              fontWeight: 600,
              height: 38,
              padding: '0 18px',
            }}
          >
            Create Section
          </Button>
        </div>
      </div>

      {/* 2. Sections Table */}
      <Card
        style={{
          borderRadius: 'var(--radius-base)',
          backgroundColor: isDarkMode ? '#0d1117' : '#ffffff',
          border: `1px solid ${isDarkMode ? '#1e293b' : '#e2e8f0'}`,
        }}
        bodyStyle={{ padding: 0 }}
      >
        <Table
          columns={columns}
          dataSource={filteredSections}
          loading={isLoading}
          pagination={{ pageSize: 10, showTotal: (total) => `Total ${total} sections` }}
          rowKey="_id"
          scroll={{ x: 1500 }}
          locale={{
            emptyText: (
              <Empty
                description="No sections found. Click 'Create Section' to add your first training batch!"
                style={{ padding: '36px 0' }}
              />
            ),
          }}
        />
      </Card>

      {/* 3. Create / Edit Section Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <div
              style={{
                width: 32,
                height: 32,
                borderRadius: 'var(--radius-base)',
                backgroundColor: 'rgba(0, 56, 130, 0.12)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#003882',
              }}
            >
              {editingSection ? <EditOutlined /> : <PlusOutlined />}
            </div>
            <span style={{ fontSize: 16, fontWeight: 700 }}>
              {editingSection ? 'Edit Section / Class' : 'Create New Section (e.g. Basic Yoga 20 Days)'}
            </span>
          </div>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        width={700}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSaveSection} style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col span={14}>
              <Form.Item
                name="title"
                label="Section Name / Title"
                rules={[{ required: true, message: 'Please enter section title' }]}
              >
                <Input
                  size="large"
                  placeholder="e.g. Basic Yoga 20 Days"
                  style={{ borderRadius: 'var(--radius-base)' }}
                />
              </Form.Item>
            </Col>

            <Col span={10}>
              <Form.Item
                name="category"
                label="Category"
                rules={[{ required: true, message: 'Please select a category' }]}
              >
                <Select size="large" style={{ borderRadius: 'var(--radius-base)' }}>
                  {SECTION_CATEGORIES.filter((c) => c.key !== 'all').map((c) => (
                    <Option key={c.key} value={c.key}>
                      <Space>
                        {c.icon}
                        {c.label}
                      </Space>
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={14}>
              <Form.Item
                name="trainerId"
                label="Assigned Gym Trainer (Available in Gym)"
                rules={[{ required: true, message: 'Please select a trainer' }]}
              >
                <Select
                  size="large"
                  placeholder="Select a gym trainer"
                  style={{ borderRadius: 'var(--radius-base)' }}
                  options={trainerOptions}
                />
              </Form.Item>
            </Col>

            <Col span={10}>
              <Form.Item
                name="cost"
                label="Cost / Program Fee (₹)"
                rules={[{ required: true, message: 'Enter program cost' }]}
              >
                <InputNumber
                  size="large"
                  min={0}
                  prefix="₹"
                  placeholder="e.g. 1500"
                  style={{ width: '100%', borderRadius: 'var(--radius-base)' }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="startDate"
                label="Starting Date"
                rules={[{ required: true, message: 'Select start date' }]}
              >
                <Input
                  type="date"
                  size="large"
                  style={{ borderRadius: 'var(--radius-base)' }}
                />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                name="durationDays"
                label="Duration (Days)"
                rules={[{ required: true, message: 'Enter days' }]}
              >
                <InputNumber
                  size="large"
                  min={1}
                  max={365}
                  placeholder="20"
                  addonAfter="Days"
                  style={{ width: '100%', borderRadius: 'var(--radius-base)' }}
                />
              </Form.Item>
            </Col>

            <Col span={6}>
              <Form.Item
                name="maxCapacity"
                label="Capacity"
                rules={[{ required: true, message: 'Enter capacity' }]}
              >
                <InputNumber
                  size="large"
                  min={1}
                  max={200}
                  placeholder="25"
                  addonAfter="Seats"
                  style={{ width: '100%', borderRadius: 'var(--radius-base)' }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="startTime"
                label="Daily Start Time"
                rules={[{ required: true, message: 'Select start time' }]}
              >
                <Select size="large" style={{ borderRadius: 'var(--radius-base)' }}>
                  {TIME_SLOTS.map((slot) => (
                    <Option key={slot} value={slot}>
                      {slot}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>

            <Col span={12}>
              <Form.Item
                name="endTime"
                label="Daily End Time"
                rules={[{ required: true, message: 'Select end time' }]}
              >
                <Select size="large" style={{ borderRadius: 'var(--radius-base)' }}>
                  {TIME_SLOTS.map((slot) => (
                    <Option key={slot} value={slot}>
                      {slot}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* Weekly Recurring Days */}
          <Form.Item
            name="activeDays"
            label="Weekly Schedule (Select Active Days)"
            rules={[{ required: true, message: 'Select at least one day' }]}
          >
            <Select
              mode="multiple"
              size="large"
              placeholder="Select recurring days (e.g. Mon, Wed, Fri)"
              options={DAYS_OPTIONS}
              style={{ borderRadius: 'var(--radius-base)' }}
            />
          </Form.Item>

          {/* Description */}
          <Form.Item name="description" label="Section Description / Guidelines">
            <Input.TextArea
              rows={2}
              placeholder="e.g. 20-day progressive yoga program covering Asanas, Pranayama and Surya Namaskar."
              style={{ borderRadius: 'var(--radius-base)' }}
            />
          </Form.Item>

          {/* Active Switch */}
          <Form.Item name="isActive" valuePropName="checked" label="Section Visibility">
            <Space>
              <Switch defaultChecked />
              <Text style={{ fontSize: 13, color: isDarkMode ? '#8b949e' : '#64748b' }}>
                Active and visible for member enrollment
              </Text>
            </Space>
          </Form.Item>

          {/* Submit Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
            <Button size="large" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
              loading={isSubmitting}
              style={{ backgroundColor: '#003882', fontWeight: 600 }}
            >
              {editingSection ? 'Save Changes' : 'Create & Publish Section'}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default SectionsManagement;
