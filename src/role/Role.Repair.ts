import {CreepRole} from "../CreepRole";
import {RepairAction} from "../action/Action.Repair";
import {BuildAction} from "../action/Action.Build";
import {UpgradeControllerAction} from "../action/Action.UpgradeController";
import {FillEnergyAction} from "../action/Action.FillEnergy";
import {MunicipalRepairAction} from "../action/Action.MunicipalRepair";
import {StoreResourcesAction} from "../action/Action.StoreResources";

export const Repair: CreepRole = {
   type: "Repair",
   bodyRatios: {
      [WORK]: 40,
      [CARRY]: 20,
      [MOVE]: 40
   },
   maxCost: 800,
   actions: [
      StoreResourcesAction,
      MunicipalRepairAction,
      RepairAction,
      BuildAction,
      FillEnergyAction,
      UpgradeControllerAction
   ],
};