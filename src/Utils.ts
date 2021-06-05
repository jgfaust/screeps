export const NAME_ID = (() => {
   let initial = Number.parseInt(`${Date.now()}`.substr(4, 4));
   return () => initial++;
})();

interface RoomCoordinates {
   a: string;
   column: number;
   b: string;
   row: number;
}

const getRoomCoordinates = ((roomName: string): RoomCoordinates => {
   const xy = roomName.split(/[^\d]/).filter((s) => !!s);
   const ab = roomName.split(/[\d]/).filter((s) => !!s);
   return {
      a: ab[0],
      column: Number.parseInt(xy[0]),
      b: ab[1],
      row: Number.parseInt(xy[1])
   };
});

const getRoomFromCoordinates = (a: string, column: number, b: string, row: number) =>
   `${a}${column}${b}${row}`;

const roomTop = (currentRoom: string, coordinates?: RoomCoordinates) => {
   if(!coordinates) {
      coordinates = getRoomCoordinates(currentRoom);
   }
   return getRoomFromCoordinates(coordinates.a, coordinates.column,
      coordinates.b, coordinates.row + 1);
};

const roomLeft = (currentRoom: string, coordinates?: RoomCoordinates) => {
   if(!coordinates) {
      coordinates = getRoomCoordinates(currentRoom);
   }
   return getRoomFromCoordinates(coordinates.a, coordinates.column + 1,
      coordinates.b, coordinates.row);
};

const roomRight = (currentRoom: string, coordinates?: RoomCoordinates) => {
   if(!coordinates) {
      coordinates = getRoomCoordinates(currentRoom);
   }
   return getRoomFromCoordinates(coordinates.a, coordinates.column - 1,
      coordinates.b, coordinates.row);
};

const roomBottom = (currentRoom: string, coordinates?: RoomCoordinates) => {
   if(!coordinates) {
      coordinates = getRoomCoordinates(currentRoom);
   }
   return getRoomFromCoordinates(coordinates.a, coordinates.column,
      coordinates.b, coordinates.row - 1);
};

export const findAccessibleAdjacentRooms = ((roomName: string): string[] => {
   const currentRoom = Game.rooms[roomName];
   const accessibleRooms = [];
   if(currentRoom) {
      const coordinates = getRoomCoordinates(roomName);
      const top = roomTop(roomName, coordinates);
      const bottom = roomBottom(roomName, coordinates);
      const left = roomLeft(roomName, coordinates);
      const right = roomRight(roomName, coordinates);
      if(currentRoom.findExitTo(top) === FIND_EXIT_TOP) {
         accessibleRooms.push(top);
      }
      if(currentRoom.findExitTo(bottom) === FIND_EXIT_BOTTOM) {
         accessibleRooms.push(bottom);
      }
      if(currentRoom.findExitTo(left) === FIND_EXIT_LEFT) {
         accessibleRooms.push(left);
      }
      if(currentRoom.findExitTo(right) === FIND_EXIT_RIGHT) {
         accessibleRooms.push(right);
      }
   }
   return accessibleRooms;
});

export const countSourceSlots = ((room: Room) => {
   const sources = room.find(FIND_SOURCES);
   let slots = 0;
   sources.forEach((source) => {
      const leftx = clamp(source.pos.x - 1);
      const lefty = clamp(source.pos.y - 1);
      const rightx = clamp(source.pos.x + 1);
      const righty = clamp(source.pos.y + 1);
      const terrain = room.getTerrain();
      for(let y = lefty; y <= righty; y++) {
         for(let x = leftx; x <= rightx; x++) {
            if(terrain.get(x, y) === 0) {
               slots++;
            }
         }
      }
   });
   return slots;
});

const clamp = (x: number) =>
   x < 0 ? 0 :
      (x > 49 ? 49 : x);


export const PICKUP_RESOURCE = [
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