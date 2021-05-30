import {Action} from "./Action";
import {CreepState} from "./CreepState";

export const HarvestAction: Action = {
   name: "Harvest",
   do(creep: Creep): boolean {
      let source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
/*      if(!source) {
         let storage = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
            filter: (s) =>
               s.structureType === STRUCTURE_STORAGE &&
               s.store.getUsedCapacity(RESOURCE_ENERGY) > 0
         });
         if(storage) {
            if(creep.withdraw(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
               creep.moveTo(storage);
               return true;
            } else {
               return true;
            }
         }
      }*/
      if(!source) {
         console.log(creep.name, ": can't find path to active source");
         return false;
      } else {
         if(creep.harvest(source) === ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
            return true;
         } else {
            return true;
         }
      }
   }
};