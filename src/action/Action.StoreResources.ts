import {Action} from "./Action";
import {PICKUP_RESOURCE} from "../Utils";

export const StoreResourcesAction: Action = {
   name: "StoreResoures",
   do(creep: Creep): boolean {
      if(creep.store.getUsedCapacity() > 0 &&
         creep.store.getUsedCapacity(RESOURCE_ENERGY) < creep.store.getUsedCapacity()) {
         const struct = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
            filter: (s) => {
               if("store" in s) {
                  return s.structureType === STRUCTURE_STORAGE;
               }
               return false;
            }
         });
         if(struct) {
            for(const i in PICKUP_RESOURCE) {
               if(creep.transfer(struct, PICKUP_RESOURCE[i]) == ERR_NOT_IN_RANGE) {
                  creep.moveTo(struct);
                  return true;
               }
            }
         }
      }
      return false;
   }
};