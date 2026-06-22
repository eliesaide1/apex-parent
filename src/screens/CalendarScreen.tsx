import React from 'react';
import { AP_Screen, AP_Header, AP_Card, AP_ListItem, AP_Icon, useI18n, colors } from '@apex/shared';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';

type Props = NativeStackScreenProps<RootStackParamList, 'Calendar'>;

export const CalendarScreen: React.FC<Props> = ({ navigation }) => {
  const { t, L } = useI18n();
  return (
    <AP_Screen>
      <AP_Header title={t('calendar')} showBack onBack={() => navigation.goBack()} />
      <AP_Card title={L({ en: 'Upcoming', ar: 'القادم' })}>
        <AP_ListItem tone="med" leading={<AP_Icon name="bus" size={20} color={colors.medInk} />} title={L({ en: 'Science Museum trip', ar: 'رحلة متحف العلوم' })} description={L({ en: 'Fri 20 June', ar: 'الجمعة 20 يونيو' })} />
        <AP_ListItem tone="low" leading={<AP_Icon name="user" size={20} color={colors.low} />} title={L({ en: 'Parent–Teacher meeting', ar: 'اجتماع ولي أمر ومعلم' })} description={L({ en: 'Mon 18 June, 3:30 PM', ar: 'الإثنين 18 يونيو، 3:30 م' })} />
        <AP_ListItem tone="ok" leading={<AP_Icon name="party" size={20} color={colors.ok} />} title={L({ en: 'Sports Day', ar: 'يوم رياضي' })} description={L({ en: 'Thu 25 June', ar: 'الخميس 25 يونيو' })} />
      </AP_Card>
    </AP_Screen>
  );
};
