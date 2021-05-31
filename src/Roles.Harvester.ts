import {CreepRole} from "./CreepRole";
import {UpgradeControllerAction} from "./Action.UpgradeController";
import {FillEnergyAction} from "./Action.FillEnergy";
import {BuildAction} from "./Action.Build";
import {RepairAction} from "./Action.Repair";
import {MunicipalRepairAction} from "./Action.MunicipalRepair";

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