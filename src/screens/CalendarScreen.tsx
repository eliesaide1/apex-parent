import React from 'react';
import { AP_Screen, AP_Header, AP_Card, AP_ListItem, useI18n } from '@apex/shared';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Calendar'>;

export const CalendarScreen: React.FC<Props> = ({ navigation }) => {
  const { t, L } = useI18n();
  return (
    <AP_Screen>
      <AP_Header title={t('calendar')} showBack onBack={() => navigation.goBack()} />
      <AP_Card title={L({ en: 'Upcoming', ar: 'القادم' })}>
        <AP_ListItem tone="med" title={L({ en: 'Science Museum trip', ar: 'رحلة متحف العلوم' })} description={L({ en: 'Fri 20 June', ar: 'الجمعة 20 يونيو' })} />
        <AP_ListItem tone="low" title={L({ en: 'Parent–Teacher meeting', ar: 'اجتماع ولي أمر ومعلم' })} description={L({ en: 'Mon 18 June, 3:30 PM', ar: 'الإثنين 18 يونيو، 3:30 م' })} />
        <AP_ListItem tone="ok" title={L({ en: 'Sports Day', ar: 'يوم رياضي' })} description={L({ en: 'Thu 25 June', ar: 'الخميس 25 يونيو' })} />
      </AP_Card>
    </AP_Screen>
  );
};
