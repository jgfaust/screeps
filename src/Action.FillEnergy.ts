import {Action} from "./Action";

export const FillEnergyAction: Action = {
   name: "FillEnergy",
   do(creep: Creep): boolean {
      // todo - prioritize defensive energy such as towers
      const room = creep.room;
      if(room) {
         let spawns = creep.room.find(FIND_MY_SPAWNS, {
            filter: (s) => {
               if("store" in s) {
                  return s.store[RESOURCE_ENERGY] < s.store.getCapacity(RESOURCE_ENERGY);
               }
               return false;
            }
         });
         if(spawns.length) {
            if(creep.transfer(spawns[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
               creep.moveTo(spawns[0]);
               return true;
            } else {
               return true;
            }
         }
         const struct = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
            filter: (s) => {
               if("store" in s) {
                  return s.store[RESOURCE_ENERGY] < s.store.getCapacity(RESOURCE_ENERGY);
               }
               return false;
            }
         });

         // @ts-ignore
         // console.log(structs.length, structs.map((s) => s.store[RESOURCE_ENERGY]));
         if(struct) {
            if(creep.transfer(struct, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
               creep.moveTo(struct);
               return true;
            } else {
               return true;
            }
         }
      } else {
         console.log("FillSpawnAction: No room provided, can't find structures");
         return false;
      }
      // console.log("FillSpawnAction: No structures with free energy capacity found");
      return false;
   }
};