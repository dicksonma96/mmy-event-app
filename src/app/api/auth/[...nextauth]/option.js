import CredentialsProvider from "next-auth/providers/credentials";

export const options = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        username: {
          label: "username:",
          type: "text",
          placeholder: "username",
        },
        password: {
          label: "password:",
          type: "password",
          placeholder: "password",
        },
      },

      async authorize(credentials) {
        const user = { id: "1", name: "mmy_admin", password: "Admin234@" };

        if (
          credentials?.username === user.name &&
          credentials?.password === user.password
        ) {
          return user;
        } else {
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async redirect({ url, baseUrl }) {
      return url;

      // Checks if URL is an internal URL or external URL
      if (url.startsWith("/")) return `${baseUrl}${url}`; // Redirect to internal pages
      return `${baseUrl}/admin`; // Default to base URL if nothing specified
    },
  },
};
