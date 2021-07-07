import {BodyRatio, CreepRole} from "./CreepRole";
import {NAME_ID} from "./Utils";
import {CreepState} from "./CreepState";
import {ScavengeAction} from "./action/Action.Scavenge";
import {HarvestAction} from "./action/Action.Harvest";
import {Role} from "./role/Role";
import {Harvester} from "./role/Role.Harvester";
import {Tower} from "./Tower";
import {Repair} from "./role/Role.Repair";
import {Builder} from "./role/Role.Builder";
import {Upgrader} from "./role/Role.Upgrader";
import {Partial} from "rollup-plugin-typescript2/dist/partial";

const _ = require("lodash");

const HARVEST = [
   ScavengeAction,
   HarvestAction
];

const MAX_CREEPS = {
   [Harvester.type]: 2,
   [Repair.type]: 1,
   [Builder.type]: 3,
   [Upgrader.type]: 4,
};

const priorities = [
   'Defend',
   'DevelopColonies',
   'BuildInfrastructure',
   'Explore'
];


const levelPriorities = {
   1: {},
   2: {},
   3: {},
   4: {},
   5: {},
   6: {},
   7: {},
   8: {},
};

function getNumberOfBodyPartsByRatio(energyCapacity: number, bodyRatios: Partial<BodyRatio>): Partial<BodyRatio> {
   let remainingEnergy = energyCapacity;
   let bodyRatioSum = 0;
   let chunkSum = 0;
   const partCount: Partial<BodyRatio> = {};
   const normalizedRatios: Partial<BodyRatio> = {};
   Object.keys(bodyRatios).forEach((k) => bodyRatioSum += bodyRatios[k as BodyPartConstant]!);
   Object.keys(bodyRatios).forEach((k) => {
      const part: BodyPartConstant = k as BodyPartConstant;
      const portion = (bodyRatios[part]! / bodyRatioSum) * energyCapacity;
      normalizedRatios[part] = Math.floor((bodyRatios[part]! / bodyRatioSum) * MAX_CREEP_SIZE);
      const chunkCount = Math.floor(portion / BODYPART_COST[part]);
      partCount[part] = chunkCount;
      remainingEnergy -= (chunkCount * BODYPART_COST[part]);
      chunkSum += chunkCount;
   });
   if(chunkSum > MAX_CREEP_SIZE) {
      return normalizedRatios;
   } else {
      return partCount;
   }
}


export const ColonyDirector = {
   run(room: Room) {
      const roles = Object.values(Role);
      const creeps: Creep[] = Object.keys(Game.creeps)
         .filter((name) => name.startsWith(room.name))
         .map((creepName) => Game.creeps[creepName]);

      creeps.forEach((creep) => {
         const role = roles.find((r) => r.type === creep.memory.type);
         if(role && creep) {
            this.creepAction(role, creep);
         } else {
            console.log("Couldn't find a role for creep", creep, role);
         }
      });

      const maxCreepKeys = Object.keys(MAX_CREEPS);
      const harvesters = _.filter(creeps, (c: Creep) => c.memory.type == Harvester.type);
      if(!harvesters.length) {
         this.create(Harvester, room, true);
      } else {
         for(let i in maxCreepKeys) {
            let k = maxCreepKeys[i];
            const kcreeps = _.filter(creeps, (c: Creep) => c.memory.type == k);
            // console.log(k, kcreeps);
            if(kcreeps.length < MAX_CREEPS[k]) {
               this.create(Role[k], room);
               break;
            }
         }
      }

      Tower.run(room);
   },
   create(role: CreepRole, room: Room, force?: boolean): ScreepsReturnCode {
      const spawn = room.find(FIND_MY_SPAWNS);
      if(spawn.length) {
         if(room.energyAvailable > 800) {
            force = true;
         }
         const capacity = role.maxCost || (force ? room.energyAvailable : room.energyCapacityAvailable);
         // console.log("create", role.type, capacity, room.energyAvailable);
         if(room.energyAvailable >= capacity) {
            const bodyParts: BodyPartConstant[] = [];
            if("bodyRatios" in role) {
               /*let remaining = capacity;
               let bodyRatioSum = 0;
               Object.keys(role.bodyRatios).forEach((k) => bodyRatioSum += role.bodyRatios[k as BodyPartConstant]!);
               Object.keys(role.bodyRatios).forEach((k) => {
                  const part: BodyPartConstant = k as BodyPartConstant;
                  const portion = (role.bodyRatios[part]! / bodyRatioSum) * capacity;
                  const chunkCount = Math.floor(portion / BODYPART_COST[part]);
                  remaining -= (chunkCount * BODYPART_COST[part]);
                  _.times(Math.min(MAX_CREEP_SIZE - bodyParts.length, chunkCount - bodyParts.length), () => bodyParts.push(part));
               });

               _.times(Math.min(MAX_CREEP_SIZE - bodyParts.length, Math.floor(remaining / BODYPART_COST[MOVE]) - bodyParts.length), () => bodyParts.push(MOVE));*/

               const numberOfParts = getNumberOfBodyPartsByRatio(capacity, role.bodyRatios);
               Object.keys(numberOfParts)
                  .forEach((k) =>
                     _.times(numberOfParts[k as BodyPartConstant], () => bodyParts.push(k as BodyPartConstant)));

            } else {
               let remaining = capacity;
               let expandoPart: BodyPartConstant | undefined = undefined;
               const keys = Object.keys(role.bodyParts);
               for(const i in keys) {
                  const part: BodyPartConstant = keys[i] as BodyPartConstant;
                  if(role.bodyParts[part]! === '*') {
                     expandoPart = part;
                  } else {
                     _.times(Math.min(MAX_CREEP_SIZE - bodyParts.length, (role.bodyParts[part]! as number) - bodyParts.length), () => bodyParts.push(part));
                  }
               }

               // todo - balance if multiple expandos provided
               if(expandoPart) {
                  _.times(Math.min(MAX_CREEP_SIZE - bodyParts.length, Math.floor(remaining / BODYPART_COST[MOVE]) - bodyParts.length), () => bodyParts.push(expandoPart!));
               }
            }


            const name = `${room.name}_${role.type}_${NAME_ID()}`;
            const creation = spawn[0].spawnCreep(bodyParts, name, {
               memory: {
                  creepState: CreepState.Harvesting,
                  type: role.type
               },
               directions: [BOTTOM]
            });
            if(creation !== OK) {
               console.log("couldn't create", creation, name, bodyParts.length, bodyParts);
            } else {
               console.log("spawned", creation, name, bodyParts.length, bodyParts);
            }
         } else {
            return ERR_NOT_ENOUGH_ENERGY;
         }
      }
      return ERR_NOT_FOUND;
   },
   creepAction(role: CreepRole, creep: Creep) {
      if(creep.memory.type !== role.type) {
         console.log(`Harvester tried running creep of type ${creep.memory.type}`);
         return;
      }
      const {creepState} = creep.memory;

      switch(creepState) {
         case CreepState.Harvesting:
            if(creep.store.getFreeCapacity() === 0) {
               creep.memory.creepState = CreepState.Working;
            } else {
               let resourceAvailable = false;
               for(let i = 0; i < HARVEST.length; i++) {
                  if(HARVEST[i].do(creep)) {
                     resourceAvailable = true;
                     break;
                  }
               }
               if(!resourceAvailable && creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
                  creep.memory.creepState = CreepState.Working;
               }
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
};