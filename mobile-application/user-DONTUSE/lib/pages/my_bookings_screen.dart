import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../models/booking_item.dart';
import '../models/membership_item.dart';
import '../models/gym.dart';
import '../data/mock_data.dart';
import '../data/booking_repository.dart';
import '../theme/app_theme.dart';
import '../widgets/scaffoldmessage.dart';
import 'booking_details_screen.dart';
import 'booking_session_screen.dart';
import 'buy_membership_screen.dart';
import 'membership_details_screen.dart';

class MyBookingsScreen extends StatefulWidget {
  final bool initialShowHub;

  const MyBookingsScreen({
    super.key,
    this.initialShowHub = false,
  });

  @override
  State<MyBookingsScreen> createState() => _MyBookingsScreenState();
}

class _MyBookingsScreenState extends State<MyBookingsScreen> {
  late bool _showHub;
  String _selectedTab = 'Upcoming'; // 'Upcoming', 'Completed', 'Cancelled'

  @override
  void initState() {
    super.initState();
    _showHub = widget.initialShowHub;
    BookingRepository.instance.addListener(_onRepositoryChanged);
  }

  @override
  void dispose() {
    BookingRepository.instance.removeListener(_onRepositoryChanged);
    super.dispose();
  }

  void _onRepositoryChanged() {
    if (mounted) setState(() {});
  }

  List<BookingItem> get _bookings => BookingRepository.instance.bookings;
  List<MembershipItem> get _memberships => BookingRepository.instance.memberships;

  void _onBookingUpdated(BookingItem updated) {
    BookingRepository.instance.updateBooking(updated);
  }

  void _openBookingDetails(BookingItem booking) async {
    final updated = await Navigator.push<BookingItem>(
      context,
      MaterialPageRoute(
        builder: (context) => BookingDetailsScreen(
          booking: booking,
          onBookingUpdated: _onBookingUpdated,
        ),
      ),
    );

    if (updated != null) {
      _onBookingUpdated(updated);
    }
  }

  void _showCompareSheet() {
    showModalBottomSheet(
      context: context,
      isScrollControlled: true,
      backgroundColor: Colors.transparent,
      builder: (context) => const _CompareMembershipSessionSheet(),
    );
  }

