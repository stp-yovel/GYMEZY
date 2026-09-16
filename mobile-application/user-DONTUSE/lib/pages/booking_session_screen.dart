import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../models/gym.dart';
import '../theme/app_theme.dart';
import '../widgets/custom_calendar.dart';
import 'payment_summary_screen.dart';

class BookingSessionScreen extends StatefulWidget {
  final Gym gym;
  final String? initialCategory; // e.g. 'Gym', 'Yoga', 'Zumba'

  const BookingSessionScreen({
    super.key,
    required this.gym,
    this.initialCategory,
  });

  @override
  State<BookingSessionScreen> createState() => _BookingSessionScreenState();
}

class _BookingSessionScreenState extends State<BookingSessionScreen> {
  // Navigation views: 'categories', 'gym_booking', 'weekly_plan', 'custom_dates', 'class_booking', 'other_classes'
  late String _currentView;
  String? _selectedCategory;

  // Gym Booking State
  String _gymBookingType = 'Per Session'; // 'Per Session', 'Weekly Plan', 'Custom Dates'
  DateTime _selectedStartDate = DateTime.now();
  final Set<DateTime> _customSelectedDates = {
    DateTime.now(),
    DateTime.now().add(const Duration(days: 2)),
    DateTime.now().add(const Duration(days: 4)),
  };

  // Class Booking State (Yoga, Zumba, HIIT, etc.)
  String _selectedClassName = 'Yoga Classes';
  String _selectedClassType = 'Hatha Yoga';
  double _selectedClassPrice = 249.0;
  DateTime _selectedClassDate = DateTime.now();
  String _selectedTimeSlot = '7:00 AM';

  final List<String> _morningSlots = ['6:00 AM', '7:00 AM', '8:00 AM'];
  final List<String> _eveningSlots = ['6:00 PM', '7:00 PM', '8:00 PM'];

  @override
  void initState() {
    super.initState();
    if (widget.initialCategory != null) {
      _selectCategory(widget.initialCategory!);
    } else {
      _currentView = 'categories';
    }
  }

  void _selectCategory(String cat) {
    setState(() {
      _selectedCategory = cat;
      if (cat == 'Gym') {
        _currentView = 'gym_booking';
      } else if (cat == 'Yoga') {
        _selectedClassName = 'Yoga Classes';
        _selectedClassType = 'Hatha Yoga';
        _selectedClassPrice = 249.0;
        _currentView = 'class_booking';
      } else if (cat == 'Zumba') {
        _selectedClassName = 'Zumba Classes';
        _selectedClassType = 'Zumba Fitness';
        _selectedClassPrice = 249.0;
        _currentView = 'class_booking';
      } else if (cat == 'Other Classes') {
        _currentView = 'other_classes';
      }
    });
  }

  void _selectOtherClass(String name, double price, String defaultType) {
    setState(() {
      _selectedClassName = name;
      _selectedClassType = defaultType;
      _selectedClassPrice = price;
      _currentView = 'class_booking';
    });
  }

