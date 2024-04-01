import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { deployCommands } from "../deploy-commands";

export const data = new SlashCommandBuilder()
  .setName("reload")
  .setDescription("reload commands");

export async function execute(interaction: CommandInteraction) {
  await interaction.deferReply();
  await deployCommands({ guildId: interaction.guildId! });
  await interaction.editReply("bot commands reloaded!");
}
