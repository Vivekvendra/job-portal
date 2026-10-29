import React, { createContext, useContext, useState, useEffect, useCallback } from 'react';
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
import { SEED_COMPANIES, fetchCompaniesFromAPI } from '../services/apiService';
import { toast } from 'react-toastify';

const DashboardContext = createContext(null);

export const DashboardProvider = ({ children }) => {
  // Stats & Activities
  const [stats, setStats] = useState(() =>
    getFromStorage(STORAGE_KEYS.DASHBOARD_STATS, INITIAL_STATS)
  );
  const [activities, setActivities] = useState(() =>
    getFromStorage(STORAGE_KEYS.ACTIVITIES, INITIAL_ACTIVITIES)
  );

  // Jobs Management
  const [jobs, setJobs] = useState(() => {
    const saved = getFromStorage(STORAGE_KEYS.JOBS_LIST, null);
    if (!saved || saved.length === 0) return SAMPLE_JOBS;
    const existingIds = new Set(saved.map((j) => j.id));
    const newDefaults = SAMPLE_JOBS.filter((j) => !existingIds.has(j.id));
    if (newDefaults.length > 0) {
      const merged = [...saved, ...newDefaults];
      saveToStorage(STORAGE_KEYS.JOBS_LIST, merged);
      return merged;
    }
    return saved;
  });

  // Companies Management
  const [companies, setCompanies] = useState(() =>
    getFromStorage(STORAGE_KEYS.COMPANIES_LIST, SEED_COMPANIES)
  );
  const [isCompaniesLoading, setIsCompaniesLoading] = useState(false);
  const [companiesError, setCompaniesError] = useState(null);
  const [apiSource, setApiSource] = useState('Local Storage Cache');

  // Bookmarks & Applications
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

  // Initial fetch from Third-Party API
  const loadCompanies = useCallback(async () => {
    setIsCompaniesLoading(true);
    setCompaniesError(null);
    try {
      const result = await fetchCompaniesFromAPI();
      setCompanies(result.data);
      setApiSource(result.source);
    } catch (err) {
      setCompaniesError('Failed to load companies from API. Displaying cached records.');
      console.error(err);
    } finally {
      setIsCompaniesLoading(false);
    }
  }, []);

  useEffect(() => {
    loadCompanies();
    const timer = setTimeout(() => {
      setIsDataLoading(false);
    }, 400);
    return () => clearTimeout(timer);
  }, [loadCompanies]);

  // Add Recent Activity helper
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

  // ==========================================
  // COMPANY MANAGEMENT ACTIONS
  // ==========================================

  // Add Company
  const addCompany = (companyData) => {
    const newCompany = {
      id: `comp_${Date.now()}`,
      createdAt: new Date().toISOString().split('T')[0],
      logo:
        companyData.logo ||
        `https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=200&q=80`,
      ...companyData,
    };

    const updated = [newCompany, ...companies];
    setCompanies(updated);
    saveToStorage(STORAGE_KEYS.COMPANIES_LIST, updated);

    // Update stats
    setStats((prev) => {
      const newStats = {
        ...prev,
        totalCompanies: prev.totalCompanies + 1,
      };
      saveToStorage(STORAGE_KEYS.DASHBOARD_STATS, newStats);
      return newStats;
    });

    addActivity({
      type: 'company_added',
      user: 'You',
      target: newCompany.name,
      role: newCompany.industry,
      status: 'Added',
      iconColor: 'emerald',
    });

    toast.success(`Company "${newCompany.name}" added successfully!`);
    return newCompany;
  };

  // Edit Company
  const updateCompany = (id, updatedData) => {
    const updated = companies.map((c) =>
      c.id === id ? { ...c, ...updatedData, updatedAt: new Date().toISOString() } : c
    );
    setCompanies(updated);
    saveToStorage(STORAGE_KEYS.COMPANIES_LIST, updated);
    toast.success('Company details updated successfully!');
  };

  // Delete Company
  const deleteCompany = (id) => {
    const targetComp = companies.find((c) => c.id === id);
    const updated = companies.filter((c) => c.id !== id);
    setCompanies(updated);
    saveToStorage(STORAGE_KEYS.COMPANIES_LIST, updated);

    // Decrement stats
    setStats((prev) => {
      const newStats = {
        ...prev,
        totalCompanies: Math.max(0, prev.totalCompanies - 1),
      };
      saveToStorage(STORAGE_KEYS.DASHBOARD_STATS, newStats);
      return newStats;
    });

    toast.info(`Company "${targetComp?.name || 'Item'}" deleted.`);
  };

  // ==========================================
  // JOB POSTING ACTIONS
  // ==========================================

  // Create Job Posting
  const addJob = (jobData) => {
    // Skills can be array or string
    let parsedSkills = jobData.skills;
    if (typeof parsedSkills === 'string') {
      parsedSkills = parsedSkills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }
    if (!parsedSkills || parsedSkills.length === 0) {
      parsedSkills = ['React', 'JavaScript', 'Communication'];
    }

    const newJob = {
      id: `job_${Date.now()}`,
      postedDate: 'Just now',
      applicantsCount: 0,
      isSaved: false,
      status: jobData.status || 'Open',
      logo:
        jobData.logo ||
        'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=100&q=80',
      ...jobData,
      skills: parsedSkills,
    };

    const updatedJobs = [newJob, ...jobs];
    setJobs(updatedJobs);
    saveToStorage(STORAGE_KEYS.JOBS_LIST, updatedJobs);

    // Update stats
    setStats((prev) => {
      const newStats = {
        ...prev,
        totalJobs: prev.totalJobs + 1,
        activeJobPostings:
          newJob.status === 'Open' ? prev.activeJobPostings + 1 : prev.activeJobPostings,
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

    toast.success(`Job "${newJob.title}" created successfully!`);
    return newJob;
  };

  // Edit Job
  const updateJob = (id, updatedData) => {
    let parsedSkills = updatedData.skills;
    if (typeof parsedSkills === 'string') {
      parsedSkills = parsedSkills
        .split(',')
        .map((s) => s.trim())
        .filter(Boolean);
    }

    const previousJob = jobs.find((j) => j.id === id);
    const updated = jobs.map((j) => {
      if (j.id === id) {
        return {
          ...j,
          ...updatedData,
          skills: parsedSkills || j.skills,
          updatedAt: new Date().toISOString(),
        };
      }
      return j;
    });

    setJobs(updated);
    saveToStorage(STORAGE_KEYS.JOBS_LIST, updated);

    // If status changed, adjust active count
    if (previousJob && updatedData.status && previousJob.status !== updatedData.status) {
      setStats((prev) => {
        const delta = updatedData.status === 'Open' ? 1 : -1;
        const newStats = {
          ...prev,
          activeJobPostings: Math.max(0, prev.activeJobPostings + delta),
        };
        saveToStorage(STORAGE_KEYS.DASHBOARD_STATS, newStats);
        return newStats;
      });
    }

    toast.success('Job posting updated successfully!');
  };

  // Delete Job
  const deleteJob = (id) => {
    const targetJob = jobs.find((j) => j.id === id);
    const updated = jobs.filter((j) => j.id !== id);
    setJobs(updated);
    saveToStorage(STORAGE_KEYS.JOBS_LIST, updated);

    // Update stats
    setStats((prev) => {
      const wasOpen = targetJob?.status === 'Open';
      const newStats = {
        ...prev,
        totalJobs: Math.max(0, prev.totalJobs - 1),
        activeJobPostings: wasOpen
          ? Math.max(0, prev.activeJobPostings - 1)
          : prev.activeJobPostings,
      };
      saveToStorage(STORAGE_KEYS.DASHBOARD_STATS, newStats);
      return newStats;
    });

    toast.info(`Job "${targetJob?.title || 'Listing'}" deleted.`);
  };

  // Quick toggle Open / Closed
  const toggleJobStatus = (id) => {
    const job = jobs.find((j) => j.id === id);
    if (!job) return;
    const newStatus = job.status === 'Open' ? 'Closed' : 'Open';
    updateJob(id, { status: newStatus });
    toast.success(`Job marked as ${newStatus}`);
  };

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
        // Companies
        companies,
        isCompaniesLoading,
        companiesError,
        apiSource,
        addCompany,
        updateCompany,
        deleteCompany,
        refetchCompanies: loadCompanies,
        // Jobs
        jobs,
        addJob,
        updateJob,
        deleteJob,
        toggleJobStatus,
        // Bookmarks & Applications
        savedJobs,
        applications,
        isDataLoading,
        toggleSaveJob,
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
