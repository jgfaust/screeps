import {Roles} from './Roles';
import filter from 'lodash/filter';
import {Harvester} from "./Roles.Harvester";
import {Upgrader} from "./Roles.Upgrader";

const maxHarvesters = 5;
const maxUpgraders = 5;
export const NAME_ID = (() => {
   let initial = Number.parseInt(`${Date.now()}`.substr(4, 4));
   return () => initial++;
})();

module.exports.loop = function() {
   const creeps = Game.creeps;
   const harvesters = filter(creeps, (c) => c.memory.type == Harvester.type);
   const upgrader = filter(creeps, (c) => c.memory.type == Upgrader.type);

   if(harvesters.length < maxHarvesters) {
      Harvester.create();
   }
   if(upgrader.length < maxUpgraders) {
      Upgrader.create();
   }

   const roles = Object.values(Roles);
   Object.keys(creeps).forEach((c) => {
      const creep = creeps[c];
      roles.find((r) => r.type === creep.memory.type)?.run(creep);
   });
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