#!/usr/bin/env node

/*!
 * Truecaller Telegram Bot
 * Copyright (c) 2023
 *
 * @author Zubin
 * @username (GitHub) losparviero
 * @license AGPL-3.0
 */

// Add env vars as a preliminary

require("dotenv").config();
const { Bot, GrammyError, HttpError } = require("grammy");
const { hydrateReply, parseMode } = require("@grammyjs/parse-mode");
let BOT_DEVELOPER = 0 | process.env.BOT_DEVELOPER;
const truecallerjs = require("truecallerjs");
const cheerio = require("cheerio");
const regex = /(?:\+\d{1,3}|\d{1})?(?:\s?\d{3}){2}\s?\d{4}/g;

// Bot

const bot = new Bot(process.env.BOT_TOKEN);

// Admin

async function admin(ctx, next) {
  ctx.config = {
    botDeveloper: BOT_DEVELOPER,
    isDeveloper: ctx.from?.id === BOT_DEVELOPER,
  };
  await next();
}

// Response

async function responseTime(ctx, next) {
  const before = Date.now();
  await next();
  const after = Date.now();
  console.log(`Response time: ${after - before} ms`);
}

// Log

async function log(ctx, next) {
  let message = ctx.message?.text || ctx.channelPost?.text || undefined;
  const from = ctx.from || ctx.chat;
  const name =
    `${from.first_name || ""} ${from.last_name || ""}`.trim() || ctx.chat.title;
  console.log(
    `From: ${name} (@${from.username}) ID: ${from.id}\nMessage: ${message}`
  );
  await next();
}

// Plugins

bot.use(responseTime);
bot.use(log);
bot.use(admin);
bot.use(hydrateReply);

// Parse

bot.api.config.use(parseMode("Markdown"));

// Commands

bot.command("start", async (ctx) => {
  if (ctx.config.isDeveloper) {
    await ctx.reply("*Welcome! ✨*\n_Send a phone number._");
  } else {
    await ctx.reply(
      "*You don't have authorization to use the bot.*\n_Deploy your own from https://github.com/losparviero/Truecaller-Telegram-Bot_"
    );
  }
  console.log("User invoked start command:", ctx.chat);
});

bot.command("help", async (ctx) => {
  await ctx.reply(
    "*@anzubo Project.*\n\n_This is a personal bot to serve as an alternative for caller ID notifications to the Truecaller app._"
  );
  console.log(`User ${ctx.chat.id} invoked help command.`);
});

// Messages

bot.on("message", async (ctx) => {
  if (ctx.config.isDeveloper) {
    if (regex.test(ctx.msg.text)) {
      var searchData = {
        number: ctx.msg.text,
        countryCode: "IN",
        installationId: process.env.IID,
        output: "HTML",
      };
      var sn = truecallerjs.searchNumber(searchData);
      sn.then(async function (response) {
        //console.log(response);
        const $ = cheerio.load(response);
        let name = "";
        $("td").each(function (i, el) {
          if ($(this).text() === "name") {
            if ($(this).next().text() !== "") {
              name = $(this).next().text();
              return false;
            }
          }
        });
        console.log(name);
        if (name) {
          await ctx.reply(name);
        }
      }).catch(async function (error) {
        console.log(error);
      });
    } else {
      await ctx.reply("*No phone number detected!*", {
        reply_to_message_id: ctx.msg.message_id,
      });
    }
  } else {
    await ctx.reply(
      "*You don't have authorization to use the bot.*\n_Deploy your own from https://github.com/losparviero/Truecaller-Telegram-Bot_",
      {
        reply_to_message_id: ctx.msg.message_id,
      }
    );
  }
});

// Error

bot.catch((err) => {
  const ctx = err.ctx;
  console.error(
    "Error while handling update",
    ctx.update.update_id,
    "\nQuery:",
    ctx.msg.text
  );
  const e = err.error;
  if (e instanceof GrammyError) {
    console.error("Error in request:", e.description);
    if (e.description === "Forbidden: bot was blocked by the user") {
      console.log("Bot was blocked by the user");
    } else {
      ctx.reply("An error occurred");
    }
  } else if (e instanceof HttpError) {
    console.error("Could not contact Telegram:", e);
  } else {
    console.error("Unknown error:", e);
  }
});

// Run

console.log("Bot started. Please keep this window running.");
bot.start();
