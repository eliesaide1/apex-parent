import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  AP_Screen,
  AP_Header,
  AP_Card,
  AP_ListItem,
  AP_Button,
  AP_StatusPill,
  AP_EmptyState,
  useI18n,
} from '@apex/shared';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Approvals'>;

export const ApprovalsScreen: React.FC<Props> = ({ navigation }) => {
  const { t, L } = useI18n();
  return (
    <AP_Screen>
      <AP_Header title={t('approvals')} showBack onBack={() => navigation.goBack()} />
      <AP_Card title={t('needsResponse')}>
        <AP_ListItem
          tone="high"
          title={L({ en: 'Acknowledge behavior note', ar: 'الإقرار بملاحظة سلوك' })}
          description={L({ en: 'Late to class 3 times this week.', ar: 'تأخر عن الصف 3 مرات هذا الأسبوع.' })}
          trailing={<AP_StatusPill label="HIGH" tone="high" />}
          footer={
            <View style={styles.actions}>
              <AP_Button label={t('approve')} full />
              <AP_Button label={t('decline')} variant="danger" full />
            </View>
          }
        />
      </AP_Card>
      <AP_Card title={t('completed')}>
        <AP_EmptyState message={L({ en: 'Photo consent form ✓', ar: 'موافقة نشر الصور ✓' })} />
      </AP_Card>
    </AP_Screen>
  );
};

const styles = StyleSheet.create({
  actions: { flexDirection: 'row', gap: 8, marginTop: 8 },
});
