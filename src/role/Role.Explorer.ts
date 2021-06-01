import {CreepRole} from "../CreepRole";
import {ReserveRoomAction} from "../action/Action.ReserveRoom";

export const Explorer: CreepRole = {
   type: "Upgrader",
   bodyRatios: {
      [CLAIM]: 60,
      [MOVE]: 40,
   },
   actions: [
      ReserveRoomAction
   ],
};