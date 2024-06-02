export const firebaseTables = {
  projects: 'projects',
  users: 'users',
  invites: 'invites',
  mutations: 'mutations',
  categories: 'categories',
}

export const environment = {
  authCheckDelay: 0,
  messageTime: 5000,
}

export const pathNames = {
  projects: {
    projects: 'projects',
    projectOverview: (projectId: string) => `projects/${projectId}/overview`,
    mutations: (projectId: string) => `projects/${projectId}/mutations`,
    projectDangerZone: (projectId: string) => `projects/${projectId}/dangerzone`
  },
  auth: {
    login: 'login',
    register: 'register',
  }
};

export const emptyCategoryFilter = "emptyCategoryFilter";