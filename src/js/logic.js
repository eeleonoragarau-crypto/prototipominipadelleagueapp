'use strict';
/* ================= helpers ================= */
const esc = s => String(s == null ? '' : s).replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
function hashStr(str) { let h = 2166136261 >>> 0; for (let i = 0; i < str.length; i++) { h ^= str.charCodeAt(i); h = Math.imul(h, 16777619); } return h >>> 0; }
function mulberry32(a) { return function () { a |= 0; a = a + 0x6D2B79F5 | 0; let t = Math.imul(a ^ a >>> 15, 1 | a); t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t; return ((t ^ t >>> 14) >>> 0) / 4294967296; }; }
const rngFor = s => mulberry32(hashStr(String(s)));
function shuffle(a, r) { for (let i = a.length - 1; i > 0; i--) { const j = Math.floor(r() * (i + 1)); [a[i], a[j]] = [a[j], a[i]]; } return a; }
function pickW(vals, ws, r) { const tot = ws.reduce((x, y) => x + y, 0); let x = r() * tot; for (let i = 0; i < vals.length; i++) { x -= ws[i]; if (x < 0) return vals[i]; } return vals[vals.length - 1]; }
const cap = s => s.charAt(0).toUpperCase() + s.slice(1);
const norm = s => String(s).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase();
const thou = n => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, '.');
const dec = x => Number(x).toFixed(1).replace('.', ',');
const sgn = x => x > 0 ? '+' + x : x < 0 ? '\u2212' + Math.abs(x) : '0';

/* ================= dates ================= */
const NOW = new Date(2026, 9, 3, 13, 40);
const MESI = ['gen', 'feb', 'mar', 'apr', 'mag', 'giu', 'lug', 'ago', 'set', 'ott', 'nov', 'dic'];
const MESI_L = ['gennaio', 'febbraio', 'marzo', 'aprile', 'maggio', 'giugno', 'luglio', 'agosto', 'settembre', 'ottobre', 'novembre', 'dicembre'];
const GIORNI = ['dom', 'lun', 'mar', 'mer', 'gio', 'ven', 'sab'];
const GIORNI_L = ['domenica', 'lunedì', 'martedì', 'mercoledì', 'giovedì', 'venerdì', 'sabato'];
const mkDate = s => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
const addDays = (d, n) => new Date(d.getFullYear(), d.getMonth(), d.getDate() + n);
const dNum = d => `${d.getDate()} ${MESI[d.getMonth()]}`;
const dShort = d => `${cap(GIORNI[d.getDay()])} ${d.getDate()} ${MESI[d.getMonth()]}`;
const dLong = d => `${GIORNI_L[d.getDay()]} ${d.getDate()} ${MESI_L[d.getMonth()]}`;
const hm = d => `${d.getHours()}:${String(d.getMinutes()).padStart(2, '0')}`;
const dRange = (a, b) => a.toDateString() === b.toDateString() ? `${GIORNI[a.getDay()]} ${dNum(a)}` : a.getMonth() === b.getMonth() ? `${a.getDate()}–${b.getDate()} ${MESI[a.getMonth()]}` : `${dNum(a)} – ${dNum(b)}`;

/* ================= static data ================= */
const TAPPE_RAW = [
  ['Roma', 'Circolo Tevere Padel', '2026-03-07', 1], ['Napoli', 'Vomero Padel Club', '2026-03-21', 1],
  ['Firenze', 'Circolo Arno Padel', '2026-04-04', 1], ['Bologna', 'Padel Club Reno', '2026-04-18', 1],
  ['Torino', 'Padel Club Dora', '2026-05-02', 1], ['Bari', 'Padel Club Levante', '2026-05-16', 1],
  ['Verona', 'Padel Club Adige', '2026-05-23', 1], ['Genova', 'Padel Club Lanterna', '2026-06-06', 1],
  ['Palermo', "Padel Club Conca d'Oro", '2026-06-13', 1], ['Cagliari', 'Poetto Padel Club', '2026-06-20', 1],
  ['Rimini', 'Padel Club Marina', '2026-06-27', 1], ['Pescara', 'Padel Club Aterno', '2026-07-04', 1],
  ['Lecce', 'Padel Club Barocco', '2026-07-11', 1], ['Catania', 'Etna Padel Club', '2026-07-18', 1],
  ['Como', 'Padel Club Lario', '2026-07-25', 1], ['Venezia', 'Lido Padel Club', '2026-08-29', 1],
  ['Padova', 'Padel Club Brenta', '2026-09-05', 1], ['Brescia', 'Padel Club Mella', '2026-09-12', 1],
  ['Bergamo', 'Padel Club Città Alta', '2026-09-19', 1], ['Parma', 'Padel Club Ducale', '2026-09-26', 1],
  ['Milano', 'Club Sforza Padel', '2026-10-03', 1], ['Trieste', 'Padel Club Bora', '2026-10-10', 1],
  ['Modena', 'Padel Club Ghirlandina', '2026-10-17', 1], ['Perugia', 'Padel Club Trasimeno', '2026-10-24', 1],
  ['Ancona', 'Padel Club Conero', '2026-10-31', 1], ['Pisa', 'Padel Club Arsenale', '2026-11-07', 1],
  ['Salerno', 'Padel Club Lungomare', '2026-11-14', 1],
];
const TAPPE = TAPPE_RAW.map(([city, club, d, days], i) => {
  const start = mkDate(d);
  return { id: i + 1, n: i + 1, city, club, start, end: addDays(start, days - 1), long: days > 2, addr: `Via dello Sport ${12 + i * 3}, ${city}` };
});
const T = id => TAPPE[id - 1];
function tStatus(t) {
  if (addDays(t.end, 1) <= NOW) return 'done';
  if (t.start <= NOW) return 'live';
  return (t.start - NOW) / 864e5 <= 30 ? 'open' : 'soon';
}
const STATUS_L = { done: 'Conclusa', live: 'In corso', open: 'Iscrizioni aperte', soon: 'In programma' };
const regOpenDate = t => addDays(t.start, -30);
const regCloseDate = t => addDays(t.start, -3);

const CATS = [{ k: 'M', l: 'Maschile', courts: [1, 2, 3, 4] }, { k: 'F', l: 'Femminile', courts: [5, 6] }, { k: 'X', l: 'Misto', courts: [7, 8, 9] }];
const CAT = k => CATS.find(c => c.k === k);
const LETTERS = 'ABCDEFGHIJKLMNOP';
const AVC = ['#6C8CF0', '#F08C6C', '#46B39A', '#9B6CF0', '#E0A33C', '#E0708F', '#4FA3D9', '#7FAF4A'];
const MARCO_TAPPE = [5, 15, 18, 19, 20, 21, 22];
const BYE = -1;
const PTS_END = [600, 360, 180, 90, 45, 25];
const FMT_L = { stb: '2 set con super tie-break a 10', uno: 'Set unico a 6 game' };