  void _bookNewSession([String? category]) {
    final defaultGym = MockData.gyms.first;
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => BookingSessionScreen(
          gym: defaultGym,
          initialCategory: category ?? 'Gym',
        ),
      ),
    );
  }

  void _buyMembership() {
    final defaultGym = MockData.gyms.first;
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => BuyMembershipScreen(gym: defaultGym),
      ),
    );
  }

  @override
  Widget build(BuildContext context) {
    final isDark = AppTheme.isDark(context);
    final backgroundColor = AppTheme.getBackgroundColor(context);
    final cardColor = AppTheme.getCardColor(context);
    final textColor = AppTheme.getTextColor(context);
    final subtitleColor = AppTheme.getSubtitleColor(context);
    final borderColor = AppTheme.getBorderColor(context);

    final upcomingCount = _bookings.where((b) => b.status == 'Upcoming').length;

    return Scaffold(
      backgroundColor: backgroundColor,
      appBar: AppBar(
        backgroundColor: backgroundColor,
        elevation: 0,
        scrolledUnderElevation: 0,
        centerTitle: false,
        title: Column(
          crossAxisAlignment: CrossAxisAlignment.start,
          children: [
            Text(
              _showHub ? "Booking Hub" : "My Bookings",
              style: TextStyle(
                color: textColor,
                fontSize: 22,
                fontWeight: FontWeight.w900,
                letterSpacing: -0.5,
              ),
            ),
            if (!_showHub)
              Text(
                "$upcomingCount active ${upcomingCount == 1 ? 'pass' : 'passes'}",
                style: const TextStyle(
                  color: AppTheme.secondaryColor,
                  fontSize: 12,
                  fontWeight: FontWeight.w600,
                ),
              ),
          ],
        ),
        actions: [
          // Top "+ Book" CTA Pill
          GestureDetector(
            onTap: () => _bookNewSession(),
            child: Container(
              margin: const EdgeInsets.only(right: 12),
              padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 7),
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [AppTheme.primaryColor, Color(0xFF0D47A1)],
                ),
                borderRadius: BorderRadius.circular(20),
                boxShadow: [
                  BoxShadow(
                    color: AppTheme.primaryColor.withOpacity(0.3),
                    blurRadius: 8,
                    offset: const Offset(0, 2),
                  ),
                ],
              ),
              child: const Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  Icon(Icons.add_rounded, color: Colors.white, size: 16),
                  SizedBox(width: 4),
                  Text(
                    "Book",
                    style: TextStyle(
                      color: Colors.white,
                      fontSize: 13,
                      fontWeight: FontWeight.bold,
                    ),
                  ),
                ],
              ),
            ),
          ),

          // Hub Toggle Icon
          IconButton(
            icon: Icon(
              _showHub ? Icons.view_agenda_rounded : Icons.grid_view_rounded,
              color: isDark ? Colors.white70 : const Color(0xFF01327E),
              size: 22,
            ),
            tooltip: _showHub ? "View Passes" : "View Booking Hub",
            onPressed: () => setState(() => _showHub = !_showHub),
          ),
          const SizedBox(width: 4),
        ],
      ),
      body: _showHub
          ? _buildHubView(context, cardColor, textColor, subtitleColor, borderColor, isDark)
          : _buildBookingsListView(context, cardColor, textColor, subtitleColor, borderColor, isDark),
    );
  }

  // ==========================================
  // PANEL 1: CHOOSE WHAT YOU WANT TO DO (HUB)
  // ==========================================
  Widget _buildHubView(
    BuildContext context,
    Color cardColor,
    Color textColor,
    Color subtitleColor,
    Color borderColor,
    bool isDark,
  ) {
    return SingleChildScrollView(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.fromLTRB(16.0, 12.0, 16.0, 120.0),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Text(
            "Choose What You Want to Do",
            style: TextStyle(
              fontSize: 16,
              fontWeight: FontWeight.bold,
              color: textColor,
            ),
          ),
          const SizedBox(height: 16),

          // 1. Membership Card (Navigates to full BuyMembershipScreen)
          Container(
            decoration: BoxDecoration(
              color: cardColor,
              borderRadius: BorderRadius.circular(22),
              border: Border.all(color: borderColor),
              boxShadow: [
                BoxShadow(
                  color: isDark ? Colors.black26 : Colors.black.withOpacity(0.04),
                  blurRadius: 14,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Material(
              color: Colors.transparent,
              child: InkWell(
                borderRadius: BorderRadius.circular(22),
                onTap: _buyMembership,
                child: Padding(
                  padding: const EdgeInsets.all(20.0),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          color: const Color(0xFF8B5CF6).withOpacity(0.12),
                          borderRadius: BorderRadius.circular(18),
                        ),
                        child: const Icon(Icons.workspace_premium_rounded, color: Color(0xFF8B5CF6), size: 30),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              "Buy Membership",
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                                color: textColor,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              "Unlimited all-access gym passes & trainer plans",
                              style: TextStyle(fontSize: 12, color: subtitleColor),
                            ),
                          ],
                        ),
                      ),
                      Icon(Icons.chevron_right_rounded, color: subtitleColor, size: 22),
                    ],
                  ),
                ),
              ),
            ),
          ),

          const SizedBox(height: 14),

          // 2. Session Bookings Card
          Container(
            decoration: BoxDecoration(
              color: cardColor,
              borderRadius: BorderRadius.circular(22),
              border: Border.all(color: borderColor),
              boxShadow: [
                BoxShadow(
                  color: isDark ? Colors.black26 : Colors.black.withOpacity(0.04),
                  blurRadius: 14,
                  offset: const Offset(0, 4),
                ),
              ],
            ),
            child: Material(
              color: Colors.transparent,
              child: InkWell(
                borderRadius: BorderRadius.circular(22),
                onTap: () => setState(() => _showHub = false),
                child: Padding(
                  padding: const EdgeInsets.all(20.0),
                  child: Row(
                    children: [
                      Container(
                        padding: const EdgeInsets.all(14),
                        decoration: BoxDecoration(
                          color: AppTheme.secondaryColor.withOpacity(0.12),
                          borderRadius: BorderRadius.circular(18),
                        ),
                        child: const Icon(Icons.calendar_month_rounded, color: AppTheme.secondaryColor, size: 30),
                      ),
                      const SizedBox(width: 16),
                      Expanded(
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              "Session Passes",
                              style: TextStyle(
                                fontSize: 16,
                                fontWeight: FontWeight.bold,
                                color: textColor,
                              ),
                            ),
                            const SizedBox(height: 4),
                            Text(
                              "Single sessions or class passes per your schedule",
                              style: TextStyle(fontSize: 12, color: subtitleColor),
                            ),
                          ],
                        ),
                      ),
                      Icon(Icons.chevron_right_rounded, color: subtitleColor, size: 22),
                    ],
                  ),
                ),
              ),
            ),
          ),

          const SizedBox(height: 24),

          // Active Memberships Section (If Any Exist)
          if (_memberships.isNotEmpty) ...[
            Text(
              "Your Active Memberships",
              style: TextStyle(
                fontSize: 16,
                fontWeight: FontWeight.bold,
                color: textColor,
              ),
            ),
            const SizedBox(height: 12),
            ..._memberships.map((m) {
              return Container(
                margin: const EdgeInsets.only(bottom: 12),
                padding: const EdgeInsets.all(16),
                decoration: BoxDecoration(
                  color: cardColor,
                  borderRadius: BorderRadius.circular(20),
                  border: Border.all(color: borderColor),
                  boxShadow: [
                    BoxShadow(
                      color: isDark ? Colors.black26 : Colors.black.withOpacity(0.03),
                      blurRadius: 10,
                      offset: const Offset(0, 3),
                    ),
                  ],
                ),
                child: Row(
                  children: [
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: const Color(0xFF8B5CF6).withOpacity(0.12),
                        borderRadius: BorderRadius.circular(14),
                      ),
                      child: const Icon(Icons.workspace_premium_rounded, color: Color(0xFF8B5CF6), size: 24),
                    ),
                    const SizedBox(width: 14),
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(m.gymName, style: TextStyle(fontSize: 15, fontWeight: FontWeight.bold, color: textColor)),
                          Text("${m.planName} • Valid till ${m.endDate}", style: TextStyle(fontSize: 12, color: subtitleColor)),
                        ],
                      ),
                    ),
                    ElevatedButton(
                      onPressed: () {
                        Navigator.push(
                          context,
                          MaterialPageRoute(
                            builder: (context) => MembershipDetailsScreen(membership: m),
                          ),
                        );
                      },
                      style: ElevatedButton.styleFrom(
                        backgroundColor: AppTheme.primaryColor,
                        foregroundColor: Colors.white,
                        shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 8),
                      ),
                      child: const Text("View Pass", style: TextStyle(fontSize: 12, fontWeight: FontWeight.bold)),
                    ),
                  ],
                ),
              );
            }),
            const SizedBox(height: 16),
          ],

          // 3. Comparison Info Tile
          Container(
            padding: const EdgeInsets.all(18),
            decoration: BoxDecoration(
              color: isDark ? const Color(0xFF262626) : const Color(0xFFF1F5F9),
              borderRadius: BorderRadius.circular(20),
              border: Border.all(color: borderColor),
            ),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                Text(
                  "Not sure which one to choose?",
                  style: TextStyle(fontSize: 13, color: subtitleColor),
                ),
                const SizedBox(height: 4),
                Text(
                  "Compare Membership vs Session Booking",
                  style: TextStyle(
                    fontSize: 15,
                    fontWeight: FontWeight.bold,
                    color: textColor,
                  ),
                ),
                const SizedBox(height: 12),
                GestureDetector(
                  onTap: _showCompareSheet,
                  child: const Row(
                    mainAxisSize: MainAxisSize.min,
                    children: [
                      Text(
                        "Compare Plans & Passes",
                        style: TextStyle(
                          fontSize: 13,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.secondaryColor,
                        ),
                      ),
                      SizedBox(width: 6),
                      Icon(Icons.arrow_forward_rounded, size: 15, color: AppTheme.secondaryColor),
                    ],
                  ),
                ),
              ],
            ),
          ),
        ],
      ),
    );
  }

  // ==========================================
  // PANEL 2: MY SESSION BOOKINGS (TABS & PASSES)
  // ==========================================
  Widget _buildBookingsListView(
    BuildContext context,
    Color cardColor,
    Color textColor,
    Color subtitleColor,
    Color borderColor,
    bool isDark,
  ) {
    final filteredBookings = _bookings.where((b) {
      if (_selectedTab == 'Upcoming') return b.status == 'Upcoming';
      if (_selectedTab == 'Completed') return b.status == 'Completed';
      return b.status == 'Cancelled';
    }).toList();

    return Column(
      children: [
        // Modern Floating Pill Tab Selector
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0, vertical: 8.0),
          child: Container(
            padding: const EdgeInsets.all(4),
            decoration: BoxDecoration(
              color: isDark ? const Color(0xFF1E1E1E) : const Color(0xFFEEF2F6),
              borderRadius: BorderRadius.circular(16),
              border: Border.all(color: borderColor),
            ),
            child: Row(
              children: ['Upcoming', 'Completed', 'Cancelled'].map((tab) {
                final isSelected = _selectedTab == tab;
                final count = _bookings.where((b) => b.status == tab).length;

                return Expanded(
                  child: GestureDetector(
                    onTap: () => setState(() => _selectedTab = tab),
                    child: AnimatedContainer(
                      duration: const Duration(milliseconds: 250),
                      padding: const EdgeInsets.symmetric(vertical: 9),
                      decoration: BoxDecoration(
                        color: isSelected
                            ? (isDark ? const Color(0xFF2D3748) : Colors.white)
                            : Colors.transparent,
                        borderRadius: BorderRadius.circular(12),
                        boxShadow: isSelected
                            ? [
                                BoxShadow(
                                  color: Colors.black.withOpacity(isDark ? 0.3 : 0.06),
                                  blurRadius: 8,
                                  offset: const Offset(0, 2),
                                ),
                              ]
                            : [],
                      ),
                      child: Center(
                        child: Text(
                          "$tab ($count)",
                          style: TextStyle(
                            fontSize: 12.5,
                            fontWeight: isSelected ? FontWeight.bold : FontWeight.w600,
                            color: isSelected
                                ? (isDark ? Colors.white : AppTheme.primaryColor)
                                : subtitleColor,
                          ),
                        ),
                      ),
                    ),
                  ),
                );
              }).toList(),
            ),
          ),
        ),

        const SizedBox(height: 6),

        // List of Digital Booking Passes + Quick Explore Banner
        Expanded(
          child: ListView(
            physics: const BouncingScrollPhysics(),
            padding: const EdgeInsets.fromLTRB(16, 8, 16, 120),
            children: [
              if (filteredBookings.isEmpty)
                _buildEmptyState(context, textColor, subtitleColor)
              else
                ...filteredBookings.map((booking) {
                  return _buildBookingTicket(
                    context,
                    booking,
                    cardColor,
                    textColor,
                    subtitleColor,
                    borderColor,
                    isDark,
                  );
                }),

              const SizedBox(height: 16),

              // Creative "Explore & Book Another Workout" Banner
              _buildExploreMoreBanner(context, cardColor, textColor, subtitleColor, borderColor, isDark),
            ],
          ),
        ),
      ],
    );
  }

  // ==========================================
  // CREATIVE DIGITAL PASS TICKET CARD
  // ==========================================
  Widget _buildBookingTicket(
    BuildContext context,
    BookingItem booking,
    Color cardColor,
    Color textColor,
    Color subtitleColor,
    Color borderColor,
    bool isDark,
  ) {
    final isUpcoming = booking.status == 'Upcoming';

    return Container(
      margin: const EdgeInsets.only(bottom: 14),
      decoration: BoxDecoration(
        color: cardColor,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: borderColor),
        boxShadow: [
          BoxShadow(
            color: isDark ? Colors.black38 : Colors.black.withOpacity(0.04),
            blurRadius: 14,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(22),
          onTap: () => _openBookingDetails(booking),
          child: Padding(
            padding: const EdgeInsets.all(18.0),
            child: Column(
              crossAxisAlignment: CrossAxisAlignment.start,
              children: [
                // Top Header Row
                Row(
                  crossAxisAlignment: CrossAxisAlignment.center,
                  children: [
                    // Category Icon Capsule
                    Container(
                      padding: const EdgeInsets.all(10),
                      decoration: BoxDecoration(
                        color: (isDark ? booking.accentColor.withOpacity(0.22) : booking.accentColor.withOpacity(0.12)),
                        borderRadius: BorderRadius.circular(14),
                      ),
                      child: Icon(
                        booking.icon,
                        color: isDark ? const Color(0xFF93C5FD) : booking.accentColor,
                        size: 22,
                      ),
                    ),
                    const SizedBox(width: 12),

                    // Gym Name & Type
                    Expanded(
                      child: Column(
                        crossAxisAlignment: CrossAxisAlignment.start,
                        children: [
                          Text(
                            booking.gymName,
                            style: TextStyle(
                              fontSize: 16,
                              fontWeight: FontWeight.bold,
                              color: textColor,
                            ),
                          ),
                          const SizedBox(height: 2),
                          Text(
                            booking.sessionSubtitle,
                            style: TextStyle(fontSize: 12, color: subtitleColor),
                          ),
                        ],
                      ),
                    ),

                    // Pass ID Tag
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 9, vertical: 4),
                      decoration: BoxDecoration(
                        color: isDark ? const Color(0xFF2A2A2A) : const Color(0xFFF1F5F9),
                        borderRadius: BorderRadius.circular(8),
                      ),
                      child: Text(
                        booking.id,
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                          color: isDark ? const Color(0xFF93C5FD) : AppTheme.primaryColor,
                          letterSpacing: 0.5,
                        ),
                      ),
                    ),
                  ],
                ),

                const SizedBox(height: 14),

                // Perforated / Stylized Dotted Divider
                Row(
                  children: List.generate(
                    24,
                    (index) => Expanded(
                      child: Container(
                        height: 1.2,
                        color: index.isEven ? borderColor : Colors.transparent,
                      ),
                    ),
                  ),
                ),

                const SizedBox(height: 14),

                // Date & Time Grid
                Row(
                  children: [
                    Expanded(
                      child: Row(
                        children: [
                          Icon(Icons.calendar_today_rounded, size: 14, color: isUpcoming ? AppTheme.secondaryColor : subtitleColor),
                          const SizedBox(width: 6),
                          Expanded(
                            child: Text(
                              booking.date,
                              style: TextStyle(
                                fontSize: 12.5,
                                color: textColor,
                                fontWeight: FontWeight.w600,
                              ),
                              overflow: TextOverflow.ellipsis,
                            ),
                          ),
                        ],
                      ),
                    ),
                    Row(
                      children: [
                        Icon(Icons.access_time_rounded, size: 14, color: subtitleColor),
                        const SizedBox(width: 6),
                        Text(
                          booking.time,
                          style: TextStyle(fontSize: 12, color: subtitleColor),
                        ),
                      ],
                    ),
                  ],
                ),

                const SizedBox(height: 14),

                // Footer Row: Price + OTP / Action CTA
                Row(
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    Row(
                      children: [
                        Text(
                          "₹${booking.amountPaid.toInt()}",
                          style: const TextStyle(
                            fontSize: 18,
                            fontWeight: FontWeight.w900,
                            color: AppTheme.secondaryColor,
                          ),
                        ),
                        const SizedBox(width: 6),
                        Text(
                          "Paid",
                          style: TextStyle(fontSize: 11, color: subtitleColor),
                        ),
                      ],
                    ),

                    // "View Pass & OTP" Pill Button
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 6),
                      decoration: BoxDecoration(
                        color: isDark
                            ? const Color(0xFF262626)
                            : AppTheme.primaryColor.withOpacity(0.08),
                        borderRadius: BorderRadius.circular(20),
                        border: Border.all(
                          color: isDark ? Colors.white12 : AppTheme.primaryColor.withOpacity(0.2),
                        ),
                      ),
                      child: Row(
                        mainAxisSize: MainAxisSize.min,
                        children: [
                          Icon(
                            isUpcoming ? Icons.qr_code_rounded : Icons.receipt_long_rounded,
                            size: 14,
                            color: isDark ? const Color(0xFF93C5FD) : AppTheme.primaryColor,
                          ),
                          const SizedBox(width: 6),
                          Text(
                            isUpcoming ? "View Pass & OTP" : "View Receipt",
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                              color: isDark ? const Color(0xFF93C5FD) : AppTheme.primaryColor,
                            ),
                          ),
                          const SizedBox(width: 4),
                          Icon(
                            Icons.arrow_forward_ios_rounded,
                            size: 10,
                            color: isDark ? const Color(0xFF93C5FD) : AppTheme.primaryColor,
                          ),
                        ],
                      ),
                    ),
                  ],
                ),
              ],
            ),
          ),
        ),
      ),
    );
  }

  // ==========================================
  // CREATIVE INLINE "EXPLORE MORE" BANNER CARD
  // ==========================================
  Widget _buildExploreMoreBanner(
    BuildContext context,
    Color cardColor,
    Color textColor,
    Color subtitleColor,
    Color borderColor,
    bool isDark,
  ) {
    return Container(
      padding: const EdgeInsets.all(20),
      decoration: BoxDecoration(
        gradient: LinearGradient(
          begin: Alignment.topLeft,
          end: Alignment.bottomRight,
          colors: isDark
              ? [const Color(0xFF1E293B), const Color(0xFF0F172A)]
              : [const Color(0xFFF1F5F9), const Color(0xFFE2E8F0)],
        ),
        borderRadius: BorderRadius.circular(24),
        border: Border.all(color: borderColor),
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            children: [
              Container(
                padding: const EdgeInsets.all(8),
                decoration: BoxDecoration(
                  color: AppTheme.secondaryColor.withOpacity(0.15),
                  shape: BoxShape.circle,
                ),
                child: const Icon(Icons.bolt_rounded, color: AppTheme.secondaryColor, size: 20),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      "Book Your Next Workout",
                      style: TextStyle(
                        fontSize: 15,
                        fontWeight: FontWeight.bold,
                        color: textColor,
                      ),
                    ),
                    Text(
                      "Single passes • Zero lock-in contracts",
                      style: TextStyle(fontSize: 11.5, color: subtitleColor),
                    ),
                  ],
                ),
              ),
            ],
          ),
          const SizedBox(height: 16),

          // Quick category booking chips
          SingleChildScrollView(
            scrollDirection: Axis.horizontal,
            physics: const BouncingScrollPhysics(),
            child: Row(
              children: [
                _buildQuickCategoryChip(Icons.fitness_center_rounded, "Gym", 'Gym', isDark),
                _buildQuickCategoryChip(Icons.self_improvement_rounded, "Yoga", 'Yoga', isDark),
                _buildQuickCategoryChip(Icons.music_note_rounded, "Zumba", 'Zumba', isDark),
                _buildQuickCategoryChip(Icons.bolt_rounded, "HIIT", 'HIIT', isDark),
                _buildQuickCategoryChip(Icons.sports_mma_rounded, "Boxing", 'Boxing', isDark),
              ],
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildQuickCategoryChip(IconData icon, String label, String category, bool isDark) {
    return GestureDetector(
      onTap: () => _bookNewSession(category),
      child: Container(
        margin: const EdgeInsets.only(right: 8),
        padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 8),
        decoration: BoxDecoration(
          color: isDark ? const Color(0xFF2A374A) : Colors.white,
          borderRadius: BorderRadius.circular(16),
          boxShadow: [
            BoxShadow(
              color: Colors.black.withOpacity(0.04),
              blurRadius: 6,
              offset: const Offset(0, 2),
            ),
          ],
        ),
        child: Row(
          mainAxisSize: MainAxisSize.min,
          children: [
            Icon(
              icon,
              size: 15,
              color: isDark ? const Color(0xFF93C5FD) : AppTheme.primaryColor,
            ),
            const SizedBox(width: 6),
            Text(
              label,
              style: TextStyle(
                fontSize: 12.5,
                fontWeight: FontWeight.bold,
                color: isDark ? Colors.white : const Color(0xFF0F172A),
              ),
            ),
            const SizedBox(width: 4),
            Icon(Icons.arrow_forward_rounded, size: 12, color: AppTheme.secondaryColor),
          ],
        ),
      ),
    );
  }

  Widget _buildEmptyState(BuildContext context, Color textColor, Color subtitleColor) {
    return Padding(
      padding: const EdgeInsets.symmetric(vertical: 36.0),
      child: Center(
        child: Column(
          mainAxisAlignment: MainAxisAlignment.center,
          children: [
            Icon(Icons.calendar_today_outlined, size: 50, color: subtitleColor.withOpacity(0.4)),
            const SizedBox(height: 14),
            Text(
              "No $_selectedTab Bookings",
              style: TextStyle(fontSize: 16, fontWeight: FontWeight.bold, color: textColor),
            ),
            const SizedBox(height: 6),
            Text(
              "Your $_selectedTab sessions will show up right here.",
              style: TextStyle(fontSize: 12, color: subtitleColor),
            ),
          ],
        ),
      ),
    );
  }
}

