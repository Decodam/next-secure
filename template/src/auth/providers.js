import { SvgBrandGithub } from "@/auth/ui/brands";
import GitHubProvider from "next-auth/providers/github";

export const OAuthProviders = [
  {
    provider: "github",
    icon: SvgBrandGithub,
    config: GitHubProvider({
      clientId: process.env.GITHUB_CLIENT_ID,
      clientSecret: process.env.GITHUB_CLIENT_SECRET,
    }),
  }
];
