// In-memory store for MVP (no database required)
let tanda = null;

module.exports = {
  getTanda: () => tanda,
  setTanda: (data) => { tanda = data; },
  resetTanda: () => { tanda = null; },
};
