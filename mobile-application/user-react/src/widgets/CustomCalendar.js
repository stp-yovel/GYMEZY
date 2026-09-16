import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  Modal,
  Platform,
} from 'react-native';
import { MaterialIcons, Ionicons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { AppColors } from '../theme/appTheme';

const MONTH_NAMES = [
  'January',
  'February',
  'March',
  'April',
  'May',
  'June',
  'July',
  'August',
  'September',
  'October',
  'November',
  'December',
];

const WEEKDAYS = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
const GRID_WEEKDAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

export const HorizontalDayStripCalendar = ({
  selectedDate,
  onDateSelected,
  daysCount = 14,
  initialStartDate,
  showMonthHeader = true,
  customHeaderTitle,
  padding = 16,
  wrapInCard = true,
}) => {
  const { isDark, colors } = useTheme();
  const baseStart = initialStartDate || new Date();
  const primaryNavy = isDark ? '#2563EB' : AppColors.primaryNavy;

  const currentMonth = selectedDate ? selectedDate.getMonth() : baseStart.getMonth();
  const currentYear = selectedDate ? selectedDate.getFullYear() : baseStart.getFullYear();
  const headerText = customHeaderTitle || `${MONTH_NAMES[currentMonth]} ${currentYear}`;

  const days = Array.from({ length: daysCount }).map((_, index) => {
    const d = new Date(baseStart);
    d.setDate(baseStart.getDate() + index);
    return d;
  });

  const content = (
    <View>
      {showMonthHeader && (
        <Text style={[styles.headerTitle, { color: colors.text }]}>{headerText}</Text>
      )}
      <ScrollView
        horizontal
        showsHorizontalScrollIndicator={false}
        contentContainerStyle={styles.stripScroll}
      >
        {days.map((date, index) => {
          const isSelected =
            selectedDate &&
            selectedDate.getFullYear() === date.getFullYear() &&
            selectedDate.getMonth() === date.getMonth() &&
            selectedDate.getDate() === date.getDate();

          // 0 is Sunday in JS, convert to Mon-Sun
          const dayIdx = date.getDay() === 0 ? 6 : date.getDay() - 1;
          const weekdayLabel = WEEKDAYS[dayIdx];

          return (
            <TouchableOpacity
              key={index}
              activeOpacity={0.7}
              onPress={() => onDateSelected(date)}
              style={[
                styles.dayNode,
                {
                  backgroundColor: isSelected
                    ? primaryNavy
                    : isDark
                    ? '#262626'
                    : '#F1F5F9',
                  borderColor: isSelected
                    ? primaryNavy
                    : isDark
                    ? 'rgba(255, 255, 255, 0.1)'
                    : '#E2E8F0',
                },
              ]}
            >
              <Text
                style={[
                  styles.dayLabel,
                  {
                    color: isSelected
                      ? 'rgba(255, 255, 255, 0.9)'
                      : colors.subtitle,
                    fontWeight: isSelected ? '600' : '500',
                  },
                ]}
              >
                {weekdayLabel}
              </Text>
              <Text
                style={[
                  styles.dayNumber,
                  {
                    color: isSelected ? '#FFFFFF' : colors.text,
                  },
                ]}
              >
                {date.getDate()}
              </Text>
            </TouchableOpacity>
          );
        })}
      </ScrollView>
    </View>
  );

  if (wrapInCard) {
    return (
      <View
        style={[
          styles.cardWrapper,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            padding,
          },
        ]}
      >
        {content}
      </View>
    );
  }

  return content;
};

