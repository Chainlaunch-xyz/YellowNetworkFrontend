import { webhookCallback } from "grammy";
import { bot } from "@/telegram";

export default webhookCallback(bot, "std/http");
