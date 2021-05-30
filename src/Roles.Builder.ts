import {CreepRole} from "./CreepRole";
import {BuildAction, FillEnergyAction, RepairAction, UpgradeControllerAction} from "./WorkerActions";

export const Builder: CreepRole = {
   type: "Builder",
   bodyRatios: {
      [WORK]: 50,
      [CARRY]: 30,
      [MOVE]: 20
   },
   actions: [
      BuildAction,
      RepairAction,
      FillEnergyAction,
      UpgradeControllerAction
   ],
};