export const MonthlyGridCalendar = ({
  selectedDate,
  multiSelectedDates,
  onDateSelected,
  onDateToggled,
  startDate,
  minDate,
  maxMonthsAhead = 3,
  showMonthHeader = true,
  padding = 16,
  wrapInCard = true,
}) => {
  const { isDark, colors } = useTheme();
  const today = new Date();
  const effectiveMin = minDate || new Date(today.getFullYear(), today.getMonth(), today.getDate());

  const initialMonth = selectedDate
    ? new Date(selectedDate.getFullYear(), selectedDate.getMonth(), 1)
    : startDate
    ? new Date(startDate.getFullYear(), startDate.getMonth(), 1)
    : new Date(today.getFullYear(), today.getMonth(), 1);

  const [currentMonthDate, setCurrentMonthDate] = useState(initialMonth);
  const [showMonthPicker, setShowMonthPicker] = useState(false);

  const minMonth = new Date(today.getFullYear(), today.getMonth(), 1);
  const maxMonth = new Date(today.getFullYear(), today.getMonth() + maxMonthsAhead, 1);

  const canGoPrevious =
    currentMonthDate.getFullYear() > minMonth.getFullYear() ||
    (currentMonthDate.getFullYear() === minMonth.getFullYear() &&
      currentMonthDate.getMonth() > minMonth.getMonth());

  const canGoNext =
    currentMonthDate.getFullYear() < maxMonth.getFullYear() ||
    (currentMonthDate.getFullYear() === maxMonth.getFullYear() &&
      currentMonthDate.getMonth() < maxMonth.getMonth());

  const handlePreviousMonth = () => {
    if (canGoPrevious) {
      setCurrentMonthDate(
        new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() - 1, 1)
      );
    }
  };

  const handleNextMonth = () => {
    if (canGoNext) {
      setCurrentMonthDate(
        new Date(currentMonthDate.getFullYear(), currentMonthDate.getMonth() + 1, 1)
      );
    }
  };

  // Build grid
  const year = currentMonthDate.getFullYear();
  const month = currentMonthDate.getMonth();
  const firstDayIndex = new Date(year, month, 1).getDay(); // 0 is Sun
  const totalDaysInMonth = new Date(year, month + 1, 0).getDate();
  const totalGridCells = firstDayIndex + totalDaysInMonth;

  // Available months list for picker
  const availableMonths = [];
  let cur = new Date(minMonth);
  while (cur <= maxMonth) {
    availableMonths.push(new Date(cur));
    cur.setMonth(cur.getMonth() + 1);
  }

  const primaryNavy = isDark ? '#2563EB' : AppColors.primaryNavy;

  const content = (
    <View>
      {showMonthHeader && (
        <View style={styles.gridHeaderRow}>
          <TouchableOpacity
            onPress={() => setShowMonthPicker(true)}
            style={styles.monthSelectBtn}
            activeOpacity={0.7}
          >
            <Text style={[styles.headerTitle, { color: colors.text }]}>
              {`${MONTH_NAMES[month]} ${year}`}
            </Text>
            <MaterialIcons
              name="keyboard-arrow-down"
              size={20}
              color={colors.subtitle}
              style={{ marginLeft: 4 }}
            />
          </TouchableOpacity>

          <View style={styles.navArrowsRow}>
            <TouchableOpacity
              onPress={handlePreviousMonth}
              disabled={!canGoPrevious}
              style={styles.arrowBtn}
            >
              <MaterialIcons
                name="chevron-left"
                size={24}
                color={canGoPrevious ? colors.text : 'rgba(148, 163, 184, 0.3)'}
              />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={handleNextMonth}
              disabled={!canGoNext}
              style={styles.arrowBtn}
            >
              <MaterialIcons
                name="chevron-right"
                size={24}
                color={canGoNext ? colors.text : 'rgba(148, 163, 184, 0.3)'}
              />
            </TouchableOpacity>
          </View>
        </View>
      )}

      {/* Weekday headers */}
      <View style={styles.weekdayRow}>
        {GRID_WEEKDAYS.map((w, idx) => (
          <View key={idx} style={styles.weekdayCell}>
            <Text style={[styles.weekdayText, { color: colors.subtitle }]}>{w}</Text>
          </View>
        ))}
      </View>

      {/* Grid cells */}
      <View style={styles.gridContainer}>
        {Array.from({ length: totalGridCells }).map((_, index) => {
          if (index < firstDayIndex) {
            return <View key={`empty-${index}`} style={styles.gridCell} />;
          }

          const dayNumber = index - firstDayIndex + 1;
          const cellDate = new Date(year, month, dayNumber);
          const isPast = cellDate < effectiveMin;

          const isSelected = multiSelectedDates
            ? multiSelectedDates.some(
                (d) =>
                  d.getFullYear() === cellDate.getFullYear() &&
                  d.getMonth() === cellDate.getMonth() &&
                  d.getDate() === cellDate.getDate()
              )
            : selectedDate &&
              selectedDate.getFullYear() === cellDate.getFullYear() &&
              selectedDate.getMonth() === cellDate.getMonth() &&
              selectedDate.getDate() === cellDate.getDate();

          return (
            <TouchableOpacity
              key={`day-${dayNumber}`}
              disabled={isPast}
              onPress={() => {
                if (onDateSelected) onDateSelected(cellDate);
                if (onDateToggled) onDateToggled(cellDate);
              }}
              style={styles.gridCell}
            >
              <View
                style={[
                  styles.circleNode,
                  {
                    backgroundColor: isSelected
                      ? primaryNavy
                      : isDark
                      ? '#262626'
                      : '#F8FAFC',
                    borderColor: isSelected
                      ? primaryNavy
                      : isDark
                      ? isPast
                        ? 'transparent'
                        : 'rgba(255, 255, 255, 0.12)'
                      : isPast
                      ? 'rgba(226, 232, 240, 0.4)'
                      : '#DCE5F2',
                  },
                ]}
              >
                <Text
                  style={[
                    styles.nodeNumber,
                    {
                      color: isSelected
                        ? '#FFFFFF'
                        : isPast
                        ? 'rgba(148, 163, 184, 0.35)'
                        : isDark
                        ? '#FFFFFF'
                        : AppColors.primaryNavy,
                      fontWeight: isSelected ? '800' : '600',
                    },
                  ]}
                >
                  {dayNumber}
                </Text>
              </View>
            </TouchableOpacity>
          );
        })}
      </View>

      {/* Month picker modal */}
      <Modal visible={showMonthPicker} transparent animationType="fade">
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={() => setShowMonthPicker(false)}
        >
          <View
            style={[
              styles.monthPickerCard,
              { backgroundColor: colors.card, borderColor: colors.border },
            ]}
          >
            <Text style={[styles.pickerTitle, { color: colors.text }]}>
              Choose Month
            </Text>
            {availableMonths.map((m, idx) => {
              const isCur =
                m.getFullYear() === currentMonthDate.getFullYear() &&
                m.getMonth() === currentMonthDate.getMonth();

              return (
                <TouchableOpacity
                  key={idx}
                  onPress={() => {
                    setCurrentMonthDate(m);
                    setShowMonthPicker(false);
                  }}
                  style={[
                    styles.monthItem,
                    {
                      backgroundColor: isCur
                        ? isDark
                          ? '#262626'
                          : '#F1F5F9'
                        : 'transparent',
                    },
                  ]}
                >
                  <Text
                    style={[
                      styles.monthItemText,
                      {
                        color: isCur ? AppColors.primaryNavy : colors.text,
                        fontWeight: isCur ? '700' : '500',
                      },
                    ]}
                  >
                    {`${MONTH_NAMES[m.getMonth()]} ${m.getFullYear()}`}
                  </Text>
                  {isCur && (
                    <MaterialIcons
                      name="check-circle"
                      size={20}
                      color={AppColors.primaryNavy}
                    />
                  )}
                </TouchableOpacity>
              );
            })}
          </View>
        </TouchableOpacity>
      </Modal>
    </View>
  );

  if (wrapInCard) {
    return (
      <View
        style={[
          styles.cardWrapper,
          {
            backgroundColor: colors.card,
            borderColor: colors.border,
            padding,
          },
        ]}
      >
        {content}
      </View>
    );
  }

  return content;
};

