import 'package:flutter/material.dart';
import '../theme/app_theme.dart';

/// Month names helper
const List<String> _kMonthNames = [
  'January', 'February', 'March', 'April', 'May', 'June',
  'July', 'August', 'September', 'October', 'November', 'December'
];

/// Weekday labels helper
const List<String> _kWeekdays = [
  'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'
];

/// Premium Horizontal Day Strip Calendar Widget (Matches single-day view design)
class HorizontalDayStripCalendar extends StatelessWidget {
  final DateTime selectedDate;
  final ValueChanged<DateTime> onDateSelected;
  final int daysCount;
  final DateTime? initialStartDate;
  final bool showMonthHeader;
  final String? customHeaderTitle;
  final EdgeInsetsGeometry padding;
  final bool wrapInCard;

  const HorizontalDayStripCalendar({
    super.key,
    required this.selectedDate,
    required this.onDateSelected,
    this.daysCount = 14,
    this.initialStartDate,
    this.showMonthHeader = true,
    this.customHeaderTitle,
    this.padding = const EdgeInsets.all(16),
    this.wrapInCard = true,
  });

  @override
  Widget build(BuildContext context) {
    final isDark = AppTheme.isDark(context);
    final baseStart = initialStartDate ?? DateTime.now();
    final cardColor = AppTheme.getCardColor(context);
    final textColor = AppTheme.getTextColor(context);
    final subtitleColor = AppTheme.getSubtitleColor(context);
    final borderColor = AppTheme.getBorderColor(context);
    final primaryNavy = isDark ? const Color(0xFF2563EB) : AppTheme.primaryNavy;

    final headerText = customHeaderTitle ?? "${_kMonthNames[selectedDate.month - 1]} ${selectedDate.year}";

    Widget content = Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      mainAxisSize: MainAxisSize.min,
      children: [
        if (showMonthHeader) ...[
          Text(
            headerText,
            style: TextStyle(
              fontSize: 17,
              fontWeight: FontWeight.w700,
              color: textColor,
              letterSpacing: -0.3,
            ),
          ),
          const SizedBox(height: 14),
        ],
        SizedBox(
          height: 82,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            physics: const BouncingScrollPhysics(),
            itemCount: daysCount,
            itemBuilder: (context, index) {
              final date = baseStart.add(Duration(days: index));
              final isSelected = selectedDate.year == date.year &&
                  selectedDate.month == date.month &&
                  selectedDate.day == date.day;

              final weekdayLabel = _kWeekdays[date.weekday - 1];

              return GestureDetector(
                onTap: () => onDateSelected(date),
                child: AnimatedContainer(
                  duration: const Duration(milliseconds: 200),
                  curve: Curves.easeInOut,
                  margin: EdgeInsets.only(right: index == daysCount - 1 ? 0 : 10),
                  width: 58,
                  decoration: BoxDecoration(
                    color: isSelected
                        ? primaryNavy
                        : (isDark ? const Color(0xFF262626) : const Color(0xFFF1F5F9)),
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(
                      color: isSelected
                          ? primaryNavy
                          : (isDark ? Colors.white10 : const Color(0xFFE2E8F0)),
                      width: 1.2,
                    ),
                  ),
                  child: Column(
                    mainAxisAlignment: MainAxisAlignment.center,
                    children: [
                      Text(
                        weekdayLabel,
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: isSelected ? FontWeight.w600 : FontWeight.w500,
                          color: isSelected ? Colors.white.withValues(alpha: 0.9) : subtitleColor,
                        ),
                      ),
                      const SizedBox(height: 5),
                      Text(
                        "${date.day}",
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w800,
                          color: isSelected ? Colors.white : textColor,
                        ),
                      ),
                    ],
                  ),
                ),
              );
            },
          ),
        ),
      ],
    );

    if (wrapInCard) {
      return Container(
        padding: padding,
        decoration: BoxDecoration(
          color: cardColor,
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: borderColor, width: 1.2),
        ),
        child: content,
      );
    }

    return content;
  }
}

/// Premium Monthly Grid Calendar Widget with circular day nodes and month switcher (Current month + 3 months)
class MonthlyGridCalendar extends StatefulWidget {
  final DateTime? selectedDate;
  final Set<DateTime>? multiSelectedDates;
  final ValueChanged<DateTime>? onDateSelected;
  final ValueChanged<DateTime>? onDateToggled;
  final DateTime? startDate;
  final DateTime? minDate;
  final int maxMonthsAhead;
  final bool showMonthHeader;
  final EdgeInsetsGeometry padding;
  final bool wrapInCard;

  const MonthlyGridCalendar({
    super.key,
    this.selectedDate,
    this.multiSelectedDates,
    this.onDateSelected,
    this.onDateToggled,
    this.startDate,
    this.minDate,
    this.maxMonthsAhead = 3, // current month + 3 months ahead
    this.showMonthHeader = true,
    this.padding = const EdgeInsets.all(16),
    this.wrapInCard = true,
  });

  @override
  State<MonthlyGridCalendar> createState() => _MonthlyGridCalendarState();
}

