/* ================= navigation & render ================= */
const phone = document.getElementById('phone'), vp = document.getElementById('vp'), tabbar = document.getElementById('tabbar');
const sheetWrap = document.getElementById('sheet'), sheetBox = document.getElementById('sheetBox'), toastEl = document.getElementById('toast');
const SCREENS = { welcome: scrWelcome, login: scrLogin, signup: scrSignup, ready: scrReady, home: scrHome, tappe: scrTappe, cerca: scrCerca, profilo: scrProfilo, tappa: scrTappa, girone: scrGirone, crea: scrCrea, ranking: scrRanking, match: scrMatch, settings: scrSettings, iscr: scrIscr, iscrOk: scrIscrOk, partner: scrPartner, rules: scrRules, leads: scrLeads, draw: scrDraw, codes: scrCodes, pubblico: scrPubblico, visita: scrVisita, visitaOk: scrVisitaOk, td: scrTd };
let nav = [];
const top = () => nav[nav.length - 1];

function render(anim) {
  const e = top(), out = SCREENS[e.s](e);
  const scr = document.createElement('section');
  scr.className = 'scr' + (out.tabs ? ' has-tabs' : '') + (out.cls ? ' ' + out.cls : '') + (anim ? ' anim-' + anim : '');
  scr.setAttribute('aria-label', out.title || '');
  scr.innerHTML = out.html;
  vp.replaceChildren(scr);
  tabbar.hidden = !out.tabs;
  tabbar.classList.toggle('vis', isVis());
  tabbar.querySelectorAll('.tab').forEach(b => { if (b.dataset.t === e.s) b.setAttribute('aria-current', 'page'); else b.removeAttribute('aria-current'); });
  const pt = tabbar.querySelector('[data-t="profilo"] .tab-ic'); if (pt) { const ph = S.session && USER() && USER().photo; pt.innerHTML = ph ? `<img class="tab-ph" src="${ph}" alt="">` : I('user'); }
  scr.scrollTop = anim === 'push' ? 0 : (e.scroll || 0);
  scr.addEventListener('scroll', () => { e.scroll = scr.scrollTop; }, { passive: true });
  const bw = scr.querySelector('#brWrap');
  if (bw) { if (e.brx) bw.scrollLeft = e.brx; bw.addEventListener('scroll', () => { e.brx = bw.scrollLeft; }, { passive: true }); }
  syncIndex();
}
function go(entry) { nav.push(entry); render('push'); }
function back() { if (nav.length > 1) { nav.pop(); render('pop'); } }
const rerender = () => render();

/* ================= sheet & toast ================= */
let SH = null, lastFocus = null, toastT = null;
function openSheet(html, focusSel) {
  lastFocus = document.activeElement;
  sheetBox.innerHTML = `<div class="grab" aria-hidden="true"></div>${html}`;
  sheetWrap.classList.add('open');
  sheetWrap.setAttribute('aria-hidden', 'false');
  setTimeout(() => { const f = (focusSel && sheetBox.querySelector(focusSel)) || sheetBox.querySelector('button, input'); if (f) f.focus({ preventScroll: true }); }, 80);
  syncIndex();
}
const updateSheet = html => { sheetBox.innerHTML = `<div class="grab" aria-hidden="true"></div>${html}`; };
function closeSheet() {
  if (!sheetWrap.classList.contains('open')) return;
  sheetWrap.classList.remove('open');
  sheetWrap.setAttribute('aria-hidden', 'true');
  SH = null;
  if (lastFocus && document.contains(lastFocus)) lastFocus.focus({ preventScroll: true });
  syncIndex();
}
function toast(msg) {
  toastEl.innerHTML = `<i>${I('check')}</i><span>${esc(msg)}</span>`;
  toastEl.classList.add('show');
  clearTimeout(toastT);
  toastT = setTimeout(() => toastEl.classList.remove('show'), 3000);
}
const showErr = (id, msg) => { const el = document.getElementById(id); if (el) { el.textContent = msg; el.scrollIntoView({ block: 'nearest' }); } return false; };
const foot = (primary, secondary) => `<div class="sh-foot">${primary}${secondary == null ? '<button class="btn btn-text" data-a="closeSheet">Annulla</button>' : secondary}</div>`;

/* ================= score entry ================= */
function openScore(d) {
  const tid = +d.tid, C = catData(tid, d.k);
  let a, b, cur, sub;
  let partial = null;
  if (d.kind === 'g') { a = +d.x; b = +d.y; cur = getSc(C, a, b); partial = cur ? null : getLive(C, a, b); sub = `Girone ${LETTERS[+d.gi]}, turno ${+d.r + 1}`; }
  else { const R = bracketRounds(C), m = R[+d.r][+d.i]; a = m.a; b = m.b; cur = m.sets; const lv = C.br.live && C.br.live[d.r + '-' + d.i]; partial = !cur && lv && lv.a === a && lv.b === b ? lv.sets : null; sub = `${roundName(R.length, +d.r)}, partita ${+d.i + 1}`; }
  const shown = cur || partial;
  SH = { kind: 'score', ctx: d.kind, tid, k: d.k, a, b, r: +d.r, i: +d.i, fmt: C.cfg.fmt };
  const la = pairLabel(C, a), lb = pairLabel(C, b);
  const rows = SH.fmt === 'uno' ? [['Set', 0]] : [['Set 1', 0], ['Set 2', 1], ['Super tie-break', 2]];
  const cell = (r, side, label) => `<input class="sc-in" type="text" inputmode="numeric" pattern="[0-9]*" maxlength="2" autocomplete="off" data-row="${r}" data-side="${side}" aria-label="${esc(label + ', ' + (side ? lb : la))}" value="${shown && shown[r] ? shown[r][side] : ''}">`;
  const grid = rows.map(([label, r]) => `<div class="sc-r" data-r="${r}"${r === 2 && !(shown && (shown[2] || (shown.length === 2 && (shown[0][0] > shown[0][1]) !== (shown[1][0] > shown[1][1])))) ? ' hidden' : ''}><span class="lbl">${label}</span>${cell(r, 0, label)}${cell(r, 1, label)}</div>`).join('');
  openSheet(`<div class="sh-body"><h2 class="t-l" id="shTitle">${cur ? 'Modifica risultato' : partial ? 'Aggiorna il risultato' : 'Inserisci risultato'}</h2><p class="sm mt4">${esc(sub)}. ${FMT_L[SH.fmt]}.</p>${SH.fmt === 'stb' ? '<p class="sc-hint">Puoi salvare a fine set: la partita resta in corso, e gli schermi in sede mostrano il parziale.</p>' : ''}<div class="sc-head"><span></span><b>${esc(la)}</b><b>${esc(lb)}</b></div>${grid}<p class="sc-err" id="scErr" role="alert"></p></div>` + foot('<button class="btn btn-primary" data-a="scSave">Salva</button>', cur || partial ? '<button class="btn btn-text danger" data-a="scClear">Cancella risultato</button>' : undefined), '.sc-in');
}
function scVal(r, s) { const el = sheetBox.querySelector(`.sc-in[data-row="${r}"][data-side="${s}"]`); return el && el.value !== '' ? +el.value : null; }
function syncStb() {
  if (!SH || SH.fmt !== 'stb') return;
  const v = [scVal(0, 0), scVal(0, 1), scVal(1, 0), scVal(1, 1)];
  const split = v.every(x => x != null) && v[0] !== v[1] && v[2] !== v[3] && (v[0] > v[1]) !== (v[2] > v[3]);
  const row = sheetBox.querySelector('.sc-r[data-r="2"]'); if (row) row.hidden = !split;
}
function scSave() {
  const fmt = SH.fmt, sets = [], maxSets = fmt === 'uno' ? 1 : 2;
  for (let r = 0; r < maxSets; r++) {
    const x = scVal(r, 0), y = scVal(r, 1), name = fmt === 'uno' ? 'il set' : `il set ${r + 1}`;
    if (x == null && y == null) break;
    if (x == null || y == null) return showErr('scErr', `Inserisci i game di entrambe le coppie per ${name}.`);
    if (!validSet(x, y)) return showErr('scErr', `${cap(name)} non è valido: si vince a 6 con almeno 2 game di scarto, oppure 7–5 o 7–6.`);
    sets.push([x, y]);
  }
  if (!sets.length) return showErr('scErr', 'Inserisci almeno il risultato del primo set.');
  if (fmt === 'stb' && sets.length === 2 && (sets[0][0] > sets[0][1]) !== (sets[1][0] > sets[1][1])) {
    const x = scVal(2, 0), y = scVal(2, 1);
    if (x != null || y != null) {
      if (x == null || y == null) return showErr('scErr', 'Inserisci i punti di entrambe le coppie nel super tie-break.');
      if (!validSTB(x, y)) return showErr('scErr', 'Il super tie-break non è valido: si vince a 10 con almeno 2 punti di scarto.');
      sets.push([x, y]);
    }
  }
  const C = catData(SH.tid, SH.k), done = isComplete(sets, fmt);
  let msg;
  if (SH.ctx === 'g') {
    if (done) { setSc(C, SH.a, SH.b, sets); setLive(C, SH.a, SH.b, null); } else { setSc(C, SH.a, SH.b, null); setLive(C, SH.a, SH.b, sets); }
    msg = done ? 'Risultato salvato, partita finita' : `Set ${sets.length} salvato: la partita resta in corso`;
  } else {
    const key = SH.r + '-' + SH.i; C.br.live = C.br.live || {};
    if (done) {
      C.br.sc[key] = { a: SH.a, b: SH.b, sets }; delete C.br.live[key]; cleanBracket(C);
      const L = bracketRounds(C).length, win = tally(sets, fmt).aWin ? SH.a : SH.b;
      msg = SH.r === L - 1 ? `Risultato salvato. ${pairLabel(C, win)} vince la tappa` : `Risultato salvato. ${pairLabel(C, win)} passa ${['in finale', 'in semifinale', 'ai quarti', 'agli ottavi', 'ai sedicesimi'][L - 2 - SH.r] || 'al turno dopo'}`;
    } else { delete C.br.sc[key]; C.br.live[key] = { a: SH.a, b: SH.b, sets }; cleanBracket(C); msg = `Set ${sets.length} salvato: la partita resta in corso`; }
  }
  if (typeof TV !== 'undefined') TV.flash = SH.ctx === 'g' ? skey(SH.a, SH.b) : null;
  save(); closeSheet(); rerender(); toast(msg);
}
function scClear() {
  const C = catData(SH.tid, SH.k);
  if (SH.ctx === 'g') { setSc(C, SH.a, SH.b, null); setLive(C, SH.a, SH.b, null); }
  else { const key = SH.r + '-' + SH.i; delete C.br.sc[key]; if (C.br.live) delete C.br.live[key]; cleanBracket(C); }
  save(); closeSheet(); rerender(); toast('Risultato cancellato');
}

