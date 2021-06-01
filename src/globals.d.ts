interface CreepMemory {
   creepState: import("./CreepState").CreepState;
   type: string;
}

interface SpawnOptions {
   [K: string]: any;
}

interface Memory {
   _Mastermind: any;
}

declare namespace NodeJS {
   interface Global {
      facts: import("./Mastermind").Facts
   }
}