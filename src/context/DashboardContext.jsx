import React, { createContext, useContext, useState, useEffect } from 'react';
import {
  STORAGE_KEYS,
  getFromStorage,
  saveToStorage,
} from '../utils/localStorage';
import {
  INITIAL_STATS,
  INITIAL_ACTIVITIES,
  SAMPLE_JOBS,
} from '../utils/mockData';
import { toast } from 'react-toastify';

const DashboardContext = createContext(null);

export const DashboardProvider = ({ children }) => {
  const [stats, setStats] = useState(() =>
    getFromStorage(STORAGE_KEYS.DASHBOARD_STATS, INITIAL_STATS)
  );
  const [activities, setActivities] = useState(() =>
    getFromStorage(STORAGE_KEYS.ACTIVITIES, INITIAL_ACTIVITIES)
  );
  const [jobs, setJobs] = useState(SAMPLE_JOBS);
  const [savedJobs, setSavedJobs] = useState(() =>
    getFromStorage(STORAGE_KEYS.SAVED_JOBS, ['job_1', 'job_3'])
  );
  const [applications, setApplications] = useState(() =>
    getFromStorage(STORAGE_KEYS.APPLICATIONS, [
      {
        id: 'app_1',
        jobId: 'job_1',
        title: 'Senior Frontend Engineer',
        company: 'TechNova Global',
        appliedDate: '2026-10-25',
        status: 'In Review',
      },
    ])
  );
  const [isDataLoading, setIsDataLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsDataLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, []);

  // Toggle Save Job
  const toggleSaveJob = (jobId) => {
    let updated;
    const isCurrentlySaved = savedJobs.includes(jobId);
    if (isCurrentlySaved) {
      updated = savedJobs.filter((id) => id !== jobId);
      toast.info('Job removed from bookmarks');
    } else {
      updated = [...savedJobs, jobId];
      toast.success('Job saved to your bookmarks!');
      addActivity({
        type: 'job_saved',
        user: 'You',
        target: jobs.find((j) => j.id === jobId)?.title || 'Job Listing',
        role: jobs.find((j) => j.id === jobId)?.company || 'Company',
        time: 'Just now',
        status: 'Saved',
        iconColor: 'indigo',
      });
    }
    setSavedJobs(updated);
    saveToStorage(STORAGE_KEYS.SAVED_JOBS, updated);

    setStats((prev) => {
      const newStats = {
        ...prev,
        savedJobsCount: updated.length,
      };
      saveToStorage(STORAGE_KEYS.DASHBOARD_STATS, newStats);
      return newStats;
    });
  };

  // Add Recent Activity
  const addActivity = (act) => {
    const newActivity = {
      id: `act_${Date.now()}`,
      time: 'Just now',
      ...act,
    };
    const updated = [newActivity, ...activities.slice(0, 14)];
    setActivities(updated);
    saveToStorage(STORAGE_KEYS.ACTIVITIES, updated);
  };

  // Quick Post Job (for Recruiters)
  const postNewJob = (newJobData) => {
    const newJob = {
      id: `job_${Date.now()}`,
      postedDate: 'Just now',
      status: 'Open',
      applicantsCount: 0,
      isSaved: false,
      logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=100&q=80',
      ...newJobData,
    };
    const updatedJobs = [newJob, ...jobs];
    setJobs(updatedJobs);

    setStats((prev) => {
      const newStats = {
        ...prev,
        totalJobs: prev.totalJobs + 1,
        activeJobPostings: prev.activeJobPostings + 1,
      };
      saveToStorage(STORAGE_KEYS.DASHBOARD_STATS, newStats);
      return newStats;
    });

    addActivity({
      type: 'job_posted',
      user: 'You',
      target: newJob.title,
      role: newJob.company,
      status: 'Active',
      iconColor: 'purple',
    });

    toast.success(`Job "${newJob.title}" posted successfully!`);
    return newJob;
  };

  // Quick Apply to Job
  const applyToJob = (job) => {
    const alreadyApplied = applications.some((app) => app.jobId === job.id);
    if (alreadyApplied) {
      toast.warning('You have already applied for this position!');
      return false;
    }

    const newApp = {
      id: `app_${Date.now()}`,
      jobId: job.id,
      title: job.title,
      company: job.company,
      appliedDate: '2026-10-27',
      status: 'Submitted',
    };
    const updatedApps = [newApp, ...applications];
    setApplications(updatedApps);
    saveToStorage(STORAGE_KEYS.APPLICATIONS, updatedApps);

    setStats((prev) => {
      const newStats = {
        ...prev,
        totalApplications: prev.totalApplications + 1,
      };
      saveToStorage(STORAGE_KEYS.DASHBOARD_STATS, newStats);
      return newStats;
    });

    addActivity({
      type: 'application_submitted',
      user: 'You',
      target: job.company,
      role: job.title,
      status: 'Submitted',
      iconColor: 'blue',
    });

    toast.success(`Successfully applied to ${job.title} at ${job.company}!`);
    return true;
  };

  return (
    <DashboardContext.Provider
      value={{
        stats,
        activities,
        jobs,
        savedJobs,
        applications,
        isDataLoading,
        toggleSaveJob,
        postNewJob,
        applyToJob,
        addActivity,
      }}
    >
      {children}
    </DashboardContext.Provider>
  );
};

export const useDashboard = () => {
  const context = useContext(DashboardContext);
  if (!context) {
    throw new Error('useDashboard must be used within a DashboardProvider');
  }
  return context;
};
