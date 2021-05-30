import {Action} from "./Action";

const _ = require("lodash");

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

export const UpgradeControllerAction: Action = {
   name: "UpgradeController",
   do(creep: Creep): boolean {
      const controller = creep.room.controller;
      if(controller) {
         if(creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
            creep.moveTo(controller);
            return true;
         } else {
            return true;
         }
      }
      console.log("UpgradeControllerAction: No controller found");
      return false;
   }
};

export const BuildAction: Action = {
   name: "Build",
   do(creep: Creep): boolean {
      const sites = creep.room.find(FIND_CONSTRUCTION_SITES);
      if(sites.length) {
         sites.sort((a, b) =>
            a.progress - b.progress);
         const site = sites[sites.length - 1];
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

function closestByMostDamaged(creep: Creep) {
   let t = .05;
   while(t <= 1) {
      const s = closestByDamage(creep, t);
      if(s) {
         return s;
      }
      t += .05;
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

