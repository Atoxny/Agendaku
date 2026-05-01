const storageService = require('../services/storage.service');

const tandaController = {
  async create(req, res) {
    try {
      const { participantes, monto, duracionMeses } = req.body;

      if (!participantes || !Array.isArray(participantes) || participantes.length === 0) {
        return res.status(400).json({ error: 'Se requiere una lista de participantes' });
      }

      // Sorteo aleatorio de turnos
      const participantesSorteados = [...participantes]
        .sort(() => Math.random() - 0.5)
        .map((nombre, index) => ({
          nombre,
          turno: index + 1
        }));

      const newTanda = {
        config: {
          monto,
          duracionMeses,
          fechaInicio: new Date().toISOString()
        },
        participantes: participantesSorteados,
        aportes: []
      };

      await storageService.write(newTanda);
      res.status(201).json(newTanda);
    } catch (error) {
      res.status(500).json({ error: 'Error al crear la tanda' });
    }
  },

  async getStatus(req, res) {
    try {
      const tanda = await storageService.read();
      if (!tanda.config) {
        return res.status(404).json({ message: 'No hay una tanda activa' });
      }
      res.json(tanda);
    } catch (error) {
      res.status(500).json({ error: 'Error al obtener el estado' });
    }
  },

  async addAporte(req, res) {
    try {
      const { nombre, mes, monto } = req.body;
      const tanda = await storageService.read();

      if (!tanda.config) {
        return res.status(404).json({ error: 'No hay una tanda activa' });
      }

      const participante = tanda.participantes.find(p => p.nombre === nombre);
      if (!participante) {
        return res.status(400).json({ error: 'Participante no encontrado' });
      }

      const nuevoAporte = {
        nombre,
        mes,
        monto,
        fecha: new Date().toISOString()
      };

      tanda.aportes.push(nuevoAporte);
      await storageService.write(tanda);

      res.status(201).json({ message: 'Aporte registrado con éxito', aporte: nuevoAporte });
    } catch (error) {
      res.status(500).json({ error: 'Error al registrar el aporte' });
    }
  }
};

module.exports = tandaController;
