import { Client } from "discord.js";
import { deployCommands } from "./deploy-commands";
import { config } from "./config";
import logger from "./logger";
import commands from "./commands";

export const client = new Client({
  intents: ["Guilds", "GuildMessages"],
});

client.once("ready", () => {
  logger.info("bot started on discord");
});

client.on("guildCreate", async (guild) => {
  await deployCommands({ guildId: guild.id });
});

client.on("interactionCreate", async (interaction) => {
  if (!interaction.isCommand()) {
    return;
  }

  const { commandName } = interaction;
  if (commands[commandName as keyof typeof commands]) {
    commands[commandName as keyof typeof commands].execute(interaction);
  }
});

client.login(config.DISCORD_TOKEN);
