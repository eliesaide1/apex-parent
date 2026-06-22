import React, { useState } from 'react';
import { View, StyleSheet } from 'react-native';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  AP_Screen,
  AP_Card,
  AP_Text,
  AP_Textbox,
  AP_Button,
  AP_Logo,
  AP_Icon,
  useI18n,
  colors,
} from '@apex/shared';
import { RootStackParamList } from '../navigation/types';
import { useAuth } from '../navigation/AuthContext';
import { api } from '../api';

type Props = NativeStackScreenProps<RootStackParamList, 'Login'>;

export const LoginScreen: React.FC<Props> = ({ navigation }) => {
  const { t, setLang, lang } = useI18n();
  const { signIn } = useAuth();
  const [email, setEmail] = useState('parent@apex.app');
  const [password, setPassword] = useState('');
  const [show, setShow] = useState(false);
  const [loading, setLoading] = useState(false);

  const onLogin = async () => {
    setLoading(true);
    try {
      // Real JWT login via the single clientProxy entry point. clientProxy
      // surfaces any error envelope as a global alert; we only proceed on success.
      const { token } = await api.login(email, password);
      await signIn(token);
    } catch {
      // error already alerted by clientProxy; stay on the login screen
    } finally {
      setLoading(false);
    }
  };

  return (
    <AP_Screen background={colors.white}>
      <View style={styles.langRow}>
        <AP_Button label="EN" variant={lang === 'en' ? 'primary' : 'ghost'} onPress={() => setLang('en')} />
        <AP_Button label="ع" variant={lang === 'ar' ? 'primary' : 'ghost'} onPress={() => setLang('ar')} />
      </View>
      <View style={styles.logoWrap}>
        <AP_Logo size={64} />
      </View>
      <AP_Text variant="h1" align="center" color={colors.brand}>
        APEX
      </AP_Text>
      <AP_Text variant="caption" align="center" style={styles.tag}>
        {t('parentApp')}
      </AP_Text>
      <AP_Card>
        <AP_Text variant="h2">{t('loginWelcome')}</AP_Text>
        <AP_Text variant="muted" style={styles.lead}>
          {t('loginLead')}
        </AP_Text>
        <AP_Textbox
          label={t('email')}
          value={email}
          onChangeText={setEmail}
          autoCapitalize="none"
          keyboardType="email-address"
        />
        <AP_Textbox
          label={t('password')}
          value={password}
          onChangeText={setPassword}
          secureTextEntry={!show}
          placeholder="••••••••"
          trailing={<AP_Icon name={show ? 'eyeOff' : 'eye'} size={18} color={colors.muted} />}
          onTrailingPress={() => setShow((s) => !s)}
          hint={t('pwdHint')}
        />
        <AP_Button label={t('loginBtn')} full loading={loading} onPress={onLogin} />
        <View style={styles.divider}>
          <AP_Text variant="caption">{t('or')}</AP_Text>
        </View>
        <AP_Button
          label={t('createAcct')}
          variant="ghost"
          full
          onPress={() => navigation.navigate('Register')}
        />
      </AP_Card>
    </AP_Screen>
  );
};

const styles = StyleSheet.create({
  langRow: { flexDirection: 'row', justifyContent: 'flex-end', gap: 8, marginBottom: 8 },
  logoWrap: { alignItems: 'center', marginBottom: 8 },
  tag: { marginBottom: 16 },
  lead: { marginBottom: 16 },
  divider: { alignItems: 'center', marginVertical: 14 },
});
