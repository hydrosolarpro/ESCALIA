// Pruebas de la lógica de agenda y del bucle del agente (sin red ni claves).
// Ejecutar:  npx tsx scripts/test-agenda.ts
import assert from 'node:assert/strict';
import {
  AGENDA, agendarCita, bookableDates, consultarDisponibilidad, daySlots, freeSlots,
  limaTimeStr, runAgent, type AgendaStore, type Generate, type Interval,
} from '../api/chat';

const t = (name: string, fn: () => void | Promise<void>) =>
  Promise.resolve(fn()).then(() => console.log(`  ok  ${name}`));

// Lunes 19-oct-2026 07:00 Lima (= 12:00Z): "ahora" de referencia.
const NOW = Date.UTC(2026, 9, 19, 12, 0);
const MONDAY = '2026-10-19';

function memoryStore(initial: Interval[] = []): AgendaStore & { rows: Interval[] } {
  const rows = [...initial];
  return {
    rows,
    async getBooked() { return rows; },
    async createAppointment(a) {
      if (rows.some((r) => r.startMs < a.endMs && r.endMs > a.startMs)) return { ok: false, reason: 'slot_taken' };
      rows.push({ startMs: a.startMs, endMs: a.endMs });
      return { ok: true, id: String(rows.length) };
    },
  };
}

