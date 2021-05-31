import {Roles} from "./Roles";
import {Director} from "./Director";
import {Harvester} from "./Roles.Harvester";
import {Tower} from "./Tower";
import {Repair} from "./Roles.Repair";
import {Builder} from "./Roles.Builder";
import {Upgrader} from "./Roles.Upgrader";
const _ = require('lodash');

const desiredColonies = [
   'W8N3',
   'W8N2',
   'W7N2',
   'W7N1',
   'W6N1',
   'W6N2'
];

const priorities = [
   'Defend',
   'DevelopColonies',
   'BuildInfrastructure',
   'Explore'
]

const MAX_CREEPS = {
   [Harvester.type]: 2,
   [Repair.type]: 1,
   [Builder.type]: 3,
   [Upgrader.type]: 4,
};

interface Planner {

}

function init() {
   if(Memory._Mastermind) {

   }
}

export const Mastermind = {
   run() {

      init();

      const creeps = Game.creeps;

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
         const harvesters = _.filter(creeps, (c: Creep) => c.memory.type == Harvester.type);
         if(!harvesters.length) {
            Director.create(Harvester, room, true);
         } else {
            for(let i in maxCreepKeys) {
               let k = maxCreepKeys[i];
               const kcreeps = _.filter(creeps, (c: Creep) => c.memory.type == k);
               if(kcreeps.length < MAX_CREEPS[k]) {
                  Director.create(Roles[k], room);
                  break;
               }
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

      garbageCollection();
   }
}

function garbageCollection() {
   Object.keys(Memory.creeps).forEach((k) => {
      if(!Game.creeps[k]) {
         delete Memory.creeps[k];
      }
   });
}