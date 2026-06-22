import React from 'react';
import { AP_Screen, AP_Card, AP_ListItem, AP_Avatar, useI18n, colors } from '@apex/shared';

export const MessagesScreen: React.FC = () => {
  const { t, L } = useI18n();
  const msgs = [
    { from: { en: 'Ms. Rana — Science', ar: 'أ. رنا — علوم' }, init: 'R', color: colors.brand2, prev: { en: 'Lara did wonderfully today!', ar: 'قدّمت لارا أداءً رائعاً اليوم!' }, when: '10:32' },
    { from: { en: 'School Administration', ar: 'إدارة المدرسة' }, init: 'A', color: colors.low, prev: { en: 'Reminder: half-day Thursday.', ar: 'تذكير: دوام نصف يوم الخميس.' }, when: '9:05' },
    { from: { en: 'Nurse Office', ar: 'عيادة الممرضة' }, init: 'N', color: colors.high, prev: { en: 'Omar is resting.', ar: 'عمر يرتاح.' }, when: '10:47' },
  ];
  return (
    <AP_Screen>
      <AP_Card title={t('messages')}>
        {msgs.map((m, i) => (
          <AP_ListItem
            key={i}
            leading={<AP_Avatar initials={m.init} color={m.color} />}
            title={L(m.from)}
            description={L(m.prev)}
            time={m.when}
          />
        ))}
      </AP_Card>
    </AP_Screen>
  );
};
