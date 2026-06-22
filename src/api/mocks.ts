import { registerMocks, mockError, setMockLatency } from '@apex/shared';

/**
 * Parent-app offline seed. Registers stub responses for the exact routes the
 * parent screens call through clientProxy (see ./index.ts). The wiring is real:
 * screens -> clientProxy -> axios -> interceptors -> this seed. Swap to the live
 * backend by simply not calling registerParentMocks() (or disableMocks()).
 *
 * Data mirrors the apex-parent-app.html prototype (child status + timeline).
 */
export function registerParentMocks(): void {
  setMockLatency(250);

  registerMocks({
    // --- Auth (CONVENTIONS §2 — JWT in claims) ---
    'POST /auth/login': (req) => {
      const body = (req.body ?? {}) as { email?: string; password?: string };
      if (!body.email) {
        mockError(
          422,
          'VALIDATION_ERROR',
          'Email is required.',
          'البريد الإلكتروني مطلوب.',
        );
      }
      // demo JWT-ish token; real backend returns a signed JWT
      return { token: `mock.parent.${Date.now()}` };
    },

    // --- Foundation: children ---
    'GET /parent/children': () => [
      { id: 'c1', name: 'Lara Khalil', grade: 'Grade 6 — B', initials: 'LK', color: '#1f6f78' },
      { id: 'c2', name: 'Omar Khalil', grade: 'Grade 3 — A', initials: 'OK', color: '#3f7cac' },
    ],

    // --- DailyOps: per-child timeline (the studentEvent feed) ---
    'GET /parent/children/:id/timeline': (req) => {
      if (req.params.id === 'c2') {
        return [
          { id: 'e1', time: '10:30 AM', title: 'At nurse', description: 'Headache — resting', tone: 'high' },
          { id: 'e2', time: '8:00 AM', title: 'Present in Homeroom', description: 'Marked present', tone: 'ok' },
          { id: 'e3', time: '7:28 AM', title: 'Entered school', description: 'Main gate', tone: 'ok' },
        ];
      }
      return [
        { id: 'e1', time: '12:15 PM', title: 'Lunch break', description: '', tone: 'med' },
        { id: 'e2', time: '10:30 AM', title: 'Positive note', description: 'Great participation — Ms. Rana', tone: 'ok' },
        { id: 'e3', time: '9:10 AM', title: 'Present in Math', description: 'Period 3', tone: 'default' },
        { id: 'e4', time: '8:00 AM', title: 'Present in Homeroom', description: 'Marked present', tone: 'ok' },
        { id: 'e5', time: '7:35 AM', title: 'Entered school', description: 'Main gate', tone: 'ok' },
      ];
    },

    // --- Communication: approvals ---
    'GET /parent/approvals': () => [
      {
        id: 'a1',
        childId: 'c1',
        title: 'Science Museum field trip',
        by: 'Ms. Rana',
        description: 'Consent required for Fri 20 June. Cost: $15.',
        priority: 'med',
        done: false,
      },
    ],
    'POST /parent/approvals/:id/approve': (req) => ({
      id: req.params.id, childId: 'c1', title: 'Science Museum field trip', by: 'Ms. Rana', description: '', priority: 'med', done: true,
    }),
    'POST /parent/approvals/:id/decline': (req) => ({
      id: req.params.id, childId: 'c1', title: 'Science Museum field trip', by: 'Ms. Rana', description: '', priority: 'med', done: true,
    }),

    // --- Communication: meetings ---
    'GET /parent/meetings': () => [
      { id: 'm1', type: 'Parent–Teacher meeting', who: 'Ms. Rana · Mon 18 June, 3:30 PM', when: 'Mon 18 June, 3:30 PM', status: 'confirmed' },
    ],
  });
}
