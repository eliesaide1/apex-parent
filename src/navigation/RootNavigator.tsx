import React from 'react';
import { Pressable, View } from 'react-native';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import {
  createBottomTabNavigator,
  BottomTabHeaderProps,
} from '@react-navigation/bottom-tabs';
import {
  AP_Badge,
  AP_Icon,
  AP_AppHeader,
  AP_HeaderChip,
  useI18n,
  useUnreadCount,
  colors,
} from '@apex/shared';
import { RootStackParamList, MainTabParamList } from './types';
import { useAuth } from './AuthContext';
import { ChildProvider, useChildren } from './ChildContext';
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

const tabIcon = (name: string) => (focused: boolean) =>
  <AP_Icon name={name} size={22} color={focused ? colors.brand : colors.muted} />;

/** Tabs whose content is scoped to the active child — these show the chip row. */
const CHILD_SCOPED = new Set(['Home', 'Timeline', 'Records']);

/** Bell (with live unread badge) + settings gear — the header tools slot. */
const HeaderTools: React.FC<{ onBell: () => void; onSettings: () => void }> = ({ onBell, onSettings }) => {
  const unread = useUnreadCount();
  return (
    <>
      <Pressable onPress={onBell}>
        <AP_Icon name="bell" size={21} color={colors.white} />
        <AP_Badge count={unread} />
      </Pressable>
      <Pressable onPress={onSettings}>
        <AP_Icon name="settings" size={20} color={colors.white} />
      </Pressable>
    </>
  );
};

/**
 * The single teal header block for the parent Tab.Navigator. Renders the logo +
 * APEX wordmark, the current tab title, today's date, the bell/settings tools,
 * and (for child-scoped tabs) the child switcher chips from ChildContext.
 */
const ParentHeader: React.FC<BottomTabHeaderProps> = ({ navigation, route, options }) => {
  const { formatHeaderDate } = useI18n();
  const { children, activeChildId, setActiveChild } = useChildren();
  const showChips = CHILD_SCOPED.has(route.name) && children.length > 0;
  return (
    <AP_AppHeader
      title={options.title ?? route.name}
      subtitle={formatHeaderDate()}
      right={
        <HeaderTools
          onBell={() => navigation.getParent()?.navigate('Notifications' as never)}
          onSettings={() => navigation.getParent()?.navigate('Settings' as never)}
        />
      }
    >
      {showChips
        ? children.map((c) => (
            <AP_HeaderChip
              key={c.id}
              label={c.name}
              initials={c.initials}
              color={c.color}
              active={c.id === activeChildId}
              onPress={() => setActiveChild(c.id)}
            />
          ))
        : null}
    </AP_AppHeader>
  );
};

const MainTabs: React.FC = () => {
  const { t } = useI18n();
  return (
    <Tab.Navigator
      screenOptions={{
        header: (props) => <ParentHeader {...props} />,
        tabBarActiveTintColor: colors.brand,
        tabBarInactiveTintColor: colors.muted,
      }}
    >
      <Tab.Screen name="Home" component={HomeScreen} options={{ title: t('home'), tabBarIcon: ({ focused }) => tabIcon('home')(focused) }} />
      <Tab.Screen name="Timeline" component={TimelineScreen} options={{ title: t('timeline'), tabBarIcon: ({ focused }) => tabIcon('clipboard')(focused) }} />
      <Tab.Screen name="Records" component={RecordsScreen} options={{ title: t('records'), tabBarIcon: ({ focused }) => tabIcon('folder')(focused) }} />
      <Tab.Screen name="Messages" component={MessagesScreen} options={{ title: t('messages'), tabBarIcon: ({ focused }) => tabIcon('message')(focused) }} />
      <Tab.Screen name="Meetings" component={MeetingsScreen} options={{ title: t('meetings'), tabBarIcon: ({ focused }) => tabIcon('calendar')(focused) }} />
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
            <Stack.Screen name="Main">
              {() => (
                <ChildProvider>
                  <MainTabs />
                </ChildProvider>
              )}
            </Stack.Screen>
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
