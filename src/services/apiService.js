import axios from 'axios';
import { STORAGE_KEYS, getFromStorage, saveToStorage } from '../utils/localStorage';

// Seed companies for robust fallback & immediate availability
export const SEED_COMPANIES = [
  {
    id: 'comp_1',
    name: 'Google LLC',
    logo: 'https://images.unsplash.com/photo-1572021335469-31706a17aaef?auto=format&fit=crop&w=200&q=80',
    industry: 'Software & Cloud',
    location: 'Mountain View, CA',
    website: 'https://careers.google.com',
    email: 'hiring@google.com',
    employees: '150,000+',
    description: 'A global technology leader focused on building tools to organize the world’s information and make it universally accessible and useful. Offering opportunities in cloud computing, quantum, AI, and Android ecosystems.',
    createdAt: '2026-01-10',
  },
  {
    id: 'comp_2',
    name: 'TechNova Global',
    logo: 'https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=200&q=80',
    industry: 'FinTech & AI',
    location: 'New York, NY',
    website: 'https://technovaglobal.io',
    email: 'careers@technovaglobal.io',
    employees: '2,400',
    description: 'Accelerating financial operations with next-generation automated compliance engines, distributed payment systems, and machine-learning models.',
    createdAt: '2026-02-15',
  },
  {
    id: 'comp_3',
    name: 'Stripe Inc',
    logo: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?auto=format&fit=crop&w=200&q=80',
    industry: 'Payment Processing',
    location: 'San Francisco, CA',
    website: 'https://stripe.com/jobs',
    email: 'recruiting@stripe.com',
    employees: '8,000',
    description: 'Financial infrastructure platform for businesses millions worldwide rely on to accept payments, grow their revenue, and accelerate new business models.',
    createdAt: '2026-03-01',
  },
  {
    id: 'comp_4',
    name: 'DataFlow Systems',
    logo: 'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?auto=format&fit=crop&w=200&q=80',
    industry: 'Data Infrastructure',
    location: 'Austin, TX',
    website: 'https://dataflowsystems.tech',
    email: 'talent@dataflowsystems.tech',
    employees: '650',
    description: 'Building real-time data streaming architectures, managed pipeline tools, and high-throughput analytical query engines.',
    createdAt: '2026-03-12',
  },
  {
    id: 'comp_5',
    name: 'Cognitive AI',
    logo: 'https://images.unsplash.com/photo-1620712943543-bcc4688e7485?auto=format&fit=crop&w=200&q=80',
    industry: 'Machine Learning',
    location: 'Boston, MA',
    website: 'https://cognitiveai.example',
    email: 'contact@cognitiveai.example',
    employees: '420',
    description: 'Frontier AI laboratory developing generative reasoning engines, autonomous agents, and multimodal foundation models for enterprise automation.',
    createdAt: '2026-04-05',
  },
  {
    id: 'comp_6',
    name: 'CreativePulse Design',
    logo: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?auto=format&fit=crop&w=200&q=80',
    industry: 'Design & Media',
    location: 'Seattle, WA',
    website: 'https://creativepulse.agency',
    email: 'studio@creativepulse.agency',
    employees: '180',
    description: 'Award-winning digital product studio specializing in human-centered design systems, brand identities, and high-conversion interactive experiences.',
    createdAt: '2026-04-20',
  },
  {
    id: 'comp_7',
    name: 'HealthBridge Medical',
    logo: 'https://images.unsplash.com/photo-1505751172876-fa1923c5c528?auto=format&fit=crop&w=200&q=80',
    industry: 'Healthcare & Biotech',
    location: 'Chicago, IL',
    website: 'https://healthbridge.org',
    email: 'careers@healthbridge.org',
    employees: '4,500',
    description: 'Transforming clinical workflow efficiency and patient care with secure telemetry devices, predictive diagnostics, and telemedicine platforms.',
    createdAt: '2026-05-10',
  },
  {
    id: 'comp_8',
    name: 'GreenFuture Energy',
    logo: 'https://images.unsplash.com/photo-1497440001374-f26997328c1b?auto=format&fit=crop&w=200&q=80',
    industry: 'CleanTech & Energy',
    location: 'Denver, CO',
    website: 'https://greenfuture.energy',
    email: 'jobs@greenfuture.energy',
    employees: '1,100',
    description: 'Pioneering smart grid storage solutions, solar efficiency software, and sustainable battery management systems for zero-carbon communities.',
    createdAt: '2026-06-01',
  },
];

