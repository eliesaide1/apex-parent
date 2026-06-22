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
  useI18n,
  colors,
} from '@apex/shared';
import { api, Child, TimelineEventDto, ApprovalDto, MeetingDto } from '../api';

/** Home dashboard — current status hero, pending approvals, today's timeline summary, meetings. All data via clientProxy. */
export const HomeScreen: React.FC = () => {
  const { t, L } = useI18n();
  const [children, setChildren] = useState<Child[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [timeline, setTimeline] = useState<TimelineEventDto[]>([]);
  const [approvals, setApprovals] = useState<ApprovalDto[]>([]);
  const [meetings, setMeetings] = useState<MeetingDto[]>([]);

  // Load children + approvals + meetings once.
  useEffect(() => {
    let active = true;
    (async () => {
      try {
        const [kids, apps, mtgs] = await Promise.all([
          api.listChildren(),
          api.listApprovals(),
          api.listMeetings(),
        ]);
        if (!active) return;
        setChildren(kids);
        setApprovals(apps);
        setMeetings(mtgs);
        if (kids.length && !activeId) setActiveId(kids[0].id);
      } catch {
        /* clientProxy already alerted */
      }
    })();
    return () => {
      active = false;
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
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
      {children.length > 1 ? (
        <View style={styles.childRow}>
          {children.map((c) => (
            <AP_Button
              key={c.id}
              label={c.name}
              variant={c.id === activeId ? 'primary' : 'ghost'}
              onPress={() => setActiveId(c.id)}
            />
          ))}
        </View>
      ) : null}

      <AP_Card hero title={t('currentStatus')}>
        <View style={styles.hero}>
          <AP_Text variant="h2" color={colors.white}>
            {latest ? latest.title : L({ en: 'No updates yet', ar: 'لا تحديثات بعد' })}
          </AP_Text>
          <AP_Text variant="caption" color={colors.white}>
            {latest?.description || L({ en: 'Today', ar: 'اليوم' })}
          </AP_Text>
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
              title={m.type}
              description={m.who}
              trailing={<AP_StatusPill label={t(m.status)} tone={m.status === 'confirmed' ? 'ok' : 'med'} />}
            />
          ))
        )}
      </AP_Card>

      <AP_Card title={t('quickActions')}>
        <View style={styles.actions}>
          <AP_Button label={t('bookMeeting')} variant="ghost" full />
          <AP_Button label={t('newMessage')} variant="ghost" full />
        </View>
      </AP_Card>
    </AP_Screen>
  );
};

const styles = StyleSheet.create({
  childRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
  hero: { marginVertical: 8, gap: 2 },
  actions: { flexDirection: 'row', gap: 8, marginTop: 8 },
});
