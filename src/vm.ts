import { config } from "./config";
import { getServerResponse } from "./commands/status";
import logger from "./logger";

import { DefaultAzureCredential } from "@azure/identity";
import { ComputeManagementClient } from "@azure/arm-compute";

class VMInstance {
  credentials: DefaultAzureCredential;
  client: ComputeManagementClient;
  vmname: string;

  constructor() {
    this.credentials = new DefaultAzureCredential();
    this.client = new ComputeManagementClient(this.credentials, config.SUB_ID);
    this.vmname = "minecraftez";
  }

  public async startServer() {
    const res = await getServerResponse();
    if (res.online) {
      return -1;
    }
    const start = performance.now();
    const result = await this.client.virtualMachines.beginStartAndWait(
      config.R_GROUP,
      this.vmname,
    );
    logger.info("start_server", result);
    const end = performance.now();
    return Math.round(((end - start) / 1000) * 10) / 10;
  }

  public async stopServer() {
    const res = await getServerResponse();
    if (!res.online) {
      return -1;
    }
    const start = performance.now();
    const result = await this.client.virtualMachines.beginPowerOffAndWait(
      config.R_GROUP,
      this.vmname,
    );
    logger.info("stop_server", result);
    const end = performance.now();
    return Math.round(((end - start) / 1000) * 10) / 10;
  }
}

export const VM = new VMInstance();
