import React, { useContext, useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { spacing, typography, scaleHeight } from '../utils/theme';
import { ThemeContext } from '../utils/ThemeContext';

const LanguageSettings = ({ navigation }) => {
  const { colors } = useContext(ThemeContext);
  const [selectedLanguage, setSelectedLanguage] = useState('English');

  const languages = [
    { id: 'en', name: 'English' },
    { id: 'ha', name: 'Hausa' },
    { id: 'yo', name: 'Yoruba' },
    { id: 'ig', name: 'Igbo' },
    { id: 'pcm', name: 'Pidgin' },
  ];

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={scaleHeight(24)} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Language</Text>
        <View style={{ width: scaleHeight(24) }} />
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>Select App Language</Text>
        {languages.map((lang) => (
          <TouchableOpacity
            key={lang.id}
            style={[styles.selectionRow, { borderBottomColor: colors.border }]}
            onPress={() => setSelectedLanguage(lang.name)}
          >
            <Text style={[styles.optionText, { color: colors.text }]}>{lang.name}</Text>
            {selectedLanguage === lang.name && (
              <Ionicons name="checkmark" size={scaleHeight(20)} color={colors.primary || 'green'} />
            )}
          </TouchableOpacity>
        ))}
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
  sectionTitle: {
    ...typography.body,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
    fontSize: scaleHeight(16),
  },
  selectionRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: spacing.md,
    borderBottomWidth: StyleSheet.hairlineWidth,
  },
  optionText: {
    ...typography.body,
    fontSize: scaleHeight(16),
  },
});

export default LanguageSettings;