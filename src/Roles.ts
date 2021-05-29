import {Harvester} from "./Roles.Harvester";
import {Upgrader} from "./Roles.Upgrader";
import {Builder} from "./Roles.Builder";
import {CreepRole} from "./CreepRole";

export enum CreepState {
   Harvesting,
   Working
}

export const Roles: { [K: string]: CreepRole } = {
   Harvester,
   Upgrader,
   Builder
};
