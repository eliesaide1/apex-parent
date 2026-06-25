import React, { useEffect, useState } from 'react';
import {
  AP_Screen,
  AP_Card,
  AP_Timeline,
  AP_EmptyState,
  useI18n,
} from '@apex/shared';
import { api, TimelineEventDto } from '../api';
import { useChildren } from '../navigation/ChildContext';

/** Full per-child timeline feed (the studentEvent stream). Data via clientProxy. */
export const TimelineScreen: React.FC = () => {
  const { t, L } = useI18n();
  // Active child comes from ChildContext (switcher chips live in the header).
  const { activeChildId: activeId } = useChildren();
  const [events, setEvents] = useState<TimelineEventDto[]>([]);

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
