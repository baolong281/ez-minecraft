import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("start")
  .setDescription("start the minecraft server");

// todo
export async function execute(interaction: CommandInteraction) {
  return interaction.reply("this doesn't exist anymore");
}
