import {CreepRole} from "./CreepRole";
import {UpgradeControllerAction} from "./Action.UpgradeController";
import {FillEnergyAction} from "./Action.FillEnergy";

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