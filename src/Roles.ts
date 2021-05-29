import {Harvester, HarvesterState} from "./Roles.Harvester";
import {Upgrader, UpgraderState} from "./Roles.Upgrader";

export interface CreepRole {
   run(creep: Creep): void;
}

export type CreepState = HarvesterState | UpgraderState;

export const Roles: { [K: string]: CreepRole } = {
   Harvester,
   Upgrader
};