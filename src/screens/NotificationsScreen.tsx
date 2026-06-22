import React, { useEffect } from 'react';
import {
  AP_Screen,
  AP_Header,
  AP_Card,
  AP_ListItem,
  AP_StatusPill,
  AP_EmptyState,
  AP_Button,
  AP_Icon,
  useI18n,
  colors,
  notificationStore,
  useNotifications,
} from '@apex/shared';
import type { Priority, NotificationItem } from '@apex/shared';
import { NativeStackScreenProps } from '@react-navigation/native-stack';
import { RootStackParamList } from '../navigation/types';
import { api } from '../api';

type Props = NativeStackScreenProps<RootStackParamList, 'Notifications'>;

/** Backend priority (high|medium|low) -> AP_ tone (high|med|low|ok). */
const toTone = (p: NotificationItem['priority']): Priority =>
  p === 'high' ? 'high' : p === 'medium' ? 'med' : 'low';

const NOTIF_ICON: Record<Priority, { name: string; color: string }> = {
  high: { name: 'activity', color: colors.high },
  med: { name: 'alert', color: colors.medInk },
  low: { name: 'bell', color: colors.low },
  ok: { name: 'star', color: colors.ok },
};

export const NotificationsScreen: React.FC<Props> = ({ navigation }) => {
  const { t, L } = useI18n();
  // Live store: seeded from REST below, plus any items socket-pushed while open.
  const { list } = useNotifications();

  // Initial list via the parent BFF endpoint -> seed the shared store. Live
  // items added by the socket (newest first) appear at the top automatically;
  // the store dedupes by id so a later refresh won't duplicate a live item.
  useEffect(() => {
    let active = true;
    api
      .listNotifications()
      .then((rows) => {
        if (!active) return;
        const seeded: NotificationItem[] = rows.map((n) => ({
          id: n.id,
          title: n.title,
          body: n.body,
          category: n.category,
          priority: n.priority,
          createdAt: n.createdAt,
          read: n.read,
        }));
        // Merge live-added items (already in the store, unread) on top of the
        // server list rather than clobbering them.
        const live = notificationStore.get().list;
        const seenIds = new Set(seeded.map((s) => s.id));
        const liveOnly = live.filter((l) => !seenIds.has(l.id));
        notificationStore.set([...liveOnly, ...seeded]);
      })
      .catch(() => {
        /* clientProxy already alerted */
      });
    return () => {
      active = false;
    };
  }, []);

  const onRead = async (id: string) => {
    // Optimistic: flip the badge immediately, then persist via the endpoint.
    notificationStore.markRead(id);
    try {
      await api.markNotificationRead(id);
    } catch {
      /* alerted; leave optimistic state */
    }
  };

  const onReadAll = async () => {
    const unreadIds = notificationStore
      .get()
      .list.filter((n) => !n.read)
      .map((n) => n.id);
    notificationStore.markAllRead();
    await Promise.all(unreadIds.map((id) => api.markNotificationRead(id).catch(() => undefined)));
  };

  return (
    <AP_Screen>
      <AP_Header title={t('notifications')} showBack onBack={() => navigation.goBack()} />
      <AP_Card title={t('notifications')}>
        {list.length === 0 ? (
          <AP_EmptyState message={L({ en: 'No notifications yet.', ar: 'لا إشعارات بعد.' })} />
        ) : (
          <>
            <AP_Button
              label={L({ en: 'Mark all read', ar: 'تعليم الكل كمقروء' })}
              variant="ghost"
              full
              onPress={onReadAll}
            />
            {list.map((n) => {
              const tone = toTone(n.priority);
              return (
                <AP_ListItem
                  key={n.id}
                  tone={tone}
                  onPress={n.read ? undefined : () => onRead(n.id)}
                  leading={<AP_Icon name={NOTIF_ICON[tone].name} size={20} color={NOTIF_ICON[tone].color} />}
                  title={n.title}
                  description={n.body}
                  time={new Date(n.createdAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                  trailing={
                    <AP_StatusPill
                      label={n.read ? L({ en: 'READ', ar: 'مقروء' }) : tone.toUpperCase()}
                      tone={n.read ? 'low' : tone}
                    />
                  }
                />
              );
            })}
          </>
        )}
      </AP_Card>
    </AP_Screen>
  );
};
