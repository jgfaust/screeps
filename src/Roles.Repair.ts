import {CreepRole} from "./CreepRole";
import {RepairAction} from "./Action.Repair";
import {BuildAction} from "./Action.Build";
import {UpgradeControllerAction} from "./Action.UpgradeController";
import {FillEnergyAction} from "./Action.FillEnergy";
import {MunicipalRepairAction} from "./Action.MunicipalRepair";

export const Repair: CreepRole = {
   type: "Repair",
   bodyRatios: {
      [WORK]: 50,
      [CARRY]: 30,
      [MOVE]: 20
   },
   actions: [
      MunicipalRepairAction,
      RepairAction,
      BuildAction,
      FillEnergyAction,
      UpgradeControllerAction
   ],
};