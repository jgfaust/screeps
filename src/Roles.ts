import {Harvester, HarvesterState} from "./Roles.Harvester";
import {Upgrader, UpgraderState} from "./Roles.Upgrader";
import {Builder, BuilderState} from "./Roles.Builder";

export interface CreepRole {
   type: string;
   create(): ScreepsReturnCode;
   run(creep: Creep): void;
}

export type CreepState = HarvesterState | UpgraderState | BuilderState;

export const Roles: { [K: string]: CreepRole } = {
   Harvester,
   Upgrader,
   Builder
};