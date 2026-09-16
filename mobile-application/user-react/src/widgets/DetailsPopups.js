import React from 'react';
import {
  View,
  Text,
  Modal,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Image,
  Dimensions,
  Platform,
} from 'react-native';
import { MaterialIcons, Ionicons, MaterialCommunityIcons } from '@expo/vector-icons';
import { useTheme } from '../theme/ThemeContext';
import { AppColors } from '../theme/appTheme';

const SCREEN_HEIGHT = Dimensions.get('window').height;

// Base modal wrapper
const BasePopupModal = ({ visible, onClose, title, children, showBack = false, onBack }) => {
  const { colors, isDark } = useTheme();

  return (
    <Modal visible={visible} transparent animationType="slide" onRequestClose={onClose}>
      <View style={styles.modalOverlay}>
        <View
          style={[
            styles.modalContent,
            { backgroundColor: colors.background, height: SCREEN_HEIGHT * 0.85 },
          ]}
        >
          {/* Header */}
          <View style={styles.headerRow}>
            <View style={styles.headerLeft}>
              {showBack && (
                <TouchableOpacity onPress={onBack} style={styles.backBtn}>
                  <MaterialIcons name="arrow-back" size={24} color={colors.text} />
                </TouchableOpacity>
              )}
              <Text style={[styles.headerTitle, { color: colors.text }]}>{title}</Text>
            </View>
            <TouchableOpacity onPress={onClose} style={styles.closeBtn}>
              <MaterialIcons name="close" size={24} color={colors.text} />
            </TouchableOpacity>
          </View>

          {/* Scrollable Body */}
          <View style={styles.bodyWrapper}>{children}</View>

          {/* Bottom Persistent Close Button */}
          <View style={styles.bottomBtnWrapper}>
            <TouchableOpacity
              onPress={onClose}
              style={[
                styles.persistentCloseBtn,
                { borderColor: isDark ? AppColors.darkAccentColor : AppColors.accentColor },
              ]}
            >
              <Text
                style={[
                  styles.persistentCloseBtnText,
                  { color: isDark ? AppColors.darkAccentColor : AppColors.accentColor },
                ]}
              >
                Close
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );
};

// 1. Facilities Popup
export const FacilitiesPopup = ({ visible, onClose, facilities = [] }) => {
  const { colors, isDark } = useTheme();

  const descMap = {
    'AC Gym': 'Fully air-conditioned workout area',
    'Locker Facility': 'Secure lockers for your belongings',
    'Shower Available': 'Clean showers available',
    'Changing Room': 'Spacious and clean changing rooms',
    'Free Wi-Fi': 'High-speed internet for members',
    'Music System': 'Premium sound system',
  };

  const iconMap = {
    'AC Gym': 'ac-unit',
    'Locker Facility': 'lock-outline',
    'Shower Available': 'shower',
    'Changing Room': 'checkroom',
    'Free Wi-Fi': 'wifi',
    'Music System': 'music-note',
  };

  return (
    <BasePopupModal visible={visible} onClose={onClose} title="All Facilities">
      <ScrollView contentContainerStyle={styles.gridContainer}>
        {facilities.map((item, idx) => (
          <View
            key={idx}
            style={[
              styles.featureCard,
              {
                backgroundColor: colors.card,
                borderColor: isDark ? 'rgba(255,255,255,0.1)' : colors.border,
              },
            ]}
          >
            <MaterialIcons
              name={iconMap[item] || 'help-outline'}
              size={28}
              color={AppColors.accentColor}
            />
            <Text style={[styles.cardTitle, { color: colors.text }]}>{item}</Text>
            <Text style={[styles.cardDesc, { color: colors.subtitle }]} numberOfLines={2}>
              {descMap[item] || 'Available feature'}
            </Text>
          </View>
        ))}
      </ScrollView>
    </BasePopupModal>
  );
};

