import { config } from "../config";
import { CommandInteraction, SlashCommandBuilder } from "discord.js";
import { getServerResponse } from "./status";
import logger from "../logger";

import { DefaultAzureCredential } from "@azure/identity";
import { ComputeManagementClient } from "@azure/arm-compute";

export const data = new SlashCommandBuilder()
  .setName("start")
  .setDescription("start the minecraft server");

// for alan
// todo
// start the azure instance

var credential = new DefaultAzureCredential();
var client = new ComputeManagementClient(credential, config.SUB_ID);
const vmName = "minecraftez";

export const startServer = async () => {
  const start = performance.now();
  const result = await client.virtualMachines.beginStartAndWait(
    config.R_GROUP,
    vmName
  );
  logger.info("start_server", result);
  const end = performance.now();
  return Math.round(((end - start) / 1000) * 10) / 10;
};

// todo
export async function execute(interaction: CommandInteraction) {
  await interaction.deferReply();
  const res = await getServerResponse();
  if (res.online) {
    await interaction.editReply("❌ Server is already running");
    return;
  }
  const time = await startServer();
  return interaction.editReply(`Server started in **${time}** seconds`);
}
