import {Harvester} from "./Role.Harvester";
import {Upgrader} from "./Role.Upgrader";
import {Builder} from "./Role.Builder";
import {CreepRole} from "../CreepRole";
import {Repair} from "./Role.Repair";

export const Role: { [K: string]: CreepRole } = {
   Harvester,
   Upgrader,
   Builder,
   Repair,
};
