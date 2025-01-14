import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { SERVER } from "../poller";

export const data = new SlashCommandBuilder()
  .setName("status")
  .setDescription("Check server status");

// todo
export async function execute(interaction: CommandInteraction) {
  await interaction.deferReply();
  const { online, players, expiration } = SERVER.getServerStatus();

  if (online) {
    const playerCount = players?.length;
    const cache_string =
      expiration > 0 ? ` (updates in **${expiration} seconds**)` : "";
    if (playerCount && playerCount == 1) {
      return interaction.editReply(
        `🟢  Server is online with **${playerCount}** player` +
          cache_string +
          (playerCount! > 0
            ? "```\n" + "- " + players?.join("\n- ") + "```"
            : ""),
      );
    } else {
      return interaction.editReply(
        `🟢  Server is online with **${playerCount}** players` +
          cache_string +
          (playerCount! > 0
            ? "```\n" + "- " + players?.join("\n- ") + "```"
            : ""),
      );
    }
  }
}
