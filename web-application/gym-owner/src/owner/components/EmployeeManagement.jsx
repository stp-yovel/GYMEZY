import React, { useState } from 'react';
import {
  Card,
  Table,
  Tag,
  Button,
  Row,
  Col,
  Input,
  Select,
  Typography,
  Avatar,
  Dropdown,
  Modal,
  Form,
  DatePicker,
  TimePicker,
  Checkbox,
  Pagination,
  message,
  Space,
} from 'antd';
import {
  PlusOutlined,
  SearchOutlined,
  FilterOutlined,
  ReloadOutlined,
  CalendarOutlined,
  TeamOutlined,
  UserOutlined,
  UserAddOutlined,
  ClockCircleOutlined,
  CheckCircleOutlined,
  CloseCircleOutlined,
  MoreOutlined,
  EyeOutlined,
  EditOutlined,
  PhoneOutlined,
  MailOutlined,
  IdcardOutlined,
  CrownOutlined,
  CameraOutlined,
  UploadOutlined,
  DeleteOutlined,
  PoweroffOutlined,
  SaveOutlined,
  ArrowRightOutlined,
  ArrowLeftOutlined,
  CheckOutlined,
  FilePdfOutlined,
  FileImageOutlined,
  CheckCircleFilled,
  DownOutlined,
  UsergroupAddOutlined,
  ShopOutlined,
  InfoCircleOutlined,
} from '@ant-design/icons';
import confetti from 'canvas-confetti';
import { useTheme } from '../../theme/ThemeContext';

const { Title, Text, Paragraph } = Typography;
const { Option } = Select;
const { TextArea } = Input;

// Exact Mock Dataset Matching User Reference
export const INITIAL_EMPLOYEES = [
  {
    key: '1',
    employeeId: 'EMP001',
    name: 'Arun Kumar',
    role: 'Front Desk Manager',
    phone: '+91 98765 43210',
    email: 'arun.kumar@fizonegym.com',
    avatar: 'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop',
    joinDate: '15 May 2024',
    status: 'Active',
    attendance: 'Present',
    accessType: 'Admin',
    branch: 'FitZone Gym - Anna Nagar, Chennai',
  },
  {
    key: '2',
    employeeId: 'EMP002',
    name: 'Priya Sharma',
    role: 'Trainer',
    phone: '+91 91234 56789',
    email: 'priya.sharma@fizonegym.com',
    avatar: 'https://images.unsplash.com/photo-1494790108377-be9c29b29330?q=80&w=150&auto=format&fit=crop',
    joinDate: '10 Feb 2024',
    status: 'Active',
    attendance: 'Present',
    accessType: 'Employee',
    branch: 'FitZone Gym - Anna Nagar, Chennai',
  },
  {
    key: '3',
    employeeId: 'EMP003',
    name: 'Vikram Singh',
    role: 'Trainer',
    phone: '+91 99876 54321',
    email: 'vikram.singh@fizonegym.com',
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
    joinDate: '01 Mar 2024',
    status: 'Active',
    attendance: 'Present',
    accessType: 'Employee',
    branch: 'FitZone Gym - Anna Nagar, Chennai',
  },
  {
    key: '4',
    employeeId: 'EMP004',
    name: 'Neha Reddy',
    role: 'Customer Support',
    phone: '+91 90012 34567',
    email: 'neha.reddy@fizonegym.com',
    avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?q=80&w=150&auto=format&fit=crop',
    joinDate: '18 Apr 2024',
    status: 'Active',
    attendance: 'Absent',
    accessType: 'Employee',
    branch: 'FitZone Gym - Anna Nagar, Chennai',
  },
  {
    key: '5',
    employeeId: 'EMP005',
    name: 'Karthik R',
    role: 'Housekeeping',
    phone: '+91 98811 22334',
    email: 'karthik.r@fizonegym.com',
    avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?q=80&w=150&auto=format&fit=crop',
    joinDate: '22 Jan 2024',
    status: 'Active',
    attendance: 'Present',
    accessType: 'None',
    branch: 'FitZone Gym - Anna Nagar, Chennai',
  },
  {
    key: '6',
    employeeId: 'EMP006',
    name: 'Suresh Babu',
    role: 'Maintenance',
    phone: '+91 93412 66778',
    email: 'suresh.babu@fizonegym.com',
    avatar: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?q=80&w=150&auto=format&fit=crop',
    joinDate: '05 Jun 2024',
    status: 'On Leave',
    attendance: 'On Leave',
    accessType: 'None',
    branch: 'FitZone Gym - Anna Nagar, Chennai',
  },
  {
    key: '7',
    employeeId: 'EMP007',
    name: 'Sneha Iyer',
    role: 'Nutritionist',
    phone: '+91 93412 77889',
    email: 'sneha.iyer@fizonegym.com',
    avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?q=80&w=150&auto=format&fit=crop',
    joinDate: '12 Jul 2024',
    status: 'Active',
    attendance: 'Present',
    accessType: 'Employee',
    branch: 'FitZone Gym - Anna Nagar, Chennai',
  },
  {
    key: '8',
    employeeId: 'EMP008',
    name: 'Rahul Nair',
    role: 'Security',
    phone: '+91 90909 11223',
    email: 'rahul.nair@fizonegym.com',
    avatar: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?q=80&w=150&auto=format&fit=crop',
    joinDate: '28 Dec 2023',
    status: 'Inactive',
    attendance: '—',
    accessType: 'None',
    branch: 'FitZone Gym - Anna Nagar, Chennai',
  },
];

// Canvas Confetti Popper Trigger
export const triggerConfettiPopper = () => {
  try {
    const end = Date.now() + 1.2 * 1000;
    const colors = ['#722ed1', '#003882', '#00bf62', '#fa8c16', '#eb2f96', '#1677ff'];

    (function frame() {
      confetti({
        particleCount: 6,
        angle: 60,
        spread: 60,
        origin: { x: 0, y: 0.65 },
        colors: colors,
        zIndex: 99999,
      });
      confetti({
        particleCount: 6,
        angle: 120,
        spread: 60,
        origin: { x: 1, y: 0.65 },
        colors: colors,
        zIndex: 99999,
      });

      if (Date.now() < end) {
        requestAnimationFrame(frame);
      }
    })();

    confetti({
      particleCount: 75,
      spread: 90,
      origin: { y: 0.5 },
      colors: colors,
      zIndex: 99999,
    });
  } catch (err) {
    console.error('Confetti error:', err);
  }
};

/**
 * Reusable Employee Management Component
 */