/* ================= bracket generation ================= */
function openBracketSheet(tid, k) {
  const t = T(tid), C = catData(tid, k), cat = CAT(k), Q = qualifiersOf(C);
  if (Q.length < 2) { SH = { kind: 'info' }; openSheet(`<div class="sh-body"><h2 class="t-l" id="shTitle">Genera tabellone</h2><p class="body mt8">Servono almeno 2 coppie qualificate. Aumenta il numero di gironi o fai passare le prime 2 di ogni girone.</p></div>` + foot('<button class="btn btn-ghost" data-a="closeSheet">Chiudi</button>', '')); return; }
  const draft = buildBracket(C), size = draft.slots.length, byes = size - Q.length, pr = catProgress(C), missing = pr.total - pr.played;
  const oldRes = C.br ? Object.keys(C.br.sc).length : 0;
  SH = { kind: 'bracket', tid, k, draft, regen: !!C.br };
  const nm = id => id === BYE ? '<span class="bye">Bye</span>' : `<span class="tg">${draft.tags[id]}</span>${esc(pairLabel(C, id))}`;
  let rows = '';
  for (let i = 0; i < size; i += 2) { const a = draft.slots[i], b = draft.slots[i + 1], me = (a !== BYE && isMe(C, a)) || (b !== BYE && isMe(C, b)); rows += `<div class="fr${me ? ' me' : ''}"><span>${nm(a)}</span><span class="vsx">vs</span><span>${nm(b)}</span></div>`; }
  let warn = '';
  if (missing > 0) warn += `<div class="warn">${I('alert')}<span>Mancano ${missing} risultati nei gironi: il tabellone userà la classifica di adesso. Potrai rigenerarlo quando i gironi sono completi.</span></div>`;
  if (oldRes > 0) warn += `<div class="warn">${I('alert')}<span>${oldRes === 1 ? 'Il risultato già inserito' : `I ${oldRes} risultati già inseriti`} nel tabellone ${oldRes === 1 ? 'verrà cancellato' : 'verranno cancellati'}.</span></div>`;
  const label = C.br ? 'Rigenera tabellone' : 'Genera tabellone';
  openSheet(`<div class="sh-body"><h2 class="t-l" id="shTitle">${label}</h2><p class="sm mt4">${esc(t.city)}, ${cat.l.toLowerCase()}</p><p class="body mt12" style="font-size:14px">Passano ${Q.length} coppie: tabellone da ${size}${byes ? `, con ${byes} bye alle migliori teste di serie` : ''}. Le coppie dello stesso girone non si incontrano al primo turno.</p>${warn}<h3 class="t-m mt16">${roundName(Math.log2(size), 0)}</h3>${rows}</div>` + foot(`<button class="btn btn-primary" data-a="brConfirm">${label}</button>`));
}
function brConfirm() {
  const C = catData(SH.tid, SH.k), regen = SH.regen;
  C.br = SH.draft;
  save(); closeSheet();
  const e = top(); if (e.s === 'tappa') { e.tab = 'tabellone'; e.brx = 0; }
  rerender(); toast(regen ? 'Tabellone rigenerato' : 'Tabellone generato');
}

/* ================= participants (staff) ================= */
function smallestGroup(C) { let best = 0; C.groups.forEach((g, i) => { if (g.length < C.groups[best].length) best = i; }); return best; }
function addToGroups(C, id) { if (!C.groups || !C.groups.length) return -1; const gi = smallestGroup(C); C.groups[gi].push(id); return gi; }
function removePair(C, id) {
  C.pairs = C.pairs.filter(p => p.id !== id);
  if (C.groups) { C.groups = C.groups.map(g => g.filter(x => x !== id)).filter(g => g.length); if (!C.groups.length) C.groups = null; }
  Object.keys(C.sc).forEach(key => { if (key.split('-').map(Number).includes(id)) delete C.sc[key]; });
}
function openAdd(tid, k) {
  const cat = CAT(k);
  SH = { kind: 'add', tid, k, lvl: '3', g: k === 'F' ? 'f' : 'm' };
  const gsel = k === 'X' ? `<div class="fld"><span>Nel misto gioca come</span><div class="seg full" role="group" aria-label="Nel misto gioca come">${[['m', 'Uomo'], ['f', 'Donna']].map(([v, l]) => `<button data-a="addG" data-v="${v}" aria-pressed="${v === 'm'}">${l}</button>`).join('')}</div></div>` : '';
  openSheet(`<div class="sh-body"><h2 class="t-l" id="shTitle">Aggiungi giocatore</h2><p class="sm mt4">${esc(T(tid).city)}, ${cat.l.toLowerCase()}. Entra senza passare dall'approvazione.</p><label class="fld"><span>Nome e cognome</span><input class="f-in" id="fA" placeholder="Nome e cognome" autocomplete="off"></label>${gsel}<div class="fld"><span>Livello</span><div class="seg full" role="group" aria-label="Livello">${[['2', '2–3'], ['3', '3–4'], ['4', '4–5'], ['5', '5 e oltre']].map(([v, l]) => `<button data-a="addLvl" data-v="${v}" aria-pressed="${v === '3'}">${l}</button>`).join('')}</div></div><p class="sc-err" id="fErr" role="alert"></p></div>` + foot('<button class="btn btn-primary" data-a="addSave">Aggiungi giocatore</button>'), '#fA');
}
function addSave() {
  const v = document.getElementById('fA').value.trim();
  if (!/^\S+\s+\S+/.test(v)) return showErr('fErr', 'Inserisci nome e cognome del giocatore.');
  const C = catData(SH.tid, SH.k), parts = titleCase(v).split(' ');
  const p = { id: S.players.length, f: parts[0], l: parts.slice(1).join(' '), g: SH.g, lv: { 2: 2.6, 3: 3.5, 4: 4.4, 5: 5.2 }[SH.lvl] };
  S.players.push(p); C.players.push(p.id);
  save(); closeSheet(); rerender(); toast(`${p.f} ${p.l} aggiunto agli iscritti`);
}
function openRm(tid, k, id) {
  const pl = PL(id);
  SH = { kind: 'rm', tid, k, id };
  openSheet(`<div class="sh-body"><h2 class="t-l" id="shTitle">Rimuovere ${esc(pl.f + ' ' + pl.l)}?</h2><p class="body mt8">Esce dagli iscritti di ${esc(T(tid).city)} e riceve una notifica. Il posto torna libero.</p></div>` + foot('<button class="btn btn-danger" data-a="rmConfirm">Rimuovi giocatore</button>'));
}

/* ================= group builder ================= */
function regenDraft() { DRAFT.groups = makeGroups(catData(DRAFT.tid, DRAFT.k), DRAFT.cfg); DRAFT.sel = null; }
function publish() {
  const C = catData(DRAFT.tid, DRAFT.k), gOf = {};
  DRAFT.groups.forEach((g, gi) => g.forEach(id => { gOf[id] = gi; }));
  const lost = Object.keys(C.sc).filter(key => { const [x, y] = key.split('-').map(Number); return gOf[x] === undefined || gOf[x] !== gOf[y]; }).length;
  const changed = !C.groups || JSON.stringify(C.groups) !== JSON.stringify(DRAFT.groups) || C.cfg.q !== DRAFT.cfg.q;
  if (!lost && !(C.br && changed)) return applyPublish();
  SH = { kind: 'pub' };
  const parts = [];
  if (lost) parts.push(lost === 1 ? 'il risultato di una partita che non esiste più' : `i risultati di ${lost} partite che non esistono più`);
  if (C.br && changed) parts.push('il tabellone già generato');
  openSheet(`<div class="sh-body"><h2 class="t-l" id="shTitle">Pubblicare i nuovi gironi?</h2><p class="body mt8">Con questa composizione verranno cancellati ${parts.join(' e ')}. I risultati delle partite che restano uguali vengono mantenuti.</p></div>` + foot('<button class="btn btn-primary" data-a="pubConfirm">Pubblica gironi</button>'));
}
function applyPublish() {
  const C = catData(DRAFT.tid, DRAFT.k), gOf = {};
  DRAFT.groups.forEach((g, gi) => g.forEach(id => { gOf[id] = gi; }));
  Object.keys(C.sc).forEach(key => { const [x, y] = key.split('-').map(Number); if (gOf[x] === undefined || gOf[x] !== gOf[y]) delete C.sc[key]; });
  const changed = !C.groups || JSON.stringify(C.groups) !== JSON.stringify(DRAFT.groups) || C.cfg.q !== DRAFT.cfg.q;
  C.groups = DRAFT.groups.filter(g => g.length);
  C.cfg = Object.assign({}, DRAFT.cfg, { n: C.groups.length });
  if (changed) C.br = null;
  DRAFT = null;
  save(); closeSheet(); nav.pop();
  const e = top(); if (e.s === 'tappa') e.tab = 'gironi';
  render('pop'); toast('Gironi pubblicati');
}