const MALE = ['Marco', 'Luca', 'Andrea', 'Matteo', 'Alessandro', 'Davide', 'Simone', 'Federico', 'Lorenzo', 'Giorgio', 'Riccardo', 'Stefano', 'Paolo', 'Francesco', 'Tommaso', 'Nicola', 'Gabriele', 'Emanuele', 'Filippo', 'Pietro', 'Alberto', 'Giacomo', 'Daniele', 'Michele', 'Enrico', 'Fabio', 'Claudio', 'Roberto', 'Massimo', 'Edoardo', 'Alessio', 'Mattia', 'Leonardo', 'Samuele', 'Diego'];
const FEMALE = ['Giulia', 'Sara', 'Chiara', 'Francesca', 'Martina', 'Elena', 'Alessia', 'Valentina', 'Federica', 'Silvia', 'Paola', 'Laura', 'Beatrice', 'Camilla', 'Irene', 'Marta', 'Anna', 'Elisa', 'Giorgia', 'Ilaria', 'Serena', 'Arianna', 'Veronica', 'Noemi', 'Alice', 'Roberta', 'Claudia', 'Barbara', 'Lucia', 'Monica', 'Aurora', 'Greta'];
const SURN = ['Rossi', 'Russo', 'Ferrari', 'Esposito', 'Romano', 'Colombo', 'Bruno', 'Greco', 'Marino', 'Gallo', 'Conti', 'De Luca', 'Mancini', 'Costa', 'Giordano', 'Rizzo', 'Lombardi', 'Moretti', 'Barbieri', 'Fontana', 'Santoro', 'Mariani', 'Rinaldi', 'Caruso', 'Ferri', 'Galli', 'Martini', 'Leone', 'Longo', 'Gentile', 'Martinelli', 'Vitale', 'Serra', 'Coppola', 'De Santis', "D'Angelo", 'Marchetti', 'Parisi', 'Villa', 'Conte', 'Ferraro', 'Fabbri', 'Bianco', 'Marini', 'Grasso', 'Valentini', 'Messina', 'Sala', 'De Angelis', 'Gatti', 'Pellegrini', 'Palumbo', 'Sanna', 'Farina', 'Rizzi', 'Monti', 'Cattaneo', 'Morelli', 'Amato', 'Silvestri', 'Mazza', 'Testa', 'Grassi', 'Carbone', 'Giuliani', 'Benedetti', 'Barone', 'Rossetti', 'Caputo', 'Montanari', 'Guerra', 'Palmieri', 'Bernardi', 'Fiore', 'De Rosa', 'Ferretti', 'Bellini', 'Basile', 'Riva', 'Donati', 'Piras', 'Vitali', 'Battaglia', 'Sartori', 'Neri', 'Milani', 'Pagano', 'Ruggiero', 'Orlando', 'Negri'];

const FRIENDLY = [
  { id: 0, club: 'Circolo Vetrate', court: 'Campo 2, coperto', dayS: 'Dom', dayN: 4, dayL: 'Domenica 4 ottobre', time: '10:30', dur: 90, lv: 3.5, price: '12,50', dist: '2,4 km', kind: 'Amichevole, conta per il livello', players: [{ f: 'Alessio', l: 'Villa', lv: 3.6, c: 0 }, { f: 'Paola', l: 'De Santis', lv: 3.4, c: 1 }, { f: 'Chiara', l: 'Neri', lv: 3.7, c: 2 }] },
  { id: 1, club: 'Padel Nord', court: "Campo 5, all'aperto", dayS: 'Mar', dayN: 6, dayL: 'Martedì 6 ottobre', time: '20:00', dur: 90, lv: 4.0, price: '11,00', dist: '5,1 km', kind: 'Amichevole', players: [{ f: 'Fabio', l: 'Testa', lv: 4.1, c: 3 }] },
  { id: 2, club: 'Padel Club Darsena', court: 'Campo 1, coperto', dayS: 'Gio', dayN: 8, dayL: 'Giovedì 8 ottobre', time: '19:00', dur: 60, lv: 3.0, price: '9,00', dist: '3,8 km', kind: 'Amichevole', players: [{ f: 'Elisa', l: 'Martini', lv: 3.0, c: 4 }, { f: 'Roberto', l: 'Bruno', lv: 3.2, c: 6 }] },
];

/* ================= state ================= */
const KEY = 'mpl-prototipo-v8';
const CAP = { M: 40, F: 24, X: 32 };
let S = null;
const memo = new Map();
const PL = id => S.players[id];
const catData = (tid, k) => S.data[tid][k];
const pairOf = (C, id) => C.pairs.find(p => p.id === id);

function buildPlayers() {
  const r = rngFor('players-v2');
  const P = [{ id: 0, f: 'Marco', l: 'Ricci', g: 'm', lv: 3.8 }, { id: 1, f: 'Luca', l: 'Bianchi', g: 'm', lv: 3.9 }];
  const used = new Set(['Marco Ricci', 'Luca Bianchi']);
  const add = (g, pool, count) => {
    let c = 0, guard = 0;
    while (c < count && guard++ < 9000) {
      const f = pool[Math.floor(r() * pool.length)], l = SURN[Math.floor(r() * SURN.length)], key = f + ' ' + l;
      if (used.has(key)) continue;
      used.add(key);
      P.push({ id: P.length, f, l, g, lv: Math.round((2.3 + (r() + r() + r()) / 3 * 2.9) * 10) / 10 });
      c++;
    }
  };
  add('m', MALE, 118);
  add('f', FEMALE, 100);
  return P;
}
const rkOf = pid => Math.round(PL(pid).lv * 420 + hashStr('rk' + pid) % 260);
function mkPair(C, a, b) { return { id: C.nextId++, p: [a, b], rk: rkOf(a) + rkOf(b), lv: Math.round((PL(a).lv + PL(b).lv) * 5) / 10 }; }

