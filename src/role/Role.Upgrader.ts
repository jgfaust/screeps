import {CreepRole} from "../CreepRole";
import {UpgradeControllerAction} from "../action/Action.UpgradeController";
import {StoreResourcesAction} from "../action/Action.StoreResources";

export const Upgrader: CreepRole = {
   type: "Upgrader",
   bodyRatios: {
      [WORK]: 45,
      [CARRY]: 35,
      [MOVE]: 20,
   },
   actions: [
      StoreResourcesAction,
      UpgradeControllerAction
   ],
};