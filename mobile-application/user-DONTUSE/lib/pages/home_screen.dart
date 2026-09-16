import 'package:flutter/material.dart';
import 'package:flutter_animate/flutter_animate.dart';
import '../theme/app_theme.dart';
import '../models/gym.dart';
import '../data/mock_data.dart';
import 'gym_details_screen.dart';
import '../widgets/custom_floating_nav_bar.dart';
import '../widgets/scaffoldmessage.dart';
import 'my_bookings_screen.dart';
import 'my_memberships_screen.dart';
import 'profile_screen.dart';

class HomeScreen extends StatefulWidget {
  const HomeScreen({super.key});

  @override
  State<HomeScreen> createState() => _HomeScreenState();
}

class _HomeScreenState extends State<HomeScreen> {
  int _currentIndex = 0;
  final TextEditingController _searchController = TextEditingController();
  String _searchQuery = '';
  String _selectedCategory = 'All';

  // Selected dropdown filters
  String? _selectedType;
  String? _selectedFacility;
  String? _selectedWorkout;

  final List<Gym> _allGyms = MockData.gyms;
  List<Gym> _filteredGyms = MockData.gyms;
  final Set<String> _bookmarkedGymNames = {'FitZone Gym', 'PowerHouse Gym'};

  final List<Map<String, dynamic>> _categories = [
    {'name': 'All', 'icon': Icons.local_fire_department_rounded},
    {'name': 'Strength', 'icon': Icons.fitness_center_rounded},
    {'name': 'HIIT', 'icon': Icons.bolt_rounded},
    {'name': 'Yoga', 'icon': Icons.self_improvement_rounded},
    {'name': 'Boxing', 'icon': Icons.sports_mma_rounded},
    {'name': 'Zumba', 'icon': Icons.music_note_rounded},
    {'name': 'CrossFit', 'icon': Icons.timer_rounded},
    {'name': 'AC Gym', 'icon': Icons.ac_unit_rounded},
    {'name': 'Women Only', 'icon': Icons.female_rounded},
  ];

  @override
  void initState() {
    super.initState();
    _searchController.addListener(() {
      if (_searchQuery != _searchController.text.trim()) {
        setState(() {
          _searchQuery = _searchController.text.trim();
        });
        _applyFilters();
      }
    });
  }

  @override
  void dispose() {
    _searchController.dispose();
    super.dispose();
  }

  void _applyFilters() {
    setState(() {
      _filteredGyms = _allGyms.where((gym) {
        // Search query filter (matches name, location, tags)
        if (_searchQuery.isNotEmpty) {
          final query = _searchQuery.toLowerCase();
          final matchesName = gym.name.toLowerCase().contains(query);
          final matchesLocation = gym.location.toLowerCase().contains(query);
          final matchesTags = gym.tags.any((t) => t.toLowerCase().contains(query));
          if (!matchesName && !matchesLocation && !matchesTags) return false;
        }

        // Category filter
        if (_selectedCategory != 'All') {
          if (_selectedCategory == 'AC Gym' &&
              !gym.facilities.any((f) => f.toLowerCase().contains('ac'))) {
            return false;
          }
          if (_selectedCategory == 'Women Only' &&
              !gym.name.contains('Zone') &&
              !gym.tags.contains('Women Only')) {
            return false;
          }
          if (_selectedCategory == 'Strength' &&
              !gym.tags.contains('Strength') &&
              !gym.tags.contains('Bodybuilding')) {
            return false;
          }
          if (_selectedCategory == 'HIIT' &&
              !gym.tags.contains('HIIT') &&
              !gym.tags.contains('Cardio')) {
            return false;
          }
          if (_selectedCategory == 'Yoga' && !gym.tags.contains('Yoga')) {
            return false;
          }
          if (_selectedCategory == 'Boxing' &&
              !gym.tags.contains('Boxing') &&
              !gym.tags.contains('MMA')) {
            return false;
          }
          if (_selectedCategory == 'Zumba' &&
              !gym.tags.contains('Zumba') &&
              !gym.tags.contains('Dance')) {
            return false;
          }
          if (_selectedCategory == 'CrossFit' && !gym.tags.contains('CrossFit')) {
            return false;
          }
        }

        // Dropdown filters
        if (_selectedType != null) {
          if (_selectedType == "Women Only" && !gym.name.contains("Zone")) return false;
          if (_selectedType == "Men Only" && gym.name.contains("Studio")) return false;
        }
        if (_selectedFacility != null) {
          if (_selectedFacility == "AC" && gym.rating < 4.6) return false;
        }
        if (_selectedWorkout != null) {
          if (!gym.tags.contains(_selectedWorkout)) return false;
        }

        return true;
      }).toList();
    });
  }

  void _clearAllFilters() {
    setState(() {
      _searchController.clear();
      _searchQuery = '';
      _selectedCategory = 'All';
      _selectedType = null;
      _selectedFacility = null;
      _selectedWorkout = null;
      _filteredGyms = _allGyms;
    });
  }

  void _toggleBookmark(String gymName) {
    setState(() {
      if (_bookmarkedGymNames.contains(gymName)) {
        _bookmarkedGymNames.remove(gymName);
      } else {
        _bookmarkedGymNames.add(gymName);
      }
    });
  }

  bool get _hasActiveFilters =>
      _searchQuery.isNotEmpty ||
      _selectedCategory != 'All' ||
      _selectedType != null ||
      _selectedFacility != null ||
      _selectedWorkout != null;