/* ================= sign-up & login ================= */
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/;
function suNext() {
  const k = suKey();
  if (k === 'code') {
    const res = codeCheck(SU.code);
    if (res.err) return showErr('formErr', res.err);
    SU.codeOk = res.c.code;
  }
  if (k === 'account') {
    if (!SU.f.trim() || !SU.l.trim()) return showErr('formErr', 'Inserisci nome e cognome.');
    if (!EMAIL_RE.test(SU.email.trim())) return showErr('formErr', "Inserisci un'email valida, ad esempio nome@esempio.it.");
    if (Object.values(S.users).some(u => u.email === SU.email.trim().toLowerCase())) return showErr('formErr', 'Esiste già un account con questa email: accedi invece di registrarti.');
    if (SU.pw.length < 8 || !/\d/.test(SU.pw)) return showErr('formErr', 'La password deve avere almeno 8 caratteri e un numero.');
  }
  if (k === 'otp' && SU.otp.join('').length < 6) return showErr('formErr', 'Inserisci tutte e 6 le cifre del codice.');
  if (k === 'privacy') {
    if (!SU.terms) return showErr('formErr', "Per creare l'account serve la presa visione dell'informativa sulla privacy.");
    const player = SU.role === 'player', c = player ? findCode(SU.codeOk) : null;
    if (player && !codeUsable(c)) { SU.step = 0; render('pop'); return showErr('formErr', 'Il codice di ingresso non è più valido: chiedi alla concessionaria un nuovo invito.'); }
    const id = S.players.length, lv = player ? 3.4 : 0;
    S.players.push({ id, f: titleCase(SU.f.trim()), l: titleCase(SU.l.trim()), g: 'x', lv });
    const u = { role: SU.role, email: SU.email.trim().toLowerCase(), consents: { terms: true, photo: SU.photo, news: SU.news } };
    if (player) { c.used++; Object.assign(u, { code: c.code, dealer: c.dealer, hand: SU.hand, side: SU.side, lvl: lv }); if (SU.pic) u.photo = SU.pic; }
    S.users[id] = u;
    S.me = id; S.session = true; S.org = false; SU = null;
    save(); nav = [{ s: 'ready' }]; render('push'); toast('Account creato');
    return;
  }
  SU.step++; render('push');
  if (suKey() === 'otp') setTimeout(() => { const f = phone.querySelector('[data-otp="0"]'); if (f) f.focus(); }, 320);
}
function codeLive(v) {
  const box = document.getElementById('codeState'); if (!box) return;
  const n = normCode(v), c = n.length === 9 ? findCode(n) : null;
  box.innerHTML = codeUsable(c) ? inviteBox(c) : '';
}
function loginSave() {
  const e = top(), email = (e.email || '').trim().toLowerCase();
  if (!EMAIL_RE.test(email)) return showErr('formErr', "Inserisci un'email valida, ad esempio nome@esempio.it.");
  if (!e.pw) return showErr('formErr', 'Inserisci la password.');
  const uid = Object.keys(S.users).find(k => S.users[k].email === email);
  if (uid == null) return showErr('formErr', e.staff ? 'Non troviamo un account staff con questa email. Gli account dello staff li crea Lobiz agency.' : 'Non troviamo un account con questa email. Controlla che sia giusta oppure registrati.');
  const u = S.users[uid];
  if (e.staff && u.role !== 'staff') return showErr('formErr', "Questo account non ha l'accesso staff: torna alla scelta e accedi come giocatore o visitatore.");
  S.me = +uid; S.session = true; S.org = u.role === 'staff';
  save(); nav = [{ s: 'home' }]; render('push'); toast(`Bentornato, ${ME().f}`);
}

/* ================= stage registration ================= */
function startReg(tid) {
  if (tStatus(T(tid)) !== 'open') { toast('Le iscrizioni a questa tappa non sono aperte'); return; }
  REG = newREG(tid);
  closeSheet(); go({ s: 'iscr' });
}
function regValidate() {
  const st = REG.step, pr = REG.prof, R = S.rules;
  if (st === 0) {
    if (!REG.k) return 'Scegli una categoria per continuare.';
    if (REG.k === 'X' && !REG.g) return 'Indica se nel misto giochi come uomo o come donna.';
  }
  if (st === 1 && !REG.lc.lvl) return 'Scegli il tuo livello di preparazione: base, intermedio o agonista.';
  if (st === 2) {
    if (R.mini && pr.mini && pr.plate && !plateOk(pr.plate)) return 'La targa non sembra valida: usa il formato AB123CD, oppure lasciala vuota.';
    if (R.biz && pr.biz && pr.vat && !/^\d{11}$/.test(pr.vat)) return 'La partita IVA ha 11 cifre: completala oppure lasciala vuota.';
    if (R.biz && pr.biz && pr.vat && !vatOk(pr.vat)) return 'La partita IVA non è valida: controlla le cifre, oppure lasciala vuota.';
  }
  if (st === 3) {
    if (!REG.shirt) return 'Scegli la taglia della maglia.';
    if (!REG.fitp) return 'Indica se hai la tessera FITP.';
    if (REG.fitp === 'yes' && !fitpNumOk(REG.fitpNum)) return 'Inserisci il numero della tessera FITP: da 5 a 12 tra lettere e numeri.';
    if (!REG.cert) return 'Scegli come consegnare il certificato medico.';
    if (REG.cert === 'upload' && !REG.certFile) return 'Carica il certificato oppure scegli di portarlo in sede.';
    if (R.insurance && !REG.ins) return "Scegli se vuoi l'assicurazione gratuita.";
    if (R.insurance && REG.ins === 'yes' && !cfOk(REG.cf)) return 'Il codice fiscale non sembra valido: controlla le 16 lettere e cifre.';
    if (R.td && REG.tdOn) { const e = tdValidate(REG.tdd, T(REG.tid)); if (e) return e; }
  }
  return null;
}
function approveReg(r) {
  const C = catData(r.tid, r.k);
  if (!C.players.includes(r.uid)) C.players.push(r.uid);
  if (C.drawn && !C.pairs.some(p => p.p.includes(r.uid)) && !C.reserve.includes(r.uid)) C.reserve.push(r.uid);
  r.status = 'ok';
}
function regNext() {
  const err = regValidate();
  if (err) return showErr('formErr', err);
  if (REG.step < 4) { REG.step++; render('push'); return; }
  const t = T(REG.tid), u = USER(), me = PL(S.me);
  const played = myHistory().reduce((n, x) => n + x.played, 0);
  const fitp = REG.fitp === 'yes' ? { has: true, num: REG.fitpNum } : { has: false, num: '' };
  u.lvlCard = Object.assign({}, REG.lc);
  if (!played) { me.lv = LV3_NUM[REG.lc.lvl]; u.lvl = me.lv; }
  if (REG.ins === 'yes') u.cf = REG.cf;
  if (REG.k === 'X' && REG.g) me.g = REG.g; else if (me.g !== 'm' && me.g !== 'f') me.g = REG.k === 'F' ? 'f' : 'm';
  u.prof = Object.assign({}, REG.prof); u.shirt = REG.shirt; u.fitp = fitp;
  u.consents = Object.assign({}, u.consents, { dealer: REG.cDealer, partners: REG.cPartners, screen: REG.cScreen });
  const r = { uid: S.me, tid: REG.tid, k: REG.k, g: REG.k === 'X' ? REG.g : null, status: 'review', lc: Object.assign({}, REG.lc), shirt: REG.shirt, fitp: Object.assign({}, fitp), cert: REG.cert, ins: S.rules.insurance ? REG.ins : null, prof: Object.assign({}, REG.prof), consents: { dealer: REG.cDealer, partners: REG.cPartners } };
  S.regs.push(r);
  if (!manual()) approveReg(r);
  if (S.rules.td && REG.tdOn) addTd(S.me, REG.tid, REG.tdd);
  if (!S.follow.includes(t.id)) S.follow.push(t.id);
  const rid = S.regs.length - 1, k = REG.k;
  REG = null; save();
  nav.pop();
  const te = top(); if (te && te.s === 'tappa') { te.k = k; te.tab = manual() ? 'info' : 'iscritti'; te.scroll = 0; }
  go({ s: 'iscrOk', rid });
}
function approveMine() {
  const mine = S.regs.filter(r => r.uid === S.me && r.status === 'review');
  if (!mine.length) { toast('Non hai richieste in attesa'); return; }
  mine.forEach(approveReg); save(); rerender();
  toast(`Iscrizione a ${T(mine[0].tid).city} confermata: ora vedi gironi e avversari`);
}
function unregister(tid, k) {
  const C = catData(tid, k), p = C.pairs.find(x => x.p.includes(S.me));
  if (p) { const other = p.p.find(x => x !== S.me); removePair(C, p.id); if (!C.reserve.includes(other)) C.reserve.push(other); }
  C.players = C.players.filter(x => x !== S.me); C.reserve = C.reserve.filter(x => x !== S.me);
  S.regs = S.regs.filter(r => !(r.uid === S.me && r.tid === tid && r.k === k));
  const still = CATS.some(c => catData(tid, c.k).players.includes(S.me)) || S.regs.some(r => r.uid === S.me && r.tid === tid && r.status !== 'no');
  const had = !still && S.tds.some(x => x.uid === S.me && x.tid === tid);
  if (had) S.tds = S.tds.filter(x => !(x.uid === S.me && x.tid === tid));
  return had;
}

function drawApply() {
  const C = catData(DRAW.tid, DRAW.k), res = DRAW.res;
  C.pairs = res.pairs.map(([a, b]) => mkPair(C, a, b)); C.reserve = res.reserve.slice(); C.drawn = true;
  C.groups = null; C.sc = {}; C.br = null; C.cfg = null;
  DRAW = null; save(); closeSheet(); nav.pop();
  const e = top(); if (e.s === 'tappa') e.tab = 'iscritti';
  render('pop'); toast('Coppie estratte: i giocatori ricevono una notifica con il compagno');
}
/* ================= demo tools and roles ================= */
function loginAs(r) {
  let id = S.demo[r];
  if (!S.users[id] || S.users[id].role !== r) { const k = Object.keys(S.users).find(x => S.users[x].role === r); if (k != null) id = +k; }
  S.me = id; S.session = true; S.org = r === 'staff';
  REG = null; VIS = null; TDF = null;
}
function logoutState() { S.session = false; S.org = false; REG = null; VIS = null; TDF = null; }
function demoFill() {
  const t = liveTappa(); if (!t) return;
  let n = 0;
  CATS.forEach(c => { const C = catData(t.id, c.k); if (!C.groups) return; scheduleOf(t, C).forEach(m => { if (!getSc(C, m.a, m.b)) { setSc(C, m.a, m.b, simMatch(pairOf(C, m.a), pairOf(C, m.b), C.cfg.fmt, rngFor(`fill${c.k}${m.a}-${m.b}`))); setLive(C, m.a, m.b, null); n++; } }); });
  save(); rerender();
  toast(n ? `${n} risultati inseriti nei gironi di ${t.city}` : `I gironi di ${t.city} sono già completi`);
}
function demoReset() {
  const r = S.session ? role() : 'player';
  try { localStorage.removeItem(KEY); } catch (e) { /* ignore */ }
  freshState(); loginAs(r); save(); DRAFT = null; DRAW = null; SU = null; closeSheet();
  nav = [{ s: 'home' }]; render(); toast('Dati demo ripristinati');
}