  void _goToCheckout() {
    String title = '';
    String datesSummary = '';
    String? timeSlot;
    int sessions = 1;
    double subtotal = 0;

    if (_currentView == 'gym_booking' && _gymBookingType == 'Per Session') {
      title = 'Gym Access (Single Session)';
      datesSummary = 'Valid for today / next 24 hrs';
      sessions = 1;
      subtotal = widget.gym.pricePerSession;
    } else if (_currentView == 'weekly_plan' || (_currentView == 'gym_booking' && _gymBookingType == 'Weekly Plan')) {
      title = 'Weekly Unlimited Gym Pass';
      final end = _selectedStartDate.add(const Duration(days: 6));
      datesSummary = "${_formatDate(_selectedStartDate)} to ${_formatDate(end)} (7 Days)";
      sessions = 7;
      subtotal = 999.0;
    } else if (_currentView == 'custom_dates' || (_currentView == 'gym_booking' && _gymBookingType == 'Custom Dates')) {
      title = 'Gym Access (Custom Dates)';
      sessions = _customSelectedDates.length;
      final sortedDates = _customSelectedDates.toList()..sort();
      datesSummary = sortedDates.map((d) => "${d.day} ${_monthName(d.month)}").join(', ');
      subtotal = widget.gym.pricePerSession * sessions;
    } else if (_currentView == 'class_booking') {
      title = "$_selectedClassName ($_selectedClassType)";
      datesSummary = _formatDate(_selectedClassDate);
      timeSlot = _selectedTimeSlot;
      sessions = 1;
      subtotal = _selectedClassPrice;
    }

    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => PaymentSummaryScreen(
          gym: widget.gym,
          bookingTitle: title,
          datesSummary: datesSummary,
          timeSlot: timeSlot,
          sessionsCount: sessions,
          subtotal: subtotal,
          discount: 0.0,
        ),
      ),
    );
  }

  String _formatDate(DateTime dt) {
    const days = ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'];
    return "${days[dt.weekday - 1]}, ${dt.day} ${_monthName(dt.month)} ${dt.year}";
  }

  String _monthName(int m) {
    const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
    return months[m - 1];
  }

  @override
  Widget build(BuildContext context) {
    final isDark = AppTheme.isDark(context);
    final backgroundColor = AppTheme.getBackgroundColor(context);
    final cardColor = AppTheme.getCardColor(context);
    final textColor = AppTheme.getTextColor(context);
    final subtitleColor = AppTheme.getSubtitleColor(context);
    final borderColor = AppTheme.getBorderColor(context);

    return Scaffold(
      backgroundColor: backgroundColor,
      appBar: AppBar(
        backgroundColor: backgroundColor,
        elevation: 0,
        leading: IconButton(
          icon: Icon(Icons.arrow_back_rounded, color: textColor),
          onPressed: () {
            if (_currentView == 'weekly_plan' || _currentView == 'custom_dates') {
              setState(() => _currentView = 'gym_booking');
            } else if (_currentView != 'categories') {
              setState(() => _currentView = 'categories');
            } else {
              Navigator.pop(context);
            }
          },
        ),
        title: Text(
          _getAppBarTitle(),
          style: TextStyle(
            color: textColor,
            fontSize: 18,
            fontWeight: FontWeight.bold,
          ),
        ),
        centerTitle: false,
      ),
      body: _buildCurrentView(context, cardColor, textColor, subtitleColor, borderColor, isDark),
    );
  }

  String _getAppBarTitle() {
    switch (_currentView) {
      case 'gym_booking':
        return 'Book Gym Session';
      case 'weekly_plan':
        return 'Weekly Plan';
      case 'custom_dates':
        return 'Custom Dates';
      case 'class_booking':
        return 'Book $_selectedClassName';
      case 'other_classes':
        return 'Other Classes';
      default:
        return 'Book Session';
    }
  }

  Widget _buildCurrentView(
      BuildContext context, Color cardColor, Color textColor, Color subtitleColor, Color borderColor, bool isDark) {
    switch (_currentView) {
      case 'categories':
        return _buildCategoriesView(context, cardColor, textColor, subtitleColor, borderColor, isDark);
      case 'gym_booking':
        return _buildGymBookingView(context, cardColor, textColor, subtitleColor, borderColor, isDark);
      case 'weekly_plan':
        return _buildWeeklyPlanView(context, cardColor, textColor, subtitleColor, borderColor, isDark);
      case 'custom_dates':
        return _buildCustomDatesView(context, cardColor, textColor, subtitleColor, borderColor, isDark);
      case 'class_booking':
        return _buildClassBookingView(context, cardColor, textColor, subtitleColor, borderColor, isDark);
      case 'other_classes':
        return _buildOtherClassesView(context, cardColor, textColor, subtitleColor, borderColor, isDark);
      default:
        return _buildCategoriesView(context, cardColor, textColor, subtitleColor, borderColor, isDark);
    }
  }

  // ==========================================
  // PANEL 1: CATEGORY SELECTION
  // ==========================================
  Widget _buildCategoriesView(
      BuildContext context, Color cardColor, Color textColor, Color subtitleColor, Color borderColor, bool isDark) {
    final categories = [
      {
        'name': 'Gym',
        'title': 'Gym Access',
        'desc': 'Book gym access by session, weekly or custom dates',
        'icon': Icons.fitness_center_rounded,
        'accent': isDark ? const Color(0xFF60A5FA) : AppTheme.primaryColor,
      },
      {
        'name': 'Yoga',
        'title': 'Yoga Classes',
        'desc': 'Book yoga classes with certified expert trainers',
        'icon': Icons.self_improvement_rounded,
        'accent': isDark ? const Color(0xFFA78BFA) : const Color(0xFF7C3AED),
      },
      {
        'name': 'Zumba',
        'title': 'Zumba Sessions',
        'desc': 'Book fun, high-energy dance workout sessions',
        'icon': Icons.music_note_rounded,
        'accent': isDark ? const Color(0xFFF472B6) : const Color(0xFFDB2777),
      },
      {
        'name': 'Other Classes',
        'title': 'Other Fitness Classes',
        'desc': 'Explore HIIT, CrossFit, Pilates, Kickboxing & more',
        'icon': Icons.grid_view_rounded,
        'accent': isDark ? const Color(0xFF34D399) : AppTheme.secondaryColor,
      },
    ];

    return SingleChildScrollView(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            "Choose What You Want to Book",
            style: TextStyle(
              fontSize: 20,
              fontWeight: FontWeight.bold,
              color: textColor,
              letterSpacing: -0.3,
            ),
          ),
          const SizedBox(height: 16),
          ...categories.map((cat) {
            return Container(
              margin: const EdgeInsets.only(bottom: 14),
              decoration: BoxDecoration(
                color: cardColor,
                borderRadius: BorderRadius.circular(20),
                border: Border.all(color: borderColor),
              ),
              child: Material(
                color: Colors.transparent,
                child: InkWell(
                  borderRadius: BorderRadius.circular(20),
                  onTap: () => _selectCategory(cat['name'] as String),
                  child: Padding(
                    padding: const EdgeInsets.all(16.0),
                    child: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(12),
                          decoration: BoxDecoration(
                            color: (cat['accent'] as Color).withOpacity(isDark ? 0.20 : 0.12),
                            borderRadius: BorderRadius.circular(16),
                          ),
                          child: Icon(
                            cat['icon'] as IconData,
                            color: cat['accent'] as Color,
                            size: 26,
                          ),
                        ),
                        const SizedBox(width: 14),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                cat['title'] as String,
                                style: TextStyle(
                                  fontSize: 16,
                                  fontWeight: FontWeight.bold,
                                  color: textColor,
                                ),
                              ),
                              const SizedBox(height: 4),
                              Text(
                                cat['desc'] as String,
                                style: TextStyle(
                                  fontSize: 12,
                                  color: subtitleColor,
                                  height: 1.3,
                                ),
                              ),
                            ],
                          ),
                        ),
                        Icon(
                          Icons.arrow_forward_ios_rounded,
                          size: 16,
                          color: subtitleColor.withOpacity(0.5),
                        ),
                      ],
                    ),
                  ),
                ),
              ),
            ).animate().fadeIn(duration: 350.ms).slideY(begin: 0.05);
          }),
          const SizedBox(height: 24),
          Center(
            child: Row(
              mainAxisSize: MainAxisSize.min,
              children: [
                Icon(Icons.info_outline_rounded, size: 14, color: subtitleColor),
                const SizedBox(width: 6),
                Text(
                  "All sessions are subject to gym slot availability",
                  style: TextStyle(fontSize: 11, color: subtitleColor),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // ==========================================
  // PANEL 2: BOOK GYM SESSION
  // ==========================================
  Widget _buildGymBookingView(
      BuildContext context, Color cardColor, Color textColor, Color subtitleColor, Color borderColor, bool isDark) {
    return Column(
      children: [
        Expanded(
          child: SingleChildScrollView(
            physics: const BouncingScrollPhysics(),
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Gym Access Hero Banner
                Container(
                  height: 110,
                  width: double.infinity,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(20),
                    image: DecorationImage(
                      image: NetworkImage(widget.gym.imageUrl),
                      fit: BoxFit.cover,
                    ),
                  ),
                  child: Container(
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(20),
                      gradient: LinearGradient(
                        colors: [Colors.black.withOpacity(0.75), Colors.black.withOpacity(0.3)],
                        begin: Alignment.centerLeft,
                        end: Alignment.centerRight,
                      ),
                    ),
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        const Text(
                          "Gym Access",
                          style: TextStyle(
                            color: Colors.white,
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          "Train at your convenience • ${widget.gym.name}",
                          style: const TextStyle(
                            color: Colors.white70,
                            fontSize: 12,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),

                const SizedBox(height: 20),

                Text(
                  "Choose Booking Type",
                  style: TextStyle(
                    fontSize: 17,
                    fontWeight: FontWeight.bold,
                    color: textColor,
                  ),
                ),
                const SizedBox(height: 12),

                // Option 1: Per Session
                _buildBookingTypeTile(
                  title: "Per Session",
                  subtitle: "Book for a single visit",
                  price: "₹${widget.gym.pricePerSession.toInt()} / Session",
                  icon: Icons.calendar_today_outlined,
                  isSelected: _gymBookingType == 'Per Session',
                  onTap: () => setState(() => _gymBookingType = 'Per Session'),
                  cardColor: cardColor,
                  textColor: textColor,
                  subtitleColor: subtitleColor,
                  borderColor: borderColor,
                  isDark: isDark,
                ),

                // Option 2: Weekly Plan
                _buildBookingTypeTile(
                  title: "Weekly Plan",
                  subtitle: "Unlimited access for 7 days",
                  price: "₹999 / Week",
                  icon: Icons.date_range_outlined,
                  isSelected: _gymBookingType == 'Weekly Plan',
                  onTap: () {
                    setState(() {
                      _gymBookingType = 'Weekly Plan';
                      _currentView = 'weekly_plan';
                    });
                  },
                  cardColor: cardColor,
                  textColor: textColor,
                  subtitleColor: subtitleColor,
                  borderColor: borderColor,
                  isDark: isDark,
                ),

                // Option 3: Custom Dates
                _buildBookingTypeTile(
                  title: "Custom Dates",
                  subtitle: "Select multiple dates that suit you",
                  price: "Custom Pricing",
                  icon: Icons.event_note_outlined,
                  isSelected: _gymBookingType == 'Custom Dates',
                  onTap: () {
                    setState(() {
                      _gymBookingType = 'Custom Dates';
                      _currentView = 'custom_dates';
                    });
                  },
                  cardColor: cardColor,
                  textColor: textColor,
                  subtitleColor: subtitleColor,
                  borderColor: borderColor,
                  isDark: isDark,
                ),
              ],
            ),
          ),
        ),

        // Bottom CTA
        _buildBottomBar(
          priceText: _gymBookingType == 'Per Session'
              ? "₹${widget.gym.pricePerSession.toInt()}"
              : (_gymBookingType == 'Weekly Plan' ? "₹999" : "Custom"),
          btnText: _gymBookingType == 'Per Session' ? "Continue to Payment" : "Configure Plan",
          onPressed: () {
            if (_gymBookingType == 'Per Session') {
              _goToCheckout();
            } else if (_gymBookingType == 'Weekly Plan') {
              setState(() => _currentView = 'weekly_plan');
            } else {
              setState(() => _currentView = 'custom_dates');
            }
          },
          cardColor: cardColor,
          borderColor: borderColor,
        ),
      ],
    );
  }

  Widget _buildBookingTypeTile({
    required String title,
    required String subtitle,
    required String price,
    required IconData icon,
    required bool isSelected,
    required VoidCallback onTap,
    required Color cardColor,
    required Color textColor,
    required Color subtitleColor,
    required Color borderColor,
    required bool isDark,
  }) {
    return Container(
      margin: const EdgeInsets.only(bottom: 12),
      decoration: BoxDecoration(
        color: isSelected
            ? (isDark ? const Color(0xFF262626) : const Color(0xFFF1F5F9))
            : cardColor,
        borderRadius: BorderRadius.circular(18),
        border: Border.all(
          color: isSelected ? (isDark ? const Color(0xFF60A5FA) : AppTheme.primaryColor) : borderColor,
          width: isSelected ? 1.5 : 1,
        ),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(18),
          onTap: onTap,
          child: Padding(
            padding: const EdgeInsets.all(14.0),
            child: Row(
              children: [
                Container(
                  padding: const EdgeInsets.all(10),
                  decoration: BoxDecoration(
                    color: isDark ? const Color(0xFF3B82F6).withOpacity(0.2) : AppTheme.primaryColor.withOpacity(0.1),
                    borderRadius: BorderRadius.circular(12),
                  ),
                  child: Icon(icon, color: isDark ? const Color(0xFF93C5FD) : AppTheme.primaryColor, size: 22),
                ),
                const SizedBox(width: 12),
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        title,
                        style: TextStyle(
                          fontSize: 15,
                          fontWeight: FontWeight.bold,
                          color: textColor,
                        ),
                      ),
                      const SizedBox(height: 2),
                      Text(
                        subtitle,
                        style: TextStyle(
                          fontSize: 12,
                          color: subtitleColor,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        price,
                        style: const TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.secondaryColor,
                        ),
                      ),
                    ],
                  ),
                ),
                Icon(
                  isSelected ? Icons.radio_button_checked : Icons.radio_button_off,
                  color: isSelected ? (isDark ? const Color(0xFF60A5FA) : AppTheme.primaryColor) : subtitleColor,
                  size: 20,
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  // ==========================================
  // PANEL 3: WEEKLY PLAN
  // ==========================================
  Widget _buildWeeklyPlanView(
      BuildContext context, Color cardColor, Color textColor, Color subtitleColor, Color borderColor, bool isDark) {
    final inclusions = [
      "Unlimited access for 7 consecutive days",
      "All gym equipment & workout areas",
      "Locker & shower facility access",
      "Trainer floor support during gym hours",
    ];

    final end = _selectedStartDate.add(const Duration(days: 6));

    return Column(
      children: [
        Expanded(
          child: SingleChildScrollView(
            physics: const BouncingScrollPhysics(),
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Plan Banner
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: cardColor,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: borderColor),
                  ),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: AppTheme.secondaryColor.withOpacity(0.12),
                          borderRadius: BorderRadius.circular(14),
                        ),
                        child: const Icon(Icons.date_range_rounded, color: AppTheme.secondaryColor, size: 24),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              "Weekly Unlimited Pass",
                              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: textColor),
                            ),
                            const SizedBox(height: 2),
                            Text("7 days full gym access", style: TextStyle(fontSize: 12, color: subtitleColor)),
                          ],
                        ),
                      ),
                      const Text(
                        "₹999",
                        style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: AppTheme.secondaryColor),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 20),

                Text(
                  "Plan Includes",
                  style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: textColor),
                ),
                const SizedBox(height: 10),
                ...inclusions.map(
                  (inc) => Padding(
                    padding: const EdgeInsets.only(bottom: 8.0),
                    child: Row(
                      children: [
                        const Icon(Icons.check_circle_rounded, color: AppTheme.secondaryColor, size: 16),
                        const SizedBox(width: 8),
                        Expanded(
                          child: Text(inc, style: TextStyle(fontSize: 13, color: textColor)),
                        ),
                      ],
                    ),
                  ),
                ),

                const SizedBox(height: 20),

                // Horizontal Start Date Selector
                HorizontalDayStripCalendar(
                  selectedDate: _selectedStartDate,
                  daysCount: 14,
                  wrapInCard: true,
                  showMonthHeader: true,
                  onDateSelected: (date) => setState(() => _selectedStartDate = date),
                ),

                const SizedBox(height: 16),

                Container(
                  padding: const EdgeInsets.all(12),
                  decoration: BoxDecoration(
                    color: AppTheme.secondaryColor.withOpacity(0.08),
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.info_outline_rounded, size: 16, color: AppTheme.secondaryColor),
                      const SizedBox(width: 8),
                      Expanded(
                        child: Text(
                          "Valid from ${_formatDate(_selectedStartDate)} to ${_formatDate(end)}",
                          style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppTheme.secondaryColor),
                        ),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),

        // Bottom CTA
        _buildBottomBar(
          priceText: "₹999",
          btnText: "Continue to Payment",
          onPressed: _goToCheckout,
          cardColor: cardColor,
          borderColor: borderColor,
        ),
      ],
    );
  }

  // ==========================================
  // PANEL 4: CUSTOM DATES CALENDAR
  // ==========================================
  Widget _buildCustomDatesView(
      BuildContext context, Color cardColor, Color textColor, Color subtitleColor, Color borderColor, bool isDark) {
    final totalPrice = widget.gym.pricePerSession * _customSelectedDates.length;

    return Column(
      children: [
        Expanded(
          child: SingleChildScrollView(
            physics: const BouncingScrollPhysics(),
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Top Header Card
                Container(
                  padding: const EdgeInsets.all(16),
                  decoration: BoxDecoration(
                    color: cardColor,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: borderColor),
                  ),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: AppTheme.primaryColor.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(14),
                        ),
                        child: Icon(Icons.event_available_rounded, color: isDark ? const Color(0xFF93C5FD) : AppTheme.primaryColor, size: 24),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              "Custom Dates Booking",
                              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: textColor),
                            ),
                            const SizedBox(height: 2),
                            Text("Pick any dates that fit your routine", style: TextStyle(fontSize: 12, color: subtitleColor)),
                          ],
                        ),
                      ),
                    ],
                  ),
                ),

                const SizedBox(height: 18),

                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Text(
                      "Select Dates (${_customSelectedDates.length})",
                      style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: textColor),
                    ),
                    if (_customSelectedDates.isNotEmpty)
                      GestureDetector(
                        onTap: () => setState(() => _customSelectedDates.clear()),
                        child: const Text(
                          "Clear All",
                          style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: Colors.redAccent),
                        ),
                      ),
                  ],
                ),
                const SizedBox(height: 12),

                // Calendar Month Grid View (allows current month + 3 months)
                MonthlyGridCalendar(
                  multiSelectedDates: _customSelectedDates,
                  maxMonthsAhead: 3,
                  onDateToggled: (date) {
                    setState(() {
                      final isSelected = _customSelectedDates.any(
                        (d) => d.day == date.day && d.month == date.month && d.year == date.year,
                      );
                      if (isSelected) {
                        _customSelectedDates.removeWhere(
                          (d) => d.day == date.day && d.month == date.month && d.year == date.year,
                        );
                      } else {
                        _customSelectedDates.add(date);
                      }
                    });
                  },
                ),

                const SizedBox(height: 16),

                // Selected count pill
                Container(
                  padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                  decoration: BoxDecoration(
                    color: AppTheme.secondaryColor.withOpacity(0.08),
                    borderRadius: BorderRadius.circular(14),
                  ),
                  child: Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        "${_customSelectedDates.length} Dates Selected",
                        style: const TextStyle(fontSize: 13, fontWeight: FontWeight.bold, color: AppTheme.secondaryColor),
                      ),
                      Text(
                        "₹${widget.gym.pricePerSession.toInt()} × ${_customSelectedDates.length} Sessions",
                        style: TextStyle(fontSize: 12, color: textColor),
                      ),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ),

        // Bottom CTA
        _buildBottomBar(
          priceText: "₹${totalPrice.toInt()}",
          btnText: "Continue to Payment",
          onPressed: _customSelectedDates.isEmpty ? () {} : _goToCheckout,
          cardColor: cardColor,
          borderColor: borderColor,
        ),
      ],
    );
  }

  // ==========================================
  // PANEL 5 & 6: CLASS BOOKING (Yoga / Zumba)
  // ==========================================
  Widget _buildClassBookingView(
      BuildContext context, Color cardColor, Color textColor, Color subtitleColor, Color borderColor, bool isDark) {
    final isYoga = _selectedClassName.contains('Yoga');
    final isZumba = _selectedClassName.contains('Zumba');

    final classTypes = isYoga
        ? [
            {'type': 'Hatha Yoga', 'price': 249.0},
            {'type': 'Power Yoga', 'price': 249.0},
            {'type': 'Yoga for Beginners', 'price': 249.0},
          ]
        : (isZumba
            ? [
                {'type': 'Zumba Fitness', 'price': 249.0},
                {'type': 'Zumba Toning', 'price': 249.0},
              ]
            : [
                {'type': 'Standard Session', 'price': _selectedClassPrice},
                {'type': 'Advanced Masterclass', 'price': _selectedClassPrice + 50},
              ]);

    final bannerImg = isYoga
        ? "https://images.unsplash.com/photo-1544367567-0f2fcb009e0b?q=80&w=800&auto=format&fit=crop"
        : (isZumba
            ? "https://images.unsplash.com/photo-1518611012118-696072aa579a?q=80&w=800&auto=format&fit=crop"
            : "https://images.unsplash.com/photo-1534438327276-14e5300c3a48?q=80&w=800&auto=format&fit=crop");

    final tagline = isYoga
        ? "Mind. Body. Balance."
        : (isZumba ? "Dance. Sweat. Repeat." : "Train Hard. Stay Consistent.");

    return Column(
      children: [
        Expanded(
          child: SingleChildScrollView(
            physics: const BouncingScrollPhysics(),
            padding: const EdgeInsets.all(16.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Class Hero Banner
                Container(
                  height: 110,
                  width: double.infinity,
                  decoration: BoxDecoration(
                    borderRadius: BorderRadius.circular(20),
                    image: DecorationImage(
                      image: NetworkImage(bannerImg),
                      fit: BoxFit.cover,
                    ),
                  ),
                  child: Container(
                    decoration: BoxDecoration(
                      borderRadius: BorderRadius.circular(20),
                      gradient: LinearGradient(
                        colors: [Colors.black.withOpacity(0.8), Colors.black.withOpacity(0.3)],
                        begin: Alignment.centerLeft,
                        end: Alignment.centerRight,
                      ),
                    ),
                    padding: const EdgeInsets.all(16),
                    child: Column(
                      crossAxisAlignment: CrossAxisAlignment.start,
                      mainAxisAlignment: MainAxisAlignment.center,
                      children: [
                        Text(
                          _selectedClassName,
                          style: const TextStyle(
                            color: Colors.white,
                            fontSize: 18,
                            fontWeight: FontWeight.bold,
                          ),
                        ),
                        const SizedBox(height: 4),
                        Text(
                          tagline,
                          style: const TextStyle(
                            color: Colors.white70,
                            fontSize: 12,
                          ),
                        ),
                      ],
                    ),
                  ),
                ),

                const SizedBox(height: 20),

                // Select Class Type
                Text(
                  "Select Class Type",
                  style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: textColor),
                ),
                const SizedBox(height: 10),

                ...classTypes.map((ct) {
                  final isSelected = _selectedClassType == ct['type'];
                  return GestureDetector(
                    onTap: () {
                      setState(() {
                        _selectedClassType = ct['type'] as String;
                        _selectedClassPrice = ct['price'] as double;
                      });
                    },
                    child: Container(
                      margin: const EdgeInsets.only(bottom: 10),
                      padding: const EdgeInsets.all(14),
                      decoration: BoxDecoration(
                        color: isSelected
                            ? (isDark ? const Color(0xFF262626) : const Color(0xFFF1F5F9))
                            : cardColor,
                        borderRadius: BorderRadius.circular(16),
                        border: Border.all(
                          color: isSelected ? AppTheme.primaryColor : borderColor,
                          width: isSelected ? 1.5 : 1,
                        ),
                      ),
                      child: Row(
                        mainAxisAlignment: MainAxisAlignment.spaceBetween,
                        children: [
                          Text(
                            ct['type'] as String,
                            style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: textColor),
                          ),
                          Row(
                            children: [
                              Text(
                                "₹${(ct['price'] as double).toInt()} / Session",
                                style: const TextStyle(fontSize: 12, fontWeight: FontWeight.bold, color: AppTheme.secondaryColor),
                              ),
                              const SizedBox(width: 8),
                              Icon(
                                isSelected ? Icons.radio_button_checked : Icons.radio_button_off,
                                color: isSelected ? AppTheme.primaryColor : subtitleColor,
                                size: 18,
                              ),
                            ],
                          ),
                        ],
                      ),
                    ),
                  );
                }),

                const SizedBox(height: 18),

                // Select Date Strip
                HorizontalDayStripCalendar(
                  selectedDate: _selectedClassDate,
                  daysCount: 14,
                  wrapInCard: true,
                  showMonthHeader: true,
                  onDateSelected: (date) => setState(() => _selectedClassDate = date),
                ),

                const SizedBox(height: 20),

                // Select Time Slot
                Text(
                  "Select Time Slot",
                  style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: textColor),
                ),
                const SizedBox(height: 10),

                // Morning Slots
                Text("Morning", style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: subtitleColor)),
                const SizedBox(height: 6),
                Row(
                  children: _morningSlots.map((slot) {
                    final isSelected = _selectedTimeSlot == slot;
                    return Expanded(
                      child: GestureDetector(
                        onTap: () => setState(() => _selectedTimeSlot = slot),
                        child: Container(
                          margin: const EdgeInsets.symmetric(horizontal: 4),
                          padding: const EdgeInsets.symmetric(vertical: 10),
                          decoration: BoxDecoration(
                            color: isSelected
                                ? AppTheme.primaryColor
                                : (isDark ? const Color(0xFF262626) : const Color(0xFFF1F5F9)),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(
                              color: isSelected ? Colors.transparent : borderColor,
                            ),
                          ),
                          alignment: Alignment.center,
                          child: Text(
                            slot,
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                              color: isSelected ? Colors.white : textColor,
                            ),
                          ),
                        ),
                      ),
                    );
                  }).toList(),
                ),

                const SizedBox(height: 12),

                // Evening Slots
                Text("Evening", style: TextStyle(fontSize: 12, fontWeight: FontWeight.w600, color: subtitleColor)),
                const SizedBox(height: 6),
                Row(
                  children: _eveningSlots.map((slot) {
                    final isSelected = _selectedTimeSlot == slot;
                    return Expanded(
                      child: GestureDetector(
                        onTap: () => setState(() => _selectedTimeSlot = slot),
                        child: Container(
                          margin: const EdgeInsets.symmetric(horizontal: 4),
                          padding: const EdgeInsets.symmetric(vertical: 10),
                          decoration: BoxDecoration(
                            color: isSelected
                                ? AppTheme.primaryColor
                                : (isDark ? const Color(0xFF262626) : const Color(0xFFF1F5F9)),
                            borderRadius: BorderRadius.circular(12),
                            border: Border.all(
                              color: isSelected ? Colors.transparent : borderColor,
                            ),
                          ),
                          alignment: Alignment.center,
                          child: Text(
                            slot,
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                              color: isSelected ? Colors.white : textColor,
                            ),
                          ),
                        ),
                      ),
                    );
                  }).toList(),
                ),
              ],
            ),
          ),
        ),

        // Bottom CTA
        _buildBottomBar(
          priceText: "₹${_selectedClassPrice.toInt()}",
          btnText: "Continue to Payment",
          onPressed: _goToCheckout,
          cardColor: cardColor,
          borderColor: borderColor,
        ),
      ],
    );
  }

  // ==========================================
  // PANEL 7: OTHER CLASSES DIRECTORY
  // ==========================================
  Widget _buildOtherClassesView(
      BuildContext context, Color cardColor, Color textColor, Color subtitleColor, Color borderColor, bool isDark) {
    final otherClasses = [
      {
        'name': 'HIIT',
        'title': 'HIIT (High Intensity)',
        'desc': 'Intense interval cardio & calorie burn',
        'price': 249.0,
        'defaultType': 'Standard HIIT',
        'icon': Icons.bolt_rounded,
      },
      {
        'name': 'CrossFit',
        'title': 'CrossFit Training',
        'desc': 'Functional strength & conditioning',
        'price': 299.0,
        'defaultType': 'WOD Session',
        'icon': Icons.fitness_center_rounded,
      },
      {
        'name': 'Pilates',
        'title': 'Pilates Core',
        'desc': 'Core strength, posture & flexibility',
        'price': 249.0,
        'defaultType': 'Mat Pilates',
        'icon': Icons.self_improvement_rounded,
      },
      {
        'name': 'Dance Fitness',
        'title': 'Dance Fitness',
        'desc': 'Fun energetic dance workout',
        'price': 249.0,
        'defaultType': 'BollyHop Workout',
        'icon': Icons.music_note_rounded,
      },
      {
        'name': 'Kickboxing',
        'title': 'Kickboxing Cardio',
        'desc': 'Strength, agility & martial arts cardio',
        'price': 299.0,
        'defaultType': 'Bag & Pad Work',
        'icon': Icons.sports_mma_rounded,
      },
    ];

    return SingleChildScrollView(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.all(16.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            "Explore Special Classes",
            style: TextStyle(fontSize: 18, fontWeight: FontWeight.bold, color: textColor),
          ),
          const SizedBox(height: 6),
          Text(
            "Find the perfect specialized workout class for you",
            style: TextStyle(fontSize: 12, color: subtitleColor),
          ),
          const SizedBox(height: 16),

          ...otherClasses.map((c) {
            return Container(
              margin: const EdgeInsets.only(bottom: 12),
              decoration: BoxDecoration(
                color: cardColor,
                borderRadius: BorderRadius.circular(18),
                border: Border.all(color: borderColor),
              ),
              child: Material(
                color: Colors.transparent,
                child: InkWell(
                  borderRadius: BorderRadius.circular(18),
                  onTap: () => _selectOtherClass(c['name'] as String, c['price'] as double, c['defaultType'] as String),
                  child: Padding(
                    padding: const EdgeInsets.all(14.0),
                    child: Row(
                      children: [
                        Container(
                          padding: const EdgeInsets.all(10),
                          decoration: BoxDecoration(
                            color: AppTheme.primaryColor.withOpacity(0.08),
                            borderRadius: BorderRadius.circular(12),
                          ),
                          child: Icon(c['icon'] as IconData, color: isDark ? const Color(0xFF93C5FD) : AppTheme.primaryColor, size: 22),
                        ),
                        const SizedBox(width: 12),
                        Expanded(
                          child: Column(
                            crossAxisAlignment: CrossAxisAlignment.start,
                            children: [
                              Text(
                                c['title'] as String,
                                style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: textColor),
                              ),
                              const SizedBox(height: 2),
                              Text(
                                c['desc'] as String,
                                style: TextStyle(fontSize: 11, color: subtitleColor),
                              ),
                            ],
                          ),
                        ),
                        Text(
                          "₹${(c['price'] as double).toInt()}",
                          style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: AppTheme.secondaryColor),
                        ),
                        const SizedBox(width: 6),
                        Icon(Icons.chevron_right_rounded, size: 18, color: subtitleColor),
                      ],
                    ),
                  ),
                ),
              ),
            );
          }),
        ],
      ),
    );
  }

  // Common Bottom Action Sticky Bar
  Widget _buildBottomBar({
    required String priceText,
    required String btnText,
    required VoidCallback onPressed,
    required Color cardColor,
    required Color borderColor,
  }) {
    return Container(
      padding: const EdgeInsets.fromLTRB(16, 12, 16, 24),
      decoration: BoxDecoration(
        color: cardColor,
        border: Border(
          top: BorderSide(color: borderColor, width: 1),
        ),
      ),
      child: Row(
        children: [
          Column(
            mainAxisSize: MainAxisSize.min,
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                "Price",
                style: TextStyle(fontSize: 11, color: AppTheme.getSubtitleColor(context)),
              ),
              Text(
                priceText,
                style: TextStyle(
                  fontSize: 20,
                  fontWeight: FontWeight.bold,
                  color: AppTheme.getTextColor(context),
                ),
              ),
            ],
          ),
          const SizedBox(width: 16),
          Expanded(
            child: SizedBox(
              height: 48,
              child: ElevatedButton(
                onPressed: onPressed,
                style: ElevatedButton.styleFrom(
                  backgroundColor: AppTheme.primaryColor,
                  foregroundColor: Colors.white,
                  elevation: 0,
                  shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
                ),
                child: Text(
                  btnText,
                  style: const TextStyle(fontSize: 14, fontWeight: FontWeight.bold, color: Colors.white),
                ),
              ),
            ),
          ),
        ],
      ),
    );
  }
}
