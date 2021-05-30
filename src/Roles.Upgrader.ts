import {CreepRole} from "./CreepRole";
import {UpgradeControllerAction} from "./Action.UpgradeController";

export const Upgrader: CreepRole = {
   type: "Upgrader",
   bodyRatios: {
      [WORK]: 45,
      [CARRY]: 35,
      [MOVE]: 20,
   },
   actions: [
      UpgradeControllerAction
   ],
};