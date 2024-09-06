import NextAuth from "next-auth";
import { prisma } from "@/lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { OAuthProviders } from "@/auth/providers";
import Nodemailer from "next-auth/providers/nodemailer"
import CredentialsProvider from "next-auth/providers/credentials";
import { comparePassword } from "@/auth/utils";



export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [
    ...OAuthProviders.map(({ config }) => config),
    Nodemailer({
      server: process.env.EMAIL_SERVER,
      from: process.env.EMAIL_FROM,
    }),
    CredentialsProvider({
      async authorize(credentials) {
        const { email, password } = credentials;

        // Check if the user exists in the database
        const user = await prisma.user.findUnique({
          where: { email },
        });

        if (!user) {
          // User not found
          throw new Error("No user found with the provided email.");
        }

        // Check if the user has credentials
        const credential = await prisma.credential.findUnique({
          where: { userId: user.id },
        });

        if (!credential) {
          // User has no credentials
          throw new Error("User does not have credentials login enabled.");
        }

        // Verify password
        const isValid = await comparePassword(password, credential.passwordHash);

        if (!isValid) {
          // Invalid password
          throw new Error("Invalid login credentials.");
        }

        // Return the user object if everything is valid
        return { id: user.id, email: user.email, name: user.name };
      },
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
    }),
  ],  
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async session({ session, token }) {
      if (token) {
        session.user.id = token.id;
        session.user.role = token.role;
      }
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
    
        if (!user.isActive) {
          // Check if there's a preregistration entry for the user
          const preregistration = await prisma.preregistration.findUnique({
            where: {
              email: user.email,
            },
          });
    
          if (preregistration) {
            // Update the user with preregistration data
            await prisma.user.update({
              where: { email: user.email },
              data: {
                name: preregistration.fullName,
                emailVerified: new Date(), // Mark the email as verified
                isActive: true, // Set user as active
              },
            });

            token.name = preregistration.fullName
    
            // Update credentials if preregistration exists
            await prisma.credential.upsert({
              where: { userId: user.id },
              update: { passwordHash: preregistration.passwordHash },
              create: { userId: user.id, passwordHash: preregistration.passwordHash },
            });
    
            // Delete preregistration entry
            await prisma.preregistration.delete({
              where: {
                email: preregistration.email,
              },
            });
          } else {
            // If no preregistration entry, just update the isActive field
            await prisma.user.update({
              where: { email: user.email },
              data: {
                isActive: true,
              },
            });
          }
        }
    
        // Update token with user ID and role
        token.id = user.id;
        token.role = user.role;
      }
    
      return token;
    }
  },
});
