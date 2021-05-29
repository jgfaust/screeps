interface CreepMemory {
   creepState: import("./Roles").CreepState;
   type: string;
}

interface SpawnOptions {
   [K: string]: any;
}