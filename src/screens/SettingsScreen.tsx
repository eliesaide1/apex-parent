import React from 'react';
import { View, StyleSheet } from 'react-native';
import {
  AP_Screen,
  AP_Header,
  AP_Card,
  AP_Text,
  AP_Avatar,
  AP_Button,
  useI18n,
  colors,
} from '@apex/shared';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { useAuth } from '../navigation/AuthContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Settings'>;

export const SettingsScreen: React.FC<Props> = ({ navigation }) => {
  const { t, lang, setLang } = useI18n();
  const { signOut } = useAuth();
  return (
    <AP_Screen>
      <AP_Header title={t('settings')} showBack onBack={() => navigation.goBack()} />
      <AP_Card>
        <View style={styles.prof}>
          <AP_Avatar initials="RK" size={60} />
          <View>
            <AP_Text weight="700">Rami Khalil</AP_Text>
            <AP_Text variant="muted">parent@apex.app · +961 81 000 000</AP_Text>
          </View>
        </View>
      </AP_Card>
      <AP_Card title={t('language')}>
        <View style={styles.langRow}>
          <AP_Button label="EN" variant={lang === 'en' ? 'primary' : 'ghost'} onPress={() => setLang('en')} />
          <AP_Button label="ع" variant={lang === 'ar' ? 'primary' : 'ghost'} onPress={() => setLang('ar')} />
        </View>
      </AP_Card>
      <AP_Card>
        <AP_Button label={t('logout')} variant="danger" full onPress={signOut} />
        <AP_Text variant="caption" align="center" color={colors.muted} style={styles.ver}>
          Apex AI · Parent App · v1
        </AP_Text>
      </AP_Card>
    </AP_Screen>
  );
};

const styles = StyleSheet.create({
  prof: { flexDirection: 'row', alignItems: 'center', gap: 14 },
  langRow: { flexDirection: 'row', gap: 8 },
  ver: { marginTop: 12 },
});