// 2. Amenities Popup
export const AmenitiesPopup = ({ visible, onClose, amenities = [] }) => {
  const { colors, isDark } = useTheme();

  const descMap = {
    'Drinking Water': 'RO purified drinking water',
    'Towel Service': 'Clean towels provided',
    'Parking Available': 'Safe vehicle parking',
    'Air Conditioned': 'Comfortable AC environment',
    'Protein Bar': 'Healthy protein snacks & drinks',
    'Juice Bar': 'Fresh juices and shakes',
    'First Aid Kit': 'First aid kit available',
    'Weighing Machine': 'Body weight monitoring',
  };

  const iconMap = {
    'Drinking Water': 'water-drop',
    'Towel Service': 'dry-cleaning',
    'Parking Available': 'local-parking',
    'Air Conditioned': 'ac-unit',
    'Protein Bar': 'restaurant-menu',
    'Juice Bar': 'local-cafe',
    'First Aid Kit': 'medical-services',
    'Weighing Machine': 'monitor-weight',
  };

  return (
    <BasePopupModal visible={visible} onClose={onClose} title="All Amenities">
      <ScrollView contentContainerStyle={styles.gridContainer}>
        {amenities.map((item, idx) => (
          <View
            key={idx}
            style={[
              styles.featureCard,
              {
                backgroundColor: colors.card,
                borderColor: isDark ? 'rgba(255,255,255,0.1)' : colors.border,
              },
            ]}
          >
            <MaterialIcons
              name={iconMap[item] || 'help-outline'}
              size={28}
              color={AppColors.accentColor}
            />
            <Text style={[styles.cardTitle, { color: colors.text }]}>{item}</Text>
            <Text style={[styles.cardDesc, { color: colors.subtitle }]} numberOfLines={2}>
              {descMap[item] || 'Available feature'}
            </Text>
          </View>
        ))}
      </ScrollView>
    </BasePopupModal>
  );
};

// 3. Workouts Popup
export const WorkoutsPopup = ({ visible, onClose, workouts = [] }) => {
  const { colors, isDark } = useTheme();

  const descMap = {
    'GYM': 'Strength & conditioning workouts',
    'Yoga': 'Improve flexibility, strength & balance',
    'Zumba': 'Fun dance workout for all',
    'HIIT': 'High intensity interval training',
    'CrossFit': 'Functional training for all fitness levels',
    'Dance': 'Various dance workout styles',
    'Pilates': 'Core strength & posture',
    'Boxing': 'Cardio & strength boxing training',
    'Functional Training': 'Full body functional exercises',
    'Core Training': 'Focus on core strength',
  };

  const iconMap = {
    'GYM': 'fitness-center',
    'Yoga': 'self-improvement',
    'Zumba': 'sports-gymnastics',
    'HIIT': 'directions-run',
    'CrossFit': 'fitness-center',
    'Dance': 'music-note',
    'Pilates': 'accessibility',
    'Boxing': 'sports-mma',
    'Functional Training': 'sports-kabaddi',
    'Core Training': 'center-focus-strong',
  };

  return (
    <BasePopupModal visible={visible} onClose={onClose} title="All Workouts Offered">
      <ScrollView contentContainerStyle={styles.gridContainer}>
        {workouts.map((item, idx) => (
          <View
            key={idx}
            style={[
              styles.featureCard,
              {
                backgroundColor: colors.card,
                borderColor: isDark ? 'rgba(255,255,255,0.1)' : colors.border,
              },
            ]}
          >
            <MaterialIcons
              name={iconMap[item] || 'help-outline'}
              size={28}
              color={AppColors.accentColor}
            />
            <Text style={[styles.cardTitle, { color: colors.text }]}>{item}</Text>
            <Text style={[styles.cardDesc, { color: colors.subtitle }]} numberOfLines={2}>
              {descMap[item] || 'Training course'}
            </Text>
          </View>
        ))}
      </ScrollView>
    </BasePopupModal>
  );
};

// 4. Trainers Popup
export const TrainersPopup = ({ visible, onClose, trainers = [], onTrainerTap }) => {
  const { colors, isDark } = useTheme();

  return (
    <BasePopupModal visible={visible} onClose={onClose} title="All Trainers">
      <ScrollView contentContainerStyle={styles.listContainer}>
        {trainers.map((trainer, idx) => (
          <TouchableOpacity
            key={idx}
            onPress={() => onTrainerTap(trainer)}
            style={[
              styles.trainerCard,
              {
                backgroundColor: colors.card,
                borderColor: isDark ? 'rgba(255,255,255,0.1)' : colors.border,
              },
            ]}
          >
            <Image source={{ uri: trainer.imageUrl }} style={styles.trainerAvatar} />
            <View style={styles.trainerInfo}>
              <Text style={[styles.trainerName, { color: colors.text }]}>{trainer.name}</Text>
              <View style={styles.trainerMetaRow}>
                <Text style={[styles.trainerExp, { color: colors.subtitle }]}>
                  {trainer.experienceYears} Yrs Exp.
                </Text>
                <Text style={[styles.dotSep, { color: colors.subtitle }]}>•</Text>
                <View style={styles.specialtyBadge}>
                  <Text style={styles.specialtyText}>{trainer.specialty}</Text>
                </View>
              </View>
              <View style={styles.ratingRow}>
                <MaterialIcons name="star" size={14} color="#F59E0B" />
                <Text style={[styles.ratingVal, { color: colors.text }]}>
                  {trainer.rating} ({trainer.reviewsCount})
                </Text>
              </View>
            </View>
            <MaterialIcons name="chevron-right" size={24} color={AppColors.accentColor} />
          </TouchableOpacity>
        ))}
      </ScrollView>
    </BasePopupModal>
  );
};

