import NextAuth from "next-auth"
import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials";
import bcrypt from "bcrypt";

export const authOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials, req) {
        // Fetch user from your database (Mongo, PostgreSQL, etc.)
        const user = await db.users.findUnique({ where: { email: credentials.email } });

        if (user && await bcrypt.compare(credentials.password, user.hashedPassword)) {
          return { id: user.id, email: user.email }; // return user object
        }
        return null; // invalid credentials
      },
    }),
  ],
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login", // your custom login page if any
  },
};

export default NextAuth(authOptions)