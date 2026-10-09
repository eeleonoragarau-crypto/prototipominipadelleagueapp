/* ================= venue screen (modalità schermo) ================= */
const TV = { on: false, kiosk: false, view: 0, playing: true, timer: null, tick: null, flash: null, sfida: 0, updated: null, loaded: Date.now() };
const tvClock = () => new Date(NOW.getTime() + (Date.now() - TV.loaded));
const tvOk = pid => { const u = S.users[pid]; if (u) return !!(u.consents && u.consents.screen); return hashStr('scr' + pid) % 100 >= 8; };
const tvName = pid => { const p = PL(pid); return tvOk(pid) ? `${p.f} ${p.l}` : `${p.f[0]}. ${p.l[0]}.`; };
const tvSurn = pid => { const p = PL(pid); return tvOk(pid) ? p.l : `${p.f[0]}. ${p.l[0]}.`; };
const tvPair = (C, id) => { const p = pairOf(C, id); return p ? `${tvSurn(p.p[0])} / ${tvSurn(p.p[1])}` : ''; };
const TV_NAMES = { campi: 'Campi in diretta', sfida: 'La prossima sfida', prossime: 'Prossime partite', partner: 'Partner' };
function tvViews() {
  const t = liveTappa(); if (!t) return ['partner'];
  const cats = CATS.filter(c => catData(t.id, c.k).groups);
  const v = ['campi'];
  cats.forEach((c, i) => { v.push('class-' + c.k); if (i === 0) v.push('sfida'); if (i === 1) v.push('prossime'); });
  if (cats.length < 2) v.push('prossime');
  CATS.forEach(c => { if (catData(t.id, c.k).br) v.push('tab-' + c.k); });
  v.push('partner');
  return v;
}
const tvViewName = v => TV_NAMES[v] || (v.startsWith('class-') ? `Classifica ${CAT(v.slice(6)).l.toLowerCase()}` : `Tabellone ${CAT(v.slice(4)).l.toLowerCase()}`);
function tvUpcoming(t) {
  const list = [];
  CATS.forEach(c => { const C = catData(t.id, c.k); if (!C.groups) return; scheduleOf(t, C).forEach(m => { if (!getSc(C, m.a, m.b) && !getLive(C, m.a, m.b)) list.push({ c, C, m }); }); });
  return list.sort((a, b) => a.m.at - b.m.at || a.m.court - b.m.court);
}
function tvCourts(t) {
  const cards = [];
  CATS.forEach(c => {
    const C = catData(t.id, c.k); if (!C.groups) return;
    const sch = scheduleOf(t, C);
    c.courts.forEach(court => {
      const ms = sch.filter(m => m.court === court);
      let m = ms.find(x => getLive(C, x.a, x.b)), state = 'live';
      if (!m) { m = ms.find(x => !getSc(C, x.a, x.b)); state = 'next'; }
      if (!m) { m = ms[ms.length - 1]; state = 'done'; }
      if (m) cards.push({ court, c, C, m, state, fl: !!TV.flash && ms.some(x => skey(x.a, x.b) === TV.flash) });
    });
  });
  cards.sort((a, b) => a.court - b.court);
  return `<h2 class="tv-vt">Sui campi adesso<small>Risultati aggiornati a fine set</small></h2><div class="tv-courts">${cards.map(tvCourtCard).join('')}</div>`;
}
function tvCourtCard({ court, c, C, m, state, fl }) {
  const sets = state === 'live' ? getLive(C, m.a, m.b) : state === 'done' ? getSc(C, m.a, m.b) : null;
  const tl = state === 'done' && sets ? tally(sets, C.cfg.fmt) : null;
  const row = (id, side) => `<div class="tv-row${tl && (side === 0 ? tl.aWin : !tl.aWin) ? ' w' : ''}"><span class="nm">${esc(tvPair(C, id))}</span><span class="sc">${sets ? sets.map(s => `<span class="${s[side] > s[1 - side] ? 'w' : ''}">${s[side]}</span>`).join('') : ''}</span></div>`;
  const stb = C.cfg.fmt === 'stb' && sets && sets.length === 2 && (sets[0][0] > sets[0][1]) !== (sets[1][0] > sets[1][1]);
  const status = state === 'live' ? `<span class="tv-pill">In corso</span><span>${stb ? 'Super tie-break' : `Set ${sets.length + 1}`} in corso</span>` : state === 'next' ? `<span class="tv-pill next">Alle ${hm(m.at)}</span><span>Prossima partita</span>` : `<span class="tv-pill next">Finita</span><span>Gironi conclusi su questo campo</span>`;
  return `<div class="tv-court${state === 'live' ? ' live' : ''}${fl ? ' flash' : ''}"><div class="tv-ch"><b>Campo ${court}</b><span>${c.l}, girone ${LETTERS[m.g]}</span></div>${row(m.a, 0)}${row(m.b, 1)}<div class="tv-st">${status}</div></div>`;
}
function tvStandings(t, k) {
  const C = catData(t.id, k), cat = CAT(k), n = C.groups.length;
  return `<h2 class="tv-vt">Classifica gironi, ${cat.l.toLowerCase()}<small>${C.cfg.q === 1 ? 'Passa il turno la prima' : 'Passano il turno le prime 2'}</small></h2><div class="tv-groups" style="grid-template-columns:repeat(${n === 4 ? 2 : Math.min(n, 3)},minmax(0,1fr))">${C.groups.slice(0, 6).map((g, gi) => `<div class="tv-g"><h3>Girone ${LETTERS[gi]}</h3><table>${standings(C, gi).map((r, i) => `<tr class="${i < C.cfg.q ? 'q' : ''}"><td class="p">${i + 1}</td><td class="n"><span>${esc(tvPair(C, r.id))}</span></td><td class="r">${r.v}–${r.p}</td><td class="r pt">${r.pt}</td></tr>`).join('')}</table></div>`).join('')}</div>`;
}
function tvNext(t) {
  const rows = tvUpcoming(t).slice(0, 8);
  if (!rows.length) return `<h2 class="tv-vt">Prossime partite</h2><p class="tv-empty">I gironi sono finiti: tra poco si parte con il tabellone.</p>`;
  return `<h2 class="tv-vt">Prossime partite</h2><div class="tv-list">${rows.map(({ c, C, m }) => `<div class="tv-li"><span class="tm">${hm(m.at)}</span><span class="ct">Campo ${m.court}</span><span class="cg">${c.l}, girone ${LETTERS[m.g]}</span><span class="pa">${esc(tvPair(C, m.a))}</span><span class="vs">vs</span><span class="pb">${esc(tvPair(C, m.b))}</span></div>`).join('')}</div>`;
}
/* player photo placeholders: a backlit athlete cut-out, swapped for the real photo when there is one */
const SIL = {};
function silUri(g, flip, v, racket) {
  const key = [g, flip ? 1 : 0, v, racket ? 1 : 0].join('');
  if (SIL[key]) return SIL[key];
  const hair = g === 'f'
    ? (v ? '<path d="M100 152C96 104 128 82 156 84C192 86 206 118 202 156C194 130 174 118 150 118C126 118 108 132 100 152Z"/><path d="M188 110C226 116 238 170 220 230C214 194 204 162 189 142Z"/>'
      : '<path d="M100 150C98 104 130 84 156 86C190 88 204 118 200 150C192 128 172 120 150 120C128 120 110 130 100 150Z"/><circle cx="152" cy="80" r="20"/>')
    : (v ? '<path d="M102 146C100 104 132 90 156 92C188 94 202 116 198 150C190 126 172 118 150 120C128 120 110 130 102 146Z"/>'
      : '<path d="M101 150C97 112 118 92 148 90C176 88 200 104 200 136C200 144 198 150 197 154C190 134 176 126 150 126C126 126 110 134 101 150Z"/><path d="M118 104C126 92 140 86 152 88C140 92 132 98 126 108Z"/>');
  const rk = racket ? '<ellipse cx="240" cy="166" rx="36" ry="44" transform="rotate(28 240 166)"/><path d="M216 212L198 262L209 266L227 216Z"/>' : '';
  const body = `${rk}<path d="M130 196H170L178 258H122Z"/><ellipse cx="150" cy="150" rx="47" ry="55"/><ellipse cx="103" cy="158" rx="7" ry="12"/><ellipse cx="197" cy="158" rx="7" ry="12"/>${hair}<path d="M22 400C24 330 40 296 74 280C98 268 116 262 128 254H172C184 262 202 268 226 280C260 296 276 330 278 400Z"/>`;
  const holes = racket ? [[226, 150], [242, 146], [232, 166], [248, 162], [238, 182], [254, 178], [222, 170], [246, 196]].map(([x, y]) => `<circle cx="${x}" cy="${y}" r="3.2"/>`).join('') : '';
  const band = (g === 'f' ? v : !v) ? '<path d="M105 136C128 117 172 113 196 132" fill="none" stroke="#FFED00" stroke-width="7" stroke-linecap="round"/>' : '';
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 300 400"><defs><linearGradient id="g" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="#2b4183"/><stop offset="1" stop-color="#0a1430"/></linearGradient></defs><g${flip ? ' transform="translate(300 0) scale(-1 1)"' : ''}><g fill="#d6e4ff" opacity=".62" transform="translate(-4 -3)">${body}</g><g fill="url(#g)">${body}</g><g fill="#fff" opacity=".14">${holes}<rect x="178" y="306" width="30" height="12" rx="3"/></g><path d="M130 256L150 284L170 256M84 284C74 312 70 336 70 360M216 284C226 312 230 336 230 360" fill="none" stroke="#fff" stroke-opacity=".16" stroke-width="3" stroke-linecap="round"/>${band}</g></svg>`;
  return (SIL[key] = 'data:image/svg+xml;charset=utf-8,' + encodeURIComponent(svg));
}
/* placeholder photos: the same fictional person for the same player, never twice in one match */
function facesFor(pids) {
  const used = {}, out = {};
  pids.forEach(pid => {
    const g = PL(pid).g === 'f' ? 'f' : 'm', pool = FACES.filter(f => f.g === g);
    if (!pool.length) return;
    let i = hashStr('face' + pid) % pool.length, n = 0;
    while (used[g + i] && n++ < pool.length) i = (i + 1) % pool.length;
    used[g + i] = 1; out[pid] = pool[i].uri;
  });
  return out;
}
function bxCard(pid, team, face) {
  const p = PL(pid), u = S.users[pid], ok = tvOk(pid);
  const img = ok && u && u.photo ? `<div class="bx-photo"><img class="bx-img real" src="${u.photo}" alt=""></div>`
    : face ? `<div class="bx-photo"></div><img class="bx-cut${ok ? '' : ' anon'}" src="${face}" alt="">`
      : `<div class="bx-photo"><img class="bx-img" src="${silUri(p.g === 'f' ? 'f' : 'm', team === 'a', hashStr('sil' + pid) % 2, hashStr('rk' + pid) % 4 !== 0)}" alt=""></div>`;
  const last = ok ? p.l : `${p.f[0]}. ${p.l[0]}.`, fit = last.length > 9 ? ' xs' : last.length > 6 ? ' s' : '';
  return `<figure class="bx-card"><div class="bx-pic">${img}</div><figcaption class="bx-plate"><span class="bx-first">${ok ? esc(p.f) : '&nbsp;'}</span><b class="bx-last${fit}">${esc(last)}</b></figcaption><span class="bx-lv">${LV3[levelOf(pid)]}</span></figure>`;
}
function tvSfida(t) {
  const list = tvUpcoming(t);
  if (!list.length) return tvNext(t);
  const { c, C, m } = list[TV.sfida % Math.min(list.length, 6)];
  const st = standings(C, m.g), L = LETTERS[m.g], n = st.length;
  const side = id => { const row = st.find(r => r.id === id); return { p: pairOf(C, id), row, pos: st.indexOf(row) + 1 }; };
  const A = side(m.a), B = side(m.b);
  const stats = [['Posizione nel girone', `${A.pos}°`, `${B.pos}°`, n + 1 - A.pos, n + 1 - B.pos], ['Vittorie', `${A.row.v}/${A.row.g}`, `${B.row.v}/${B.row.g}`, A.row.v, B.row.v], ['Set vinti', A.row.sw, B.row.sw, A.row.sw, B.row.sw], ['Livello della coppia', dec(A.p.lv), dec(B.p.lv), A.p.lv, B.p.lv]];
  const row = ([l, da, db, va, vb]) => { const mx = Math.max(va, vb) || 1; return `<div class="bx-row"><b class="bx-va${va < vb ? ' lo' : ''}">${da}</b><span class="bx-bar a"><i style="width:${Math.round(va / mx * 100)}%"></i></span><span class="bx-l">${l}</span><span class="bx-bar b"><i style="width:${Math.round(vb / mx * 100)}%"></i></span><b class="bx-vb${vb < va ? ' lo' : ''}">${db}</b></div>`; };
  const faces = facesFor([...A.p.p, ...B.p.p]);
  const team = (x, k) => `<div class="bx-team ${k}"><span class="bx-wm" aria-hidden="true">${x.pos}°</span>${x.p.p.map(pid => bxCard(pid, k, faces[pid])).join('')}</div>`;
  return `<div class="bx"><div class="bx-top"><h2 class="bx-tag">La prossima sfida</h2><span class="bx-meta">${c.l} · Girone ${L}</span><span class="bx-where"><span class="bx-court">Campo ${m.court}</span><span class="bx-time"><small>Ore</small>${hm(m.at)}</span></span></div><div class="bx-stage">${team(A, 'a')}<div class="bx-mid"><span class="bx-vs"><b>VS</b></span></div>${team(B, 'b')}</div><div class="bx-stats"><p class="bx-sh">Il confronto nel girone ${L}</p>${stats.map(row).join('')}</div></div>`;
}
function tvBracket(t, k) {
  const C = catData(t.id, k), R = bracketRounds(C), L = R.length, ch = champOf(C);
  const nm = id => id === BYE ? '<span class="bye">Bye</span>' : id == null ? '<span class="bye">Da definire</span>' : esc(tvPair(C, id));
  const match = m => {
    const lv = !m.sets && C.br.live && C.br.live[m.r + '-' + m.i], part = lv && lv.a === m.a && lv.b === m.b ? lv.sets : null, sets = m.sets || part;
    const row = (id, side) => `<div class="tv-brow${m.sets && m.w === id ? ' w' : ''}"><span class="nm">${nm(id)}</span><span class="sc">${sets ? sets.map(s => s[side]).join(' ') : ''}</span></div>`;
    return `<div class="tv-bm${part ? ' live' : ''}">${row(m.a, 0)}${row(m.b, 1)}</div>`;
  };
  return `<h2 class="tv-vt">Tabellone, ${CAT(k).l.toLowerCase()}${ch != null ? `<small>Vincitori: ${esc(tvPair(C, ch))}</small>` : ''}</h2><div class="tv-bracket" style="grid-template-columns:repeat(${L},minmax(0,1fr))">${R.map((ms, r) => `<div class="tv-bcol"><h3>${roundName(L, r)}</h3><div class="tv-bms">${ms.map(match).join('')}</div></div>`).join('')}</div>`;
}
function tvPartners() {
  const title = PT('mini');
  return `<h2 class="tv-vt">Grazie ai partner della MINI Padel League</h2><div class="tv-partners"><div class="tv-pt title"><img src="${title.uri}" alt="MINI"></div>${PARTNERS.filter(p => p.id !== 'mini').map(p => `<div class="tv-pt"><img src="${p.uri}" alt="${esc(p.name)}"></div>`).join('')}</div>`;
}
function tvRender() {
  const el = document.getElementById('tv'); if (!el || !TV.on) return;
  const t = liveTappa(), views = tvViews(); if (TV.view >= views.length) TV.view = 0;
  const v = views[TV.view];
  let body;
  if (!t || v === 'partner') body = tvPartners();
  else if (v === 'campi') body = tvCourts(t);
  else if (v === 'sfida') body = tvSfida(t);
  else if (v === 'prossime') body = tvNext(t);
  else if (v.startsWith('class-')) body = tvStandings(t, v.slice(6));
  else body = tvBracket(t, v.slice(4));
  const clk = tvClock(), upd = TV.updated || clk;
  el.innerHTML = `<header class="tv-h"><span class="tv-logo"><img src="${LOGO_MPL}" alt="MINI Padel League"></span><div class="tv-title"><b>${t ? `Tappa di ${esc(t.city)}` : 'MINI Padel League'}</b><span>${t ? `${cap(dLong(t.start))}, ${esc(t.club)}` : 'Circuito 2026'}</span></div><div class="tv-live"><span class="tv-pill">In diretta</span><b class="tv-clock">${hm(clk)}</b></div></header><main class="tv-body"><div class="tv-view">${body}</div></main><footer class="tv-f"><div class="tv-dots" aria-hidden="true">${views.map((_, i) => `<i class="${i === TV.view ? 'on' : ''}"></i>`).join('')}</div><span>${esc(tvViewName(v))}</span><span>Aggiornato alle ${hm(upd)}</span><span class="tv-pw">Powered by <span class="tv-lz"><img src="${LOGO_LOBIZ}" alt="Lobiz agency"></span></span></footer>`;
  const play = document.getElementById('tvPlay'); if (play) play.textContent = TV.playing ? 'Pausa' : 'Riprendi';
}
function tvFit() {
  const wrap = document.getElementById('tvWrap'), el = document.getElementById('tv'); if (!wrap || !el) return;
  const W = wrap.clientWidth, H = wrap.clientHeight; if (!W || !H) return;
  const s = Math.min(W / 1280, H / 720);
  el.style.transform = `translate(${(W - 1280 * s) / 2}px, ${(H - 720 * s) / 2}px) scale(${s})`;
}
function tvStart() {
  clearInterval(TV.timer); clearInterval(TV.tick);
  TV.timer = setInterval(() => { if (TV.playing) tvStep(1, true); }, 12000);
  TV.tick = setInterval(() => { const c = document.querySelector('#tv .tv-clock'); if (c) c.textContent = hm(tvClock()); }, 10000);
}
function tvStep(d, auto) {
  const n = tvViews().length; TV.view = (TV.view + d + n) % n;
  if (tvViews()[TV.view] === 'sfida') TV.sfida++;
  tvRender(); if (!auto) tvStart();
}
function tvOpen() {
  TV.on = true; TV.view = 0; TV.updated = tvClock();
  document.body.classList.add('tv-mode');
  document.getElementById('tvPanel').hidden = false;
  tvRender(); requestAnimationFrame(tvFit); tvStart(); syncIndex();
  if (!TV.kiosk && window.matchMedia('(max-width:780px)').matches) document.getElementById('tvPanel').scrollIntoView({ behavior: 'smooth', block: 'start' });
}
function tvClose() {
  TV.on = false; TV.kiosk = false; clearInterval(TV.timer); clearInterval(TV.tick);
  document.body.classList.remove('tv-mode', 'tv-kiosk');
  document.getElementById('tvPanel').hidden = true;
  try { if (location.hash === '#schermo') history.replaceState(null, '', location.pathname + location.search); } catch (e) { /* ignore */ }
  syncIndex();
}
function tvSimSet() {
  const t = liveTappa(); if (!t) return;
  const all = [];
  CATS.forEach(c => { const C = catData(t.id, c.k); if (C.groups) scheduleOf(t, C).forEach(m => all.push({ C, m })); });
  all.sort((a, b) => a.m.at - b.m.at || a.m.court - b.m.court);
  const pick = all.find(x => getLive(x.C, x.m.a, x.m.b)) || all.find(x => !getSc(x.C, x.m.a, x.m.b));
  if (!pick) { toast('I gironi di oggi sono finiti'); return; }
  const { C, m } = pick, cur = getLive(C, m.a, m.b) || [], r = rngFor(`tv${C.k}${m.a}-${m.b}-${cur.length}`);
  const pa = pairOf(C, m.a), pb = pairOf(C, m.b), aWins = r() < 1 / (1 + Math.exp(-(pa.lv - pb.lv) * 1.7));
  let set;
  if (C.cfg.fmt === 'stb' && cur.length === 2) { const l = Math.floor(r() * 9); set = aWins ? [10, l] : [l, 10]; }
  else { const s = randSet(r); set = aWins ? s : [s[1], s[0]]; }
  const sets = cur.concat([set]), done = isComplete(sets, C.cfg.fmt);
  if (done) { setSc(C, m.a, m.b, sets); setLive(C, m.a, m.b, null); } else setLive(C, m.a, m.b, sets);
  TV.flash = skey(m.a, m.b);
  save(); rerender(); toast(`Campo ${m.court}: ${done ? 'partita finita' : `set ${sets.length} salvato`}`);
}
const saveBase = save;
save = function () {
  saveBase();
  if (!TV.on) return;
  TV.updated = tvClock();
  if (TV.flash) { const i = tvViews().indexOf('campi'); if (i >= 0) TV.view = i; tvStart(); setTimeout(() => { TV.flash = null; }, 2600); }
  tvRender();
};
A.tvOpen = () => tvOpen();
document.addEventListener('click', ev => {
  const b = ev.target.closest('[data-tv]'); if (!b) return;
  const k = b.dataset.tv;
  if (k === 'prev') tvStep(-1, false);
  else if (k === 'next') tvStep(1, false);
  else if (k === 'play') { TV.playing = !TV.playing; tvRender(); toast(TV.playing ? 'Rotazione delle schermate ripresa' : 'Rotazione in pausa'); }
  else if (k === 'sim') tvSimSet();
  else if (k === 'full') { const w = document.getElementById('tvWrap'), no = () => toast('Lo schermo intero non è disponibile qui: usa il tasto del browser'); try { const r = (w.requestFullscreen || w.webkitRequestFullscreen).call(w); if (r && r.catch) r.catch(no); } catch (e) { no(); } }
  else if (k === 'close') tvClose();
});
document.addEventListener('keydown', ev => { if (ev.key === 'Escape' && TV.kiosk) tvClose(); });
if (window.ResizeObserver) new ResizeObserver(tvFit).observe(document.getElementById('tvWrap'));
window.addEventListener('resize', tvFit);
if (location.hash === '#schermo') { TV.kiosk = true; document.body.classList.add('tv-kiosk'); tvOpen(); }
