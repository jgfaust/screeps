import {CreepRole} from "./Roles";

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
   run(creep): void {
      const {creepState} = creep.memory;
      const source = creep.pos.findClosestByPath(FIND_SOURCES);
      if(!source) {
         console.log("No source found");
         return;
      }

      switch(creepState) {
         case HarvesterState.Harvesting:
            if(creep.store.getFreeCapacity() === creep.store.getCapacity()) {
               creep.memory.creepState = HarvesterState.Transferring;
            } else if(creep.harvest(source) === ERR_NOT_IN_RANGE) {
               creep.moveTo(source);
            }
            break;
         case HarvesterState.Transferring:
            if(creep.store.getFreeCapacity() > 0) {
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
}