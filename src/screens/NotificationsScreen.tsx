import React from 'react';
import { AP_Screen, AP_Header, AP_Card, AP_ListItem, AP_StatusPill, AP_Icon, useI18n, colors } from '@apex/shared';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import type { Priority } from '@apex/shared';

const NOTIF_ICON: Record<Priority, { name: string; color: string }> = {
  high: { name: 'activity', color: colors.high },
  med: { name: 'alert', color: colors.medInk },
  low: { name: 'bell', color: colors.low },
  ok: { name: 'star', color: colors.ok },
};

type Props = NativeStackScreenProps<RootStackParamList, 'Notifications'>;

export const NotificationsScreen: React.FC<Props> = ({ navigation }) => {
  const { t, L } = useI18n();
  const items: Array<{ tone: Priority; tt: { en: string; ar: string }; dd: { en: string; ar: string }; time: string }> = [
    { tone: 'high', tt: { en: 'Nurse visit — Omar', ar: 'زيارة ممرضة — عمر' }, dd: { en: 'Reported a headache, now resting.', ar: 'يشكو من صداع، يرتاح الآن.' }, time: '10:45 AM' },
    { tone: 'med', tt: { en: 'Approval needed', ar: 'موافقة مطلوبة' }, dd: { en: 'Behavior note needs acknowledgement.', ar: 'ملاحظة سلوك بحاجة للإقرار.' }, time: '10:40 AM' },
    { tone: 'ok', tt: { en: 'Positive note — Lara', ar: 'ملاحظة إيجابية — لارا' }, dd: { en: 'Great participation in Science.', ar: 'مشاركة ممتازة في العلوم.' }, time: '10:30 AM' },
  ];
  return (
    <AP_Screen>
      <AP_Header title={t('notifications')} showBack onBack={() => navigation.goBack()} />
      <AP_Card title={t('notifications')}>
        {items.map((n, i) => (
          <AP_ListItem
            key={i}
            tone={n.tone}
            leading={<AP_Icon name={NOTIF_ICON[n.tone].name} size={20} color={NOTIF_ICON[n.tone].color} />}
            title={L(n.tt)}
            description={L(n.dd)}
            time={n.time}
            trailing={<AP_StatusPill label={n.tone.toUpperCase()} tone={n.tone} />}
          />
        ))}
      </AP_Card>
    </AP_Screen>
  );
};
