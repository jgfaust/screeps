import {NAME_ID} from "./Utils";
import {Action, FillEnergyAction, UpgradeControllerAction, workerCreepRun} from "./WorkerActions";
import {CreepRole} from "./CreepRole";
import {CreepState} from "./Roles";

export const Harvester: CreepRole & {actions: Action[]} = {
   type: "Harvester",

   create(): ScreepsReturnCode {
      return Game.spawns.Spawn1.spawnCreep([WORK, WORK, MOVE, CARRY],
         this.type + NAME_ID(), {
            memory: {
               creepState: CreepState.Harvesting,
               type: this.type
            }
         });
   },

   actions: [
      FillEnergyAction,
      UpgradeControllerAction,
   ],

   run: function(creep) {
      workerCreepRun(this, creep);
   }
};