const {
  Client,
  Collection,
  Events,
  GatewayIntentBits,
  ActivityType,
} = require("discord.js");
const { token } = require("./config.json");
const { eventHandler } = require("./eventHandler");
const mongoose = require("mongoose");
const chalk = require("chalk");
const config = require("./config.json");
const client = new Client({
  intents: [
    GatewayIntentBits.Guilds,
    GatewayIntentBits.GuildMessages,
    GatewayIntentBits.MessageContent,
    GatewayIntentBits.GuildMembers,
  ],
});

client.commands = new Collection();
client.events = new Collection();
client.setMaxListeners(0);
eventHandler(client)
  .then(() => {
    console.log("Loaded All Events");
  })
  .catch(() => {
    console.log("Couldn't load events");
  });
mongoose.set("strictQuery", false);
mongoose
  .connect(config.mongoKey)
  .then(() => console.log(chalk.gray("Connected To"), chalk.yellow(`MongoDB`)))
  .catch((err) => console.error(err));
client.login(config.token);