class _MonthlyGridCalendarState extends State<MonthlyGridCalendar> {
  late DateTime _currentMonth;
  late DateTime _minMonth;
  late DateTime _maxMonth;

  @override
  void initState() {
    super.initState();
    final now = DateTime.now();
    _minMonth = DateTime(now.year, now.month, 1);
    _maxMonth = DateTime(now.year, now.month + widget.maxMonthsAhead, 1);

    if (widget.selectedDate != null) {
      _currentMonth = DateTime(widget.selectedDate!.year, widget.selectedDate!.month, 1);
    } else if (widget.startDate != null) {
      _currentMonth = DateTime(widget.startDate!.year, widget.startDate!.month, 1);
    } else {
      _currentMonth = _minMonth;
    }

    // Clamp _currentMonth within [_minMonth, _maxMonth]
    if (_currentMonth.isBefore(_minMonth)) _currentMonth = _minMonth;
    if (_currentMonth.isAfter(_maxMonth)) _currentMonth = _maxMonth;
  }

  @override
  void didUpdateWidget(covariant MonthlyGridCalendar oldWidget) {
    super.didUpdateWidget(oldWidget);
    if (widget.selectedDate != null && widget.selectedDate != oldWidget.selectedDate) {
      final targetMonth = DateTime(widget.selectedDate!.year, widget.selectedDate!.month, 1);
      if (!targetMonth.isBefore(_minMonth) && !targetMonth.isAfter(_maxMonth)) {
        _currentMonth = targetMonth;
      }
    }
  }

  bool get _canGoPrevious {
    return _currentMonth.year > _minMonth.year || _currentMonth.month > _minMonth.month;
  }

  bool get _canGoNext {
    return _currentMonth.year < _maxMonth.year || _currentMonth.month < _maxMonth.month;
  }

  void _previousMonth() {
    if (_canGoPrevious) {
      setState(() {
        _currentMonth = DateTime(_currentMonth.year, _currentMonth.month - 1, 1);
      });
    }
  }

  void _nextMonth() {
    if (_canGoNext) {
      setState(() {
        _currentMonth = DateTime(_currentMonth.year, _currentMonth.month + 1, 1);
      });
    }
  }

