import {CreepRole} from "./CreepRole";
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
            if(kcreeps.length < MAX_CREEPS[k]) {
               this.create(Role[k], room);
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
   },
   create(role: CreepRole, room: Room, force?: boolean): ScreepsReturnCode {
      // todo add harvester failsafe when num harvesters == 0
      const spawn = room.find(FIND_MY_SPAWNS);
      if(spawn.length) {
         if(room.energyAvailable > 300) {
            force = true;
         }
         const capacity = force ? room.energyAvailable : room.energyCapacityAvailable;
         if(room.energyAvailable === capacity) {
            const bodyParts: BodyPartConstant[] = [];
            let remaining = capacity;
            // console.log("capacity", capacity);
            let bodyRatioSum = 0;
            Object.keys(role.bodyRatios).forEach((k) => bodyRatioSum += role.bodyRatios[k]);
            Object.keys(role.bodyRatios).forEach((k) => {
               const part: BodyPartConstant = k as BodyPartConstant;
               // console.log("part ", part);
               // console.log("bodypart_cost ", BODYPART_COST[part]);
               const portion = (role.bodyRatios[part] / bodyRatioSum) * capacity;
               // console.log("portion ", portion);
               const chunkCount = Math.floor(portion / BODYPART_COST[part]);
               // console.log("chunkCount ", chunkCount);
               remaining -= (chunkCount * BODYPART_COST[part]);
               _.times(chunkCount, () => bodyParts.push(part));
               // console.log("bodyParts", JSON.stringify(bodyParts));
            });

            // console.log(role.type, ": remaining capacity", remaining, Math.floor(remaining / BODYPART_COST[MOVE]));
            _.times(Math.floor(remaining / BODYPART_COST[MOVE]), () => bodyParts.push(MOVE));

            /*console.log(role.type, ": Using ratios ", JSON.stringify(role.bodyRatios),
               " gives these parts ", bodyParts);*/
            const spawnCode = spawn[0].spawnCreep(bodyParts,
               `${room.name}_${role.type}_${NAME_ID()}`, {
                  memory: {
                     creepState: CreepState.Harvesting,
                     type: role.type
                  },
                  directions: [BOTTOM]
               });

            // console.log(role.type, ": spawnCode", spawnCode);
            return spawnCode;
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