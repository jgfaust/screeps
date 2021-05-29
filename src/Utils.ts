
export const NAME_ID = (() => {
   let initial = Number.parseInt(`${Date.now()}`.substr(4, 4));
   return () => initial++;
})();