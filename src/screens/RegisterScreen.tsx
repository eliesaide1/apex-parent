import React, { useState } from 'react';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import {
  AP_Screen,
  AP_Header,
  AP_Card,
  AP_Textbox,
  AP_Button,
  useI18n,
  colors,
} from '@apex/shared';
import { RootStackParamList } from '../navigation/types';
import { useAuth } from '../navigation/AuthContext';

type Props = NativeStackScreenProps<RootStackParamList, 'Register'>;

export const RegisterScreen: React.FC<Props> = ({ navigation }) => {
  const { t } = useI18n();
  const { signIn } = useAuth();
  const [form, setForm] = useState({ name: '', email: '', phone: '', code: '', pwd: '', confirm: '' });
  const set = (k: keyof typeof form) => (v: string) => setForm((f) => ({ ...f, [k]: v }));

  return (
    <AP_Screen background={colors.white} scroll>
      <AP_Header title={t('regTitle')} subtitle={t('regLead')} showBack onBack={() => navigation.goBack()} />
      <AP_Card>
        <AP_Textbox label={t('fullName')} value={form.name} onChangeText={set('name')} />
        <AP_Textbox label={t('email')} value={form.email} onChangeText={set('email')} autoCapitalize="none" keyboardType="email-address" />
        <AP_Textbox label={t('phone')} value={form.phone} onChangeText={set('phone')} keyboardType="phone-pad" />
        <AP_Textbox label={t('schoolCode')} value={form.code} onChangeText={set('code')} />
        <AP_Textbox label={t('password')} value={form.pwd} onChangeText={set('pwd')} secureTextEntry hint={t('pwdHint')} />
        <AP_Textbox label={t('confirmPwd')} value={form.confirm} onChangeText={set('confirm')} secureTextEntry />
        <AP_Button label={t('regBtn')} full onPress={() => signIn('demo.jwt.token')} />
      </AP_Card>
    </AP_Screen>
  );
};
