import {FillEnergyAction, UpgradeControllerAction,} from "./WorkerActions";
import {CreepRole} from "./CreepRole";
import {Action} from "./Action";

export const Harvester: CreepRole & {actions: Action[]} = {
   type: "Harvester",
   bodyRatios: {
      [WORK]: 40,
      [CARRY]: 40,
      [MOVE]: 20
   },
   actions: [
      FillEnergyAction,
      UpgradeControllerAction,
   ],
};