import {Action} from "./WorkerActions";

export interface CreepRole {
   type: string;
   create(): ScreepsReturnCode;
   run(creep: Creep): void;
   actions: Action[];
}