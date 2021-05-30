import {Action} from "./Action";

type bp = keyof BodyPartConstant;

export interface CreepRole {
   type: string;
   bodyRatios: {[K: string]: number};
   actions: Action[];
}