// 5. Trainer Reviews Popup
export const TrainerReviewsPopup = ({ visible, onClose, trainer, reviews = [], onBack }) => {
  const { colors, isDark } = useTheme();
  if (!trainer) return null;

  return (
    <BasePopupModal
      visible={visible}
      onClose={onClose}
      title="All Trainer Reviews"
      showBack={true}
      onBack={onBack}
    >
      <ScrollView contentContainerStyle={styles.listContainer}>
        {/* Trainer Header Card */}
        <View
          style={[
            styles.trainerDetailCard,
            {
              backgroundColor: colors.card,
              borderColor: isDark ? 'rgba(255,255,255,0.1)' : colors.border,
            },
          ]}
        >
          <Image source={{ uri: trainer.imageUrl }} style={styles.largeTrainerAvatar} />
          <View style={styles.largeTrainerInfo}>
            <Text style={[styles.largeTrainerName, { color: colors.text }]}>{trainer.name}</Text>
            <Text style={[styles.trainerSpecText, { color: colors.subtitle }]}>
              {trainer.specialty} Specialist
            </Text>
            <Text style={[styles.trainerExpText, { color: colors.subtitle }]}>
              {trainer.experienceYears} Years Experience
            </Text>
            <View style={styles.ratingRow}>
              <MaterialIcons name="star" size={14} color="#F59E0B" />
              <Text style={[styles.ratingVal, { color: colors.text }]}>
                {trainer.rating} ({trainer.reviewsCount} Reviews)
              </Text>
            </View>
          </View>
        </View>

        {/* Reviews List */}
        {reviews.map((rev, idx) => (
          <View
            key={idx}
            style={[
              styles.reviewItemCard,
              {
                backgroundColor: colors.card,
                borderColor: isDark ? 'rgba(255,255,255,0.1)' : colors.border,
              },
            ]}
          >
            <View style={styles.revHeaderRow}>
              <View style={styles.revUserRow}>
                <Image source={{ uri: rev.userImageUrl }} style={styles.revUserAvatar} />
                <View style={styles.revUserNameCol}>
                  <Text style={[styles.revUserName, { color: colors.text }]}>
                    {rev.userName}
                  </Text>
                  <View style={styles.starsRow}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <MaterialIcons
                        key={i}
                        name={i < Math.floor(rev.rating) ? 'star' : 'star-border'}
                        size={10}
                        color="#F59E0B"
                      />
                    ))}
                  </View>
                </View>
              </View>

              <View style={styles.revTypeCol}>
                <View style={styles.bookingTypeBadge}>
                  <Text style={styles.bookingTypeText}>{rev.bookingType}</Text>
                </View>
                <Text style={[styles.revDate, { color: colors.subtitle }]}>{rev.date}</Text>
              </View>
            </View>

            <Text style={[styles.revComment, { color: colors.text }]}>{rev.comment}</Text>
          </View>
        ))}
      </ScrollView>
    </BasePopupModal>
  );
};

