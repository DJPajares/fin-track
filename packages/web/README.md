# Fin-Track Web Application

## Authentication Setup

This application uses NextAuth.js v5 with GitHub OAuth for authentication. The authentication flow includes:

### Features Implemented:

- **Middleware Protection**: All routes except `/login` and `/api/*` require authentication
- **Automatic Redirects**: Unauthenticated users are redirected to `/login`
- **Session Management**: Authenticated users are redirected to dashboard if they visit `/login`
- **Sign Out**: Users can sign out from the navigation dropdown menu

### Environment Variables Required:

Create a `.env.local` file in the `packages/web` directory with the following variables:

```env
# GitHub OAuth (required for authentication)
GITHUB_ID=your_github_oauth_app_id
GITHUB_SECRET=your_github_oauth_app_secret

# NextAuth Configuration
NEXTAUTH_URL=http://localhost:3000
NEXTAUTH_SECRET=your_nextauth_secret_key
```

### GitHub OAuth Setup:

1. Go to GitHub Settings > Developer settings > OAuth Apps
2. Create a new OAuth App
3. Set the Authorization callback URL to: `http://localhost:3000/api/auth/callback/github`
4. Copy the Client ID and Client Secret to your `.env.local` file

### How It Works:

1. **Middleware (`middleware.ts`)**: Checks authentication on all routes
2. **Login Page**: Handles authentication and redirects authenticated users
3. **Session Provider**: Wraps the app to provide session context
4. **Navigation**: Shows user info and sign-out option when authenticated

### Protected Routes:

- `/` (dashboard)
- `/dashboard/*`
- `/transactions/*`
- `/categories/*`
- `/charts/*`

### Public Routes:

- `/login`
- `/api/*`

## Development

```bash
npm run dev
```

The application will start on `http://localhost:3000` and redirect unauthenticated users to the login page.

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/basic-features/font-optimization) to automatically optimize and load Inter, a custom Google Font.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.
