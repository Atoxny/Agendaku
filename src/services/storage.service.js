const fs = require('fs').promises;
const path = require('path');

const DATA_FILE = path.join(__dirname, '../../data/tanda.json');

const storageService = {
  async read() {
    try {
      const data = await fs.readFile(DATA_FILE, 'utf8');
      return JSON.parse(data);
    } catch (error) {
      if (error.code === 'ENOENT') {
        // Return default structure if file doesn't exist
        return {
          config: null,
          participantes: [],
          aportes: []
        };
      }
      throw error;
    }
  },

  async write(data) {
    await fs.writeFile(DATA_FILE, JSON.stringify(data, null, 2), 'utf8');
  }
};

module.exports = storageService;
