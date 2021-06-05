import {CreepRole} from "../CreepRole";
import {ReserveRoomAction} from "../action/Action.ReserveRoom";

export const Explorer: CreepRole = {
   type: "Explorer",
   bodyParts: {
      [CLAIM]: 1,
      [MOVE]: '*',
   },
   maxCost: 1000,
   actions: [
      ReserveRoomAction
   ],
};