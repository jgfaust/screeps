export const Tower = {
   run(tower: StructureTower): void {
      const nearbyDamagedStructure = tower.pos.findClosestByRange(FIND_STRUCTURES, {
         filter: (s) => s.hits < s.hitsMax
      });
      if(nearbyDamagedStructure) {
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
}