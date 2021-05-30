import {CreepRole} from "./CreepRole";
import {FillEnergyAction, UpgradeControllerAction} from "./WorkerActions";

export const Upgrader: CreepRole = {
   type: "Upgrader",
   bodyRatios: {
      [WORK]: 35,
      [CARRY]: 35,
      [MOVE]: 30,
   },
   actions: [
      UpgradeControllerAction
   ],
};