  void _showMonthPickerSheet(BuildContext context, bool isDark, Color textColor, Color cardColor) {
    showModalBottomSheet(
      context: context,
      backgroundColor: cardColor,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (ctx) {
        final availableMonths = <DateTime>[];
        var cursor = _minMonth;
        while (!cursor.isAfter(_maxMonth)) {
          availableMonths.add(cursor);
          cursor = DateTime(cursor.year, cursor.month + 1, 1);
        }

        return SafeArea(
          child: Padding(
            padding: const EdgeInsets.symmetric(vertical: 20, horizontal: 16),
            child: Column(
              mainAxisSize: MainAxisSize.min,
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Padding(
                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                  child: Text(
                    "Choose Month",
                    style: TextStyle(
                      fontSize: 16,
                      fontWeight: FontWeight.bold,
                      color: textColor,
                    ),
                  ),
                ),
                const SizedBox(height: 12),
                ...availableMonths.map((m) {
                  final isSelected = m.year == _currentMonth.year && m.month == _currentMonth.month;
                  return ListTile(
                    shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                    tileColor: isSelected
                        ? (isDark ? const Color(0xFF262626) : const Color(0xFFF1F5F9))
                        : Colors.transparent,
                    title: Text(
                      "${_kMonthNames[m.month - 1]} ${m.year}",
                      style: TextStyle(
                        fontSize: 15,
                        fontWeight: isSelected ? FontWeight.bold : FontWeight.w500,
                        color: isSelected ? const Color(0xFF003882) : textColor,
                      ),
                    ),
                    trailing: isSelected
                        ? const Icon(Icons.check_circle_rounded, color: Color(0xFF003882), size: 20)
                        : null,
                    onTap: () {
                      Navigator.pop(ctx);
                      setState(() {
                        _currentMonth = m;
                      });
                    },
                  );
                }),
              ],
            ),
          ),
        );
      },
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = AppTheme.isDark(context);
    final cardColor = AppTheme.getCardColor(context);
    final textColor = AppTheme.getTextColor(context);
    final subtitleColor = AppTheme.getSubtitleColor(context);
    final primaryNavy = isDark ? const Color(0xFF2563EB) : AppTheme.primaryNavy;

    const weekLabels = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    // Calculate calendar grid for _currentMonth
    final firstDayOfMonth = DateTime(_currentMonth.year, _currentMonth.month, 1);
    // Sunday is 0, Monday is 1, ..., Saturday is 6
    final leadingEmptyCount = firstDayOfMonth.weekday % 7;
    final daysInMonth = DateTime(_currentMonth.year, _currentMonth.month + 1, 0).day;
    final totalGridCells = leadingEmptyCount + daysInMonth;

    final today = DateTime.now();
    final effectiveMinDate = widget.minDate ?? DateTime(today.year, today.month, today.day);

    Widget content = Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        if (widget.showMonthHeader) ...[
          // Month Selector Header with Navigation Arrows
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              InkWell(
                borderRadius: BorderRadius.circular(10),
                onTap: () => _showMonthPickerSheet(context, isDark, textColor, cardColor),
                child: Padding(
                  padding: const EdgeInsets.symmetric(vertical: 4, horizontal: 4),
                  child: Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        "${_kMonthNames[_currentMonth.month - 1]} ${_currentMonth.year}",
                        style: TextStyle(
                          fontSize: 17,
                          fontWeight: FontWeight.w800,
                          color: textColor,
                          letterSpacing: -0.3,
                        ),
                      ),
                      const SizedBox(width: 4),
                      Icon(
                        Icons.keyboard_arrow_down_rounded,
                        size: 20,
                        color: subtitleColor,
                      ),
                    ],
                  ),
                ),
              ),

              // Navigation arrows (< and >)
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  IconButton(
                    icon: Icon(
                      Icons.chevron_left_rounded,
                      color: _canGoPrevious ? textColor : subtitleColor.withValues(alpha: 0.3),
                    ),
                    onPressed: _canGoPrevious ? _previousMonth : null,
                    splashRadius: 20,
                    padding: EdgeInsets.zero,
                    constraints: const BoxConstraints(minWidth: 32, minHeight: 32),
                  ),
                  const SizedBox(width: 4),
                  IconButton(
                    icon: Icon(
                      Icons.chevron_right_rounded,
                      color: _canGoNext ? textColor : subtitleColor.withValues(alpha: 0.3),
                    ),
                    onPressed: _canGoNext ? _nextMonth : null,
                    splashRadius: 20,
                    padding: EdgeInsets.zero,
                    constraints: const BoxConstraints(minWidth: 32, minHeight: 32),
                  ),
                ],
              ),
            ],
          ),
          const SizedBox(height: 14),
        ],

        // Weekday Headers (Sun -> Sat)
        Padding(
          padding: const EdgeInsets.only(bottom: 12),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceAround,
            children: weekLabels.map((day) {
              return Expanded(
                child: Center(
                  child: Text(
                    day,
                    style: TextStyle(
                      fontSize: 13,
                      fontWeight: FontWeight.w600,
                      color: subtitleColor,
                    ),
                  ),
                ),
              );
            }).toList(),
          ),
        ),

        // 7-Column Days Grid
        GridView.builder(
          shrinkWrap: true,
          physics: const NeverScrollableScrollPhysics(),
          gridDelegate: const SliverGridDelegateWithFixedCrossAxisCount(
            crossAxisCount: 7,
            mainAxisSpacing: 10,
            crossAxisSpacing: 10,
            childAspectRatio: 1.0,
          ),
          itemCount: totalGridCells,
          itemBuilder: (context, index) {
            if (index < leadingEmptyCount) {
              return const SizedBox.shrink();
            }

            final dayNumber = index - leadingEmptyCount + 1;
            final date = DateTime(_currentMonth.year, _currentMonth.month, dayNumber);

            final isPast = date.isBefore(effectiveMinDate);

            final isSelected = widget.multiSelectedDates != null
                ? widget.multiSelectedDates!.any(
                    (d) => d.year == date.year && d.month == date.month && d.day == date.day)
                : (widget.selectedDate != null &&
                    widget.selectedDate!.year == date.year &&
                    widget.selectedDate!.month == date.month &&
                    widget.selectedDate!.day == date.day);

            return GestureDetector(
              onTap: isPast
                  ? null
                  : () {
                      if (widget.onDateSelected != null) {
                        widget.onDateSelected!(date);
                      } else if (widget.onDateToggled != null) {
                        widget.onDateToggled!(date);
                      }
                    },
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 200),
                curve: Curves.easeInOut,
                decoration: BoxDecoration(
                  color: isSelected
                      ? primaryNavy
                      : (isDark ? const Color(0xFF262626) : const Color(0xFFF8FAFC)),
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: isSelected
                        ? primaryNavy
                        : (isDark
                            ? (isPast ? Colors.transparent : Colors.white12)
                            : (isPast ? const Color(0xFFE2E8F0).withValues(alpha: 0.4) : const Color(0xFFDCE5F2))),
                    width: 1.2,
                  ),
                ),
                alignment: Alignment.center,
                child: Text(
                  "$dayNumber",
                  style: TextStyle(
                    fontSize: 14,
                    fontWeight: isSelected ? FontWeight.w800 : FontWeight.w600,
                    color: isSelected
                        ? Colors.white
                        : (isPast
                            ? subtitleColor.withValues(alpha: 0.35)
                            : (isDark ? Colors.white : const Color(0xFF003882))),
                  ),
                ),
              ),
            );
          },
        ),
      ],
    );

    if (widget.wrapInCard) {
      return Container(
        padding: widget.padding,
        decoration: BoxDecoration(
          color: cardColor,
          borderRadius: BorderRadius.circular(24),
          border: Border.all(color: isDark ? Colors.white12 : const Color(0xFFE2E8F0), width: 1.2),
        ),
        child: content,
      );
    }

    return content;
  }
}
