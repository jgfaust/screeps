import {Action} from "./Action";
import {CreepState} from "./CreepState";

export const HarvestAction: Action = {
   name: "Harvest",
   do(creep: Creep): boolean {
      const source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
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