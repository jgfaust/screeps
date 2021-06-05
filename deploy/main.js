'use strict';

const NAME_ID = (() => {
    let initial = Number.parseInt(`${Date.now()}`.substr(4, 4));
    return () => initial++;
})();
const getRoomCoordinates = ((roomName) => {
    const xy = roomName.split(/[^\d]/).filter((s) => !!s);
    const ab = roomName.split(/[\d]/).filter((s) => !!s);
    return {
        a: ab[0],
        column: Number.parseInt(xy[0]),
        b: ab[1],
        row: Number.parseInt(xy[1])
    };
});
const getRoomFromCoordinates = (a, column, b, row) => `${a}${column}${b}${row}`;
const roomTop = (currentRoom, coordinates) => {
    if (!coordinates) {
        coordinates = getRoomCoordinates(currentRoom);
    }
    return getRoomFromCoordinates(coordinates.a, coordinates.column, coordinates.b, coordinates.row + 1);
};
const roomLeft = (currentRoom, coordinates) => {
    if (!coordinates) {
        coordinates = getRoomCoordinates(currentRoom);
    }
    return getRoomFromCoordinates(coordinates.a, coordinates.column + 1, coordinates.b, coordinates.row);
};
const roomRight = (currentRoom, coordinates) => {
    if (!coordinates) {
        coordinates = getRoomCoordinates(currentRoom);
    }
    return getRoomFromCoordinates(coordinates.a, coordinates.column - 1, coordinates.b, coordinates.row);
};
const roomBottom = (currentRoom, coordinates) => {
    if (!coordinates) {
        coordinates = getRoomCoordinates(currentRoom);
    }
    return getRoomFromCoordinates(coordinates.a, coordinates.column, coordinates.b, coordinates.row - 1);
};
const findAccessibleAdjacentRooms = ((roomName) => {
    const currentRoom = Game.rooms[roomName];
    const accessibleRooms = [];
    if (currentRoom) {
        const coordinates = getRoomCoordinates(roomName);
        const top = roomTop(roomName, coordinates);
        const bottom = roomBottom(roomName, coordinates);
        const left = roomLeft(roomName, coordinates);
        const right = roomRight(roomName, coordinates);
        if (currentRoom.findExitTo(top) === FIND_EXIT_TOP) {
            accessibleRooms.push(top);
        }
        if (currentRoom.findExitTo(bottom) === FIND_EXIT_BOTTOM) {
            accessibleRooms.push(bottom);
        }
        if (currentRoom.findExitTo(left) === FIND_EXIT_LEFT) {
            accessibleRooms.push(left);
        }
        if (currentRoom.findExitTo(right) === FIND_EXIT_RIGHT) {
            accessibleRooms.push(right);
        }
    }
    return accessibleRooms;
});
const countSourceSlots = ((room) => {
    const sources = room.find(FIND_SOURCES);
    let slots = 0;
    sources.forEach((source) => {
        const leftx = clamp(source.pos.x - 1);
        const lefty = clamp(source.pos.y - 1);
        const rightx = clamp(source.pos.x + 1);
        const righty = clamp(source.pos.y + 1);
        const terrain = room.getTerrain();
        for (let y = lefty; y <= righty; y++) {
            for (let x = leftx; x <= rightx; x++) {
                if (terrain.get(x, y) === 0) {
                    slots++;
                }
            }
        }
    });
    return slots;
});
const clamp = (x) => x < 0 ? 0 :
    (x > 49 ? 49 : x);