// ==========================================
// COMPARE MEMBERSHIP VS SESSION SHEET
// ==========================================
class _CompareMembershipSessionSheet extends StatelessWidget {
  const _CompareMembershipSessionSheet();

  @override
  Widget build(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final cardColor = isDark ? const Color(0xFF1E1E1E) : Colors.white;
    final textColor = isDark ? Colors.white : const Color(0xFF0F172A);
    final subtitleColor = isDark ? Colors.white70 : const Color(0xFF64748B);

    return Container(
      padding: EdgeInsets.fromLTRB(20, 16, 20, MediaQuery.of(context).padding.bottom + 20),
      decoration: BoxDecoration(
        color: cardColor,
        borderRadius: const BorderRadius.vertical(top: Radius.circular(28)),
      ),
      child: Column(
        mainAxisSize: MainAxisSize.min,
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                "Membership vs Session Booking",
                style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold, color: textColor),
              ),
              IconButton(
                icon: Icon(Icons.close_rounded, color: subtitleColor),
                onPressed: () => Navigator.pop(context),
              ),
            ],
          ),
          const SizedBox(height: 14),

          // Comparison Table Cards
          Row(
            children: [
              // Column 1: Membership
              Expanded(
                child: Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: isDark ? const Color(0xFF262626) : const Color(0xFFF1F5F9),
                    borderRadius: BorderRadius.circular(18),
                    border: Border.all(color: const Color(0xFF8B5CF6).withOpacity(0.4), width: 1.5),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Row(
                        children: [
                          Icon(Icons.workspace_premium_rounded, color: Color(0xFF8B5CF6), size: 18),
                          SizedBox(width: 6),
                          Text("Membership", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: Color(0xFF8B5CF6))),
                        ],
                      ),
                      const SizedBox(height: 10),
                      _buildCheckItem("Unlimited daily visits", isDark),
                      _buildCheckItem("Lowest cost per visit", isDark),
                      _buildCheckItem("Free locker & showers", isDark),
                      _buildCheckItem("Group class discounts", isDark),
                      _buildCheckItem("Priority trainer support", isDark),
                    ],
                  ),
                ),
              ),
              const SizedBox(width: 12),

              // Column 2: Session Booking
              Expanded(
                child: Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: isDark ? const Color(0xFF262626) : const Color(0xFFF1F5F9),
                    borderRadius: BorderRadius.circular(18),
                    border: Border.all(color: AppTheme.secondaryColor.withOpacity(0.4), width: 1.5),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      const Row(
                        children: [
                          Icon(Icons.calendar_month_rounded, color: AppTheme.secondaryColor, size: 18),
                          SizedBox(width: 6),
                          Text("Session Pass", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 13, color: AppTheme.secondaryColor)),
                        ],
                      ),
                      const SizedBox(height: 10),
                      _buildCheckItem("Pay as you go", isDark),
                      _buildCheckItem("Zero monthly lock-in", isDark),
                      _buildCheckItem("Try different gyms", isDark),
                      _buildCheckItem("Instant QR entry", isDark),
                      _buildCheckItem("Cancel anytime", isDark),
                    ],
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 20),

          SizedBox(
            width: double.infinity,
            height: 48,
            child: ElevatedButton(
              onPressed: () => Navigator.pop(context),
              style: ElevatedButton.styleFrom(
                backgroundColor: AppTheme.secondaryColor,
                foregroundColor: Colors.white,
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(14)),
              ),
              child: const Text("Got It", style: TextStyle(fontWeight: FontWeight.bold, fontSize: 14)),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildCheckItem(String text, bool isDark) {
    return Padding(
      padding: const EdgeInsets.only(bottom: 6.0),
      child: Row(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          const Icon(Icons.check_circle_rounded, color: AppTheme.secondaryColor, size: 14),
          const SizedBox(width: 6),
          Expanded(
            child: Text(
              text,
              style: TextStyle(
                fontSize: 11,
                color: isDark ? Colors.white70 : const Color(0xFF334155),
                height: 1.25,
              ),
            ),
          ),
        ],
      ),
    );
  }
}
