import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Switch,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { spacing, typography, scaleHeight } from '../utils/theme';
import { ThemeContext } from '../utils/ThemeContext';

const AppearanceSettings = ({ navigation }) => {
  const { isDarkMode, toggleTheme, colors } = useContext(ThemeContext);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={scaleHeight(24)} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Appearance</Text>
        <View style={{ width: scaleHeight(24) }} />
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <View style={styles.section}>
          <View style={styles.row}>
            <Text style={[styles.optionText, { color: colors.text }]}>Dark Mode</Text>
            <Switch
              trackColor={{ false: colors.border, true: colors.primary }}
              thumbColor={colors.text}
              onValueChange={toggleTheme}
              value={isDarkMode}
              style={styles.switchStyle}
            />
          </View>
          <Text style={[styles.helperText, { color: colors.textLight }]}>
            Adjust the appearance of Farmlingua to reduce eye strain.
          </Text>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: { flex: 1 },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    borderBottomWidth: 1,
  },
  headerTitle: {
    ...typography.title,
    fontWeight: 'bold',
    fontSize: scaleHeight(18),
  },
  contentContainer: { padding: spacing.lg },
  section: { marginBottom: spacing.lg },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.sm,
  },
  optionText: {
    ...typography.body,
    fontSize: scaleHeight(16),
  },
  helperText: {
    ...typography.caption,
    marginTop: spacing.xs,
  },
  switchStyle: {
    transform: [{ scaleX: 0.8 }, { scaleY: 0.8 }],
  },
});

export default AppearanceSettings;