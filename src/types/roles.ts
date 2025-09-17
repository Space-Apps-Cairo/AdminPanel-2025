// roles.ts
export const Roles = {
  ADMIN: "admin",
  MATERIAL: "material",
  REGISTRATION: "registration",
  LOGISTICS: "logistics",
} as const;

export const Permissions = {
  MANAGE_USERS: "manage_users",
  CREATE_POSTS: "create_posts",
  VIEW_REPORTS: "view_reports",
} as const;

export const RolePermissions: Record<string, string[]> = {
  [Roles.ADMIN]: [
    Permissions.MANAGE_USERS,
    Permissions.CREATE_POSTS,
    Permissions.VIEW_REPORTS,
  ],
  [Roles.EDITOR]: [Permissions.CREATE_POSTS],
  [Roles.VIEWER]: [Permissions.VIEW_REPORTS],
};
