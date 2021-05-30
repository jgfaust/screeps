import {Action} from "./Action";

function closestByMostDamaged(creep: Creep) {
   let t = .0001;
   while(t <= 1) {
      const s = closestByDamage(creep, t);
      if(s) {
         return s;
      }
      t += .005;
   }
   return null;
}

function closestByDamage(creep: Creep, threshhold: number) {
   return creep.pos.findClosestByRange(FIND_STRUCTURES, {
      filter: (structure: AnyStructure) => structure.hits / structure.hitsMax < threshhold
   });
}

export const RepairAction: Action = {
   name: "Repair",
   do(creep: Creep): boolean {
      // todo prioritize defensive structures
      const closestDamagedStructure = closestByMostDamaged(creep);
      if(closestDamagedStructure) {
         if(creep.repair(closestDamagedStructure) == ERR_NOT_IN_RANGE) {
            creep.moveTo(closestDamagedStructure);
            return true;
         } else {
            return true;
         }
      }
      // console.log("BuildAction: No sites found");
      return false;
   }
};