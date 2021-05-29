import {CreepRole} from "./Roles";
import {NAME_ID} from "./main";

export enum HarvesterState {
   Harvesting,
   Transferring
}

/*
Game.spawns['Spawn1'].spawnCreep( [WORK,WORK,WORK,WORK,CARRY,MOVE,MOVE],
    'HarvesterBig',
    { memory: { role: 'harvester' } } );

var roleHarvester = {

run: function(creep) {
   if(creep.store.getFreeCapacity() > 0) {
      var sources = creep.room.find(FIND_SOURCES);
      if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
         creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
      }
   }
   else {
      var targets = creep.room.find(FIND_STRUCTURES, {
         filter: (structure) => {
            return (structure.structureType == STRUCTURE_EXTENSION || structure.structureType == STRUCTURE_SPAWN) &&
               structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
         }
      });
      if(targets.length > 0) {
         if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
         }
      }
   }
}
};

module.exports = roleHarvester;


var roleHarvester = {

run: function(creep) {
   if(creep.store.getFreeCapacity() > 0) {
      var sources = creep.room.find(FIND_SOURCES);
      if(creep.harvest(sources[0]) == ERR_NOT_IN_RANGE) {
         creep.moveTo(sources[0], {visualizePathStyle: {stroke: '#ffaa00'}});
      }
   }
   else {
      var targets = creep.room.find(FIND_STRUCTURES, {
         filter: (structure) => {
            return (structure.structureType == STRUCTURE_EXTENSION ||
               structure.structureType == STRUCTURE_SPAWN ||
               structure.structureType == STRUCTURE_TOWER) &&
               structure.store.getFreeCapacity(RESOURCE_ENERGY) > 0;
         }
      });
      if(targets.length > 0) {
         if(creep.transfer(targets[0], RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
            creep.moveTo(targets[0], {visualizePathStyle: {stroke: '#ffffff'}});
         }
      }
   }
}
};

module.exports = roleHarvester;

 */

export const Harvester: CreepRole = {
   type: "Harvester",

   create(): ScreepsReturnCode {
      return Game.spawns.Spawn1.spawnCreep([WORK, WORK, MOVE, CARRY],
         this.type + NAME_ID(), {
            memory: {
               creepState: HarvesterState.Harvesting,
               type: this.type
            }
         });
   },

   run(creep): void {
      if(creep.memory.type !== this.type) {
         console.log(`Harvester tried running creep of type ${creep.memory.type}`);
         return;
      }
      const {creepState} = creep.memory;
      const source = creep.pos.findClosestByPath(FIND_SOURCES);
      if(!source) {
         console.log("No source found");
         return;
      }

      // console.log(`${creep.name}: capacity ${creep.store.getFreeCapacity()}`);

      switch(creepState) {
         case HarvesterState.Harvesting:
            if(creep.store.getFreeCapacity() === 0) {
               creep.memory.creepState = HarvesterState.Transferring;
            } else if(creep.harvest(source) === ERR_NOT_IN_RANGE) {
               creep.moveTo(source);
            }
            break;
         case HarvesterState.Transferring:
            if(creep.store.getFreeCapacity() === creep.store.getCapacity()) {
               creep.memory.creepState = HarvesterState.Harvesting;
            } else if(creep.transfer(Game.spawns.Spawn1, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
               creep.moveTo(Game.spawns.Spawn1);
            }
            break;
         default:
            creep.memory.creepState = HarvesterState.Harvesting;
            break;
      }
   }
};