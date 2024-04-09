import { config } from "./config";
import logger from "./logger";

import { DefaultAzureCredential } from "@azure/identity";
import { ComputeManagementClient } from "@azure/arm-compute";
import { statusJava } from "node-mcstatus";
// import { client } from ".";
// import { TextChannel } from "discord.js";
class VMInstance {
  client: ComputeManagementClient;
  vmname: string;
  online: boolean | undefined;

  private constructor(client: ComputeManagementClient) {
    this.client = client;
    this.vmname = "minecraftez";
    this.online = undefined;
  }

  private static createClient() {
    const credentials = new DefaultAzureCredential();
    const client = new ComputeManagementClient(credentials, config.SUB_ID);
    return client;
  }

  public static async getInstance() {
    const client = this.createClient();
    const out = new VMInstance(client);
    out.online = await out.getStatus();
    return out;
  }

  public async startServer() {
    if (this.online) {
      return -1;
    }
    const start = performance.now();
    logger.info("starting server...");
    await this.client.virtualMachines.beginStartAndWait(
      config.R_GROUP,
      this.vmname,
    );
    logger.info("server successfully started ?");
    const end = performance.now();
    this.online = true;
    return Math.round(((end - start) / 1000) * 10) / 10;
  }

  public async stopServer() {
    if (!this.online) {
      return -1;
    }
    const start = performance.now();
    logger.info("stopping server...");
    await this.client.virtualMachines.beginPowerOffAndWait(
      config.R_GROUP,
      this.vmname,
    );
    logger.info("server stopped ?");
    const end = performance.now();
    this.online = false;
    return Math.round(((end - start) / 1000) * 10) / 10;
  }

  private async getStatus() {
    const res = await this.client.virtualMachines.instanceView(
      config.R_GROUP,
      this.vmname,
    );
    // response looks like this
    // [
    //     {
    //       code: 'ProvisioningState/succeeded',
    //       level: 'Info',
    //       displayStatus: 'Provisioning succeeded',
    //       time: 2024-04-07T03:25:16.844Z
    //     },
    //     {
    //       code: 'PowerState/running',
    //       level: 'Info',
    //       displayStatus: 'VM running'
    //     }
    //   ]
    logger.info("server-status", res.statuses);
    const code = res.statuses?.[1]?.code;
    return code === "PowerState/running";
  }

  public isOnline() {
    return this.online;
  }
}

const round2 = (num: number) => Math.round(num * 10) / 10;

class ServerPoller {
  expiration: number | undefined;
  players: string[] | undefined;
  online: boolean;
  host: string;
  port: number;
  options: { query: boolean };

  constructor() {
    this.expiration = undefined;
    this.players = undefined;
    this.online = false;
    this.host = config.HOST_IP;
    this.port = 25565;
    this.options = { query: false };
  }

  public async pollServer() {
    // eslint-disable-next-line no-constant-condition
    while (true) {
      const res = await this.getServerResponse();
      // poll every 1:30 minutes
      this.online = res.online;
      this.expiration = res.expires_at;
      this.online = res.online;

      const current_players = res.players?.list.map(
        (member) => member.name_clean,
      );
      //   const prev_players = this.players;

      //   // find differnce between current and previous players
      //   const new_players = current_players?.filter(
      //     (player) => !prev_players?.includes(player),
      //   );
      //   const left_players = prev_players?.filter(
      //     (player) => !current_players?.includes(player),
      //   );

      //   const channel = client.channels.cache.get("minecraft") as TextChannel;
      //   if (left_players?.length ?? 0 > 0) {
      //     channel.send(`**${left_players?.join(", ")}** left the server`);
      //   }

      //   if (new_players?.length ?? 0 > 0) {
      //     channel.send(`**${new_players?.join(", ")}** joined the server`);
      //   }

      this.players = current_players;

      logger.info("polling server", {
        online: this.online,
        players: this.players,
        expiration: this.expiration,
      });
      await new Promise((r) => setTimeout(r, 90000));
    }
  }
  public getServerStatus() {
    const expiration = round2(((this.expiration ?? 0) - Date.now()) / 1000);
    return {
      online: this.online,
      players: this.players,
      expiration: expiration,
    };
  }

  public async ServerInactivePoweroffHook() {
    let inactive = false;
    // eslint-disable-next-line no-constant-condition
    while (true) {
      await new Promise((r) => setTimeout(r, 20 * 60000));
      if ((this.players?.length ?? 0) > 0) {
        inactive = false;
      } else {
        // const channel = client.channels.cache.get("minecraft") as TextChannel;
        // channel.send("server inactive, powering off");
        logger.info("server inactive, powering off", {
          online: this.online,
          players: this.players,
          expiration: this.expiration,
          inactive: inactive,
        });
        inactive ? await VM.stopServer() : (inactive = true);
        break;
      }
    }
  }

  private async getServerResponse() {
    const res = await statusJava(this.host, this.port, this.options);
    return res;
  }
}

export const VM = await VMInstance.getInstance();
export const SERVER = new ServerPoller();

SERVER.ServerInactivePoweroffHook();
SERVER.pollServer();
