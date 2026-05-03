/**
 * Role constants and utilities.
 */

export const ROLES = {
  STUDENT: 'STUDENT',
  TUTOR: 'TUTOR',
  ADMIN: 'ADMIN',
} as const;

export type Role = typeof ROLES[keyof typeof ROLES];

export const ROLE_LABELS: Record<Role, string> = {
  STUDENT: 'Student',
  TUTOR: 'Tutor',
  ADMIN: 'Administrator',
};

export function getRoleLabel(role: Role): string {
  return ROLE_LABELS[role];
}
