export const Tower = {
   run(room: Room): void {
      const towers: StructureTower[] = room.find(FIND_MY_STRUCTURES, {
         filter: {structureType: STRUCTURE_TOWER}
      }) as StructureTower[];
      if(towers.length) {
         towers.forEach((tower) => {
            const hostile = tower.pos.findClosestByRange(FIND_HOSTILE_CREEPS);
            if(hostile) {
               if(tower.attack(hostile) === ERR_NOT_IN_RANGE) {
                  this.towerAction(tower);
               }
            } else {
               towers.forEach(Tower.towerAction);
            }
         });
      }
   },
   towerAction(tower: StructureTower) {
      const nearbyDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
         filter: (s) => s.hits < s.hitsMax
      });
      if(false && nearbyDamagedStructure) {
         // @ts-ignore
         tower.repair(nearbyDamagedStructure);
      } else {
         const nearbyDamagedCreep = tower.pos.findClosestByRange(FIND_MY_CREEPS, {
            filter: (s) => s.hits < s.hitsMax
         });
         if(nearbyDamagedCreep) {
            tower.heal(nearbyDamagedCreep);
         }
      }

   }
};