require('dotenv').config();
const { Bot, session, GrammyError, HttpError } = require("grammy");
const { run, sequentialize } = require("@grammyjs/runner");
let BOT_DEVELOPER = 0 | (process.env.BOT_DEVELOPER);
const truecallerjs = require('truecallerjs');
const cheerio = require('cheerio');
const regex = /(?:\+\d{1,3}|\d{1})?(?:\s?\d{3}){2}\s?\d{4}/g;

// Bot
const bot = new Bot(process.env.BOT_TOKEN);

// Build a unique identifier for the `Context` object.
function getSessionKey(ctx) {
  return ctx.chat?.id.toString(); }

// Sequentialize before accessing session data.
bot.use(sequentialize(getSessionKey));
bot.use(session({ getSessionKey }));

// Admin

bot.use(async (ctx, next) => {
    ctx.config = {
      botDeveloper: BOT_DEVELOPER,
      isDeveloper: ctx.from?.id === BOT_DEVELOPER,
    };
    await next();
  });  

// Commands

bot.command("start", async (ctx) => {
    if (ctx.config.isDeveloper) {
    ctx.reply("Welcome!"); }
    else { ctx.reply("You don't have authorization to use the bot."); }
    });
bot.command("help", (ctx) => ctx.reply("*@anzubo Project.*\n\nThis is a personal bot to serve as an alternative for caller ID notifications to the Truecaller app.", { parse_mode: "Markdown" } ));

// Messages

bot
  .on("msg", async (ctx) => {
    // Console
    if (ctx.config.isDeveloper) {
      if (regex.test(ctx.msg.text)) {
        var searchData = {
          number: ctx.msg.text,
          countryCode: "IN",
          installationId: process.env.IID,
          output: "HTML"
        };
        var sn = truecallerjs.searchNumber(searchData);
        sn.then(function(response) {
          //console.log(response);
          const $ = cheerio.load(response);
          let name = "";
          $('td').each(function(i, el) {
          if($(this).text() === "name"){
              if($(this).next().text() !== ""){
                  name = $(this).next().text();
                  return false; }
              }
  });
          console.log(name);
          if (name) { ctx.reply(name); }
          }).catch(function(error) {
              console.log(error);
          });
      }
      else { ctx.reply ("*No phone number detected!*", {parse_mode: "Markdown", reply_to_message_id:ctx.msg.message_id }); }
    }
    else { ctx.reply("You don't have authorization to use the bot.", { reply_to_message_id: ctx.msg.message_id } ); }
      });

// Error Handling

bot.catch((err) => {
  const ctx = err.ctx;
  console.error("Error while handling update", ctx.update.update_id, "\nQuery:", ctx.msg.text, "not found");
  if (ctx.config.isDeveloper) { ctx.reply("Query: " + ctx.msg.text + " " + "not found!"); }
  else { bot.api.sendMessage(ctx.config.botDeveloper, "Query: " + ctx.msg.text + " by @" + ctx.from.username + " ID: " + ctx.from.id + " not found!"); }
  const e = err.error;
  if (e instanceof GrammyError) {
    console.error("Error in request:", e.description);
  } else if (e instanceof HttpError) {
    console.error("Could not contact Telegram:", e);
  } else {
    console.error("Unknown error:", e);
  }
});

// Run it concurrently

console.log('Bot running. Please keep this window open or use a startup manager like PM2 to setup persistent execution and store logs.');
run(bot);