import {Action} from "./Action";

function closestByDamage(creep: Creep) {
   let structs = creep.pos.findClosestByPath(FIND_STRUCTURES, {
      filter: (structure: AnyStructure) => {
         switch(structure.structureType) {
            case STRUCTURE_WALL:
            case STRUCTURE_RAMPART:
               return false;
            default:
               return structure.hits / structure.hitsMax < .75;
         }
      }
   });
   if(structs) {
      return structs;
   } else {
      return creep.pos.findClosestByPath(FIND_STRUCTURES, {
         filter: (structure: AnyStructure) => {
            switch(structure.structureType) {
               case STRUCTURE_WALL:
               case STRUCTURE_RAMPART:
                  return false;
               default:
                  return structure.hits < structure.hitsMax;
            }
         }
      });
   }
}

export const MunicipalRepairAction: Action = {
   name: "MunicipalRepair",
   do(creep: Creep): boolean {
      const closestDamagedStructure = closestByDamage(creep);
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