/* ================= scores ================= */
const skey = (a, b) => a < b ? a + '-' + b : b + '-' + a;
function getSc(C, a, b) { const v = C.sc[skey(a, b)]; if (!v) return null; return a < b ? v : v.map(s => [s[1], s[0]]); }
function setSc(C, a, b, sets) { const k = skey(a, b); if (!sets) { delete C.sc[k]; return; } C.sc[k] = a < b ? sets : sets.map(s => [s[1], s[0]]); }
function getLive(C, a, b) { if (!C.live) return null; const v = C.live[skey(a, b)]; if (!v) return null; return a < b ? v : v.map(s => [s[1], s[0]]); }
function setLive(C, a, b, sets) { C.live = C.live || {}; const k = skey(a, b); if (!sets) { delete C.live[k]; return; } C.live[k] = a < b ? sets : sets.map(s => [s[1], s[0]]); }
function isComplete(sets, fmt) {
  if (!sets || !sets.length) return false;
  if (fmt === 'uno') return sets.length >= 1;
  if (sets.length >= 3) return true;
  return sets.length === 2 && (sets[0][0] > sets[0][1]) === (sets[1][0] > sets[1][1]);
}
function tally(sets, fmt) {
  let sa = 0, sb = 0, ga = 0, gb = 0;
  sets.forEach((s, i) => {
    if (s[0] > s[1]) sa++; else sb++;
    if (fmt === 'stb' && i === 2) { if (s[0] > s[1]) ga++; else gb++; } else { ga += s[0]; gb += s[1]; }
  });
  return { sa, sb, ga, gb, aWin: sa > sb };
}
const validSet = (a, b) => { const w = Math.max(a, b), l = Math.min(a, b); return (w === 6 && l <= 4) || (w === 7 && (l === 5 || l === 6)); };
const validSTB = (a, b) => { const w = Math.max(a, b), l = Math.min(a, b); return w >= 10 && w - l >= 2 && (w === 10 || w - l === 2); };
function randSet(r) { const l = pickW([0, 1, 2, 3, 4, 5, 6], [2, 5, 9, 11, 10, 6, 5], r); return l <= 4 ? [6, l] : l === 5 ? [7, 5] : [7, 6]; }
function simMatch(pa, pb, fmt, r) {
  const aWins = r() < 1 / (1 + Math.exp(-(pa.lv - pb.lv) * 1.7));
  let sets;
  if (fmt === 'uno') sets = [randSet(r)];
  else if (r() < 0.3) {
    const s1 = randSet(r), s2 = randSet(r), l = Math.floor(r() * 9);
    sets = r() < 0.5 ? [s1, [s2[1], s2[0]], [10, l]] : [[s1[1], s1[0]], s2, [10, l]];
  } else sets = [randSet(r), randSet(r)];
  return aWins ? sets : sets.map(s => [s[1], s[0]]);
}

/* ================= groups ================= */
function nBounds(count) { return [Math.max(1, Math.ceil(count / 6)), Math.max(1, Math.floor(count / 3))]; }
function defaultCfg(count) { const [lo, hi] = nBounds(count); return { n: Math.min(hi, Math.max(lo, Math.round(count / 4))), q: 2, method: 'random', fmt: 'stb', seed: 0 }; }
function makeGroups(C, cfg) {
  const n = cfg.n, r = rngFor(`draw-${cfg.seed}-${cfg.method}-${C.tid}-${C.k}-${C.pairs.length}`);
  const sorted = [...C.pairs].sort((a, b) => b.rk - a.rk || a.id - b.id);
  const G = Array.from({ length: n }, () => []);
  if (cfg.method === 'snake') sorted.forEach((p, i) => { const row = Math.floor(i / n), col = i % n; G[row % 2 ? n - 1 - col : col].push(p.id); });
  else if (cfg.method === 'seeded') { sorted.slice(0, n).forEach((p, i) => G[i].push(p.id)); shuffle(sorted.slice(n), r).forEach((p, i) => G[i % n].push(p.id)); }
  else shuffle(sorted.slice(), r).forEach((p, i) => G[i % n].push(p.id));
  return G;
}
function rrRounds(ids) {
  const arr = [...ids]; if (arr.length % 2) arr.push(null);
  const n = arr.length, rounds = [];
  for (let r = 0; r < n - 1; r++) {
    const ms = [];
    for (let i = 0; i < n / 2; i++) { const a = arr[i], b = arr[n - 1 - i]; if (a != null && b != null) ms.push([a, b]); }
    rounds.push(ms);
    arr.splice(1, 0, arr.pop());
  }
  return rounds;
}
function scheduleOf(t, C) {
  const key = `sch${t.id}${C.k}`;
  if (memo.has(key)) return memo.get(key);
  const cat = CAT(C.k), rounds = C.groups.map(g => rrRounds(g));
  const maxR = Math.max(0, ...rounds.map(x => x.length)), list = [];
  for (let r = 0; r < maxR; r++) C.groups.forEach((g, gi) => (rounds[gi][r] || []).forEach(([a, b]) => list.push({ a, b, g: gi, r })));
  list.forEach((m, k) => {
    const slot = Math.floor(k / cat.courts.length);
    m.at = new Date(t.start.getFullYear(), t.start.getMonth(), t.start.getDate(), 9 + slot, 0);
    m.court = cat.courts[k % cat.courts.length];
  });
  memo.set(key, list);
  return list;
}
function h2h(C, a, b) { const s = getSc(C, a, b); if (!s) return 0; return tally(s, C.cfg.fmt).aWin ? -1 : 1; }
function standings(C, gi) {
  const key = `st${C.tid}${C.k}${gi}`;
  if (memo.has(key)) return memo.get(key);
  const ids = C.groups[gi], fmt = C.cfg.fmt, row = {};
  ids.forEach(id => { row[id] = { id, g: 0, v: 0, p: 0, sw: 0, sl: 0, gw: 0, gl: 0, pt: 0 }; });
  rrRounds(ids).flat().forEach(([a, b]) => {
    const s = getSc(C, a, b); if (!s) return;
    const t = tally(s, fmt), A = row[a], B = row[b];
    A.g++; B.g++; A.sw += t.sa; A.sl += t.sb; B.sw += t.sb; B.sl += t.sa; A.gw += t.ga; A.gl += t.gb; B.gw += t.gb; B.gl += t.ga;
    if (t.aWin) { A.v++; B.p++; A.pt += 3; } else { B.v++; A.p++; B.pt += 3; }
  });
  const rows = Object.values(row).sort((x, y) => y.pt - x.pt || (y.sw - y.sl) - (x.sw - x.sl) || (y.gw - y.gl) - (x.gw - x.gl) || h2h(C, x.id, y.id) || pairOf(C, y.id).rk - pairOf(C, x.id).rk);
  memo.set(key, rows);
  return rows;
}
function catProgress(C) {
  let played = 0, total = 0;
  if (C.groups) C.groups.forEach(g => rrRounds(g).flat().forEach(([a, b]) => { total++; if (getSc(C, a, b)) played++; }));
  return { played, total };
}

