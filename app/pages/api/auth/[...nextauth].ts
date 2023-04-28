import NextAuth, { NextAuthOptions } from "next-auth";
import GoogleProvider from "next-auth/providers/google";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import prisma from "@/lib/prisma";

export const authOptions: NextAuthOptions = {
  adapter: PrismaAdapter(prisma),
  providers: [
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          username: profile.name.replace(/\s/g, "").toLowerCase(),
          email: profile.email,
          image: profile.picture,
        };
      },
    }),
  ],
  secret: process.env.SECRET,
  callbacks: {
    async session({ session, user }) {
      // @ts-ignore
      session.user.id = user.id;
      // @ts-ignore
      session.user.username = user.username;
      return session;
    },
  },
};

export default NextAuth(authOptions);
