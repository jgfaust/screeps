import {CreepRole} from "./CreepRole";
import {RepairAction} from "./Action.Repair";
import {BuildAction} from "./Action.Build";
import {UpgradeControllerAction} from "./Action.UpgradeController";
import {FillEnergyAction} from "./Action.FillEnergy";
import {MunicipalRepairAction} from "./Action.MunicipalRepair";

export const Builder: CreepRole = {
   type: "Builder",
   bodyRatios: {
      [WORK]: 50,
      [CARRY]: 30,
      [MOVE]: 20
   },
   actions: [
      BuildAction,
      RepairAction,
      MunicipalRepairAction,
      FillEnergyAction,
      UpgradeControllerAction
   ],
};