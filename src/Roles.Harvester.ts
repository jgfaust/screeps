import {CreepRole} from "./CreepRole";
import {Action} from "./Action";
import {UpgradeControllerAction} from "./Action.UpgradeController";
import {FillEnergyAction} from "./Action.FillEnergy";

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