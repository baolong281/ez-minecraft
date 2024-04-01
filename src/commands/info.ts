import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { config } from "../config";

export const data = new SlashCommandBuilder()
  .setName("info")
  .setDescription("Get server info");

export async function execute(interaction: CommandInteraction) {
  return interaction.reply(` \`\`\`Server IP: ${config.HOST_IP}:25565\`\`\``);
}
