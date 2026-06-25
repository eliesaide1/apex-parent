import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  AP_Screen,
  AP_Card,
  AP_Text,
  AP_Timeline,
  AP_ListItem,
  AP_Button,
  AP_StatusPill,
  AP_EmptyState,
  AP_Icon,
  useI18n,
  colors,
} from '@apex/shared';
import { api, TimelineEventDto, ApprovalDto, MeetingDto } from '../api';
import { useChildren } from '../navigation/ChildContext';

/** Home dashboard — current status hero, pending approvals, today's timeline summary, meetings. All data via clientProxy. */
export const HomeScreen: React.FC = () => {
  const { t, L } = useI18n();
  // Child switcher state now lives in ChildContext (rendered in the teal header).
  const { children, activeChildId: activeId } = useChildren();
  const [timeline, setTimeline] = useState<TimelineEventDto[]>([]);
  const [approvals, setApprovals] = useState<ApprovalDto[]>([]);
  const [meetings, setMeetings] = useState<MeetingDto[]>([]);

  // Load approvals + meetings once (children come from context).
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [apps, mtgs] = await Promise.all([api.listApprovals(), api.listMeetings()]);
        if (!active) return;
        setApprovals(apps);
        setMeetings(mtgs);
      } catch {
        /* clientProxy already alerted */
      }
    })();
    return () => {
      active = false;
    };
  }, []);

  // Reload the timeline whenever the active child changes.
  useEffect(() => {
    if (!activeId) return;
    let active = true;
    api
      .childTimeline(activeId)
      .then((evts) => active && setTimeline(evts))
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [activeId]);

  const onApproval = async (id: string, approve: boolean) => {
    try {
      await api.actApproval(id, approve);
      setApprovals((list) => list.filter((a) => a.id !== id));
    } catch {
      /* alerted */
    }
  };

  const child = children.find((c) => c.id === activeId);
  const latest = timeline[0];

  return (
    <AP_Screen>
      <AP_Card hero title={t('currentStatus')}>
        <View style={styles.heroRow}>
          <View style={styles.heroPulse}>
            <AP_Icon name="book" size={26} color={colors.white} />
          </View>
          <View style={styles.hero}>
            <AP_Text variant="h2" color={colors.white}>
              {latest ? latest.title : L({ en: 'No updates yet', ar: 'لا تحديثات بعد' })}
            </AP_Text>
            <AP_Text variant="caption" color={colors.white}>
              {latest?.description || L({ en: 'Today', ar: 'اليوم' })}
            </AP_Text>
          </View>
        </View>
        <AP_Text variant="caption" color={colors.white}>
          {t('arrived')}: {timeline[timeline.length - 1]?.time ?? '—'}
          {child ? ` · ${child.grade}` : ''}
        </AP_Text>
      </AP_Card>

      <AP_Card title={t('pendingApprovals')}>
        {approvals.length === 0 ? (
          <AP_EmptyState message={L({ en: 'No approvals pending.', ar: 'لا موافقات معلّقة.' })} />
        ) : (
          approvals.map((a) => (
            <AP_ListItem
              key={a.id}
              tone={a.priority}
              leading={
                <AP_Icon
                  name={a.priority === 'high' ? 'alert' : a.priority === 'med' ? 'file' : 'check'}
                  size={20}
                  color={
                    a.priority === 'high' ? colors.high : a.priority === 'med' ? colors.medInk : colors.low
                  }
                />
              }
              title={a.title}
              description={a.description}
              footer={
                <View style={styles.actions}>
                  <AP_Button label={t('approve')} full onPress={() => onApproval(a.id, true)} />
                  <AP_Button label={t('decline')} variant="danger" full onPress={() => onApproval(a.id, false)} />
                </View>
              }
            />
          ))
        )}
      </AP_Card>

      <AP_Card title={t('todayTimeline')}>
        {timeline.length === 0 ? (
          <AP_EmptyState message={L({ en: 'No events yet today.', ar: 'لا أحداث اليوم بعد.' })} />
        ) : (
          <AP_Timeline
            events={timeline.slice(0, 3).map((e) => ({
              time: e.time,
              title: e.title,
              description: e.description || undefined,
              tone: e.tone,
            }))}
          />
        )}
      </AP_Card>

      <AP_Card title={t('upcomingMeetings')}>
        {meetings.length === 0 ? (
          <AP_EmptyState message={L({ en: 'No upcoming meetings.', ar: 'لا اجتماعات قادمة.' })} />
        ) : (
          meetings.map((m) => (
            <AP_ListItem
              key={m.id}
              tone="low"
              leading={<AP_Icon name="calendar" size={20} color={colors.low} />}
              title={m.type}
              description={m.who}
              trailing={<AP_StatusPill label={t(m.status)} tone={m.status === 'confirmed' ? 'ok' : 'med'} />}
            />
          ))
        )}
      </AP_Card>

      <AP_Card title={t('quickActions')}>
        <View style={styles.actions}>
          <AP_Button
            label={t('bookMeeting')}
            variant="ghost"
            full
            icon={<AP_Icon name="calendar" size={17} color={colors.brand} />}
          />
          <AP_Button
            label={t('newMessage')}
            variant="ghost"
            full
            icon={<AP_Icon name="message" size={17} color={colors.brand} />}
          />
        </View>
      </AP_Card>
    </AP_Screen>
  );
};

const styles = StyleSheet.create({
  heroRow: { flexDirection: 'row', alignItems: 'center', gap: 12, marginVertical: 8 },
  heroPulse: {
    width: 46,
    height: 46,
    borderRadius: 999,
    backgroundColor: 'rgba(255,255,255,0.18)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  hero: { flex: 1, gap: 2 },
  actions: { flexDirection: 'row', gap: 8, marginTop: 8 },
});
