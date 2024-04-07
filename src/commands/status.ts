import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import { SERVER, VM } from "../vm";

export const data = new SlashCommandBuilder()
  .setName("status")
  .setDescription("Check server status");

const confirm = new ButtonBuilder()
  .setCustomId("confirm")
  .setLabel("Confirm")
  .setStyle(ButtonStyle.Success);

const cancel = new ButtonBuilder()
  .setCustomId("cancel")
  .setLabel("Cancel")
  .setStyle(ButtonStyle.Danger);

const row = new ActionRowBuilder<ButtonBuilder>().addComponents(
  confirm,
  cancel,
);

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

  const response = await interaction.editReply({
    content: "Server is offline. Would you like to start the server?",
    components: [row],
  });

  const collectorFilter = (i: { user: { id: string } }) =>
    i.user.id === interaction.user.id;

  try {
    const confirmation = await response.awaitMessageComponent({
      filter: collectorFilter,
      time: 30_000,
    });

    // todo
    if (confirmation.customId === "confirm") {
      await interaction.editReply({
        content: "Server is starting...",
        components: [],
      });
      const time = await VM.startServer();
      await interaction.editReply({
        content: `Server started in **${time}** seconds`,
        components: [],
      });
    } else {
      await interaction.editReply({
        content: "Server start cancelled",
        components: [],
      });
    }
  } catch (e) {
    await interaction.editReply({
      content: "Confirmation not received within 30 seconds, cancelling",
      components: [],
    });
  }
}
