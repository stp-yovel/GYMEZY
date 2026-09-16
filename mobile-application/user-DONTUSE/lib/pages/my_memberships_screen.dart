import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../models/membership_item.dart';
import '../data/booking_repository.dart';
import '../data/mock_data.dart';
import '../theme/app_theme.dart';
import 'membership_details_screen.dart';
import 'buy_membership_screen.dart';

class MyMembershipsScreen extends StatefulWidget {
  const MyMembershipsScreen({super.key});

  @override
  State<MyMembershipsScreen> createState() => _MyMembershipsScreenState();
}

class _MyMembershipsScreenState extends State<MyMembershipsScreen> {
  String _selectedTab = 'Active'; // 'Active', 'Completed', 'Cancelled'

  @override
  void initState() {
    super.initState();
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

  List<MembershipItem> get _allMemberships => BookingRepository.instance.memberships;

  List<MembershipItem> get _filteredMemberships {
    return _allMemberships.where((m) {
      if (_selectedTab == 'Active') {
        return m.status == 'Active' || m.status == 'Expiring Soon';
      } else if (_selectedTab == 'Completed') {
        return m.status == 'Completed' || m.status == 'Expired';
      } else {
        return m.status == 'Cancelled';
      }
    }).toList();
  }

  void _openMembershipDetails(MembershipItem membership) {
    Navigator.push(
      context,
      MaterialPageRoute(
        builder: (context) => MembershipDetailsScreen(membership: membership),
      ),
    );
  }

  void _openUpgradeFlow() {
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
    final primaryNavy = AppTheme.getAccentColor(context);

    final activeCount = _allMemberships.where((m) => m.status == 'Active' || m.status == 'Expiring Soon').length;
    final completedCount = _allMemberships.where((m) => m.status == 'Completed' || m.status == 'Expired').length;
    final cancelledCount = _allMemberships.where((m) => m.status == 'Cancelled').length;

    return Scaffold(
      backgroundColor: backgroundColor,
      appBar: AppBar(
        backgroundColor: backgroundColor,
        elevation: 0,
        scrolledUnderElevation: 0,
        centerTitle: false,
        title: Text(
          "My Memberships",
          style: TextStyle(
            fontSize: 22,
            fontWeight: FontWeight.w900,
            color: textColor,
            letterSpacing: -0.5,
          ),
        ),
        actions: [
          IconButton(
            icon: Stack(
              children: [
                Icon(Icons.notifications_outlined, color: textColor, size: 24),
                Positioned(
                  right: 2,
                  top: 2,
                  child: Container(
                    width: 8,
                    height: 8,
                    decoration: const BoxDecoration(
                      color: Colors.redAccent,
                      shape: BoxShape.circle,
                    ),
                  ),
                ),
              ],
            ),
            onPressed: () {},
          ),
          const SizedBox(width: 8),
        ],
      ),
      body: ListView(
        physics: const BouncingScrollPhysics(),
        padding: const EdgeInsets.fromLTRB(16, 8, 16, 120),
        children: [
          // 1. Upgrade Promo Banner
          Container(
            width: double.infinity,
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              gradient: const LinearGradient(
                colors: [Color(0xFF1E1B4B), Color(0xFF312E81), Color(0xFF4338CA)],
                begin: Alignment.topLeft,
                end: Alignment.bottomRight,
              ),
              borderRadius: BorderRadius.circular(24),
              boxShadow: [
                BoxShadow(
                  color: const Color(0xFF312E81).withValues(alpha: 0.3),
                  blurRadius: 16,
                  offset: const Offset(0, 8),
                ),
              ],
            ),
            child: Row(
              children: [
                Expanded(
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Text(
                        "Upgrade Your Fitness Journey",
                        style: TextStyle(
                          fontSize: 12,
                          fontWeight: FontWeight.w600,
                          color: Colors.white.withValues(alpha: 0.8),
                        ),
                      ),
                      const SizedBox(height: 4),
                      const Text(
                        "Upgrade Membership",
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.w900,
                          color: Colors.white,
                          letterSpacing: -0.3,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        "Unlock more benefits and achieve your goals",
                        style: TextStyle(
                          fontSize: 12,
                          color: Colors.white.withValues(alpha: 0.8),
                        ),
                      ),
                      const SizedBox(height: 14),
                      ElevatedButton(
                        onPressed: _openUpgradeFlow,
                        style: ElevatedButton.styleFrom(
                          backgroundColor: Colors.white,
                          foregroundColor: const Color(0xFF312E81),
                          elevation: 0,
                          padding: const EdgeInsets.symmetric(horizontal: 18, vertical: 10),
                          shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
                        ),
                        child: const Text(
                          "Upgrade Now",
                          style: TextStyle(fontSize: 13, fontWeight: FontWeight.w800),
                        ),
                      ),
                    ],
                  ),
                ),
                const SizedBox(width: 12),
                // Crown / Trophy badge icon
                Container(
                  width: 72,
                  height: 72,
                  decoration: BoxDecoration(
                    shape: BoxShape.circle,
                    gradient: const RadialGradient(
                      colors: [Color(0xFF6366F1), Color(0xFF312E81)],
                    ),
                    border: Border.all(color: Colors.amberAccent.withValues(alpha: 0.6), width: 2),
                    boxShadow: [
                      BoxShadow(
                        color: Colors.amberAccent.withValues(alpha: 0.2),
                        blurRadius: 12,
                      ),
                    ],
                  ),
                  child: const Icon(
                    Icons.workspace_premium_rounded,
                    color: Colors.amberAccent,
                    size: 38,
                  ),
                ),
              ],
            ),
          ).animate().fadeIn(duration: 350.ms).slideY(begin: 0.05, end: 0),

          const SizedBox(height: 20),

          // 2. Segmented Status Filter Tabs
          Row(
            children: [
              _buildTabPill("Active", activeCount, primaryNavy, textColor, cardColor, borderColor, isDark),
              const SizedBox(width: 8),
              _buildTabPill("Completed", completedCount, primaryNavy, textColor, cardColor, borderColor, isDark),
              const SizedBox(width: 8),
              _buildTabPill("Cancelled", cancelledCount, primaryNavy, textColor, cardColor, borderColor, isDark),
            ],
          ),

          const SizedBox(height: 18),

          // 3. Memberships List
          if (_filteredMemberships.isEmpty)
            _buildEmptyState(textColor, subtitleColor, cardColor, borderColor, isDark)
          else
            ..._filteredMemberships.map((membership) {
              return _buildMembershipCard(membership, cardColor, textColor, subtitleColor, borderColor, primaryNavy, isDark);
            }),
        ],
      ),
    );
  }

  Widget _buildTabPill(
    String label,
    int count,
    Color activeColor,
    Color textColor,
    Color cardColor,
    Color borderColor,
    bool isDark,
  ) {
    final isSelected = _selectedTab == label;
    return Expanded(
      child: GestureDetector(
        onTap: () => setState(() => _selectedTab = label),
        child: AnimatedContainer(
          duration: const Duration(milliseconds: 200),
          padding: const EdgeInsets.symmetric(vertical: 10),
          decoration: BoxDecoration(
            color: isSelected
                ? (isDark ? const Color(0xFF2563EB) : const Color(0xFF003882))
                : cardColor,
            borderRadius: BorderRadius.circular(16),
            border: Border.all(
              color: isSelected
                  ? (isDark ? const Color(0xFF3B82F6) : const Color(0xFF003882))
                  : borderColor,
              width: 1.2,
            ),
          ),
          alignment: Alignment.center,
          child: Text(
            "$label ($count)",
            style: TextStyle(
              fontSize: 13,
              fontWeight: isSelected ? FontWeight.w800 : FontWeight.w600,
              color: isSelected ? Colors.white : (isDark ? Colors.white70 : textColor),
            ),
          ),
        ),
      ),
    );
  }

  Widget _buildMembershipCard(
    MembershipItem membership,
    Color cardColor,
    Color textColor,
    Color subtitleColor,
    Color borderColor,
    Color primaryNavy,
    bool isDark,
  ) {
    return Container(
      margin: const EdgeInsets.only(bottom: 14),
      padding: const EdgeInsets.all(18),
      decoration: BoxDecoration(
        color: cardColor,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(color: borderColor, width: 1.2),
        boxShadow: [
          BoxShadow(
            color: isDark ? Colors.black26 : Colors.black.withValues(alpha: 0.03),
            blurRadius: 10,
            offset: const Offset(0, 4),
          ),
        ],
      ),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          // Gym Logo, Name, and Plan Badge
          Row(
            children: [
              Container(
                width: 48,
                height: 48,
                decoration: BoxDecoration(
                  color: isDark ? const Color(0xFF262626) : const Color(0xFFF1F5F9),
                  borderRadius: BorderRadius.circular(14),
                  border: Border.all(color: borderColor),
                ),
                child: ClipRRect(
                  borderRadius: BorderRadius.circular(14),
                  child: membership.gymImageUrl.isNotEmpty
                      ? Image.network(
                          membership.gymImageUrl,
                          fit: BoxFit.cover,
                          errorBuilder: (_, __, ___) => const Icon(
                            Icons.fitness_center_rounded,
                            color: Color(0xFF003882),
                          ),
                        )
                      : const Icon(
                          Icons.fitness_center_rounded,
                          color: Color(0xFF003882),
                        ),
                ),
              ),
              const SizedBox(width: 14),
              Expanded(
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    Text(
                      membership.gymName,
                      style: TextStyle(
                        fontSize: 16,
                        fontWeight: FontWeight.w800,
                        color: textColor,
                      ),
                    ),
                    const SizedBox(height: 4),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: isDark
                            ? const Color(0xFF1E3A8A).withValues(alpha: 0.6)
                            : const Color(0xFF003882).withValues(alpha: 0.1),
                        borderRadius: BorderRadius.circular(8),
                        border: isDark
                            ? Border.all(color: const Color(0xFF3B82F6).withValues(alpha: 0.3))
                            : null,
                      ),
                      child: Text(
                        membership.planName,
                        style: TextStyle(
                          fontSize: 11,
                          fontWeight: FontWeight.bold,
                          color: isDark ? const Color(0xFF93C5FD) : const Color(0xFF003882),
                        ),
                      ),
                    ),
                  ],
                ),
              ),
            ],
          ),

          const SizedBox(height: 16),
          Divider(height: 1, color: borderColor),
          const SizedBox(height: 14),

          // End Date & Days Remaining
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Icon(Icons.calendar_today_outlined, size: 16, color: subtitleColor),
                  const SizedBox(width: 6),
                  Text("End Date", style: TextStyle(fontSize: 13, color: subtitleColor)),
                ],
              ),
              Text(
                membership.endDate,
                style: TextStyle(fontSize: 13.5, fontWeight: FontWeight.w800, color: textColor),
              ),
            ],
          ),

          const SizedBox(height: 10),

          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  Icon(Icons.access_time_rounded, size: 16, color: subtitleColor),
                  const SizedBox(width: 6),
                  Text("Days Remaining", style: TextStyle(fontSize: 13, color: subtitleColor)),
                ],
              ),
              Text(
                membership.durationDays,
                style: const TextStyle(
                  fontSize: 13.5,
                  fontWeight: FontWeight.w800,
                  color: Color(0xFF16A34A), // Emerald green
                ),
              ),
            ],
          ),

          const SizedBox(height: 16),

          // View Button
          SizedBox(
            width: double.infinity,
            height: 44,
            child: OutlinedButton(
              onPressed: () => _openMembershipDetails(membership),
              style: OutlinedButton.styleFrom(
                side: BorderSide(
                  color: isDark ? const Color(0xFF93C5FD) : const Color(0xFF003882),
                  width: 1.2,
                ),
                foregroundColor: isDark ? const Color(0xFF93C5FD) : const Color(0xFF003882),
                shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
              ),
              child: const Text(
                "View",
                style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold),
              ),
            ),
          ),
        ],
      ),
    );
  }

  Widget _buildEmptyState(
    Color textColor,
    Color subtitleColor,
    Color cardColor,
    Color borderColor,
    bool isDark,
  ) {
    return Container(
      padding: const EdgeInsets.symmetric(vertical: 40, horizontal: 20),
      alignment: Alignment.center,
      child: Column(
        children: [
          Container(
            padding: const EdgeInsets.all(20),
            decoration: BoxDecoration(
              color: isDark ? const Color(0xFF1E1E1E) : const Color(0xFFF1F5F9),
              shape: BoxShape.circle,
            ),
            child: Icon(Icons.card_membership_rounded, size: 48, color: subtitleColor),
          ),
          const SizedBox(height: 16),
          Text(
            "No $_selectedTab Memberships",
            style: TextStyle(fontSize: 17, fontWeight: FontWeight.bold, color: textColor),
          ),
          const SizedBox(height: 6),
          Text(
            "Your $_selectedTab memberships will show up here.",
            style: TextStyle(fontSize: 13, color: subtitleColor),
            textAlign: TextAlign.center,
          ),
        ],
      ),
    );
  }
}
