import dotenv from "dotenv";
dotenv.config();

export default {
  token: "MTExNjU3Njg1NzAxNDQxNTQwMA.GurLGF.03I53llgLuS8Kv4QGw06nY4y4rZToiWVpEdtFI" || process.env.token,
  factCount: 10,
  userID: "852848188942581764",
  fotdChannel: "1165128087034413207",
  autoCrosspost: false,
  timezone: "Asia/Calcutta", //https://en.wikipedia.org/wiki/List_of_tz_database_time_zones
  prefix: "!",
  warnAt: 3, //when you should get a dm about the lacking facts in the db
  customStatus: {
    emoji: '',
    message: ''
  },
  time: {
    //hrs between the bot should run **USE 24 HR FORMAT**
    min: 5,
    max: 8,
  },
};
