import React, { useState, useEffect, useMemo } from 'react';
import {
  Card,
  Row,
  Col,
  Input,
  Select,
  Button,
  Table,
  Tag,
  Modal,
  Form,
  Typography,
  Space,
  message,
  Switch,
  Popconfirm,
  Tooltip,
  Upload,
  Spin,
  Badge,
} from 'antd';
import {
  PlusOutlined,
  EditOutlined,
  DeleteOutlined,
  PictureOutlined,
  StarFilled,
  StarOutlined,
  EnvironmentOutlined,
  ShopOutlined,
  UploadOutlined,
  CheckCircleOutlined,
  StopOutlined,
  ThunderboltFilled,
  ReloadOutlined,
  FireOutlined,
} from '@ant-design/icons';
import { useTheme } from '../theme/ThemeContext';
import { bannerService } from '../services/bannerService';
import { apiClient } from '../services/apiClient';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;

const QUICK_BADGES = [
  '30% OFF PASS',
  'FEATURED DEAL',
  'LIMITED PERIOD',
  'NEW OPENING',
  'FLAT 50% OFF',
  'EXCLUSIVE ACCESS',
];

export const BannerManagement = () => {
  const { isDarkMode } = useTheme();
  const [form] = Form.useForm();

  // State
  const [banners, setBanners] = useState([]);
  const [gyms, setGyms] = useState([]);
  const [loading, setLoading] = useState(false);
  const [gymsLoading, setGymsLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingBanner, setEditingBanner] = useState(null);
  const [submitting, setSubmitting] = useState(false);
  const [searchQuery, setSearchQuery] = useState('');
  const [priorityFilter, setPriorityFilter] = useState('ALL');

  // Image Upload State
  const [previewImage, setPreviewImage] = useState('');
  const [imageSizeKb, setImageSizeKb] = useState(0);

  // Fetch Banners
  const fetchBanners = async () => {
    try {
      setLoading(true);
      const res = await bannerService.getAllBanners();
      const bannerList = Array.isArray(res?.data)
        ? res.data
        : Array.isArray(res)
          ? res
          : [];
      setBanners(bannerList);
    } catch (err) {
      console.error('Failed to load banners:', err);
      message.error(err.message || 'Failed to load promotional banners');
      setBanners([]);
    } finally {
      setLoading(false);
    }
  };

  // Fetch Gyms for Dropdown
  const fetchGyms = async () => {
    try {
      setGymsLoading(true);
      const res = await apiClient.get('/gyms');
      const rawData = res.data;
      let gymList = [];
      if (Array.isArray(rawData)) {
        gymList = rawData;
      } else if (Array.isArray(rawData?.data?.gyms)) {
        gymList = rawData.data.gyms;
      } else if (Array.isArray(rawData?.data)) {
        gymList = rawData.data;
      } else if (Array.isArray(rawData?.gyms)) {
        gymList = rawData.gyms;
      }
      setGyms(gymList);
    } catch (err) {
      console.error('Failed to load gyms for banner mapping:', err);
      setGyms([]);
    } finally {
      setGymsLoading(false);
    }
  };

  useEffect(() => {
    fetchBanners();
    fetchGyms();
  }, []);

  // Filtered Banners
  const filteredBanners = useMemo(() => {
    const list = Array.isArray(banners) ? banners : [];
    return list.filter((b) => {
      const matchSearch =
        searchQuery === '' ||
        b.title?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.gymName?.toLowerCase().includes(searchQuery.toLowerCase()) ||
        b.gymArea?.toLowerCase().includes(searchQuery.toLowerCase());

      const matchPriority =
        priorityFilter === 'ALL' ||
        (priorityFilter === 'PRIORITY' && b.isPriority) ||
        (priorityFilter === 'NORMAL' && !b.isPriority);

      return matchSearch && matchPriority;
    });
  }, [banners, searchQuery, priorityFilter]);

  // Statistics
  const bannerListSafe = Array.isArray(banners) ? banners : [];
  const totalBanners = bannerListSafe.length;
  const priorityCount = bannerListSafe.filter((b) => b.isPriority).length;
  const activeCount = bannerListSafe.filter((b) => b.isActive).length;

  // Open Create Modal
  const handleOpenCreateModal = () => {
    setEditingBanner(null);
    setPreviewImage('');
    setImageSizeKb(0);
    form.resetFields();
    form.setFieldsValue({
      badgeText: 'FEATURED DEAL',
      isPriority: false,
      isActive: true,
    });
    setIsModalOpen(true);
  };

  // Open Edit Modal
  const handleOpenEditModal = (banner) => {
    setEditingBanner(banner);
    const existingImg = banner.image?.fileData || banner.imageUrl || '';
    setPreviewImage(existingImg);
    setImageSizeKb(banner.image?.fileSizeKb || 0);

    form.resetFields();
    form.setFieldsValue({
      title: banner.title,
      subtitle: banner.subtitle,
      badgeText: banner.badgeText || 'FEATURED DEAL',
      gymId: banner.gymId?._id || banner.gymId,
      isPriority: Boolean(banner.isPriority),
      isActive: Boolean(banner.isActive),
    });
    setIsModalOpen(true);
  };

  // Handle Image Selection
  const handleImageSelect = (file) => {
    const isImage = file.type.startsWith('image/');
    if (!isImage) {
      message.error('You can only upload image files (PNG, JPG, WebP)!');
      return false;
    }

    const reader = new FileReader();
    reader.onload = (e) => {
      const base64Data = e.target.result;
      setPreviewImage(base64Data);
      const approxKb = Math.round((base64Data.length * 3) / 4 / 1024);
      setImageSizeKb(approxKb);
    };
    reader.readAsDataURL(file);
    return false; // Prevent automatic upload
  };

  // Handle Form Submission
  const handleSubmit = async (values) => {
    try {
      if (!previewImage && !editingBanner) {
        message.error('Please upload an image for the promotional banner');
        return;
      }

      setSubmitting(true);
      const payload = {
        title: values.title,
        subtitle: values.subtitle || '',
        badgeText: values.badgeText || 'FEATURED DEAL',
        gymId: values.gymId,
        isPriority: Boolean(values.isPriority),
        isActive: Boolean(values.isActive),
        image: previewImage,
      };

      if (editingBanner) {
        await bannerService.updateBanner(editingBanner._id, payload);
        message.success('Banner updated successfully with WebP compression');
      } else {
        await bannerService.createBanner(payload);
        message.success('Banner created and compressed to WebP successfully');
      }

      setIsModalOpen(false);
      fetchBanners();
    } catch (err) {
      console.error('Error saving banner:', err);
      message.error(err.message || 'Failed to save promotional banner');
    } finally {
      setSubmitting(false);
    }
  };

  // Toggle Priority
  const handleTogglePriority = async (banner) => {
    try {
      await bannerService.togglePriority(banner._id);
      message.success(
        `Banner "${banner.title}" priority set to ${!banner.isPriority ? 'HIGH (First in list)' : 'NORMAL'}`
      );
      fetchBanners();
    } catch (err) {
      message.error(err.message || 'Failed to toggle priority');
    }
  };

  // Toggle Active Status
  const handleToggleActive = async (banner, checked) => {
    try {
      await bannerService.updateBanner(banner._id, { isActive: checked });
      message.success(`Banner status updated to ${checked ? 'Active' : 'Inactive'}`);
      fetchBanners();
    } catch (err) {
      message.error(err.message || 'Failed to update active status');
    }
  };

  // Delete Banner
  const handleDeleteBanner = async (id) => {
    try {
      await bannerService.deleteBanner(id);
      message.success('Banner deleted successfully');
      fetchBanners();
    } catch (err) {
      message.error(err.message || 'Failed to delete banner');
    }
  };

  // Table Columns
  const columns = [
    {
      title: 'Banner Preview',
      key: 'preview',
      width: 140,
      render: (_, record) => {
        const imgSrc = record.image?.fileData || record.imageUrl;
        return (
          <div
            style={{
              width: 120,
              height: 68,
              borderRadius: 8,
              overflow: 'hidden',
              backgroundColor: isDarkMode ? '#1e293b' : '#f1f5f9',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              border: isDarkMode ? '1px solid #334155' : '1px solid #e2e8f0',
              position: 'relative',
            }}
          >
            {imgSrc ? (
              <img
                src={imgSrc}
                alt={record.title}
                style={{ width: '100%', height: '100%', objectFit: 'cover' }}
              />
            ) : (
              <PictureOutlined style={{ fontSize: 24, color: '#94a3b8' }} />
            )}
            {record.isPriority && (
              <div
                style={{
                  position: 'absolute',
                  top: 4,
                  left: 4,
                  backgroundColor: '#f59e0b',
                  color: '#ffffff',
                  borderRadius: 4,
                  padding: '2px 4px',
                  fontSize: 10,
                  fontWeight: 700,
                  display: 'flex',
                  alignItems: 'center',
                  gap: 2,
                }}
              >
                <StarFilled style={{ fontSize: 9 }} /> PRIORITY
              </div>
            )}
          </div>
        );
      },
    },
    {
      title: 'Title & Badge',
      key: 'title',
      render: (_, record) => (
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginBottom: 4 }}>
            <Tag color="#6366f1" style={{ fontWeight: 700, borderRadius: 4 }}>
              {record.badgeText || 'PROMO'}
            </Tag>
            <Text strong style={{ fontSize: 14, color: isDarkMode ? '#f8fafc' : '#0f172a' }}>
              {record.title}
            </Text>
          </div>
          {record.subtitle && (
            <Text style={{ fontSize: 12, color: isDarkMode ? '#94a3b8' : '#64748b' }}>
              {record.subtitle}
            </Text>
          )}
          {record.image?.fileSizeKb > 0 && (
            <div style={{ marginTop: 4 }}>
              <Tag style={{ fontSize: 10 }}>WebP • {record.image.fileSizeKb} KB</Tag>
            </div>
          )}
        </div>
      ),
    },
    {
      title: 'Linked Gym & Area',
      key: 'gym',
      render: (_, record) => {
        const gymName = record.gymName || record.gymId?.name || 'Unassigned Gym';
        const gymArea = record.gymArea || record.gymId?.area || 'Chennai';
        const gymSlug = record.gymSlug || record.gymId?.slug || '';
        return (
          <div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <ShopOutlined style={{ color: '#0ea5e9' }} />
              <Text strong style={{ color: isDarkMode ? '#f1f5f9' : '#1e293b' }}>
                {gymName}
              </Text>
            </div>
            <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginTop: 4 }}>
              <EnvironmentOutlined style={{ fontSize: 12, color: '#94a3b8' }} />
              <Text style={{ fontSize: 12, color: isDarkMode ? '#cbd5e1' : '#475569' }}>
                {gymArea}
              </Text>
              {gymSlug && (
                <Tag color="cyan" style={{ fontSize: 11, padding: '0 4px', lineHeight: '18px' }}>
                  /{gymSlug}
                </Tag>
              )}
            </div>
          </div>
        );
      },
    },
    {
      title: 'Priority Flag',
      key: 'isPriority',
      width: 140,
      render: (_, record) => (
        <Tooltip
          title={
            record.isPriority
              ? 'Priority banner: always shown at the top of the user app'
              : 'Click to prioritize this banner above regular distance sorting'
          }
        >
          <Button
            size="small"
            type={record.isPriority ? 'primary' : 'default'}
            icon={record.isPriority ? <StarFilled /> : <StarOutlined />}
            onClick={() => handleTogglePriority(record)}
            style={{
              backgroundColor: record.isPriority ? '#f59e0b' : 'transparent',
              borderColor: record.isPriority ? '#d97706' : isDarkMode ? '#475569' : '#cbd5e1',
              color: record.isPriority ? '#ffffff' : isDarkMode ? '#e2e8f0' : '#475569',
              fontWeight: 600,
              fontSize: 12,
            }}
          >
            {record.isPriority ? 'Priority' : 'Normal'}
          </Button>
        </Tooltip>
      ),
    },
    {
      title: 'Active',
      key: 'isActive',
      width: 100,
      render: (_, record) => (
        <Switch
          checked={record.isActive}
          onChange={(checked) => handleToggleActive(record, checked)}
          checkedChildren="ON"
          unCheckedChildren="OFF"
        />
      ),
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 110,
      render: (_, record) => (
        <Space size="small">
          <Tooltip title="Edit Banner">
            <Button
              type="text"
              icon={<EditOutlined style={{ color: '#3b82f6' }} />}
              onClick={() => handleOpenEditModal(record)}
            />
          </Tooltip>
          <Tooltip title="Delete Banner">
            <Popconfirm
              title="Delete Promotional Banner"
              description="Are you sure you want to permanently delete this banner?"
              onConfirm={() => handleDeleteBanner(record._id)}
              okText="Yes, Delete"
              cancelText="Cancel"
              okButtonProps={{ danger: true }}
            >
              <Button type="text" danger icon={<DeleteOutlined />} />
            </Popconfirm>
          </Tooltip>
        </Space>
      ),
    },
  ];

  return (
    <div style={{ padding: '24px', maxWidth: 1400, margin: '0 auto' }}>
      {/* Header Row */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: 24,
          flexWrap: 'wrap',
          gap: 16,
        }}
      >
        <div>
          <Title
            level={3}
            style={{ margin: 0, color: isDarkMode ? '#f8fafc' : '#0f172a', fontWeight: 800 }}
          >
            Promotional Banners & Ads
          </Title>
          <Paragraph
            style={{
              margin: '4px 0 0 0',
              color: isDarkMode ? '#94a3b8' : '#64748b',
              fontSize: 14,
            }}
          >
            Upload banners with automatic WebP compression, map by Gym Mongo ID & slug, and configure
            priority & location sorting.
          </Paragraph>
        </div>

        <Space>
          <Button icon={<ReloadOutlined />} onClick={fetchBanners} loading={loading}>
            Refresh
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={handleOpenCreateModal}
            style={{
              backgroundColor: '#6366f1',
              borderColor: '#6366f1',
              fontWeight: 600,
              height: 40,
              borderRadius: 8,
            }}
          >
            Create New Banner
          </Button>
        </Space>
      </div>

      {/* Metric Cards */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        <Col xs={24} sm={8}>
          <Card
            bordered={false}
            style={{
              borderRadius: 12,
              backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <Text style={{ color: isDarkMode ? '#94a3b8' : '#64748b', fontSize: 13 }}>
                  Total Banners
                </Text>
                <Title level={2} style={{ margin: '4px 0 0 0', color: isDarkMode ? '#f8fafc' : '#0f172a' }}>
                  {totalBanners}
                </Title>
              </div>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  backgroundColor: isDarkMode ? 'rgba(99,102,241,0.15)' : '#e0e7ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#6366f1',
                  fontSize: 22,
                }}
              >
                <PictureOutlined />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card
            bordered={false}
            style={{
              borderRadius: 12,
              backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <Text style={{ color: isDarkMode ? '#94a3b8' : '#64748b', fontSize: 13 }}>
                  Priority Banners (Top of Queue)
                </Text>
                <Title level={2} style={{ margin: '4px 0 0 0', color: '#f59e0b' }}>
                  {priorityCount}
                </Title>
              </div>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  backgroundColor: isDarkMode ? 'rgba(245,158,11,0.15)' : '#fef3c7',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#f59e0b',
                  fontSize: 22,
                }}
              >
                <StarFilled />
              </div>
            </div>
          </Card>
        </Col>

        <Col xs={24} sm={8}>
          <Card
            bordered={false}
            style={{
              borderRadius: 12,
              backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
              boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <div>
                <Text style={{ color: isDarkMode ? '#94a3b8' : '#64748b', fontSize: 13 }}>
                  Active On Mobile App
                </Text>
                <Title level={2} style={{ margin: '4px 0 0 0', color: '#10b981' }}>
                  {activeCount}
                </Title>
              </div>
              <div
                style={{
                  width: 48,
                  height: 48,
                  borderRadius: 12,
                  backgroundColor: isDarkMode ? 'rgba(16,185,129,0.15)' : '#d1fae5',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  color: '#10b981',
                  fontSize: 22,
                }}
              >
                <CheckCircleOutlined />
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* Filter Toolbar */}
      <Card
        bordered={false}
        style={{
          borderRadius: 12,
          backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
          marginBottom: 16,
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
        }}
      >
        <Row gutter={[16, 16]} align="middle">
          <Col xs={24} sm={12} md={8}>
            <Input
              placeholder="Search by title, gym name, or area..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              allowClear
              style={{ borderRadius: 8 }}
            />
          </Col>
          <Col xs={24} sm={12} md={6}>
            <Select
              value={priorityFilter}
              onChange={setPriorityFilter}
              style={{ width: '100%', borderRadius: 8 }}
            >
              <Option value="ALL">All Banners</Option>
              <Option value="PRIORITY">Priority Only</Option>
              <Option value="NORMAL">Normal Only</Option>
            </Select>
          </Col>
          <Col xs={24} md={10} style={{ textAlign: 'right' }}>
            <Text style={{ color: isDarkMode ? '#94a3b8' : '#64748b', fontSize: 13 }}>
              Showing {filteredBanners.length} of {totalBanners} banners
            </Text>
          </Col>
        </Row>
      </Card>

      {/* Banners Table */}
      <Card
        bordered={false}
        style={{
          borderRadius: 12,
          backgroundColor: isDarkMode ? '#1e293b' : '#ffffff',
          boxShadow: '0 1px 3px rgba(0,0,0,0.05)',
          overflow: 'hidden',
        }}
      >
        <Table
          dataSource={filteredBanners}
          columns={columns}
          rowKey="_id"
          loading={loading}
          pagination={{ pageSize: 8, showSizeChanger: true }}
          locale={{ emptyText: 'No promotional banners found. Click "Create New Banner" to add one!' }}
        />
      </Card>

      {/* Create / Edit Modal */}
      <Modal
        title={
          <div style={{ display: 'flex', alignItems: 'center', gap: 8 }}>
            <PictureOutlined style={{ color: '#6366f1' }} />
            <span>{editingBanner ? 'Edit Promotional Banner' : 'Create Promotional Banner'}</span>
          </div>
        }
        open={isModalOpen}
        onCancel={() => setIsModalOpen(false)}
        footer={null}
        width={680}
        destroyOnClose
      >
        <Form
          form={form}
          layout="vertical"
          onFinish={handleSubmit}
          style={{ marginTop: 16 }}
        >
          {/* Gym Selector (Searchable Dropdown) */}
          <Form.Item
            label="Select Gym (Auto-maps Mongo ObjectId & Location Slug)"
            name="gymId"
            rules={[{ required: true, message: 'Please select a gym' }]}
            extra="User app automatically calculates distance to this gym and enables direct booking on tap."
          >
            <Select
              showSearch
              placeholder="Search and select gym..."
              loading={gymsLoading}
              optionFilterProp="label"
              filterOption={(input, option) =>
                String(option?.label || '')
                  .toLowerCase()
                  .includes(String(input || '').trim().toLowerCase())
              }
              options={(Array.isArray(gyms) ? gyms : []).map((g) => ({
                value: g._id || g.id,
                label: `${g.name || 'Gym'} — ${g.area || g.city || 'Chennai'}${g.slug ? ` (/${g.slug})` : ''}`,
              }))}
              style={{ borderRadius: 8 }}
            />
          </Form.Item>

          {/* Banner Title */}
          <Form.Item
            label="Banner Title / Headline"
            name="title"
            rules={[{ required: true, message: 'Banner headline is required' }]}
          >
            <Input
              placeholder="e.g. 30% Off Pass, Summer Fitness Festival"
              maxLength={120}
              style={{ borderRadius: 8 }}
            />
          </Form.Item>

          {/* Subtitle / Description */}
          <Form.Item label="Subtitle / Tagline (Optional)" name="subtitle">
            <Input
              placeholder="e.g. Valid on all day passes & weekly workouts"
              maxLength={200}
              style={{ borderRadius: 8 }}
            />
          </Form.Item>

          {/* Promotional Badge */}
          <Form.Item
            label="Promotional Badge Tag"
            name="badgeText"
            extra="Quick tags click to auto-fill:"
          >
            <Input placeholder="e.g. 30% OFF PASS" maxLength={50} style={{ borderRadius: 8 }} />
          </Form.Item>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 16, marginTop: -8 }}>
            {QUICK_BADGES.map((b) => (
              <Tag
                key={b}
                style={{ cursor: 'pointer', borderRadius: 4 }}
                onClick={() => form.setFieldsValue({ badgeText: b })}
              >
                + {b}
              </Tag>
            ))}
          </div>

          {/* Priority & Status Switches */}
          <Row gutter={16}>
            <Col span={12}>
              <Form.Item
                label="Priority Flag"
                name="isPriority"
                valuePropName="checked"
                extra="Priority banners always float to top of user app regardless of distance."
              >
                <Switch
                  checkedChildren="PRIORITY"
                  unCheckedChildren="NORMAL"
                  style={{ backgroundColor: form.getFieldValue('isPriority') ? '#f59e0b' : undefined }}
                />
              </Form.Item>
            </Col>
            <Col span={12}>
              <Form.Item
                label="Active Status"
                name="isActive"
                valuePropName="checked"
                extra="When active, displayed live in user mobile application carousel."
              >
                <Switch checkedChildren="ACTIVE" unCheckedChildren="HIDDEN" />
              </Form.Item>
            </Col>
          </Row>

          {/* Image Upload Zone */}
          <Form.Item
            label="Banner Graphic Image"
            required={!editingBanner}
            extra="Recommended size: 800x450 or 1200x600. File is automatically optimized to ultra-fast WebP."
          >
            <div style={{ display: 'flex', flexDirection: 'column', gap: 12 }}>
              <Upload
                beforeUpload={handleImageSelect}
                showUploadList={false}
                accept="image/*"
              >
                <Button icon={<UploadOutlined />} style={{ borderRadius: 8 }}>
                  Choose Image File
                </Button>
              </Upload>

              {previewImage ? (
                <div
                  style={{
                    position: 'relative',
                    width: '100%',
                    height: 180,
                    borderRadius: 12,
                    overflow: 'hidden',
                    border: '1px solid #cbd5e1',
                    backgroundColor: '#0f172a',
                  }}
                >
                  <img
                    src={previewImage}
                    alt="Preview"
                    style={{ width: '100%', height: '100%', objectFit: 'cover' }}
                  />
                  <div
                    style={{
                      position: 'absolute',
                      bottom: 8,
                      right: 8,
                      backgroundColor: 'rgba(0,0,0,0.7)',
                      color: '#ffffff',
                      borderRadius: 6,
                      padding: '4px 8px',
                      fontSize: 11,
                      fontWeight: 600,
                    }}
                  >
                    Size: ~{imageSizeKb} KB (Sharp WebP compression active)
                  </div>
                </div>
              ) : null}
            </div>
          </Form.Item>

          {/* Form Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 24 }}>
            <Button onClick={() => setIsModalOpen(false)}>Cancel</Button>
            <Button
              type="primary"
              htmlType="submit"
              loading={submitting}
              style={{
                backgroundColor: '#6366f1',
                borderColor: '#6366f1',
                fontWeight: 600,
                borderRadius: 8,
              }}
            >
              {editingBanner ? 'Save Changes' : 'Create & Compress Banner'}
            </Button>
          </div>
        </Form>
      </Modal>
    </div>
  );
};

export default BannerManagement;
