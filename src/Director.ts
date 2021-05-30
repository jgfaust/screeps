import {CreepRole} from "./CreepRole";
import {NAME_ID} from "./Utils";
import {CreepState} from "./CreepState";
const _ = require("lodash");

export const Director = {
   create(role: CreepRole, room: Room): ScreepsReturnCode {
      // todo add harvester failsafe when num harvesters == 0
      const spawn = room.find(FIND_MY_SPAWNS);
      if(spawn.length) {
         const capacity = room.energyCapacityAvailable;
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

         /*console.log(role.type, ": remaining capacity", remaining);
         console.log(role.type, ": Using ratios ", JSON.stringify(role.bodyRatios),
            " gives these parts ", bodyParts);*/
         const spawnCode = spawn[0].spawnCreep(bodyParts, role.type + NAME_ID(), {
            memory: {
               creepState: CreepState.Harvesting,
               type: role.type
            }
         });

         // console.log(role.type, ": spawnCode", spawnCode);
         return spawnCode;
      }
      return ERR_NOT_FOUND;
   },
   run(role: CreepRole, creep: Creep) {
      if(creep.memory.type !== role.type) {
         console.log(`Harvester tried running creep of type ${creep.memory.type}`);
         return;
      }
      const {creepState} = creep.memory;

      switch(creepState) {
         case CreepState.Harvesting:
            const source = creep.pos.findClosestByPath(FIND_SOURCES);
            if(!source) {
               console.log("Creep can't find path to source");
               return;
            }
            if(creep.store.getFreeCapacity() === 0) {
               creep.memory.creepState = CreepState.Working;
            } else if(creep.harvest(source) === ERR_NOT_IN_RANGE) {
               creep.moveTo(source);
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