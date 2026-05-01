const store = require('../data/store');

// ─── POST /api/tanda ─────────────────────────────────────────────────────────
// Crea una nueva tanda con participantes, monto y duración
const crearTanda = (req, res) => {
  const { participantes, montoPorTurno, descripcion } = req.body;

  // Validaciones
  if (!participantes || !Array.isArray(participantes) || participantes.length < 2) {
    return res.status(400).json({
      error: 'Se necesitan al menos 2 participantes. Envía un array con sus nombres.',
    });
  }
  if (!montoPorTurno || isNaN(montoPorTurno) || montoPorTurno <= 0) {
    return res.status(400).json({ error: 'El monto por turno debe ser un número mayor a 0.' });
  }

  if (store.getTanda()) {
    return res.status(409).json({
      error: 'Ya existe una tanda activa. Usa DELETE /api/tanda para reiniciar.',
    });
  }

  // Sorteo aleatorio y transparente de turnos
  const participantesConTurno = [...participantes]
    .map((nombre) => ({ nombre: nombre.trim(), sorteoNumero: Math.random() }))
    .sort((a, b) => a.sorteoNumero - b.sorteoNumero)
    .map(({ nombre }, index) => ({
      nombre,
      turno: index + 1,
      haAportado: false,
      esBeneficiario: false,
      fechaAporte: null,
    }));

  const duracionMeses = participantes.length;
  const totalAcumulado = montoPorTurno * participantes.length;

  const nuevaTanda = {
    id: `tanda-${Date.now()}`,
    descripcion: descripcion || 'Tanda Agendaku',
    creadaEn: new Date().toISOString(),
    estado: 'activa',
    mesActual: 1,
    duracionMeses,
    montoPorTurno: Number(montoPorTurno),
    totalAcumulado,
    participantes: participantesConTurno,
    historialMeses: [],
    beneficiariosEntregados: [],
  };

  store.setTanda(nuevaTanda);

  return res.status(201).json({
    mensaje: '¡Tanda creada exitosamente! Los turnos fueron sorteados de forma aleatoria.',
    tanda: nuevaTanda,
  });
};

// ─── GET /api/tanda ───────────────────────────────────────────────────────────
// Devuelve la configuración y estado actual de la tanda
const consultarTanda = (req, res) => {
  const tanda = store.getTanda();
  if (!tanda) {
    return res.status(404).json({ error: 'No hay ninguna tanda activa. Crea una con POST /api/tanda.' });
  }

  const beneficiarioActual = tanda.participantes.find((p) => p.turno === tanda.mesActual);
  const pendientes = tanda.participantes.filter((p) => !p.haAportado).map((p) => p.nombre);
  const aportados = tanda.participantes.filter((p) => p.haAportado).map((p) => p.nombre);

  return res.json({
    tanda,
    resumenMesActual: {
      mes: tanda.mesActual,
      beneficiario: beneficiarioActual?.nombre || 'Ciclo completado',
      montoQueRecibira: tanda.totalAcumulado,
      aportaronEsMes: aportados,
      pendienteDeAportar: pendientes,
    },
  });
};

// ─── POST /api/tanda/aporte ───────────────────────────────────────────────────
// Registra el aporte de un participante en el mes actual
const registrarAporte = (req, res) => {
  const tanda = store.getTanda();
  if (!tanda) {
    return res.status(404).json({ error: 'No hay tanda activa.' });
  }
  if (tanda.estado === 'completada') {
    return res.status(400).json({ error: 'La tanda ya fue completada.' });
  }

  const { nombre } = req.body;
  if (!nombre) {
    return res.status(400).json({ error: 'Debes enviar el campo "nombre" del participante.' });
  }

  const participante = tanda.participantes.find(
    (p) => p.nombre.toLowerCase() === nombre.trim().toLowerCase()
  );

  if (!participante) {
    return res.status(404).json({ error: `No se encontró al participante "${nombre}".` });
  }
  if (participante.haAportado) {
    return res.status(409).json({ error: `${participante.nombre} ya aportó en este mes.` });
  }

  // Registrar aporte
  participante.haAportado = true;
  participante.fechaAporte = new Date().toISOString();

  // Verificar si todos aportaron
  const todosAportaron = tanda.participantes.every((p) => p.haAportado);
  let mensajeEntrega = null;

  if (todosAportaron) {
    const beneficiario = tanda.participantes.find((p) => p.turno === tanda.mesActual);
    beneficiario.esBeneficiario = true;

    tanda.historialMeses.push({
      mes: tanda.mesActual,
      beneficiario: beneficiario.nombre,
      montoEntregado: tanda.totalAcumulado,
      fechaEntrega: new Date().toISOString(),
      participantes: tanda.participantes.map((p) => ({
        nombre: p.nombre,
        aportó: p.haAportado,
        fechaAporte: p.fechaAporte,
      })),
    });

    tanda.beneficiariosEntregados.push(beneficiario.nombre);

    mensajeEntrega = `🎉 ¡Todos aportaron! ${beneficiario.nombre} recibe $${tanda.totalAcumulado} este mes.`;

    // Avanzar al siguiente mes o cerrar la tanda
    if (tanda.mesActual < tanda.duracionMeses) {
      tanda.mesActual += 1;
      // Resetear aportes para el siguiente mes
      tanda.participantes.forEach((p) => {
        p.haAportado = false;
        p.fechaAporte = null;
      });
    } else {
      tanda.estado = 'completada';
      mensajeEntrega += ' 🏁 ¡La tanda ha concluido!';
    }
  }

  // Recordatorio simulado para los que faltan
  const pendientes = tanda.participantes.filter((p) => !p.haAportado).map((p) => p.nombre);
  const recordatorio =
    pendientes.length > 0
      ? `📢 Recordatorio enviado a: ${pendientes.join(', ')} para que aporten $${tanda.montoPorTurno}.`
      : null;

  store.setTanda(tanda);

  return res.json({
    mensaje: `Aporte de ${participante.nombre} registrado correctamente.`,
    entrega: mensajeEntrega,
    recordatorio,
    estadoTanda: tanda.estado,
  });
};

// ─── GET /api/tanda/resumen ───────────────────────────────────────────────────
// Devuelve el resumen final del ciclo completo
const resumenFinal = (req, res) => {
  const tanda = store.getTanda();
  if (!tanda) {
    return res.status(404).json({ error: 'No hay tanda activa.' });
  }

  return res.json({
    id: tanda.id,
    descripcion: tanda.descripcion,
    estado: tanda.estado,
    totalParticipantes: tanda.participantes.length,
    montoPorTurno: tanda.montoPorTurno,
    totalMovido: tanda.montoPorTurno * tanda.historialMeses.length * tanda.participantes.length,
    mesesCompletados: tanda.historialMeses.length,
    historialMeses: tanda.historialMeses,
    ordenDeTurnos: tanda.participantes.map((p) => ({ turno: p.turno, nombre: p.nombre })),
  });
};

// ─── DELETE /api/tanda ────────────────────────────────────────────────────────
// Reinicia la tanda (útil para el MVP)
const eliminarTanda = (req, res) => {
  store.resetTanda();
  return res.json({ mensaje: 'Tanda eliminada. Puedes crear una nueva con POST /api/tanda.' });
};

module.exports = { crearTanda, consultarTanda, registrarAporte, resumenFinal, eliminarTanda };
