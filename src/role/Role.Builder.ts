import {CreepRole} from "../CreepRole";
import {RepairAction} from "../action/Action.Repair";
import {BuildAction} from "../action/Action.Build";
import {UpgradeControllerAction} from "../action/Action.UpgradeController";
import {FillEnergyAction} from "../action/Action.FillEnergy";
import {MunicipalRepairAction} from "../action/Action.MunicipalRepair";
import {StoreResourcesAction} from "../action/Action.StoreResources";

export const Builder: CreepRole = {
   type: "Builder",
   bodyRatios: {
      [WORK]: 50,
      [CARRY]: 30,
      [MOVE]: 20
   },
   actions: [
      StoreResourcesAction,
      BuildAction,
      RepairAction,
      MunicipalRepairAction,
      FillEnergyAction,
      UpgradeControllerAction
   ],
};