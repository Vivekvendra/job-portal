// Local storage keys
export const STORAGE_KEYS = {
  CURRENT_USER: 'jobportal_current_user',
  ALL_USERS: 'jobportal_users_list',
  SAVED_JOBS: 'jobportal_saved_jobs',
  APPLICATIONS: 'jobportal_applications',
  ACTIVITIES: 'jobportal_recent_activities',
  DASHBOARD_STATS: 'jobportal_dashboard_stats',
  COMPANIES_LIST: 'jobportal_companies_list',
  JOBS_LIST: 'jobportal_jobs_list',
};

export const getFromStorage = (key, fallback) => {
  try {
    const item = localStorage.getItem(key);
    return item ? JSON.parse(item) : fallback;
  } catch (error) {
    console.error(`Error reading ${key} from localStorage:`, error);
    return fallback;
  }
};

export const saveToStorage = (key, data) => {
  try {
    localStorage.setItem(key, JSON.stringify(data));
  } catch (error) {
    console.error(`Error saving ${key} to localStorage:`, error);
  }
};

export const removeFromStorage = (key) => {
  try {
    localStorage.removeItem(key);
  } catch (error) {
    console.error(`Error removing ${key} from localStorage:`, error);
  }
};
