'use strict';

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

const FillEnergyAction = {
    name: "FillEnergy",
    do(creep) {
        // todo - prioritize defensive energy such as towers
        const room = creep.room;
        if (room) {
            let spawns = creep.room.find(FIND_MY_SPAWNS, {
                filter: (s) => {
                    if ("store" in s) {
                        return s.store[RESOURCE_ENERGY] < s.store.getCapacity(RESOURCE_ENERGY);
                    }
                    return false;
                }
            });
            if (spawns.length) {
                if (creep.transfer(spawns[0], RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(spawns[0]);
                    return true;
                }
                else {
                    return true;
                }
            }
            const struct = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: (s) => {
                    if ("store" in s) {
                        return s.store[RESOURCE_ENERGY] < s.store.getCapacity(RESOURCE_ENERGY);
                    }
                    return false;
                }
            });
            // @ts-ignore
            // console.log(structs.length, structs.map((s) => s.store[RESOURCE_ENERGY]));
            if (struct) {
                if (creep.transfer(struct, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(struct);
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

const BuildAction = {
    name: "Build",
    do(creep) {
        const site = creep.pos.findClosestByRange(FIND_CONSTRUCTION_SITES);
        if (site) {
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

function closestByMostDamaged(creep) {
    let t = .0001;
    while (t <= 1) {
        const s = closestByDamage(creep, t);
        if (s) {
            return s;
        }
        t += .005;
    }
    return null;
}
function closestByDamage(creep, threshhold) {
    return creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => structure.hits / structure.hitsMax < threshhold
    });
}
const RepairAction = {
    name: "Repair",
    do(creep) {
        // todo prioritize defensive structures
        const closestDamagedStructure = closestByMostDamaged(creep);
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

const Harvester = {
    type: "Harvester",
    bodyRatios: {
        [WORK]: 40,
        [CARRY]: 40,
        [MOVE]: 20
    },
    actions: [
        FillEnergyAction,
        BuildAction,
        RepairAction,
        UpgradeControllerAction,
    ],
};

const Upgrader = {
    type: "Upgrader",
    bodyRatios: {
        [WORK]: 35,
        [CARRY]: 35,
        [MOVE]: 30,
    },
    actions: [
        UpgradeControllerAction
    ],
};

const Builder = {
    type: "Builder",
    bodyRatios: {
        [WORK]: 50,
        [CARRY]: 30,
        [MOVE]: 20
    },
    actions: [
        BuildAction,
        RepairAction,
        FillEnergyAction,
        UpgradeControllerAction
    ],
};

const Roles = {
    Harvester,
    Upgrader,
    Builder
};

const Tower = {
    run(tower) {
        const nearbyDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (s) => s.hits < s.hitsMax
        });
        if (nearbyDamagedStructure) ;
        else {
            const nearbyDamagedCreep = tower.pos.findClosestByRange(FIND_MY_CREEPS, {
                filter: (s) => s.hits < s.hitsMax
            });
            if (nearbyDamagedCreep) {
                tower.heal(nearbyDamagedCreep);
            }
        }
    }
};

const NAME_ID = (() => {
    let initial = Number.parseInt(`${Date.now()}`.substr(4, 4));
    return () => initial++;
})();

var CreepState;
(function (CreepState) {
    CreepState[CreepState["Harvesting"] = 0] = "Harvesting";
    CreepState[CreepState["Working"] = 1] = "Working";
})(CreepState || (CreepState = {}));

const _$1 = require("lodash");
const Director = {
    create(role, room) {
        // todo add harvester failsafe when num harvesters == 0
        const spawn = room.find(FIND_MY_SPAWNS);
        if (spawn.length) {
            const capacity = room.energyCapacityAvailable;
            const bodyParts = [];
            let remaining = capacity;
            // console.log("capacity", capacity);
            let bodyRatioSum = 0;
            Object.keys(role.bodyRatios).forEach((k) => bodyRatioSum += role.bodyRatios[k]);
            Object.keys(role.bodyRatios).forEach((k) => {
                const part = k;
                // console.log("part ", part);
                // console.log("bodypart_cost ", BODYPART_COST[part]);
                const portion = (role.bodyRatios[part] / bodyRatioSum) * capacity;
                // console.log("portion ", portion);
                const chunkCount = Math.floor(portion / BODYPART_COST[part]);
                // console.log("chunkCount ", chunkCount);
                remaining -= (chunkCount * BODYPART_COST[part]);
                _$1.times(chunkCount, () => bodyParts.push(part));
                // console.log("bodyParts", JSON.stringify(bodyParts));
            });
            /*console.log(role.type, ": remaining capacity", remaining);
            console.log(role.type, ": Using ratios ", JSON.stringify(role.bodyRatios),
               " gives these parts ", bodyParts);*/
            const spawnCode = spawn[0].spawnCreep(bodyParts, role.type + NAME_ID(), {
                memory: {
                    creepState: CreepState.Harvesting,
                    type: role.type
                }
            });
            // console.log(role.type, ": spawnCode", spawnCode);
            return spawnCode;
        }
        return ERR_NOT_FOUND;
    },
    run(role, creep) {
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
};

const _ = require('lodash');
const MAX_CREEPS = {
    [Builder.type]: 5,
    [Upgrader.type]: 3,
    [Harvester.type]: 3,
};
module.exports.loop = function () {
    const creeps = Game.creeps;
    Object.keys(Memory.creeps).forEach((k) => {
        if (!Game.creeps[k]) {
            delete Memory.creeps[k];
        }
    });
    const roles = Object.values(Roles);
    Object.keys(creeps).forEach((c) => {
        const creep = creeps[c];
        const role = roles.find((r) => r.type === creep.memory.type);
        if (role && creep) {
            Director.run(role, creep);
        }
        else {
            console.log("Couldn't find a role for creep", creep, role);
        }
    });
    Object.keys(Game.rooms).forEach((k) => {
        const room = Game.rooms[k];
        Object.keys(MAX_CREEPS).forEach((k) => {
            const kcreeps = _.filter(creeps, (c) => c.memory.type == k);
            if (kcreeps.length < MAX_CREEPS[k]) {
                Director.create(Roles[k], room);
            }
        });
        const towers = room.find(FIND_MY_STRUCTURES, {
            filter: { structureType: STRUCTURE_TOWER }
        });
        if (towers.length) {
            towers.forEach((tower) => {
                const hostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                if (hostile) {
                    if (tower.attack(hostile) === ERR_NOT_IN_RANGE) {
                        Tower.run(tower);
                    }
                }
                else {
                    towers.forEach(Tower.run);
                }
            });
        }
    });
};
//# sourceMappingURL=main.js.map
