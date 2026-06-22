/**
 * Single backend for BOTH apps (CONVENTIONS.md §0). Override at build time via
 * EXPO_PUBLIC_API_URL; defaults to the local backend.
 */
export const API_BASE_URL =
  process.env.EXPO_PUBLIC_API_URL ?? 'http://localhost:3000/api';
