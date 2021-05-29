import {CreepRole} from "./Roles";
import {NAME_ID} from "./main";
import {HarvesterState} from "./Roles.Harvester";

export enum BuilderState {
   Harvesting,
   Building
}

export const Builder: CreepRole = {
   type: "Builder",
   create(): ScreepsReturnCode {
      return Game.spawns.Spawn1.spawnCreep([WORK, WORK, MOVE, CARRY],
         this.type + NAME_ID(), {
            memory: {
               creepState: BuilderState.Harvesting,
               type: this.type
            }
         });
   },
   run(creep): void {
      const {creepState} = creep.memory;
      const source = creep.pos.findClosestByPath(FIND_SOURCES);
      const controller = creep.room.controller;
      if(!source) {
         console.log("No source found");
         return;
      }
      if(!controller) {
         console.log("No controller found");
         return;
      }

      switch(creepState) {
         case BuilderState.Harvesting:
            if(creep.store.getFreeCapacity() === 0) {
               creep.memory.creepState = BuilderState.Building;
            } else if(creep.harvest(source) === ERR_NOT_IN_RANGE) {
               creep.moveTo(source);
            }
            break;
         case BuilderState.Building:
            if(creep.store.getFreeCapacity() === creep.store.getCapacity()) {
               creep.memory.creepState = HarvesterState.Harvesting;
            } else {
               const sites = creep.room.find(FIND_CONSTRUCTION_SITES);
               const spawnStore = Game.spawns.Spawn1.store;
               if(sites.length) {
                  sites.sort((a, b) =>
                     a.progress - b.progress);
                  const site = sites[sites.length-1];
                  if(creep.build(site) == ERR_NOT_IN_RANGE) {
                     creep.moveTo(site);
                  }
               } else {
                  if(spawnStore[RESOURCE_ENERGY] < spawnStore.getCapacity(RESOURCE_ENERGY)) {
                     if(creep.transfer(Game.spawns.Spawn1, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(Game.spawns.Spawn1);
                     }
                  } else {
                     const controller = creep.room.controller;
                     if(controller && creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
                        creep.moveTo(controller);
                     }
                  }
               }
            }
            break;
         default:
            creep.memory.creepState = BuilderState.Harvesting;
            break;
      }
   }
};