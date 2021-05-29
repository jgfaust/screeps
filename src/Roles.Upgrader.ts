import {CreepRole} from "./Roles";

export enum UpgraderState {
   Harvesting,
   Upgrading
}

export const Upgrader: CreepRole = {
   run(creep): void {
      const {creepState} = creep.memory;
      const source = creep.pos.findClosestByPath(FIND_SOURCES);
      const controller = creep.room.controller;
      if(!source) {
         console.log("No source found");
         return;
      }
      if(!controller) {
         console.log("No controller found");
         return;
      }

      switch(creepState) {
         case UpgraderState.Harvesting:
            if(creep.store.getFreeCapacity() === creep.store.getCapacity()) {
               creep.memory.creepState = UpgraderState.Upgrading;
            } else if(creep.harvest(source) === ERR_NOT_IN_RANGE) {
               creep.moveTo(source);
            }
            break;
         case UpgraderState.Upgrading:
            if(creep.store.energy === 0) {
               creep.memory.creepState = UpgraderState.Harvesting;
            } else if(creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
               creep.moveTo(controller);
            }
            break;
         default:
            creep.memory.creepState = UpgraderState.Harvesting;
            break;
      }
   }
}