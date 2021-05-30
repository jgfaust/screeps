export interface Action {
   name: string;
   do: (creep: Creep) => boolean;
}