import {Action} from "./Action";
import {PICKUP_RESOURCE} from "../Utils";

export const StoreResourcesAction: Action = {
   name: "StoreResoures",
   do(creep: Creep): boolean {
      // console.log("storing?", creep.store.getUsedCapacity(), creep.store.getUsedCapacity(RESOURCE_ENERGY));
      if(creep.store.getUsedCapacity() > 0 &&
         creep.store.getUsedCapacity(RESOURCE_ENERGY) < creep.store.getUsedCapacity()) {
         console.log("attempt store");
         const struct = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
            filter: (s) => {
               if("store" in s) {
                  return s.structureType === STRUCTURE_STORAGE;
               }
               return false;
            }
         });
         console.log("struct", struct);
         if(struct) {
            for(const i in PICKUP_RESOURCE) {
               if(creep.transfer(struct, PICKUP_RESOURCE[i]) == ERR_NOT_IN_RANGE) {
                  creep.moveTo(struct);
                  return true;
               }
            }
         }
      }

      // console.log("storing: false");

      return false;
   }
};