// Third-Party API URL (DummyJSON / JSONPlaceholder fallback)
const DUMMY_JSON_URL = 'https://dummyjson.com/users?limit=10';
const JSON_PLACEHOLDER_URL = 'https://jsonplaceholder.typicode.com/users';

/**
 * Fetch companies from Third-Party API (DummyJSON with JSONPlaceholder fallback)
 * Maps remote API user records into rich Company objects and merges with LocalStorage
 */
export const fetchCompaniesFromAPI = async () => {
  try {
    // Check if we already have locally cached companies
    const localCompanies = getFromStorage(STORAGE_KEYS.COMPANIES_LIST, null);

    // Attempt fetching from DummyJSON
    let apiCompanies = [];
    try {
      const response = await axios.get(DUMMY_JSON_URL, { timeout: 4000 });
      if (response.data && response.data.users) {
        apiCompanies = response.data.users.map((user, idx) => ({
          id: `api_comp_${user.id}`,
          name: user.company?.name || `${user.lastName} Enterprises`,
          logo: user.image || `https://api.dicebear.com/7.x/identicon/svg?seed=${user.company?.name || idx}`,
          industry: user.company?.department || (idx % 2 === 0 ? 'Software & Cloud' : 'FinTech & AI'),
          location: `${user.address?.city || 'San Francisco'}, ${user.address?.stateCode || 'CA'}`,
          website: `https://${(user.company?.name || 'company').toLowerCase().replace(/[^a-z0-9]/g, '')}.com`,
          email: user.email || `contact@${user.company?.name || 'company'}.com`,
          employees: `${((user.id * 137) % 5000) + 120}`,
          description: `Leading provider of ${user.company?.title || 'technology solutions'}, specializing in ${user.company?.department || 'modern services'} and scalable operations worldwide.`,
          createdAt: '2026-01-01',
          source: 'DummyJSON API',
        }));
      }
    } catch (dummyErr) {
      console.warn('DummyJSON fetch failed, trying JSONPlaceholder fallback...', dummyErr.message);
      try {
        const fallbackRes = await axios.get(JSON_PLACEHOLDER_URL, { timeout: 4000 });
        if (Array.isArray(fallbackRes.data)) {
          apiCompanies = fallbackRes.data.map((user, idx) => ({
            id: `api_comp_${user.id}`,
            name: user.company?.name || user.name,
            logo: `https://api.dicebear.com/7.x/identicon/svg?seed=${user.company?.name || idx}`,
            industry: idx % 2 === 0 ? 'Software & Cloud' : 'Data Infrastructure',
            location: `${user.address?.city || 'New York'}, USA`,
            website: `https://${user.website}`,
            email: user.email,
            employees: `${(user.id * 250) + 150}`,
            description: `${user.company?.catchPhrase || 'Leading enterprise platform'} - ${user.company?.bs || 'providing premier enterprise software solutions'}.`,
            createdAt: '2026-01-01',
            source: 'JSONPlaceholder API',
          }));
        }
      } catch (fallbackErr) {
        console.warn('All external APIs failed or offline. Using local seed data.', fallbackErr.message);
      }
    }

    // Merge: seeded/local companies take priority, then non-duplicate API companies
    const existingList = localCompanies || SEED_COMPANIES;
    const existingNames = new Set(existingList.map((c) => c.name.toLowerCase()));

    const uniqueNewCompanies = apiCompanies.filter(
      (c) => !existingNames.has(c.name.toLowerCase())
    );

    const merged = [...existingList, ...uniqueNewCompanies];
    saveToStorage(STORAGE_KEYS.COMPANIES_LIST, merged);
    return { data: merged, source: apiCompanies.length > 0 ? 'Third-Party API (DummyJSON)' : 'Local Storage Cache' };
  } catch (error) {
    console.error('Error in fetchCompaniesFromAPI:', error);
    const fallback = getFromStorage(STORAGE_KEYS.COMPANIES_LIST, SEED_COMPANIES);
    return { data: fallback, source: 'Offline Fallback' };
  }
};
