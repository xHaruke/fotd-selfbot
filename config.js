import dotenv from "dotenv";
dotenv.config();

export default {
  token: "" || process.env.token, //token of the selfbot account
  factCount: 10, // facts to collect on start command
  userID: "", // user id of the owner of the selfbot to whom it should accept commands from
  fotdChannel: "", // channel id of the fotd channel
  autoCrosspost: false, // whether the bot should auto-publish or not // only set to true on announcement channels
  timezone: "Asia/Calcutta", //https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
  prefix: "!",
  warnAt: 3, //when you should get a dm about the lacking facts in the db
  customStatus: {      //custom status of the bot
    emoji: '',
    message: ''
  },
  time: {
    //hrs between the bot should run **USE 24 HR FORMAT**
    min: 5,
    max: 8,
  },
};
