import { CommandInteraction, REST, Routes } from "discord.js";
import { config } from "./config";
import logger from "./logger";
import commands from "./commands";

const commandsData = Object.values(commands).map((command) => command.data);

const rest = new REST({ version: "10" }).setToken(config.DISCORD_TOKEN);

type DeployCommandsProps = {
  guildId: string;
};

export async function deployCommands({ guildId }: DeployCommandsProps) {
  try {
    logger.info({
      level: "info",
      message: "Started reloading application (/) commands.",
    });

    await rest.put(
      Routes.applicationGuildCommands(config.DISCORD_CLIENT_ID, guildId),
      {
        body: commandsData,
      }
    );
    logger.info({
      level: "info",
      message: "Successfully reloaded application (/) commands.",
    });
  } catch (error) {
    logger.error("Failed to reload application (/) commands.", error);
  }
}
