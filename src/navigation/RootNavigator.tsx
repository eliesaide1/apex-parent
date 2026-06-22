import React from 'react';
import { Pressable, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createBottomTabNavigator } from '@react-navigation/bottom-tabs';
import { AP_Text, AP_Badge, useI18n, colors } from '@apex/shared';
import { RootStackParamList, MainTabParamList } from './types';
import { useAuth } from './AuthContext';
import { LoginScreen } from '../screens/LoginScreen';
import { RegisterScreen } from '../screens/RegisterScreen';
import { HomeScreen } from '../screens/HomeScreen';
import { TimelineScreen } from '../screens/TimelineScreen';
import { RecordsScreen } from '../screens/RecordsScreen';
import { MessagesScreen } from '../screens/MessagesScreen';
import { MeetingsScreen } from '../screens/MeetingsScreen';
import { ApprovalsScreen } from '../screens/ApprovalsScreen';
import { CalendarScreen } from '../screens/CalendarScreen';
import { NotificationsScreen } from '../screens/NotificationsScreen';
import { SettingsScreen } from '../screens/SettingsScreen';

const Stack = createNativeStackNavigator<RootStackParamList>();
const Tab = createBottomTabNavigator<MainTabParamList>();

const tabIcon = (glyph: string) => (active: boolean) =>
  <AP_Text color={active ? colors.brand : colors.muted}>{glyph}</AP_Text>;

const HeaderTools: React.FC<{ onBell: () => void; onSettings: () => void }> = ({ onBell, onSettings }) => (
  <View style={{ flexDirection: 'row', gap: 16, paddingHorizontal: 12 }}>
    <Pressable onPress={onBell}>
      <AP_Text color={colors.white}>🔔</AP_Text>
      <AP_Badge count={3} />
    </Pressable>
    <Pressable onPress={onSettings}>
      <AP_Text color={colors.white}>⚙️</AP_Text>
    </Pressable>
  </View>
);

const MainTabs: React.FC = () => {
  const { t } = useI18n();
  return (
    <Tab.Navigator
      screenOptions={({ navigation }) => ({
        headerStyle: { backgroundColor: colors.brand },
        headerTintColor: colors.white,
        tabBarActiveTintColor: colors.brand,
        tabBarInactiveTintColor: colors.muted,
        headerRight: () => (
          <HeaderTools
            onBell={() => navigation.getParent()?.navigate('Notifications')}
            onSettings={() => navigation.getParent()?.navigate('Settings')}
          />
        ),
      })}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: t('home'), tabBarIcon: ({ focused }) => tabIcon('🏠')(focused) }} />
      <Tab.Screen name="Timeline" component={TimelineScreen} options={{ title: t('timeline'), tabBarIcon: ({ focused }) => tabIcon('📋')(focused) }} />
      <Tab.Screen name="Records" component={RecordsScreen} options={{ title: t('records'), tabBarIcon: ({ focused }) => tabIcon('📁')(focused) }} />
      <Tab.Screen name="Messages" component={MessagesScreen} options={{ title: t('messages'), tabBarIcon: ({ focused }) => tabIcon('💬')(focused) }} />
      <Tab.Screen name="Meetings" component={MeetingsScreen} options={{ title: t('meetings'), tabBarIcon: ({ focused }) => tabIcon('📅')(focused) }} />
    </Tab.Navigator>
  );
};

export const RootNavigator: React.FC = () => {
  const { token } = useAuth();
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        {token ? (
          <>
            <Stack.Screen name="Main" component={MainTabs} />
            <Stack.Screen name="Approvals" component={ApprovalsScreen} />
            <Stack.Screen name="Calendar" component={CalendarScreen} />
            <Stack.Screen name="Notifications" component={NotificationsScreen} />
            <Stack.Screen name="Settings" component={SettingsScreen} />
          </>
        ) : (
          <>
            <Stack.Screen name="Login" component={LoginScreen} />
            <Stack.Screen name="Register" component={RegisterScreen} />
          </>
        )}
      </Stack.Navigator>
    </NavigationContainer>
  );
};
