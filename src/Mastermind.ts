import {Role} from "./role/Role";
import {ColonyDirector} from "./ColonyDirector";
import {Harvester} from "./role/Role.Harvester";
import {Tower} from "./Tower";
import {Repair} from "./role/Role.Repair";
import {Builder} from "./role/Role.Builder";
import {Upgrader} from "./role/Role.Upgrader";

const _ = require('lodash');

const desiredColonies = [
   'W8N3',
   'W8N2',
   'W7N2',
   'W7N1',
   'W6N1',
   'W6N2'
];

const priorities = [
   'Defend',
   'DevelopColonies',
   'BuildInfrastructure',
   'Explore'
];


interface Planner {

}

enum Stance {
   Defense,
   Normal,
}

export interface Facts {
   nucleus: string;
   visibleRooms: string[];
   roomStance: RoomStance;
}

interface RoomStance {
   [K: string]: {
      stance: Stance,
      enemyCreeps?: string[];
      enemyConstruction?: string[];
      enemyStructure?: string[];
   }
}

function getFacts(): Facts {
   const facts: Partial<Facts> = {
      nucleus: "W8N3",
      visibleRooms: Object.keys(Game.rooms),
      roomStance: {}
   };

   facts.visibleRooms!.forEach((roomName) => {
      const enemies = Game.rooms[roomName].find(FIND_HOSTILE_CREEPS);
      const enemyConstruction = Game.rooms[roomName].find(FIND_HOSTILE_CONSTRUCTION_SITES);
      const enemyStructure = Game.rooms[roomName].find(FIND_HOSTILE_STRUCTURES);
      facts.roomStance![roomName] = {stance: Stance.Normal};

      if(enemies.length || enemyConstruction.length || enemyStructure.length) {
         facts.roomStance![roomName] = {
            stance: Stance.Defense,
            enemyCreeps: enemies.map((e) => e.id),
            enemyConstruction: enemyConstruction.map((e) => e.id),
            enemyStructure: enemyStructure.map((e) => e.id)
         };
      }
   });

   return facts as Facts;
}

const textStyle: TextStyle = {
   align: "left",
   color: "#ffffff",
   backgroundColor: "#000000",
   opacity: 0.6,
};

function drawRoomInfo(facts: Facts, room: string) {
   const vis = new RoomVisual(room);
   const origin = {
      x: 4,
      y: 3
   };
   vis.text(`ROOM ${room}`, origin.x, origin.y, textStyle);
   vis.line(origin.x, origin.y + 1, origin.x + 10, origin.y + 1);
   if(facts.nucleus === room) {
      vis.text('NUCLEUS COLONY', origin.x, origin.y + 2, textStyle);
   }
}

function init() {
   const facts = getFacts();
   global.facts = facts;
   if(!Memory._Mastermind) {
      drawRoomInfo(facts, facts.nucleus);
   }
}

export const Mastermind = {
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
      if(!Game.creeps[k]) {
         delete Memory.creeps[k];
      }
   });
}