import NextAuth from 'next-auth';
import GitHub from 'next-auth/providers/github';
import Google from 'next-auth/providers/google';

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [GitHub, Google],
  callbacks: {
    async signIn({ user, account, profile }) {
      if (!account || !profile) return false;

      try {
        // Call your social login API
        const response = await fetch(
          `${process.env.NEXT_PUBLIC_BASE_URL}/auth/social-login`,
          {
            method: 'POST',
            headers: {
              'Content-Type': 'application/json',
            },
            body: JSON.stringify({
              email: user.email,
              name: user.name,
              image: user.image,
              provider: account.provider,
              providerId: profile.sub || profile.id,
            }),
          },
        );

        if (!response.ok) {
          console.error('Social login API error:', await response.text());
          return false;
        }

        const data = await response.json();

        // Store the JWT token in the user object for later use
        (user as any).accessToken = data.data.token;
        (user as any).id = data.data.user.id;

        return true;
      } catch (error) {
        console.error('Social login error:', error);
        return false;
      }
    },
    async jwt({ token, user, account }) {
      // Persist the access token to the token right after signin
      if (account && user) {
        token.accessToken = user.accessToken;
        token.userId = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      // Send properties to the client
      session.accessToken = token.accessToken as string;
      session.user.id = token.userId as string;
      return session;
    },
  },
  pages: {
    signIn: '/login',
  },
});
