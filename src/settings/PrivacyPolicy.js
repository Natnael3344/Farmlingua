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

const PrivacyScreen = ({ navigation }) => {
  const { colors } = useContext(ThemeContext);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={scaleHeight(24)} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Privacy Policy</Text>
        <View style={{ width: scaleHeight(24) }} />
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={[styles.dateText, { color: colors.textLight }]}>Effective Date: January 2025</Text>
        <Text style={[styles.paragraph, { color: colors.text }]}>
          Farmlingua is committed to ethical, responsible handling of farmer data.
        </Text>

        <TermSection title="1. Information We Collect" colors={colors}>
          <Text style={{fontWeight:'bold'}}>Personal Information:</Text> Name, Phone number, Optional location, Device details.{"\n"}
          <Text style={{fontWeight:'bold'}}>Farming Information:</Text> Crops grown, AI queries, Market requests.{"\n"}
          <Text style={{fontWeight:'bold'}}>Usage Data:</Text> App interactions, USSD logs.
        </TermSection>

        <TermSection title="2. How We Use Your Data" colors={colors}>
          Data is used to improve AI accuracy, provide personalized guidance, map trends, and improve user experience. Data is anonymized whenever possible.
        </TermSection>

        <TermSection title="3. Data Privacy and Security" colors={colors}>
          Industry-standard encryption, strict internal access controls, no sale of personal data.
        </TermSection>

        <TermSection title="4. DATA SOURCES & EXTERNAL HANDLING" colors={colors}>
          We use open-source and community-generated data. We do not claim ownership over external datasets and respect open-data licensing.
        </TermSection>

        <TermSection title="5. Data Sharing" colors={colors}>
          We only share aggregated, anonymized insights with Government bodies, NGOs, Research institutions, and Farmer cooperatives. We never share personal identities.
        </TermSection>

        <TermSection title="6. User Rights" colors={colors}>
          Users may request to access data, update info, delete accounts, or opt out. Contact: privacy@farmlingua.ai
        </TermSection>

        <TermSection title="9. Contact Information" colors={colors}>
          privacy@farmlingua.ai{"\n"}
          kawafarmng@gmail.com{"\n"}
          Phone: 09012009927
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

export default PrivacyScreen;