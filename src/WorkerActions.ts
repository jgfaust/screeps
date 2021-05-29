import {CreepState} from "./Roles";
import {CreepRole} from "./CreepRole";

export interface Action {
   name: string;
   do: (creep: Creep) => boolean;
}

export const FillEnergyAction: Action = {
   name: "FillEnergy",
   do(creep: Creep): boolean {
      const room = creep.room;
      if(room) {
         const structs = room.find(FIND_MY_STRUCTURES, {
            filter: (s) => {
               if("store" in s) {
                  return s.store[RESOURCE_ENERGY] < s.store.getFreeCapacity(RESOURCE_ENERGY);
               }
               return false;
            }
         });
         // @ts-ignore
         // console.log(structs.length, structs.map((s) => s.store[RESOURCE_ENERGY]));
         if(structs.length) {
            if(creep.transfer(structs[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
               creep.moveTo(structs[0]);
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

export const RepairAction: Action = {
   name: "Repair",
   do(creep: Creep): boolean {
      const closestDamagedStructure = creep.pos.findClosestByRange(FIND_STRUCTURES, {
         filter: (structure) => structure.hits < structure.hitsMax
      });
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

export function workerCreepRun(role: CreepRole, creep: Creep): void {
   if(creep.memory.type !== role.type) {
      console.log(`Harvester tried running creep of type ${creep.memory.type}`);
      return;
   }
   const {creepState} = creep.memory;
   const source = creep.pos.findClosestByPath(FIND_SOURCES);
   if(!source) {
      console.log("Creep can't find path to source");
      return;
   }

   switch(creepState) {
      case CreepState.Harvesting:
         if(creep.store.getFreeCapacity() === 0) {
            creep.memory.creepState = CreepState.Working;
         } else if(creep.harvest(source) === ERR_NOT_IN_RANGE) {
            creep.moveTo(source);
         }
         break;
      case CreepState.Working:
         if(creep.store.energy === 0) {
            creep.say("Harvesting");
            creep.memory.creepState = CreepState.Harvesting;
         } else {
            for(let i = 0; i < role.actions.length; i++) {
               if(role.actions[i].do(creep)) {
                  creep.say(role.actions[i].name);
                  break;
               }
            }
         }
         break;
      default:
         creep.memory.creepState = CreepState.Harvesting;
         break;
   }
}