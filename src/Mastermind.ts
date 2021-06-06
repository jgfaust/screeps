import {ColonyDirector} from "./ColonyDirector";
import {countSourceSlots, findAccessibleAdjacentRooms} from "./Utils";

const _ = require('lodash');

const desiredColonies = [
   'W8N3',
   'W8N2',
   'W7N2',
   'W7N1',
   'W6N1',
   'W6N2'
];


enum Stance {
   Defense,
   Normal,
}

export interface Facts {
   nucleus: string;
   visibleRooms: string[];
   roomStance: RoomStance;
   permFacts: PermFacts;
}

export interface PermFacts {
   rooms: {
      [K: string]: {
         sourceSlots: number;
         adjacentRooms: string[];
      }
   }
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

   if(!Memory._Mastermind) {
      Memory._Mastermind = {};
   }

   if(!Memory._Mastermind.permFacts) {
      Memory._Mastermind.permFacts = {
         rooms: {}
      };
   }

   facts.visibleRooms!.forEach((roomName) => {
      const room = Game.rooms[roomName];
      if(!Memory._Mastermind.permFacts.rooms[roomName]) {
         Memory._Mastermind.permFacts.rooms[roomName] = {
            sourceSlots: countSourceSlots(room),
            adjacentRooms: findAccessibleAdjacentRooms(roomName)
         };
      }

      const enemies = room.find(FIND_HOSTILE_CREEPS);
      const enemyConstruction = room.find(FIND_HOSTILE_CONSTRUCTION_SITES);
      const enemyStructure = room.find(FIND_HOSTILE_STRUCTURES);
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

   facts.permFacts = Memory._Mastermind.permFacts;
   return facts as Facts;
}

const textStyle: TextStyle = {
   align: "left",
   color: "#ffffff",
   backgroundColor: "#000000",
   opacity: 0.6,
};

function drawRoomInfo(facts: Facts, room: string) {
   const {text, line} = txFn(room);
   text(`ROOM ${room}`);
   line();
   if(facts.nucleus === room) {
      text('NUCLEUS COLONY');
   }
   text('STANCE ' + Stance[facts.roomStance[room]?.stance].toString());
   text('SOURCE SLOTS ' + facts.permFacts.rooms[room].sourceSlots);
}

const txFn = ((room: string) => {
   const vis = new RoomVisual(room);
   const origin = {
      x: 4,
      y: 3
   };
   let rowOffset = 0;
   return {
      text: (text: string, onNewLine: boolean = true) => {
         if(onNewLine) {
            rowOffset++;
         }
         vis.text(text, origin.x, origin.y + rowOffset, textStyle);
      },
      line: (width: number = 10, onNewLine: boolean = true) => {
         if(onNewLine) {
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