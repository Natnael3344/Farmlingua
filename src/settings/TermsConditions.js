import React, { useContext } from 'react';
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

const TermSection = ({ title, children, colors }) => (
  <View style={styles.section}>
    <Text style={[styles.sectionTitle, { color: colors.text, fontSize: scaleHeight(16) }]}>{title}</Text>
    <Text style={[styles.text, { color: colors.textLight, lineHeight: 22 }]}>
      {children}
    </Text>
  </View>
);

const TermsScreen = ({ navigation }) => {
  const { colors } = useContext(ThemeContext);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={scaleHeight(24)} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Terms & Conditions</Text>
        <View style={{ width: scaleHeight(24) }} />
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={[styles.dateText, { color: colors.textLight }]}>Effective Date: January 2025</Text>
        <Text style={[styles.paragraph, { color: colors.text }]}>
          By using the Farmlingua mobile app, web app, or USSD service, you agree to the following Terms and Conditions.
        </Text>

        <TermSection title="1. Use of the Service" colors={colors}>
          Farmlingua provides AI-generated agricultural guidance intended for informational and educational purposes. Users must not misuse or interfere with the platform. Users must be 18 years or older or use the service with adult supervision.
        </TermSection>

        <TermSection title="2. No Professional Liability" colors={colors}>
          Farmlingua does not guarantee the full accuracy of AI-generated advice. We are not liable for crop loss, revenue loss, or decisions made using platform information. Users should consult professional agronomists for specialized needs.
        </TermSection>

        <TermSection title="3. User Responsibilities" colors={colors}>
          Users agree to: Provide accurate information when interacting with the service; Not upload harmful or illegal content; Not reverse-engineer or redistribute Farmlingua technology.
        </TermSection>

        <TermSection title="4. Accounts and Access" colors={colors}>
          Users are responsible for safeguarding login credentials. Farmlingua may suspend accounts that violate these terms.
        </TermSection>

        <TermSection title="5. Intellectual Property" colors={colors}>
          Farmlingua Nigeria Ltd owns all platform technology, AI systems, translations, datasets created internally, and related intellectual property. This does not include open-source or community-generated data used to improve our models.
        </TermSection>

        <TermSection title="6. Data Usage" colors={colors}>
          Usage data, language preferences, and non-personal interaction logs may be processed to improve AI performance. Personal data is never sold.
        </TermSection>

        <TermSection title="7. DATA SOURCES & IP NOTICE" colors={colors}>
          Farmlingua uses open-source agricultural datasets and community-generated farming information. We do not claim exclusive rights to external data sources and respect all applicable data licenses.
        </TermSection>

        <TermSection title="8. Limitation of Liability" colors={colors}>
          Farmlingua is not liable for crop loss, market fluctuations, inaccurate third-party information, network interruptions, or USSD/telecom failures.
        </TermSection>

        <TermSection title="9. Governing Law" colors={colors}>
          These Terms follow the laws of the Federal Republic of Nigeria.
        </TermSection>
        
        <View style={{ height: 40 }} />
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
  sectionTitle: {
    ...typography.body,
    fontWeight: 'bold',
    marginBottom: spacing.sm,
    fontSize: scaleHeight(16),
  },
  text: {
    ...typography.bodySmall,
    fontSize: scaleHeight(14),
  },
  paragraph: {
    ...typography.body,
    marginBottom: spacing.md,
    lineHeight: 22,
  },
  dateText: {
    ...typography.caption,
    marginBottom: spacing.md,
    fontStyle: 'italic',
  },
});

export default TermsScreen;