/* ================= brackets ================= */
function seedOrder(n) { let a = [1]; while (a.length < n) { const m = a.length * 2; a = a.flatMap(x => [x, m + 1 - x]); } return a; }
function qualifiersOf(C) {
  const q = C.cfg.q, byPos = [];
  C.groups.forEach((g, gi) => standings(C, gi).slice(0, q).forEach((row, pos) => { (byPos[pos] = byPos[pos] || []).push({ id: row.id, gi, pos, row }); }));
  const per = (x, f) => x.row.g ? f(x.row) / x.row.g : 0;
  const cmp = (x, y) => per(y, r => r.pt) - per(x, r => r.pt) || per(y, r => r.sw - r.sl) - per(x, r => r.sw - r.sl) || per(y, r => r.gw - r.gl) - per(x, r => r.gw - r.gl) || x.gi - y.gi;
  return byPos.flatMap(list => list.sort(cmp));
}
function buildBracket(C) {
  const Q = qualifiersOf(C);
  if (Q.length < 2) return null;
  let size = 2; while (size < Q.length) size *= 2;
  const slots = seedOrder(size).map(s => s <= Q.length ? Q[s - 1].id : BYE);
  const grp = {}, tags = {};
  Q.forEach(x => { grp[x.id] = x.gi; tags[x.id] = (x.pos + 1) + LETTERS[x.gi]; });
  const g = id => id === BYE ? -1 : grp[id];
  for (let i = 0; i < slots.length; i += 2) {
    if (slots[i] === BYE || slots[i + 1] === BYE || g(slots[i]) !== g(slots[i + 1])) continue;
    for (let j = 0; j < slots.length; j += 2) {
      if (j === i || slots[j + 1] === BYE || slots[j] === BYE) continue;
      if (g(slots[j + 1]) !== g(slots[i]) && g(slots[i + 1]) !== g(slots[j])) { [slots[i + 1], slots[j + 1]] = [slots[j + 1], slots[i + 1]]; break; }
    }
  }
  return { slots, tags, sc: {} };
}
function bracketRounds(C) {
  const B = C.br; if (!B) return null;
  const rounds = []; let cur = B.slots.slice(), r = 0;
  while (cur.length >= 2) {
    const ms = [];
    for (let i = 0; i < cur.length; i += 2) {
      const a = cur[i], b = cur[i + 1], m = { r, i: i / 2, a, b, sets: null, w: null };
      if (a === BYE && b === BYE) m.w = BYE;
      else if (a === BYE) m.w = b;
      else if (b === BYE) m.w = a;
      else if (a != null && b != null) {
        const s = B.sc[r + '-' + (i / 2)];
        if (s && s.a === a && s.b === b) { m.sets = s.sets; m.w = tally(s.sets, C.cfg.fmt).aWin ? a : b; }
      }
      ms.push(m);
    }
    rounds.push(ms);
    cur = ms.map(m => m.w);
    r++;
  }
  return rounds;
}
function cleanBracket(C) {
  const R = bracketRounds(C); if (!R) return;
  const ok = new Set();
  R.forEach(ms => ms.forEach(m => { const k = m.r + '-' + m.i, s = C.br.sc[k]; if (s && s.a === m.a && s.b === m.b) ok.add(k); }));
  Object.keys(C.br.sc).forEach(k => { if (!ok.has(k)) delete C.br.sc[k]; });
}
function roundName(L, r) { return ['Finale', 'Semifinali', 'Quarti', 'Ottavi', 'Sedicesimi', 'Trentaduesimi'][L - 1 - r] || `Turno ${r + 1}`; }
const champOf = C => { const R = bracketRounds(C); if (!R) return null; const w = R[R.length - 1][0].w; return w == null || w === BYE ? null : w; };
function simBracket(C, r) {
  let R = bracketRounds(C);
  for (let ri = 0; ri < R.length; ri++) {
    R[ri].forEach(m => { if (m.a != null && m.b != null && m.a !== BYE && m.b !== BYE && !m.sets) C.br.sc[ri + '-' + m.i] = { a: m.a, b: m.b, sets: simMatch(pairOf(C, m.a), pairOf(C, m.b), C.cfg.fmt, r) }; });
    R = bracketRounds(C);
  }
}
function catResults(C) {
  const res = {};
  C.pairs.forEach(p => { res[p.id] = { pts: 20, label: 'Fase a gironi' }; });
  const R = bracketRounds(C); if (!R) return res;
  const L = R.length;
  R.forEach((ms, r) => ms.forEach(m => {
    if (m.w == null || m.w === BYE) return;
    [m.a, m.b].forEach(id => { if (id != null && id !== BYE && id !== m.w) res[id] = { pts: PTS_END[L - 1 - r] || 20, label: L - 1 - r === 0 ? 'Finale persa' : roundName(L, r) }; });
  }));
  const ch = champOf(C); if (ch != null) res[ch] = { pts: 1000, label: 'Vincitori' };
  return res;
}