async function main() {
  console.log('Agenda');
  await t('2026-10-19 es lunes (verificación independiente)', () => {
    assert.equal(new Date('2026-10-19T12:00:00Z').getUTCDay(), 1);
  });
  await t('un día laborable tiene 16 franjas de 30 min y respeta el almuerzo', () => {
    const labels = daySlots(MONDAY).map((s) => s.label);
    assert.equal(labels.length, 16);
    assert.equal(labels[0], '09:00');
    assert.equal(labels.at(-1), '17:30');
    assert.ok(!labels.includes('13:00') && !labels.includes('13:30'));
    assert.ok(labels.includes('14:00'));
  });
  await t('09:00 Lima = 14:00 UTC', () => {
    assert.equal(new Date(daySlots(MONDAY)[0].startMs).toISOString(), '2026-10-19T14:00:00.000Z');
    assert.equal(limaTimeStr(daySlots(MONDAY)[0].startMs), '09:00');
  });
  await t('fin de semana sin franjas', () => {
    assert.equal(daySlots('2026-10-24').length, 0);
    assert.equal(freeSlots('2026-10-25', [], NOW).length, 0);
  });
  await t('anticipación mínima de 2 h', () => {
    const now = Date.UTC(2026, 9, 19, 14, 10); // 09:10 Lima
    assert.equal(freeSlots(MONDAY, [], now)[0].label, '11:30'); // >= 11:10 → primera franja 11:30
  });
  await t('fechas pasadas o fuera del horizonte no se ofrecen', () => {
    assert.equal(freeSlots('2026-10-16', [], NOW).length, 0);
    assert.equal(freeSlots('2026-12-01', [], NOW).length, 0);
    assert.ok(bookableDates(NOW).length > 0 && bookableDates(NOW).length <= 11);
  });
  await t('una cita ocupada bloquea solo su franja', () => {
    const slot = daySlots(MONDAY).find((s) => s.label === '10:00')!;
    const free = freeSlots(MONDAY, [slot], NOW).map((s) => s.label);
    assert.ok(!free.includes('10:00'));
    assert.ok(free.includes('09:30') && free.includes('10:30'));
  });

  console.log('Herramientas');
  await t('no se pueden agendar dos citas en el mismo horario', async () => {
    const store = memoryStore();
    const args = { fecha: MONDAY, hora: '10:00', nombre: 'Ana Pérez', email: 'ana@correo.com' };
    const a = await agendarCita(args, store, NOW);
    assert.equal(a.ok, true);
    const b: any = await agendarCita({ ...args, nombre: 'Luis Gómez', email: 'luis@correo.com' }, store, NOW);
    assert.equal(b.ok, false);
    assert.equal(b.motivo, 'horario_no_disponible');
    assert.ok(!b.horarios_libres_ese_dia.includes('10:00'));
    assert.equal(store.rows.length, 1);
  });
  await t('carrera: el almacén rechaza el solapamiento aunque la consulta previa lo viera libre', async () => {
    const slot = daySlots(MONDAY).find((s) => s.label === '11:00')!;
    const store = memoryStore();
    const racy: AgendaStore = {
      getBooked: async () => [], // la consulta "no ve" la cita…
      createAppointment: async (a) => { store.rows.push(slot); return store.createAppointment(a); }, // …pero otro la tomó antes
    };
    const r: any = await agendarCita({ fecha: MONDAY, hora: '11:00', nombre: 'Ana Pérez', email: 'ana@correo.com' }, racy, NOW);
    assert.equal(r.ok, false);
    assert.equal(r.motivo, 'horario_recien_ocupado');
  });
  await t('validaciones: correo, nombre, horario inexistente, sábado, fecha mal formada', async () => {
    const store = memoryStore();
    const base = { fecha: MONDAY, hora: '10:00', nombre: 'Ana Pérez', email: 'ana@correo.com' };
    assert.equal(((await agendarCita({ ...base, email: 'no-es-correo' }, store, NOW)) as any).motivo, 'email_invalido');
    assert.equal(((await agendarCita({ ...base, nombre: '' }, store, NOW)) as any).motivo, 'falta_nombre');
    assert.equal(((await agendarCita({ ...base, hora: '13:00' }, store, NOW)) as any).motivo, 'horario_no_disponible');
    assert.equal(((await agendarCita({ ...base, fecha: '2026-10-24' }, store, NOW)) as any).motivo, 'horario_no_disponible');
    assert.equal(((await agendarCita({ ...base, fecha: 'mañana' }, store, NOW)) as any).motivo, 'fecha_u_hora_invalida');
    assert.equal(store.rows.length, 0);
  });
  await t('consultar sin fecha devuelve próximas fechas con cupo', async () => {
    const r: any = await consultarDisponibilidad({}, memoryStore(), NOW);
    assert.equal(r.ok, true);
    assert.equal(r.proximas_fechas_con_cupo.length, 5);
    assert.equal(r.proximas_fechas_con_cupo[0].fecha, MONDAY);
  });
  await t('consultar un sábado explica el motivo y propone otras fechas', async () => {
    const r: any = await consultarDisponibilidad({ fecha: '2026-10-24' }, memoryStore(), NOW);
    assert.equal(r.disponible, false);
    assert.match(r.motivo, /lunes a viernes/);
    assert.ok(r.otras_fechas.length > 0);
  });

  console.log('Agente');
  await t('el bucle ejecuta herramientas y devuelve el texto final', async () => {
    const store = memoryStore();
    let step = 0;
    const generate: Generate = async () => {
      step++;
      if (step === 1) {
        return { text: '', content: { role: 'model', parts: [] }, functionCalls: [{ name: 'consultar_disponibilidad', args: { fecha: MONDAY } }] };
      }
      if (step === 2) {
        return { text: '', content: { role: 'model', parts: [] }, functionCalls: [{ name: 'agendar_cita', args: { fecha: MONDAY, hora: '09:00', nombre: 'Ana Pérez', email: 'ana@correo.com' } }] };
      }
      return { text: 'Listo, tu cita quedó agendada.', content: null, functionCalls: [] };
    };
    const reply = await runAgent({ messages: [{ role: 'user', content: 'Quiero agendar' }], generate, store, nowMs: NOW });
    assert.equal(reply, 'Listo, tu cita quedó agendada.');
    assert.equal(store.rows.length, 1);
  });
  await t('herramienta desconocida o que falla no rompe la conversación', async () => {
    const boom: AgendaStore = {
      getBooked: async () => { throw new Error('db'); },
      createAppointment: async () => ({ ok: false, reason: 'error' }),
    };
    let step = 0;
    const generate: Generate = async () =>
      ++step === 1
        ? { text: '', content: null, functionCalls: [{ name: 'consultar_disponibilidad', args: {} }, { name: 'inventada', args: {} }] }
        : { text: 'Ahora mismo no puedo ver la agenda.', content: null, functionCalls: [] };
    const reply = await runAgent({ messages: [{ role: 'user', content: 'hola' }], generate, store: boom, nowMs: NOW });
    assert.equal(reply, 'Ahora mismo no puedo ver la agenda.');
  });

  console.log(`\nTodas las pruebas pasaron (config: ${AGENDA.slotMinutes} min, ${AGENDA.windows.length} franjas).`);
}

main().catch((e) => { console.error('\nFALLÓ:', e); process.exit(1); });
