import NextAuth, { DefaultSession } from "next-auth";

declare module "next-auth" {
  /**
   * Returned by `useSession`, `getSession` and received as a prop on the `SessionProvider` React Context
   */
  interface User {
    role: string;
  }

  interface Session {
    access_token: string;
    id_token: string;
    user: DefaultSession["user"];
    error: string;
    expires_at: number;
  }
}