/* ================= generation ================= */
function drawPairs(C, method, seed) {
  const r = rngFor(`pairs-${C.tid}-${C.k}-${method}-${seed}`);
  const byLv = ids => ids.slice().sort((a, b) => PL(b).lv - PL(a).lv || a - b);
  const pairs = [], reserve = [];
  if (C.k === 'X') {
    const men = C.players.filter(id => PL(id).g === 'm'), women = C.players.filter(id => PL(id).g !== 'm');
    const n = Math.min(men.length, women.length);
    reserve.push(...men.slice(n), ...women.slice(n));
    const M = men.slice(0, n), W = women.slice(0, n);
    if (method === 'level') {
      const ms = byLv(M), ws = byLv(W), h = Math.ceil(n / 2), fl = Math.floor(n / 2);
      const mTop = shuffle(ms.slice(0, h), r), mBot = shuffle(ms.slice(h), r), wTop = shuffle(ws.slice(0, fl), r), wBot = shuffle(ws.slice(fl), r);
      mTop.forEach((m, i) => pairs.push([m, wBot[i]])); mBot.forEach((m, i) => pairs.push([m, wTop[i]]));
    } else { const a = shuffle(M.slice(), r), b = shuffle(W.slice(), r); a.forEach((m, i) => pairs.push([m, b[i]])); }
  } else {
    let ids = C.players.slice();
    if (ids.length % 2) reserve.push(ids.pop());
    if (method === 'level') {
      const s = byLv(ids), h = s.length / 2, top = shuffle(s.slice(0, h), r), bot = shuffle(s.slice(h), r);
      top.forEach((a, i) => pairs.push([a, bot[i]]));
    } else { ids = shuffle(ids, r); for (let i = 0; i < ids.length; i += 2) pairs.push([ids[i], ids[i + 1]]); }
  }
  return { pairs, reserve };
}
function genCat(t, cat) {
  const st = tStatus(t), r = rngFor(`t${t.id}-${cat.k}`);
  const C = { tid: t.id, k: cat.k, players: [], pairs: [], reserve: [], drawn: false, nextId: 1, groups: null, sc: {}, cfg: null, br: null };
  if (st === 'soon') return C;
  const range = { M: [24, 40], F: [12, 20], X: [16, 28] }[cat.k];
  let count = t.city === 'Milano' ? { M: 32, F: 16, X: 24 }[cat.k] : range[0] + 2 * Math.floor(r() * ((range[1] - range[0]) / 2 + 1));
  if (st === 'open') count = Math.max(5, Math.round(count * (0.5 + r() * 0.25)));
  const males = shuffle(S.players.filter(p => p.g === 'm' && p.id > 1).map(p => p.id), r);
  const females = shuffle(S.players.filter(p => p.g === 'f').map(p => p.id), r);
  if (cat.k === 'M' && MARCO_TAPPE.includes(t.id)) C.players.push(0, 1);
  let mi = 0, fi = 0;
  while (C.players.length < count) {
    if (cat.k === 'M') C.players.push(males[mi++]);
    else if (cat.k === 'F') C.players.push(females[fi++]);
    else C.players.push(C.players.length % 2 ? females[fi++] : males[mi++]);
  }
  if (st === 'done' || st === 'live') {
    const d = drawPairs(C, 'level', 0);
    C.pairs = d.pairs.map(([a, b]) => mkPair(C, a, b)); C.reserve = d.reserve; C.drawn = true;
    C.cfg = defaultCfg(C.pairs.length);
    C.groups = makeGroups(C, C.cfg);
    scheduleOf(t, C).forEach(m => {
      if (st !== 'done' && m.at >= NOW) return;
      const sets = simMatch(pairOf(C, m.a), pairOf(C, m.b), C.cfg.fmt, r);
      if (st === 'done' || m.at.getTime() + 36e5 <= NOW.getTime()) setSc(C, m.a, m.b, sets); else setLive(C, m.a, m.b, sets.slice(0, 1));
    });
    if (st === 'done') { C.br = buildBracket(C); if (C.br) simBracket(C, r); }
  }
  return C;
}
function freshState() {
  memo.clear();
  S = {
    v: 8, players: null, data: {}, me: 0, session: false, org: false, follow: [21], joined: {},
    notif: { rem: true, gir: true, res: true, vis: true, tdn: true, codes: true },
    rules: { mini: true, biz: true, car: true, approval: 'auto', td: true, insurance: true, insurer: '' },
    users: { 0: { role: 'player', email: 'marco.ricci@esempio.it', code: 'MPLMI7K2Q', dealer: 'Concessionaria Milano Nord', hand: 'dx', side: 'riv', lvl: 3.8, shirt: 'L', fitp: { has: true, num: '4471205' }, lic: { num: 'MI8841207R', exp: '09/2029', photo: false }, consents: { terms: true, photo: true, news: false, dealer: true, partners: false, screen: true }, lvlCard: { lvl: 'inter', since: '3+', freq: '1-2', tour: 'some' }, prof: { mini: false, plate: '', biz: true, company: 'Ricci Consulting srl', vat: '04512870967', role: 'Titolare', size: '2–9', car: 'Audi', change: '12m' } } },
    regs: [{ uid: 0, tid: 22, k: 'M', status: 'ok', shirt: 'L', cert: 'venue', fitp: { has: true, num: '4471205' } }],
    codes: CODES0.map(c => ({ code: c.code, dealer: c.dealer, city: c.city, used: 0, max: 0, on: c.on })), visits: [], tds: [], tdSeq: 1, offers: [], demo: { player: 0 },
  };
  S.players = buildPlayers();
  TAPPE.forEach(t => { S.data[t.id] = {}; CATS.forEach(c => { S.data[t.id][c.k] = genCat(t, c); }); });
  const account = (f, l, u) => { const id = S.players.length; S.players.push({ id, f, l, g: 'x', lv: 0 }); S.users[id] = u; return id; };
  S.demo.visitor = account('Laura', 'Fontanesi', { role: 'visitor', email: 'laura.fontanesi@esempio.it', phone: '333 1234567', lic: { num: 'MI5521873K', exp: '06/2031', photo: true }, consents: { terms: true, dealer: true, partners: true, photo: false, news: false } });
  S.demo.staff = account('Alessia', 'Pace', { role: 'staff', email: 'staff@esempio.it', org: 'Lobiz agency', consents: { terms: true, news: true } });
  seedPublic();
  const inCircuit = new Set(), used = {};
  TAPPE.forEach(t => { if (tStatus(t) !== 'soon') CATS.forEach(c => catData(t.id, c.k).players.forEach(x => inCircuit.add(x))); });
  inCircuit.forEach(x => { const d = profOf(x).dealer; if (d) used[d] = (used[d] || 0) + 1; });
  S.codes.forEach((c, i) => { c.used = used[c.dealer] || 0; c.max = c.used + CODES0[i].room; });
}
function loadState() {
  try {
    const raw = localStorage.getItem(KEY);
    if (raw) { const s = JSON.parse(raw); if (s && s.v === 8 && s.data && s.players && s.users && s.rules && s.codes && s.visits && s.tds && s.demo) { S = s; if (!S.offers) S.offers = []; memo.clear(); return true; } }
  } catch (e) { /* storage unavailable */ }
  return false;
}
function save() { memo.clear(); try { localStorage.setItem(KEY, JSON.stringify(S)); } catch (e) { /* storage unavailable */ } }

