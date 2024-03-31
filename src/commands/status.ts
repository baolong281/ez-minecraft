import { CommandInteraction, SlashCommandBuilder } from "discord.js";

export const data = new SlashCommandBuilder()
  .setName("status")
  .setDescription("Check server status");

// todo
export async function execute(interaction: CommandInteraction) {
  return interaction.reply("not implemented");
}
