import {CreepRole} from "../CreepRole";
import {UpgradeControllerAction} from "../action/Action.UpgradeController";
import {FillEnergyAction} from "../action/Action.FillEnergy";
import {BuildAction} from "../action/Action.Build";
import {RepairAction} from "../action/Action.Repair";
import {MunicipalRepairAction} from "../action/Action.MunicipalRepair";

export const Harvester: CreepRole = {
   type: "Harvester",
   bodyRatios: {
      [WORK]: 40,
      [CARRY]: 40,
      [MOVE]: 20
   },
   actions: [
      FillEnergyAction,
      BuildAction,
      RepairAction,
      MunicipalRepairAction,
      UpgradeControllerAction,
   ],
};