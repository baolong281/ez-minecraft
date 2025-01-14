import { config } from "./config";
import logger from "./logger";
import { statusJava } from "node-mcstatus";

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

  private async getServerResponse() {
    const res = await statusJava(this.host, this.port, this.options);
    return res;
  }
}

export const SERVER = new ServerPoller();

SERVER.pollServer();
