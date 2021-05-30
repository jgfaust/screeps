import {Action} from "./Action";

export const UpgradeControllerAction: Action = {
   name: "UpgradeController",
   do(creep: Creep): boolean {
      const controller = creep.room.controller;
      if(controller) {
         if(creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
            creep.moveTo(controller);
            return true;
         } else {
            return true;
         }
      }
      console.log("UpgradeControllerAction: No controller found");
      return false;
   }
};