const styles = StyleSheet.create({
  cardWrapper: {
    borderRadius: 24,
    borderWidth: 1.2,
    marginVertical: 6,
  },
  headerTitle: {
    fontSize: 17,
    fontWeight: '700',
    letterSpacing: -0.3,
  },
  stripScroll: {
    paddingTop: 14,
    flexDirection: 'row',
  },
  dayNode: {
    width: 58,
    height: 82,
    borderRadius: 20,
    borderWidth: 1.2,
    marginRight: 10,
    alignItems: 'center',
    justifyContent: 'center',
  },
  dayLabel: {
    fontSize: 13,
  },
  dayNumber: {
    fontSize: 18,
    fontWeight: '800',
    marginTop: 5,
  },
  gridHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 14,
  },
  monthSelectBtn: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 4,
  },
  navArrowsRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  arrowBtn: {
    padding: 4,
    marginLeft: 4,
  },
  weekdayRow: {
    flexDirection: 'row',
    marginBottom: 10,
  },
  weekdayCell: {
    flex: 1,
    alignItems: 'center',
  },
  weekdayText: {
    fontSize: 13,
    fontWeight: '600',
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  gridCell: {
    width: `${100 / 7}%`,
    aspectRatio: 1,
    alignItems: 'center',
    justifyContent: 'center',
    padding: 3,
  },
  circleNode: {
    width: '100%',
    height: '100%',
    borderRadius: 22,
    borderWidth: 1.2,
    alignItems: 'center',
    justifyContent: 'center',
  },
  nodeNumber: {
    fontSize: 14,
  },
  modalBackdrop: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    padding: 24,
  },
  monthPickerCard: {
    borderRadius: 24,
    borderWidth: 1,
    padding: 20,
  },
  pickerTitle: {
    fontSize: 17,
    fontWeight: '700',
    marginBottom: 14,
  },
  monthItem: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 14,
    borderRadius: 14,
    marginBottom: 6,
  },
  monthItemText: {
    fontSize: 15,
  },
});
