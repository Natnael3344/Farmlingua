import React, { useContext } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Linking,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@react-native-vector-icons/ionicons';
import { spacing, typography, scaleHeight } from '../utils/theme';
import { ThemeContext } from '../utils/ThemeContext';

const SupportScreen = ({ navigation }) => {
  const { colors } = useContext(ThemeContext);

  const handleEmail = (email) => Linking.openURL(`mailto:${email}`);
  const handleCall = (phone) => Linking.openURL(`tel:${phone}`);
  const handleWeb = (url) => Linking.openURL(url);

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: colors.background }]} edges={['top', 'bottom']}>
      {/* Header */}
      <View style={[styles.header, { borderBottomColor: colors.border }]}>
        <TouchableOpacity onPress={() => navigation.goBack()} style={styles.backButton}>
          <Ionicons name="arrow-back" size={scaleHeight(24)} color={colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: colors.text }]}>Support</Text>
        <View style={{ width: scaleHeight(24) }} />
      </View>

      <ScrollView contentContainerStyle={styles.contentContainer}>
        <Text style={[styles.paragraph, { color: colors.text }]}>
          Farmlingua is committed to providing farmers with reliable and accessible assistance across our mobile, web, and USSD platforms.
        </Text>

        <View style={[styles.card, { backgroundColor: colors.surface || '#f5f5f5' }]}>
          <Text style={[styles.cardTitle, { color: colors.text }]}>Contact Us</Text>
          
          <TouchableOpacity style={styles.contactRow} onPress={() => handleEmail('support@farmlingua.ai')}>
            <Ionicons name="mail-outline" size={20} color={colors.text} />
            <Text style={[styles.contactText, { color: colors.primary || 'blue' }]}> support@farmlingua.ai</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactRow} onPress={() => handleEmail('kawafarmng@gmail.com')}>
            <Ionicons name="mail-outline" size={20} color={colors.text} />
            <Text style={[styles.contactText, { color: colors.primary || 'blue' }]}> kawafarmng@gmail.com</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactRow} onPress={() => handleCall('09012009927')}>
            <Ionicons name="call-outline" size={20} color={colors.text} />
            <Text style={[styles.contactText, { color: colors.primary || 'blue' }]}> 09012009927 (Phone/WhatsApp)</Text>
          </TouchableOpacity>

          <TouchableOpacity style={styles.contactRow} onPress={() => handleWeb('https://www.farmlingua.ai/support')}>
            <Ionicons name="globe-outline" size={20} color={colors.text} />
            <Text style={[styles.contactText, { color: colors.primary || 'blue' }]}> www.farmlingua.ai/support</Text>
          </TouchableOpacity>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>Support Hours</Text>
          <Text style={[styles.text, { color: colors.textLight }]}>Monday – Saturday</Text>
          <Text style={[styles.text, { color: colors.textLight }]}>8:00am – 6:00pm (WAT)</Text>
          <Text style={[styles.text, { color: colors.textLight, fontStyle: 'italic', marginTop: 4 }]}>We typically respond within 24 hours.</Text>
        </View>

        <View style={styles.section}>
          <Text style={[styles.sectionTitle, { color: colors.text }]}>What We Support</Text>
          {[
            'Mobile and web app issues',
            'USSD access or errors',
            'AI responses and translation challenges',
            'Account setup and login',
            'Incorrect farming information reports',
            'New feature requests',
            'General feedback'
          ].map((item, index) => (
            <View key={index} style={styles.bulletRow}>
              <View style={[styles.bullet, { backgroundColor: colors.text }]} />
              <Text style={[styles.text, { color: colors.text }]}>{item}</Text>
            </View>
          ))}
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
  card: {
    padding: spacing.md,
    borderRadius: 12,
    marginBottom: spacing.lg,
  },
  cardTitle: {
    fontWeight: 'bold',
    marginBottom: spacing.md,
    fontSize: scaleHeight(16),
  },
  contactRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: spacing.sm + 4,
  },
  contactText: {
    ...typography.bodySmall,
    marginLeft: spacing.sm,
    textDecorationLine: 'underline',
  },
  bulletRow: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    marginBottom: 6,
  },
  bullet: {
    width: 6,
    height: 6,
    borderRadius: 3,
    marginTop: 8,
    marginRight: 10,
  },
});

export default SupportScreen;