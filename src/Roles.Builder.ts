import {NAME_ID} from "./Utils";
import {CreepRole} from "./CreepRole";
import {CreepState} from "./Roles";
import {BuildAction, FillEnergyAction, RepairAction, UpgradeControllerAction, workerCreepRun} from "./WorkerActions";

export const Builder: CreepRole = {
   type: "Builder",
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
      RepairAction,
      BuildAction,
      FillEnergyAction,
      UpgradeControllerAction
   ],
   run: function(creep) {
      workerCreepRun(this, creep);
   }
};