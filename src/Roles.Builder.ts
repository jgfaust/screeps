import {CreepRole} from "./CreepRole";
import {RepairAction} from "./Action.Repair";
import {BuildAction} from "./Action.Build";
import {UpgradeControllerAction} from "./Action.UpgradeController";
import {FillEnergyAction} from "./Action.FillEnergy";

export const Builder: CreepRole = {
   type: "Builder",
   bodyRatios: {
      [WORK]: 60,
      [CARRY]: 20,
      [MOVE]: 20
   },
   actions: [
      BuildAction,
      RepairAction,
      FillEnergyAction,
      UpgradeControllerAction
   ],
};