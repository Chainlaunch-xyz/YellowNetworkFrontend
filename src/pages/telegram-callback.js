// src/pages/telegram-callback.js
import { useEffect } from "react";
import { useRouter } from "next/router";

export default function TelegramCallback() {
  const router = useRouter();

  useEffect(() => {
    console.log("Entered telegram-callback.js");
    
    // Get the fragment (everything after #)
    const fragment = window.location.hash.substring(1); // Remove the leading '#'
    console.log("Raw Fragment:", fragment);

    // Extract the tgAuthResult value
    const tgAuthResultMatch = fragment.match(/tgAuthResult=([^&]*)/);
    if (tgAuthResultMatch && tgAuthResultMatch[1]) {
      const tgAuthResult = tgAuthResultMatch[1];
      console.log("tgAuthResult:", tgAuthResult);

      // Decode Base64 and parse JSON
      try {
        const decodedData = atob(tgAuthResult); // Base64 decode
        const telegramData = JSON.parse(decodedData);
        console.log("Parsed Telegram Data:", telegramData);

        if (telegramData.id && telegramData.hash) {
          console.log("Storing telegramData in localStorage:", telegramData);
          localStorage.setItem("telegramData", JSON.stringify(telegramData));
        } else {
          console.log("No valid Telegram data (missing id or hash)");
        }
      } catch (error) {
        console.error("Failed to decode or parse tgAuthResult:", error);
      }
    } else {
      console.log("No tgAuthResult found in fragment");
    }

    router.push("/signup");
  }, [router]);

  return <div>Processing Telegram login...</div>;
}