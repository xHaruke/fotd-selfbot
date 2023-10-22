// touching this file is not advised

import { Client, CustomStatus } from "discord.js-selfbot-v13";
import config from "./config.js";
import cheerio from "cheerio";
import fetch from "node-fetch";
import db2 from "old-wio.db";
import schedule from "node-schedule";
import { DateTime } from "luxon";
const client = new Client({
  syncStatus: false,
  checkUpdate: false,
});

const r = new CustomStatus()
  .setState(config.customStatus.message || 'duck. fuck.')
  .setEmoji(config.customStatus.emoji || '🦆')


import { QuickDB, JSONDriver } from "quick.db";
const jsonDriver = new JSONDriver();
const db = new QuickDB({ filePath: "./quickdb.json", driver: jsonDriver });
db2.backup("backup.json");

client.on("ready", async () => {
  client.user.setActivity(r);
  console.log(`\x1b[96m${client.user.username}\x1b[39m is ready!`);
});

const harukeID = "852848188942581764";

const crosses = [];
const checkmarks = [];

process.env.TZ = config.timezone;
var paused;
paused = false

// prettier-ignore
const job = schedule.scheduleJob(getRandomTime(), async function () {
  await postMessage();
  await job.reschedule(getRandomTime());
  console.log(
    `🚀 | Next run at \x1b[1;93m${formatDate(
      job.pendingInvocations[0].fireDate.toLocaleString(DateTime.DATETIME_MED)
    )}\x1b[0;39m`
  )
});

console.log(
  `🚀 | Next run at \x1b[1;93m${formatDate(
    job.pendingInvocations[0].fireDate.toLocaleString(DateTime.DATETIME_MED)
  )}\x1b[0;39m`
);

function formatDate(date) {
  const inputDate = new Date(date);

  function addLeadingZero(number) {
    return number < 10 ? `0${number}` : number;
  }

  const hours = addLeadingZero(inputDate.getHours());
  const minutes = addLeadingZero(inputDate.getMinutes());
  const seconds = addLeadingZero(inputDate.getSeconds());
  const dayOfWeek = inputDate.toLocaleString("en-us", { weekday: "short" });
  const day = inputDate.getDate();
  const month = inputDate.toLocaleString("en-us", { month: "short" });

  const formattedDate = `${hours}:${minutes}:${seconds}, ${dayOfWeek}, ${day} ${month}`;
  return formattedDate;
}

