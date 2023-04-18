// Messages

bot.on("message", async (ctx) => {
  if (regex.test(ctx.message.text)) {
    var searchData = {
      number: ctx.message.text,
      countryCode: "IN",
      installationId: process.env.IID,
      output: "HTML",
    };
    var sn = truecallerjs.searchNumber(searchData);
    sn.then(async function (response) {
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
      console.log(`Name for ${ctx.message.text} is ${name}`);
      if (name) {
        await ctx.reply(name);
      }
    }).catch(async function (error) {
      console.log(error);
    });
  } else {
    await ctx.reply("*No phone number detected!*", {
      reply_to_message_id: ctx.message.message_id,
    });
  }
});
// Messages

bot.on("message", async (ctx) => {
  if (regex.test(ctx.message.text)) {
    var searchData = {
      number: ctx.message.text,
      countryCode: "IN",
      installationId: process.env.IID,
      output: "HTML",
    };
    var sn = truecallerjs.searchNumber(searchData);
    sn.then(async function (response) {
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
      console.log(`Name for ${ctx.message.text} is ${name}`);
      if (name) {
        await ctx.reply(name);
      }
    }).catch(async function (error) {
      console.log(error);
    });
  } else {
    await ctx.reply("*No phone number detected!*", {
      reply_to_message_id: ctx.message.message_id,
    });
  }
});
