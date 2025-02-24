import NextAuth from "next-auth"
import { PrismaAdapter } from "@auth/prisma-adapter"
import { prisma } from "../prisma/prisma"
import Google from "next-auth/providers/google";

export const { handlers: { GET, POST }, auth, signIn, signOut } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    Google({
      clientId: process.env.AUTH_GOOGLE_ID,
      clientSecret: process.env.AUTH_GOOGLE_SECRET,
    }),
  ],
  callbacks: {
    authorized({ auth }) {
      return !!auth?.user;
    },
    //   async signIn({ user }) {
    //     try {
    //       if (await doesUserExist(user.email)) {
    //         return true;
    //       } else {
    //         await createUserOnGoogleLogin(user);
    //         return true;
    //       }
    //     } catch(e) {
    //       console.log(`error in signIn callback: ${e}`);
    //       return false;
    //     }
    //   },
  }
})