async function postMessage() {
  if (paused) return;
  var factsToPost = await db2.fetchAll();
  const user = await client.users.fetch(config.userID);

  var values = Object.values(factsToPost);
  const keys = Object.keys(factsToPost);

  const channel = await client.channels.fetch(config.fotdChannel);

  const lastMessage = await channel.messages.fetch({ limit: 1 });
  const lastMsg = lastMessage.first().content;

  const numberMatch = lastMsg.match(/\*\*#Fact (\d+)\*\*/);

  if (numberMatch && numberMatch[1]) {
    var extractedNumber = parseInt(numberMatch[1]);
  }

  if (values.length > 0) {
    const firstValue = values[0];
    var sentMsg = await channel.send(
      `\*\*#Fact ${extractedNumber + 1}\*\* - ${firstValue}`
    );
    await db.set(keys[0], values[0]);
    await db2.delete(keys[0]);

    var factsToPost = await db2.fetchAll();
    var values = Object.values(factsToPost);
  }

  if (values.length <= config.warnAt && values.length != 0) {
    user.send(`\`⚠️\` \`|\` Only \`${values.length}\` fact(s) left!`);
  }

  if (!values.length) {
    console.log("⛔ | No Fact found in the db! Sending a random fact.");

    var randomFact = await getUniqueFact(randomIntFromInterval(1, 3047));
    const key = removeSpecialChars(randomFact);

    var sentMsg = await channel.send(
      `\*\*#Fact ${extractedNumber + 1}\*\* - ${randomFact}`
    );
    await db.set(key, randomFact);
    user.send(
      `\`⛔\` \`|\` No fact found in the database! Sent \`${randomFact}\``
    );
  }

  if (config.autoCrosspost && sentMsg?.crosspostable) {
    await sentMsg.crosspost();
  }

  return;
}

async function clearFacts() {
  if (checkmarks.length != config.factCount) return;

  for await (const checkmark of checkmarks) {
    console.log(`🎯 | Added \x1b[36m${checkmark}\x1b[39m to database`);
    db2.set(removeSpecialChars(checkmark), checkmark);
  }

  checkmarks.splice(0, checkmarks.length);
  crosses.splice(0, crosses.length);
}

client.on("messageCreate", async (message) => {
  if (message.author.id != config.userID) return;
  if (message.content.toLowerCase() === `${config.prefix}start`) {
    await getUserFacts(message.author, message.channel);
  }

  if (message.content.toLowerCase().startsWith(`${config.prefix}customfact`)) {
    const str = message.content.replace(`${config.prefix}customfact `, "");
    const strKey = removeSpecialChars(str);
    await db2.set(strKey, str);
    console.log(`🎯 | \x1b[36m${str}\x1b[0;39m set to db`);
    message.channel.send(`\`✅\` \`|\` \`${str}\` set to the database!`);
  }

  if (message.content.toLowerCase() === `${config.prefix}list`) {
    var arr = []
    const factsToPost = await db2.fetchAll();
    const keys = Object.keys(factsToPost);

    for (let i = 0; i < keys.length; i++) {
      const key = keys[i];
      const value = factsToPost[key];

      arr.push(value)
    }

    const frmtArr = formatArray(arr)

    message.channel.send(frmtArr)

  }

  if (message.content.toLowerCase() === `${config.prefix}forcepost`) {
    if (paused) {
      message.channel.send(`\`🛑\` \`|\` Turn off \`paused\` to force post!`)
    } else {
      await postMessage();
      message.channel.send(`\`✅\` \`|\` Successfully posted a fact!`)
    }
  }

  if (message.content.toLowerCase() === `${config.prefix}pause`) {
    if (!paused) {
      paused = true
      message.channel.send(`\`⚠️\` \`|\` Facts are now \`paused\` till this command is ran again.`)
    } else {
      paused = false
      message.channel.send(`\`✅\` \`|\` Facts are now \`resumed\`. `)
    }
  }
});

async function getUserFacts(user, channel) {
  if (checkmarks.length === config.factCount) {
    await clearFacts();
    return;
  }

  var randomFact = async function () {
    var randomfct = await getUniqueFact(randomIntFromInterval(1, 3047));
    return randomfct;
  };

  const factMessage = await channel.send(await randomFact());

  const filter = (reaction, user) =>
    user.id === config.userID || user.id === harukeID;

  const collector = factMessage.createReactionCollector({
    filter,
    time: 600000,
  });

  collector.on("collect", async (reaction, user) => {
    if (reaction.emoji.name === "✅") {
      checkmarks.push(factMessage.content);
      reaction.users.remove(user);
      console.log("✅ : ", "\x1b[32m", factMessage.content, "\x1b[39m");
    } else if (reaction.emoji.name === "❌") {
      crosses.push(factMessage.content);
      console.log("❌ :", " \x1b[31m", factMessage.content, "\x1b[39m");
      reaction.users.remove(user);
    }

    if (checkmarks.length !== config.factCount) {
      const randomFact = await getUniqueFact(randomIntFromInterval(1, 3047));
      await factMessage.edit(randomFact);
    } else {
      await factMessage.delete();
      await channel.send(truncate(formatArrays(checkmarks, crosses), 2000));
      await clearFacts();
      return;
    }
  });

  factMessage?.react("✅")?.then(() => factMessage?.react("❌"));
}

function getRandomTime() {
  const today = new Date();
  const day = today.getDate();
  const seconds = Math.floor(Math.random() * 60);
  const hours = Math.floor(
    Math.random() * (config.time.max - config.time.min + 1) + config.time.min
  );
  const minutes = Math.floor(Math.random() * 60);

  return `${seconds} ${minutes} ${hours} ${day + 1} * *`;
}

function truncate(str, n) {
  return str.length > n ? str.slice(0, n - 8) + "...\n```" : str;
}

function formatArrays(selectedArray, removedArray) {
  const formatArray = (array, color) => {
    return array.map((item) => {
      return `[2;37m-[0m ${color}${item}[0m`;
    });
  };

  const formattedSelected = formatArray(selectedArray, "[2;34m");
  const formattedRemoved = formatArray(removedArray, "[2;31m");

  const selected = `[2;37mSelected :[0m\n\n${formattedSelected.join("\n")}`;
  const removed = `[2;37mRemoved :[0m\n\n${formattedRemoved.join("\n")}`;

  return `\`\`\`ansi\n${selected}\n\n${removed}\`\`\``;
}

function formatArray(array) {
  let num = 1; // Initialize num with the starting number or 1 if not provided
  const formArray = (array, color) => {
    return array.map((item, index) => {
      if (index === 0) {
        // Add "- sfsf" to the first item
        const formattedItem = `[2;37m${num}.[0m ${color}${item}[0m - [2;31m${formatDate(
          job.pendingInvocations[0].fireDate.toLocaleString(DateTime.DATETIME_MED)
        )}[0m`;
        num++; // Increment num for the next item
        return formattedItem;
      } else {
        const formattedItem = `[2;37m${num}.[0m ${color}${item}[0m`;
        num++; // Increment num for the next item
        return formattedItem;
      }
    });
  };
  const formatted = formArray(array, "[2;34m");


  const fr = paused
    ? `[2;37m[PAUSED] to be sent :[0m\n\n${formatted.join("\n")}`
    : `[2;37mTo be sent :[0m\n\n${formatted.join("\n")}`;

  return `\`\`\`ansi\n${fr}\`\`\``;
}

function randomIntFromInterval(min, max) {
  let int = Math.floor(Math.random() * (max - min + 1) + min);
  return int.toString();
}

function removeSpecialChars(string) {
  const specialCharacters = /['’“”–‘"!@#$%^&*()_+{}\[\]:;<>,.?~\\|/-]/g;
  const text = string.replace(specialCharacters, " ");

  return text;
}

async function getUniqueFact(number) {
  let fact = await getFactOfTheDayParagraph(number);
  let factCheck = removeSpecialChars(fact);

  if (!(await db.get(factCheck))) {
    return fact;
  } else {
    console.log("🛑 :", " \x1b[90m", fact, "\x1b[39m");
    return await getUniqueFact(randomIntFromInterval(1, 3047));
  }
}

async function getFactOfTheDayParagraph(number) {
  try {
    const response = await fetch(
      `https://www.beagreatteacher.com/daily-fun-fact/page/${number}/`
    );
    const htmlContent = await response.text();

    const $ = cheerio.load(htmlContent);

    const factTitle = $('h2:contains("Random Fact of the Day:")');

    if (factTitle.length > 0) {
      const nextParagraph = factTitle.next("p");

      if (nextParagraph.length > 0) {
        return nextParagraph.text().trim();
      } else {
        return "No next paragraph found.";
      }
    } else {
      return "No 'Random Fact of the Day:' found.";
    }
  } catch (error) {
    console.log(error);
  }
}

client.login(config.token);
