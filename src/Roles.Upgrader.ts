import {NAME_ID} from "./Utils";
import {CreepRole} from "./CreepRole";
import {CreepState} from "./Roles";
import {UpgradeControllerAction, workerCreepRun} from "./WorkerActions";

export const Upgrader: CreepRole = {
   type: "Upgrader",
   create(): ScreepsReturnCode {
      // todo - adjust based on distance to controller
      return Game.spawns.Spawn1.spawnCreep([WORK, WORK, MOVE, CARRY],
         this.type + NAME_ID(), {
            memory: {
               creepState: CreepState.Harvesting,
               type: this.type
            }
         });
   },
   actions: [
      UpgradeControllerAction
   ],
   run: function(creep) {
      workerCreepRun(this, creep);
   }
};