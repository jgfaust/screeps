interface CreepMemory {
   creepState: import("./CreepState").CreepState;
   type: string;
}

interface SpawnOptions {
   [K: string]: any;
}