// 6. All Reviews Popup with Score Histogram
export const AllReviewsPopup = ({ visible, onClose, rating = 4.5, reviewsCount = 256, reviews = [] }) => {
  const { colors, isDark } = useTheme();

  const histograms = [
    { stars: 5, ratio: 0.70, percent: '70%' },
    { stars: 4, ratio: 0.20, percent: '20%' },
    { stars: 3, ratio: 0.06, percent: '6%' },
    { stars: 2, ratio: 0.02, percent: '2%' },
    { stars: 1, ratio: 0.02, percent: '2%' },
  ];

  return (
    <BasePopupModal visible={visible} onClose={onClose} title="All Reviews">
      <ScrollView contentContainerStyle={styles.listContainer}>
        {/* Score Summary Dashboard */}
        <View style={styles.scoreRow}>
          <View style={styles.scoreNumberCol}>
            <Text style={[styles.scoreBigNum, { color: colors.text }]}>{rating}</Text>
            <View style={styles.starsRow}>
              {Array.from({ length: 5 }).map((_, i) => (
                <MaterialIcons
                  key={i}
                  name={i < Math.floor(rating) ? 'star' : 'star-border'}
                  size={16}
                  color="#F59E0B"
                />
              ))}
            </View>
            <Text style={[styles.reviewsCountText, { color: colors.subtitle }]}>
              ({reviewsCount} Reviews)
            </Text>
          </View>

          {/* Histograms */}
          <View style={styles.histogramsCol}>
            {histograms.map((h) => (
              <View key={h.stars} style={styles.histoRow}>
                <Text style={[styles.histoStarNum, { color: colors.text }]}>{h.stars}</Text>
                <MaterialIcons name="star" size={10} color="#F59E0B" style={{ marginLeft: 2 }} />
                <View
                  style={[
                    styles.histoBarBg,
                    { backgroundColor: isDark ? '#262626' : '#E2E8F0' },
                  ]}
                >
                  <View
                    style={[
                      styles.histoBarFill,
                      {
                        width: `${h.ratio * 100}%`,
                        backgroundColor: AppColors.accentColor,
                      },
                    ]}
                  />
                </View>
                <Text style={[styles.histoPercent, { color: colors.subtitle }]}>
                  {h.percent}
                </Text>
              </View>
            ))}
          </View>
        </View>

        {/* List of Reviews */}
        {reviews.map((rev, idx) => (
          <View
            key={idx}
            style={[
              styles.reviewItemCard,
              {
                backgroundColor: colors.card,
                borderColor: isDark ? 'rgba(255,255,255,0.1)' : colors.border,
              },
            ]}
          >
            <View style={styles.revHeaderRow}>
              <View style={styles.revUserRow}>
                <Image source={{ uri: rev.userImageUrl }} style={styles.revUserAvatar} />
                <View style={styles.revUserNameCol}>
                  <Text style={[styles.revUserName, { color: colors.text }]}>
                    {rev.userName}
                  </Text>
                  <View style={styles.starsRow}>
                    {Array.from({ length: 5 }).map((_, i) => (
                      <MaterialIcons
                        key={i}
                        name={i < Math.floor(rev.rating) ? 'star' : 'star-border'}
                        size={10}
                        color="#F59E0B"
                      />
                    ))}
                  </View>
                </View>
              </View>

              <View style={styles.revTypeCol}>
                <View style={styles.bookingTypeBadge}>
                  <Text style={styles.bookingTypeText}>{rev.bookingType}</Text>
                </View>
                <Text style={[styles.revDate, { color: colors.subtitle }]}>{rev.date}</Text>
              </View>
            </View>

            <Text style={[styles.revComment, { color: colors.text }]}>{rev.comment}</Text>
          </View>
        ))}
      </ScrollView>
    </BasePopupModal>
  );
};

// 7. Rules Popup
export const RulesPopup = ({ visible, onClose, rules = [] }) => {
  const { colors } = useTheme();

  return (
    <BasePopupModal visible={visible} onClose={onClose} title="Rules & Regulations">
      <ScrollView contentContainerStyle={styles.listContainer}>
        {rules.map((rule, idx) => (
          <View key={idx} style={styles.ruleRow}>
            <MaterialIcons
              name="check-circle-outline"
              size={20}
              color={AppColors.accentColor}
              style={{ marginRight: 10, marginTop: 2 }}
            />
            <Text style={[styles.ruleText, { color: colors.text }]}>{rule}</Text>
          </View>
        ))}
      </ScrollView>
    </BasePopupModal>
  );
};

