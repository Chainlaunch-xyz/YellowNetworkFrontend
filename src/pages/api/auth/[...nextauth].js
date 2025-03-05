// src/pages/api/auth/[...nextauth].js
import NextAuth from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import crypto from "crypto";

export default NextAuth({
  providers: [
    CredentialsProvider({
      name: "Telegram",
      credentials: {
        id: { label: "Telegram ID", type: "text" },
        first_name: { label: "First Name", type: "text" },
        last_name: { label: "Last Name", type: "text" },
        username: { label: "Username", type: "text" },
        auth_date: { label: "Auth Date", type: "text" },
        hash: { label: "Hash", type: "text" },
        photo_url: { label: "Photo URL", type: "text" },
        organization: { label: "Organization", type: "text" }, // Add extra fields
        title: { label: "Title", type: "text" },
        country: { label: "Country", type: "text" },
        city: { label: "City", type: "text" },
      },
      async authorize(credentials) {
        console.log("Entering authorize");
        const { id, first_name, last_name, username, auth_date, hash, photo_url, organization, title, country, city } = credentials;
        
        // const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
        // console.log("BOT_TOKEN:", BOT_TOKEN);

      //   const dataCheckString = [
      //     `auth_date=${auth_date}`,
      //     `first_name=${first_name}`,
      //     `id=${id}`,
      //     username ? `username=${username}` : "",
      //   ]
      //     .filter(Boolean)
      //     .sort()
      //     .join("\n");

      //   const secretKey = crypto.createHash("sha256").update(BOT_TOKEN).digest();
      //   const computedHash = crypto
      //     .createHmac("sha256", secretKey)
      //     .update(dataCheckString)
      //     .digest("hex");

      //   console.log("Computed Hash:", computedHash, "Received Hash:", hash);

      //   if (computedHash === hash) {
      //     console.log("Hash verified successfully");
      //     return {
      //       id: id,
      //       first_name: first_name,
      //       last_name: last_name || null,
      //       name: username || first_name,
      //       telegramId: id,
      //       photo_url: photo_url || null,
      //       organization: organization || null, // Include extra fields
      //       title: title || null,
      //       country: country || null,
      //       city: city || null,
      //     };
      //   } else {
      //     console.error("Telegram hash verification failed");
      //     return null;
      //   }
      console.log( id, first_name, last_name, title, organization, "user")
        return {
          id: id,
          first_name: first_name,
          last_name: last_name || null,
          name: username || first_name,
          telegramId: id,
          photo_url: photo_url || null,
          organization: organization || null, // Include extra fields
          title: title || null,
          country: country || null,
          city: city || null,
        };
      },
    }),
  ],
  callbacks: {
    async session({ session, token }) {
      session.user.telegramId = token.telegramId;
      session.user.photo_url = token.photo_url;
      session.user.username = token.username;
      session.user.first_name = token.first_name;
      session.user.last_name = token.last_name;
      session.user.organization = token.organization; // Pass extra fields
      session.user.title = token.title;
      session.user.country = token.country;
      session.user.city = token.city;
      return session;
    },
    async jwt({ token, user }) {
      if (user) {
        token.telegramId = user.telegramId;
        token.photo_url = user.photo_url;
        token.username = user.name;
        token.first_name = user.first_name;
        token.last_name = user.last_name;
        token.organization = user.organization; // Store extra fields
        token.title = user.title;
        token.country = user.country;
        token.city = user.city;
      }
      return token;
    },
  },
  pages: {
    signIn: "/signup",
  },
});