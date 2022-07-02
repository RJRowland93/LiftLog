import { NextApiHandler } from "next";
import NextAuth from "next-auth";
import Providers from "next-auth/providers";
import { PrismaAdapter } from "@next-auth/prisma-adapter";
import GitHubProvider from "next-auth/providers/github";
import EmailProvider from "next-auth/providers/email";
import CredentialsProvider from "next-auth/providers/credentials";
import prisma from "../../../lib/prisma";

const authHandler: NextApiHandler = (req, res) => {
  return NextAuth(req, res, options);
};
export default authHandler;

const options = {
  providers: [
    // process.env.NODE_ENV !== "production"
    //   ? CredentialsProvider({
    //       name: "Credentials",
    //       credentials: {
    //         username: {
    //           label: "Username",
    //           type: "text",
    //           placeholder: "Randal",
    //         },
    //         password: { label: "Password", type: "password" },
    //       },
    //       async authorize(credentials, req) {
    //         console.log(credentials)
    //         return {
    //           id: 1,
    //           name: "Randal",
    //           email: "dev@gmail.com",
    //         }
    //       },
    //     })
    //   :
    GitHubProvider({
      clientId: process.env.GITHUB_ID,
      clientSecret: process.env.GITHUB_SECRET,
    }),
    // EmailProvider({
    //   server: {
    //     host: process.env.SMTP_HOST,
    //     port: Number(process.env.SMTP_PORT),
    //     auth: {
    //       user: process.env.SMTP_USER,
    //       pass: process.env.SMTP_PASSWORD,
    //     },
    //   },
    //   from: process.env.SMTP_FROM,
    // }),
  ],
  callbacks: {
    session: async ({ session, token }) => {
      if (session?.user) {
        session.user.id = token.uid;
      }
      return session;
    },
    jwt: async ({ user, token }) => {
      if (user) {
        token.uid = user.id;
      }
      return token;
    },
  },
  session: {
    strategy: "jwt",
  },
  adapter: PrismaAdapter(prisma),
  secret: process.env.SECRET,
};
