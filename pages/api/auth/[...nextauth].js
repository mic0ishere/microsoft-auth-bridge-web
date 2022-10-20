import NextAuth from "next-auth";
import AzureADProvider from "next-auth/providers/azure-ad";

export const authOptions = {
  providers: [
    AzureADProvider({
      clientId: process.env.AZURE_AD_CLIENT_ID,
      clientSecret: process.env.AZURE_AD_CLIENT_SECRET,
      tenantId: process.env.AZURE_AD_TENANT_ID,
      profile(profile) {
        return {
          id: profile.sub,
          name: profile.name,
          email: profile.email,
          // i know i shouldn't do this, but i don't have time to figure out how to do it properly
          image: profile.sub,
        };
      },
    }),
  ],
};
export default NextAuth(authOptions);
