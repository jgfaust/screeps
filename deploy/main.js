'use strict';

const NAME_ID = (() => {
    let initial = Number.parseInt(`${Date.now()}`.substr(4, 4));
    return () => initial++;
})();

const FillEnergyAction = {
    name: "FillEnergy",
    do(creep) {
        const room = creep.room;
        if (room) {
            const structs = room.find(FIND_MY_STRUCTURES, {
                filter: (s) => {
                    if ("store" in s) {
                        return s.store[RESOURCE_ENERGY] < s.store.getFreeCapacity(RESOURCE_ENERGY);
                    }
                    return false;
                }
            });
            // @ts-ignore
            // console.log(structs.length, structs.map((s) => s.store[RESOURCE_ENERGY]));
            if (structs.length) {
                if (creep.transfer(structs[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(structs[0]);
                    return true;
                }
                else {
                    return true;
                }
            }
        }
        else {
            console.log("FillSpawnAction: No room provided, can't find structures");
            return false;
        }
        // console.log("FillSpawnAction: No structures with free energy capacity found");
        return false;
    }
};
const UpgradeControllerAction = {
    name: "UpgradeController",
    do(creep) {
        const controller = creep.room.controller;
        if (controller) {
            if (creep.upgradeController(controller) === ERR_NOT_IN_RANGE) {
                creep.moveTo(controller);
                return true;
            }
            else {
                return true;
            }
        }
        console.log("UpgradeControllerAction: No controller found");
        return false;
    }
};
const BuildAction = {
    name: "Build",
    do(creep) {
        const sites = creep.room.find(FIND_CONSTRUCTION_SITES);
        if (sites.length) {
            sites.sort((a, b) => a.progress - b.progress);
            const site = sites[sites.length - 1];
            if (creep.build(site) == ERR_NOT_IN_RANGE) {
                creep.moveTo(site);
                return true;
            }
            else {
                return true;
            }
        }
        // console.log("BuildAction: No sites found");
        return false;
    }
};
const RepairAction = {
    name: "Repair",
    do(creep) {
        const closestDamagedStructure = creep.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (structure) => structure.hits < structure.hitsMax
        });
        if (closestDamagedStructure) {
            if (creep.repair(closestDamagedStructure) == ERR_NOT_IN_RANGE) {
                creep.moveTo(closestDamagedStructure);
                return true;
            }
            else {
                return true;
            }
        }
        // console.log("BuildAction: No sites found");
        return false;
    }
};
function workerCreepRun(role, creep) {
    if (creep.memory.type !== role.type) {
        console.log(`Harvester tried running creep of type ${creep.memory.type}`);
        return;
    }
    const { creepState } = creep.memory;
    const source = creep.pos.findClosestByPath(FIND_SOURCES);
    if (!source) {
        console.log("Creep can't find path to source");
        return;
    }
    switch (creepState) {
        case CreepState.Harvesting:
            if (creep.store.getFreeCapacity() === 0) {
                creep.memory.creepState = CreepState.Working;
            }
            else if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
            }
            break;
        case CreepState.Working:
            if (creep.store.energy === 0) {
                creep.say("Harvesting");
                creep.memory.creepState = CreepState.Harvesting;
            }
            else {
                for (let i = 0; i < role.actions.length; i++) {
                    if (role.actions[i].do(creep)) {
                        creep.say(role.actions[i].name);
                        break;
                    }
                }
            }
            break;
        default:
            creep.memory.creepState = CreepState.Harvesting;
            break;
    }
}

const Harvester = {
    type: "Harvester",
    create() {
        return Game.spawns.Spawn1.spawnCreep([WORK, WORK, MOVE, CARRY], this.type + NAME_ID(), {
            memory: {
                creepState: CreepState.Harvesting,
                type: this.type
            }
        });
    },
    actions: [
        FillEnergyAction,
        UpgradeControllerAction,
    ],
    run: function (creep) {
        workerCreepRun(this, creep);
    }
};

const Upgrader = {
    type: "Upgrader",
    create() {
        // todo - adjust based on distance to controller
        return Game.spawns.Spawn1.spawnCreep([WORK, WORK, MOVE, CARRY], this.type + NAME_ID(), {
            memory: {
                creepState: CreepState.Harvesting,
                type: this.type
            }
        });
    },
    actions: [
        UpgradeControllerAction
    ],
    run: function (creep) {
        workerCreepRun(this, creep);
    }
};

const Builder = {
    type: "Builder",
    create() {
        return Game.spawns.Spawn1.spawnCreep([WORK, WORK, MOVE, CARRY], this.type + NAME_ID(), {
            memory: {
                creepState: CreepState.Harvesting,
                type: this.type
            }
        });
    },
    actions: [
        RepairAction,
        BuildAction,
        FillEnergyAction,
        UpgradeControllerAction
    ],
    run: function (creep) {
        workerCreepRun(this, creep);
    }
};

var CreepState;
(function (CreepState) {
    CreepState[CreepState["Harvesting"] = 0] = "Harvesting";
    CreepState[CreepState["Working"] = 1] = "Working";
})(CreepState || (CreepState = {}));
const Roles = {
    Harvester,
    Upgrader,
    Builder
};

const _ = require('lodash');
const MAX_CREEPS = {
    [Builder.type]: 5,
    [Upgrader.type]: 5,
    [Harvester.type]: 5,
};
module.exports.loop = function () {
    const creeps = Game.creeps;
    /*
    console.log('echo');
    Object.keys(Memory.creeps).forEach((k) => {
       console.log(k, Game.creeps[k]?.ticksToLive);
       if(!Game.creeps[k]?.ticksToLive) {
          delete Memory.creeps[k];
       }
    });*/
    Object.keys(MAX_CREEPS).forEach((k) => {
        const kcreeps = _.filter(creeps, (c) => c.memory.type == k);
        if (kcreeps.length < MAX_CREEPS[k]) {
            Roles[k].create();
        }
    });
    const roles = Object.values(Roles);
    Object.keys(creeps).forEach((c) => {
        var _a;
        const creep = creeps[c];
        (_a = roles.find((r) => r.type === creep.memory.type)) === null || _a === void 0 ? void 0 : _a.run(creep);
    });
};
//# sourceMappingURL=main.js.map