/* ================= derived views ================= */
const liveTappa = () => TAPPE.find(t => tStatus(t) === 'live');
const surn = pid => PL(pid).l;
const pairLabel = (C, id) => { const p = pairOf(C, id); return p ? `${surn(p.p[0])} / ${surn(p.p[1])}` : ''; };
const pairFull = (C, id) => { const p = pairOf(C, id); return p ? p.p.map(x => `${PL(x).f} ${PL(x).l}`).join(' e ') : ''; };
const isMe = (C, id) => { const p = pairOf(C, id); return !!p && p.p.includes(S.me); };
function myEntries(t) { const out = []; CATS.forEach(c => { const C = catData(t.id, c.k), p = C.pairs.find(x => x.p.includes(S.me)); if (p) out.push({ C, c, p }); }); return out; }
function myGroupInfo(t) {
  const e = myEntries(t)[0]; if (!e) return null;
  if (!e.C.groups) return e;
  const gi = e.C.groups.findIndex(g => g.includes(e.p.id)); if (gi < 0) return e;
  const st = standings(e.C, gi), pos = st.findIndex(x => x.id === e.p.id) + 1;
  const next = scheduleOf(t, e.C).filter(m => m.g === gi && (m.a === e.p.id || m.b === e.p.id) && !getSc(e.C, m.a, m.b)).sort((x, y) => x.at - y.at)[0] || null;
  return Object.assign({}, e, { gi, pos, next });
}
function tappaTotals(t) {
  let players = 0, pairs = 0, groups = 0, played = 0, total = 0, brs = 0;
  CATS.forEach(c => { const C = catData(t.id, c.k), p = catProgress(C); players += C.players.length; pairs += C.pairs.length; groups += C.groups ? C.groups.length : 0; played += p.played; total += p.total; if (C.br) brs++; });
  return { players, pairs, groups, played, total, brs };
}
function circuitRanking(k) {
  const key = 'rk' + k;
  if (memo.has(key)) return memo.get(key);
  const pts = {};
  TAPPE.forEach(t => {
    if (tStatus(t) !== 'done') return;
    const C = catData(t.id, k); if (!C.br) return;
    const res = catResults(C);
    C.pairs.forEach(p => p.p.forEach(pid => { const e = pts[pid] || (pts[pid] = { pid, pts: 0, n: 0 }); e.pts += res[p.id].pts; e.n++; }));
  });
  const list = Object.values(pts).sort((a, b) => b.pts - a.pts || a.pid - b.pid);
  memo.set(key, list);
  return list;
}
function myHistory() {
  const out = [];
  TAPPE.forEach(t => CATS.forEach(c => {
    const C = catData(t.id, c.k), p = C.pairs.find(x => x.p.includes(S.me)); if (!p) return;
    let played = 0, won = 0;
    if (C.groups) C.groups.forEach(g => { if (!g.includes(p.id)) return; g.forEach(o => { if (o === p.id) return; const s = getSc(C, p.id, o); if (s) { played++; if (tally(s, C.cfg.fmt).aWin) won++; } }); });
    const R = bracketRounds(C);
    if (R) R.forEach(ms => ms.forEach(m => { if (m.sets && (m.a === p.id || m.b === p.id)) { played++; if (m.w === p.id) won++; } }));
    out.push({ t, c, C, p, played, won, st: tStatus(t) });
  }));
  return out;
}
function playerIndex() {
  if (memo.has('pidx')) return memo.get('pidx');
  const idx = {};
  [...TAPPE].reverse().forEach(t => { if (tStatus(t) === 'soon' || !canSee(t.id)) return; CATS.forEach(c => catData(t.id, c.k).players.forEach(pid => { if (!idx[pid]) idx[pid] = { tid: t.id, k: c.k }; })); });
  memo.set('pidx', idx);
  return idx;
}

/* ================= privacy & registrations ================= */
const ME = () => PL(S.me);
const USER = () => S.users[S.me];
const regOf = (tid, k) => S.regs.find(r => r.uid === S.me && r.tid === tid && (k == null || r.k === k));
function canSee(tid) { return S.org || CATS.some(c => catData(tid, c.k).players.includes(S.me)); }
function visiblePlayers() {
  if (memo.has('vis')) return memo.get('vis');
  const set = new Set();
  TAPPE.forEach(t => { if (!canSee(t.id)) return; CATS.forEach(c => catData(t.id, c.k).players.forEach(x => set.add(x))); });
  memo.set('vis', set);
  return set;
}
function myRegs() {
  const out = [];
  TAPPE.forEach(t => {
    const st = tStatus(t); if (st !== 'open' && st !== 'live') return;
    CATS.forEach(c => {
      const C = catData(t.id, c.k), inP = C.players.includes(S.me), r = regOf(t.id, c.k);
      let status;
      if (inP) status = 'ok'; else if (r && (r.status === 'review' || r.status === 'no')) status = r.status; else return;
      const p = C.pairs.find(x => x.p.includes(S.me));
      out.push({ t, c, C, p, r, status, partner: p ? PL(p.p.find(x => x !== S.me)) : null, reserve: inP && C.drawn && !p });
    });
  });
  return out;
}

const PT = id => PARTNERS.find(p => p.id === id);

/* ================= roles, entry codes, visitors and test drives ================= */
function titleCase(s) { return String(s).split(/\s+/).filter(Boolean).map(w => w.charAt(0).toUpperCase() + w.slice(1).toLowerCase()).join(' '); }
const plateOk = s => /^[A-Z]{2}\d{3}[A-Z]{2}$/.test(s || '');
function vatOk(v) {
  if (!/^\d{11}$/.test(v || '')) return false;
  let s = 0;
  for (let i = 0; i < 10; i++) { let d = +v[i]; if (i % 2) { d *= 2; if (d > 9) d -= 9; } s += d; }
  return (10 - s % 10) % 10 === +v[10];
}
const ROLE_L = { player: 'Giocatore', visitor: 'Visitatore', staff: 'Staff' };
const role = () => (S && S.session && S.users[S.me] && S.users[S.me].role) || 'player';
const isVis = () => !!(S && S.session) && role() === 'visitor';
const manual = () => S.rules.approval === 'manual';
const pendingFor = (tid, k) => S.regs.filter(r => r.tid === tid && (k == null || r.k === k) && r.status === 'review');
const CARS = ['MINI', 'BMW', 'Audi', 'Mercedes-Benz', 'Volkswagen', 'Fiat', 'Toyota', 'Altra marca', "Non ho un'auto"];
const CHANGE_L = { '6m': 'Entro 6 mesi', '12m': 'Entro un anno', later: 'Più avanti', dk: 'Non lo so' };

