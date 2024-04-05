import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { VM } from "../vm";

export const data = new SlashCommandBuilder()
  .setName("stop")
  .setDescription("stop the minecraft server");

// todo
export async function execute(interaction: CommandInteraction) {
  await interaction.deferReply();
  const time = await VM.stopServer();
  if (time == -1) {
    return interaction.editReply("❌ Server is already stopped");
  }
  return interaction.editReply(`Server stopped in **${time}** seconds`);
}
