import {Roles} from './Roles';
import {Harvester} from "./Roles.Harvester";
import {Upgrader} from "./Roles.Upgrader";
import {Builder} from "./Roles.Builder";
import {Tower} from "./Tower";
import {Director} from "./Director";
import {Repair} from "./Roles.Repair";
const _ = require('lodash');

const MAX_CREEPS = {
   [Harvester.type]: 2,
   [Repair.type]: 1,
   [Builder.type]: 3,
   [Upgrader.type]: 4,
};

module.exports.loop = function() {
   const creeps = Game.creeps;

   Object.keys(Memory.creeps).forEach((k) => {
      if(!Game.creeps[k]) {
         delete Memory.creeps[k];
      }
   });

   const roles = Object.values(Roles);
   Object.keys(creeps).forEach((c) => {
      const creep = creeps[c];
      const role = roles.find((r) => r.type === creep.memory.type);
      if(role && creep) {
         Director.run(role, creep);
      } else {
         console.log("Couldn't find a role for creep", creep, role);
      }
   });

   Object.keys(Game.rooms).forEach((k) => {
      const room = Game.rooms[k];

      const maxCreepKeys = Object.keys(MAX_CREEPS);
      for(let i in maxCreepKeys) {
         let k = maxCreepKeys[i];
         const kcreeps = _.filter(creeps, (c: Creep) => c.memory.type == k);
         if(kcreeps.length < MAX_CREEPS[k]) {
            Director.create(Roles[k], room);
            break;
         }
      }

      const towers: StructureTower[] = room.find(FIND_MY_STRUCTURES, {
         filter: {structureType: STRUCTURE_TOWER}
      }) as StructureTower[];
      if(towers.length) {
         towers.forEach((tower) => {
            const hostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if(hostile) {
               if(tower.attack(hostile) === ERR_NOT_IN_RANGE) {
                  Tower.run(tower);
               }
            } else {
               towers.forEach(Tower.run);
            }
         });
      }
   });
};
