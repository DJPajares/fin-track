export interface DatabaseConfig {
  url: string;
  name: string;
  description: string;
}

export const getDatabaseConfig = (): DatabaseConfig => {
  // Get the current Git branch from Vercel environment
  const gitBranch = process.env.VERCEL_GIT_COMMIT_REF;
  const isVercel = process.env.VERCEL === '1';

  console.log('gitBranch', gitBranch);
  console.log('isVercel', isVercel);

  // Local development
  if (!isVercel) {
    return {
      url: 'mongodb://localhost:27017/fintrack',
      name: 'local',
      description: 'Local development database',
    };
  }

  // Production database (main branch)
  if (gitBranch === 'main') {
    return {
      url: 'mongodb+srv://wonderBOi:root@fintrack.e4xztwf.mongodb.net/fintrack?retryWrites=true&w=majority&appName=fintrack',
      name: 'production',
      description: 'Production database for main branch',
    };
  }

  // Development database (develop branch or any other branch)
  if (gitBranch === 'develop') {
    return {
      url: 'mongodb+srv://wonderBOi:root@fintrack.e4xztwf.mongodb.net/fintrack-private?retryWrites=true&w=majority&appName=fintrack',
      name: 'development',
      description: 'Development database for develop branch',
    };
  }

  // Fallback to development for any other branches
  return {
    url: 'mongodb+srv://wonderBOi:root@fintrack.e4xztwf.mongodb.net/fintrack?retryWrites=true&w=majority&appName=fintrack',
    name: 'development',
    description: `Development database for ${gitBranch} branch`,
  };
};

export const getDatabaseUrl = (): string => {
  return getDatabaseConfig().url;
};
