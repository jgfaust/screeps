import {Action} from "./Action";

export const ScavengeAction: Action = {
   name: "Scavenge",
   do(creep: Creep): boolean {
      let source: Tombstone | Resource | null = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
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
         source = creep.pos.findClosestByPath(FIND_TOMBSTONES, {
            filter: (r) => r.store.getUsedCapacity(RESOURCE_ENERGY) > 0
         });
         if(source) {
            if(creep.withdraw(source, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
               creep.moveTo(source);
               return true;
            } else {
               return true;
            }
         }
      }
      return false;
   }
};