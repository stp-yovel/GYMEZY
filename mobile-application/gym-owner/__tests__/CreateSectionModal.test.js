import React from 'react';
import {
  CreateSectionModal,
  SECTION_CATEGORIES,
  TIME_SLOTS,
  ALL_DAYS,
} from '../src/widgets/CreateSectionModal';

// Mock dependencies
jest.mock('react-native-vector-icons/MaterialIcons', () => 'MaterialIcons');

jest.mock('../src/theme/ThemeContext', () => ({
  useTheme: () => ({ isDark: false }),
}));

jest.mock('../src/services/apiService', () => ({
  apiService: {
    getEmployees: jest.fn().mockResolvedValue([
      { _id: 'trainer-01', name: 'John Doe', role: 'Trainer', employeeId: 'EMP001' },
      { _id: 'trainer-02', name: 'Jane Smith', role: 'Yoga Coach', employeeId: 'EMP002' },
    ]),
    createSection: jest.fn().mockResolvedValue({ _id: 'sec-101', title: 'Basic Yoga 20 Days' }),
    updateSection: jest.fn().mockResolvedValue({ _id: 'sec-101', title: 'Updated Yoga' }),
    toggleSectionStatus: jest.fn().mockResolvedValue({ success: true }),
    deleteSection: jest.fn().mockResolvedValue({ success: true }),
  },
}));

describe('CreateSectionModal Constants & Utilities', () => {
  test('SECTION_CATEGORIES contains standard yoga, gym, zumba, crossfit, etc.', () => {
    expect(Array.isArray(SECTION_CATEGORIES)).toBe(true);
    const keys = SECTION_CATEGORIES.map((c) => c.key);
    expect(keys).toContain('yoga');
    expect(keys).toContain('gym');
    expect(keys).toContain('zumba');
    expect(keys).toContain('crossfit');
  });

  test('TIME_SLOTS contains standard 30-min intervals', () => {
    expect(Array.isArray(TIME_SLOTS)).toBe(true);
    expect(TIME_SLOTS).toContain('06:00 AM');
    expect(TIME_SLOTS).toContain('07:00 AM');
    expect(TIME_SLOTS).toContain('06:00 PM');
  });

  test('ALL_DAYS contains all 7 days of the week', () => {
    expect(Array.isArray(ALL_DAYS)).toBe(true);
    expect(ALL_DAYS.length).toBe(7);
    const dayIds = ALL_DAYS.map((d) => d.id);
    expect(dayIds).toEqual(['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun']);
  });
});
