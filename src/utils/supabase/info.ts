const env = process.env as Record<string, string | undefined>;

const fallbackProjectId = 'hdgmhhvactvnxpzlmpaj';
const fallbackAnonKey =
  'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhkZ21oaHZhY3R2bnhwemxtcGFqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUxOTk0MTUsImV4cCI6MjA5MDc3NTQxNX0.jh41rc00UkXjGYLAScAbkC98tMbj2GQipBoN3azwCMo';

const urlProjectId = env.REACT_APP_SUPABASE_URL
  ?.replace('https://', '')
  .replace('.supabase.co', '');

export const projectId =
  env.REACT_APP_SUPABASE_PROJECT_ID || urlProjectId || fallbackProjectId;

export const publicAnonKey =
  env.REACT_APP_SUPABASE_ANON_KEY || fallbackAnonKey;

export const supabaseUrl =
  env.REACT_APP_SUPABASE_URL || `https://${projectId}.supabase.co`;