/* entry codes: every MINI dealer invites its own players */
const CITY2 = { Roma: 'RM', Napoli: 'NA', Firenze: 'FI', Bologna: 'BO', Torino: 'TO', Bari: 'BA', Verona: 'VR', Genova: 'GE', Palermo: 'PA', Cagliari: 'CA', Rimini: 'RN', Pescara: 'PE', Lecce: 'LE', Catania: 'CT', Como: 'CO', Venezia: 'VE', Padova: 'PD', Brescia: 'BS', Bergamo: 'BG', Parma: 'PR', Milano: 'MI', Trieste: 'TS', Modena: 'MO', Perugia: 'PG', Ancona: 'AN', Pisa: 'PI', Salerno: 'SA' };
const CODES0 = [
  { code: 'MPLMI7K2Q', dealer: 'Concessionaria Milano Nord', city: 'Milano', w: 31, room: 9, on: true },
  { code: 'MPLRM4XT8', dealer: 'Concessionaria Roma Est', city: 'Roma', w: 22, room: 12, on: true },
  { code: 'MPLTO9QW3', dealer: 'Concessionaria Torino Centro', city: 'Torino', w: 18, room: 10, on: true },
  { code: 'MPLTS2HZ6', dealer: 'Concessionaria Trieste', city: 'Trieste', w: 11, room: 15, on: true },
  { code: 'MPLBO8RC1', dealer: 'Concessionaria Bologna', city: 'Bologna', w: 14, room: 10, on: true },
  { code: 'MPLFI3PV7', dealer: 'Concessionaria Firenze', city: 'Firenze', w: 12, room: 12, on: true },
  { code: 'MPLNA5LM4', dealer: 'Concessionaria Napoli Sud', city: 'Napoli', w: 9, room: 15, on: true },
  { code: 'MPLMO6DY5', dealer: 'Concessionaria Modena', city: 'Modena', w: 20, room: 0, on: true },
];
const normCode = s => String(s || '').toUpperCase().replace(/[^A-Z0-9]/g, '');
const fmtCode = s => { const n = normCode(s); return n.length > 5 ? `${n.slice(0, 3)}-${n.slice(3, 5)}-${n.slice(5)}` : n.length > 3 ? `${n.slice(0, 3)}-${n.slice(3)}` : n; };
const findCode = s => S.codes.find(c => c.code === normCode(s));
function codeCheck(raw) {
  const n = normCode(raw);
  if (!n) return { err: 'Inserisci il codice di ingresso che ti ha dato la concessionaria.' };
  const c = findCode(n);
  if (!c) return { err: n.length < 9 ? 'Il codice è incompleto: ha 9 caratteri, come MPL-MI-7K2Q.' : "Codice non valido: controlla di averlo scritto come nell'invito." };
  if (!c.on) return { err: 'Questo codice non è più attivo: chiedi alla concessionaria un nuovo invito.' };
  if (c.used >= c.max) return { err: `Gli inviti di ${c.dealer} sono finiti: chiedi alla concessionaria un nuovo codice.` };
  return { c };
}
function newCode(city) {
  const pre = 'MPL' + (CITY2[city] || 'IT'), ch = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
  let c;
  do { c = pre + Array.from({ length: 4 }, () => ch[Math.floor(Math.random() * ch.length)]).join(''); } while (S.codes.some(x => x.code === c));
  return c;
}

