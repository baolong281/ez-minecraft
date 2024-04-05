import {
  ActionRowBuilder,
  ButtonBuilder,
  ButtonStyle,
  CommandInteraction,
  SlashCommandBuilder,
} from "discord.js";
import { JavaStatusResponse, statusJava } from "node-mcstatus";
import { config } from "../config";
import { VM } from "../vm";

const host = config.HOST_IP;
const port = 25565;
const options = { query: false };

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

export const getServerResponse = async (): Promise<JavaStatusResponse> => {
  const res = await statusJava(host, port, options);
  return res;
};

// todo
export async function execute(interaction: CommandInteraction) {
  await interaction.deferReply();
  const res = await getServerResponse();

  const online = res.online;
  const playerCount = res.players?.online;
  if (online) {
    const players = res.players?.list.map((member) => member.name_clean);
    if (playerCount && playerCount == 1) {
      return interaction.editReply(
        `🟢  Server is online with **${playerCount}** player` +
          (playerCount! > 0
            ? "```\n" + "- " + players?.join("\n- ") + "```"
            : ""),
      );
    } else {
      return interaction.editReply(
        `🟢  Server is online with **${playerCount}** players` +
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
