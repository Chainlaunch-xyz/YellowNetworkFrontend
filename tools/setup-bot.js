import "dotenv/config";
import { bot } from "../src/lib/telegram.js";

export async function setupWebhook() {
  try {
    const webhookUrl = `https://yellow-network.vercel.app/api/bot`;

    const webhookInfo = await bot.api.getWebhookInfo();
    if (webhookInfo.url !== webhookUrl) {
      await bot.api.deleteWebhook();
      await bot.api.setWebhook(webhookUrl);
    }
  } catch (e) {
    console.error("could not set webhook url for telegram bot");
    console.error(e);
  }
}

async function main() {
  if (process.env.NODE_ENV === "production") {
    await setupWebhook();
  } else {
    console.warn("starting bot in development mode");
    if (!bot.isInited()) await bot.start();
  }
}

main();