  @override
  Widget build(BuildContext context) {
    final backgroundColor = AppTheme.getBackgroundColor(context);

    final List<Widget> tabs = [
      _buildExploreTab(context),
      const MyBookingsScreen(),
      const MyMembershipsScreen(),
      ProfileScreen(
        onNavigateToBookings: () => setState(() => _currentIndex = 1),
        onNavigateToMemberships: () => setState(() => _currentIndex = 2),
      ),
    ];

    return Scaffold(
      backgroundColor: backgroundColor,
      extendBody: true,
      body: SafeArea(
        bottom: false,
        child: tabs[_currentIndex],
      ),
      bottomNavigationBar: CustomFloatingNavBar(
        currentIndex: _currentIndex,
        onTap: (index) {
          setState(() {
            _currentIndex = index;
          });
        },
      ),
    );
  }


  Widget _buildExploreTab(BuildContext context) {
    return SingleChildScrollView(
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.only(bottom: 10), // Clearance for floating nav
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.stretch,
        children: [
          // 1. Header & Location Bar
          _buildHeaderBar(context)
              .animate()
              .fadeIn(duration: 400.ms)
              .slideY(begin: -0.05, curve: Curves.easeOut),

          const SizedBox(height: 16),

          // 2. Search & Filter Bar
          _buildSearchAndFilterBar(context)
              .animate()
              .fadeIn(delay: 100.ms, duration: 400.ms),

          const SizedBox(height: 18),

          // 3. Promotional Flash Offer Hero Banner
          _buildPromoBanner(context)
              .animate()
              .fadeIn(delay: 150.ms, duration: 500.ms)
              .scale(begin: const Offset(0.98, 0.98), curve: Curves.easeOut),

          const SizedBox(height: 22),

          // 4. Curated Workout Category Chips
          _buildCategoryPills(context)
              .animate()
              .fadeIn(delay: 200.ms, duration: 400.ms),

          const SizedBox(height: 24),

          // 5. Featured Spotlight Carousel (when no search is typed)
          if (_searchQuery.isEmpty && _selectedCategory == 'All') ...[
            _buildSpotlightSection(context)
                .animate()
                .fadeIn(delay: 250.ms, duration: 400.ms),
            const SizedBox(height: 24),
          ],

          // 6. All Gyms Header & Count
          Padding(
            padding: const EdgeInsets.symmetric(horizontal: 16.0),
            child: Row(
              mainAxisAlignment: MainAxisAlignment.spaceBetween,
              children: [
                Row(
                  children: [
                    Text(
                      _selectedCategory == 'All'
                          ? "Nearby Gyms"
                          : "$_selectedCategory Gyms",
                      style: TextStyle(
                        fontSize: 20,
                        fontWeight: FontWeight.bold,
                        color: AppTheme.getTextColor(context),
                      ),
                    ),
                    const SizedBox(width: 8),
                    Container(
                      padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                      decoration: BoxDecoration(
                        color: AppTheme.primaryColor.withOpacity(0.1),
                        borderRadius: BorderRadius.circular(10),
                      ),
                      child: Text(
                        "${_filteredGyms.length}",
                        style: const TextStyle(
                          color: AppTheme.primaryColor,
                          fontSize: 12,
                          fontWeight: FontWeight.bold,
                        ),
                      ),
                    ),
                  ],
                ),
                if (_hasActiveFilters)
                  GestureDetector(
                    onTap: _clearAllFilters,
                    child: const Text(
                      "Reset Filters",
                      style: TextStyle(
                        fontSize: 13,
                        color: Colors.redAccent,
                        fontWeight: FontWeight.bold,
                      ),
                    ),
                  ),
              ],
            ),
          ),

          const SizedBox(height: 14),

          // 7. Gym List Cards or Empty State
          if (_filteredGyms.isEmpty)
            _buildEmptyState(context)
          else
            Padding(
              padding: const EdgeInsets.symmetric(horizontal: 16.0),
              child: ListView.builder(
                shrinkWrap: true,
                physics: const NeverScrollableScrollPhysics(),
                itemCount: _filteredGyms.length,
                itemBuilder: (context, index) {
                  final gym = _filteredGyms[index];
                  final gymCard = _buildModernGymCard(context, gym)
                      .animate(delay: (index * 60).ms)
                      .fadeIn(duration: 400.ms)
                      .slideY(begin: 0.05, curve: Curves.easeOut);

                  // Insert 'GYMEZY for you' after the 4th gym (index == 3)
                  if (index == 3) {
                    return Column(
                      children: [
                        gymCard,
                        _buildGymezyForYouSection(context)
                            .animate()
                            .fadeIn(delay: 150.ms, duration: 400.ms),
                      ],
                    );
                  }

                  // If total gyms are less than 4 and this is the last one, also show it at bottom
                  if (_filteredGyms.length < 4 && index == _filteredGyms.length - 1) {
                    return Column(
                      children: [
                        gymCard,
                        _buildGymezyForYouSection(context)
                            .animate()
                            .fadeIn(delay: 150.ms, duration: 400.ms),
                      ],
                    );
                  }

                  return gymCard;
                },
              ),
            ),
        ],
      ),
    );
  }

  // 7b. 'GYMEZY for you' Section (Inspired by modern fintech & lifestyle apps)
  Widget _buildGymezyForYouSection(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final cardColor = isDark ? const Color(0xFF1E1E1E) : Colors.white;
    final borderColor = isDark ? Colors.white10 : const Color(0xFFE2E8F0);
    final textColor = AppTheme.getTextColor(context);
    final subtitleColor = AppTheme.getSubtitleColor(context);

    return Container(
      margin: const EdgeInsets.only(top: 14, bottom: 20),
      child: Column(
        crossAxisAlignment: CrossAxisAlignment.start,
        children: [
          Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Text(
                "GYMEZY for you",
                style: TextStyle(
                  fontSize: 19,
                  fontWeight: FontWeight.bold,
                  color: textColor,
                  letterSpacing: -0.3,
                ),
              ),
              Container(
                padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                decoration: BoxDecoration(
                  color: AppTheme.secondaryColor.withOpacity(0.12),
                  borderRadius: BorderRadius.circular(8),
                ),
                child: const Text(
                  "Exclusive",
                  style: TextStyle(
                    color: AppTheme.secondaryColor,
                    fontSize: 10,
                    fontWeight: FontWeight.bold,
                  ),
                ),
              ),
            ],
          ),
          const SizedBox(height: 12),

          // 2-Column Cards Grid
          Row(
            children: [
              // Card 1: Multi-Gym Pass
              Expanded(
                child: Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: cardColor,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: borderColor),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: AppTheme.primaryColor.withOpacity(0.1),
                          borderRadius: BorderRadius.circular(14),
                        ),
                        child: Icon(
                          Icons.card_membership_rounded,
                          color: isDark ? const Color(0xFF93C5FD) : AppTheme.primaryColor,
                          size: 24,
                        ),
                      ),
                      const SizedBox(height: 12),
                      Text(
                        "All-Access Pass",
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                          color: textColor,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        "Work out at any partner gym across Chennai",
                        style: TextStyle(
                          fontSize: 11,
                          color: subtitleColor,
                          height: 1.3,
                        ),
                      ),
                      const SizedBox(height: 12),
                      Row(
                        children: [
                          Text(
                            "Get pass",
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                              color: isDark ? const Color(0xFF93C5FD) : AppTheme.primaryColor,
                            ),
                          ),
                          const SizedBox(width: 4),
                          Icon(
                            Icons.arrow_outward_rounded,
                            size: 14,
                            color: isDark ? const Color(0xFF93C5FD) : AppTheme.primaryColor,
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(width: 12),

              // Card 2: 1-on-1 Personal Training
              Expanded(
                child: Container(
                  padding: const EdgeInsets.all(14),
                  decoration: BoxDecoration(
                    color: cardColor,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(color: borderColor),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      Container(
                        padding: const EdgeInsets.all(10),
                        decoration: BoxDecoration(
                          color: AppTheme.secondaryColor.withOpacity(0.12),
                          borderRadius: BorderRadius.circular(14),
                        ),
                        child: const Icon(
                          Icons.fitness_center_rounded,
                          color: AppTheme.secondaryColor,
                          size: 24,
                        ),
                      ),
                      const SizedBox(height: 12),
                      Text(
                        "Certified Trainers",
                        style: TextStyle(
                          fontSize: 14,
                          fontWeight: FontWeight.bold,
                          color: textColor,
                        ),
                      ),
                      const SizedBox(height: 4),
                      Text(
                        "Book 1-on-1 personal coaches at special rates",
                        style: TextStyle(
                          fontSize: 11,
                          color: subtitleColor,
                          height: 1.3,
                        ),
                      ),
                      const SizedBox(height: 12),
                      const Row(
                        children: [
                          Text(
                            "Book trainer",
                            style: TextStyle(
                              fontSize: 12,
                              fontWeight: FontWeight.bold,
                              color: AppTheme.secondaryColor,
                            ),
                          ),
                          SizedBox(width: 4),
                          Icon(
                            Icons.arrow_outward_rounded,
                            size: 14,
                            color: AppTheme.secondaryColor,
                          ),
                        ],
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(height: 14),

          // Two Quick Utility Pills
          Row(
            children: [
              Expanded(
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                  decoration: BoxDecoration(
                    color: cardColor,
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: borderColor),
                  ),
                  child: Row(
                    children: [
                      const Icon(Icons.bolt_rounded, size: 16, color: AppTheme.secondaryColor),
                      const SizedBox(width: 6),
                      Expanded(
                        child: Text(
                          "Instant Slot Booking",
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w600,
                            color: textColor,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
              const SizedBox(width: 10),
              Expanded(
                child: Container(
                  padding: const EdgeInsets.symmetric(horizontal: 12, vertical: 10),
                  decoration: BoxDecoration(
                    color: cardColor,
                    borderRadius: BorderRadius.circular(14),
                    border: Border.all(color: borderColor),
                  ),
                  child: Row(
                    children: [
                      Icon(Icons.verified_user_outlined, size: 16, color: isDark ? const Color(0xFF93C5FD) : AppTheme.primaryColor),
                      const SizedBox(width: 6),
                      Expanded(
                        child: Text(
                          "Refund Guarantee",
                          style: TextStyle(
                            fontSize: 11,
                            fontWeight: FontWeight.w600,
                            color: textColor,
                          ),
                          maxLines: 1,
                          overflow: TextOverflow.ellipsis,
                        ),
                      ),
                    ],
                  ),
                ),
              ),
            ],
          ),

          const SizedBox(height: 24),

          // Stylized Watermark Branding ("GYMEZY FOR FITNESS. FOR YOU")
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Text(
                "gymezy",
                style: TextStyle(
                  fontSize: 46,
                  fontWeight: FontWeight.w900,
                  letterSpacing: 2.0,
                  color: isDark
                      ? Colors.white.withOpacity(0.16)
                      : const Color(0xFF01327E).withOpacity(0.12),
                ),
              ),
              Text(
                "for fitness. for you",
                style: TextStyle(
                  fontSize: 14,
                  fontWeight: FontWeight.w800,
                  letterSpacing: 2.5,
                  color: isDark
                      ? Colors.white.withOpacity(0.12)
                      : const Color(0xFF01327E).withOpacity(0.10),
                ),
              ),
            ],
          ),
          const SizedBox(height: 10),
        ],
      ),
    );
  }

  // 1. Top Header with User Greeting & Location Pill
  Widget _buildHeaderBar(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Padding(
      padding: const EdgeInsets.fromLTRB(16.0, 14.0, 16.0, 0),
      child: Row(
        mainAxisAlignment: MainAxisAlignment.spaceBetween,
        children: [
          // Greeting & Discovery location
          Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              Row(
                children: [
                  Text(
                    "Hello Arjun",
                    style: TextStyle(
                      fontSize: 22,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.getTextColor(context),
                      letterSpacing: -0.3,
                    ),
                  ),
                  const Text(" 👋", style: TextStyle(fontSize: 20)),
                ],
              ),
              const SizedBox(height: 4),
              Row(
                mainAxisSize: MainAxisSize.min,
                children: [
                  const Icon(Icons.location_on_rounded, size: 14, color: AppTheme.secondaryColor),
                  const SizedBox(width: 4),
                  Text(
                    "Anna Nagar, Chennai",
                    style: TextStyle(
                      fontSize: 12,
                      fontWeight: FontWeight.w600,
                      color: AppTheme.getSubtitleColor(context),
                    ),
                  ),
                  const SizedBox(width: 2),
                  Icon(
                    Icons.keyboard_arrow_down_rounded,
                    size: 16,
                    color: AppTheme.getSubtitleColor(context),
                  ),
                ],
              ),
            ],
          ),

          // Notification Bell
          Stack(
            children: [
              Container(
                decoration: BoxDecoration(
                  color: isDark ? const Color(0xFF1E1E1E) : const Color(0xFFF8FAFC),
                  shape: BoxShape.circle,
                  border: Border.all(
                    color: isDark ? Colors.white10 : const Color(0xFFE2E8F0),
                  ),
                ),
                child: IconButton(
                  icon: Icon(
                    Icons.notifications_none_rounded,
                    color: AppTheme.getTextColor(context),
                    size: 24,
                  ),
                  onPressed: () {
                    CustomScaffoldMessage.show(
                      context,
                      message: "You have 3 unread workout reminders!",
                      isSuccess: true,
                    );
                  },
                ),
              ),
              Positioned(
                top: 8,
                right: 8,
                child: Container(
                  width: 10,
                  height: 10,
                  decoration: BoxDecoration(
                    color: Colors.redAccent,
                    shape: BoxShape.circle,
                    border: Border.all(
                      color: isDark ? const Color(0xFF1E1E1E) : Colors.white,
                      width: 2,
                    ),
                  ),
                ),
              )
            ],
          )
        ],
      ),
    );
  }

  // 2. Search & Filter Bar
  Widget _buildSearchAndFilterBar(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      child: Row(
        children: [
          // Search Field
          Expanded(
            child: Container(
              height: 52,
              decoration: BoxDecoration(
                color: isDark ? const Color(0xFF1E1E1E) : const Color(0xFFF8FAFC),
                borderRadius: BorderRadius.circular(16),
                border: Border.all(
                  color: isDark ? Colors.white10 : const Color(0xFFE2E8F0),
                ),
              ),
              child: TextField(
                controller: _searchController,
                style: TextStyle(
                  color: AppTheme.getTextColor(context),
                  fontSize: 14,
                ),
                decoration: InputDecoration(
                  hintText: "Search gyms, workouts, locations...",
                  hintStyle: TextStyle(
                    color: AppTheme.getSubtitleColor(context).withOpacity(0.7),
                    fontSize: 13,
                  ),
                  prefixIcon: Icon(
                    Icons.search_rounded,
                    color: isDark ? Colors.white70 : AppTheme.primaryColor,
                    size: 22,
                  ),
                  suffixIcon: _searchQuery.isNotEmpty
                      ? IconButton(
                          icon: const Icon(Icons.close_rounded, size: 18),
                          onPressed: () {
                            _searchController.clear();
                          },
                        )
                      : null,
                  border: InputBorder.none,
                  contentPadding: const EdgeInsets.symmetric(vertical: 16),
                ),
              ),
            ),
          ),
          const SizedBox(width: 10),

          // Filter Button
          GestureDetector(
            onTap: () => _showFilterBottomSheet(context),
            child: Container(
              width: 52,
              height: 52,
              decoration: BoxDecoration(
                gradient: const LinearGradient(
                  colors: [AppTheme.primaryColor, Color(0xFF1E40AF)],
                  begin: Alignment.topLeft,
                  end: Alignment.bottomRight,
                ),
                borderRadius: BorderRadius.circular(16),
              ),
              child: Stack(
                alignment: Alignment.center,
                children: [
                  const Icon(Icons.tune_rounded, color: Colors.white, size: 22),
                  if (_selectedType != null || _selectedFacility != null || _selectedWorkout != null)
                    Positioned(
                      top: 10,
                      right: 10,
                      child: Container(
                        width: 8,
                        height: 8,
                        decoration: const BoxDecoration(
                          color: AppTheme.secondaryColor,
                          shape: BoxShape.circle,
                        ),
                      ),
                    ),
                ],
              ),
            ),
          ),
        ],
      ),
    );
  }

  // 3. High-Impact Promotional Flash Banner
  Widget _buildPromoBanner(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      child: Container(
        height: 180,
        decoration: BoxDecoration(
          borderRadius: BorderRadius.circular(24),
        ),
        child: ClipRRect(
          borderRadius: BorderRadius.circular(24),
          child: Stack(
            fit: StackFit.expand,
            children: [
              // High-Res Image
              Image.network(
                "https://images.unsplash.com/photo-1540575467063-178a50c2df87?q=80&w=800&auto=format&fit=crop",
                fit: BoxFit.cover,
              ),

              // Gradient Scrim Overlay
              Container(
                decoration: BoxDecoration(
                  gradient: LinearGradient(
                    begin: Alignment.topCenter,
                    end: Alignment.bottomCenter,
                    colors: [
                      Colors.black.withOpacity(0.2),
                      Colors.black.withOpacity(0.85),
                    ],
                  ),
                ),
              ),

              // Content inside Banner
              Padding(
                padding: const EdgeInsets.all(18.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  mainAxisAlignment: MainAxisAlignment.spaceBetween,
                  children: [
                    // Top Row: Flash Badge & Countdown
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                          decoration: BoxDecoration(
                            color: AppTheme.secondaryColor,
                            borderRadius: BorderRadius.circular(20),
                          ),
                          child: const Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Icon(Icons.bolt_rounded, color: Colors.white, size: 14),
                              SizedBox(width: 3),
                              Text(
                                "30% OFF PASS",
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 11,
                                  fontWeight: FontWeight.w800,
                                ),
                              ),
                            ],
                          ),
                        ),

                        // Countdown Pill
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                          decoration: BoxDecoration(
                            color: Colors.black.withOpacity(0.55),
                            borderRadius: BorderRadius.circular(20),
                            border: Border.all(color: Colors.white24, width: 0.8),
                          ),
                          child: const Row(
                            children: [
                              Icon(Icons.timer_outlined, color: Colors.white70, size: 12),
                              SizedBox(width: 4),
                              Text(
                                "05d : 12h left",
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 11,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),

                    // Bottom Row: Headline & Action Button
                    Row(
                      crossAxisAlignment: CrossAxisAlignment.end,
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        const Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              "FitZone Luxury Gym",
                              style: TextStyle(
                                color: Colors.white,
                                fontSize: 18,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                            SizedBox(height: 3),
                            Text(
                              "Quarterly Membership Pass",
                              style: TextStyle(
                                color: Colors.white70,
                                fontSize: 12,
                              ),
                            ),
                          ],
                        ),

                        ElevatedButton(
                          onPressed: () {
                            Navigator.push(
                              context,
                              MaterialPageRoute(
                                builder: (context) => GymDetailsScreen(gym: _allGyms.first),
                              ),
                            );
                          },
                          style: ElevatedButton.styleFrom(
                            backgroundColor: Colors.white,
                            foregroundColor: AppTheme.primaryColor,
                            elevation: 0,
                            shape: RoundedRectangleBorder(
                              borderRadius: BorderRadius.circular(14),
                            ),
                            padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                          ),
                          child: const Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Text(
                                "Claim Offer",
                                style: TextStyle(
                                  fontSize: 12,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              SizedBox(width: 4),
                              Icon(Icons.arrow_forward_rounded, size: 14),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // 4. Curated Category Pills
  Widget _buildCategoryPills(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    return SingleChildScrollView(
      scrollDirection: Axis.horizontal,
      physics: const BouncingScrollPhysics(),
      padding: const EdgeInsets.symmetric(horizontal: 16.0),
      child: Row(
        children: _categories.map((cat) {
          final isSelected = _selectedCategory == cat['name'];
          return Padding(
            padding: const EdgeInsets.only(right: 8.0),
            child: GestureDetector(
              onTap: () {
                setState(() {
                  _selectedCategory = cat['name'] as String;
                });
                _applyFilters();
              },
              child: AnimatedContainer(
                duration: const Duration(milliseconds: 250),
                curve: Curves.easeInOut,
                padding: const EdgeInsets.symmetric(horizontal: 14, vertical: 10),
                decoration: BoxDecoration(
                  color: isSelected
                      ? AppTheme.primaryColor
                      : (isDark ? const Color(0xFF1E1E1E) : const Color(0xFFF1F5F9)),
                  borderRadius: BorderRadius.circular(18),
                  border: Border.all(
                    color: isSelected
                        ? Colors.transparent
                        : (isDark ? Colors.white10 : const Color(0xFFE2E8F0)),
                  ),
                ),
                child: Row(
                  children: [
                    Icon(
                      cat['icon'] as IconData,
                      size: 16,
                      color: isSelected
                          ? Colors.white
                          : (isDark ? Colors.white70 : AppTheme.primaryColor),
                    ),
                    const SizedBox(width: 6),
                    Text(
                      cat['name'] as String,
                      style: TextStyle(
                        fontSize: 13,
                        fontWeight: isSelected ? FontWeight.bold : FontWeight.w600,
                        color: isSelected
                            ? Colors.white
                            : (isDark ? Colors.white70 : AppTheme.getTextColor(context)),
                      ),
                    ),
                  ],
                ),
              ),
            ),
          );
        }).toList(),
      ),
    );
  }

  // 5. Spotlight Section (Top Rated Gyms Horizontal Carousel)
  Widget _buildSpotlightSection(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final topGyms = _allGyms.where((g) => g.rating >= 4.7).toList();

    return Column(
      crossAxisAlignment: CrossAxisAlignment.start,
      children: [
        Padding(
          padding: const EdgeInsets.symmetric(horizontal: 16.0),
          child: Row(
            mainAxisAlignment: MainAxisAlignment.spaceBetween,
            children: [
              Row(
                children: [
                  const Icon(Icons.star_rounded, color: Colors.amber, size: 22),
                  const SizedBox(width: 6),
                  Text(
                    "Top Rated Near You",
                    style: TextStyle(
                      fontSize: 18,
                      fontWeight: FontWeight.bold,
                      color: AppTheme.getTextColor(context),
                    ),
                  ),
                ],
              ),
              Text(
                "See all",
                style: TextStyle(
                  fontSize: 13,
                  fontWeight: FontWeight.bold,
                  color: AppTheme.secondaryColor,
                ),
              ),
            ],
          ),
        ),
        const SizedBox(height: 12),
        SizedBox(
          height: 220,
          child: ListView.builder(
            scrollDirection: Axis.horizontal,
            physics: const BouncingScrollPhysics(),
            padding: const EdgeInsets.symmetric(horizontal: 16.0),
            itemCount: topGyms.length,
            itemBuilder: (context, index) {
              final gym = topGyms[index];
              final isBookmarked = _bookmarkedGymNames.contains(gym.name);

              return GestureDetector(
                onTap: () {
                  Navigator.push(
                    context,
                    MaterialPageRoute(
                      builder: (context) => GymDetailsScreen(gym: gym),
                    ),
                  );
                },
                child: Container(
                  width: 250,
                  margin: const EdgeInsets.only(right: 14),
                  decoration: BoxDecoration(
                    color: isDark ? const Color(0xFF1E1E1E) : Colors.white,
                    borderRadius: BorderRadius.circular(20),
                    border: Border.all(
                      color: isDark ? Colors.white10 : const Color(0xFFE2E8F0),
                    ),
                  ),
                  child: Column(
                    crossAxisAlignment: CrossAxisAlignment.start,
                    children: [
                      // Top Image with Rating & Bookmark
                      Stack(
                        children: [
                          ClipRRect(
                            borderRadius: const BorderRadius.vertical(top: Radius.circular(20)),
                            child: Image.network(
                              gym.imageUrl,
                              height: 120,
                              width: 250,
                              fit: BoxFit.cover,
                            ),
                          ),
                          // Rating Badge
                          Positioned(
                            top: 8,
                            left: 8,
                            child: Container(
                              padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 4),
                              decoration: BoxDecoration(
                                color: Colors.black.withOpacity(0.65),
                                borderRadius: BorderRadius.circular(12),
                              ),
                              child: Row(
                                children: [
                                  const Icon(Icons.star_rounded, color: Colors.amber, size: 14),
                                  const SizedBox(width: 3),
                                  Text(
                                    gym.rating.toString(),
                                    style: const TextStyle(
                                      color: Colors.white,
                                      fontSize: 11,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ),
                          // Bookmark Button
                          Positioned(
                            top: 8,
                            right: 8,
                            child: GestureDetector(
                              onTap: () => _toggleBookmark(gym.name),
                              child: Container(
                                padding: const EdgeInsets.all(6),
                                decoration: BoxDecoration(
                                  color: Colors.black.withOpacity(0.55),
                                  shape: BoxShape.circle,
                                ),
                                child: Icon(
                                  isBookmarked ? Icons.bookmark_rounded : Icons.bookmark_border_rounded,
                                  color: isBookmarked ? AppTheme.secondaryColor : Colors.white,
                                  size: 16,
                                ),
                              ),
                            ),
                          ),
                        ],
                      ),

                      // Card Details
                      Padding(
                        padding: const EdgeInsets.all(12.0),
                        child: Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              gym.name,
                              style: TextStyle(
                                fontSize: 15,
                                fontWeight: FontWeight.bold,
                                color: AppTheme.getTextColor(context),
                              ),
                              maxLines: 1,
                              overflow: TextOverflow.ellipsis,
                            ),
                            const SizedBox(height: 4),
                            Row(
                              children: [
                                Icon(
                                  Icons.location_on_outlined,
                                  size: 13,
                                  color: AppTheme.getSubtitleColor(context),
                                ),
                                const SizedBox(width: 2),
                                Expanded(
                                  child: Text(
                                    "${gym.location} • ${gym.distance} km",
                                    style: TextStyle(
                                      fontSize: 11,
                                      color: AppTheme.getSubtitleColor(context),
                                    ),
                                    maxLines: 1,
                                    overflow: TextOverflow.ellipsis,
                                  ),
                                ),
                              ],
                            ),
                            const SizedBox(height: 8),
                            Row(
                              mainAxisAlignment: MainAxisAlignment.spaceBetween,
                              children: [
                                RichText(
                                  text: TextSpan(
                                    children: [
                                      TextSpan(
                                        text: "₹${gym.pricePerSession.toInt()}",
                                        style: TextStyle(
                                          color: AppTheme.getTextColor(context),
                                          fontSize: 14,
                                          fontWeight: FontWeight.bold,
                                        ),
                                      ),
                                      TextSpan(
                                        text: " /session",
                                        style: TextStyle(
                                          color: AppTheme.getSubtitleColor(context),
                                          fontSize: 10,
                                        ),
                                      ),
                                    ],
                                  ),
                                ),
                                Container(
                                  padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                                  decoration: BoxDecoration(
                                    color: AppTheme.primaryColor.withOpacity(0.08),
                                    borderRadius: BorderRadius.circular(8),
                                  ),
                                  child: const Text(
                                    "Book Slot",
                                    style: TextStyle(
                                      color: AppTheme.primaryColor,
                                      fontSize: 10,
                                      fontWeight: FontWeight.bold,
                                    ),
                                  ),
                                ),
                              ],
                            ),
                          ],
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
  }

  // 6. Modern Vertical Gym Card
  Widget _buildModernGymCard(BuildContext context, Gym gym) {
    final isDark = Theme.of(context).brightness == Brightness.dark;
    final isBookmarked = _bookmarkedGymNames.contains(gym.name);

    return Container(
      margin: const EdgeInsets.only(bottom: 16),
      decoration: BoxDecoration(
        color: isDark ? const Color(0xFF1E1E1E) : Colors.white,
        borderRadius: BorderRadius.circular(22),
        border: Border.all(
          color: isDark ? Colors.white10 : const Color(0xFFE2E8F0),
        ),
      ),
      child: Material(
        color: Colors.transparent,
        child: InkWell(
          borderRadius: BorderRadius.circular(22),
          onTap: () {
            Navigator.push(
              context,
              MaterialPageRoute(
                builder: (context) => GymDetailsScreen(gym: gym),
              ),
            );
          },
          child: Column(
            crossAxisAlignment: CrossAxisAlignment.start,
            children: [
              // Gym Hero Image with Badges
              Stack(
                children: [
                  ClipRRect(
                    borderRadius: const BorderRadius.vertical(top: Radius.circular(22)),
                    child: Image.network(
                      gym.imageUrl,
                      height: 160,
                      width: double.infinity,
                      fit: BoxFit.cover,
                    ),
                  ),

                  // Gradient Scrim at bottom of image
                  Positioned(
                    bottom: 0,
                    left: 0,
                    right: 0,
                    height: 50,
                    child: Container(
                      decoration: BoxDecoration(
                        gradient: LinearGradient(
                          begin: Alignment.bottomCenter,
                          end: Alignment.topCenter,
                          colors: [
                            Colors.black.withOpacity(0.6),
                            Colors.transparent,
                          ],
                        ),
                      ),
                    ),
                  ),

                  // Badge on top-left (e.g. Popular or Flash)
                  if (gym.badgeText != null)
                    Positioned(
                      top: 12,
                      left: 12,
                      child: Container(
                        padding: const EdgeInsets.symmetric(horizontal: 10, vertical: 5),
                        decoration: BoxDecoration(
                          color: AppTheme.secondaryColor,
                          borderRadius: BorderRadius.circular(12),
                        ),
                        child: Row(
                          mainAxisSize: MainAxisSize.min,
                          children: [
                            const Icon(Icons.local_fire_department_rounded, color: Colors.white, size: 13),
                            const SizedBox(width: 3),
                            Text(
                              gym.badgeText!,
                              style: const TextStyle(
                                color: Colors.white,
                                fontSize: 10,
                                fontWeight: FontWeight.bold,
                              ),
                            ),
                          ],
                        ),
                      ),
                    ),

                  // Bookmark on top-right
                  Positioned(
                    top: 12,
                    right: 12,
                    child: GestureDetector(
                      onTap: () => _toggleBookmark(gym.name),
                      child: Container(
                        padding: const EdgeInsets.all(8),
                        decoration: BoxDecoration(
                          color: Colors.black.withOpacity(0.5),
                          shape: BoxShape.circle,
                        ),
                        child: Icon(
                          isBookmarked ? Icons.bookmark_rounded : Icons.bookmark_border_rounded,
                          color: isBookmarked ? AppTheme.secondaryColor : Colors.white,
                          size: 18,
                        ),
                      ),
                    ),
                  ),

                  // Rating and Distance over Image Bottom
                  Positioned(
                    bottom: 10,
                    left: 12,
                    right: 12,
                    child: Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        // Rating
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: Colors.black.withOpacity(0.6),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Row(
                            children: [
                              const Icon(Icons.star_rounded, color: Colors.amber, size: 14),
                              const SizedBox(width: 3),
                              Text(
                                "${gym.rating} (${gym.reviewsCount})",
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 11,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                            ],
                          ),
                        ),

                        // Distance
                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                          decoration: BoxDecoration(
                            color: Colors.black.withOpacity(0.6),
                            borderRadius: BorderRadius.circular(8),
                          ),
                          child: Row(
                            children: [
                              const Icon(Icons.near_me_rounded, color: Colors.white70, size: 12),
                              const SizedBox(width: 3),
                              Text(
                                "${gym.distance} km",
                                style: const TextStyle(
                                  color: Colors.white,
                                  fontSize: 11,
                                  fontWeight: FontWeight.w600,
                                ),
                              ),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ),
                ],
              ),

              // Card Body
              Padding(
                padding: const EdgeInsets.all(14.0),
                child: Column(
                  crossAxisAlignment: CrossAxisAlignment.start,
                  children: [
                    // Gym Name + Verified
                    Row(
                      children: [
                        Expanded(
                          child: Text(
                            gym.name,
                            style: TextStyle(
                              fontSize: 17,
                              fontWeight: FontWeight.bold,
                              color: AppTheme.getTextColor(context),
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                        const Icon(
                          Icons.verified_rounded,
                          color: AppTheme.secondaryColor,
                          size: 16,
                        ),
                      ],
                    ),

                    const SizedBox(height: 4),

                    // Location address
                    Row(
                      children: [
                        Icon(
                          Icons.location_on_outlined,
                          size: 14,
                          color: AppTheme.getSubtitleColor(context),
                        ),
                        const SizedBox(width: 3),
                        Expanded(
                          child: Text(
                            gym.location,
                            style: TextStyle(
                              fontSize: 12,
                              color: AppTheme.getSubtitleColor(context),
                            ),
                            maxLines: 1,
                            overflow: TextOverflow.ellipsis,
                          ),
                        ),
                      ],
                    ),

                    const SizedBox(height: 10),

                    // Tags List
                    SingleChildScrollView(
                      scrollDirection: Axis.horizontal,
                      physics: const BouncingScrollPhysics(),
                      child: Row(
                        children: gym.tags.map((tag) {
                          return Container(
                            margin: const EdgeInsets.only(right: 6),
                            padding: const EdgeInsets.symmetric(horizontal: 8, vertical: 3),
                            decoration: BoxDecoration(
                              color: isDark
                                  ? const Color(0xFF262626)
                                  : const Color(0xFFF1F5F9),
                              borderRadius: BorderRadius.circular(6),
                            ),
                            child: Text(
                              tag,
                              style: TextStyle(
                                fontSize: 10,
                                fontWeight: FontWeight.w600,
                                color: isDark ? Colors.white70 : AppTheme.primaryColor,
                              ),
                            ),
                          );
                        }).toList(),
                      ),
                    ),

                    const SizedBox(height: 14),

                    // Divider line
                    Divider(
                      height: 1,
                      color: isDark ? Colors.white10 : const Color(0xFFF1F5F9),
                    ),

                    const SizedBox(height: 12),

                    // Price & CTA Row
                    Row(
                      mainAxisAlignment: MainAxisAlignment.spaceBetween,
                      children: [
                        Column(
                          crossAxisAlignment: CrossAxisAlignment.start,
                          children: [
                            Text(
                              "Starts from",
                              style: TextStyle(
                                fontSize: 10,
                                color: AppTheme.getSubtitleColor(context),
                              ),
                            ),
                            RichText(
                              text: TextSpan(
                                children: [
                                  TextSpan(
                                    text: "₹${gym.pricePerSession.toInt()}",
                                    style: TextStyle(
                                      color: AppTheme.getTextColor(context),
                                      fontWeight: FontWeight.bold,
                                      fontSize: 18,
                                    ),
                                  ),
                                  TextSpan(
                                    text: " /session",
                                    style: TextStyle(
                                      color: AppTheme.getSubtitleColor(context),
                                      fontSize: 11,
                                    ),
                                  ),
                                ],
                              ),
                            ),
                          ],
                        ),

                        Container(
                          padding: const EdgeInsets.symmetric(horizontal: 16, vertical: 9),
                          decoration: BoxDecoration(
                            gradient: const LinearGradient(
                              colors: [AppTheme.secondaryColor, Color(0xFF00D972)],
                              begin: Alignment.centerLeft,
                              end: Alignment.centerRight,
                            ),
                            borderRadius: BorderRadius.circular(14),
                          ),
                          child: const Row(
                            mainAxisSize: MainAxisSize.min,
                            children: [
                              Text(
                                "Explore Gym",
                                style: TextStyle(
                                  color: Colors.white,
                                  fontSize: 12,
                                  fontWeight: FontWeight.bold,
                                ),
                              ),
                              SizedBox(width: 4),
                              Icon(Icons.arrow_forward_rounded, color: Colors.white, size: 14),
                            ],
                          ),
                        ),
                      ],
                    ),
                  ],
                ),
              ),
            ],
          ),
        ),
      ),
    );
  }

  // 7. Empty State
  Widget _buildEmptyState(BuildContext context) {
    return Padding(
      padding: const EdgeInsets.all(40.0),
      child: Column(
        children: [
          const Icon(
            Icons.search_off_rounded,
            size: 64,
            color: Colors.grey,
          ),
          const SizedBox(height: 16),
          Text(
            "No Gyms Found",
            style: TextStyle(
              fontSize: 18,
              fontWeight: FontWeight.bold,
              color: AppTheme.getTextColor(context),
            ),
          ),
          const SizedBox(height: 6),
          Text(
            "Try searching with another keyword or resetting your filters.",
            textAlign: TextAlign.center,
            style: TextStyle(
              fontSize: 13,
              color: AppTheme.getSubtitleColor(context),
            ),
          ),
          const SizedBox(height: 20),
          ElevatedButton(
            onPressed: _clearAllFilters,
            style: ElevatedButton.styleFrom(
              backgroundColor: AppTheme.primaryColor,
              elevation: 0,
              shape: RoundedRectangleBorder(borderRadius: BorderRadius.circular(12)),
            ),
            child: const Text("Reset Filters", style: TextStyle(color: Colors.white)),
          )
        ],
      ),
    );
  }

  // Filter Bottom Sheet Trigger
  void _showFilterBottomSheet(BuildContext context) {
    final isDark = Theme.of(context).brightness == Brightness.dark;

    showModalBottomSheet(
      context: context,
      backgroundColor: isDark ? const Color(0xFF1E1E1E) : Colors.white,
      shape: const RoundedRectangleBorder(
        borderRadius: BorderRadius.vertical(top: Radius.circular(24)),
      ),
      builder: (context) {
        return StatefulBuilder(
          builder: (context, setModalState) {
            return Padding(
              padding: const EdgeInsets.all(20.0),
              child: Column(
                mainAxisSize: MainAxisSize.min,
                crossAxisAlignment: CrossAxisAlignment.stretch,
                children: [
                  Row(
                    mainAxisAlignment: MainAxisAlignment.spaceBetween,
                    children: [
                      Text(
                        "Filter Gyms",
                        style: TextStyle(
                          fontSize: 18,
                          fontWeight: FontWeight.bold,
                          color: AppTheme.getTextColor(context),
                        ),
                      ),
                      IconButton(
                        icon: const Icon(Icons.close_rounded),
                        onPressed: () => Navigator.pop(context),
                      )
                    ],
                  ),
                  const SizedBox(height: 12),

                  // Gym Type Filter
                  const Text("Gym Type", style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  Wrap(
                    spacing: 8,
                    children: ["Women Only", "Unisex", "Men Only"].map((t) {
                      final selected = _selectedType == t;
                      return ChoiceChip(
                        label: Text(t),
                        selected: selected,
                        onSelected: (val) {
                          setModalState(() => _selectedType = val ? t : null);
                          setState(() => _selectedType = val ? t : null);
                          _applyFilters();
                        },
                      );
                    }).toList(),
                  ),

                  const SizedBox(height: 16),

                  // Facility Filter
                  const Text("Facility", style: TextStyle(fontSize: 14, fontWeight: FontWeight.bold)),
                  const SizedBox(height: 8),
                  Wrap(
                    spacing: 8,
                    children: ["AC", "Parking", "Shower", "Locker Room"].map((f) {
                      final selected = _selectedFacility == f;
                      return ChoiceChip(
                        label: Text(f),
                        selected: selected,
                        onSelected: (val) {
                          setModalState(() => _selectedFacility = val ? f : null);
                          setState(() => _selectedFacility = val ? f : null);
                          _applyFilters();
                        },
                      );
                    }).toList(),
                  ),

                  const SizedBox(height: 24),

                  Row(
                    children: [
                      Expanded(
                        child: OutlinedButton(
                          onPressed: () {
                            setModalState(() {
                              _selectedType = null;
                              _selectedFacility = null;
                              _selectedWorkout = null;
                            });
                            _clearAllFilters();
                            Navigator.pop(context);
                          },
                          child: const Text("Reset All"),
                        ),
                      ),
                      const SizedBox(width: 12),
                      Expanded(
                        child: ElevatedButton(
                          style: ElevatedButton.styleFrom(
                            backgroundColor: AppTheme.primaryColor,
                            elevation: 0,
                          ),
                          onPressed: () => Navigator.pop(context),
                          child: const Text("Apply", style: TextStyle(color: Colors.white)),
                        ),
                      ),
                    ],
                  )
                ],
              ),
            );
          },
        );
      },
    );
  }
}