/* visitors and test drives */
const myVisit = tid => S.visits.find(v => v.uid === S.me && v.tid === tid);
const myTd = tid => S.tds.find(x => x.uid === S.me && x.tid === tid);
const TD_MODELS = ['MINI Cooper', 'MINI Aceman', 'MINI Countryman', 'Non so ancora'];
const TD_SLOTS = { matt: 'Mattina, 10–13', pranzo: 'Pranzo, 13–15', pom: 'Pomeriggio, 15–18', free: 'Quando non gioco' };
const TD_SLOT_S = { matt: 'in mattinata', pranzo: 'in pausa pranzo', pom: 'nel pomeriggio', free: 'quando non giochi' };
const TD_TIMES = { matt: ['10:00', '10:30', '11:00', '11:30', '12:00', '12:30'], pranzo: ['13:00', '13:30', '14:00', '14:30'], pom: ['15:00', '15:30', '16:00', '16:30', '17:00', '17:30'] };
TD_TIMES.free = [...TD_TIMES.matt, ...TD_TIMES.pranzo, ...TD_TIMES.pom];
const TD_CARS = 2;
const tdModel = x => x.model === 'Non so ancora' ? 'Modello da scegliere' : x.model;
const ARRIVE_L = { matt: 'In mattinata', pom: 'Nel pomeriggio', tutto: 'Tutto il giorno' };
const guestsL = n => n ? `+${n} ${n === 1 ? 'ospite' : 'ospiti'}` : 'Nessun ospite';
const licNumOk = s => /^[A-Z0-9]{8,12}$/.test(s || '');
function licExpOk(s, t) {
  const m = /^(\d{2})\/(\d{4})$/.exec(s || ''); if (!m) return false;
  const mo = +m[1], y = +m[2];
  if (mo < 1 || mo > 12 || y > 2046) return false;
  return new Date(y, mo, 0) >= t.start;
}
const maskLic = s => s ? '••••' + s.slice(-4) : '';
const fitpNumOk = s => /^[A-Z0-9]{5,12}$/.test(s || '');
function fitpOf(pid) { const u = S.users[pid]; if (u && u.fitp) return u.fitp; return { has: hashStr('fitp' + pid) % 100 < 88, num: '' }; }
function profSummary(pr) {
  if (!pr) return [];
  const out = [];
  if (pr.mini) out.push(pr.plate ? `MINI, targa ${pr.plate}` : 'Ha una MINI');
  if (pr.biz) out.push([pr.company || 'Imprenditore o libero professionista', pr.vat ? `P.IVA ${pr.vat}` : ''].filter(Boolean).join(', '));
  if (pr.car && !pr.mini) out.push(pr.car === "Non ho un'auto" ? "Non ha un'auto" : `Auto ${pr.car}${pr.change && pr.change !== 'dk' ? `, da cambiare ${CHANGE_L[pr.change].toLowerCase()}` : ''}`);
  return out;
}
function profOf(pid) {
  const u = S.users[pid];
  if (u && u.role === 'player') { const pr = u.prof || {}; return { answered: !!(pr.mini || pr.biz || pr.car), mini: !!pr.mini, biz: !!pr.biz, car: pr.car || '', change: pr.change || '', contact: !!(u.consents && u.consents.dealer), td: S.tds.some(x => x.uid === pid), ins: S.regs.some(r => r.uid === pid && r.ins === 'yes'), dealer: u.dealer || '' }; }
  const key = 'pf' + pid; if (memo.has(key)) return memo.get(key);
  const r = rngFor('prof-' + pid), answered = r() < 0.72, mini = answered && r() < 0.26, biz = answered && r() < 0.55;
  const car = answered ? (mini ? 'MINI' : CARS[1 + Math.floor(r() * 7)]) : '';
  const p = { answered, mini, biz, car, change: answered && !mini ? pickW(['6m', '12m', 'later', 'dk'], [2, 3, 3, 2], r) : '', contact: r() < 0.58, td: r() < (mini ? 0.2 : 0.42), ins: r() < 0.61, dealer: pickW(CODES0.map(c => c.dealer), CODES0.map(c => c.w), r) };
  memo.set(key, p); return p;
}
function seedPublic() {
  const r = rngFor('public-v8'), used = new Set(S.players.map(p => p.f + ' ' + p.l));
  const visitor = () => {
    for (let g = 0; g < 500; g++) {
      const pool = r() < 0.5 ? FEMALE : MALE, f = pool[Math.floor(r() * pool.length)], l = SURN[Math.floor(r() * SURN.length)];
      if (used.has(f + ' ' + l)) continue;
      used.add(f + ' ' + l);
      const id = S.players.length; S.players.push({ id, f, l, g: 'x', lv: 0, vis: true }); return id;
    }
    return null;
  };
  const lic = city => `${CITY2[city]}${1000000 + Math.floor(r() * 9000000)}${'ABCDEFGHJKLMNPRSTUVZ'[Math.floor(r() * 20)]}`;
  const exp = () => `${String(1 + Math.floor(r() * 12)).padStart(2, '0')}/${2027 + Math.floor(r() * 9)}`;
  const td = (uid, tid, model, slot, status, time) => S.tds.push({ id: S.tdSeq++, uid, tid, model, slot, status, time: time || null, lic: { num: lic(T(tid).city), exp: exp(), photo: r() < 0.5 }, phone: r() < 0.6 ? `3${30 + Math.floor(r() * 60)} ${1000000 + Math.floor(r() * 9000000)}` : '' });
  const V = { 21: [], 22: [] };
  [[21, 16], [22, 7]].forEach(([tid, n]) => { for (let i = 0; i < n; i++) { const uid = visitor(); V[tid].push(uid); S.visits.push({ uid, tid, arrive: pickW(['matt', 'pom', 'tutto'], [3, 4, 3], r), guests: pickW([0, 1, 2, 3], [5, 3, 2, 1], r), pass: 'V-' + (10000 + Math.floor(r() * 90000)) }); } });
  const L = S.demo.visitor;
  S.visits.push({ uid: L, tid: 21, arrive: 'pom', guests: 1, pass: 'V-48213' }, { uid: L, tid: 22, arrive: 'tutto', guests: 0, pass: 'V-51907' });
  const mPl = catData(21, 'M').players.filter(x => x > 1), fPl = catData(21, 'F').players, xPl = catData(21, 'X').players;
  td(mPl[3], 21, 'MINI Countryman', 'free', 'ok', '10:30');
  td(V[21][0], 21, 'MINI Cooper', 'matt', 'ok', '11:30');
  td(V[21][2], 21, 'MINI Aceman', 'pranzo', 'ok', '13:30');
  S.tds.push({ id: S.tdSeq++, uid: L, tid: 21, model: 'MINI Aceman', slot: 'pom', status: 'ok', time: '15:30', lic: { num: 'MI5521873K', exp: '06/2031', photo: true }, phone: '333 1234567' });
  td(fPl[2], 21, 'MINI Cooper', 'free', 'ok', '16:00');
  td(V[21][5], 21, 'MINI Countryman', 'pom', 'pre');
  td(xPl[4], 21, 'Non so ancora', 'free', 'pre');
  td(V[21][9], 21, 'MINI Aceman', 'pom', 'pre');
  S.tds.push({ id: S.tdSeq++, uid: 0, tid: 22, model: 'MINI Countryman', slot: 'free', status: 'pre', time: null, lic: { num: 'MI8841207R', exp: '09/2029', photo: false }, phone: '' });
  td(V[22][1], 22, 'MINI Cooper', 'matt', 'pre');
  td(catData(22, 'F').players[1], 22, 'MINI Aceman', 'free', 'pre');
}
function leadStats() {
  if (memo.has('leads')) return memo.get('leads');
  const ids = new Set(), perT = [];
  let visTot = 0, visContact = 0, tdTot = 0;
  TAPPE.forEach(t => {
    const st = tStatus(t); if (st === 'soon') return;
    const set = new Set();
    CATS.forEach(c => catData(t.id, c.k).players.forEach(x => { ids.add(x); set.add(x); }));
    S.regs.forEach(r => { if (r.tid === t.id && r.status !== 'no') { ids.add(r.uid); set.add(r.uid); } });
    const vs = S.visits.filter(v => v.tid === t.id);
    let nv = vs.length, ntd = S.tds.filter(x => x.tid === t.id).length;
    let nvc = vs.filter(v => { const u = S.users[v.uid]; return u ? !!(u.consents && u.consents.dealer) : hashStr('vc' + v.uid) % 100 < 55; }).length;
    if (st === 'done') { nv = 18 + hashStr('vis' + t.id) % 22; nvc = Math.round(nv * 0.55); ntd = Math.round(set.size * 0.12 + nv * 0.3); }
    visTot += nv; visContact += nvc; tdTot += ntd;
    perT.push({ t, n: [...set].filter(x => { const p = profOf(x); return !p.mini && p.contact; }).length + nvc, td: ntd });
  });
  const L = [...ids].map(profOf), N = L.length, cnt = f => L.filter(f).length;
  const cars = L.filter(p => p.answered && !p.mini && p.car && p.car !== "Non ho un'auto"), dl = {};
  L.forEach(p => { if (p.dealer) dl[p.dealer] = (dl[p.dealer] || 0) + 1; });
  const out = { N, answered: cnt(p => p.answered), mini: cnt(p => p.mini), biz: cnt(p => p.biz), newContact: cnt(p => !p.mini && p.contact), visTot, visContact, tdTot, ins: cnt(p => p.ins), cars: cars.length, change: ['6m', '12m', 'later', 'dk'].map(k => [k, cars.filter(p => p.change === k).length]), dealers: Object.entries(dl).sort((a, b) => b[1] - a[1]), perT };
  memo.set('leads', out); return out;
}

/* ================= preparation level and insurance ================= */
const LV3 = { base: 'Base', inter: 'Intermedio', pro: 'Agonista' };
const LV3_NUM = { base: 2.6, inter: 3.7, pro: 5.0 };
const bandOf = lv => lv < 3.2 ? 'base' : lv < 4.6 ? 'inter' : 'pro';
const levelOf = pid => { const u = S.users[pid]; return u && u.lvlCard && u.lvlCard.lvl ? u.lvlCard.lvl : bandOf(PL(pid).lv); };
const insurerFrom = () => (S.rules.insurer || '').trim() ? `da ${S.rules.insurer.trim()}` : 'dalla compagnia partner del circuito';
const cfOk = s => /^[A-Z]{6}[0-9LMNPQRSTUV]{2}[A-Z][0-9LMNPQRSTUV]{2}[A-Z][0-9LMNPQRSTUV]{3}[A-Z]$/.test(s || '');
