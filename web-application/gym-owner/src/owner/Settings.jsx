import React, { useState } from 'react';
import {
  Card,
  Form,
  Input,
  InputNumber,
  Button,
  Row,
  Col,
  Tag,
  Typography,
  Divider,
  Space,
  Select,
  message,
} from 'antd';
import { useSelector, useDispatch } from 'react-redux';
import {
  ShopOutlined,
  SaveOutlined,
  EnvironmentOutlined,
  PhoneOutlined,
  ClockCircleOutlined,
  SafetyCertificateOutlined,
  ThunderboltFilled,
} from '@ant-design/icons';
import { useTheme } from '../theme/ThemeContext';
import { updateGymProfile } from '../redux/slices/gymSlice';

const { Title, Text, Paragraph } = Typography;

export const Settings = () => {
  const dispatch = useDispatch();
  const { isDarkMode } = useTheme();
  const { gymProfile } = useSelector((state) => state.gym);

  const [form] = Form.useForm();
  const [selectedFacilities, setSelectedFacilities] = useState(gymProfile.facilities || []);
  const [selectedAmenities, setSelectedAmenities] = useState(gymProfile.amenities || []);

  const allFacilities = [
    'AC Gym',
    'Locker Facility',
    'Shower Available',
    'Changing Room',
    'Free Wi-Fi',
    'Music System',
    'Steam Bath',
    'Sauna',
    'Cardio Section',
    'CrossFit Rig',
  ];

  const allAmenities = [
    'Drinking Water',
    'Towel Service',
    'Parking Available',
    'Protein Bar',
    'Juice Bar',
    'First Aid Kit',
    'Personal Lockers',
    'Shoe Rack',
  ];

  const toggleFacility = (item) => {
    setSelectedFacilities((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const toggleAmenity = (item) => {
    setSelectedAmenities((prev) =>
      prev.includes(item) ? prev.filter((i) => i !== item) : [...prev, item]
    );
  };

  const handleSaveProfile = (values) => {
    dispatch(
      updateGymProfile({
        ...values,
        facilities: selectedFacilities,
        amenities: selectedAmenities,
      })
    );
    message.success('Gym profile & turnstile capacity configuration updated!');
  };

  return (
    <div>
      {/* Header */}
      <div style={{ marginBottom: 28 }}>
        <Title level={2} style={{ margin: 0, color: isDarkMode ? '#ffffff' : '#0f172a', fontWeight: 650 }}>
          Gym Center Settings
        </Title>
        <Text style={{ color: isDarkMode ? '#888888' : '#64748b', fontSize: 14 }}>
          Manage your fitness center information, capacity limits, operating hours, and amenities.
        </Text>
      </div>

      <Form
        form={form}
        layout="vertical"
        initialValues={gymProfile}
        onFinish={handleSaveProfile}
      >
        <Row gutter={[24, 24]}>
          {/* Main Info */}
          <Col xs={24} lg={14}>
            <Card
              title={<span style={{ color: isDarkMode ? '#ffffff' : '#0f172a' }}>Fitness Center Details</span>}
              style={{
                backgroundColor: isDarkMode ? '#0d0d0d' : '#ffffff',
                borderColor: isDarkMode ? '#222222' : '#e2e8f0',
                borderRadius: 'var(--radius-base)',
                marginBottom: 24,
              }}
            >
              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item label="Gym Business Name" name="name" rules={[{ required: true }]}>
                    <Input prefix={<ShopOutlined />} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item label="Branch Location" name="branch" rules={[{ required: true }]}>
                    <Input prefix={<EnvironmentOutlined />} />
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item label="Full Registered Address" name="fullAddress" rules={[{ required: true }]}>
                <Input.TextArea rows={2} />
              </Form.Item>

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item label="Owner Contact Email" name="email" rules={[{ required: true, type: 'email' }]}>
                    <Input />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item label="Phone Hotline" name="phone" rules={[{ required: true }]}>
                    <Input prefix={<PhoneOutlined />} />
                  </Form.Item>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item label="Operating Hours" name="openingHours" rules={[{ required: true }]}>
                    <Input prefix={<ClockCircleOutlined />} placeholder="e.g. 05:30 AM - 10:30 PM" />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item
                    label="Maximum Floor Capacity (Turnstile Limit)"
                    name="floorCapacity"
                    rules={[{ required: true }]}
                  >
                    <InputNumber style={{ width: '100%' }} min={10} max={1000} />
                  </Form.Item>
                </Col>
              </Row>

              <Button
                type="primary"
                htmlType="submit"
                size="large"
                icon={<SaveOutlined />}
                style={{
                  backgroundColor: '#003882',
                  borderColor: '#003882',
                  fontWeight: 700,
                  borderRadius: 'var(--radius-base)',
                  marginTop: 8,
                }}
              >
                Save Changes
              </Button>
            </Card>
          </Col>

          {/* Facilities & Amenities */}
          <Col xs={24} lg={10}>
            <Card
              title={<span style={{ color: isDarkMode ? '#ffffff' : '#0f172a' }}>Facilities & Amenities Tags</span>}
              style={{
                backgroundColor: isDarkMode ? '#0d0d0d' : '#ffffff',
                borderColor: isDarkMode ? '#222222' : '#e2e8f0',
                borderRadius: 'var(--radius-base)',
              }}
            >
              <div style={{ marginBottom: 20 }}>
                <div style={{ fontWeight: 700, fontSize: 13, color: isDarkMode ? '#ffffff' : '#0f172a', marginBottom: 10 }}>
                  Facilities Available (Click to Toggle):
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {allFacilities.map((fac) => {
                    const isSelected = selectedFacilities.includes(fac);
                    return (
                      <Tag.CheckableTag
                        key={fac}
                        checked={isSelected}
                        onChange={() => toggleFacility(fac)}
                        style={{
                          padding: '6px 14px',
                          borderRadius: 20,
                          fontSize: 13,
                          fontWeight: 600,
                          border: `1px solid ${isSelected ? '#1677ff' : isDarkMode ? '#333333' : '#d9d9d9'}`,
                        }}
                      >
                        {fac}
                      </Tag.CheckableTag>
                    );
                  })}
                </div>
              </div>

              <Divider style={{ borderColor: isDarkMode ? '#222222' : '#e2e8f0', margin: '20px 0' }} />

              <div>
                <div style={{ fontWeight: 700, fontSize: 13, color: isDarkMode ? '#ffffff' : '#0f172a', marginBottom: 10 }}>
                  Member Amenities Included:
                </div>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
                  {allAmenities.map((amenity) => {
                    const isSelected = selectedAmenities.includes(amenity);
                    return (
                      <Tag.CheckableTag
                        key={amenity}
                        checked={isSelected}
                        onChange={() => toggleAmenity(amenity)}
                        style={{
                          padding: '6px 14px',
                          borderRadius: 20,
                          fontSize: 13,
                          fontWeight: 600,
                          border: `1px solid ${isSelected ? '#00bf62' : isDarkMode ? '#333333' : '#d9d9d9'}`,
                        }}
                      >
                        {amenity}
                      </Tag.CheckableTag>
                    );
                  })}
                </div>
              </div>
            </Card>
          </Col>
        </Row>
      </Form>
    </div>
  );
};

export default Settings;