const PICKUP_RESOURCE = [
    RESOURCE_HYDROXIDE,
    RESOURCE_ZYNTHIUM_KEANITE,
    RESOURCE_UTRIUM_LEMERGITE,
    RESOURCE_UTRIUM_HYDRIDE,
    RESOURCE_UTRIUM_OXIDE,
    RESOURCE_KEANIUM_HYDRIDE,
    RESOURCE_KEANIUM_OXIDE,
    RESOURCE_LEMERGIUM_HYDRIDE,
    RESOURCE_LEMERGIUM_OXIDE,
    RESOURCE_ZYNTHIUM_HYDRIDE,
    RESOURCE_ZYNTHIUM_OXIDE,
    RESOURCE_GHODIUM_HYDRIDE,
    RESOURCE_GHODIUM_OXIDE,
    RESOURCE_UTRIUM_ACID,
    RESOURCE_UTRIUM_ALKALIDE,
    RESOURCE_KEANIUM_ACID,
    RESOURCE_KEANIUM_ALKALIDE,
    RESOURCE_LEMERGIUM_ACID,
    RESOURCE_LEMERGIUM_ALKALIDE,
    RESOURCE_ZYNTHIUM_ACID,
    RESOURCE_ZYNTHIUM_ALKALIDE,
    RESOURCE_GHODIUM_ACID,
    RESOURCE_GHODIUM_ALKALIDE,
    RESOURCE_CATALYZED_UTRIUM_ACID,
    RESOURCE_CATALYZED_UTRIUM_ALKALIDE,
    RESOURCE_CATALYZED_KEANIUM_ACID,
    RESOURCE_CATALYZED_KEANIUM_ALKALIDE,
    RESOURCE_CATALYZED_LEMERGIUM_ACID,
    RESOURCE_CATALYZED_LEMERGIUM_ALKALIDE,
    RESOURCE_CATALYZED_ZYNTHIUM_ACID,
    RESOURCE_CATALYZED_ZYNTHIUM_ALKALIDE,
    RESOURCE_CATALYZED_GHODIUM_ACID,
    RESOURCE_CATALYZED_GHODIUM_ALKALIDE,
];

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
                filter: (r) => r.store.getUsedCapacity() > 0
            });
            if (tomb) {
                if (creep.withdraw(tomb, RESOURCE_ENERGY) == ERR_NOT_IN_RANGE) {
                    creep.moveTo(tomb);
                    return true;
                }
                for (const i in PICKUP_RESOURCE) {
                    if (creep.withdraw(tomb, PICKUP_RESOURCE[i]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(tomb);
                        return true;
                    }
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

const StoreResourcesAction = {
    name: "StoreResoures",
    do(creep) {
        // console.log("storing?", creep.store.getUsedCapacity(), creep.store.getUsedCapacity(RESOURCE_ENERGY));
        if (creep.store.getUsedCapacity() > 0 &&
            creep.store.getUsedCapacity(RESOURCE_ENERGY) < creep.store.getUsedCapacity()) {
            console.log("attempt store");
            const struct = creep.pos.findClosestByPath(FIND_MY_STRUCTURES, {
                filter: (s) => {
                    if ("store" in s) {
                        return s.structureType === STRUCTURE_STORAGE;
                    }
                    return false;
                }
            });
            console.log("struct", struct);
            if (struct) {
                for (const i in PICKUP_RESOURCE) {
                    if (creep.transfer(struct, PICKUP_RESOURCE[i]) == ERR_NOT_IN_RANGE) {
                        creep.moveTo(struct);
                        return true;
                    }
                }
            }
        }
        // console.log("storing: false");
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
        StoreResourcesAction,
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
        StoreResourcesAction,
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
        StoreResourcesAction,
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
    maxCost: 800,
    actions: [
        StoreResourcesAction,
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
    run(room) {
        const towers = room.find(FIND_MY_STRUCTURES, {
            filter: { structureType: STRUCTURE_TOWER }
        });
        if (towers.length) {
            towers.forEach((tower) => {
                const hostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
                if (hostile) {
                    if (tower.attack(hostile) === ERR_NOT_IN_RANGE) {
                        this.towerAction(tower);
                    }
                }
                else {
                    towers.forEach(Tower.towerAction);
                }
            });
        }
    },
    towerAction(tower) {
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
                // console.log(k, kcreeps);
                if (kcreeps.length < MAX_CREEPS[k]) {
                    this.create(Role[k], room);
                    break;
                }
            }
        }
        Tower.run(room);
    },
    create(role, room, force) {
        const spawn = room.find(FIND_MY_SPAWNS);
        if (spawn.length) {
            if (room.energyAvailable > 800) {
                force = true;
            }
            const capacity = role.maxCost || (force ? room.energyAvailable : room.energyCapacityAvailable);
            // console.log("create", role.type, capacity, room.energyAvailable);
            if (room.energyAvailable >= capacity) {
                const bodyParts = [];
                if ("bodyRatios" in role) {
                    let remaining = capacity;
                    let bodyRatioSum = 0;
                    Object.keys(role.bodyRatios).forEach((k) => bodyRatioSum += role.bodyRatios[k]);
                    Object.keys(role.bodyRatios).forEach((k) => {
                        const part = k;
                        const portion = (role.bodyRatios[part] / bodyRatioSum) * capacity;
                        const chunkCount = Math.floor(portion / BODYPART_COST[part]);
                        remaining -= (chunkCount * BODYPART_COST[part]);
                        _.times(chunkCount, () => bodyParts.push(part));
                    });
                    _.times(Math.floor(remaining / BODYPART_COST[MOVE]), () => bodyParts.push(MOVE));
                }
                else {
                    let remaining = capacity;
                    let expandoPart = undefined;
                    const keys = Object.keys(role.bodyParts);
                    for (const i in keys) {
                        const part = keys[i];
                        if (role.bodyParts[part] === '*') {
                            expandoPart = part;
                        }
                        else {
                            _.times(role.bodyParts[part], () => bodyParts.push(part));
                        }
                    }
                    // todo - balance if multiple expandos provided
                    if (expandoPart) {
                        _.times(Math.floor(remaining / BODYPART_COST[MOVE]), () => bodyParts.push(expandoPart));
                    }
                }
                const creation = spawn[0].spawnCreep(bodyParts, `${room.name}_${role.type}_${NAME_ID()}`, {
                    memory: {
                        creepState: CreepState.Harvesting,
                        type: role.type
                    },
                    directions: [BOTTOM]
                });
                if (creation !== OK) {
                    console.log("couldn't create", creation, role.type, bodyParts);
                }
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
var Stance;
(function (Stance) {
    Stance[Stance["Defense"] = 0] = "Defense";
    Stance[Stance["Normal"] = 1] = "Normal";
})(Stance || (Stance = {}));
function getFacts() {
    const facts = {
        nucleus: "W8N3",
        visibleRooms: Object.keys(Game.rooms),
        roomStance: {}
    };
    if (!Memory._Mastermind) {
        Memory._Mastermind = {};
    }
    if (!Memory._Mastermind.permFacts) {
        Memory._Mastermind.permFacts = {
            rooms: {}
        };
    }
    facts.visibleRooms.forEach((roomName) => {
        const room = Game.rooms[roomName];
        if (!Memory._Mastermind.permFacts.rooms[roomName]) {
            Memory._Mastermind.permFacts.rooms[roomName] = {
                sourceSlots: countSourceSlots(room),
                adjacentRooms: findAccessibleAdjacentRooms(roomName)
            };
        }
        const enemies = room.find(FIND_HOSTILE_CREEPS);
        const enemyConstruction = room.find(FIND_HOSTILE_CONSTRUCTION_SITES);
        const enemyStructure = room.find(FIND_HOSTILE_STRUCTURES);
        facts.roomStance[roomName] = { stance: Stance.Normal };
        if (enemies.length || enemyConstruction.length || enemyStructure.length) {
            facts.roomStance[roomName] = {
                stance: Stance.Defense,
                enemyCreeps: enemies.map((e) => e.id),
                enemyConstruction: enemyConstruction.map((e) => e.id),
                enemyStructure: enemyStructure.map((e) => e.id)
            };
        }
    });
    facts.permFacts = Memory._Mastermind.permFacts;
    return facts;
}
const textStyle = {
    align: "left",
    color: "#ffffff",
    backgroundColor: "#000000",
    opacity: 0.6,
};
function drawRoomInfo(facts, room) {
    const { text, line } = txFn(room);
    text(`ROOM ${room}`);
    line();
    if (facts.nucleus === room) {
        text('NUCLEUS COLONY');
    }
    text('STANCE ' + Stance[facts.roomStance[room].stance].toString());
    text('SOURCE SLOTS ' + facts.permFacts.rooms[room].sourceSlots);
}
const txFn = ((room) => {
    const vis = new RoomVisual(room);
    const origin = {
        x: 4,
        y: 3
    };
    let rowOffset = 0;
    return {
        text: (text, onNewLine = true) => {
            if (onNewLine) {
                rowOffset++;
            }
            vis.text(text, origin.x, origin.y + rowOffset, textStyle);
        },
        line: (width = 10, onNewLine = true) => {
            if (onNewLine) {
                rowOffset++;
            }
            vis.line(origin.x, origin.y + rowOffset, origin.x + width, origin.y + rowOffset);
        }
    };
});
function init() {
    const facts = getFacts();
    global.facts = facts;
    drawRoomInfo(facts, facts.nucleus);
}
const Mastermind = {
    run() {
        init();
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
