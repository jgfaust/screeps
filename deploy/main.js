'use strict';

const NAME_ID = (() => {
    let initial = Number.parseInt(`${Date.now()}`.substr(4, 4));
    return () => initial++;
})();

var CreepState;
(function (CreepState) {
    CreepState[CreepState["Harvesting"] = 0] = "Harvesting";
    CreepState[CreepState["Working"] = 1] = "Working";
})(CreepState || (CreepState = {}));

const ScavengeAction = {
    name: "Scavenge",
    do(creep) {
        const source = creep.pos.findClosestByPath(FIND_DROPPED_RESOURCES, {
            filter: (r) => r.resourceType === RESOURCE_ENERGY &&
                r.amount > 0
        });
        if (source) {
            if (creep.pickup(source) === ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
                return true;
            }
            else {
                return true;
            }
        }
        else {
            const tomb = creep.pos.findClosestByPath(FIND_TOMBSTONES, {
                filter: (r) => r.store.getUsedCapacity(RESOURCE_ENERGY) > 0
            });
            if (tomb) {
                if (creep.withdraw(tomb, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(tomb);
                    return true;
                }
                else {
                    return true;
                }
            }
            else {
                const ruin = creep.pos.findClosestByPath(FIND_RUINS, {
                    filter: (r) => r.store.getUsedCapacity(RESOURCE_ENERGY) > 0
                });
                if (ruin) {
                    if (creep.withdraw(ruin, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(ruin);
                        return true;
                    }
                    else {
                        return true;
                    }
                }
            }
        }
        return false;
    }
};

const HarvestAction = {
    name: "Harvest",
    do(creep) {
        let source = creep.pos.findClosestByPath(FIND_SOURCES_ACTIVE);
        /*      if(!source) {
                 let storage = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                    filter: (s) =>
                       s.structureType === STRUCTURE_STORAGE &&
                       s.store.getUsedCapacity(RESOURCE_ENERGY) > 0
                 });
                 if(storage) {
                    if(creep.withdraw(storage, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                       creep.moveTo(storage);
                       return true;
                    } else {
                       return true;
                    }
                 }
              }*/
        if (!source) {
            console.log(creep.name, ": can't find path to active source");
            return false;
        }
        else {
            if (creep.harvest(source) === ERR_NOT_IN_RANGE) {
                creep.moveTo(source);
                return true;
            }
            else {
                return true;
            }
        }
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

const FillEnergyAction = {
    name: "FillEnergy",
    do(creep) {
        // todo - prioritize defensive energy such as towers
        const room = creep.room;
        if (room) {
            const defense = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: (s) => {
                    if ("store" in s) {
                        return s.structureType === STRUCTURE_TOWER &&
                            s.store[RESOURCE_ENERGY] < s.store.getCapacity(RESOURCE_ENERGY);
                    }
                    return false;
                }
            });
            if (defense) {
                if (creep.transfer(defense, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(defense);
                    return true;
                }
                else {
                    return true;
                }
            }
            const struct = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: (s) => {
                    if ("store" in s) {
                        return s.structureType != STRUCTURE_STORAGE &&
                            s.store[RESOURCE_ENERGY] < s.store.getCapacity(RESOURCE_ENERGY);
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
            const spawn = creep.pos.findClosestByPath(FIND_MY_SPAWNS, {
                filter: (s) => {
                    if ("store" in s) {
                        return s.store[RESOURCE_ENERGY] < s.store.getCapacity(RESOURCE_ENERGY);
                    }
                    return false;
                }
            });
            if (spawn) {
                if (creep.transfer(spawn, RESOURCE_ENERGY) === ERR_NOT_IN_RANGE) {
                    creep.moveTo(spawn);
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
        const s = closestByDamage$1(creep, t);
        if (s) {
            return s;
        }
        t += .005;
    }
    return null;
}
function closestByDamage$1(creep, threshhold) {
    return creep.pos.findClosestByRange(FIND_STRUCTURES, {
        filter: (structure) => {
            switch (structure.structureType) {
                case STRUCTURE_RAMPART:
                    return structure.hits < structure.hitsMax;
                case STRUCTURE_WALL:
                    return (structure.hits / structure.hitsMax) < threshhold;
                default:
                    return (structure.hits / structure.hitsMax) < .9;
            }
        }
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

function closestByDamage(creep) {
    let structs = creep.pos.findClosestByPath(FIND_STRUCTURES, {
        filter: (structure) => {
            switch (structure.structureType) {
                case STRUCTURE_WALL:
                case STRUCTURE_RAMPART:
                    return false;
                default:
                    return structure.hits / structure.hitsMax < .75;
            }
        }
    });
    if (structs) {
        return structs;
    }
    else {
        return creep.pos.findClosestByPath(FIND_STRUCTURES, {
            filter: (structure) => {
                switch (structure.structureType) {
                    case STRUCTURE_WALL:
                    case STRUCTURE_RAMPART:
                        return false;
                    default:
                        return structure.hits < structure.hitsMax;
                }
            }
        });
    }
}
const MunicipalRepairAction = {
    name: "MunicipalRepair",
    do(creep) {
        const closestDamagedStructure = closestByDamage(creep);
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
        MunicipalRepairAction,
        UpgradeControllerAction,
    ],
};

const Upgrader = {
    type: "Upgrader",
    bodyRatios: {
        [WORK]: 45,
        [CARRY]: 35,
        [MOVE]: 20,
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
        MunicipalRepairAction,
        FillEnergyAction,
        UpgradeControllerAction
    ],
};

const Repair = {
    type: "Repair",
    bodyRatios: {
        [WORK]: 40,
        [CARRY]: 20,
        [MOVE]: 40
    },
    actions: [
        MunicipalRepairAction,
        RepairAction,
        BuildAction,
        FillEnergyAction,
        UpgradeControllerAction
    ],
};

const Role = {
    Harvester,
    Upgrader,
    Builder,
    Repair,
};

const Tower = {
    run(tower) {
        tower.pos.findClosestByRange(FIND_STRUCTURES, {
            filter: (s) => s.hits < s.hitsMax
        });
        {
            const nearbyDamagedCreep = tower.pos.findClosestByRange(FIND_MY_CREEPS, {
                filter: (s) => s.hits < s.hitsMax
            });
            if (nearbyDamagedCreep) {
                tower.heal(nearbyDamagedCreep);
            }
        }
    }
};

const _ = require("lodash");
const HARVEST = [
    ScavengeAction,
    HarvestAction
];
const MAX_CREEPS = {
    [Harvester.type]: 2,
    [Repair.type]: 1,
    [Builder.type]: 3,
    [Upgrader.type]: 4,
};
const ColonyDirector = {
    run(room) {
        const roles = Object.values(Role);
        const creeps = Object.keys(Game.creeps)
            .filter((name) => name.startsWith(room.name))
            .map((creepName) => Game.creeps[creepName]);
        creeps.forEach((creep) => {
            const role = roles.find((r) => r.type === creep.memory.type);
            if (role && creep) {
                this.creepAction(role, creep);
            }
            else {
                console.log("Couldn't find a role for creep", creep, role);
            }
        });
        const maxCreepKeys = Object.keys(MAX_CREEPS);
        const harvesters = _.filter(creeps, (c) => c.memory.type == Harvester.type);
        if (!harvesters.length) {
            this.create(Harvester, room, true);
        }
        else {
            for (let i in maxCreepKeys) {
                let k = maxCreepKeys[i];
                const kcreeps = _.filter(creeps, (c) => c.memory.type == k);
                if (kcreeps.length < MAX_CREEPS[k]) {
                    this.create(Role[k], room);
                    break;
                }
            }
        }
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
    },
    create(role, room, force) {
        // todo add harvester failsafe when num harvesters == 0
        const spawn = room.find(FIND_MY_SPAWNS);
        if (spawn.length) {
            if (room.energyAvailable > 300) {
                force = true;
            }
            const capacity = force ? room.energyAvailable : room.energyCapacityAvailable;
            if (room.energyAvailable === capacity) {
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
                    _.times(chunkCount, () => bodyParts.push(part));
                    // console.log("bodyParts", JSON.stringify(bodyParts));
                });
                // console.log(role.type, ": remaining capacity", remaining, Math.floor(remaining / BODYPART_COST[MOVE]));
                _.times(Math.floor(remaining / BODYPART_COST[MOVE]), () => bodyParts.push(MOVE));
                /*console.log(role.type, ": Using ratios ", JSON.stringify(role.bodyRatios),
                   " gives these parts ", bodyParts);*/
                const spawnCode = spawn[0].spawnCreep(bodyParts, `${room.name}_${role.type}_${NAME_ID()}`, {
                    memory: {
                        creepState: CreepState.Harvesting,
                        type: role.type
                    },
                    directions: [BOTTOM]
                });
                // console.log(role.type, ": spawnCode", spawnCode);
                return spawnCode;
            }
            else {
                return ERR_NOT_ENOUGH_ENERGY;
            }
        }
        return ERR_NOT_FOUND;
    },
    creepAction(role, creep) {
        if (creep.memory.type !== role.type) {
            console.log(`Harvester tried running creep of type ${creep.memory.type}`);
            return;
        }
        const { creepState } = creep.memory;
        switch (creepState) {
            case CreepState.Harvesting:
                if (creep.store.getFreeCapacity() === 0) {
                    creep.memory.creepState = CreepState.Working;
                }
                else {
                    let resourceAvailable = false;
                    for (let i = 0; i < HARVEST.length; i++) {
                        if (HARVEST[i].do(creep)) {
                            resourceAvailable = true;
                            break;
                        }
                    }
                    if (!resourceAvailable && creep.store.getUsedCapacity(RESOURCE_ENERGY) > 0) {
                        creep.memory.creepState = CreepState.Working;
                    }
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

require('lodash');
function getFacts() {
    const facts = {
        nucleus: "W8N3",
        visibleRooms: Object.keys(Game.rooms)
    };
    return facts;
}
const textStyle = {
    align: "left",
    color: "#ffffff",
    backgroundColor: "#000000",
    opacity: 0.6,
};
function drawRoomInfo(facts, room) {
    const vis = new RoomVisual(room);
    const origin = {
        x: 4,
        y: 3
    };
    vis.text(`ROOM ${room}`, origin.x, origin.y, textStyle);
    vis.line(origin.x, origin.y + 1, origin.x + 10, origin.y + 1);
    if (facts.nucleus === room) {
        vis.text('NUCLEUS COLONY', origin.x, origin.y + 2, textStyle);
    }
}
function init() {
    if (!Memory._Mastermind) {
        const facts = getFacts();
        drawRoomInfo(facts, facts.nucleus);
    }
}
const Mastermind = {
    run() {
        init();
        Game.creeps;
        Object.keys(Game.rooms).forEach((k) => {
            const room = Game.rooms[k];
            ColonyDirector.run(room);
        });
        garbageCollection();
    }
};
function garbageCollection() {
    Object.keys(Memory.creeps).forEach((k) => {
        if (!Game.creeps[k]) {
            delete Memory.creeps[k];
        }
    });
}

module.exports.loop = function () {
    Mastermind.run();
};
//# sourceMappingURL=main.js.map
