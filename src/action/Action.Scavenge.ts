import {Action} from "./Action";
import {PICKUP_RESOURCE} from "../Utils";


export const ScavengeAction: Action = {
   name: "Scavenge",
   do(creep: Creep): boolean {
      const source = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
         filter: (r) => r.resourceType === RESOURCE_ENERGY &&
            r.amount > 0
      });
      if(source) {
         if(creep.pickup(source) === ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
            return true;
         } else {
            return true;
         }
      } else {
         const tomb = creep.pos.findClosestByPath(FIND_TOMBSTONES, {
            filter: (r) => r.store.getUsedCapacity() > 0
         });
         if(tomb) {
            if(creep.withdraw(tomb, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
               creep.moveTo(tomb);
               return true;
            }
            for(const i in PICKUP_RESOURCE) {
               if(creep.withdraw(tomb, PICKUP_RESOURCE[i]) == ERR_NOT_IN_RANGE) {
                  creep.moveTo(tomb);
                  return true;
               }
            }
         } else {
            const ruin = creep.pos.findClosestByPath(FIND_RUINS, {
               filter: (r) => r.store.getUsedCapacity(RESOURCE_ENERGY) > 0
            });
            if(ruin) {
               if(creep.withdraw(ruin, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                  creep.moveTo(ruin);
                  return true;
               } else {
                  return true;
               }
            }
         }
      }
      return false;
   }
};