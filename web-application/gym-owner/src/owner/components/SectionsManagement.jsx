import React, { useState } from 'react';
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
  Divider,
  message,
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
} from '@ant-design/icons';
import { useTheme } from '../../theme/ThemeContext';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

// Preset Category Metadata Matching Mobile App Categories Exactly
export const SECTION_CATEGORIES = [
  { key: 'all', label: 'All Sections', icon: <TrophyOutlined /> },
  { key: 'gym', label: 'Gym Access', icon: <ThunderboltOutlined />, color: '#003882' },
  { key: 'yoga', label: 'Yoga Classes', icon: <HeartOutlined />, color: '#7c3aed' },
  { key: 'zumba', label: 'Zumba Sessions', icon: <FireOutlined />, color: '#db2777' },
  { key: 'other', label: 'Other Classes', icon: <AppstoreOutlined />, color: '#059669' },
];

export const INITIAL_TRAINERS = [
  { id: 'T101', name: 'Rajesh Varma', role: 'Head Strength Coach', avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=120' },
  { id: 'T102', name: 'Ananya Sharma', role: 'Lead Yoga Master', avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=120' },
  { id: 'T103', name: 'Pooja Hegde', role: 'Zumba & Dance Specialist', avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?q=80&w=120' },
  { id: 'T104', name: 'Vikram Patel', role: 'CrossFit & HIIT Coach', avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=120' },
  { id: 'T105', name: 'Karan Malhotra', role: 'Boxing & Conditioning', avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=120' },
];

export const INITIAL_SECTIONS = [
  {
    key: 'SEC-001',
    id: 'SEC-001',
    category: 'gym',
    categoryLabel: 'Gym Access',
    title: 'Gym Access (General Floor & Strength)',
    pricePerSession: 150,
    morningSlots: ['06:00 AM', '07:00 AM', '08:00 AM', '09:00 AM', '10:00 AM'],
    eveningSlots: ['05:00 PM', '06:00 PM', '07:00 PM', '08:00 PM', '09:00 PM'],
    maxCapacity: 40,
    trainerId: 'T101',
    trainerName: 'Rajesh Varma',
    activeDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
    isActive: true,
    description: 'Full access to cardio deck, free weights, resistance machines, and functional turf area.',
  },
  {
    key: 'SEC-002',
    id: 'SEC-002',
    category: 'yoga',
    categoryLabel: 'Yoga Classes',
    title: 'Hatha & Vinyasa Flow Yoga',
    pricePerSession: 249,
    morningSlots: ['06:30 AM', '07:30 AM', '08:30 AM'],
    eveningSlots: ['05:30 PM', '06:30 PM'],
    maxCapacity: 20,
    trainerId: 'T102',
    trainerName: 'Ananya Sharma',
    activeDays: ['Mon', 'Wed', 'Fri', 'Sat'],
    isActive: true,
    description: 'Guided traditional asana flow, breathwork (pranayama), and core flexibility enhancement.',
  },
  {
    key: 'SEC-003',
    id: 'SEC-003',
    category: 'zumba',
    categoryLabel: 'Zumba Sessions',
    title: 'Zumba Fitness Dance Workout',
    pricePerSession: 249,
    morningSlots: ['07:00 AM', '08:30 AM'],
    eveningSlots: ['06:00 PM', '07:30 PM'],
    maxCapacity: 25,
    trainerId: 'T103',
    trainerName: 'Pooja Hegde',
    activeDays: ['Mon', 'Tue', 'Thu', 'Sat'],
    isActive: true,
    description: 'Upbeat Latin dance routines fused with calorie-scorching aerobic interval training.',
  },
  {
    key: 'SEC-004',
    id: 'SEC-004',
    category: 'other',
    categoryLabel: 'Other Classes',
    title: 'HIIT & Cross Training Class',
    pricePerSession: 299,
    morningSlots: ['06:00 AM', '07:30 AM'],
    eveningSlots: ['06:00 PM', '07:00 PM', '08:00 PM'],
    maxCapacity: 18,
    trainerId: 'T104',
    trainerName: 'Vikram Patel',
    activeDays: ['Mon', 'Wed', 'Fri'],
    isActive: true,
    description: 'Explosive high-intensity intervals combining battle ropes, plyometrics, kettlebells, and sprints.',
  },
  {
    key: 'SEC-005',
    id: 'SEC-005',
    category: 'other',
    categoryLabel: 'Other Classes',
    title: 'Pilates & Core Conditioning',
    pricePerSession: 299,
    morningSlots: ['07:00 AM', '09:00 AM'],
    eveningSlots: ['05:30 PM', '07:00 PM'],
    maxCapacity: 16,
    trainerId: 'T102',
    trainerName: 'Ananya Sharma',
    activeDays: ['Tue', 'Thu', 'Sat'],
    isActive: true,
    description: 'Mat-based Pilates focusing on postural alignment, core strength, and muscular endurance.',
  },
];

const TIME_SLOTS = [
  '05:00 AM', '05:30 AM', '06:00 AM', '06:30 AM', '07:00 AM', '07:30 AM',
  '08:00 AM', '08:30 AM', '09:00 AM', '09:30 AM', '10:00 AM', '10:30 AM',
  '11:00 AM', '11:30 AM', '12:00 PM', '12:30 PM', '01:00 PM', '01:30 PM',
  '02:00 PM', '02:30 PM', '03:00 PM', '03:30 PM', '04:00 PM', '04:30 PM',
  '05:00 PM', '05:30 PM', '06:00 PM', '06:30 PM', '07:00 PM', '07:30 PM',
  '08:00 PM', '08:30 PM', '09:00 PM', '09:30 PM', '10:00 PM', '10:30 PM',
  '11:00 PM', '11:30 PM', '12:00 AM',
];

export const SectionsManagement = () => {
  const { isDarkMode } = useTheme();
  const [sections, setSections] = useState(INITIAL_SECTIONS);
  const [activeCategory, setActiveCategory] = useState('all');
  const [searchQuery, setSearchQuery] = useState('');

  // Modal State
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingSection, setEditingSection] = useState(null);
  const [form] = Form.useForm();

  // Slot tag inputs for modal
  const [newMorningSlot, setNewMorningSlot] = useState('');
  const [newEveningSlot, setNewEveningSlot] = useState('');
  const [morningSlotsList, setMorningSlotsList] = useState([]);
  const [eveningSlotsList, setEveningSlotsList] = useState([]);

  // Days list
  const DAYS_OPTIONS = [
    { label: 'Mon', value: 'Mon' },
    { label: 'Tue', value: 'Tue' },
    { label: 'Wed', value: 'Wed' },
    { label: 'Thu', value: 'Thu' },
    { label: 'Fri', value: 'Fri' },
    { label: 'Sat', value: 'Sat' },
    { label: 'Sun', value: 'Sun' },
  ];

  // Open Create/Edit Modal
  const handleOpenModal = (section = null) => {
    setEditingSection(section);
    if (section) {
      form.setFieldsValue({
        category: section.category,
        title: section.title,
        pricePerSession: section.pricePerSession,
        maxCapacity: section.maxCapacity,
        trainerId: section.trainerId,
        activeDays: section.activeDays,
        isActive: section.isActive,
        description: section.description,
      });
      setMorningSlotsList([...section.morningSlots]);
      setEveningSlotsList([...section.eveningSlots]);
    } else {
      form.resetFields();
      form.setFieldsValue({
        category: 'gym',
        pricePerSession: 150,
        maxCapacity: 25,
        trainerId: 'T101',
        activeDays: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'],
        isActive: true,
      });
      setMorningSlotsList(['06:00 AM', '07:00 AM', '08:00 AM']);
      setEveningSlotsList(['05:30 PM', '06:30 PM', '07:30 PM']);
    }
    setIsModalOpen(true);
  };

  // Add Morning Slot
  const handleAddMorningSlot = () => {
    if (newMorningSlot && !morningSlotsList.includes(newMorningSlot)) {
      setMorningSlotsList([...morningSlotsList, newMorningSlot]);
      setNewMorningSlot('');
    }
  };

  // Add Evening Slot
  const handleAddEveningSlot = () => {
    if (newEveningSlot && !eveningSlotsList.includes(newEveningSlot)) {
      setEveningSlotsList([...eveningSlotsList, newEveningSlot]);
      setNewEveningSlot('');
    }
  };

  // Remove Slot
  const handleRemoveSlot = (type, slot) => {
    if (type === 'morning') {
      setMorningSlotsList(morningSlotsList.filter((s) => s !== slot));
    } else {
      setEveningSlotsList(eveningSlotsList.filter((s) => s !== slot));
    }
  };

  // Save Section
  const handleSaveSection = (values) => {
    if (morningSlotsList.length === 0 && eveningSlotsList.length === 0) {
      message.error('Please configure at least one Morning or Evening batch slot.');
      return;
    }

    const selectedTrainer = INITIAL_TRAINERS.find((t) => t.id === values.trainerId);
    const categoryMeta = SECTION_CATEGORIES.find((c) => c.key === values.category);

    if (editingSection) {
      // Update
      setSections((prev) =>
        prev.map((sec) =>
          sec.id === editingSection.id
            ? {
                ...sec,
                ...values,
                categoryLabel: categoryMeta ? categoryMeta.label : values.category,
                trainerName: selectedTrainer ? selectedTrainer.name : 'Unassigned',
                morningSlots: morningSlotsList,
                eveningSlots: eveningSlotsList,
              }
            : sec
        )
      );
      message.success('Workout section updated successfully!');
    } else {
      // Create new
      const newId = `SEC-${String(Date.now()).slice(-3)}`;
      const newSec = {
        key: newId,
        id: newId,
        ...values,
        categoryLabel: categoryMeta ? categoryMeta.label : values.category,
        trainerName: selectedTrainer ? selectedTrainer.name : 'Unassigned',
        morningSlots: morningSlotsList,
        eveningSlots: eveningSlotsList,
      };
      setSections([newSec, ...sections]);
      message.success('New workout section created & published!');
    }
    setIsModalOpen(false);
  };

  // Toggle Active Switch
  const handleToggleStatus = (id, currentStatus) => {
    setSections((prev) =>
      prev.map((sec) => (sec.id === id ? { ...sec, isActive: !currentStatus } : sec))
    );
    message.info(`Section status ${!currentStatus ? 'Activated' : 'Paused'}.`);
  };

  // Delete Section
  const handleDeleteSection = (id) => {
    setSections((prev) => prev.filter((sec) => sec.id !== id));
    message.success('Section removed.');
  };

  // Filtered Sections
  const filteredSections = sections.filter((sec) => {
    const matchesCategory = activeCategory === 'all' || sec.category === activeCategory;
    const matchesSearch =
      sec.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sec.trainerName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      sec.categoryLabel.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  // Category Colors
  const getCategoryColor = (catKey) => {
    const found = SECTION_CATEGORIES.find((c) => c.key === catKey);
    return found ? found.color : '#003882';
  };

  // Table Columns Definition (Single-Line Compact View with Explicit Column Widths)
  const columns = [
    {
      title: 'Section & Category',
      dataIndex: 'title',
      key: 'title',
      width: 340,
      render: (text, record) => {
        const catColor = getCategoryColor(record.category);
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}>
            <span
              style={{
                color: catColor,
                fontWeight: 800,
                fontSize: 11,
                letterSpacing: '0.3px',
                flexShrink: 0,
              }}
            >
              {record.categoryLabel.toUpperCase()}
            </span>
            <span style={{ color: isDarkMode ? '#4b5563' : '#cbd5e1' }}>•</span>
            <span style={{ fontWeight: 600, fontSize: 13, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
              {record.title}
            </span>
          </div>
        );
      },
    },
    {
      title: 'Price / Session',
      dataIndex: 'pricePerSession',
      key: 'pricePerSession',
      width: 150,
      sorter: (a, b) => a.pricePerSession - b.pricePerSession,
      render: (price) => (
        <Tag
          color="success"
          style={{
            fontSize: 13,
            fontWeight: 700,
            borderRadius: 'var(--radius-base)',
            padding: '2px 8px',
            whiteSpace: 'nowrap',
            margin: 0,
          }}
        >
          ₹{price}
        </Tag>
      ),
    },
    {
      title: 'Morning Batches',
      dataIndex: 'morningSlots',
      key: 'morningSlots',
      width: 460,
      render: (slots) => (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            whiteSpace: 'nowrap',
            overflowX: 'auto',
            paddingBottom: 2,
            maxWidth: '100%',
          }}
        >
          {slots && slots.length > 0 ? (
            slots.map((slot) => (
              <Tag
                key={slot}
                style={{
                  borderRadius: 'var(--radius-base)',
                  backgroundColor: isDarkMode ? 'rgba(217, 119, 6, 0.15)' : '#fffbeb',
                  borderColor: isDarkMode ? 'rgba(217, 119, 6, 0.3)' : '#fef3c7',
                  color: '#b45309',
                  fontWeight: 600,
                  fontSize: 11,
                  margin: 0,
                  flexShrink: 0,
                }}
              >
                {slot}
              </Tag>
            ))
          ) : (
            <Text type="secondary" style={{ fontSize: 12 }}>—</Text>
          )}
        </div>
      ),
    },
    {
      title: 'Evening Batches',
      dataIndex: 'eveningSlots',
      key: 'eveningSlots',
      width: 460,
      render: (slots) => (
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: 6,
            whiteSpace: 'nowrap',
            overflowX: 'auto',
            paddingBottom: 2,
            maxWidth: '100%',
          }}
        >
          {slots && slots.length > 0 ? (
            slots.map((slot) => (
              <Tag
                key={slot}
                style={{
                  borderRadius: 'var(--radius-base)',
                  backgroundColor: isDarkMode ? 'rgba(99, 102, 241, 0.15)' : '#eef2ff',
                  borderColor: isDarkMode ? 'rgba(99, 102, 241, 0.3)' : '#e0e7ff',
                  color: '#4f46e5',
                  fontWeight: 600,
                  fontSize: 11,
                  margin: 0,
                  flexShrink: 0,
                }}
              >
                {slot}
              </Tag>
            ))
          ) : (
            <Text type="secondary" style={{ fontSize: 12 }}>—</Text>
          )}
        </div>
      ),
    },
    {
      title: 'Batch Capacity',
      dataIndex: 'maxCapacity',
      key: 'maxCapacity',
      width: 150,
      render: (cap) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 6, whiteSpace: 'nowrap' }}>
          <TeamOutlined style={{ color: '#003882' }} />
          <Text strong style={{ fontSize: 13, color: isDarkMode ? '#e6edf3' : '#1e293b' }}>
            {cap} Max
          </Text>
        </div>
      ),
    },
    {
      title: 'Trainer & Days',
      dataIndex: 'trainerName',
      key: 'trainerName',
      width: 260,
      render: (trainer, record) => {
        const trainerObj = INITIAL_TRAINERS.find((t) => t.id === record.trainerId);
        return (
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, whiteSpace: 'nowrap' }}>
            <Avatar
              src={trainerObj?.avatar}
              icon={<UserOutlined />}
              size={24}
              style={{ border: '1px solid #cbd5e1', flexShrink: 0 }}
            />
            <span style={{ fontWeight: 600, fontSize: 12, color: isDarkMode ? '#e6edf3' : '#0f172a' }}>
              {trainer}
            </span>
            <Tag style={{ fontSize: 10, margin: 0, borderRadius: 'var(--radius-base)', flexShrink: 0 }}>
              {record.activeDays.length === 7 ? 'Daily' : record.activeDays.join(', ')}
            </Tag>
          </div>
        );
      },
    },
    {
      title: 'Status',
      dataIndex: 'isActive',
      key: 'isActive',
      width: 100,
      render: (isActive, record) => (
        <Switch
          checked={isActive}
          onChange={() => handleToggleStatus(record.id, isActive)}
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
      onCell: () => ({
        style: {
          backgroundColor: isDarkMode ? '#0d1117' : '#ffffff',
        },
      }),
      onHeaderCell: () => ({
        style: {
          backgroundColor: isDarkMode ? '#161b22' : '#fafafa',
        },
      }),
      render: (_, record) => (
        <Space size={4} style={{ whiteSpace: 'nowrap' }}>
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
            description="Are you sure you want to remove this workout section?"
            onConfirm={() => handleDeleteSection(record.id)}
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
      {/* Scoped CSS to ensure sticky fixed right column is 100% opaque in dark and light modes */}
      <style>{`
        .ant-table-cell-fix-right,
        .ant-table-cell-fix-right-first {
          background-color: ${isDarkMode ? '#0d1117' : '#ffffff'} !important;
        }
        .ant-table-thead > tr > th.ant-table-cell-fix-right,
        .ant-table-thead > tr > th.ant-table-cell-fix-right-first {
          background-color: ${isDarkMode ? '#161b22' : '#fafafa'} !important;
        }
        .ant-table-row:hover > td.ant-table-cell-fix-right,
        .ant-table-row:hover > td.ant-table-cell-fix-right-first {
          background-color: ${isDarkMode ? '#1c2128' : '#f5f5f5'} !important;
        }
      `}</style>
      {/* 1. CATEGORY TABS, SEARCH BAR & ADD SECTION ACTION */}
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
        {/* Category Pills Matching Mobile */}
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
          <div style={{ width: 260 }}>
            <Input
              prefix={<SearchOutlined style={{ color: '#94a3b8' }} />}
              placeholder="Search section or coach..."
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
            Add Workout Section
          </Button>
        </div>
      </div>

      {/* 3. TABLE FORMAT FOR SECTIONS & BATCHES */}
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
          pagination={{ pageSize: 10, showTotal: (total) => `Total ${total} workout sections` }}
          rowKey="id"
          scroll={{ x: 2050 }}
          style={{ borderRadius: 'var(--radius-base)' }}
        />
      </Card>

      {/* 4. CREATE / EDIT WORKOUT SECTION MODAL */}
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
              {editingSection ? 'Edit Workout Section' : 'Create New Workout Section'}
            </span>
          </div>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        width={680}
        footer={null}
        destroyOnClose
      >
        <Form form={form} layout="vertical" onFinish={handleSaveSection} style={{ marginTop: 16 }}>
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                name="category"
                label="Section Category"
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

            <Col span={12}>
              <Form.Item
                name="title"
                label="Section / Class Title"
                rules={[{ required: true, message: 'Please enter a title' }]}
              >
                <Input
                  size="large"
                  placeholder="e.g. Hatha & Vinyasa Flow Yoga"
                  style={{ borderRadius: 'var(--radius-base)' }}
                />
              </Form.Item>
            </Col>
          </Row>

          <Row gutter={16}>
            <Col span={8}>
              <Form.Item
                name="pricePerSession"
                label="Price Per Session (₹)"
                rules={[{ required: true, message: 'Enter price' }]}
              >
                <InputNumber
                  size="large"
                  min={0}
                  prefix="₹"
                  style={{ width: '100%', borderRadius: 'var(--radius-base)' }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="maxCapacity"
                label="Max Batch Capacity"
                rules={[{ required: true, message: 'Enter capacity' }]}
              >
                <InputNumber
                  size="large"
                  min={1}
                  max={100}
                  addonAfter="Members"
                  style={{ width: '100%', borderRadius: 'var(--radius-base)' }}
                />
              </Form.Item>
            </Col>
            <Col span={8}>
              <Form.Item
                name="trainerId"
                label="Assigned Trainer / Coach"
                rules={[{ required: true, message: 'Select coach' }]}
              >
                <Select size="large" style={{ borderRadius: 'var(--radius-base)' }}>
                  {INITIAL_TRAINERS.map((t) => (
                    <Option key={t.id} value={t.id}>
                      {t.name}
                    </Option>
                  ))}
                </Select>
              </Form.Item>
            </Col>
          </Row>

          {/* Morning Slots Config */}
          <Card
            size="small"
            style={{
              marginBottom: 16,
              borderRadius: 'var(--radius-base)',
              backgroundColor: isDarkMode ? '#161b22' : '#f8fafc',
              border: `1px solid ${isDarkMode ? '#30363d' : '#e2e8f0'}`,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <Text strong style={{ fontSize: 13, color: '#d97706' }}>
                <ClockCircleOutlined style={{ marginRight: 6 }} />
                Morning Batch Slots (Within 05:30 AM – 12:00 PM)
              </Text>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
              {morningSlotsList.map((slot) => (
                <Tag
                  key={slot}
                  closable
                  onClose={() => handleRemoveSlot('morning', slot)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-base)',
                    backgroundColor: isDarkMode ? '#21262d' : '#ffffff',
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  {slot}
                </Tag>
              ))}
              {morningSlotsList.length === 0 && (
                <Text type="secondary" style={{ fontSize: 12 }}>No morning slots added yet.</Text>
              )}
            </div>
            <Space.Compact style={{ width: '100%' }}>
              <Select
                placeholder="Select quick time slot"
                value={newMorningSlot || undefined}
                onChange={(val) => setNewMorningSlot(val)}
                style={{ width: 'calc(100% - 100px)' }}
                options={[
                  { value: '06:00 AM', label: '06:00 AM' },
                  { value: '06:30 AM', label: '06:30 AM' },
                  { value: '07:00 AM', label: '07:00 AM' },
                  { value: '07:30 AM', label: '07:30 AM' },
                  { value: '08:00 AM', label: '08:00 AM' },
                  { value: '08:30 AM', label: '08:30 AM' },
                  { value: '09:00 AM', label: '09:00 AM' },
                  { value: '09:30 AM', label: '09:30 AM' },
                  { value: '10:00 AM', label: '10:00 AM' },
                  { value: '11:00 AM', label: '11:00 AM' },
                ]}
              />
              <Button type="primary" onClick={handleAddMorningSlot} style={{ width: 100, backgroundColor: '#003882' }}>
                Add Slot
              </Button>
            </Space.Compact>
          </Card>

          {/* Evening Slots Config */}
          <Card
            size="small"
            style={{
              marginBottom: 16,
              borderRadius: 'var(--radius-base)',
              backgroundColor: isDarkMode ? '#161b22' : '#f8fafc',
              border: `1px solid ${isDarkMode ? '#30363d' : '#e2e8f0'}`,
            }}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 8 }}>
              <Text strong style={{ fontSize: 13, color: '#6366f1' }}>
                <ClockCircleOutlined style={{ marginRight: 6 }} />
                Evening Batch Slots (Within 04:30 PM – 10:30 PM)
              </Text>
            </div>
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8, marginBottom: 12 }}>
              {eveningSlotsList.map((slot) => (
                <Tag
                  key={slot}
                  closable
                  onClose={() => handleRemoveSlot('evening', slot)}
                  style={{
                    padding: '4px 10px',
                    borderRadius: 'var(--radius-base)',
                    backgroundColor: isDarkMode ? '#21262d' : '#ffffff',
                    fontSize: 12,
                    fontWeight: 600,
                  }}
                >
                  {slot}
                </Tag>
              ))}
              {eveningSlotsList.length === 0 && (
                <Text type="secondary" style={{ fontSize: 12 }}>No evening slots added yet.</Text>
              )}
            </div>
            <Space.Compact style={{ width: '100%' }}>
              <Select
                placeholder="Select quick time slot"
                value={newEveningSlot || undefined}
                onChange={(val) => setNewEveningSlot(val)}
                style={{ width: 'calc(100% - 100px)' }}
                options={[
                  { value: '05:00 PM', label: '05:00 PM' },
                  { value: '05:30 PM', label: '05:30 PM' },
                  { value: '06:00 PM', label: '06:00 PM' },
                  { value: '06:30 PM', label: '06:30 PM' },
                  { value: '07:00 PM', label: '07:00 PM' },
                  { value: '07:30 PM', label: '07:30 PM' },
                  { value: '08:00 PM', label: '08:00 PM' },
                  { value: '08:30 PM', label: '08:30 PM' },
                  { value: '09:00 PM', label: '09:00 PM' },
                  { value: '09:30 PM', label: '09:30 PM' },
                ]}
              />
              <Button type="primary" onClick={handleAddEveningSlot} style={{ width: 100, backgroundColor: '#003882' }}>
                Add Slot
              </Button>
            </Space.Compact>
          </Card>

          {/* Active Days */}
          <Form.Item
            name="activeDays"
            label="Active Days of the Week"
            rules={[{ required: true, message: 'Select active days' }]}
          >
            <Select
              mode="multiple"
              size="large"
              placeholder="Select active days"
              options={DAYS_OPTIONS}
              style={{ borderRadius: 'var(--radius-base)' }}
            />
          </Form.Item>

          {/* Description */}
          <Form.Item name="description" label="Section Description / Notes">
            <Input.TextArea
              rows={2}
              placeholder="e.g. Mats provided. Bring water and sweat towel."
              style={{ borderRadius: 'var(--radius-base)' }}
            />
          </Form.Item>

          {/* Live Switch */}
          <Form.Item name="isActive" valuePropName="checked" label="Section Status">
            <Space>
              <Switch defaultChecked />
              <Text style={{ fontSize: 13, color: isDarkMode ? '#8b949e' : '#64748b' }}>
                Enable online booking on GYMEZY user app
              </Text>
            </Space>
          </Form.Item>

          {/* Submit */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
            <Button size="large" onClick={() => setIsModalOpen(false)}>
              Cancel
            </Button>
            <Button
              type="primary"
              size="large"
              htmlType="submit"
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
