# Branch-Based Database Configuration

This approach uses Git branch names to automatically select the appropriate database without using environment variables.

## How It Works

The system checks the `VERCEL_GIT_COMMIT_REF` environment variable (automatically set by Vercel) to determine which database to use:

- **`main` branch** → Production database
- **`develop` branch** → Development database
- **Any other branch** → Development database (fallback)
- **Local development** → Local MongoDB

## Configuration

### Update Database URLs

Edit `src/config/databaseConfig.ts` and replace the placeholder URLs with your actual MongoDB Atlas connection strings:

```typescript
// Production database (main branch)
if (gitBranch === 'main') {
  return {
    url: 'mongodb+srv://your-actual-production-connection-string',
    name: 'production',
    description: 'Production database for main branch',
  };
}

// Development database (develop branch)
if (gitBranch === 'develop') {
  return {
    url: 'mongodb+srv://your-actual-dev-connection-string',
    name: 'development',
    description: 'Development database for develop branch',
  };
}
```

## Vercel Deployment

1. **Production (main branch):**

   - Push to `main` branch
   - Automatically uses production database
   - Deploys to your production domain

2. **Development (develop branch):**
   - Push to `develop` branch
   - Automatically uses development database
   - Deploys to your preview domain

## Benefits

✅ **Simple & Reliable:** Just check the branch name
✅ **No Environment Variables:** No need to set `DATABASE_URL` in Vercel
✅ **Automatic:** Works automatically based on Git workflow
✅ **Branch-Based:** Different branches use different databases
✅ **Local Development:** Works seamlessly with local MongoDB

## Migration Steps

1. **Remove Environment Variables:**

   - Go to Vercel dashboard
   - Remove `DATABASE_URL` from environment variables

2. **Update Configuration:**

   - Edit `src/config/databaseConfig.ts`
   - Replace placeholder URLs with your actual MongoDB Atlas URLs

3. **Deploy:**
   - Push to `develop` branch to test
   - Push to `main` branch for production

## Example Workflow

```bash
# Development
git checkout develop
git push origin develop
# Uses development database

# Production
git checkout main
git push origin main
# Uses production database
```

The system automatically detects the branch and connects to the appropriate database!
