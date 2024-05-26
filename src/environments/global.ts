export const firebaseTables = {
  projects: 'projects',
  users: 'users',
}

export const environment = {
  authCheckDelay: 0,
  messageTime: 5000,
}

export const pathNames = {
  projects: {
    projects: 'projects',
    projectOverview: (projectId: string) => `projects/${projectId}/overview`,
    projectDangerZone: (projectId: string) => `projects/${projectId}/dangerzone`
  },
  auth: {
    login: 'login',
    register: 'register',
  }
};