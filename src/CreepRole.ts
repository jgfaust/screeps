import {Action} from "./action/Action";



export type CreepRole = FixedBodyDescriptor | RatioBodyDescriptor;

export interface RatioBodyDescriptor {
   type: string;
   bodyRatios: Partial<BodyRatio>;
   maxCost?: number;
   actions: Action[];
}

export interface FixedBodyDescriptor {
   type: string;
   bodyParts: Partial<BodyDescriptor>;
   maxCost?: number;
   actions: Action[];
}

type BodyRatio = Record<BodyPartConstant, number>;
type BodyDescriptor = Record<BodyPartConstant, number | '*'>;
