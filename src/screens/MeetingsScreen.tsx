import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  AP_Screen,
  AP_Card,
  AP_Button,
  AP_ListItem,
  AP_StatusPill,
  AP_Modal,
  AP_Select,
  AP_DatePicker,
  AP_Textbox,
  AP_Icon,
  useI18n,
  colors,
} from '@apex/shared';

export const MeetingsScreen: React.FC = () => {
  const { t, L } = useI18n();
  const [open, setOpen] = useState(false);
  const [type, setType] = useState('pt');

  return (
    <AP_Screen>
      <AP_Card>
        <AP_Button
          label={t('bookMeeting')}
          full
          icon={<AP_Icon name="calendar" size={18} color={colors.white} />}
          onPress={() => setOpen(true)}
        />
      </AP_Card>
      <AP_Card title={t('upcomingMeetings')}>
        <AP_ListItem
          tone="ok"
          leading={<AP_Icon name="calendar" size={20} color={colors.ok} />}
          title={L({ en: 'Parent–Teacher meeting', ar: 'اجتماع ولي أمر ومعلم' })}
          description={L({ en: 'Ms. Rana · Mon 18 June, 3:30 PM', ar: 'أ. رنا · الإثنين 18 يونيو، 3:30 م' })}
          trailing={<AP_StatusPill label={t('confirmed')} tone="ok" />}
        />
        <AP_ListItem
          tone="med"
          leading={<AP_Icon name="user" size={20} color={colors.medInk} />}
          title={L({ en: 'Behavior follow-up', ar: 'متابعة سلوك' })}
          description={L({ en: 'Mr. Sami · Awaiting time', ar: 'أ. سامي · بانتظار الموعد' })}
          trailing={<AP_StatusPill label={t('pending')} tone="med" />}
          footer={
            <View style={styles.actions}>
              <AP_Button label={t('proposeTime')} variant="ghost" full />
              <AP_Button label={t('cancel')} variant="danger" full />
            </View>
          }
        />
      </AP_Card>

      <AP_Modal visible={open} onClose={() => setOpen(false)} title={t('bookMeeting')}>
        <AP_Select
          label={L({ en: 'Meeting type', ar: 'نوع الاجتماع' })}
          value={type}
          onChange={setType}
          options={[
            { label: L({ en: 'Parent–Teacher', ar: 'ولي أمر ومعلم' }), value: 'pt' },
            { label: L({ en: 'Counselor meeting', ar: 'اجتماع مرشد' }), value: 'counsel' },
          ]}
        />
        <AP_DatePicker label={L({ en: 'Preferred time', ar: 'الوقت المفضل' })} value="2026-06-18 15:30" />
        <AP_Textbox label={L({ en: 'Note (optional)', ar: 'ملاحظة (اختياري)' })} multiline />
        <AP_Button label={t('send')} full onPress={() => setOpen(false)} />
      </AP_Modal>
    </AP_Screen>
  );
};

const styles = StyleSheet.create({
  actions: { flexDirection: 'row', gap: 8, marginTop: 8 },
});