/* ================= visitors, test drives and entry codes ================= */
function tdObj() { const s = top().s; return s === 'iscr' && REG ? REG.tdd : s === 'visita' && VIS ? VIS.tdd : s === 'td' && TDF ? TDF.d : null; }
function tdValidate(d, t) {
  if (!d.model) return 'Scegli quale MINI vuoi provare, oppure "Non so ancora".';
  if (!d.slot) return 'Scegli quando preferisci fare il test drive.';
  if (!licNumOk(d.num)) return 'Inserisci il numero della patente: da 8 a 12 tra lettere e numeri.';
  if (!/^\d{2}\/\d{4}$/.test(d.exp)) return 'Inserisci la scadenza della patente nel formato MM/AAAA.';
  if (!licExpOk(d.exp, t)) return 'La patente risulta scaduta il giorno della tappa: controlla la scadenza.';
  if (d.phone && d.phone.replace(/\D/g, '').length < 9) return 'Il numero di telefono sembra incompleto: correggilo oppure lascialo vuoto.';
  return null;
}
function addTd(uid, tid, d) {
  const u = S.users[uid], lic = { num: d.num, exp: d.exp, photo: !!d.photo };
  if (u) { u.lic = Object.assign({}, lic); if (d.phone) u.phone = d.phone; }
  const rec = { model: d.model, slot: d.slot, lic, phone: d.phone || '' }, ex = S.tds.find(x => x.uid === uid && x.tid === tid);
  if (ex) { if (ex.status === 'ok' && (ex.model !== d.model || ex.slot !== d.slot)) { ex.status = 'pre'; ex.time = null; } Object.assign(ex, rec); }
  else S.tds.push(Object.assign({ id: S.tdSeq++, uid, tid, status: 'pre', time: null }, rec));
}
function visSave() {
  const t = T(VIS.tid), u = USER();
  if (!VIS.arrive) return showErr('formErr', 'Indica quando pensi di arrivare: in mattinata, nel pomeriggio o tutto il giorno.');
  if (S.rules.td && VIS.tdOn) { const e = tdValidate(VIS.tdd, t); if (e) return showErr('formErr', e); }
  if (!myVisit(t.id)) S.visits.push({ uid: S.me, tid: t.id, arrive: VIS.arrive, guests: VIS.guests, pass: 'V-' + (10000 + Math.floor(Math.random() * 90000)) });
  u.consents = Object.assign({}, u.consents, { dealer: VIS.cDealer, partners: VIS.cPartners });
  if (S.rules.td && VIS.tdOn) addTd(S.me, t.id, VIS.tdd);
  if (!S.follow.includes(t.id)) S.follow.push(t.id);
  VIS = null; save();
  nav.pop(); go({ s: 'visitaOk', tid: t.id });
}
function tdSave() {
  const t = T(TDF.tid), err = tdValidate(TDF.d, t);
  if (err) return showErr('formErr', err);
  const had = myTd(t.id), wasOk = !!had && had.status === 'ok';
  addTd(S.me, t.id, TDF.d);
  const now = myTd(t.id);
  TDF = null; save(); render('pop');
  toast(!had ? "Pre-prenotazione inviata: la concessionaria ti conferma l'orario" : wasOk && now.status === 'pre' ? "Modifiche salvate: l'orario va confermato di nuovo" : 'Modifiche salvate');
}
function passSheet(tid) {
  const v = myVisit(tid), t = T(tid);
  if (!v) return `<div class="sh-body"><h2 class="t-l" id="shTitle">Pass non trovato</h2><p class="body mt8">L'iscrizione a ${esc(t.city)} potrebbe essere stata annullata.</p></div>` + foot('<button class="btn btn-ghost" data-a="closeSheet">Chiudi</button>', '');
  return `<div class="sh-body"><h2 class="t-l" id="shTitle">Il tuo pass</h2><div class="mt12">${passBig(v)}</div><p class="sm" style="text-align:center;margin:12px 0 0">Mostralo all'ingresso: lo staff lo legge dal telefono.</p>${tStatus(t) !== 'done' ? `<p style="text-align:center;margin:4px 0 0"><button class="link danger-link" data-a="visCancelOpen" data-tid="${t.id}">Annulla l'iscrizione da visitatore</button></p>` : ''}</div>` + foot('<button class="btn btn-ghost" data-a="closeSheet">Chiudi</button>', '');
}
function tdConfHtml() {
  const x = S.tds.find(y => y.id === SH.id), p = PL(x.uid), times = TD_TIMES[x.slot] || TD_TIMES.free;
  const busy = tm => S.tds.filter(y => y.tid === x.tid && y.id !== x.id && y.status === 'ok' && y.time === tm).length >= TD_CARS;
  return `<div class="sh-body"><h2 class="t-l" id="shTitle">${x.status === 'ok' ? "Cambia l'orario" : "Conferma l'orario"}</h2><p class="sm mt4">${esc(p.f + ' ' + p.l)}, ${esc(tdModel(x))}. Preferisce ${x.slot === 'free' ? 'un orario in cui non gioca' : TD_SLOT_S[x.slot]}.</p><div class="slot-chips mt16" role="radiogroup" aria-label="Orario del test drive">${times.map(tm => `<button class="chip" role="radio" data-a="tdConfPick" data-v="${tm}" aria-checked="${SH.time === tm}"${busy(tm) ? ' aria-disabled="true"' : ''}>${tm}</button>`).join('')}</div><p class="sm mt12">${times.some(busy) ? 'Gli orari barrati sono già pieni. ' : ''}Nel prototipo ci sono ${TD_CARS} auto per ogni turno di mezz'ora.</p><p class="sc-err" id="tcErr" role="alert"></p></div>` + foot('<button class="btn btn-primary" data-a="tdConfSave">Conferma orario</button>');
}
function codeHtml() {
  const cities = TAPPE.map(t => t.city).sort((a, b) => a.localeCompare(b));
  return `<div class="sh-body"><h2 class="t-l" id="shTitle">Nuovo codice di ingresso</h2><p class="sm mt4">Per una concessionaria MINI: lo manda ai clienti che invita a giocare.</p><label class="fld"><span>Concessionaria</span><input class="f-in" id="cD" maxlength="50" placeholder="Es. Concessionaria Verona" autocomplete="off"></label><label class="fld"><span>Città</span><select class="f-in" id="cCity">${cities.map(c => `<option${c === 'Milano' ? ' selected' : ''}>${c}</option>`).join('')}</select></label><div class="fld"><span>Inviti disponibili</span><div class="seg full" role="group" aria-label="Inviti disponibili">${[20, 30, 40, 50].map(n => `<button data-a="codeMax" data-v="${n}" aria-pressed="${SH.max === n}">${n}</button>`).join('')}</div></div><p class="sc-err" id="cErr" role="alert"></p></div>` + foot('<button class="btn btn-primary" data-a="codeSave">Crea codice</button>');
}

