import { clientProxy, Paginated } from '@apex/shared';

/**
 * Parent-app API surface. Every call goes through the shared clientProxy — no
 * screen ever touches axios directly. These mirror the backend bounded contexts
 * (Foundation / DailyOps / Communication / Records) used by the parent role.
 */

export interface Child {
  id: string;
  name: string;
  grade: string;
  initials: string;
  color: string;
}

export interface TimelineEventDto {
  id: string;
  time: string;
  title: string;
  description: string;
  tone: 'high' | 'med' | 'low' | 'ok' | 'default';
}

export interface ApprovalDto {
  id: string;
  childId: string;
  title: string;
  by: string;
  description: string;
  priority: 'high' | 'med' | 'low';
  done: boolean;
}

export interface MeetingDto {
  id: string;
  type: string;
  who: string;
  when: string;
  status: 'confirmed' | 'pending' | 'declined';
}

/** Mirrors the backend NotificationDto (parent-bff.service.ts). */
export interface NotificationDto {
  id: string;
  title: string;
  body: string;
  category: string;
  priority: 'high' | 'medium' | 'low';
  read: boolean;
  createdAt: string;
}

export const api = {
  // Foundation
  listChildren: () => clientProxy.get<Child[]>('/parent/children'),

  // DailyOps
  childTimeline: (childId: string) =>
    clientProxy.get<TimelineEventDto[]>(`/parent/children/${childId}/timeline`),

  // Communication
  listApprovals: () => clientProxy.get<ApprovalDto[]>('/parent/approvals'),
  actApproval: (id: string, approve: boolean) =>
    clientProxy.post<ApprovalDto>(`/parent/approvals/${id}/${approve ? 'approve' : 'decline'}`),
  listMeetings: () => clientProxy.get<MeetingDto[]>('/parent/meetings'),
  listNotifications: () => clientProxy.get<NotificationDto[]>('/parent/notifications'),
  markNotificationRead: (id: string) =>
    clientProxy.post<NotificationDto>(`/parent/notifications/${id}/read`),
  bookMeeting: (body: { type: string; with: string; preferredTime: string; note?: string }) =>
    clientProxy.post<MeetingDto>('/parent/meetings', body),
  cancelMeeting: (id: string) => clientProxy.delete<void>(`/parent/meetings/${id}`),

  // Records
  records: (childId: string, key: string) =>
    clientProxy.get<Paginated<unknown>>(`/parent/children/${childId}/records/${key}`),

  // Auth
  login: (email: string, password: string) =>
    clientProxy.post<{ token: string }>('/auth/login', { email, password }),
};