// 8. Safety Popup
export const SafetyPopup = ({ visible, onClose, safety = [] }) => {
  const { colors } = useTheme();

  return (
    <BasePopupModal visible={visible} onClose={onClose} title="Safety Measures">
      <ScrollView contentContainerStyle={styles.listContainer}>
        {safety.map((item, idx) => (
          <View key={idx} style={styles.ruleRow}>
            <MaterialIcons
              name="verified-user"
              size={20}
              color={AppColors.secondaryColor}
              style={{ marginRight: 10, marginTop: 2 }}
            />
            <Text style={[styles.ruleText, { color: colors.text }]}>{item}</Text>
          </View>
        ))}
      </ScrollView>
    </BasePopupModal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0,0,0,0.5)',
    justifyContent: 'flex-end',
  },
  modalContent: {
    borderTopLeftRadius: 25,
    borderTopRightRadius: 25,
    overflow: 'hidden',
  },
  headerRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingTop: 16,
    paddingBottom: 8,
  },
  headerLeft: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  backBtn: {
    marginRight: 10,
  },
  headerTitle: {
    fontSize: 19,
    fontWeight: '700',
  },
  closeBtn: {
    padding: 4,
  },
  bodyWrapper: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 10,
  },
  gridContainer: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    justifyContent: 'space-between',
    paddingBottom: 20,
  },
  featureCard: {
    width: '48%',
    aspectRatio: 1,
    borderRadius: 15,
    borderWidth: 1,
    padding: 12,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 12,
  },
  cardTitle: {
    fontSize: 13,
    fontWeight: '700',
    marginTop: 8,
    textAlign: 'center',
  },
  cardDesc: {
    fontSize: 10,
    textAlign: 'center',
    marginTop: 4,
  },
  listContainer: {
    paddingBottom: 20,
  },
  trainerCard: {
    flexDirection: 'row',
    alignItems: 'center',
    padding: 12,
    borderRadius: 15,
    borderWidth: 1,
    marginBottom: 12,
  },
  trainerAvatar: {
    width: 55,
    height: 55,
    borderRadius: 28,
  },
  trainerInfo: {
    flex: 1,
    marginLeft: 15,
  },
  trainerName: {
    fontSize: 16,
    fontWeight: '700',
  },
  trainerMetaRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 4,
  },
  trainerExp: {
    fontSize: 12,
  },
  dotSep: {
    marginHorizontal: 6,
  },
  specialtyBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  specialtyText: {
    color: AppColors.accentColor,
    fontSize: 9,
    fontWeight: '700',
  },
  ratingRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginTop: 6,
  },
  ratingVal: {
    fontSize: 12,
    fontWeight: '700',
    marginLeft: 4,
  },
  trainerDetailCard: {
    flexDirection: 'row',
    padding: 16,
    borderRadius: 15,
    borderWidth: 1,
    marginBottom: 20,
  },
  largeTrainerAvatar: {
    width: 60,
    height: 60,
    borderRadius: 30,
  },
  largeTrainerInfo: {
    flex: 1,
    marginLeft: 15,
  },
  largeTrainerName: {
    fontSize: 18,
    fontWeight: '700',
  },
  trainerSpecText: {
    fontSize: 12,
    marginTop: 3,
  },
  trainerExpText: {
    fontSize: 12,
    marginTop: 2,
  },
  reviewItemCard: {
    padding: 12,
    borderRadius: 15,
    borderWidth: 1,
    marginBottom: 12,
  },
  revHeaderRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  revUserRow: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  revUserAvatar: {
    width: 32,
    height: 32,
    borderRadius: 16,
  },
  revUserNameCol: {
    marginLeft: 8,
  },
  revUserName: {
    fontSize: 12,
    fontWeight: '700',
  },
  starsRow: {
    flexDirection: 'row',
    marginTop: 2,
  },
  revTypeCol: {
    alignItems: 'flex-end',
  },
  bookingTypeBadge: {
    backgroundColor: '#EEF2FF',
    paddingHorizontal: 6,
    paddingVertical: 2,
    borderRadius: 6,
  },
  bookingTypeText: {
    color: AppColors.accentColor,
    fontSize: 8,
    fontWeight: '700',
  },
  revDate: {
    fontSize: 10,
    marginTop: 3,
  },
  revComment: {
    fontSize: 12,
    lineHeight: 18,
    marginTop: 8,
  },
  scoreRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  scoreNumberCol: {
    alignItems: 'center',
    marginRight: 20,
  },
  scoreBigNum: {
    fontSize: 38,
    fontWeight: '900',
  },
  reviewsCountText: {
    fontSize: 10,
    marginTop: 4,
  },
  histogramsCol: {
    flex: 1,
  },
  histoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 4,
  },
  histoStarNum: {
    fontSize: 10,
    fontWeight: '700',
    width: 10,
  },
  histoBarBg: {
    flex: 1,
    height: 6,
    borderRadius: 3,
    marginHorizontal: 8,
    overflow: 'hidden',
  },
  histoBarFill: {
    height: '100%',
    borderRadius: 3,
  },
  histoPercent: {
    fontSize: 10,
    width: 25,
    textAlign: 'right',
  },
  ruleRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    paddingVertical: 8,
  },
  ruleText: {
    flex: 1,
    fontSize: 14,
    lineHeight: 20,
  },
  bottomBtnWrapper: {
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: Platform.OS === 'ios' ? 34 : 24,
  },
  persistentCloseBtn: {
    height: 48,
    borderRadius: 15,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  persistentCloseBtnText: {
    fontSize: 16,
    fontWeight: '700',
  },
});