/* ================= actions ================= */
const A = {
  tab: d => { closeSheet(); nav = [{ s: d.t }]; render(); },
  tabNext: () => { closeSheet(); nav = [{ s: 'tappe', f: 'next' }]; render(); },
  go: d => { const e = { s: d.s }; ['tid', 'gi', 'mid'].forEach(k => { if (d[k] != null) e[k] = +d[k]; }); if (d.k) e.k = d.k; if (d.tab) e.tab = d.tab; closeSheet(); go(e); },
  back: () => back(),
  pwToggle: () => { const o = top().s === 'login' ? top() : SU; o.show = !o.show; rerender(); const f = phone.querySelector('[data-f="pw"]'); if (f) { f.focus(); f.setSelectionRange(f.value.length, f.value.length); } },
  forgot: () => toast('Ti abbiamo mandato un link per scegliere una nuova password'),
  loginSave: () => loginSave(),
  suBack: () => { if (SU && SU.step > 0) { SU.step--; render('pop'); } else back(); },
  suNext: () => suNext(),
  suResend: () => toast(`Nuovo codice inviato a ${SU.email}`),
  suSet: d => { SU[d.key] = d.key === 'lvl' ? +d.v : d.v; rerender(); },
  suCheck: d => { SU[d.key] = !SU[d.key]; rerender(); },
  regStart: d => startReg(+d.tid),
  regBack: () => { if (REG && REG.step > 0) { REG.step--; render('pop'); } else A.regExit(); },
  regExit: () => { SH = { kind: 'exit' }; openSheet(`<div class="sh-body"><h2 class="t-l" id="shTitle">Vuoi interrompere l'iscrizione?</h2><p class="body mt8">I dati inseriti finora non verranno salvati.</p></div>` + foot('<button class="btn btn-danger" data-a="regExitConfirm">Interrompi iscrizione</button>', `<button class="btn btn-text" data-a="closeSheet">Continua l'iscrizione</button>`)); },
  regExitConfirm: () => { REG = null; closeSheet(); back(); },
  regSet: (d, el) => {
    if (el.getAttribute('aria-disabled') === 'true') { toast('Sei già iscritto in questa categoria'); return; }
    REG[d.key] = d.v; rerender();
  },
  regCheck: d => { REG[d.key] = !REG[d.key]; rerender(); },
  regUpload: () => { REG.certFile = true; rerender(); toast('Certificato caricato'); },
  regNext: () => regNext(),
  regGoStep: d => { REG.step = +d.v; render('pop'); },
  okClose: () => { nav.pop(); render('pop'); },
  unregOpen: d => { const t = T(+d.tid); SH = { kind: 'unreg', tid: +d.tid, k: d.k }; openSheet(`<div class="sh-body"><h2 class="t-l" id="shTitle">Annullare l'iscrizione a ${esc(t.city)}?</h2><p class="body mt8">Liberi il posto per un'altra coppia. Puoi fare di nuovo richiesta fino al ${dNum(regCloseDate(t))}.</p></div>` + foot('<button class="btn btn-danger" data-a="unregConfirm">Annulla iscrizione</button>', '<button class="btn btn-text" data-a="closeSheet">Mantieni iscrizione</button>')); },
  unregConfirm: () => { const td = unregister(SH.tid, SH.k); save(); closeSheet(); rerender(); toast(td ? 'Iscrizione e test drive annullati' : 'Iscrizione annullata'); },
  notif: () => {
    SH = { kind: 'notif' };
    const r = role(), live = liveTappa(), items = [];
    const it = (attrs, ic, b, s) => `<button class="notif" ${attrs}><span class="tile">${I(ic)}</span><span><b>${esc(b)}</b><span class="sm">${esc(s)}</span></span></button>`;
    if (r === 'visitor') {
      S.tds.filter(x => x.uid === S.me && x.status === 'ok' && tStatus(T(x.tid)) !== 'done').forEach(x => items.push(it(`data-a="go" data-s="td" data-tid="${x.tid}"`, 'car', 'Test drive confermato', `${tdModel(x)} alle ${x.time}, ${tStatus(T(x.tid)) === 'live' ? 'oggi' : dShort(T(x.tid).start).toLowerCase()} a ${T(x.tid).city}.`)));
      const v = live && myVisit(live.id);
      if (v) items.push(it(`data-a="passShow" data-tid="${live.id}"`, 'ticket', `${live.city} si gioca oggi`, `Mostra il pass ${v.pass} all'ingresso di ${live.club}.`));
      const o = TAPPE.find(t => tStatus(t) === 'open' && !myVisit(t.id));
      if (o) items.push(it(`data-a="go" data-s="tappa" data-tid="${o.id}"`, 'cal', `Iscrizioni aperte a ${o.city}`, `Ingresso gratuito per i visitatori, ${dShort(o.start).toLowerCase()}.`));
    } else if (r === 'staff') {
      TAPPE.filter(t => ['live', 'open'].includes(tStatus(t))).forEach(t => { const n = S.tds.filter(x => x.tid === t.id && x.status === 'pre').length; if (n) items.push(it(`data-a="go" data-s="pubblico" data-tid="${t.id}"`, 'car', `${t.city}: ${n} test drive da confermare`, 'Scegli un orario per ciascuno: ricevono una notifica.')); });
      S.codes.filter(c => c.on && c.used >= c.max).forEach(c => items.push(it('data-a="go" data-s="codes"', 'key', `Inviti finiti: ${c.dealer}`, `Ha usato ${c.used} inviti su ${c.max}. Aggiungine altri se servono.`)));
      if (live) items.push(it(`data-a="go" data-s="tappa" data-tid="${live.id}"`, 'grid', `${live.city}, gironi in corso`, `${tappaTotals(live).played} di ${tappaTotals(live).total} partite dei gironi giocate.`));
    } else {
      const me = live ? myGroupInfo(live) : null, mine = myRegs().find(x => tStatus(x.t) === 'open');
      if (me && me.gi != null) items.push(it(`data-a="go" data-s="girone" data-tid="${live.id}" data-k="${me.C.k}" data-gi="${me.gi}"`, 'grid', `${live.city}, girone ${LETTERS[me.gi]}`, `Classifica aggiornata: sei ${me.pos}° nel girone.`));
      if (mine) items.push(it(`data-a="go" data-s="tappa" data-tid="${mine.t.id}"`, 'cal', `${mine.t.city}, ${mine.status === 'ok' ? 'iscrizione confermata' : 'iscrizione in attesa'}`, `Coppie e gironi escono dopo il ${dNum(regCloseDate(mine.t))}.`));
      else { const o = TAPPE.find(t => tStatus(t) === 'open'); if (o) items.push(it(`data-a="go" data-s="tappa" data-tid="${o.id}"`, 'cal', `Iscrizioni aperte a ${o.city}`, `Chiudono il ${dNum(regCloseDate(o))}.`)); }
    }
    openSheet(`<div class="sh-body"><h2 class="t-l" id="shTitle">Notifiche</h2>${items.length ? items.join('') : '<p class="body mt8">Nessuna notifica nuova.</p>'}</div>` + foot('<button class="btn btn-ghost" data-a="closeSheet">Chiudi</button>', ''));
  },
  consents: () => {
    const html = () => {
      const r = role(), c = USER().consents || {};
      const row = (key, tx, s) => `<div class="set" style="padding:12px 0"><div class="tx"><b>${tx}</b><span>${s}</span></div><button class="switch" role="switch" aria-checked="${!!c[key]}" aria-label="${tx}" data-a="consentToggle" data-key="${key}"></button></div>`;
      const note = r === 'visitor' ? 'Nome ed email li vede solo lo staff. I dati della patente li vedono solo lo staff e la concessionaria del test drive.' : r === 'staff' ? "Come staff vedi i dati di giocatori e visitatori solo per gestire il circuito." : "Nome e livello li vedono solo gli iscritti alle tue stesse tappe. L'elenco dei partecipanti delle altre tappe non è visibile a nessun giocatore.";
      const rows = r === 'visitor' ? row('dealer', 'Contatto da MINI', 'Dalla concessionaria più vicina, per novità e offerte') + row('partners', 'Offerte dei partner', 'Vantaggi riservati agli iscritti') + row('photo', 'Foto e video delle tappe', 'Pubblicazione di foto in cui compari') + row('news', 'Novità dal circuito', 'Comunicazioni da MINI Padel League')
        : r === 'staff' ? row('news', 'Novità dal circuito', 'Comunicazioni da MINI Padel League')
        : row('dealer', 'Contatto da MINI', 'Dalla concessionaria più vicina, per novità, offerte e test drive') + row('partners', 'Offerte dei partner', 'Vantaggi riservati agli iscritti') + row('screen', 'Schermi in sede', 'Nome e foto sugli schermi durante le tappe; senza consenso compaiono le iniziali') + row('photo', 'Foto e video delle tappe', 'Pubblicazione di foto in cui compari') + row('news', 'Novità dal circuito', 'Comunicazioni da MINI Padel League');
      return `<div class="sh-body"><h2 class="t-l" id="shTitle">Consensi e privacy</h2><div class="pnote mt12">${I('lock')}<span>${note}</span></div>${rows}<p class="sm mt12">Informativa sulla privacy: presa visione alla registrazione. Puoi chiedere la cancellazione dell'account allo staff in qualsiasi momento.</p><button class="link mt8" data-a="privacyInfo">Leggi l'informativa</button></div>` + foot('<button class="btn btn-ghost" data-a="closeSheet">Chiudi</button>', '');
    };
    SH = { kind: 'consents', html }; openSheet(html());
  },
  consentToggle: d => { const c = USER().consents; c[d.key] = !c[d.key]; save(); updateSheet(SH.html()); toast(c[d.key] ? 'Consenso attivato' : 'Consenso revocato'); },
  follow: d => { const id = +d.tid, t = T(id), on = !S.follow.includes(id); S.follow = on ? [...S.follow, id] : S.follow.filter(x => x !== id); save(); rerender(); toast(on ? `Segui la tappa di ${t.city}: ti avvisiamo per iscrizioni, orari e risultati` : `Non segui più la tappa di ${t.city}`); },
  cat: d => { const e = top(); e.k = d.k; e.brx = 0; rerender(); },
  sub: d => { top().tab = d.tab; rerender(); },
  filt: d => { top().f = d.v; rerender(); },
  rkCat: d => { top().k = d.k; rerender(); },
  cercaF: d => { top().f = d.v; rerender(); },
  scOpen: d => { if (S.org) openScore(d); },
  scSave: () => scSave(),
  scClear: () => scClear(),
  brOpen: d => openBracketSheet(+d.tid, d.k),
  brConfirm: () => brConfirm(),
  brScroll: d => { const w = document.getElementById('brWrap'); if (w) w.scrollTo({ left: +d.x, behavior: matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth' }); },
  cfgN: (d, el) => {
    if (el.getAttribute('aria-disabled') === 'true') { toast(+d.d < 0 ? 'Ogni girone può avere al massimo 6 coppie' : 'Ogni girone deve avere almeno 3 coppie'); return; }
    const [lo, hi] = nBounds(catData(DRAFT.tid, DRAFT.k).pairs.length); DRAFT.cfg.n = Math.min(hi, Math.max(lo, DRAFT.cfg.n + +d.d)); regenDraft(); rerender();
  },
  cfgQ: d => { DRAFT.cfg.q = +d.v; rerender(); },
  cfgFmt: d => { DRAFT.cfg.fmt = d.v; rerender(); },
  cfgMethod: d => { if (DRAFT.cfg.method === d.v) return; DRAFT.cfg.method = d.v; regenDraft(); rerender(); },
  reshuffle: () => { DRAFT.cfg.seed++; regenDraft(); rerender(); toast('Nuovo sorteggio fatto'); },
  pick: d => {
    const id = +d.id, D = DRAFT;
    if (D.sel == null || D.sel === id) { D.sel = D.sel === id ? null : id; rerender(); return; }
    const ga = D.groups.findIndex(g => g.includes(D.sel)), gb = D.groups.findIndex(g => g.includes(id));
    if (ga === gb) { D.sel = id; rerender(); return; }
    D.groups[ga][D.groups[ga].indexOf(D.sel)] = id; D.groups[gb][D.groups[gb].indexOf(id)] = D.sel; D.sel = null;
    rerender(); toast(`Coppie scambiate tra girone ${LETTERS[ga]} e girone ${LETTERS[gb]}`);
  },
  moveHere: d => {
    const D = DRAFT, to = +d.gi, from = D.groups.findIndex(g => g.includes(D.sel));
    if (D.groups[from].length <= 3) { toast('Ogni girone deve avere almeno 3 coppie'); return; }
    if (D.groups[to].length >= 6) { toast('Ogni girone può avere al massimo 6 coppie'); return; }
    D.groups[from] = D.groups[from].filter(x => x !== D.sel); D.groups[to].push(D.sel); D.sel = null;
    rerender(); toast(`Coppia spostata nel girone ${LETTERS[to]}`);
  },
  publish: () => publish(),
  pubConfirm: () => applyPublish(),
  addOpen: d => openAdd(+d.tid, d.k),
  addLvl: (d, el) => { SH.lvl = d.v; el.parentNode.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b === el ? 'true' : 'false')); },
  addSave: () => addSave(),
  rmOpen: d => openRm(+d.tid, d.k, +d.id),
  rmConfirm: () => { const C = catData(SH.tid, SH.k), pl = PL(SH.id); C.players = C.players.filter(x => x !== SH.id); S.regs = S.regs.filter(r => !(r.uid === SH.id && r.tid === SH.tid && r.k === SH.k)); save(); closeSheet(); rerender(); toast(`${pl.f} ${pl.l} rimosso dagli iscritti`); },
  addG: (d, el) => { SH.g = d.v; el.parentNode.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b === el ? 'true' : 'false')); },
  drawMethod: d => { if (DRAW.method === d.v) return; DRAW.method = d.v; rerender(); },
  drawShuffle: () => { DRAW.seed++; rerender(); toast('Nuova estrazione fatta'); },
  drawConfirm: () => {
    const C = catData(DRAW.tid, DRAW.k);
    if (!C.groups && !Object.keys(C.sc).length) return drawApply();
    SH = { kind: 'redraw' };
    openSheet(`<div class="sh-body"><h2 class="t-l" id="shTitle">Rifare l'estrazione?</h2><p class="body mt8">Verranno cancellati gironi e risultati del ${CAT(DRAW.k).l.toLowerCase()} di ${esc(T(DRAW.tid).city)}. I giocatori ricevono una notifica con il nuovo compagno.</p></div>` + foot('<button class="btn btn-primary" data-a="drawApply">Conferma estrazione</button>'));
  },
  drawApply: () => drawApply(),
  set: d => { setK(d.key, !getK(d.key)); save(); rerender(); },
  seg: d => { setK(d.key, d.v); save(); rerender(); },
  join: d => { const id = +d.mid, on = !S.joined[id]; S.joined[id] = on; save(); rerender(); toast(on ? "Ti sei unito alla partita. Ti ricordiamo l'orario 2 ore prima" : 'Hai lasciato la partita'); },
  demoFill: () => demoFill(),
  demoReset: () => demoReset(),
  logout: () => { logoutState(); save(); closeSheet(); nav = [{ s: 'welcome' }]; render(); },
  partner: d => { const wasOpen = sheetWrap.classList.contains('open'); SH = { kind: 'partner', id: d.id }; if (wasOpen) updateSheet(partnerSheet(d.id)); else openSheet(partnerSheet(d.id)); },
  offerNew: d => { SH = { kind: 'offer', id: d.id }; updateSheet(offerForm(d.id)); setTimeout(() => { const f = document.getElementById('oT'); if (f) f.focus(); }, 60); },
  offerSave: () => {
    const title = document.getElementById('oT').value.trim(), body = document.getElementById('oB').value.trim(), code = document.getElementById('oC').value.trim().toUpperCase().replace(/[^A-Z0-9-]/g, '');
    if (title.length < 3) return showErr('oErr', "Scrivi un titolo per l'offerta.");
    if (body.length < 10) return showErr('oErr', 'Aggiungi una descrizione: cosa ottiene chi è iscritto e come usarla.');
    S.offers.push({ id: Date.now(), pid: SH.id, title, body, code });
    const id = SH.id; save(); SH = { kind: 'partner', id }; updateSheet(partnerSheet(id)); rerender(); toast('Offerta pubblicata: la vedono tutti gli iscritti');
  },
  offerDel: d => { const id = SH.id; S.offers = S.offers.filter(o => o.id !== +d.oid); save(); updateSheet(partnerSheet(id)); rerender(); toast('Offerta eliminata'); },
  copyCode: d => { const c = d.code; try { navigator.clipboard.writeText(c).then(() => toast('Codice copiato'), () => toast(`Il codice è ${c}`)); } catch (e) { toast(`Il codice è ${c}`); } },
  regCrit: d => {
    const k = d.key, on = !REG.prof[k]; REG.prof[k] = on;
    if (k === 'mini' && on && !REG.prof.car) REG.prof.car = 'MINI';
    rerender();
    if (on) setTimeout(() => { const b = phone.querySelector(`[data-a="regCrit"][data-key="${k}"]`); const f = b && b.closest('.opt-wrap').querySelector('input'); if (f) f.focus({ preventScroll: true }); }, 30);
  },
  regProf: d => { REG.prof[d.key] = REG.prof[d.key] === d.v ? '' : d.v; if (d.key === 'car' && REG.prof.car !== d.v) REG.prof.change = ''; if (d.key === 'car' && (d.v === 'MINI' || d.v === "Non ho un'auto")) REG.prof.change = ''; rerender(); },
  approveMine: () => approveMine(),
  reqOk: d => { const r = S.regs[+d.ri], u = PL(r.uid); approveReg(r); save(); rerender(); toast(`Iscrizione confermata: ${u.f} ${u.l} riceve una notifica`); },
  reqNo: d => { const r = S.regs[+d.ri], u = PL(r.uid); SH = { kind: 'reqNo', ri: +d.ri }; openSheet(`<div class="sh-body"><h2 class="t-l" id="shTitle">Rifiutare la richiesta di ${esc(u.f + ' ' + u.l)}?</h2><p class="body mt8">Riceve un messaggio: la richiesta per questa tappa non è stata accettata. I suoi dati restano visibili solo allo staff.</p></div>` + foot('<button class="btn btn-danger" data-a="reqNoConfirm">Rifiuta richiesta</button>')); },
  reqNoConfirm: () => { const r = S.regs[SH.ri]; r.status = 'no'; save(); closeSheet(); rerender(); toast('Richiesta rifiutata'); },
  rule: d => { S.rules[d.key] = !S.rules[d.key]; save(); rerender(); },
  ruleSeg: d => { S.rules[d.key] = d.v; save(); rerender(); },
  regLc: d => { REG.lc[d.key] = REG.lc[d.key] === d.v && d.key !== 'lvl' ? '' : d.v; rerender(); },
  insInfo: () => { SH = { kind: 'ins' }; openSheet(`<div class="sh-body"><h2 class="t-l" id="shTitle">Assicurazione gratuita</h2><p class="body mt8">Stiamo definendo l'accordo con la compagnia: le condizioni complete le pubblichiamo qui appena il contratto è firmato.</p><div class="sumlist mt16"><div class="srow"><div><span class="sm">Compagnia</span><b>${esc((S.rules.insurer || '').trim() || 'Da definire')}</b></div></div><div class="srow"><div><span class="sm">Cosa copre</span><b>Infortuni durante la giornata di gioco</b></div></div><div class="srow"><div><span class="sm">Costo per te</span><b>Nessuno, è gratuita</b></div></div><div class="srow"><div><span class="sm">Dati che servono</span><b>Nome, cognome e codice fiscale</b></div></div></div></div>` + foot('<button class="btn btn-ghost" data-a="closeSheet">Chiudi</button>', '')); },
  photo: () => { SH = { kind: 'photo' }; openSheet(photoSheet()); },
  pickPhoto: d => { PHOTO_TARGET = d.target || 'user'; const f = document.getElementById('photoIn'); if (f) f.click(); },
  dropPhoto: d => {
    if (d.target === 'su') { SU.pic = null; rerender(); toast('Foto rimossa'); return; }
    delete USER().photo; save(); if (SH && SH.kind === 'photo') updateSheet(photoSheet()); rerender(); toast('Foto profilo rimossa');
  },
  toWelcome: () => { closeSheet(); SU = null; nav = [{ s: 'welcome' }]; render('pop'); },
  pickRole: d => { if (d.r === 'staff') { go({ s: 'login', staff: true }); return; } SU = newSU(d.r); go({ s: 'signup' }); },
  codeHelp: () => { SH = { kind: 'codehelp' }; openSheet(`<div class="sh-body"><h2 class="t-l" id="shTitle">Non hai un codice?</h2><p class="body mt8">Si gioca su invito: il codice di ingresso lo danno le concessionarie MINI ai clienti che invitano. Chiedilo alla tua concessionaria.</p><p class="body mt8">Intanto puoi registrarti come visitatore: vieni a vedere le tappe e prenoti un test drive. Se poi ricevi un codice, lo inserisci dal profilo e diventi giocatore.</p></div>` + foot('<button class="btn btn-primary" data-a="codeHelpVis">Registrati come visitatore</button>', '<button class="btn btn-text" data-a="closeSheet">Ho un codice</button>')); },
  codeHelpVis: () => { closeSheet(); SU = newSU('visitor'); nav = [{ s: 'welcome' }, { s: 'signup' }]; render('push'); },
  privacyInfo: () => {
    const vis = (SU && SU.role === 'visitor') || isVis();
    SH = { kind: 'privacy' };
    openSheet(`<div class="sh-body"><h2 class="t-l" id="shTitle">Informativa sulla privacy</h2><div class="warn">${I('alert')}<span>Testo provvisorio: l'informativa definitiva la prepariamo con il consulente privacy, e potrà cambiare cosa chiediamo.</span></div><div class="sumlist mt16"><div class="srow"><div><span class="sm">Titolare del trattamento</span><b>Da definire</b></div></div><div class="srow"><div><span class="sm">Dati obbligatori</span><b>${vis ? 'Nome, cognome ed email. La patente solo se prenoti un test drive.' : 'Nome, cognome, email, codice di ingresso; per iscriversi a una tappa anche livello, taglia, tessera FITP e certificato medico.'}</b></div></div><div class="srow"><div><span class="sm">Perché li chiediamo</span><b>${vis ? 'Gestire le visite alle tappe e i test drive' : 'Gestire iscrizioni, coppie, gironi e risultati'}</b></div></div><div class="srow"><div><span class="sm">Facoltativi</span><b>${vis ? 'Contatto da MINI, offerte dei partner, foto e novità' : 'Profilo, foto, test drive, contatto da MINI e offerte dei partner'}</b></div></div></div></div>` + foot('<button class="btn btn-ghost" data-a="closeSheet">Chiudi</button>', ''));
  },
  regSkip: () => { const pr = REG.prof; if (pr.plate && !plateOk(pr.plate)) pr.plate = ''; if (pr.vat && !vatOk(pr.vat)) pr.vat = ''; REG.step++; render('push'); },
  visStart: d => {
    const tid = +d.tid, t = T(tid);
    if (!['open', 'live'].includes(tStatus(t))) { toast('Le iscrizioni a questa tappa non sono aperte'); return; }
    closeSheet();
    if (myVisit(tid)) { go({ s: 'td', tid }); return; }
    VIS = newVIS(tid, d.td === '1'); go({ s: 'visita' });
  },
  visSet: d => { VIS[d.key] = d.v; const err = document.getElementById('formErr'); if (err) err.textContent = ''; rerender(); },
  visGuests: (d, el) => { if (el.getAttribute('aria-disabled') === 'true') { toast(+d.d < 0 ? 'Nessun ospite: vieni da solo' : 'Al massimo 3 ospiti per iscrizione'); return; } VIS.guests = Math.max(0, Math.min(3, VIS.guests + +d.d)); rerender(); },
  visCheck: d => { VIS[d.key] = !VIS[d.key]; rerender(); },
  visSave: () => visSave(),
  passShow: d => { const h = passSheet(+d.tid); SH = { kind: 'pass', tid: +d.tid }; if (sheetWrap.classList.contains('open')) updateSheet(h); else openSheet(h); },
  visCancelOpen: d => { const t = T(+d.tid); SH = { kind: 'viscancel', tid: t.id }; (sheetWrap.classList.contains('open') ? updateSheet : openSheet)(`<div class="sh-body"><h2 class="t-l" id="shTitle">Annullare l'iscrizione a ${esc(t.city)}?</h2><p class="body mt8">Il pass non sarà più valido${myTd(t.id) ? ' e annulliamo anche il test drive' : ''}. Puoi iscriverti di nuovo finché la tappa è aperta.</p></div>` + foot("<button class=\"btn btn-danger\" data-a=\"visCancel\">Annulla l'iscrizione</button>", "<button class=\"btn btn-text\" data-a=\"closeSheet\">Mantieni l'iscrizione</button>")); },
  visCancel: () => { const tid = SH.tid; S.visits = S.visits.filter(v => !(v.uid === S.me && v.tid === tid)); S.tds = S.tds.filter(x => !(x.uid === S.me && x.tid === tid)); save(); closeSheet(); rerender(); toast('Iscrizione da visitatore annullata'); },
  tdToggle: () => { const o = top().s === 'iscr' ? REG : VIS; if (!o) return; o.tdOn = !o.tdOn; rerender(); },
  tdSet: d => { const o = tdObj(); if (!o) return; o[d.key] = d.v; const err = document.getElementById('formErr'); if (err) err.textContent = ''; rerender(); },
  tdPhoto: () => { const o = tdObj(); if (!o) return; const had = o.photo; o.photo = true; rerender(); toast(had ? 'Foto della patente sostituita' : 'Foto della patente caricata'); },
  tdSave: () => tdSave(),
  tdEdit: () => { if (TDF) { TDF.edit = true; render('push'); } },
  tdEditCancel: () => { TDF = null; render('pop'); },
  tdCancelOpen: () => { SH = { kind: 'tdcancel' }; openSheet(`<div class="sh-body"><h2 class="t-l" id="shTitle">Annullare il test drive?</h2><p class="body mt8">Liberi l'orario per un'altra persona. Puoi prenotarne un altro finché ci sono posti.</p></div>` + foot('<button class="btn btn-danger" data-a="tdCancel">Annulla il test drive</button>', '<button class="btn btn-text" data-a="closeSheet">Mantieni il test drive</button>')); },
  tdCancel: () => { const tid = top().tid; S.tds = S.tds.filter(x => !(x.uid === S.me && x.tid === tid)); TDF = null; save(); closeSheet(); back(); toast('Test drive annullato'); },
  tdConfOpen: d => { const x = S.tds.find(y => y.id === +d.id); if (!x) return; SH = { kind: 'tdconf', id: x.id, time: x.time || null }; openSheet(tdConfHtml()); },
  tdConfPick: (d, el) => { if (el.getAttribute('aria-disabled') === 'true') { toast('Orario pieno: scegline un altro'); return; } SH.time = d.v; updateSheet(tdConfHtml()); },
  tdConfSave: () => {
    if (!SH.time) return showErr('tcErr', 'Scegli un orario per il test drive.');
    const x = S.tds.find(y => y.id === SH.id), p = PL(x.uid), changed = x.status === 'ok';
    x.status = 'ok'; x.time = SH.time; save(); closeSheet(); rerender();
    toast(`${changed ? 'Orario cambiato' : 'Test drive confermato'} alle ${x.time}: ${p.f} ${p.l} riceve una notifica`);
  },
  pubSeg: d => { top().v = d.v; rerender(); },
  codeNew: () => { SH = { kind: 'code', max: 30 }; openSheet(codeHtml(), '#cD'); },
  codeMax: (d, el) => { SH.max = +d.v; el.parentNode.querySelectorAll('button').forEach(b => b.setAttribute('aria-pressed', b === el ? 'true' : 'false')); },
  codeSave: () => {
    const dealer = document.getElementById('cD').value.trim().replace(/\s+/g, ' '), city = document.getElementById('cCity').value;
    if (dealer.length < 3) return showErr('cErr', 'Scrivi il nome della concessionaria.');
    if (S.codes.some(c => c.dealer.toLowerCase() === dealer.toLowerCase())) return showErr('cErr', 'Questa concessionaria ha già un codice: aggiungi inviti al codice esistente.');
    const code = newCode(city);
    S.codes.unshift({ code, dealer, city, max: SH.max, used: 0, on: true });
    save(); closeSheet(); rerender(); toast(`Codice ${fmtCode(code)} creato per ${dealer}`);
  },
  codeToggle: d => { const c = S.codes[+d.i]; c.on = !c.on; save(); rerender(); toast(c.on ? `Codice di ${c.dealer} riattivato` : `Codice di ${c.dealer} disattivato: nessun nuovo giocatore può usarlo`); },
  codeMore: d => { const c = S.codes[+d.i]; c.max += 10; save(); rerender(); toast(`10 inviti in più per ${c.dealer}: ora sono ${c.max}`); },
  upgradeOpen: () => { SH = { kind: 'upgrade' }; openSheet(`<div class="sh-body"><h2 class="t-l" id="shTitle">Diventa giocatore</h2><p class="body mt8">Inserisci il codice di ingresso che hai ricevuto dalla concessionaria. Restano valide le tue visite e i test drive.</p><label class="fld"><span>Codice di ingresso</span><input class="f-in" id="upCode" maxlength="11" placeholder="MPL-XX-XXXX" autocomplete="off"></label><p class="demo-note">Nel prototipo puoi usare il codice MPL-MI-7K2Q.</p><p class="sc-err" id="upErr" role="alert"></p></div>` + foot('<button class="btn btn-primary" data-a="upgradeSave">Conferma il codice</button>'), '#upCode'); },
  upgradeSave: () => {
    const res = codeCheck(document.getElementById('upCode').value);
    if (res.err) return showErr('upErr', res.err);
    const c = res.c, u = USER(), p = ME();
    c.used++;
    Object.assign(u, { role: 'player', code: c.code, dealer: c.dealer, hand: u.hand || 'dx', side: u.side || 'both', lvl: 3.4 }); p.lv = 3.4;
    S.org = false; save(); closeSheet(); nav = [{ s: 'profilo' }]; render();
    toast(`Codice valido: ora sei un giocatore, con l'invito di ${c.dealer}`);
  },
  closeSheet: () => closeSheet(),
};
let PHOTO_TARGET = 'user';
function handlePhoto(file) {
  if (!file) return;
  if (!/^image\//.test(file.type)) return showErr('phErr', "Il file non è un'immagine: scegli una foto JPG o PNG.");
  if (file.size > 15e6) return showErr('phErr', 'La foto è troppo grande: scegline una sotto i 15 MB.');
  const url = URL.createObjectURL(file), img = new Image();
  img.onload = () => {
    const s = Math.min(img.naturalWidth, img.naturalHeight), c = document.createElement('canvas');
    c.width = c.height = 320;
    c.getContext('2d').drawImage(img, (img.naturalWidth - s) / 2, (img.naturalHeight - s) / 2, s, s, 0, 0, 320, 320);
    URL.revokeObjectURL(url);
    const data = c.toDataURL('image/jpeg', 0.85);
    if (PHOTO_TARGET === 'su' && SU) { SU.pic = data; rerender(); toast('Foto aggiunta'); return; }
    USER().photo = data; save();
    if (SH && SH.kind === 'photo') updateSheet(photoSheet());
    rerender(); toast('Foto profilo aggiornata');
  };
  img.onerror = () => { URL.revokeObjectURL(url); showErr('phErr', "Non riusciamo a leggere questa immagine: prova con un'altra foto."); };
  img.src = url;
}
phone.addEventListener('change', ev => {
  if (ev.target.id === 'photoIn') { handlePhoto(ev.target.files[0]); ev.target.value = ''; }
  if (ev.target.matches('[data-f="insurer"]')) { save(); toast('Nome della compagnia salvato'); }
});

phone.addEventListener('click', ev => {
  const el = ev.target.closest('[data-a]');
  if (!el || !phone.contains(el)) return;
  const fn = A[el.dataset.a];
  if (fn) { ev.preventDefault(); fn(el.dataset, el); }
});
function formObj() { const s = top().s; return s === 'login' ? top() : s === 'signup' ? SU : s === 'iscr' ? REG : s === 'rules' ? S.rules : s === 'visita' ? VIS : null; }
const fmtCodeInput = v => fmtCode(normCode(v).slice(0, 9));
phone.addEventListener('input', ev => {
  const el = ev.target;
  if (el.matches('[data-input="q"]')) { const e = top(); e.q = el.value; const box = document.getElementById('cercaRes'); if (box) box.innerHTML = cercaResults(e); return; }
  if (el.matches('[data-otp]')) {
    const i = +el.dataset.otp, digits = el.value.replace(/\D/g, '');
    if (digits.length > 1) { digits.slice(0, 6 - i).split('').forEach((c, j) => { SU.otp[i + j] = c; }); rerender(); }
    else { el.value = digits; SU.otp[i] = digits; if (digits) { const nx = phone.querySelector(`[data-otp="${i + 1}"]`); if (nx) nx.focus(); } }
    const err = document.getElementById('formErr'); if (err) err.textContent = '';
    if (SU.otp.join('').length === 6) setTimeout(() => { if (SU && suKey() === 'otp' && SU.otp.join('').length === 6) suNext(); }, 250);
    return;
  }
  if (el.matches('[data-f]')) {
    const o = formObj(), f = el.dataset.f;
    if (f === 'prof.plate') el.value = el.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 7);
    if (f === 'prof.vat') el.value = el.value.replace(/\D/g, '').slice(0, 11);
    if (f === 'cf') el.value = el.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 16);
    if (f === 'code') el.value = fmtCodeInput(el.value);
    if (f === 'fitpNum' || f === 'td.num') el.value = el.value.toUpperCase().replace(/[^A-Z0-9]/g, '').slice(0, 12);
    if (f === 'td.exp') { const d = el.value.replace(/\D/g, '').slice(0, 6); el.value = d.length > 2 ? d.slice(0, 2) + '/' + d.slice(2) : d; }
    if (f === 'td.phone') el.value = el.value.replace(/[^\d+ ]/g, '').slice(0, 16);
    if (f.startsWith('td.')) { const d = tdObj(); if (d) d[f.slice(3)] = el.value; }
    else if (o && f.startsWith('prof.')) o.prof[f.slice(5)] = el.value;
    else if (o) o[f] = el.value;
    if (f === 'code') codeLive(el.value);
    const err = document.getElementById('formErr'); if (err) err.textContent = '';
    return;
  }
  if (el.matches('#upCode')) { el.value = fmtCodeInput(el.value); const err = document.getElementById('upErr'); if (err) err.textContent = ''; return; }
  if (el.matches('#cD')) { const err = document.getElementById('cErr'); if (err) err.textContent = ''; return; }
  if (el.matches('.sc-in')) {
    el.value = el.value.replace(/\D/g, '').slice(0, 2);
    syncStb();
    const err = document.getElementById('scErr'); if (err) err.textContent = '';
    if (+el.dataset.row < 2 && el.value.length >= 1) { const all = [...sheetBox.querySelectorAll('.sc-in')].filter(x => !x.closest('[hidden]')); const nx = all[all.indexOf(el) + 1]; if (nx) { nx.focus(); nx.select(); } }
  }
  if (el.matches('#fA, #fB')) { const err = document.getElementById('fErr'); if (err) err.textContent = ''; }
  if (el.matches('#oT, #oB, #oC')) { const err = document.getElementById('oErr'); if (err) err.textContent = ''; }
});
phone.addEventListener('keydown', ev => {
  const el = ev.target;
  if (ev.key === 'Backspace' && el.matches('[data-otp]') && !el.value) { const pv = phone.querySelector(`[data-otp="${+el.dataset.otp - 1}"]`); if (pv) { pv.focus(); pv.value = ''; SU.otp[+pv.dataset.otp] = ''; ev.preventDefault(); } }
  if (ev.key !== 'Enter') return;
  if (el.matches('.sc-in')) { ev.preventDefault(); scSave(); }
  else if (el.matches('#fA, #fB')) { ev.preventDefault(); addSave(); }
  else if (el.matches('#upCode')) { ev.preventDefault(); A.upgradeSave(); }
  else if (el.matches('#cD')) { ev.preventDefault(); A.codeSave(); }
  else if (el.matches('[data-f]')) { ev.preventDefault(); const s = top().s; if (s === 'login') loginSave(); else if (s === 'signup') suNext(); else if (s === 'iscr') regNext(); else if (s === 'visita') visSave(); else if (s === 'td') tdSave(); }
});
document.addEventListener('keydown', ev => { if (ev.key === 'Escape' && sheetWrap.classList.contains('open')) closeSheet(); });
phone.addEventListener('focusin', ev => { if (ev.target.matches('.sc-in, [data-otp]')) ev.target.select(); });

