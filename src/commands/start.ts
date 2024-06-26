import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { VM } from "../vm";

export const data = new SlashCommandBuilder()
  .setName("start")
  .setDescription("start the minecraft server");

// todo
export async function execute(interaction: CommandInteraction) {
  await interaction.deferReply();
  const time = await VM.startServer();
  if (time == -1) {
    return interaction.editReply("❌ Server is already running");
  }
  return interaction.editReply(`Server started in **${time}** seconds`);
}
