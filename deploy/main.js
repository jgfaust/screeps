'use strict';

var HarvesterState;
(function (HarvesterState) {
    HarvesterState[HarvesterState["Harvesting"] = 0] = "Harvesting";
    HarvesterState[HarvesterState["Transferring"] = 1] = "Transferring";
})(HarvesterState || (HarvesterState = {}));
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
const Harvester = {
    run(creep) {
        const { creepState } = creep.memory;
        const source = creep.pos.findClosestByPath(FIND_SOURCES);
        if (!source) {
            console.log("No source found");
            return;
        }
        switch (creepState) {
            case HarvesterState.Harvesting:
                if (creep.store.getFreeCapacity() === creep.store.getCapacity()) {
                    creep.memory.creepState = HarvesterState.Transferring;
                }
                else if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
                break;
            case HarvesterState.Transferring:
                if (creep.store.getFreeCapacity() > 0) {
                    creep.memory.creepState = HarvesterState.Harvesting;
                }
                else if (creep.transfer(Game.spawns.Spawn1, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(Game.spawns.Spawn1);
                }
                break;
            default:
                creep.memory.creepState = HarvesterState.Harvesting;
                break;
        }
    }
};

var UpgraderState;
(function (UpgraderState) {
    UpgraderState[UpgraderState["Harvesting"] = 0] = "Harvesting";
    UpgraderState[UpgraderState["Upgrading"] = 1] = "Upgrading";
})(UpgraderState || (UpgraderState = {}));
const Upgrader = {
    run(creep) {
        const { creepState } = creep.memory;
        const source = creep.pos.findClosestByPath(FIND_SOURCES);
        const controller = creep.room.controller;
        if (!source) {
            console.log("No source found");
            return;
        }
        if (!controller) {
            console.log("No controller found");
            return;
        }
        switch (creepState) {
            case UpgraderState.Harvesting:
                if (creep.store.getFreeCapacity() === creep.store.getCapacity()) {
                    creep.memory.creepState = UpgraderState.Upgrading;
                }
                else if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(source);
                }
                break;
            case UpgraderState.Upgrading:
                if (creep.store.energy === 0) {
                    creep.memory.creepState = UpgraderState.Harvesting;
                }
                else if (creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(controller);
                }
                break;
            default:
                creep.memory.creepState = UpgraderState.Harvesting;
                break;
        }
    }
};

const Roles = {
    Harvester,
    Upgrader
};

module.exports.loop = function () {
    const creeps = Game.creeps;
    Object.keys(creeps).forEach((c) => Roles.Harvester.run(creeps[c]));
};
/*
var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.builder');


StructureSpawn.renewCreep()


module.exports.loop = function () {

    for(var name in Memory.creeps) {
        if(!Game.creeps[name]) {
            delete Memory.creeps[name];
            console.log('Clearing non-existing creep memory:', name);
        }
    }

    var harvesters = _.filter(Game.creeps, (creep) => creep.memory.role == 'harvester');
    console.log('Harvesters: ' + harvesters.length);

    if(harvesters.length < 2) {
        var newName = 'Harvester' + Game.time;
        console.log('Spawning new harvester: ' + newName);
        Game.spawns['Spawn1'].spawnCreep([WORK,CARRY,MOVE], newName,
            {memory: {role: 'harvester'}});
    }

    if(Game.spawns['Spawn1'].spawning) {
        var spawningCreep = Game.creeps[Game.spawns['Spawn1'].spawning.name];
        Game.spawns['Spawn1'].room.visual.text(
            '🛠️' + spawningCreep.memory.role,
            Game.spawns['Spawn1'].pos.x + 1,
            Game.spawns['Spawn1'].pos.y,
            {align: 'left', opacity: 0.8});
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
    }
}

var roleHarvester = require('role.harvester');
var roleUpgrader = require('role.upgrader');
var roleBuilder = require('role.builder');

module.exports.loop = function () {

    var tower = Game.getObjectById('cbeb270b8d01a2afe7927281');
    if(tower) {
        var closestDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if(closestDamagedStructure) {
            tower.repair(closestDamagedStructure);
        }

        var closestHostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
        if(closestHostile) {
            tower.attack(closestHostile);
        }
    }

    for(var name in Game.creeps) {
        var creep = Game.creeps[name];
        if(creep.memory.role == 'harvester') {
            roleHarvester.run(creep);
        }
        if(creep.memory.role == 'upgrader') {
            roleUpgrader.run(creep);
        }
        if(creep.memory.role == 'builder') {
            roleBuilder.run(creep);
        }
    }
}
 */
//# sourceMappingURL=main.js.map
