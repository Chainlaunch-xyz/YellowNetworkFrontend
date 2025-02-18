import { Bot } from "grammy";
import { generateUpdateMiddleware } from "telegraf-middleware-console-time";
import { db } from "./db.js";

const token = process.env.TELEGRAM_BOT_TOKEN;
if (!token)
  throw new Error("TELEGRAM_BOT_TOKEN environment variable not found.");

export const bot = new Bot(token);
if (process.env.NODE_ENV !== "production") {
  bot.use(generateUpdateMiddleware());
}

const registrationSessions = new Map();

bot.command("signup", async (ctx) => {
  const userId = ctx.from.id;
  if (registrationSessions.has(userId)) {
    await ctx.reply(
      "You are already in the signup process. Please complete it or type `CANCEL` to abort.",
      { parse_mode: "markdown" },
    );
  }

  await handleSignupMessage(ctx);
});

bot.on("message:text", handleSignupMessage);

async function handleSignupMessage(ctx) {
  const userId = ctx.from.id;
  let session = registrationSessions.get(userId);
  const text = ctx.message.text.trim();

  // check if user has already signed up
  const existingUser = await getUserByTelegram(ctx.from.username);
  if (existingUser) {
    await ctx.reply(
      `We already have an account with the telegram id \`@${ctx.from.username}\``,
      { parse_mode: "markdown" },
    );
    return;
  }

  if (!session) {
    session = {};
    registrationSessions.set(userId, session);
  }

  if (text.toUpperCase() === "CANCEL") {
    registrationSessions.delete(userId);
    await ctx.reply("Registration cancelled.");
    return;
  }

  switch (session.step ?? "start") {
    case "start":
      await ctx.reply(
        ["Hi, welcome to the Yellow Network!", "Let's get you signed up."].join(
          "\n",
        ),
      );
      let telegramName = ctx.from.first_name;
      if (ctx.from.last_name) telegramName += " " + ctx.from.last_name;
      session.name = telegramName;

      await ctx.reply(
        [
          `We have your name from Telegram as ${telegramName}.`,
          "Is this correct? (yes/no)",
        ].join("\n"),
      );
      session.step = "approveTgName";

      break;

    case "approveTgName":
      if (text.toLowerCase() === "yes") {
        await ctx.reply("Great! We'll use that.");
        await ctx.reply("Please enter your email");
        session.step = "email";
      } else {
        await ctx.reply("No worries, please enter your full name");
        session.step = "name";
      }

      break;

    case "name":
      if (text.length == 0) {
        await ctx.reply(
          "Sorry, names must be at least one character long (excluding trailing whitespace)",
        );
      } else {
        session.name = text;
        await ctx.reply("Please enter your email");
        session.step = "email";
      }

      break;

    case "email":
      const email = text;
      if (!email.includes("@") || !email.includes(".")) {
        await ctx.reply(
          `\`${email}\` doesn't look like a valid email. Please try again`,
          { parse_mode: "markdown" },
        );
      } else {
        await ctx.reply("Please enter your organization");
        session.email = email;
        session.step = "organization";
      }
      break;

    case "organization":
      if (text.length == 0) {
        await ctx.reply(
          "Sorry, organization must be at least one character long",
        );
      } else {
        session.organization = text;
        await ctx.reply("Please enter your title");
        session.step = "title";
      }

      break;

    case "title":
      if (text.length == 0) {
        await ctx.reply("Sorry, title must be at least one character long");
      } else {
        session.title = text;
        await ctx.reply("Please enter your city");
        session.step = "city";
      }

      break;

    case "city":
      if (text.length == 0) {
        await ctx.reply("Sorry, city must be at least one character long");
      } else {
        session.city = text;
        await ctx.reply("Please enter your country");
        session.step = "country";
      }

      break;

    case "country":
      if (text.length == 0) {
        await ctx.reply("Sorry, country must be at least one character long");
      } else {
        session.country = text;
        await ctx.reply(
          [
            "Please confirm everything looks correct:",
            `  name: ${session.name}`,
            `  email: \`${session.email}\``,
            `  organization: ${session.organization}`,
            `  title: ${session.title}`,
            `  location: ${session.city}, ${session.country}`,
            "",
            "(yes to continue, no to start over)",
          ].join("\n"),
          { parse_mode: "markdown" },
        );
        session.step = "confirm";
      }

      break;

    case "confirm":
      if (text.toLowerCase() != "yes") {
        await ctx.reply("Starting over!");
        session.step = "start";
      } else {
        try {
          session.telegram = ctx.from.username;
          await createUser(session);
          await ctx.reply("Signup successful!");
        } catch (e) {
          console.error(e);
          await ctx.reply(`Signup failed: ${e?.message}`);
          session.step = "start";
        }
        registrationSessions.delete(userId);
      }
      break;

    default:
      await ctx.reply(`Invalid step: ${session.step}`);
      registrationSessions.delete(userId);
  }
}

async function getUserByTelegram(telegramUsername) {
  return db.users.findUnique({
    where: {
      telegramUsername,
    },
  });
}

async function createUser(session) {
  return db.users.create({
    data: {
      name: session.name,
      email: session.email,
      organization: session.organization,
      title: session.title,
      city: session.city,
      country: session.country,
      telegramUsername: session.telegram,
    },
  });
}
