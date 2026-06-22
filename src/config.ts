/**
 * Single backend for BOTH apps (CONVENTIONS.md §0). Override at build time via
 * the RN_API_URL env var (inlined by Metro/Babel); defaults to the local backend.
 */
export const API_BASE_URL =
  process.env.RN_API_URL ?? 'http://localhost:3000/api';