export const EmployeeManagement = ({
  initialData = INITIAL_EMPLOYEES,
  onAddEmployee,
}) => {
  const { isDarkMode } = useTheme();

  // Forms
  const [addEmployeeForm] = Form.useForm();
  const [editEmployeeForm] = Form.useForm();
  const [tempStaffForm] = Form.useForm();

  // Data & Filters
  const [employeesList, setEmployeesList] = useState(initialData);
  const [namePhoneSearch, setNamePhoneSearch] = useState('');
  const [roleFilter, setRoleFilter] = useState('ALL');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [attendanceFilter, setAttendanceFilter] = useState('ALL');
  const [selectedDateRange, setSelectedDateRange] = useState('21 Jul 2025 - 21 Jul 2026');

  // Modal States
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [addStep, setAddStep] = useState(1);
  const [isTempStaffModalOpen, setIsTempStaffModalOpen] = useState(false);
  const [isDetailsModalOpen, setIsDetailsModalOpen] = useState(false);
  const [isSuccessModalOpen, setIsSuccessModalOpen] = useState(false);
  const [isDateRangeModalOpen, setIsDateRangeModalOpen] = useState(false);

  // Selected Records & Form Aux States
  const [selectedEmployee, setSelectedEmployee] = useState(null);
  const [addedEmployeeData, setAddedEmployeeData] = useState(null);
  const [tempDateRange, setTempDateRange] = useState(null);

  // Add Employee Form States
  const [addPhoto, setAddPhoto] = useState(null);
  const [empDocs, setEmpDocs] = useState([
    { key: '1', docType: 'Experience Letter', docNum: 'EXP123456', fileName: 'experience_letter.pdf', addedOn: '21 Jul 2025' },
  ]);
  const [personalDocs, setPersonalDocs] = useState([
    { key: '1', docType: 'Aadhaar Card', docNum: 'XXXX XXXX 1234', fileName: 'aadhar_card.pdf', addedOn: '21 Jul 2025' },
    { key: '2', docType: 'PAN Card', docNum: 'ABCDE1234F', fileName: 'pan_card.pdf', addedOn: '21 Jul 2025' },
    { key: '3', docType: 'Address Proof', docNum: 'ADDR123456', fileName: 'address_proof.pdf', addedOn: '21 Jul 2025' },
  ]);
  const [trainerCerts, setTrainerCerts] = useState([
    { key: '1', certType: 'Personal Trainer Certificate', certNum: 'PTC987654', fileName: 'pt_certificate.pdf', addedOn: '21 Jul 2025' },
  ]);

  // Temp Staff Form States
  const [tempStaffPhoto, setTempStaffPhoto] = useState(null);
  const [tempEmploymentType, setTempEmploymentType] = useState('Temporary');
  const [workingDays, setWorkingDays] = useState(['Mon', 'Wed', 'Fri', 'Sat']);

  // Employee Details Access & Role States
  const [detailAccessType, setDetailAccessType] = useState('Admin');
  const [detailRole, setDetailRole] = useState('Front Desk Manager');

  // Pagination State
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 8;

  // Filter Logic
  const filteredEmployees = employeesList.filter((item) => {
    const matchSearch =
      !namePhoneSearch ||
      item.name.toLowerCase().includes(namePhoneSearch.toLowerCase()) ||
      item.phone.includes(namePhoneSearch);

    const matchRole = roleFilter === 'ALL' || item.role === roleFilter;
    const matchStatus = statusFilter === 'ALL' || item.status === statusFilter;
    const matchAttendance = attendanceFilter === 'ALL' || item.attendance === attendanceFilter;

    return matchSearch && matchRole && matchStatus && matchAttendance;
  });

  const clearFilters = () => {
    setNamePhoneSearch('');
    setRoleFilter('ALL');
    setStatusFilter('ALL');
    setAttendanceFilter('ALL');
    setSelectedDateRange('21 Jul 2025 - 21 Jul 2026');
    message.info('Filters cleared');
  };

  const handleOpenDetails = (record) => {
    setSelectedEmployee(record);
    setDetailAccessType(record.accessType || 'Admin');
    setDetailRole(record.role || 'Front Desk Manager');
    editEmployeeForm.setFieldsValue({
      phone: record.phone,
      email: record.email,
      accessType: record.accessType,
      role: record.role,
    });
    setIsDetailsModalOpen(true);
  };

  const handleSaveDetails = (values) => {
    if (!selectedEmployee) return;
    const updated = employeesList.map((emp) => {
      if (emp.key === selectedEmployee.key) {
        return {
          ...emp,
          phone: values.phone || emp.phone,
          email: values.email || emp.email,
          role: detailRole,
          accessType: detailAccessType,
        };
      }
      return emp;
    });
    setEmployeesList(updated);
    setIsDetailsModalOpen(false);
    message.success(`Changes saved for ${selectedEmployee.name}`);
  };

  const handleDeactivate = () => {
    if (!selectedEmployee) return;
    const updated = employeesList.map((emp) =>
      emp.key === selectedEmployee.key ? { ...emp, status: 'Inactive', attendance: '—' } : emp
    );
    setEmployeesList(updated);
    setIsDetailsModalOpen(false);
    message.warning(`Employee ${selectedEmployee.name} deactivated.`);
  };

  const handleCompleteAddEmployee = (values) => {
    const newEmp = {
      key: Date.now().toString(),
      employeeId: `EMP00${employeesList.length + 1}`,
      name: values.name || 'New Staff',
      role: values.role || 'Trainer',
      phone: `${values.countryCode || '+91'} ${values.phone || '98765 00000'}`,
      email: values.email || `${values.name?.toLowerCase().replace(/\s+/g, '') || 'staff'}@fizonegym.com`,
      avatar:
        addPhoto ||
        'https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?q=80&w=150&auto=format&fit=crop',
      joinDate: '21 Jul 2025',
      status: 'Active',
      attendance: 'Present',
      accessType: values.accessLevel || 'Admin',
      branch: 'FitZone Gym - Anna Nagar, Chennai',
    };

    const updated = [newEmp, ...employeesList];
    setEmployeesList(updated);
    setIsAddModalOpen(false);
    setAddStep(1);
    addEmployeeForm.resetFields();
    setAddPhoto(null);

    // Trigger Success Confirmation Modal & Canvas Confetti
    setAddedEmployeeData(newEmp);
    setIsSuccessModalOpen(true);
    triggerConfettiPopper();

    if (onAddEmployee) onAddEmployee(newEmp);
  };

  const handleAddTempStaffSubmit = (values) => {
    const newStaff = {
      key: Date.now().toString(),
      employeeId: `EMP00${employeesList.length + 1}`,
      name: values.name,
      role: values.role || 'Trainer',
      phone: `${values.countryCode || '+91'} ${values.phone}`,
      email: values.email || `${values.name?.toLowerCase().replace(/\s+/g, '') || 'staff'}@fizonegym.com`,
      avatar:
        tempStaffPhoto ||
        'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?q=80&w=150&auto=format&fit=crop',
      joinDate: '21 Jul 2025',
      status: 'Active',
      attendance: 'Present',
      accessType: 'Employee',
      branch: 'FitZone Gym - Anna Nagar, Chennai',
    };

    const updated = [newStaff, ...employeesList];
    setEmployeesList(updated);
    setIsTempStaffModalOpen(false);
    tempStaffForm.resetFields();
    setTempStaffPhoto(null);

    setAddedEmployeeData(newStaff);
    setIsSuccessModalOpen(true);
    triggerConfettiPopper();

    if (onAddEmployee) onAddEmployee(newStaff);
  };

  // Date Range Quick Menu
  const dateRangeMenu = {
    items: [
      { key: 'today', label: 'Today (21 Jul 2025)', onClick: () => setSelectedDateRange('21 Jul 2025 - 21 Jul 2025') },
      { key: 'this_month', label: 'This Month (01 Jul 2025 - 31 Jul 2025)', onClick: () => setSelectedDateRange('01 Jul 2025 - 31 Jul 2025') },
      { key: 'this_year', label: 'Current Year (21 Jul 2025 - 21 Jul 2026)', onClick: () => setSelectedDateRange('21 Jul 2025 - 21 Jul 2026') },
      { type: 'divider' },
      {
        key: 'custom',
        label: 'Custom Date Range...',
        icon: <CalendarOutlined style={{ color: 'var(--color-primary)' }} />,
        onClick: () => setIsDateRangeModalOpen(true),
      },
    ],
  };

  const getRoleTagColor = (role) => {
    switch (role) {
      case 'Front Desk Manager':
        return { bg: isDarkMode ? 'rgba(114, 46, 209, 0.2)' : '#f3effe', color: isDarkMode ? '#b37feb' : '#722ed1' };
      case 'Trainer':
        return { bg: isDarkMode ? 'rgba(22, 119, 255, 0.2)' : '#e6f4ff', color: '#1677ff' };
      case 'Customer Support':
        return { bg: isDarkMode ? 'rgba(250, 140, 22, 0.2)' : '#fef4e8', color: '#fa8c16' };
      case 'Housekeeping':
        return { bg: isDarkMode ? 'rgba(114, 46, 209, 0.2)' : '#f3effe', color: isDarkMode ? '#b37feb' : '#722ed1' };
      case 'Maintenance':
        return { bg: isDarkMode ? 'rgba(250, 140, 22, 0.2)' : '#fef4e8', color: '#fa8c16' };
      case 'Nutritionist':
        return { bg: isDarkMode ? 'rgba(0, 191, 98, 0.2)' : '#eaf8ef', color: '#00bf62' };
      case 'Security':
        return { bg: isDarkMode ? '#1e1e1e' : '#f1f5f9', color: isDarkMode ? '#aaaaaa' : '#64748b' };
      default:
        return { bg: isDarkMode ? '#1e1e1e' : '#f1f5f9', color: isDarkMode ? '#cccccc' : '#475569' };
    }
  };

  const columns = [
    {
      title: 'Employee ID',
      dataIndex: 'employeeId',
      key: 'employeeId',
      render: (text) => (
        <span style={{ fontWeight: 700, color: isDarkMode ? '#ffffff' : '#0f172a', fontSize: 13 }}>
          {text}
        </span>
      ),
    },
    {
      title: 'Employee Name',
      key: 'employeeName',
      render: (_, record) => (
        <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
          <Avatar src={record.avatar} size={38} style={{ flexShrink: 0 }} />
          <div style={{ fontWeight: 650, color: isDarkMode ? '#ffffff' : '#0f172a', fontSize: 13 }}>
            {record.name}
          </div>
        </div>
      ),
    },
    {
      title: 'Role',
      dataIndex: 'role',
      key: 'role',
      render: (role) => {
        const style = getRoleTagColor(role);
        return (
          <Tag
            style={{
              backgroundColor: style.bg,
              color: style.color,
              border: 'none',
              borderRadius: 'var(--radius-base)',
              fontWeight: 600,
              fontSize: 11,
              padding: '2px 10px',
            }}
          >
            {role}
          </Tag>
        );
      },
    },
    {
      title: 'Phone Number',
      dataIndex: 'phone',
      key: 'phone',
      render: (text) => (
        <span style={{ color: isDarkMode ? '#cccccc' : '#334155', fontSize: 13, fontWeight: 500 }}>
          {text}
        </span>
      ),
    },
    {
      title: 'Join Date',
      dataIndex: 'joinDate',
      key: 'joinDate',
      render: (text) => (
        <span style={{ fontSize: 13, color: isDarkMode ? '#ffffff' : '#0f172a', fontWeight: 500 }}>
          {text}
        </span>
      ),
    },
    {
      title: 'Status',
      dataIndex: 'status',
      key: 'status',
      render: (status) => {
        if (status === 'Active') {
          return (
            <Tag
              style={{
                backgroundColor: isDarkMode ? 'rgba(0, 191, 98, 0.15)' : '#eaf8ef',
                color: '#00bf62',
                border: 'none',
                borderRadius: 'var(--radius-base)',
                fontWeight: 600,
                fontSize: 11,
                padding: '2px 10px',
              }}
            >
              Active
            </Tag>
          );
        }
        if (status === 'On Leave') {
          return (
            <Tag
              style={{
                backgroundColor: isDarkMode ? 'rgba(250, 140, 22, 0.15)' : '#fef4e8',
                color: '#fa8c16',
                border: 'none',
                borderRadius: 'var(--radius-base)',
                fontWeight: 600,
                fontSize: 11,
                padding: '2px 10px',
              }}
            >
              On Leave
            </Tag>
          );
        }
        return (
          <Tag
            style={{
              backgroundColor: isDarkMode ? '#1e1e1e' : '#f1f5f9',
              color: isDarkMode ? '#888888' : '#64748b',
              border: 'none',
              borderRadius: 'var(--radius-base)',
              fontWeight: 600,
              fontSize: 11,
              padding: '2px 10px',
            }}
          >
            Inactive
          </Tag>
        );
      },
    },
    {
      title: "Today's Attendance",
      dataIndex: 'attendance',
      key: 'attendance',
      render: (att) => {
        if (att === 'Present') {
          return (
            <Tag
              style={{
                backgroundColor: isDarkMode ? 'rgba(0, 191, 98, 0.15)' : '#eaf8ef',
                color: '#00bf62',
                border: 'none',
                borderRadius: 'var(--radius-base)',
                fontWeight: 600,
                fontSize: 11,
                padding: '2px 10px',
              }}
            >
              Present
            </Tag>
          );
        }
        if (att === 'Absent') {
          return (
            <Tag
              style={{
                backgroundColor: isDarkMode ? 'rgba(225, 29, 72, 0.15)' : '#fdeeed',
                color: '#e11d48',
                border: 'none',
                borderRadius: 'var(--radius-base)',
                fontWeight: 600,
                fontSize: 11,
                padding: '2px 10px',
              }}
            >
              Absent
            </Tag>
          );
        }
        if (att === 'On Leave') {
          return (
            <Tag
              style={{
                backgroundColor: isDarkMode ? 'rgba(250, 140, 22, 0.15)' : '#fef4e8',
                color: '#fa8c16',
                border: 'none',
                borderRadius: 'var(--radius-base)',
                fontWeight: 600,
                fontSize: 11,
                padding: '2px 10px',
              }}
            >
              On Leave
            </Tag>
          );
        }
        return <span style={{ color: isDarkMode ? '#666666' : '#94a3b8' }}>—</span>;
      },
    },
    {
      title: 'Actions',
      key: 'actions',
      width: 130,
      render: (_, record) => (
        <div style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
          <Button
            type="text"
            size="small"
            onClick={() => handleOpenDetails(record)}
            icon={<EyeOutlined style={{ color: '#722ed1', fontSize: 15 }} />}
            style={{
              backgroundColor: isDarkMode ? 'rgba(114, 46, 209, 0.15)' : '#f3effe',
              borderRadius: 'var(--radius-base)',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          />
          <Button
            type="text"
            size="small"
            onClick={() => handleOpenDetails(record)}
            icon={<EditOutlined style={{ color: '#722ed1', fontSize: 15 }} />}
            style={{
              backgroundColor: isDarkMode ? 'rgba(114, 46, 209, 0.15)' : '#f3effe',
              borderRadius: 'var(--radius-base)',
              width: 32,
              height: 32,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
            }}
          />
          <Dropdown
            menu={{
              items: [
                { key: 'view', label: 'View Profile', icon: <EyeOutlined />, onClick: () => handleOpenDetails(record) },
                { key: 'edit', label: 'Edit Permissions', icon: <EditOutlined />, onClick: () => handleOpenDetails(record) },
                {
                  key: 'deactivate',
                  label: 'Deactivate',
                  icon: <DeleteOutlined style={{ color: '#ef4444' }} />,
                  onClick: () => {
                    setEmployeesList(employeesList.map((e) => (e.key === record.key ? { ...e, status: 'Inactive', attendance: '—' } : e)));
                    message.warning(`Employee ${record.name} deactivated.`);
                  },
                },
              ],
            }}
            trigger={['click']}
          >
            <Button
              type="text"
              size="small"
              icon={<MoreOutlined style={{ fontSize: 16, color: isDarkMode ? '#888888' : '#64748b' }} />}
              style={{ width: 28, height: 32 }}
            />
          </Dropdown>
        </div>
      ),
    },
  ];

  return (
    <div>
      {/* Top Header */}
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
          <Title level={2} style={{ margin: 0, color: isDarkMode ? '#ffffff' : '#0f172a', fontWeight: 700 }}>
            Employee Management
          </Title>
          <Text style={{ color: isDarkMode ? '#888888' : '#64748b', fontSize: 14 }}>
            Manage your gym staff, roles, attendance and permissions.
          </Text>
        </div>

        {/* Action Buttons */}
        <div style={{ display: 'flex', gap: 10 }}>
          <Button
            onClick={() => setIsTempStaffModalOpen(true)}
            style={{
              borderRadius: 'var(--radius-base)',
              fontWeight: 600,
              height: 42,
              padding: '0 16px',
              borderColor: isDarkMode ? '#333333' : '#d0d7de',
              color: isDarkMode ? '#ffffff' : '#0f172a',
              backgroundColor: isDarkMode ? '#141414' : '#ffffff',
            }}
            icon={<UsergroupAddOutlined />}
          >
            Add Temp / Part-Time
          </Button>
          <Button
            type="primary"
            icon={<PlusOutlined />}
            onClick={() => {
              setAddStep(1);
              setIsAddModalOpen(true);
            }}
            style={{
              backgroundColor: 'var(--color-primary)',
              borderColor: 'var(--color-primary)',
              borderRadius: 'var(--radius-base)',
              fontWeight: 600,
              height: 42,
              padding: '0 20px',
              boxShadow: isDarkMode ? 'none' : '0 2px 6px rgba(0, 56, 130, 0.2)',
            }}
          >
            Add New Employee
          </Button>
        </div>
      </div>

      {/* 4 SUMMARY STAT CARDS */}
      <Row gutter={[16, 16]} style={{ marginBottom: 24 }}>
        {/* Card 1: Total Employees */}
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              borderColor: 'var(--border-color)',
              borderRadius: 'var(--radius-base)',
              boxShadow: isDarkMode ? 'none' : '0 1px 3px rgba(0,0,0,0.03)',
            }}
            styles={{ body: { padding: '20px' } }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  backgroundColor: isDarkMode ? 'rgba(114, 46, 209, 0.2)' : '#f3effe',
                  color: isDarkMode ? '#b37feb' : '#722ed1',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                  flexShrink: 0,
                }}
              >
                <TeamOutlined />
              </div>
              <div>
                <div style={{ fontSize: 13, color: isDarkMode ? '#888888' : '#64748b', fontWeight: 500 }}>
                  Total Employees
                </div>
                <div style={{ fontSize: 24, fontWeight: 700, color: isDarkMode ? '#ffffff' : '#0f172a', lineHeight: 1.2, marginTop: 2 }}>
                  18
                </div>
                <div style={{ fontSize: 12, color: isDarkMode ? '#888888' : '#64748b', fontWeight: 500, display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                  <TeamOutlined /> All Staff
                </div>
              </div>
            </div>
          </Card>
        </Col>

        {/* Card 2: Active Employees */}
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              borderColor: 'var(--border-color)',
              borderRadius: 'var(--radius-base)',
              boxShadow: isDarkMode ? 'none' : '0 1px 3px rgba(0,0,0,0.03)',
            }}
            styles={{ body: { padding: '20px' } }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  backgroundColor: isDarkMode ? 'rgba(0, 191, 98, 0.2)' : '#eaf8ef',
                  color: '#00bf62',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                  flexShrink: 0,
                }}
              >
                <UserOutlined />
              </div>
              <div>
                <div style={{ fontSize: 13, color: isDarkMode ? '#888888' : '#64748b', fontWeight: 500 }}>
                  Active Employees
                </div>
                <div style={{ fontSize: 24, fontWeight: 700, color: isDarkMode ? '#ffffff' : '#0f172a', lineHeight: 1.2, marginTop: 2 }}>
                  16
                </div>
                <div style={{ fontSize: 12, color: '#00bf62', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                  <span style={{ fontSize: 8 }}>●</span> Currently Working
                </div>
              </div>
            </div>
          </Card>
        </Col>

        {/* Card 3: On Leave Today */}
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              borderColor: 'var(--border-color)',
              borderRadius: 'var(--radius-base)',
              boxShadow: isDarkMode ? 'none' : '0 1px 3px rgba(0,0,0,0.03)',
            }}
            styles={{ body: { padding: '20px' } }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  backgroundColor: isDarkMode ? 'rgba(250, 140, 22, 0.2)' : '#fef4e8',
                  color: '#fa8c16',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                  flexShrink: 0,
                }}
              >
                <CalendarOutlined />
              </div>
              <div>
                <div style={{ fontSize: 13, color: isDarkMode ? '#888888' : '#64748b', fontWeight: 500 }}>
                  On Leave Today
                </div>
                <div style={{ fontSize: 24, fontWeight: 700, color: isDarkMode ? '#ffffff' : '#0f172a', lineHeight: 1.2, marginTop: 2 }}>
                  2
                </div>
                <div style={{ fontSize: 12, color: '#fa8c16', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                  <CalendarOutlined /> On Leave
                </div>
              </div>
            </div>
          </Card>
        </Col>

        {/* Card 4: New This Month */}
        <Col xs={24} sm={12} lg={6}>
          <Card
            style={{
              backgroundColor: 'var(--bg-surface-elevated)',
              borderColor: 'var(--border-color)',
              borderRadius: 'var(--radius-base)',
              boxShadow: isDarkMode ? 'none' : '0 1px 3px rgba(0,0,0,0.03)',
            }}
            styles={{ body: { padding: '20px' } }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
              <div
                style={{
                  width: 44,
                  height: 44,
                  borderRadius: '50%',
                  backgroundColor: isDarkMode ? 'rgba(22, 119, 255, 0.2)' : '#edf4fe',
                  color: '#1677ff',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  fontSize: 20,
                  flexShrink: 0,
                }}
              >
                <UserAddOutlined />
              </div>
              <div>
                <div style={{ fontSize: 13, color: isDarkMode ? '#888888' : '#64748b', fontWeight: 500 }}>
                  New This Month
                </div>
                <div style={{ fontSize: 24, fontWeight: 700, color: isDarkMode ? '#ffffff' : '#0f172a', lineHeight: 1.2, marginTop: 2 }}>
                  2
                </div>
                <div style={{ fontSize: 12, color: '#1677ff', fontWeight: 600, display: 'flex', alignItems: 'center', gap: 4, marginTop: 4 }}>
                  Joined in July
                </div>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      {/* FILTER & SEARCH CARD */}
      <Card
        style={{
          backgroundColor: 'var(--bg-surface-elevated)',
          borderColor: 'var(--border-color)',
          borderRadius: 'var(--radius-base)',
          marginBottom: 24,
          boxShadow: isDarkMode ? 'none' : '0 1px 3px rgba(0,0,0,0.03)',
        }}
        styles={{ body: { padding: '20px 24px' } }}
      >
        <Row gutter={[16, 16]} align="bottom">
          {/* Search by Name / Phone */}
          <Col xs={24} sm={12} lg={6}>
            <div style={{ fontSize: 12, fontWeight: 600, color: isDarkMode ? '#cccccc' : '#475569', marginBottom: 6 }}>
              Search by Name / Phone
            </div>
            <Input
              prefix={<SearchOutlined style={{ color: isDarkMode ? '#888888' : '#94a3b8' }} />}
              placeholder="Enter name or phone number"
              value={namePhoneSearch}
              onChange={(e) => setNamePhoneSearch(e.target.value)}
              allowClear
              style={{ height: 42, borderRadius: 'var(--radius-base)' }}
            />
          </Col>

          {/* Role */}
          <Col xs={24} sm={12} lg={4}>
            <div style={{ fontSize: 12, fontWeight: 600, color: isDarkMode ? '#cccccc' : '#475569', marginBottom: 6 }}>
              Role
            </div>
            <Select
              value={roleFilter}
              onChange={setRoleFilter}
              style={{ width: '100%', height: 42 }}
            >
              <Option value="ALL">All Roles</Option>
              <Option value="Front Desk Manager">Front Desk Manager</Option>
              <Option value="Trainer">Trainer</Option>
              <Option value="Customer Support">Customer Support</Option>
              <Option value="Housekeeping">Housekeeping</Option>
              <Option value="Maintenance">Maintenance</Option>
              <Option value="Nutritionist">Nutritionist</Option>
              <Option value="Security">Security</Option>
            </Select>
          </Col>

          {/* Status */}
          <Col xs={24} sm={12} lg={4}>
            <div style={{ fontSize: 12, fontWeight: 600, color: isDarkMode ? '#cccccc' : '#475569', marginBottom: 6 }}>
              Status
            </div>
            <Select
              value={statusFilter}
              onChange={setStatusFilter}
              style={{ width: '100%', height: 42 }}
            >
              <Option value="ALL">All Status</Option>
              <Option value="Active">Active</Option>
              <Option value="On Leave">On Leave</Option>
              <Option value="Inactive">Inactive</Option>
            </Select>
          </Col>

          {/* Attendance */}
          <Col xs={24} sm={12} lg={4}>
            <div style={{ fontSize: 12, fontWeight: 600, color: isDarkMode ? '#cccccc' : '#475569', marginBottom: 6 }}>
              Attendance
            </div>
            <Select
              value={attendanceFilter}
              onChange={setAttendanceFilter}
              style={{ width: '100%', height: 42 }}
            >
              <Option value="ALL">All</Option>
              <Option value="Present">Present</Option>
              <Option value="Absent">Absent</Option>
              <Option value="On Leave">On Leave</Option>
            </Select>
          </Col>

          {/* Date Range */}
          <Col xs={24} sm={12} lg={6}>
            <div style={{ fontSize: 12, fontWeight: 600, color: isDarkMode ? '#cccccc' : '#475569', marginBottom: 6 }}>
              Date Range
            </div>
            <Dropdown menu={dateRangeMenu} trigger={['click']}>
              <div
                style={{
                  height: 42,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '0 14px',
                  backgroundColor: isDarkMode ? '#141414' : '#ffffff',
                  border: `1px solid ${isDarkMode ? '#262626' : '#d9d9d9'}`,
                  borderRadius: 'var(--radius-base)',
                  cursor: 'pointer',
                  fontSize: 13,
                  fontWeight: 500,
                  color: isDarkMode ? '#ffffff' : '#0f172a',
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                  <CalendarOutlined style={{ color: isDarkMode ? '#888888' : '#64748b', flexShrink: 0 }} />
                  <span style={{ overflow: 'hidden', textOverflow: 'ellipsis' }}>{selectedDateRange}</span>
                </div>
                <DownOutlined style={{ fontSize: 10, color: isDarkMode ? '#888888' : '#64748b', flexShrink: 0 }} />
              </div>
            </Dropdown>
          </Col>
        </Row>

        {/* Row 2: Filter & Clear Filters Action Buttons */}
        <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12, marginTop: 18 }}>
          <Button
            icon={<FilterOutlined />}
            onClick={() => message.info(`Applied filters: ${filteredEmployees.length} matches.`)}
            style={{
              height: 40,
              padding: '0 22px',
              borderRadius: 'var(--radius-base)',
              fontWeight: 600,
              color: 'var(--color-primary)',
              borderColor: isDarkMode ? '#333333' : '#d0d7de',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            Filter
          </Button>
          <Button
            icon={<ReloadOutlined />}
            onClick={clearFilters}
            style={{
              height: 40,
              padding: '0 22px',
              borderRadius: 'var(--radius-base)',
              fontWeight: 600,
              color: isDarkMode ? '#aaaaaa' : '#64748b',
              borderColor: isDarkMode ? '#333333' : '#d0d7de',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
            }}
          >
            Clear Filters
          </Button>
        </div>
      </Card>

      {/* EMPLOYEES TABLE CARD */}
      <Card
        title={
          <div style={{ fontSize: 16, fontWeight: 700, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
            Employees
          </div>
        }
        style={{
          backgroundColor: 'var(--bg-surface-elevated)',
          borderColor: 'var(--border-color)',
          borderRadius: 'var(--radius-base)',
          boxShadow: isDarkMode ? 'none' : '0 1px 3px rgba(0,0,0,0.03)',
        }}
        styles={{ body: { padding: '16px 20px' } }}
      >
        <Table
          pagination={false}
          size="middle"
          scroll={{ x: 'max-content' }}
          dataSource={filteredEmployees}
          columns={columns}
        />

        {/* Custom Table Footer with Pagination */}
        <div
          style={{
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
            flexWrap: 'wrap',
            gap: 16,
            marginTop: 20,
            paddingTop: 16,
            borderTop: `1px solid ${isDarkMode ? '#1e1e1e' : '#f1f5f9'}`,
          }}
        >
          <div style={{ fontSize: 13, color: isDarkMode ? '#888888' : '#64748b' }}>
            Showing 1 to {filteredEmployees.length} of 18 employees
          </div>
          <Pagination
            current={currentPage}
            onChange={setCurrentPage}
            total={18}
            pageSize={pageSize}
            showSizeChanger={false}
          />
        </div>
      </Card>

      {/* 1. EMPLOYEE DETAILS MODAL (PIXEL PERFECT SCREENSHOT 2) */}
      <Modal
        title={
          <div style={{ fontSize: 18, fontWeight: 700, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
            Employee Details
          </div>
        }
        open={isDetailsModalOpen}
        onCancel={() => setIsDetailsModalOpen(false)}
        footer={null}
        width={560}
        centered
        destroyOnClose
        styles={{ body: { padding: '8px 4px 12px 4px' } }}
      >
        {selectedEmployee && (
          <Form form={editEmployeeForm} layout="vertical" onFinish={handleSaveDetails}>
            {/* Top Profile Section Card */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'space-between',
                padding: '16px',
                borderRadius: 'var(--radius-base)',
                backgroundColor: isDarkMode ? '#141414' : '#f8fafc',
                border: `1px solid ${isDarkMode ? '#222222' : '#e2e8f0'}`,
                marginBottom: 20,
              }}
            >
              <div style={{ display: 'flex', alignItems: 'center', gap: 14 }}>
                <Avatar src={selectedEmployee.avatar} size={64} style={{ border: '2px solid #722ed1', flexShrink: 0 }} />
                <div>
                  <div style={{ fontSize: 18, fontWeight: 700, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                    {selectedEmployee.name}
                  </div>
                  <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4, flexWrap: 'wrap' }}>
                    <Tag
                      style={{
                        backgroundColor: isDarkMode ? 'rgba(114, 46, 209, 0.2)' : '#f3effe',
                        color: isDarkMode ? '#b37feb' : '#722ed1',
                        border: 'none',
                        borderRadius: 'var(--radius-base)',
                        fontWeight: 600,
                        fontSize: 11,
                        padding: '1px 8px',
                        margin: 0,
                      }}
                    >
                      {detailRole}
                    </Tag>
                    <Tag
                      style={{
                        backgroundColor: isDarkMode ? 'rgba(0, 191, 98, 0.15)' : '#eaf8ef',
                        color: '#00bf62',
                        border: 'none',
                        borderRadius: 'var(--radius-base)',
                        fontWeight: 600,
                        fontSize: 11,
                        padding: '1px 8px',
                        margin: 0,
                      }}
                    >
                      ● {selectedEmployee.status}
                    </Tag>
                  </div>
                  <div style={{ fontSize: 12, color: isDarkMode ? '#888888' : '#64748b', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <PhoneOutlined /> {selectedEmployee.phone}
                  </div>
                  <div style={{ fontSize: 12, color: isDarkMode ? '#888888' : '#64748b', marginTop: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
                    <MailOutlined /> {selectedEmployee.email}
                  </div>
                </div>
              </div>

              {/* Top Right Card Info */}
              <div style={{ textAlign: 'right' }}>
                <div style={{ fontSize: 11, color: isDarkMode ? '#888888' : '#64748b' }}>Employee ID</div>
                <div style={{ fontSize: 15, fontWeight: 800, color: '#722ed1', marginTop: 1 }}>{selectedEmployee.employeeId}</div>
                <div style={{ fontSize: 11, color: isDarkMode ? '#888888' : '#64748b', marginTop: 8 }}>Start Date</div>
                <div style={{ fontSize: 13, fontWeight: 650, color: isDarkMode ? '#ffffff' : '#0f172a', marginTop: 1 }}>{selectedEmployee.joinDate}</div>
              </div>
            </div>

            {/* Form Row 1: Access Type & Role */}
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item label={<span style={{ fontWeight: 600, fontSize: 12.5 }}>Access Type</span>} style={{ marginBottom: 14 }}>
                  <Select value={detailAccessType} onChange={setDetailAccessType} style={{ height: 42 }}>
                    <Option value="Admin">Admin</Option>
                    <Option value="Employee">Employee</Option>
                    <Option value="None">None</Option>
                  </Select>
                  <div style={{ fontSize: 11, color: isDarkMode ? '#888888' : '#64748b', marginTop: 4 }}>
                    Admin can access all features and settings.
                  </div>
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item label={<span style={{ fontWeight: 600, fontSize: 12.5 }}>Role</span>} style={{ marginBottom: 14 }}>
                  <Select value={detailRole} onChange={setDetailRole} style={{ height: 42 }}>
                    <Option value="Front Desk Manager">Front Desk Manager</Option>
                    <Option value="Trainer">Trainer</Option>
                    <Option value="Customer Support">Customer Support</Option>
                    <Option value="Housekeeping">Housekeeping</Option>
                    <Option value="Nutritionist">Nutritionist</Option>
                  </Select>
                  <div style={{ fontSize: 11, color: isDarkMode ? '#888888' : '#64748b', marginTop: 4 }}>
                    Manage front desk operations and staff.
                  </div>
                </Form.Item>
              </Col>
            </Row>

            {/* Form Row 2: Phone & Email */}
            <Row gutter={16}>
              <Col xs={24} sm={12}>
                <Form.Item label={<span style={{ fontWeight: 600, fontSize: 12.5 }}>Phone Number</span>} name="phone" initialValue={selectedEmployee.phone} style={{ marginBottom: 16 }}>
                  <Input style={{ height: 42, borderRadius: 'var(--radius-base)' }} />
                </Form.Item>
              </Col>
              <Col xs={24} sm={12}>
                <Form.Item label={<span style={{ fontWeight: 600, fontSize: 12.5 }}>Email ID</span>} name="email" initialValue={selectedEmployee.email} style={{ marginBottom: 16 }}>
                  <Input style={{ height: 42, borderRadius: 'var(--radius-base)' }} />
                </Form.Item>
              </Col>
            </Row>

            {/* Change Access Type (3 Cards Grid) */}
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: isDarkMode ? '#cccccc' : '#334155', marginBottom: 8 }}>
                Change Access Type
              </div>
              <Row gutter={12}>
                {[
                  { key: 'Admin', label: 'Admin', desc: 'Full access to all features and settings', icon: <CrownOutlined /> },
                  { key: 'Employee', label: 'Employee', desc: 'Limited access to assigned features', icon: <TeamOutlined /> },
                  { key: 'None', label: 'None', desc: 'No access to system', icon: <CloseCircleOutlined /> },
                ].map((acc) => {
                  const isSelected = detailAccessType === acc.key;
                  return (
                    <Col xs={24} sm={8} key={acc.key}>
                      <div
                        onClick={() => setDetailAccessType(acc.key)}
                        style={{
                          height: 96,
                          padding: '12px',
                          borderRadius: 'var(--radius-base)',
                          border: `1.5px solid ${isSelected ? '#722ed1' : isDarkMode ? '#262626' : '#e2e8f0'}`,
                          backgroundColor: isSelected ? (isDarkMode ? 'rgba(114, 46, 209, 0.15)' : '#f3effe') : isDarkMode ? '#141414' : '#ffffff',
                          cursor: 'pointer',
                          position: 'relative',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 4 }}>
                          <span style={{ fontSize: 16, color: isSelected ? '#722ed1' : isDarkMode ? '#888888' : '#64748b' }}>
                            {acc.icon}
                          </span>
                          {isSelected && <CheckCircleFilled style={{ color: '#722ed1', fontSize: 14 }} />}
                        </div>
                        <div style={{ fontSize: 13, fontWeight: 700, color: isSelected ? '#722ed1' : isDarkMode ? '#ffffff' : '#0f172a' }}>
                          {acc.label}
                        </div>
                        <div style={{ fontSize: 10.5, color: isDarkMode ? '#888888' : '#64748b', marginTop: 2, lineHeight: 1.3 }}>
                          {acc.desc}
                        </div>
                      </div>
                    </Col>
                  );
                })}
              </Row>
            </div>

            {/* Change Role Section */}
            <div style={{ marginBottom: 18 }}>
              <div style={{ fontSize: 12.5, fontWeight: 600, color: isDarkMode ? '#cccccc' : '#334155', marginBottom: 6 }}>
                Change Role
              </div>
              <Select value={detailRole} onChange={setDetailRole} style={{ width: '100%', height: 42 }}>
                <Option value="Front Desk Manager">Front Desk Manager</Option>
                <Option value="Trainer">Trainer</Option>
                <Option value="Customer Support">Customer Support</Option>
                <Option value="Housekeeping">Housekeeping</Option>
                <Option value="Maintenance">Maintenance</Option>
                <Option value="Nutritionist">Nutritionist</Option>
                <Option value="Security">Security</Option>
              </Select>
              <div style={{ fontSize: 11, color: isDarkMode ? '#888888' : '#64748b', marginTop: 4 }}>
                Update the employee's role and responsibilities.
              </div>
            </div>

            {/* Documents Section Grid */}
            <div style={{ marginBottom: 24 }}>
              <div style={{ fontSize: 13, fontWeight: 700, color: isDarkMode ? '#ffffff' : '#0f172a', marginBottom: 10 }}>
                Documents
              </div>
              <Row gutter={10}>
                {[
                  { name: 'Aadhaar Card', format: 'PDF • 245 KB', icon: <FilePdfOutlined style={{ color: '#e11d48' }} /> },
                  { name: 'PAN Card', format: 'PDF • 189 KB', icon: <FilePdfOutlined style={{ color: '#e11d48' }} /> },
                  { name: 'Address Proof', format: 'PDF • 210 KB', icon: <FilePdfOutlined style={{ color: '#e11d48' }} /> },
                  { name: 'Photo', format: 'JPG • 120 KB', icon: <FileImageOutlined style={{ color: '#00bf62' }} /> },
                ].map((doc, idx) => (
                  <Col xs={12} sm={6} key={idx}>
                    <div
                      style={{
                        padding: '12px 10px',
                        borderRadius: 'var(--radius-base)',
                        border: `1px solid ${isDarkMode ? '#262626' : '#e2e8f0'}`,
                        backgroundColor: isDarkMode ? '#141414' : '#fafafa',
                        textAlign: 'center',
                      }}
                    >
                      <div style={{ fontSize: 22, marginBottom: 4 }}>{doc.icon}</div>
                      <div style={{ fontSize: 12, fontWeight: 650, color: isDarkMode ? '#ffffff' : '#0f172a', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                        {doc.name}
                      </div>
                      <div style={{ fontSize: 10, color: isDarkMode ? '#888888' : '#64748b', marginTop: 2 }}>
                        {doc.format}
                      </div>
                      <Button
                        size="small"
                        onClick={() => message.info(`Viewing ${doc.name}`)}
                        style={{
                          marginTop: 8,
                          height: 26,
                          fontSize: 11,
                          fontWeight: 600,
                          borderRadius: 'var(--radius-base)',
                          width: '100%',
                          color: 'var(--color-primary)',
                          borderColor: isDarkMode ? '#333333' : '#d0d7de',
                        }}
                      >
                        View
                      </Button>
                    </div>
                  </Col>
                ))}
              </Row>
            </div>

            {/* Modal Actions */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: 14 }}>
              <Button
                danger
                icon={<PoweroffOutlined />}
                onClick={handleDeactivate}
                style={{
                  height: 44,
                  padding: '0 18px',
                  borderRadius: 'var(--radius-base)',
                  fontWeight: 600,
                  fontSize: 13,
                }}
              >
                Deactivate Employee
              </Button>
              <Button
                type="primary"
                htmlType="submit"
                style={{
                  height: 44,
                  padding: '0 28px',
                  borderRadius: 'var(--radius-base)',
                  fontWeight: 600,
                  fontSize: 14,
                  backgroundColor: 'var(--color-primary)',
                  borderColor: 'var(--color-primary)',
                  color: '#ffffff',
                }}
              >
                Save Changes
              </Button>
            </div>
            <div style={{ fontSize: 11, color: isDarkMode ? '#888888' : '#64748b', marginTop: 8 }}>
              Employee will not be able to login or access the system.
            </div>
          </Form>
        )}
      </Modal>

      {/* 2. ADD NEW EMPLOYEE 2-STEP MULTI-STEP MODAL (SCREENSHOT 3) */}
      <Modal
        title={
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingRight: 24 }}>
            <span style={{ fontSize: 18, fontWeight: 700, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
              Add New Employee
            </span>
            <div style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 12, color: isDarkMode ? '#888888' : '#64748b' }}>
              <span>Page {addStep} of 2</span>
              <div style={{ display: 'flex', gap: 4 }}>
                <span
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    backgroundColor: addStep === 1 ? 'var(--color-primary)' : isDarkMode ? '#222222' : '#e2e8f0',
                    color: addStep === 1 ? '#ffffff' : isDarkMode ? '#888888' : '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  1
                </span>
                <span
                  style={{
                    width: 20,
                    height: 20,
                    borderRadius: '50%',
                    backgroundColor: addStep === 2 ? 'var(--color-primary)' : isDarkMode ? '#222222' : '#e2e8f0',
                    color: addStep === 2 ? '#ffffff' : isDarkMode ? '#888888' : '#64748b',
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'center',
                    fontSize: 11,
                    fontWeight: 700,
                  }}
                >
                  2
                </span>
              </div>
            </div>
          </div>
        }
        open={isAddModalOpen}
        onCancel={() => {
          setIsAddModalOpen(false);
          setAddStep(1);
          addEmployeeForm.resetFields();
          setAddPhoto(null);
        }}
        footer={null}
        width={700}
        centered
        destroyOnClose
        styles={{ body: { padding: '12px 4px 16px 4px' } }}
      >
        <Form form={addEmployeeForm} layout="vertical" onFinish={handleCompleteAddEmployee}>
          {addStep === 1 && (
            <div>
              {/* Photo + Basic Details */}
              <Row gutter={16} align="top" style={{ marginBottom: 16 }}>
                <Col xs={24} sm={8}>
                  <div style={{ fontSize: 12.5, fontWeight: 600, color: isDarkMode ? '#cccccc' : '#334155', marginBottom: 6 }}>
                    Employee Photo
                  </div>
                  <div
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*';
                      input.onchange = (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (re) => setAddPhoto(re.target?.result);
                          reader.readAsDataURL(file);
                          message.success('Photo attached');
                        }
                      };
                      input.click();
                    }}
                    style={{
                      height: 130,
                      borderRadius: 'var(--radius-base)',
                      border: `2px dashed ${addPhoto ? '#722ed1' : isDarkMode ? '#333333' : '#d0d7de'}`,
                      backgroundColor: isDarkMode ? '#141414' : '#fafafa',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      padding: 8,
                      textAlign: 'center',
                    }}
                  >
                    {addPhoto ? (
                      <img src={addPhoto} alt="Employee" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 6 }} />
                    ) : (
                      <>
                        <CameraOutlined style={{ fontSize: 28, color: '#722ed1', marginBottom: 6 }} />
                        <div style={{ fontSize: 12.5, fontWeight: 700, color: '#722ed1' }}>Upload Photo</div>
                        <div style={{ fontSize: 10, color: isDarkMode ? '#888888' : '#64748b', marginTop: 2 }}>JPG, PNG (Max 2MB)</div>
                      </>
                    )}
                  </div>
                </Col>

                <Col xs={24} sm={16}>
                  <Form.Item label={<span style={{ fontWeight: 600, fontSize: 12.5 }}>Employee Name <span style={{ color: '#ef4444' }}>*</span></span>} name="name" rules={[{ required: true, message: 'Enter name' }]} style={{ marginBottom: 10 }}>
                    <Input placeholder="Enter employee name" style={{ height: 40, borderRadius: 'var(--radius-base)' }} />
                  </Form.Item>

                  <Row gutter={10}>
                    <Col xs={24} sm={12}>
                      <Form.Item label={<span style={{ fontWeight: 600, fontSize: 12.5 }}>Phone Number <span style={{ color: '#ef4444' }}>*</span></span>} required style={{ marginBottom: 10 }}>
                        <Input.Group compact>
                          <Form.Item name="countryCode" initialValue="+91" noStyle>
                            <Select style={{ width: '35%', height: 40 }}>
                              <Option value="+91">+91</Option>
                              <Option value="+1">+1</Option>
                            </Select>
                          </Form.Item>
                          <Form.Item name="phone" noStyle rules={[{ required: true, message: 'Enter phone' }]}>
                            <Input placeholder="Enter phone" style={{ width: '65%', height: 40, borderRadius: '0 8px 8px 0' }} />
                          </Form.Item>
                        </Input.Group>
                      </Form.Item>
                    </Col>
                    <Col xs={24} sm={12}>
                      <Form.Item label={<span style={{ fontWeight: 600, fontSize: 12.5 }}>Email ID <span style={{ color: '#ef4444' }}>*</span></span>} name="email" rules={[{ required: true, type: 'email', message: 'Enter valid email' }]} style={{ marginBottom: 10 }}>
                        <Input placeholder="Enter email address" style={{ height: 40, borderRadius: 'var(--radius-base)' }} />
                      </Form.Item>
                    </Col>
                  </Row>
                </Col>
              </Row>

              <Row gutter={16}>
                <Col xs={24} sm={12}>
                  <Form.Item label={<span style={{ fontWeight: 600, fontSize: 12.5 }}>Role <span style={{ color: '#ef4444' }}>*</span></span>} name="role" initialValue="Trainer" rules={[{ required: true }]} style={{ marginBottom: 14 }}>
                    <Select style={{ height: 40 }}>
                      <Option value="Front Desk Manager">Front Desk Manager</Option>
                      <Option value="Trainer">Trainer</Option>
                      <Option value="Customer Support">Customer Support</Option>
                      <Option value="Housekeeping">Housekeeping</Option>
                      <Option value="Nutritionist">Nutritionist</Option>
                    </Select>
                  </Form.Item>
                </Col>
                <Col xs={24} sm={12}>
                  <Form.Item label={<span style={{ fontWeight: 600, fontSize: 12.5 }}>Access Level <span style={{ color: '#ef4444' }}>*</span></span>} name="accessLevel" initialValue="Admin" rules={[{ required: true }]} style={{ marginBottom: 4 }}>
                    <Select style={{ height: 40 }}>
                      <Option value="Admin">Admin</Option>
                      <Option value="Employee">Employee</Option>
                      <Option value="None">None</Option>
                    </Select>
                  </Form.Item>
                  <div style={{ fontSize: 11, color: isDarkMode ? '#888888' : '#64748b', marginBottom: 14 }}>
                    Define what this employee can access in the system.
                  </div>
                </Col>
              </Row>

              {/* Previous Employment Details */}
              <div style={{ borderTop: `1px solid ${isDarkMode ? '#222222' : '#f1f5f9'}`, paddingTop: 14, marginTop: 6 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#722ed1', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                  <CalendarOutlined /> Previous Employment Details
                </div>

                <Row gutter={12}>
                  <Col xs={24} sm={8}>
                    <Form.Item label={<span style={{ fontWeight: 600, fontSize: 12 }}>Company Name</span>} name="prevCompany" style={{ marginBottom: 10 }}>
                      <Input placeholder="Enter company name" style={{ height: 38, borderRadius: 'var(--radius-base)' }} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={8}>
                    <Form.Item label={<span style={{ fontWeight: 600, fontSize: 12 }}>Designation</span>} name="prevDesignation" style={{ marginBottom: 10 }}>
                      <Input placeholder="Enter designation" style={{ height: 38, borderRadius: 'var(--radius-base)' }} />
                    </Form.Item>
                  </Col>
                  <Col xs={24} sm={8}>
                    <Form.Item label={<span style={{ fontWeight: 600, fontSize: 12 }}>Years of Experience</span>} name="prevExp" style={{ marginBottom: 10 }}>
                      <Select placeholder="Select experience" style={{ height: 38 }}>
                        <Option value="1-2 Years">1-2 Years</Option>
                        <Option value="3-5 Years">3-5 Years</Option>
                        <Option value="5+ Years">5+ Years</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                </Row>

                {/* Added Employment Documents Table */}
                <div style={{ marginTop: 8 }}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: isDarkMode ? '#cccccc' : '#475569', marginBottom: 6 }}>
                    Added Employment Documents
                  </div>
                  <Table
                    size="small"
                    pagination={false}
                    dataSource={empDocs}
                    columns={[
                      { title: 'Document Type', dataIndex: 'docType', key: 'docType' },
                      { title: 'Document Number', dataIndex: 'docNum', key: 'docNum' },
                      { title: 'File Name', dataIndex: 'fileName', key: 'fileName' },
                      { title: 'Added On', dataIndex: 'addedOn', key: 'addedOn' },
                      {
                        title: 'Action',
                        key: 'action',
                        render: (_, rec) => (
                          <Button
                            type="text"
                            size="small"
                            danger
                            icon={<DeleteOutlined />}
                            onClick={() => setEmpDocs(empDocs.filter((d) => d.key !== rec.key))}
                          />
                        ),
                      },
                    ]}
                  />
                </div>
              </div>

              {/* Step 1 Actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 24 }}>
                <Button onClick={() => setIsAddModalOpen(false)} style={{ borderRadius: 'var(--radius-base)', height: 42, padding: '0 24px' }}>
                  Cancel
                </Button>
                <Button
                  type="primary"
                  onClick={() => setAddStep(2)}
                  style={{
                    borderRadius: 'var(--radius-base)',
                    height: 42,
                    padding: '0 28px',
                    backgroundColor: 'var(--color-primary)',
                    borderColor: 'var(--color-primary)',
                    color: '#ffffff',
                    fontWeight: 600,
                  }}
                >
                  Next <ArrowRightOutlined />
                </Button>
              </div>
            </div>
          )}

          {addStep === 2 && (
            <div>
              {/* Family Details */}
              <div style={{ fontSize: 14, fontWeight: 700, color: '#722ed1', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                <TeamOutlined /> Family Details
              </div>

              <Row gutter={12}>
                <Col xs={24} sm={8}>
                  <Form.Item label={<span style={{ fontWeight: 600, fontSize: 12 }}>Emergency Contact Name <span style={{ color: '#ef4444' }}>*</span></span>} name="emergencyName" rules={[{ required: true, message: 'Required' }]} style={{ marginBottom: 12 }}>
                    <Input placeholder="Enter contact name" style={{ height: 38, borderRadius: 'var(--radius-base)' }} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={8}>
                  <Form.Item label={<span style={{ fontWeight: 600, fontSize: 12 }}>Relationship <span style={{ color: '#ef4444' }}>*</span></span>} name="emergencyRel" rules={[{ required: true, message: 'Required' }]} style={{ marginBottom: 12 }}>
                    <Input placeholder="Enter relationship" style={{ height: 38, borderRadius: 'var(--radius-base)' }} />
                  </Form.Item>
                </Col>
                <Col xs={24} sm={8}>
                  <Form.Item label={<span style={{ fontWeight: 600, fontSize: 12 }}>Phone Number <span style={{ color: '#ef4444' }}>*</span></span>} name="emergencyPhone" rules={[{ required: true, message: 'Required' }]} style={{ marginBottom: 12 }}>
                    <Input placeholder="+91 98765 43210" style={{ height: 38, borderRadius: 'var(--radius-base)' }} />
                  </Form.Item>
                </Col>
              </Row>

              {/* Documents Section */}
              <div style={{ borderTop: `1px solid ${isDarkMode ? '#222222' : '#f1f5f9'}`, paddingTop: 14, marginTop: 8 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#722ed1', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                  <IdcardOutlined /> Documents
                </div>

                <Table
                  size="small"
                  pagination={false}
                  dataSource={personalDocs}
                  columns={[
                    { title: 'Document Type', dataIndex: 'docType', key: 'docType' },
                    { title: 'Document Number', dataIndex: 'docNum', key: 'docNum' },
                    { title: 'File Name', dataIndex: 'fileName', key: 'fileName' },
                    { title: 'Added On', dataIndex: 'addedOn', key: 'addedOn' },
                    {
                      title: 'Action',
                      key: 'action',
                      render: (_, rec) => (
                        <Button
                          type="text"
                          size="small"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => setPersonalDocs(personalDocs.filter((d) => d.key !== rec.key))}
                        />
                      ),
                    },
                  ]}
                />
              </div>

              {/* Trainer Certificate (If Employee is a Trainer) */}
              <div style={{ borderTop: `1px solid ${isDarkMode ? '#222222' : '#f1f5f9'}`, paddingTop: 14, marginTop: 14 }}>
                <div style={{ fontSize: 14, fontWeight: 700, color: '#722ed1', display: 'flex', alignItems: 'center', gap: 6, marginBottom: 12 }}>
                  <CrownOutlined /> Trainer Certificate (If Employee is a Trainer)
                </div>

                <Table
                  size="small"
                  pagination={false}
                  dataSource={trainerCerts}
                  columns={[
                    { title: 'Certificate Type', dataIndex: 'certType', key: 'certType' },
                    { title: 'Document Number', dataIndex: 'certNum', key: 'certNum' },
                    { title: 'File Name', dataIndex: 'fileName', key: 'fileName' },
                    { title: 'Added On', dataIndex: 'addedOn', key: 'addedOn' },
                    {
                      title: 'Action',
                      key: 'action',
                      render: (_, rec) => (
                        <Button
                          type="text"
                          size="small"
                          danger
                          icon={<DeleteOutlined />}
                          onClick={() => setTrainerCerts(trainerCerts.filter((c) => c.key !== rec.key))}
                        />
                      ),
                    },
                  ]}
                />
              </div>

              {/* Step 2 Actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: 12, marginTop: 24 }}>
                <Button
                  onClick={() => setAddStep(1)}
                  icon={<ArrowLeftOutlined />}
                  style={{ borderRadius: 'var(--radius-base)', height: 42, padding: '0 24px' }}
                >
                  Back
                </Button>
                <Button
                  type="primary"
                  htmlType="submit"
                  icon={<UserAddOutlined />}
                  style={{
                    borderRadius: 'var(--radius-base)',
                    height: 42,
                    padding: '0 28px',
                    backgroundColor: 'var(--color-primary)',
                    borderColor: 'var(--color-primary)',
                    color: '#ffffff',
                    fontWeight: 600,
                  }}
                >
                  Add Employee
                </Button>
              </div>
            </div>
          )}
        </Form>
      </Modal>

      {/* 3. ADD TEMPORARY / PART-TIME STAFF MODAL (SCREENSHOT 4) */}
      <Modal
        title={
          <div>
            <div style={{ fontSize: 18, fontWeight: 700, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
              Add Temporary / Part-Time Staff
            </div>
            <div style={{ fontSize: 12, color: isDarkMode ? '#888888' : '#64748b', marginTop: 2 }}>
              Add trainer or coach who will work for a limited period or specific hours.
            </div>
          </div>
        }
        open={isTempStaffModalOpen}
        onCancel={() => {
          setIsTempStaffModalOpen(false);
          tempStaffForm.resetFields();
          setTempStaffPhoto(null);
        }}
        footer={null}
        width={760}
        centered
        destroyOnClose
        styles={{ body: { padding: '12px 4px 16px 4px' } }}
      >
        <Form form={tempStaffForm} layout="vertical" onFinish={handleAddTempStaffSubmit}>
          <Row gutter={24}>
            {/* Left Column: Basic Details & Engagement Period */}
            <Col xs={24} sm={12}>
              <Row gutter={12} align="top" style={{ marginBottom: 12 }}>
                <Col span={9}>
                  <div style={{ fontSize: 12, fontWeight: 600, color: isDarkMode ? '#cccccc' : '#334155', marginBottom: 4 }}>
                    Staff Photo
                  </div>
                  <div
                    onClick={() => {
                      const input = document.createElement('input');
                      input.type = 'file';
                      input.accept = 'image/*';
                      input.onchange = (e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (re) => setTempStaffPhoto(re.target?.result);
                          reader.readAsDataURL(file);
                          message.success('Photo uploaded');
                        }
                      };
                      input.click();
                    }}
                    style={{
                      height: 110,
                      borderRadius: 'var(--radius-base)',
                      border: `2px dashed ${tempStaffPhoto ? '#722ed1' : isDarkMode ? '#333333' : '#d0d7de'}`,
                      backgroundColor: isDarkMode ? '#141414' : '#fafafa',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      padding: 6,
                      textAlign: 'center',
                    }}
                  >
                    {tempStaffPhoto ? (
                      <img src={tempStaffPhoto} alt="Staff" style={{ width: '100%', height: '100%', objectFit: 'cover', borderRadius: 6 }} />
                    ) : (
                      <>
                        <CameraOutlined style={{ fontSize: 24, color: '#722ed1', marginBottom: 4 }} />
                        <div style={{ fontSize: 11.5, fontWeight: 700, color: '#722ed1' }}>Upload Photo</div>
                        <div style={{ fontSize: 9.5, color: isDarkMode ? '#888888' : '#64748b' }}>JPG, PNG (Max 2MB)</div>
                      </>
                    )}
                  </div>
                </Col>

                <Col span={15}>
                  <Form.Item label={<span style={{ fontWeight: 600, fontSize: 12 }}>Full Name <span style={{ color: '#ef4444' }}>*</span></span>} name="name" rules={[{ required: true, message: 'Required' }]} style={{ marginBottom: 10 }}>
                    <Input placeholder="Enter full name" style={{ height: 38, borderRadius: 'var(--radius-base)' }} />
                  </Form.Item>

                  <Form.Item label={<span style={{ fontWeight: 600, fontSize: 12 }}>Phone Number <span style={{ color: '#ef4444' }}>*</span></span>} required style={{ marginBottom: 10 }}>
                    <Input.Group compact>
                      <Form.Item name="countryCode" initialValue="+91" noStyle>
                        <Select style={{ width: '38%', height: 38 }}>
                          <Option value="+91">+91</Option>
                          <Option value="+1">+1</Option>
                        </Select>
                      </Form.Item>
                      <Form.Item name="phone" noStyle rules={[{ required: true, message: 'Required' }]}>
                        <Input placeholder="Enter phone" style={{ width: '62%', height: 38, borderRadius: '0 8px 8px 0' }} />
                      </Form.Item>
                    </Input.Group>
                  </Form.Item>
                </Col>
              </Row>

              <Form.Item label={<span style={{ fontWeight: 600, fontSize: 12 }}>Email ID</span>} name="email" style={{ marginBottom: 12 }}>
                <Input placeholder="Enter email address" style={{ height: 38, borderRadius: 'var(--radius-base)' }} />
              </Form.Item>

              <Form.Item label={<span style={{ fontWeight: 600, fontSize: 12 }}>Role / Designation <span style={{ color: '#ef4444' }}>*</span></span>} name="role" initialValue="Trainer" rules={[{ required: true }]} style={{ marginBottom: 4 }}>
                <Select style={{ height: 38 }}>
                  <Option value="Trainer">Trainer</Option>
                  <Option value="Coach">Coach</Option>
                  <Option value="Yoga Instructor">Yoga Instructor</Option>
                  <Option value="Zumba Instructor">Zumba Instructor</Option>
                </Select>
              </Form.Item>
              <div style={{ fontSize: 10.5, color: isDarkMode ? '#888888' : '#64748b', marginBottom: 14 }}>
                e.g., Trainer, Coach, Yoga Instructor
              </div>

              {/* Employment Type Selection */}
              <div style={{ marginBottom: 16 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: isDarkMode ? '#cccccc' : '#334155', marginBottom: 6 }}>
                  Employment Type <span style={{ color: '#ef4444' }}>*</span>
                </div>
                <Row gutter={10}>
                  <Col span={12}>
                    <div
                      onClick={() => setTempEmploymentType('Temporary')}
                      style={{
                        padding: '10px 12px',
                        borderRadius: 'var(--radius-base)',
                        border: `1.5px solid ${tempEmploymentType === 'Temporary' ? 'var(--color-primary)' : isDarkMode ? '#262626' : '#e2e8f0'}`,
                        backgroundColor: tempEmploymentType === 'Temporary' ? (isDarkMode ? 'rgba(0, 56, 130, 0.25)' : '#edf4fe') : isDarkMode ? '#141414' : '#ffffff',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                      }}
                    >
                      <CalendarOutlined style={{ fontSize: 18, color: tempEmploymentType === 'Temporary' ? 'var(--color-primary)' : '#888888' }} />
                      <div>
                        <div style={{ fontSize: 12.5, fontWeight: 700, color: tempEmploymentType === 'Temporary' ? 'var(--color-primary)' : isDarkMode ? '#ffffff' : '#0f172a' }}>
                          Temporary
                        </div>
                        <div style={{ fontSize: 10, color: isDarkMode ? '#888888' : '#64748b' }}>For a specific period</div>
                      </div>
                    </div>
                  </Col>
                  <Col span={12}>
                    <div
                      onClick={() => setTempEmploymentType('Part-Time')}
                      style={{
                        padding: '10px 12px',
                        borderRadius: 'var(--radius-base)',
                        border: `1.5px solid ${tempEmploymentType === 'Part-Time' ? 'var(--color-primary)' : isDarkMode ? '#262626' : '#e2e8f0'}`,
                        backgroundColor: tempEmploymentType === 'Part-Time' ? (isDarkMode ? 'rgba(0, 56, 130, 0.25)' : '#edf4fe') : isDarkMode ? '#141414' : '#ffffff',
                        cursor: 'pointer',
                        display: 'flex',
                        alignItems: 'center',
                        gap: 10,
                      }}
                    >
                      <ClockCircleOutlined style={{ fontSize: 18, color: tempEmploymentType === 'Part-Time' ? 'var(--color-primary)' : '#888888' }} />
                      <div>
                        <div style={{ fontSize: 12.5, fontWeight: 700, color: tempEmploymentType === 'Part-Time' ? 'var(--color-primary)' : isDarkMode ? '#ffffff' : '#0f172a' }}>
                          Part-Time
                        </div>
                        <div style={{ fontSize: 10, color: isDarkMode ? '#888888' : '#64748b' }}>Work specific days</div>
                      </div>
                    </div>
                  </Col>
                </Row>
              </div>

              {/* Engagement Period */}
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: isDarkMode ? '#cccccc' : '#334155', marginBottom: 6 }}>
                  Engagement Period (For Temporary Staff)
                </div>
                <Row gutter={10}>
                  <Col span={12}>
                    <Form.Item label={<span style={{ fontSize: 11 }}>Start Date <span style={{ color: '#ef4444' }}>*</span></span>} name="startDate" style={{ marginBottom: 4 }}>
                      <DatePicker placeholder="Select start date" style={{ width: '100%', height: 38, borderRadius: 'var(--radius-base)' }} />
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label={<span style={{ fontSize: 11 }}>End Date <span style={{ color: '#ef4444' }}>*</span></span>} name="endDate" style={{ marginBottom: 4 }}>
                      <DatePicker placeholder="Select end date" style={{ width: '100%', height: 38, borderRadius: 'var(--radius-base)' }} />
                    </Form.Item>
                  </Col>
                </Row>
                <div style={{ fontSize: 10.5, color: isDarkMode ? '#888888' : '#64748b', marginTop: 4 }}>
                  Staff will be active only between the selected dates.
                </div>
              </div>
            </Col>

            {/* Right Column: Schedule & Pay */}
            <Col xs={24} sm={12}>
              {/* Working Days */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: isDarkMode ? '#cccccc' : '#334155', marginBottom: 6 }}>
                  Schedule (For Part-Time Staff)
                </div>
                <div style={{ fontSize: 11.5, color: isDarkMode ? '#888888' : '#64748b', marginBottom: 6 }}>
                  Working Days <span style={{ color: '#ef4444' }}>*</span>
                </div>
                <div style={{ display: 'flex', gap: 6, flexWrap: 'wrap' }}>
                  {['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'].map((day) => {
                    const isSelected = workingDays.includes(day);
                    return (
                      <div
                        key={day}
                        onClick={() => {
                          if (isSelected) setWorkingDays(workingDays.filter((d) => d !== day));
                          else setWorkingDays([...workingDays, day]);
                        }}
                        style={{
                          width: 44,
                          height: 38,
                          borderRadius: 'var(--radius-base)',
                          backgroundColor: isSelected ? 'var(--color-primary)' : isDarkMode ? '#1a1a1a' : '#f1f5f9',
                          color: isSelected ? '#ffffff' : isDarkMode ? '#cccccc' : '#334155',
                          display: 'flex',
                          flexDirection: 'column',
                          alignItems: 'center',
                          justifyContent: 'center',
                          fontSize: 11,
                          fontWeight: 600,
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                        }}
                      >
                        <span>{day}</span>
                        {isSelected && <CheckOutlined style={{ fontSize: 9, marginTop: 1 }} />}
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Working Time */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 11.5, fontWeight: 600, color: isDarkMode ? '#cccccc' : '#334155', marginBottom: 6 }}>
                  Working Time <span style={{ color: '#ef4444' }}>*</span>
                </div>
                <Row gutter={8} align="middle">
                  <Col span={11}>
                    <TimePicker use12Hours format="h:mm a" placeholder="09:00 AM" style={{ width: '100%', height: 38, borderRadius: 'var(--radius-base)' }} />
                  </Col>
                  <Col span={2} style={{ textAlign: 'center', color: '#888888' }}>to</Col>
                  <Col span={11}>
                    <TimePicker use12Hours format="h:mm a" placeholder="06:00 PM" style={{ width: '100%', height: 38, borderRadius: 'var(--radius-base)' }} />
                  </Col>
                </Row>
                <Checkbox style={{ fontSize: 11, color: isDarkMode ? '#888888' : '#64748b', marginTop: 6 }}>
                  Different time for different days
                </Checkbox>
              </div>

              {/* Pay / Compensation */}
              <div style={{ marginBottom: 14 }}>
                <div style={{ fontSize: 12, fontWeight: 600, color: isDarkMode ? '#cccccc' : '#334155', marginBottom: 6 }}>
                  Pay / Compensation
                </div>
                <Row gutter={10}>
                  <Col span={12}>
                    <Form.Item label={<span style={{ fontSize: 11 }}>Pay Type <span style={{ color: '#ef4444' }}>*</span></span>} name="payType" initialValue="Hourly" style={{ marginBottom: 8 }}>
                      <Select style={{ height: 38 }}>
                        <Option value="Hourly">Per Hour</Option>
                        <Option value="Session">Per Session</Option>
                        <Option value="Daily">Daily</Option>
                        <Option value="Monthly">Monthly</Option>
                      </Select>
                    </Form.Item>
                  </Col>
                  <Col span={12}>
                    <Form.Item label={<span style={{ fontSize: 11 }}>Amount <span style={{ color: '#ef4444' }}>*</span></span>} name="payAmount" initialValue="500" style={{ marginBottom: 8 }}>
                      <Input prefix="₹" style={{ height: 38, borderRadius: 'var(--radius-base)' }} />
                    </Form.Item>
                  </Col>
                </Row>

                <Form.Item label={<span style={{ fontSize: 11 }}>Payment Frequency <span style={{ color: '#ef4444' }}>*</span></span>} name="payFreq" initialValue="Weekly" style={{ marginBottom: 4 }}>
                  <Select style={{ height: 38 }}>
                    <Option value="Daily">Daily</Option>
                    <Option value="Weekly">Weekly</Option>
                    <Option value="Monthly">Monthly</Option>
                  </Select>
                </Form.Item>
                <div style={{ fontSize: 10.5, color: isDarkMode ? '#888888' : '#64748b', marginBottom: 12 }}>
                  e.g., Per Hour, Per Session, Daily, Weekly
                </div>
              </div>

              {/* Additional Notes */}
              <div>
                <div style={{ fontSize: 12, fontWeight: 600, color: isDarkMode ? '#cccccc' : '#334155', marginBottom: 6 }}>
                  Additional Notes (Optional)
                </div>
                <TextArea rows={2} placeholder="Enter any additional information..." maxLength={250} showCount style={{ borderRadius: 'var(--radius-base)' }} />
              </div>
            </Col>
          </Row>

          {/* Bottom Deactivation Notice */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: 8,
              padding: '10px 14px',
              borderRadius: 'var(--radius-base)',
              backgroundColor: isDarkMode ? 'rgba(114, 46, 209, 0.12)' : '#f3effe',
              color: isDarkMode ? '#d3adf7' : '#531dab',
              fontSize: 12,
              fontWeight: 500,
              marginTop: 18,
              marginBottom: 18,
            }}
          >
            <InfoCircleOutlined style={{ color: '#722ed1', fontSize: 14 }} />
            <span>Temporary staff will be automatically deactivated after the end date.</span>
          </div>

          {/* Modal Actions */}
          <div style={{ display: 'flex', justifyContent: 'flex-end', gap: 12 }}>
            <Button
              onClick={() => setIsTempStaffModalOpen(false)}
              style={{ borderRadius: 'var(--radius-base)', height: 42, padding: '0 24px' }}
            >
              Cancel
            </Button>
            <Button
              type="primary"
              htmlType="submit"
              icon={<UserAddOutlined />}
              style={{
                backgroundColor: 'var(--color-primary)',
                borderColor: 'var(--color-primary)',
                borderRadius: 'var(--radius-base)',
                fontWeight: 600,
                height: 42,
                padding: '0 28px',
                color: '#ffffff',
              }}
            >
              Add Staff
            </Button>
          </div>
        </Form>
      </Modal>

      {/* 4. EMPLOYEE ADDED SUCCESSFULLY CONFIRMATION MODAL (CANVAS CONFETTI POPPER) */}
      <Modal
        open={isSuccessModalOpen}
        onCancel={() => setIsSuccessModalOpen(false)}
        footer={null}
        width={460}
        centered
        destroyOnClose
        styles={{ body: { padding: '24px 20px 16px 20px' } }}
      >
        {addedEmployeeData && (
          <div>
            {/* Header: Success Icon Badge & Confetti Animation */}
            <div style={{ textAlign: 'center', marginBottom: 20 }}>
              <div
                style={{
                  width: 68,
                  height: 68,
                  borderRadius: '50%',
                  backgroundColor: isDarkMode ? 'rgba(0, 191, 98, 0.15)' : '#eaf8ef',
                  border: `2px solid ${isDarkMode ? 'rgba(0, 191, 98, 0.3)' : '#b7eb8f'}`,
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  margin: '0 auto 16px auto',
                  fontSize: 30,
                  color: '#00bf62',
                  boxShadow: '0 4px 16px rgba(0, 191, 98, 0.25)',
                }}
              >
                <CheckOutlined style={{ strokeWidth: 2.5 }} />
              </div>

              <div
                style={{
                  fontSize: 20,
                  fontWeight: 800,
                  color: isDarkMode ? '#ffffff' : '#0f172a',
                  fontFamily: 'var(--font-display)',
                }}
              >
                Employee Added Successfully!
              </div>
              <div
                style={{
                  fontSize: 13,
                  color: isDarkMode ? '#888888' : '#64748b',
                  marginTop: 4,
                }}
              >
                The employee has been added to your team.
              </div>
            </div>

            {/* Profile Highlight Card */}
            <div
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: 14,
                padding: '16px',
                borderRadius: 'var(--radius-base)',
                backgroundColor: isDarkMode ? '#141414' : '#f8fafc',
                border: `1px solid ${isDarkMode ? '#222222' : '#e2e8f0'}`,
                marginBottom: 18,
              }}
            >
              <Avatar src={addedEmployeeData.avatar} size={60} style={{ border: '2px solid #722ed1', flexShrink: 0 }} />
              <div>
                <div style={{ fontSize: 18, fontWeight: 700, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                  {addedEmployeeData.name}
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 8, marginTop: 4 }}>
                  <span style={{ fontSize: 13, fontWeight: 650, color: '#722ed1' }}>{addedEmployeeData.role}</span>
                  <Tag
                    style={{
                      backgroundColor: isDarkMode ? 'rgba(0, 191, 98, 0.15)' : '#eaf8ef',
                      color: '#00bf62',
                      border: 'none',
                      borderRadius: 'var(--radius-base)',
                      fontWeight: 600,
                      fontSize: 10.5,
                      padding: '1px 8px',
                      margin: 0,
                    }}
                  >
                    ● Active
                  </Tag>
                </div>
                <div style={{ fontSize: 12, color: isDarkMode ? '#888888' : '#64748b', marginTop: 4, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <PhoneOutlined /> {addedEmployeeData.phone}
                </div>
                <div style={{ fontSize: 12, color: isDarkMode ? '#888888' : '#64748b', marginTop: 2, display: 'flex', alignItems: 'center', gap: 6 }}>
                  <MailOutlined /> {addedEmployeeData.email}
                </div>
              </div>
            </div>

            {/* Details Specifications Rows */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: 14,
                padding: '14px 0',
                borderTop: `1px solid ${isDarkMode ? '#1e1e1e' : '#f1f5f9'}`,
                borderBottom: `1px solid ${isDarkMode ? '#1e1e1e' : '#f1f5f9'}`,
                marginBottom: 20,
              }}
            >
              {/* Row 1: Employee ID */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: isDarkMode ? '#cccccc' : '#475569', fontSize: 13.5, fontWeight: 500 }}>
                  <IdcardOutlined style={{ color: isDarkMode ? '#888888' : '#64748b' }} />
                  <span>Employee ID</span>
                </div>
                <div style={{ fontSize: 14, fontWeight: 700, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                  {addedEmployeeData.employeeId}
                </div>
              </div>

              {/* Row 2: Start Date */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: isDarkMode ? '#cccccc' : '#475569', fontSize: 13.5, fontWeight: 500 }}>
                  <CalendarOutlined style={{ color: isDarkMode ? '#888888' : '#64748b' }} />
                  <span>Start Date</span>
                </div>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                  {addedEmployeeData.joinDate}
                </div>
              </div>

              {/* Row 3: Branch */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: isDarkMode ? '#cccccc' : '#475569', fontSize: 13.5, fontWeight: 500 }}>
                  <ShopOutlined style={{ color: isDarkMode ? '#888888' : '#64748b' }} />
                  <span>Branch</span>
                </div>
                <div style={{ fontSize: 13, fontWeight: 600, color: isDarkMode ? '#cccccc' : '#334155' }}>
                  {addedEmployeeData.branch}
                </div>
              </div>

              {/* Row 4: Designation */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: isDarkMode ? '#cccccc' : '#475569', fontSize: 13.5, fontWeight: 500 }}>
                  <TeamOutlined style={{ color: isDarkMode ? '#888888' : '#64748b' }} />
                  <span>Designation</span>
                </div>
                <div style={{ fontSize: 13.5, fontWeight: 600, color: isDarkMode ? '#ffffff' : '#0f172a' }}>
                  {addedEmployeeData.role}
                </div>
              </div>

              {/* Row 5: Access Type */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: 10, color: isDarkMode ? '#cccccc' : '#475569', fontSize: 13.5, fontWeight: 500 }}>
                  <CrownOutlined style={{ color: isDarkMode ? '#888888' : '#64748b' }} />
                  <span>Access Type</span>
                </div>
                <div style={{ fontSize: 13.5, fontWeight: 700, color: '#722ed1' }}>
                  {addedEmployeeData.accessType}
                </div>
              </div>
            </div>

            {/* Bottom Full-Width Action */}
            <Button
              type="primary"
              block
              onClick={() => {
                setIsSuccessModalOpen(false);
                handleOpenDetails(addedEmployeeData);
              }}
              style={{
                height: 46,
                borderRadius: 'var(--radius-base)',
                fontWeight: 600,
                fontSize: 15,
                backgroundColor: 'var(--color-primary)',
                borderColor: 'var(--color-primary)',
                color: '#ffffff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                gap: 8,
              }}
            >
              View Employee <ArrowRightOutlined />
            </Button>
          </div>
        )}
      </Modal>

      {/* 5. CUSTOM DATE RANGE MODAL */}
      <Modal
        title="Select Custom Date Range"
        open={isDateRangeModalOpen}
        onCancel={() => {
          setIsDateRangeModalOpen(false);
          setTempDateRange(null);
        }}
        onOk={() => {
          if (tempDateRange && tempDateRange.length === 2 && tempDateRange[0] && tempDateRange[1]) {
            const start = tempDateRange[0].format('DD MMM YYYY');
            const end = tempDateRange[1].format('DD MMM YYYY');
            setSelectedDateRange(`${start} - ${end}`);
            setIsDateRangeModalOpen(false);
            message.success(`Date filter set: ${start} - ${end}`);
          } else {
            message.warning('Please pick both start and end dates');
          }
        }}
        okText="Apply Filter"
        cancelText="Cancel"
        destroyOnClose
      >
        <div style={{ padding: '16px 0' }}>
          <Paragraph style={{ color: isDarkMode ? '#888888' : '#64748b', fontSize: 13, marginBottom: 16 }}>
            Pick start date and end date to filter employee attendance and records:
          </Paragraph>
          <DatePicker.RangePicker
            style={{ width: '100%', height: 42 }}
            onChange={(dates) => setTempDateRange(dates)}
          />
        </div>
      </Modal>
    </div>
  );
};

export default EmployeeManagement;