/* ================= guide panel ================= */
const firstOpenFree = () => TAPPE.find(t => tStatus(t) === 'open' && !myRegs().some(x => x.t.id === t.id));
const asPlayer = () => loginAs('player');
const asVisitor = () => loginAs('visitor');
const asStaff = () => loginAs('staff');
const JUMPS = {
  welcome: () => { logoutState(); SU = null; return [{ s: 'welcome' }]; },
  signupP: () => { logoutState(); SU = newSU('player'); return [{ s: 'welcome' }, { s: 'signup' }]; },
  signupV: () => { logoutState(); SU = newSU('visitor'); return [{ s: 'welcome' }, { s: 'signup' }]; },
  stafflogin: () => { logoutState(); return [{ s: 'welcome' }, { s: 'login', staff: true }]; },
  login: () => { logoutState(); return [{ s: 'welcome' }, { s: 'login' }]; },
  home: () => { asPlayer(); return [{ s: 'home' }]; },
  iscr: () => { asPlayer(); const t = firstOpenFree(); if (!t) return [{ s: 'profilo' }]; REG = newREG(t.id); return [{ s: 'tappe' }, { s: 'tappa', tid: t.id }, { s: 'iscr' }]; },
  mie: () => { asPlayer(); return [{ s: 'profilo' }]; },
  tappe: () => { asPlayer(); return [{ s: 'tappe' }]; },
  mytappa: () => { asPlayer(); const r = myRegs()[0]; return [{ s: 'tappe' }, { s: 'tappa', tid: r ? r.t.id : 21, k: r ? r.c.k : 'M', tab: 'gironi' }]; },
  locked: () => { asPlayer(); const t = TAPPE.find(x => tStatus(x) === 'live' && !canSee(x.id)) || TAPPE.find(x => tStatus(x) === 'done' && !canSee(x.id)) || T(1); return [{ s: 'tappe' }, { s: 'tappa', tid: t.id, tab: 'gironi' }]; },
  girone: () => { asPlayer(); const me = myGroupInfo(liveTappa()); return [{ s: 'tappe' }, { s: 'tappa', tid: 21, k: me ? me.C.k : 'M', tab: 'gironi' }, { s: 'girone', tid: 21, k: me ? me.C.k : 'M', gi: me && me.gi != null ? me.gi : 0 }]; },
  ranking: () => { asPlayer(); return [{ s: 'tappe' }, { s: 'ranking', k: 'M' }]; },
  cerca: () => { asPlayer(); return [{ s: 'cerca' }]; },
  match: () => { asPlayer(); return [{ s: 'cerca' }, { s: 'match', mid: 0 }]; },
  settings: () => { asPlayer(); return [{ s: 'profilo' }, { s: 'settings' }]; },
  partner: () => { asPlayer(); return [{ s: 'home' }, { s: 'partner' }]; },
  photo: () => { asPlayer(); return [{ s: 'profilo' }]; },
  vhome: () => { asVisitor(); return [{ s: 'home' }]; },
  vtappa: () => { asVisitor(); return [{ s: 'tappe' }, { s: 'tappa', tid: 21 }]; },
  visita: () => { asVisitor(); const t = TAPPE.find(x => ['live', 'open'].includes(tStatus(x)) && !myVisit(x.id)); if (!t) return [{ s: 'profilo' }]; VIS = newVIS(t.id); return [{ s: 'tappe' }, { s: 'tappa', tid: t.id }, { s: 'visita' }]; },
  tdrive: () => { asVisitor(); const v = S.visits.find(x => x.uid === S.me && !myTd(x.tid) && ['live', 'open'].includes(tStatus(T(x.tid)))) || S.visits.find(x => x.uid === S.me); return v ? [{ s: 'home' }, { s: 'tappa', tid: v.tid }, { s: 'td', tid: v.tid }] : [{ s: 'home' }]; },
  vprofilo: () => { asVisitor(); return [{ s: 'profilo' }]; },
  shome: () => { asStaff(); return [{ s: 'home' }]; },
  codes: () => { asStaff(); return [{ s: 'home' }, { s: 'codes' }]; },
  pubblico: () => { asStaff(); return [{ s: 'tappe' }, { s: 'tappa', tid: 21 }, { s: 'pubblico', tid: 21 }]; },
  rules: () => { asStaff(); return [{ s: 'profilo' }, { s: 'rules' }]; },
  leads: () => { asStaff(); return [{ s: 'profilo' }, { s: 'leads' }]; },
  crea: () => { asStaff(); DRAFT = null; const C = catData(22, 'M'); if (!C.drawn) { const d = drawPairs(C, 'level', 0); C.pairs = d.pairs.map(([a, b]) => mkPair(C, a, b)); C.reserve = d.reserve; C.drawn = true; } return [{ s: 'tappe' }, { s: 'tappa', tid: 22, k: 'M', tab: 'gironi' }, { s: 'crea', tid: 22, k: 'M' }]; },
  draw: () => { asStaff(); DRAW = null; const k = ['M', 'F', 'X'].find(x => !catData(22, x).drawn) || 'M'; return [{ s: 'tappe' }, { s: 'tappa', tid: 22, k, tab: 'iscritti' }, { s: 'draw', tid: 22, k }]; },
  score: () => { asStaff(); return [{ s: 'tappe' }, { s: 'tappa', tid: 21, k: 'M', tab: 'gironi' }, { s: 'girone', tid: 21, k: 'M', gi: 0 }]; },
  iscritti: () => { asStaff(); return [{ s: 'tappe' }, { s: 'tappa', tid: 22, k: 'M', tab: 'iscritti' }]; },
  genbr: () => { asStaff(); return [{ s: 'tappe' }, { s: 'tappa', tid: 21, k: 'F', tab: 'gironi' }]; },
  tabellone: () => { asStaff(); return [{ s: 'tappe' }, { s: 'tappa', tid: 20, k: 'M', tab: 'tabellone' }]; },
  offers: () => { asStaff(); return [{ s: 'home' }, { s: 'partner' }]; },
  tv: () => { asStaff(); const lt = liveTappa(), C = catData(lt.id, 'M'), lm = scheduleOf(lt, C).find(m => getLive(C, m.a, m.b)); return [{ s: 'tappe' }, { s: 'tappa', tid: lt.id, k: 'M', tab: 'gironi' }, { s: 'girone', tid: lt.id, k: 'M', gi: lm ? lm.g : 0 }]; },
};
function syncIndex() {
  const e = top(); if (!e) return;
  const r = S.session ? role() : null;
  let cur = '';
  if (!r) cur = e.s === 'signup' ? (SU && SU.role === 'visitor' ? 'signupV' : 'signupP') : e.s === 'login' ? (e.staff ? 'stafflogin' : 'login') : e.s;
  else if (e.s === 'ready') cur = r === 'visitor' ? 'signupV' : 'signupP';
  else if (r === 'visitor') cur = { home: 'vhome', tappa: 'vtappa', visita: 'visita', visitaOk: 'visita', td: 'tdrive', profilo: 'vprofilo' }[e.s] || '';
  else if (r === 'staff') {
    cur = { home: 'shome', codes: 'codes', pubblico: 'pubblico', rules: 'rules', leads: 'leads', draw: 'draw', crea: 'crea', partner: 'offers' }[e.s] || '';
    if (e.s === 'tappa') cur = e.tab === 'tabellone' ? 'tabellone' : e.tab === 'iscritti' ? 'iscritti' : '';
  } else {
    cur = { iscrOk: 'iscr', profilo: 'mie' }[e.s] || e.s;
    if (e.s === 'tappa') cur = !canSee(e.tid) ? 'locked' : 'mytappa';
  }
  if (SH && SH.kind === 'score') cur = 'score';
  if (SH && SH.kind === 'bracket') cur = 'genbr';
  if (SH && SH.kind === 'photo' && r === 'player') cur = 'photo';
  document.querySelectorAll('[data-jump]').forEach(b => b.setAttribute('aria-current', b.dataset.jump === cur ? 'true' : 'false'));
  document.querySelectorAll('[data-rolesw]').forEach(b => b.setAttribute('aria-pressed', String(!!r && b.dataset.rolesw === r)));
}
const ROLE_TOAST = { player: 'Vista giocatore: Marco Ricci, entrato con il codice di una concessionaria', visitor: 'Vista visitatore: Laura Fontanesi, iscritta come visitatrice a Milano e Trieste', staff: 'Vista staff: Alessia Pace, vede tutte le tappe e gli strumenti di gestione' };
document.addEventListener('click', ev => {
  const j = ev.target.closest('[data-jump]');
  if (j) {
    closeSheet();
    nav = JUMPS[j.dataset.jump]();
    save(); render('push');
    if (j.dataset.jump === 'score') { const t = liveTappa(), C = catData(t.id, 'M'), ms = scheduleOf(t, C).filter(x => x.g === 0), m = ms.find(x => !getSc(C, x.a, x.b)) || ms[0]; openScore({ kind: 'g', tid: String(t.id), k: 'M', x: String(m.a), y: String(m.b), gi: '0', r: String(m.r) }); }
    if (j.dataset.jump === 'genbr') openBracketSheet(21, 'F');
    if (j.dataset.jump === 'photo') A.photo();
    if (j.dataset.jump === 'tv') { tvOpen(); const b = document.querySelector('[data-jump="tv"]'); if (b) b.setAttribute('aria-current', 'true'); }
    else if (TV.on && !TV.kiosk) tvClose();
    if (window.matchMedia('(max-width:780px)').matches) (j.dataset.jump === 'tv' ? document.getElementById('tvPanel') : phone).scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }
  const rs = ev.target.closest('[data-rolesw]');
  if (rs) {
    const r = rs.dataset.rolesw;
    closeSheet(); loginAs(r); nav = [{ s: 'home' }]; save(); render();
    if (TV.on && !TV.kiosk && r !== 'staff') tvClose();
    toast(ROLE_TOAST[r]);
    if (window.matchMedia('(max-width:780px)').matches) phone.scrollIntoView({ behavior: 'smooth', block: 'start' });
    return;
  }
  const d = ev.target.closest('[data-demo]');
  if (d) { if (!S.session) { loginAs('player'); nav = [{ s: 'home' }]; } ({ fill: demoFill, reset: demoReset })[d.dataset.demo](); }
});

/* ================= boot ================= */
if (!loadState()) { freshState(); save(); }
S.org = !!S.session && role() === 'staff';
nav = [{ s: S.session ? 'home' : 'welcome' }];
render();
