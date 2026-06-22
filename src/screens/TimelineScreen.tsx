import React, { useEffect, useState } from 'react';
import { View, StyleSheet } from 'react-native';
import {
  AP_Screen,
  AP_Card,
  AP_Timeline,
  AP_Button,
  AP_EmptyState,
  useI18n,
} from '@apex/shared';
import { api, Child, TimelineEventDto } from '../api';

/** Full per-child timeline feed (the studentEvent stream). Data via clientProxy. */
export const TimelineScreen: React.FC = () => {
  const { t, L } = useI18n();
  const [children, setChildren] = useState<Child[]>([]);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [events, setEvents] = useState<TimelineEventDto[]>([]);

  useEffect(() => {
    let active = true;
    api
      .listChildren()
      .then((kids) => {
        if (!active) return;
        setChildren(kids);
        if (kids.length) setActiveId(kids[0].id);
      })
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, []);

  useEffect(() => {
    if (!activeId) return;
    let active = true;
    api
      .childTimeline(activeId)
      .then((evts) => active && setEvents(evts))
      .catch(() => undefined);
    return () => {
      active = false;
    };
  }, [activeId]);

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

      <AP_Card title={t('todayTimeline')}>
        {events.length === 0 ? (
          <AP_EmptyState message={L({ en: 'No events yet today.', ar: 'لا أحداث اليوم بعد.' })} />
        ) : (
          <AP_Timeline
            events={events.map((e) => ({
              time: e.time,
              title: e.title,
              description: e.description || undefined,
              tone: e.tone,
            }))}
          />
        )}
      </AP_Card>

      <AP_EmptyState
        message={L({
          en: 'Every event today appears here in real time.',
          ar: 'كل أحداث اليوم تظهر هنا فور تسجيلها.',
        })}
      />
    </AP_Screen>
  );
};

const styles = StyleSheet.create({
  childRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8, marginBottom: 12 },
});
