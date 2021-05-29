import {Roles} from './Roles';
import {Harvester} from "./Roles.Harvester";
import {Upgrader} from "./Roles.Upgrader";
import {Builder} from "./Roles.Builder";
const _ = require('lodash');

const MAX_CREEPS = {
   [Builder.type]: 5,
   [Upgrader.type]: 5,
   [Harvester.type]: 5,
};


module.exports.loop = function() {
   const creeps = Game.creeps;

   /*
   console.log('echo');
   Object.keys(Memory.creeps).forEach((k) => {
      console.log(k, Game.creeps[k]?.ticksToLive);
      if(!Game.creeps[k]?.ticksToLive) {
         delete Memory.creeps[k];
      }
   });*/

   Object.keys(MAX_CREEPS).forEach((k) => {
      const kcreeps = _.filter(creeps, (c: Creep) => c.memory.type == k);
      if(kcreeps.length < MAX_CREEPS[k]) {
         Roles[k].create();
      }
   });

   const roles = Object.values(Roles);
   Object.keys(creeps).forEach((c) => {
      const creep = creeps[c];
      roles.find((r) => r.type === creep.memory.type)?.run(creep);
   });
};
