import {Action} from "./Action";

export const BuildAction: Action = {
   name: "Build",
   do(creep: Creep): boolean {
      const site = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
      if(site) {
         if(creep.build(site) == ERR_NOT_IN_RANGE) {
            creep.moveTo(site);
            return true;
         } else {
            return true;
         }
      }
      // console.log("BuildAction: No sites found");
      return false;
   }
};