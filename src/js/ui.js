/* ================= components ================= */
const I = (n, c = '') => `<svg class="ico ${c}" aria-hidden="true"><use href="#i-${n}"/></svg>`;
const statusBar = (light = false) => `<div class="status${light ? ' light' : ''}" aria-hidden="true"><span>9:41</span><span class="st-ic"><span class="sig"><i></i><i></i><i></i><i></i></span><span class="bat"></span></span></div>`;
const initials = p => esc((p.f[0] || '') + ((p.l.replace(/^(De |D')/, '')[0]) || ''));
function avatar(pid, cls = '') {
  const p = PL(pid), usr = S.users[pid];
  if (usr && usr.photo) return `<span class="av ph${pid === S.me ? ' me' : ''} ${cls}"><img src="${usr.photo}" alt=""></span>`;
  if (pid === S.me) return `<span class="av me ${cls}">${initials(p)}</span>`;
  return `<span class="av ${cls}" style="background:${AVC[pid % AVC.length]}">${initials(p)}</span>`;
}
const anonAv = (cls = '') => `<span class="av anon ${cls}">${I('lock')}</span>`;
const pairAvs = (C, id, cls = '') => { const p = pairOf(C, id); return p ? `<span class="stk">${avatar(p.p[0], cls)}${avatar(p.p[1], cls)}</span>` : ''; };
const lvl = x => `<span class="lvl">${dec(x)}</span>`;
const mplLogo = (cls = '') => `<img class="mpl-logo ${cls}" src="${LOGO_MPL}" alt="MINI Padel League">`;
const mplTile = (cls = '') => `<span class="mpl-tile ${cls}">${mplLogo()}</span>`;
const powered = () => `<p class="powered"><span>Powered by</span><img class="lobiz" src="${LOGO_LOBIZ}" alt="Lobiz agency"></p>`;
const courtLines = cls => `<svg class="deco ${cls}" viewBox="0 0 100 200" aria-hidden="true"><g fill="none" stroke="#fff" stroke-width="2"><rect x="4" y="4" width="92" height="192"/><path d="M4 34.5h92M4 165.5h92M50 34.5v131M4 100h92"/></g></svg>`;
const courtMini = () => `<svg viewBox="0 0 100 150" aria-hidden="true"><rect x="3" y="3" width="94" height="144" rx="6" fill="#E6EEF6"/><g fill="none" stroke="#B9C7DC" stroke-width="3"><rect x="10" y="10" width="80" height="130" rx="2"/><path d="M10 32h80M10 118h80M50 32v86"/></g><path d="M6 75h88" stroke="#9AA8C3" stroke-width="4" stroke-dasharray="3 3"/></svg>`;
const empty = (title, body, cta = '') => `<div class="empty">${courtMini()}<h3 class="t-m">${title}</h3><p class="body">${body}</p>${cta}</div>`;
function statusPill(s, onTurf = false) {
  if (s === 'live') return `<span class="pill p-live">${STATUS_L[s]}</span>`;
  if (onTurf) return `<span class="pill p-onturf">${STATUS_L[s]}</span>`;
  return `<span class="pill p-${s}">${STATUS_L[s]}</span>`;
}
const REG_L = { ok: ['p-ok', 'Confermata'], review: ['p-wait', 'In valutazione'], no: ['p-no', 'Non approvata'] };
const regVerb = () => manual() ? "Richiedi l'iscrizione" : 'Iscriviti alla tappa';
const regPill = st => `<span class="pill ${REG_L[st][0]}">${REG_L[st][1]}</span>`;
function topbar(title, sub = '', right = '') {
  return `<div class="topbar"><button class="ib" data-a="back" aria-label="Indietro">${I('back')}</button><div class="tb-mid"><span class="tb-title">${esc(title)}</span>${sub ? `<span class="tb-sub">${esc(sub)}</span>` : ''}</div>${right || '<span class="tb-sp"></span>'}</div>`;
}
function flowTop(backA, step, N, label, closeA) {
  return `<div class="flow-top"><button class="ib" data-a="${backA}" aria-label="Indietro">${I('back')}</button><div class="flow-prog"><span class="step-l">Passo ${step + 1} di ${N}, ${label}</span><div class="steps" aria-hidden="true">${Array.from({ length: N }, (_, i) => `<i class="${i <= step ? 'on' : ''}"></i>`).join('')}</div></div>${closeA ? `<button class="ib" data-a="${closeA}" aria-label="Interrompi">${I('x')}</button>` : '<span class="tb-sp"></span>'}</div>`;
}
function field(f, label, val, o = {}) {
  return `<label class="fld"><span>${label}</span><input class="f-in" data-f="${f}" value="${esc(val)}"${o.type ? ` type="${o.type}"` : ''}${o.ac ? ` autocomplete="${o.ac}"` : ''}${o.im ? ` inputmode="${o.im}"` : ''}${o.ph ? ` placeholder="${esc(o.ph)}"` : ''}${o.max ? ` maxlength="${o.max}"` : ''}>${o.hint ? `<span class="hint">${o.hint}</span>` : ''}</label>`;
}
function pwField(val, show, ac, hint = '') {
  return `<label class="fld"><span>Password</span><span class="pw"><input class="f-in" data-f="pw" type="${show ? 'text' : 'password'}" value="${esc(val)}" autocomplete="${ac}"><button type="button" data-a="pwToggle">${show ? 'Nascondi' : 'Mostra'}</button></span>${hint ? `<span class="hint">${hint}</span>` : ''}</label>`;
}
const partnerTile = (p, cls = '') => `<button class="ptile ${cls}" data-a="partner" data-id="${p.id}"><img src="${p.uri}" alt="${esc(p.name)}" width="${p.w}" height="${p.h}"></button>`;
function offerRow(o) { const p = PT(o.pid); return `<button class="offer-row" data-a="partner" data-id="${p.id}"><span class="ptile mini"><img src="${p.uri}" alt=""></span><span class="grow"><b>${esc(o.title)}</b><span class="sm">${esc(p.name)}${o.code ? ', con codice sconto' : ''}</span></span>${I('chev')}</button>`; }
function offerCard(o) { return `<div class="offer"><b>${esc(o.title)}</b><p>${esc(o.body)}</p>${o.code ? `<div class="code-line"><span class="code">${esc(o.code)}</span><button class="btn btn-ghost btn-sm" data-a="copyCode" data-code="${esc(o.code)}">Copia codice</button></div>` : ''}${S.org ? `<button class="link danger-link" data-a="offerDel" data-oid="${o.id}">Elimina offerta</button>` : ''}</div>`; }
function partnerSheet(id) {
  const p = PT(id), offers = S.offers.filter(o => o.pid === id);
  return `<div class="sh-body"><div class="psh-logo"><img src="${p.uri}" alt="${esc(p.name)}"></div><h2 class="t-l" id="shTitle">${esc(p.name)}</h2><p class="sm mt4">${id === 'mini' ? 'Title partner' : 'Partner ufficiale'} della MINI Padel League 2026</p><h3 class="list-h">Per gli iscritti</h3>${offers.length ? offers.map(offerCard).join('') : `<p class="body" style="font-size:14px">Al momento non ci sono offerte attive. Quando ${esc(p.name)} ne pubblica una per gli iscritti, la trovi qui e in Home.</p>`}${S.org ? `<button class="staff-add" data-a="offerNew" data-id="${p.id}">${I('plus')}Aggiungi un'offerta</button>` : ''}</div><div class="sh-foot"><button class="btn btn-ghost" data-a="closeSheet">Chiudi</button></div>`;
}
function offerForm(id) {
  const p = PT(id);
  return `<div class="sh-body"><h2 class="t-l" id="shTitle">Nuova offerta</h2><p class="sm mt4">${esc(p.name)}, visibile a tutti gli iscritti</p><label class="fld"><span>Titolo</span><input class="f-in" id="oT" maxlength="60" placeholder="Es. Sconto sulle racchette" autocomplete="off"></label><label class="fld"><span>Descrizione</span><textarea class="f-in ta" id="oB" rows="3" maxlength="220" placeholder="Cosa ottiene chi è iscritto e come usarla"></textarea></label><label class="fld"><span>Codice sconto, facoltativo</span><input class="f-in" id="oC" maxlength="20" placeholder="Es. PADEL26" autocomplete="off"></label><p class="sc-err" id="oErr" role="alert"></p></div><div class="sh-foot"><button class="btn btn-primary" data-a="offerSave">Pubblica offerta</button><button class="btn btn-text" data-a="partner" data-id="${p.id}">Annulla</button></div>`;
}
function scrPartner() {
  const title = PT('mini'), rest = PARTNERS.filter(p => p.id !== 'mini');
  let h = statusBar() + topbar('Partner', 'MINI Padel League 2026') + '<div class="pad">';
  if (S.org) h += `<p class="org-hint" style="margin-top:4px">${I('tools')}Vista staff: tocca un partner per pubblicare un'offerta riservata agli iscritti.</p>`;
  h += `<button class="tpcard" data-a="partner" data-id="mini"><span class="tp-logo"><img src="${title.uri}" alt="MINI"></span><span class="tp-tx"><span class="pill p-ok">Title partner</span><b>MINI</b><span class="sm">Dà il nome al circuito e accompagna tutte le 27 tappe.</span></span></button>`;
  if (S.offers.length) h += `<h2 class="list-h">Offerte per gli iscritti</h2>${S.offers.slice().reverse().map(offerRow).join('')}`;
  h += `<h2 class="list-h">Partner ufficiali</h2><div class="pgrid">${rest.map(p => partnerTile(p)).join('')}</div><p class="sm" style="margin:14px 2px 0">Tocca un logo per vedere le offerte del partner riservate agli iscritti.</p>`;
  return { html: h + '</div>', title: 'Partner' };
}
function photoPicker(src, ini, target, note) {
  return `<div class="pick"><button class="pick-av" data-a="pickPhoto" data-target="${target}" aria-label="${src ? 'Cambia la foto' : 'Aggiungi una foto'}">${src ? `<img src="${src}" alt="">` : `<span>${ini}</span>`}<span class="cam" aria-hidden="true">${I('camera')}</span></button><div class="pick-tx"><b>${src ? 'La tua foto' : 'Aggiungi una foto'}</b><span class="sm">${note}</span><span class="pick-btns"><button class="link" data-a="pickPhoto" data-target="${target}">${src ? 'Cambia foto' : 'Scatta o scegli una foto'}</button>${src ? `<button class="link danger-link" data-a="dropPhoto" data-target="${target}">Rimuovi</button>` : ''}</span></div></div><p class="sc-err" id="phErr" role="alert"></p>`;
}
const qText = q => q === 1 ? 'Passa il turno la prima di ogni girone' : 'Passano il turno le prime 2 di ogni girone';
function versus(C, a, b) {
  const side = (id, right) => `<div class="vs-t${right ? ' r' : ''}">${pairAvs(C, id)}<span>${esc(pairLabel(C, id))}</span></div>`;
  return `<div class="vs">${side(a)}<span class="vs-x">vs</span>${side(b, true)}</div>`;
}
const tileNum = t => `<span class="ti-n ${tStatus(t)}">${t.n}</span>`;
const friendlyOpen = m => 4 - m.players.length - (S.joined[m.id] ? 1 : 0);
function friendlyCard(m) {
  const open = friendlyOpen(m), joined = !!S.joined[m.id];
  const avs = m.players.map(p => `<span class="av s" style="background:${AVC[p.c]}">${esc(p.f[0] + p.l[0])}</span>`).join('') + (joined ? avatar(S.me, 's') : '') + '<span class="av s open">+</span>'.repeat(open);
  return `<button class="fm${joined ? ' joined' : ''}" data-a="go" data-s="match" data-mid="${m.id}"><span class="when"><small>${m.dayS}</small><b>${m.dayN}</b><small>${m.time}</small></span><span class="fm-main"><span class="row btw gap8"><span class="fm-club">${esc(m.club)}</span>${lvl(m.lv)}</span><span class="sm">${esc(m.court)}, ${m.dur} min</span><span class="row btw mt8"><span class="stk">${avs}</span><span class="spots">${joined ? 'Ci sei anche tu' : open === 1 ? '1 posto libero' : open + ' posti liberi'}</span></span></span></button>`;
}
const onbCourt = () => `<svg viewBox="0 0 100 200" aria-hidden="true"><use href="#court"/><circle cx="28" cy="58" r="7" fill="#fff"/><circle cx="72" cy="70" r="7" fill="#fff"/><circle cx="30" cy="142" r="7" fill="#FFED00"/><circle cx="70" cy="128" r="7" fill="#fff"/><circle cx="56" cy="110" r="3" fill="#FFED00"/><path d="M30 142Q44 118 56 110" fill="none" stroke="#FFED00" stroke-width="1.2" stroke-dasharray="2 2"/></svg>`;
const sideText = side => side === 'riv' ? 'gioca a sinistra (rovescio)' : side === 'drive' ? 'gioca a destra (drive)' : 'gioca su entrambi i lati';

/* ================= access: role choice, login, sign-up ================= */
function roleCard(r, icon, title, sub) {
  return `<button class="rolecard" data-a="pickRole" data-r="${r}"><span class="rc-ic">${I(icon)}</span><span class="grow"><b>${title}</b><span class="sm">${sub}</span></span>${I('chev', 'chev')}</button>`;
}
function scrWelcome() {
  return { html: `<div class="welcome">${statusBar(true)}<div class="wl-hero">${courtLines('wl-deco')}${mplLogo()}<p class="wl-tag">Circuito 2026, 27 tappe in tutta Italia</p></div><div class="wl-sheet"><h1 class="t-xl">Come vuoi partecipare?</h1><p class="body mt8">Scegli il tuo ingresso: ti chiediamo solo i dati che servono.</p><div class="mt16" role="group" aria-label="Tipo di accesso">${roleCard('player', 'racket', 'Giocatore', 'Ti ha invitato una concessionaria MINI: ti serve il codice di ingresso.')}${roleCard('visitor', 'ticket', 'Visitatore', 'Vieni a vedere una tappa e prenota un test drive.')}${roleCard('staff', 'tools', 'Staff', "Organizzazione e concessionarie, con l'account fornito da Lobiz.")}</div><p class="sm alt-line">Hai già un account? <button class="link" data-a="go" data-s="login">Accedi</button></p>${powered()}</div></div>`, cls: 'no-pad', title: 'Benvenuto' };
}
function scrLogin(e) {
  const staff = !!e.staff;
  if (e.email == null) { e.email = S.users[staff ? S.demo.staff : S.demo.player].email; e.pw = 'padel2026'; }
  const head = staff ? `<h1 class="t-xl">Accesso staff</h1><p class="body mt8">Per lo staff dell'organizzazione e delle concessionarie. Gli account li crea Lobiz agency: non serve registrarsi.</p>` : `<h1 class="t-xl">Bentornato</h1><p class="body mt8">Accedi con l'email che hai usato per registrarti, da giocatore o da visitatore.</p>`;
  const alt = staff ? `<p class="sm alt-line">Sei un giocatore o un visitatore? <button class="link" data-a="back">Torna alla scelta</button></p>` : `<p class="sm alt-line">Non hai un account? <button class="link" data-a="toWelcome">Registrati</button></p><p class="demo-note">Nel prototipo puoi entrare anche come laura.fontanesi@esempio.it, visitatrice.</p>`;
  return { html: statusBar() + topbar('') + `<div class="pad form-h"><div class="login-brand">${mplTile()}</div>${head}${field('email', 'Email', e.email, { type: 'email', ac: 'email', im: 'email' })}${pwField(e.pw, e.show, 'current-password')}<button class="link mt12" data-a="forgot">Password dimenticata?</button><p class="sc-err" id="formErr" role="alert"></p><button class="btn btn-primary mt8" data-a="loginSave">Accedi</button>${alt}${powered()}</div>`, title: staff ? 'Accesso staff' : 'Accedi' };
}
let SU = null;
const SU_STEPS = { player: ['code', 'account', 'otp', 'profile', 'privacy'], visitor: ['account', 'otp', 'privacy'] };
const SU_L = { code: 'codice di ingresso', account: 'account', otp: 'verifica', profile: 'il tuo profilo', privacy: 'privacy' };
const newSU = (r = 'player') => ({ role: r, step: 0, code: '', codeOk: null, f: '', l: '', email: '', pw: '', show: false, otp: ['', '', '', '', '', ''], hand: 'dx', side: 'riv', terms: false, photo: false, news: false });
const suKey = () => SU_STEPS[SU.role][SU.step];
const codeUsable = c => !!c && c.on && c.used < c.max;
const inviteBox = c => `<div class="invite-ok">${I('check')}<span>Invito di <b>${esc(c.dealer)}</b>, ${esc(c.city)}</span></div>`;
function suCheck(key, title, sub, req = false) {
  return `<button class="check" role="checkbox" aria-checked="${!!SU[key]}" data-a="suCheck" data-key="${key}"><span class="box">${I('check')}</span><span><b>${title}${req ? '<span class="req-tag">Obbligatorio</span>' : ''}</b>${sub ? `<span class="sm">${sub}</span>` : ''}</span></button>`;
}
function scrSignup() {
  if (!SU) SU = newSU();
  const steps = SU_STEPS[SU.role], k = suKey(), vis = SU.role === 'visitor';
  let body = '', cta = '';
  if (k === 'code') {
    const c = SU.code ? findCode(SU.code) : null;
    body = `<h1 class="t-xl">Il tuo codice di ingresso</h1><p class="body mt8">Si gioca su invito delle concessionarie MINI: il codice è nell'invito che hai ricevuto.</p>${field('code', 'Codice di ingresso', fmtCode(SU.code), { ac: 'off', ph: 'MPL-XX-XXXX', max: 11 })}<div id="codeState" aria-live="polite">${codeUsable(c) ? inviteBox(c) : ''}</div><button class="link mt12" data-a="codeHelp">Non ho un codice</button><p class="demo-note">Nel prototipo puoi usare il codice MPL-MI-7K2Q.</p>`;
    cta = `<button class="btn btn-primary" data-a="suNext">Continua</button><p class="sm alt-line">Hai già un account? <button class="link" data-a="go" data-s="login">Accedi</button></p>`;
  } else if (k === 'account') {
    const c = SU.codeOk ? findCode(SU.codeOk) : null;
    body = `${c ? inviteBox(c) : ''}<h1 class="t-xl${c ? ' mt16' : ''}">Crea il tuo account</h1><p class="body mt8">${vis ? 'Ti serve per iscriverti alle tappe da visitatore e prenotare un test drive.' : 'Ti serve per iscriverti alle tappe e seguire le tue partite.'}</p><div class="two">${field('f', 'Nome', SU.f, { ac: 'given-name' })}${field('l', 'Cognome', SU.l, { ac: 'family-name' })}</div>${field('email', 'Email', SU.email, { type: 'email', ac: 'email', im: 'email', ph: 'nome@esempio.it' })}${pwField(SU.pw, SU.show, 'new-password', 'Almeno 8 caratteri, con almeno un numero.')}`;
    cta = `<button class="btn btn-primary" data-a="suNext">Continua</button>${vis ? '<p class="sm alt-line">Hai già un account? <button class="link" data-a="go" data-s="login">Accedi</button></p>' : ''}`;
  } else if (k === 'otp') {
    body = `<h1 class="t-xl">Controlla la tua email</h1><p class="body mt8">Abbiamo mandato un codice di 6 cifre a <b style="color:var(--ink)">${esc(SU.email)}</b>. Vale 10 minuti.</p><div class="otp" role="group" aria-label="Codice di verifica">${SU.otp.map((v, i) => `<input class="otp-in" inputmode="numeric" autocomplete="${i === 0 ? 'one-time-code' : 'off'}" maxlength="1" data-otp="${i}" aria-label="Cifra ${i + 1} di 6" value="${esc(v)}">`).join('')}</div><p class="sm mt16">Non è arrivato? Controlla lo spam oppure <button class="link" data-a="suResend">invia di nuovo il codice</button>.</p><p class="demo-note">Nel prototipo va bene qualsiasi codice di 6 cifre.</p>`;
    cta = `<button class="btn btn-primary" data-a="suNext">Verifica</button>`;
  } else if (k === 'profile') {
    const seg = (key, opts, label) => `<div class="seg full" role="group" aria-label="${label}">${opts.map(([v, l]) => `<button data-a="suSet" data-key="${key}" data-v="${v}" aria-pressed="${SU[key] === v}">${l}</button>`).join('')}</div>`;
    body = `<h1 class="t-xl">Il tuo profilo</h1><p class="body mt8">Una foto e come giochi. Il livello lo indichi quando ti iscrivi a una tappa.</p>${photoPicker(SU.pic, esc(((SU.f || ' ')[0] + (SU.l || ' ')[0]).toUpperCase()), 'su', 'Facoltativa. La vedono lo staff e gli iscritti alle tue stesse tappe, e ti riconoscono all\'accredito.')}<div class="fld"><span>Mano</span>${seg('hand', [['dx', 'Destra'], ['sx', 'Sinistra']], 'Mano')}</div><div class="fld"><span>Lato preferito</span>${seg('side', [['drive', 'Drive'], ['riv', 'Rovescio'], ['both', 'Entrambi']], 'Lato preferito')}<span class="hint">Drive è il lato destro, rovescio il sinistro.</span></div>`;
    cta = `<button class="btn btn-primary" data-a="suNext">Continua</button>`;
  } else {
    const rows = vis
      ? [['lock', 'Nome ed email li vede solo lo staff, per gestire visite e test drive.'], ['eyeoff', 'Non compari negli elenchi dei giocatori né sugli schermi in sede.'], ['users', 'I dati della patente, se prenoti un test drive, li vedono solo lo staff e la concessionaria.']]
      : [['lock', 'Nome, cognome e livello li vedono solo gli iscritti alla tua stessa tappa.'], ['users', 'Lo staff vede anche email e codice di ingresso, per gestire iscrizioni e partite.'], ['eyeoff', 'Nessun giocatore può vedere i partecipanti delle tappe a cui non è iscritto.']];
    body = `<h1 class="t-xl">La tua privacy</h1><div class="pcard mt16"><h2 class="t-m">Chi vede i tuoi dati</h2>${rows.map(([i, tx]) => `<div class="pc-row">${I(i)}<span>${tx}</span></div>`).join('')}</div><div class="mt12">${suCheck('terms', "Ho preso visione dell'informativa sulla privacy", '', true)}${suCheck('photo', 'Foto e video delle tappe', 'Acconsento alla pubblicazione di foto in cui compaio.')}${suCheck('news', 'Novità dal circuito', 'Ricevo comunicazioni da MINI Padel League e dai suoi partner.')}</div><button class="link mt8" data-a="privacyInfo">Leggi l'informativa sulla privacy</button>`;
    cta = `<button class="btn btn-primary" data-a="suNext">Crea account</button>`;
  }
  return { html: statusBar() + flowTop('suBack', SU.step, steps.length, SU_L[k]) + `<div class="pad form-h">${body}<p class="sc-err" id="formErr" role="alert"></p></div><div class="sticky-cta">${cta}</div>`, cls: 'no-pad flow', title: vis ? 'Registrazione visitatore' : 'Registrazione giocatore' };
}
function scrReady() {
  if (isVis()) {
    const list = TAPPE.filter(t => ['open', 'live'].includes(tStatus(t)));
    return { html: statusBar() + `<div class="pad"><div class="ok-mark small">${I('check')}</div><h1 class="t-xl">Tutto pronto, ${esc(ME().f)}</h1><p class="body mt8">Il tuo account da visitatore è attivo. Scegli la tappa che vuoi venire a vedere: l'ingresso è gratuito e puoi pre-prenotare un test drive di una MINI.</p><h2 class="list-h">Tappe a cui puoi iscriverti</h2>${list.map(tappaItem).join('')}<button class="btn btn-ghost mt24" data-a="tab" data-t="home">Vai alla home</button></div>`, title: 'Account creato' };
  }
  const u = USER(), open = TAPPE.filter(t => tStatus(t) === 'open');
  return { html: statusBar() + `<div class="pad"><div class="ok-mark small">${I('check')}</div><h1 class="t-xl">Tutto pronto, ${esc(ME().f)}</h1><p class="body mt8">${u.dealer ? `Sei entrato con l'invito di ${esc(u.dealer)}. ` : ''}Il prossimo passo è iscriverti a una tappa: è gratuito e i posti sono limitati.</p><h2 class="list-h">Iscrizioni aperte</h2>${open.map(tappaItem).join('')}<button class="btn btn-ghost mt24" data-a="tab" data-t="home">Vai alla home</button></div>`, title: 'Account creato' };
}

/* ================= stage registration flow ================= */
let REG = null;
const SHIRTS = ['XS', 'S', 'M', 'L', 'XL', 'XXL'];
const emptyProf = () => ({ mini: false, plate: '', biz: false, company: '', vat: '', role: '', size: '', car: '', change: '' });
const tdPrefill = () => { const u = USER(), l = u.lic || {}; return { model: '', slot: '', num: l.num || '', exp: l.exp || '', photo: !!l.photo, phone: u.phone || '' }; };
const newREG = tid => { const u = USER(), c = u.consents || {}, g = PL(S.me).g, f = u.fitp; return { tid, step: 0, k: null, g: g === 'm' || g === 'f' ? g : null, lc: Object.assign({ lvl: null, since: '', freq: '', tour: '' }, u.lvlCard || {}), prof: Object.assign(emptyProf(), u.prof || {}), shirt: u.shirt || null, fitp: f ? (f.has ? 'yes' : 'no') : null, fitpNum: f && f.num ? f.num : '', cert: null, certFile: false, ins: null, cf: u.cf || '', tdOn: false, tdd: tdPrefill(), cDealer: !!c.dealer, cPartners: !!c.partners, cScreen: !!c.screen }; };
function ropt(key, v, title, sub, extra = '', off = false) {
  const on = REG[key] === v;
  return `<div class="opt-wrap${on ? ' on' : ''}"><button class="opt${off ? ' off' : ''}" role="radio" aria-checked="${on}"${off ? ' aria-disabled="true"' : ''} data-a="regSet" data-key="${key}" data-v="${v}"><span class="radio"></span><span class="grow"><b>${title}</b><span class="sm">${sub}</span></span></button>${on && extra ? `<div class="opt-body">${extra}</div>` : ''}</div>`;
}
function regCheckBox(key, title, sub) { return `<button class="check" role="checkbox" aria-checked="${!!REG[key]}" data-a="regCheck" data-key="${key}"><span class="box">${I('check')}</span><span><b>${title}</b>${sub ? `<span class="sm">${sub}</span>` : ''}</span></button>`; }
const pchips = (key, opts, label) => `<div class="slot-chips" role="radiogroup" aria-label="${label}">${opts.map(([v, l]) => `<button class="chip" role="radio" data-a="regProf" data-key="${key}" data-v="${esc(v)}" aria-checked="${REG.prof[key] === v}">${esc(l)}</button>`).join('')}</div>`;
function critCard(key, title, sub, fields) {
  const on = !!REG.prof[key];
  return `<div class="opt-wrap${on ? ' on' : ''}"><button class="opt" role="checkbox" aria-checked="${on}" data-a="regCrit" data-key="${key}"><span class="cbox">${I('check')}</span><span class="grow"><b>${title}</b><span class="sm">${sub}</span></span></button>${on ? `<div class="opt-body">${fields}</div>` : ''}</div>`;
}
function regStepCat(t) {
  let h = `<h1 class="t-xl">In che categoria giochi?</h1><p class="body mt8">Ti iscrivi da solo: il compagno lo estrae lo staff, insieme ai gironi.</p><div class="opts mt12" role="radiogroup" aria-label="Categoria">${CATS.map(c => {
    const C = catData(t.id, c.k), n = C.players.length, free = CAP[c.k] - n;
    const mine = C.players.includes(S.me) || S.regs.some(r => r.uid === S.me && r.tid === t.id && r.k === c.k && r.status !== 'no');
    const avg = n ? C.players.reduce((a, id) => a + PL(id).lv, 0) / n : null;
    const sub = mine ? 'Sei già iscritto in questa categoria' : free > 0 ? `${n} giocatori iscritti, ${free === 1 ? '1 posto libero' : free + ' posti liberi'}` : "Completo: entri in lista d'attesa";
    return `<div class="opt-wrap${REG.k === c.k ? ' on' : ''}"><button class="opt${mine ? ' off' : ''}" role="radio" aria-checked="${REG.k === c.k}"${mine ? ' aria-disabled="true"' : ''} data-a="regSet" data-key="k" data-v="${c.k}"><span class="radio"></span><span class="grow"><b>${c.l}</b><span class="sm">${sub}</span></span>${avg ? `<span class="avg"><small>livello medio</small>${dec(avg)}</span>` : ''}</button></div>`;
  }).join('')}</div>`;
  if (REG.k === 'X') h += `<div class="fld"><span>Nel misto giochi come</span><div class="seg full" role="group" aria-label="Nel misto giochi come">${[['m', 'Uomo'], ['f', 'Donna']].map(([v, l]) => `<button data-a="regSet" data-key="g" data-v="${v}" aria-pressed="${REG.g === v}">${l}</button>`).join('')}</div><span class="hint">Serve per estrarre coppie formate da un uomo e una donna.</span></div>`;
  return h + `<p class="privacy-note">${I('lock')}<span>Il livello medio ti aiuta a scegliere. I nomi degli iscritti li vedi dopo l'iscrizione.</span></p>`;
}
function regStepLevel(t) {
  const L = [['base', 'Base', 'Giochi da poco o ogni tanto. Scambi da fondo campo e stai imparando a usare le pareti.'], ['inter', 'Intermedio', 'Giochi con regolarità. Usi le pareti, fai volée e bandeja, tieni scambi lunghi.'], ['pro', 'Agonista', 'Giochi tornei o campionati, ti alleni più volte a settimana o hai una classifica federale.']];
  const chips = (key, opts, label) => `<div class="slot-chips" role="radiogroup" aria-label="${label}">${opts.map(([v, l]) => `<button class="chip" role="radio" data-a="regLc" data-key="${key}" data-v="${v}" aria-checked="${REG.lc[key] === v}">${l}</button>`).join('')}</div>`;
  return `<h1 class="t-xl">Qual è il tuo livello?</h1><p class="body mt8">Ci serve per estrarre coppie equilibrate: un giocatore più esperto con uno meno esperto. Puoi aggiornarlo prima di ogni tappa.</p><div class="opts mt12" role="radiogroup" aria-label="Livello di preparazione">${L.map(([v, l, d]) => `<div class="opt-wrap${REG.lc.lvl === v ? ' on' : ''}"><button class="opt lvopt" role="radio" aria-checked="${REG.lc.lvl === v}" data-a="regLc" data-key="lvl" data-v="${v}"><span class="radio"></span><span class="grow"><b>${l}</b><span class="sm">${d}</span></span><span class="lv-ic lv-${v}" aria-hidden="true"><i></i><i></i><i></i></span></button></div>`).join('')}</div><h2 class="tool-h">Per conoscerti meglio, facoltativo</h2><div class="fld" style="margin-top:0"><span>Da quanto giochi a padel?</span>${chips('since', [['<1', 'Meno di un anno'], ['1-3', 'Da 1 a 3 anni'], ['3+', 'Più di 3 anni']], 'Da quanto giochi')}</div><div class="fld"><span>Quante volte giochi a settimana?</span>${chips('freq', [['<1', 'Meno di una'], ['1-2', '1 o 2'], ['3+', '3 o più']], 'Quante volte a settimana')}</div><div class="fld"><span>Hai giocato tornei?</span>${chips('tour', [['never', 'Mai'], ['some', 'Qualche volta'], ['often', 'Spesso']], 'Tornei giocati')}</div>`;
}
function regStepProf(t) {
  const pr = REG.prof, R = S.rules, any = R.mini || R.biz || R.car;
  let h = `<h1 class="t-xl">Il tuo profilo</h1><p class="body mt8">${any ? 'Sono tutte domande facoltative: rispondi solo a quelle che vuoi, oppure salta il passo. Ci aiutano a conoscere chi gioca nel circuito.' : 'Per questa stagione non ci sono domande facoltative: puoi andare avanti.'}</p>`;
  if (R.mini || R.biz) {
    h += `<div class="opts mt12" role="group" aria-label="Profilo facoltativo">`;
    if (R.mini) h += critCard('mini', 'Ho una MINI', 'Se vuoi, aggiungi la targa.', field('prof.plate', 'Targa, facoltativa', pr.plate, { ac: 'off', ph: 'AB123CD', max: 9 }));
    if (R.biz) h += critCard('biz', 'Sono imprenditore o libero professionista', 'Se vuoi, aggiungi i dati della tua attività.', `${field('prof.company', 'Ragione sociale o nome dello studio, facoltativa', pr.company, { ac: 'organization' })}${field('prof.vat', 'Partita IVA, facoltativa', pr.vat, { im: 'numeric', ph: '11 cifre', max: 11, ac: 'off' })}<div class="fld"><span>Ruolo</span>${pchips('role', [['Titolare', 'Titolare'], ['Socio', 'Socio'], ['Amministratore', 'Amministratore'], ['Libero professionista', 'Libero professionista']], 'Ruolo')}</div><div class="fld"><span>Persone in azienda</span>${pchips('size', [['Solo io', 'Solo io'], ['2–9', '2–9'], ['10–49', '10–49'], ['50 e più', '50 e più']], 'Persone in azienda')}</div>`);
    h += '</div>';
  }
  if (R.car) {
    h += `<h2 class="tool-h">La tua auto</h2><div class="fld" style="margin-top:0"><span>Che auto guidi oggi?</span>${pchips('car', CARS.map(c => [c, c]), 'Auto attuale')}</div>`;
    if (pr.car && pr.car !== 'MINI' && pr.car !== "Non ho un'auto") h += `<div class="fld"><span>Quando pensi di cambiarla?</span>${pchips('change', Object.entries(CHANGE_L), 'Quando pensi di cambiarla')}</div>`;
  }
  if (any) h += `<button class="link mt16" data-a="regSkip">Salta questo passo</button><p class="privacy-note">${I('lock')}<span>Queste risposte le vede solo lo staff. Agli altri iscritti mostriamo solo nome e livello.</span></p>`;
  return h;
}
function regStepKit(t) {
  const certExtra = `<button class="upload" data-a="regUpload">${I(REG.certFile ? 'check' : 'upload')}<span>${REG.certFile ? 'certificato-medico.pdf, 240 KB' : 'Scegli il file'}</span>${REG.certFile ? '<span class="link">Sostituisci</span>' : ''}</button>`;
  const fitpExtra = field('fitpNum', 'Numero di tessera', REG.fitpNum, { ac: 'off', ph: 'Es. 4471205', max: 12, hint: 'Lo trovi sulla tessera. Lo vede solo lo staff.' });
  let h = `<h1 class="t-xl">Kit e documenti</h1><p class="body mt8">Si gioca ${dLong(t.start)}, tutto il giorno: gironi dalle 9, poi il tabellone fino alla finale.</p>`;
  h += `<h2 class="tool-h">Taglia della maglia</h2><div class="slot-chips" role="radiogroup" aria-label="Taglia della maglia">${SHIRTS.map(s => `<button class="chip size" role="radio" data-a="regSet" data-key="shirt" data-v="${s}" aria-checked="${REG.shirt === s}">${s}</button>`).join('')}</div><p class="sm mt8">È nel kit di benvenuto che ritiri in sede, insieme alle palline.</p>`;
  h += `<h2 class="tool-h">Tessera FITP</h2><p class="sm" style="margin:0 2px 10px">Serve per giocare le tappe: è la tessera della Federazione Italiana Tennis e Padel.</p><div class="opts" style="padding:0" role="radiogroup" aria-label="Tessera FITP">${ropt('fitp', 'yes', 'Ho la tessera FITP', 'Inserisci il numero.', fitpExtra)}${ropt('fitp', 'no', "Non ce l'ho ancora", 'Ti spieghiamo come farla prima della tappa.')}</div>`;
  h += `<h2 class="tool-h">Certificato medico</h2><p class="sm" style="margin:0 2px 10px">Serve un certificato medico sportivo non agonistico, valido il giorno della tappa.</p><div class="opts" style="padding:0" role="radiogroup" aria-label="Certificato medico">${ropt('cert', 'upload', 'Lo carico adesso', 'PDF o foto, al massimo 10 MB', certExtra)}${ropt('cert', 'venue', 'Lo porto in sede', "Da mostrare all'accredito")}</div>`;
  if (S.rules.insurance) h += `<h2 class="tool-h">Assicurazione gratuita, facoltativa</h2><p class="sm" style="margin:0 2px 10px">Copertura infortuni per la giornata di gioco, offerta ${esc(insurerFrom())}. Non costa nulla e puoi partecipare anche senza.</p><div class="opts" style="padding:0" role="radiogroup" aria-label="Assicurazione gratuita">${ropt('ins', 'yes', "Sì, voglio l'assicurazione", 'La attiviamo a tuo nome per il giorno della tappa.', field('cf', 'Codice fiscale', REG.cf, { ac: 'off', ph: 'RSSMRA80A01F205X', max: 16, hint: 'Serve alla compagnia per intestarti la polizza. Lo vede solo lo staff.' }))}${ropt('ins', 'no', 'No, grazie', 'Partecipi lo stesso.')}</div><button class="link mt8" data-a="insInfo">Cosa copre l'assicurazione</button>`;
  if (S.rules.td) h += `<h2 class="tool-h">Test drive, facoltativo</h2>${tdBlock(REG, true)}`;
  return h;
}
function regStepSum(t) {
  const catTxt = CAT(REG.k).l + (REG.k === 'X' ? (REG.g === 'f' ? ', come donna' : ', come uomo') : '');
  const ps = profSummary(REG.prof), d = REG.tdd;
  const rows = [['Tappa', `${cap(dLong(t.start))}, tutto il giorno, ${t.club}`, null], ['Iscrizione', manual() ? 'Gratuita, con conferma dello staff' : 'Gratuita', null], ['Categoria', catTxt, 0], ['Livello di preparazione', LV3[REG.lc.lvl], 1], ['Profilo facoltativo', ps.length ? ps.join('; ') : 'Non compilato', 2], ['Coppia e girone', `Li estrae lo staff dopo il ${dNum(regCloseDate(t))}`, null], ['Maglia', `Taglia ${REG.shirt}`, 3], ['Tessera FITP', REG.fitp === 'yes' ? `N. ${REG.fitpNum}` : 'Da fare: ti spieghiamo come', 3], ['Certificato medico', REG.cert === 'upload' ? 'Caricato' : 'Lo porti in sede', 3]].concat(S.rules.insurance ? [['Assicurazione gratuita', REG.ins === 'yes' ? `Sì, a nome di ${ME().f} ${ME().l}` : 'Non richiesta', 3]] : [], S.rules.td ? [['Test drive', REG.tdOn ? `${tdModel(d)}, ${TD_SLOTS[d.slot].toLowerCase()}. Patente ${maskLic(d.num)}` : 'Non richiesto', 3]] : []);
  const me = ME(), ph = USER().photo;
  const card = `<h2 class="tool-h">La tua scheda giocatore</h2><div class="pcard-prev">${photoPicker(ph, initials(me), 'user', ph ? 'Compare nelle schede partita e sullo schermo in sede, se dai il consenso qui sotto.' : 'Ci serve per le schede partita e per riconoscerti all\'accredito. Puoi aggiungerla anche dopo, dal profilo.')}<div class="pc-meta"><b>${esc(me.f + ' ' + me.l)}</b><span class="tv-lv-l">${LV3[REG.lc.lvl]}</span><span class="sm">${CAT(REG.k).l}, ${esc(t.city)}</span></div></div>`;
  return `<h1 class="t-xl">Controlla e conferma</h1>${card}<div class="sumlist mt16">${rows.map(([l, v, s]) => `<div class="srow"><div><span class="sm">${l}</span><b>${esc(v)}</b></div>${s != null ? `<button class="link" data-a="regGoStep" data-v="${s}" aria-label="Modifica ${l.toLowerCase()}">Modifica</button>` : ''}</div>`).join('')}</div><h2 class="tool-h">Consensi facoltativi</h2>${regCheckBox('cDealer', 'Voglio essere ricontattato da MINI', 'Dalla concessionaria più vicina, per novità, offerte e test drive.')}${regCheckBox('cScreen', 'Mostra nome e foto sugli schermi in sede', 'Nei campi in diretta, nelle classifiche e nelle schede partita. Senza consenso compaiono solo le iniziali.')}${regCheckBox('cPartners', 'Voglio ricevere le offerte dei partner del circuito', 'Puoi cambiare idea quando vuoi dalle impostazioni.')}<div class="pnote">${I('lock')}<span>${manual() ? 'Dopo la conferma dello staff vedrai' : "Dopo l'iscrizione vedrai"} gli altri iscritti di ${esc(t.city)}, e loro vedranno il tuo nome e il tuo livello. Profilo, tessera, patente e contatti li vede solo lo staff.</span></div>`;
}
function scrIscr() {
  if (!REG) return { html: statusBar() + topbar('Iscrizione') + `<div class="pad">${empty('Nessuna iscrizione in corso', 'Scegli una tappa con iscrizioni aperte per iniziare.', '')}</div>`, title: 'Iscrizione' };
  const t = T(REG.tid), st = REG.step, names = ['categoria', 'livello', 'il tuo profilo, facoltativo', 'kit e documenti', 'riepilogo'];
  const body = [regStepCat, regStepLevel, regStepProf, regStepKit, regStepSum][st](t);
  const cta = `<button class="btn btn-primary" data-a="regNext">${st < 4 ? 'Continua' : manual() ? 'Invia richiesta' : 'Conferma iscrizione'}</button>`;
  return { html: statusBar() + flowTop('regBack', st, 5, names[st], 'regExit') + `<div class="pad form-h"><p class="flow-ctx">Iscrizione gratuita a ${esc(t.city)}, ${dRange(t.start, t.end)}</p>${body}<p class="sc-err" id="formErr" role="alert"></p></div><div class="sticky-cta">${cta}</div>`, cls: 'no-pad flow', title: `Iscrizione a ${t.city}` };
}
function scrIscrOk(e) {
  const r = S.regs[e.rid];
  if (!r) return { html: statusBar() + topbar('Iscrizione') + `<div class="pad">${empty('Iscrizione non trovata', 'Potrebbe essere stata annullata. Controlla le tue iscrizioni nel profilo.', '')}</div>`, title: 'Iscrizione' };
  const t = T(r.tid), catl = CAT(r.k).l.toLowerCase(), review = r.status === 'review', f = r.fitp || {}, td = S.tds.find(x => x.uid === r.uid && x.tid === r.tid);
  const sub = review ? `Per il ${catl} di ${t.city}. Lo staff controlla la richiesta e ti avvisa appena la conferma.` : `Nel ${catl}. Dopo la chiusura delle iscrizioni ti diciamo con chi giochi e in che girone.`;
  const steps = [['done', review ? 'Richiesta inviata' : 'Iscrizione confermata', 'Oggi']];
  if (review) steps.push(['now', 'Conferma dello staff', 'Lo staff controlla la tua richiesta']);
  if (!f.has) steps.push([review ? 'todo' : 'now', 'Tessera FITP', 'Ti spieghiamo come farla prima della tappa']);
  if (td) steps.push(['todo', 'Test drive', `${tdModel(td)}: la concessionaria ti conferma l'orario`]);
  steps.push(['todo', 'Chiusura iscrizioni', dShort(regCloseDate(t))], ['todo', 'Estrazione di coppie e gironi', 'Ti diciamo con chi giochi e in che girone'], ['todo', 'Si gioca', `${cap(dLong(t.start))}, tutto il giorno, ${t.club}`]);
  const rows = [['Iscrizione', 'Gratuita'], ['Kit', `Maglia taglia ${r.shirt}, ${r.cert === 'upload' ? 'certificato caricato' : 'certificato da portare in sede'}`], ['Tessera FITP', f.has ? `N. ${f.num}` : 'Da fare prima della tappa']].concat(r.ins ? [['Assicurazione gratuita', r.ins === 'yes' ? 'Richiesta: la attiviamo per il giorno della tappa' : 'Non richiesta']] : [], S.rules.td ? [['Test drive', td ? `Pre-prenotato: ${tdModel(td)}, ${TD_SLOTS[td.slot].toLowerCase()}` : 'Non richiesto']] : []);
  const h = `<div class="ok-hero">${statusBar(true)}<div class="flow-top"><span class="tb-sp"></span><div class="flow-prog"></div><button class="ib light" data-a="okClose" aria-label="Chiudi">${I('x')}</button></div><div class="ok-mark">${I('check')}</div><h1 class="t-xl">${review ? 'Richiesta inviata' : `Sei iscritto a ${esc(t.city)}`}</h1><p>${esc(sub)}</p></div><div class="pad"><h2 class="t-m mt24" style="margin-bottom:14px">Cosa succede adesso</h2><ol class="timeline">${steps.map(([s, l, d], i) => `<li class="${s}"><span class="tl-dot">${s === 'done' ? I('check') : i + 1}</span><div><b>${esc(l)}</b><span class="sm">${esc(d)}</span></div></li>`).join('')}</ol><div class="sumlist mt24">${rows.map(([l, v]) => `<div class="srow"><div><span class="sm">${l}</span><b>${esc(v)}</b></div></div>`).join('')}</div><button class="btn btn-primary mt24" data-a="okClose">Vai alla tappa</button><button class="btn btn-text w100 mt4" data-a="tab" data-t="home">Torna alla home</button></div>`;
  return { html: h, title: review ? 'Richiesta inviata' : `Iscrizione a ${t.city}` };
}

/* ================= home ================= */
function homeHeader() {
  const r = role(), tag = r === 'player' ? '' : `<span class="role-tag${r === 'staff' ? ' staff' : ''}">${ROLE_L[r]}</span>`;
  return statusBar() + `<header class="home-h pad"><button class="home-me" data-a="tab" data-t="profilo" aria-label="Il tuo profilo">${avatar(S.me, 'home-av')}</button><div style="flex:1;min-width:0"><p class="sm home-date">${tag}${cap(dLong(NOW))}</p><h1 class="t-l mt4">Ciao, ${esc(ME().f)}</h1></div><button class="ib" data-a="notif" aria-label="Notifiche, 2 nuove">${I('bell')}<span class="dot"></span></button></header>`;
}
function liveCard(live) {
  const tt = tappaTotals(live), pct = tt.total ? Math.round(tt.played / tt.total * 100) : 0, r = role();
  let lastG = live.start;
  CATS.forEach(c => { const C = catData(live.id, c.k); if (C.groups) scheduleOf(live, C).forEach(m => { if (m.at > lastG) lastG = m.at; }); });
  const sub = r === 'visitor' ? `Si gioca oggi: ${tt.players} giocatori su 9 campi. Vieni a vedere le partite e prova una MINI.` : `Si gioca oggi: gironi fino alle ${lastG.getHours() + 1}, poi il tabellone fino alla finale`;
  const open = `<button class="btn btn-ball" data-a="go" data-s="tappa" data-tid="${live.id}">Apri la tappa</button>`;
  return `<article class="livecard">${courtLines('lc-deco')}<div class="row btw"><span class="pill p-live">In corso</span><span class="lc-n">Tappa ${live.n} di 27</span></div><h2 class="lc-city">${esc(live.city)}</h2><p class="lc-sub">${sub}</p><div class="lc-prog"><div class="pbar light"><span style="width:${pct}%"></span></div><span>${tt.played} di ${tt.total} partite dei gironi giocate</span></div>${r === 'staff' ? `<div class="lc-btns">${open}<button class="btn btn-onturf" data-a="tvOpen">${I('screen')}Schermo</button></div>` : open}</article>`;
}
function upcomingSection() {
  const up = TAPPE.filter(t => ['open', 'soon'].includes(tStatus(t))).slice(0, 4), r = role();
  return `<section class="sec"><div class="sec-h"><h2 class="t-m">Prossime tappe</h2><button class="link" data-a="tabNext">Tutte le tappe</button></div><div class="hs">${up.map(t => {
    const s = tStatus(t), mine = r === 'visitor' ? !!myVisit(t.id) : r === 'player' && myRegs().some(x => x.t.id === t.id);
    const line = s !== 'open' ? 'Iscrizioni dal ' + dNum(regOpenDate(t)) : r === 'staff' ? `${tappaTotals(t).players} giocatori iscritti` : r === 'visitor' ? 'Visitatori ammessi' : 'Iscrizioni aperte';
    return `<button class="upc" data-a="go" data-s="tappa" data-tid="${t.id}">${tileNum(t)}<b>${esc(t.city)}</b><span class="sm">${dRange(t.start, t.end)}</span><span class="sm">${line}</span>${mine ? `<span class="you-in">${r === 'visitor' ? 'Ci vai' : 'Sei iscritto'}</span>` : ''}</button>`;
  }).join('')}</div></section>`;
}
function partnersSection() {
  let h = '';
  if (S.offers.length) h += `<section class="sec"><div class="sec-h"><h2 class="t-m">Offerte dei partner</h2><button class="link" data-a="go" data-s="partner">Tutti i partner</button></div>${S.offers.slice(-3).reverse().map(offerRow).join('')}</section>`;
  return h + `<section class="sec"><div class="sec-h"><h2 class="t-m">Partner del circuito</h2><button class="link" data-a="go" data-s="partner">Vedi tutti</button></div><div class="hs">${PARTNERS.map(p => partnerTile(p, 'hs-tile')).join('')}</div></section>`;
}
function scrHome() { const r = role(); return r === 'visitor' ? homeVisitor() : r === 'staff' ? homeStaff() : homePlayer(); }
function homePlayer() {
  const live = liveTappa(), regs = myRegs(), me = live ? myGroupInfo(live) : null;
  let h = homeHeader() + '<div class="pad">';
  if (live) h += liveCard(live);
  if (me && me.gi != null) {
    const L = LETTERS[me.gi], q = me.C.cfg.q;
    h += `<section class="sec"><div class="sec-h"><h2 class="t-m">${me.next ? 'La tua prossima partita' : 'Il tuo girone'}</h2><span class="sm">Girone ${L}, ${me.c.l.toLowerCase()}</span></div><div class="card">`;
    if (me.next) { const opp = me.next.a === me.p.id ? me.next.b : me.next.a; h += versus(me.C, me.p.id, opp) + `<div class="nm-meta"><span>${I('cal')}${dShort(me.next.at)}, ${hm(me.next.at)}</span><span>${I('pin')}Campo ${me.next.court}</span></div>`; }
    h += `<div class="nm-pos"><span class="pos-badge">${me.pos}°</span><span>Sei ${me.pos}° nel girone ${L}. ${q === 1 ? 'Passa il turno la prima.' : 'Passano il turno le prime 2.'}</span></div><button class="btn btn-ghost btn-sm w100" data-a="go" data-s="girone" data-tid="${live.id}" data-k="${me.C.k}" data-gi="${me.gi}">Vedi il girone</button></div></section>`;
  }
  const nextReg = regs.find(x => tStatus(x.t) === 'open');
  if (nextReg) {
    const td = myTd(nextReg.t.id);
    h += `<section class="sec"><div class="sec-h"><h2 class="t-m">La tua prossima tappa</h2>${regPill(nextReg.status)}</div><button class="card nreg" data-a="go" data-s="tappa" data-tid="${nextReg.t.id}">${tileNum(nextReg.t)}<span class="grow"><b>${esc(nextReg.t.city)}</b><span class="sm">${dRange(nextReg.t.start, nextReg.t.end)}, ${nextReg.c.l.toLowerCase()}</span><span class="sm">${nextReg.status === 'ok' ? (nextReg.partner ? `In coppia con ${esc(nextReg.partner.f + ' ' + nextReg.partner.l)}` : nextReg.reserve ? 'Sei in riserva: entri se qualcuno si ritira' : `Coppia e girone estratti dopo il ${dNum(regCloseDate(nextReg.t))}`) : nextReg.status === 'review' ? 'Lo staff sta controllando la richiesta' : 'Richiesta non approvata'}</span></span>${I('chev')}</button>${td ? tdCard(td) : ''}</section>`;
  } else if (!regs.length) {
    h += `<section class="sec"><div class="firstcard"><h2 class="t-l">Gioca la tua prima tappa</h2><p>L'iscrizione è gratuita e i posti sono limitati. Ci si può iscrivere a ${TAPPE.filter(t => tStatus(t) === 'open').map(t => t.city).join(', ').replace(/, ([^,]*)$/, ' e $1')}.</p><button class="btn btn-ball" data-a="tabNext">Scegli una tappa</button></div></section>`;
  }
  h += upcomingSection();
  h += `<section class="sec"><div class="sec-h"><h2 class="t-m">Partite amichevoli aperte</h2><button class="link" data-a="tab" data-t="cerca">Vedi tutte</button></div>${friendlyCard(FRIENDLY[0])}</section>`;
  h += partnersSection() + '</div>';
  return { html: h, tabs: true, title: 'Home' };
}
function visTdLine(tid) {
  const x = myTd(tid);
  if (x) return tdCard(x);
  return S.rules.td ? `<button class="td-add" data-a="go" data-s="td" data-tid="${tid}">${I('car')}<span>Prenota un test drive a ${esc(T(tid).city)}</span>${I('plus')}</button>` : '';
}
function homeVisitor() {
  const live = liveTappa(), vs = S.visits.filter(v => v.uid === S.me && tStatus(T(v.tid)) !== 'done').sort((a, b) => a.tid - b.tid);
  let h = homeHeader() + '<div class="pad">';
  if (live) h += liveCard(live);
  if (vs.length) h += `<section class="sec"><div class="sec-h"><h2 class="t-m">${vs.length === 1 ? 'La tua visita' : 'Le tue visite'}</h2><span class="sm">Tocca il pass per mostrarlo</span></div>${vs.map(v => passCard(v) + visTdLine(v.tid)).join('')}</section>`;
  else h += `<section class="sec"><div class="firstcard"><h2 class="t-l">Vieni a vedere una tappa</h2><p>L'ingresso è gratuito per chi si iscrive come visitatore. Durante la giornata puoi provare una MINI con la concessionaria: il test drive lo pre-prenoti qui.</p><button class="btn btn-ball" data-a="tabNext">Scegli una tappa</button></div></section>`;
  h += upcomingSection() + partnersSection() + '</div>';
  return { html: h, tabs: true, title: 'Home' };
}
function homeStaff() {
  const live = liveTappa(), act = TAPPE.filter(t => ['live', 'open'].includes(tStatus(t)));
  let h = homeHeader() + '<div class="pad">';
  if (live) h += liveCard(live);
  const todo = [];
  act.forEach(t => { const n = S.tds.filter(x => x.tid === t.id && x.status === 'pre').length; if (n) todo.push(['car', `${n} test drive da confermare`, `${t.city}, ${tStatus(t) === 'live' ? 'oggi' : dShort(t.start).toLowerCase()}`, `data-a="go" data-s="pubblico" data-tid="${t.id}"`]); });
  act.forEach(t => { const n = pendingFor(t.id).length; if (n) todo.push(['users', `${n === 1 ? '1 richiesta' : n + ' richieste'} di iscrizione da confermare`, t.city, `data-a="go" data-s="tappa" data-tid="${t.id}" data-tab="iscritti"`]); });
  S.codes.filter(c => c.on && c.used >= c.max * 0.9).forEach(c => todo.push(['key', `${c.used >= c.max ? 'Inviti finiti' : 'Inviti quasi finiti'}: ${c.dealer.replace('Concessionaria ', '')}`, `${c.used} di ${c.max} usati, codice ${fmtCode(c.code)}`, 'data-a="go" data-s="codes"']));
  h += `<section class="sec"><div class="sec-h"><h2 class="t-m">Da fare</h2>${todo.length ? `<span class="sm">${todo.length === 1 ? '1 cosa' : todo.length + ' cose'}</span>` : ''}</div>${todo.length ? `<div class="card todo-list">${todo.map(([ic, b, s, a]) => `<button class="todo" ${a}><span class="tile">${I(ic)}</span><span class="grow"><b>${esc(b)}</b><span class="sm">${esc(s)}</span></span>${I('chev')}</button>`).join('')}</div>` : `<div class="card"><p class="body" style="font-size:14px">Niente in sospeso: test drive confermati e codici in ordine.</p></div>`}</section>`;
  const tile = (ic, b, s, a) => `<button class="tool-tile" ${a}>${I(ic)}<b>${b}</b><span class="sm">${s}</span></button>`;
  const used = S.codes.reduce((x, c) => x + c.used, 0), pt = live || act[0];
  h += `<section class="sec"><div class="sec-h"><h2 class="t-m">Strumenti staff</h2></div><div class="tools-grid">${tile('key', 'Codici di ingresso', `${S.codes.length} concessionarie, ${used} giocatori`, 'data-a="go" data-s="codes"')}${pt ? tile('car', 'Visitatori e test drive', `Tappa di ${esc(pt.city)}`, `data-a="go" data-s="pubblico" data-tid="${pt.id}"`) : ''}${tile('gear', 'Regole di iscrizione', 'Dati facoltativi e approvazione', 'data-a="go" data-s="rules"')}${tile('users', 'Contatti per gli sponsor', 'Numeri del circuito', 'data-a="go" data-s="leads"')}</div></section>`;
  h += upcomingSection() + '</div>';
  return { html: h, tabs: true, title: 'Home' };
}

/* ================= all stages ================= */
function scrTappe(e) {
  e.f = e.f || 'all';
  const cnt = { done: 0, live: 0, open: 0, soon: 0 }, vis = isVis();
  TAPPE.forEach(t => { cnt[tStatus(t)]++; });
  const rk = circuitRanking('M'), myI = rk.findIndex(x => x.pid === S.me);
  const live = TAPPE.filter(t => tStatus(t) === 'live'), next = TAPPE.filter(t => ['open', 'soon'].includes(tStatus(t))), done = TAPPE.filter(t => tStatus(t) === 'done').reverse();
  const sections = e.f === 'next' ? [['In corso', live], ['Da giocare', next]] : e.f === 'done' ? [['Concluse', done]] : [['In corso', live], ['Da giocare', next], ['Concluse', done]];
  let h = statusBar() + `<div class="pad"><h1 class="t-xl">Circuito 2026</h1><p class="body mt8">27 tappe da marzo a novembre, una giornata ciascuna, con tabelloni maschile, femminile e misto.${vis ? ' Da visitatore vieni a vedere le partite e provi una MINI.' : ''}</p>`;
  h += `<div class="season" role="group" aria-label="Le 27 tappe della stagione">${TAPPE.map(t => `<button class="${tStatus(t)}" data-a="go" data-s="tappa" data-tid="${t.id}" aria-label="Tappa ${t.n}, ${esc(t.city)}, ${STATUS_L[tStatus(t)].toLowerCase()}" title="${t.n}. ${esc(t.city)}"></button>`).join('')}</div><div class="season-ax"><span>Marzo</span><span>Novembre</span></div>`;
  h += `<div class="legend-row"><span><i class="lg done"></i>${cnt.done} concluse</span><span><i class="lg live"></i>${cnt.live} in corso</span><span><i class="lg open"></i>${cnt.open} con iscrizioni aperte</span><span><i class="lg"></i>${cnt.soon} in programma</span></div>`;
  if (!vis) h += `<button class="rkcard" data-a="go" data-s="ranking" data-k="M"><span class="tile">${I('trophy')}</span><span><b>Classifica circuito</b><span class="sm">${S.org ? 'Vista staff: tutti i giocatori, con i nomi' : myI >= 0 ? `Sei ${myI + 1}° nel maschile con ${thou(rk[myI].pts)} punti` : 'Entri in classifica dopo la tua prima tappa'}</span></span>${I('chev')}</button>`;
  h += `<div class="segctl mt24" role="group" aria-label="Filtra tappe">${[['all', 'Tutte'], ['next', 'Da giocare'], ['done', 'Concluse']].map(([v, l]) => `<button data-a="filt" data-v="${v}" aria-pressed="${e.f === v}">${l}</button>`).join('')}</div>`;
  sections.forEach(([label, list]) => { if (list.length) h += `<h2 class="list-h">${label}</h2>` + list.map(tappaItem).join(''); });
  return { html: h + '</div>', tabs: true, title: 'Tappe' };
}
function tappaItem(t) {
  const s = tStatus(t), tot = tappaTotals(t);
  if (isVis()) {
    const v = myVisit(t.id);
    const extra = s === 'done' ? `Conclusa, ${tot.players} giocatori` : s === 'live' ? (v ? 'Si gioca oggi: ci vai anche tu' : 'Si gioca oggi: puoi ancora iscriverti') : s === 'open' ? (v ? 'Ci vai anche tu' : 'Visitatori ammessi, ingresso gratuito') : `Iscrizioni dal ${dNum(regOpenDate(t))}`;
    return `<button class="ti" data-a="go" data-s="tappa" data-tid="${t.id}">${tileNum(t)}<span class="ti-main"><span class="ti-city">${esc(t.city)}</span><span class="sm">${dRange(t.start, t.end)}, ${esc(t.club)}</span><span class="ti-x">${extra}</span></span>${s === 'live' || s === 'open' ? statusPill(s) : ''}</button>`;
  }
  const vis = canSee(t.id), mine = myRegs().some(x => x.t.id === t.id) || myEntries(t).length > 0;
  let extra;
  if (s === 'done') { const C = catData(t.id, 'M'), w = champOf(C); extra = vis && w != null ? `Vincitori maschile: ${esc(pairLabel(C, w))}` : `Conclusa, ${tot.players} giocatori`; }
  else if (s === 'live') extra = tot.brs ? `Si gioca oggi, fase finale` : `Si gioca oggi, ${tot.players} giocatori`;
  else if (s === 'open') extra = `${tot.players} giocatori iscritti${mine ? ', ci sei anche tu' : ''}`;
  else extra = `Iscrizioni dal ${dNum(regOpenDate(t))}`;
  const lock = !vis && s !== 'soon' ? `<span class="ti-lock" title="Nomi visibili solo agli iscritti">${I('lock')}</span>` : '';
  return `<button class="ti" data-a="go" data-s="tappa" data-tid="${t.id}">${tileNum(t)}<span class="ti-main"><span class="ti-city">${esc(t.city)}</span><span class="sm">${dRange(t.start, t.end)}, ${esc(t.club)}</span><span class="ti-x">${extra}</span></span>${s === 'live' || s === 'open' ? statusPill(s) : ''}${lock}</button>`;
}

/* ================= single stage ================= */
function tappaHero(t, s, stats, pills, reg) {
  const followed = S.follow.includes(t.id);
  return `<div class="hero">${statusBar(true)}<div class="topbar in-hero"><button class="ib light" data-a="back" aria-label="Indietro">${I('back')}</button><div class="tb-mid"><span class="tb-title">Tappa ${t.n} di 27</span></div><button class="ib light" data-a="follow" data-tid="${t.id}" aria-pressed="${followed}" aria-label="${followed ? 'Non seguire più la tappa' : 'Segui la tappa'}">${I('bell', followed ? 'fill' : '')}</button></div>${courtLines('hero-deco')}<div class="pad hero-in"><div class="hero-pills">${statusPill(s, true)}${pills}</div><h1 class="hero-city">${esc(t.city)}</h1><p class="hero-meta">${cap(dLong(t.start))}, ${esc(t.club)}</p><div class="hero-stats">${stats.map(([v, l]) => `<div><b>${v}</b><span>${l}</span></div>`).join('')}</div>${reg}</div></div>`;
}
function tdHeroLine(t) {
  const x = myTd(t.id);
  return `<button class="td-line" data-a="go" data-s="td" data-tid="${t.id}">${I('car')}<span>${x ? `Test drive: ${esc(tdModel(x))}, ${x.status === 'ok' ? `alle ${x.time}` : 'orario da confermare'}` : 'Vuoi provare una MINI durante la tappa? Prenota un test drive'}</span>${I('chev')}</button>`;
}
function scrTappa(e) {
  if (isVis()) return tappaVisitor(e);
  const t = T(e.tid), s = tStatus(t), vis = canSee(t.id);
  if (!e.k) { const mine = myEntries(t)[0], r = regOf(t.id); e.k = mine ? mine.C.k : r ? r.k : 'M'; }
  if (!e.tab) e.tab = s === 'done' && vis ? 'tabellone' : 'gironi';
  const C = catData(t.id, e.k), cat = CAT(e.k), tt = tappaTotals(t);
  let stats;
  if (s === 'soon') stats = [['3', 'categorie'], [dNum(regOpenDate(t)), 'apertura iscrizioni'], [dNum(regCloseDate(t)), 'chiusura iscrizioni']];
  else if (s === 'open') stats = [[tt.players, 'giocatori iscritti'], ['3', 'categorie'], [dNum(regCloseDate(t)), 'chiusura iscrizioni']];
  else stats = [[tt.players, 'giocatori'], [tt.groups, 'gironi'], [`${tt.played}/${tt.total}`, 'partite dei gironi']];
  let reg = '';
  const mr = myRegs().filter(x => x.t.id === t.id);
  if (s === 'open' && mr.length) {
    const x = mr[0], cl = x.c.l.toLowerCase(), pn = x.partner ? `${x.partner.f} ${x.partner.l}` : '';
    const txt = { ok: x.partner ? `Sei iscritto nel ${cl}: giochi con ${pn}.` : x.reserve ? `Sei iscritto nel ${cl}, in riserva: entri se qualcuno si ritira.` : `Sei iscritto nel ${cl}. Coppie e gironi si estraggono dopo il ${dNum(regCloseDate(t))}.`, review: `La tua richiesta per il ${cl} è in attesa: ti avvisiamo appena lo staff la conferma.`, no: `La tua richiesta per il ${cl} non è stata approvata.` }[x.status];
    reg = `<div class="reg-ok${x.status === 'no' ? ' no' : ''}">${I(x.status === 'no' ? 'x' : x.status === 'review' ? 'clock' : 'check')}<span>${esc(txt)}</span>${x.status !== 'no' ? `<button class="link light" data-a="unregOpen" data-tid="${t.id}" data-k="${x.c.k}">Annulla</button>` : ''}</div>`;
    if (x.status !== 'no' && S.rules.td) reg += tdHeroLine(t);
  } else if (s === 'open' && !S.org) reg = `<p class="hero-note">Iscrizione gratuita, a posti limitati.</p><button class="btn btn-ball mt16" data-a="regStart" data-tid="${t.id}">${regVerb()}</button>`;
  else if (s === 'soon') reg = `<p class="hero-note">Le iscrizioni aprono il ${dNum(regOpenDate(t))}. Tocca la campanella per ricevere un avviso.</p>`;
  else if (s === 'live' && !S.org && myEntries(t).length && S.rules.td) reg = tdHeroLine(t);
  if (S.org && (s === 'live' || s === 'open')) {
    const pre = S.tds.filter(x => x.tid === t.id && x.status === 'pre').length;
    reg += `<div class="hero-btns">${s === 'live' ? `<button class="btn btn-ball" data-a="tvOpen">${I('screen')}Apri la modalità schermo</button>` : ''}<button class="btn btn-onturf" data-a="go" data-s="pubblico" data-tid="${t.id}">${I('car')}Visitatori e test drive${pre ? `<span class="cnt-badge" aria-label="${pre} da confermare">${pre}</span>` : ''}</button></div>`;
  }
  const np = S.org ? pendingFor(t.id).length : 0;
  const pills = `${S.org ? '<span class="pill p-staff">Vista staff</span>' : ''}${np ? `<span class="pill p-wait">${np === 1 ? '1 richiesta' : np + ' richieste'} da confermare</span>` : ''}`;
  let h = tappaHero(t, s, stats, pills, reg);
  h += `<div class="tp-sticky"><div class="catrow" role="group" aria-label="Categoria">${CATS.map(c => `<button class="chip" data-a="cat" data-k="${c.k}" aria-pressed="${c.k === e.k}">${c.l}<span class="cnt">${catData(t.id, c.k).players.length}</span></button>`).join('')}</div><div class="segctl" role="tablist" aria-label="Sezioni della tappa">${[['gironi', 'Gironi'], ['tabellone', 'Tabellone'], ['iscritti', 'Iscritti'], ['info', 'Info']].map(([k, l]) => `<button role="tab" aria-selected="${e.tab === k}" data-a="sub" data-tab="${k}">${l}</button>`).join('')}</div></div>`;
  const body = vis || e.tab === 'info' ? { gironi: tabGironi, tabellone: tabTabellone, iscritti: tabIscritti, info: tabInfo }[e.tab](t, C, cat) : lockedTab(t, C, cat, e.tab);
  return { html: h + `<div class="pad tp-body" role="tabpanel">${body}</div>`, title: `Tappa di ${t.city}` };
}
function lockedTab(t, C, cat, tab) {
  const s = tStatus(t);
  const mine = myRegs().find(x => x.t.id === t.id);
  const why = mine && mine.status === 'review' ? 'La tua richiesta è in attesa: vedrai gironi e avversari appena lo staff la conferma.' : mine && mine.status === 'no' ? 'La tua richiesta non è stata approvata: per questa tappa i nomi restano riservati.' : s === 'done' ? 'La tappa è conclusa: nomi e risultati restano visibili solo a chi ha giocato.' : s === 'open' ? "Dopo l'iscrizione vedrai gironi, orari e avversari. L'iscrizione è gratuita." : s === 'live' ? `Gironi e risultati li vedono solo le coppie iscritte a ${esc(t.city)}.` : `Le iscrizioni aprono il ${dNum(regOpenDate(t))}.`;
  let h = `<div class="lock-card"><span class="lock-ic">${I('lock')}</span><h3 class="t-m">Nomi visibili solo agli iscritti</h3><p class="body">${why}</p>${s === 'open' && !mine ? `<button class="btn btn-primary btn-sm" data-a="regStart" data-tid="${t.id}">${regVerb()}</button>` : ''}</div><h3 class="list-h">${cap(cat.l.toLowerCase())}, in numeri</h3>`;
  if (tab === 'gironi') {
    if (!C.groups) return h + `<div class="pub-row"><span>Gironi</span><span class="sm">${C.players.length ? (C.drawn ? 'Non ancora sorteggiati' : 'Coppie e gironi non ancora estratti') : 'Nessun iscritto'}</span></div>`;
    const pr = catProgress(C);
    h += `<div class="pub-row"><span>Partite dei gironi giocate</span><b>${pr.played} di ${pr.total}</b></div>`;
    return h + C.groups.map((g, gi) => { let p = 0, n = 0; rrRounds(g).flat().forEach(([a, b]) => { n++; if (getSc(C, a, b)) p++; }); return `<div class="pub-row"><b>Girone ${LETTERS[gi]}</b><span class="sm">${g.length} coppie, ${p} di ${n} partite giocate</span></div>`; }).join('');
  }
  if (tab === 'tabellone') {
    if (!C.br) return h + `<div class="pub-row"><span>Tabellone</span><span class="sm">Non ancora generato</span></div>`;
    const R = bracketRounds(C), done = R.flat().filter(m => m.sets).length, tot = R.flat().filter(m => m.a !== BYE && m.b !== BYE).length;
    return h + `<div class="pub-row"><span>Tabellone</span><b>Da ${C.br.slots.length} coppie</b></div><div class="pub-row"><span>Partite giocate</span><b>${done} di ${tot}</b></div><div class="pub-row"><span>Vincitori</span><span class="sm">${champOf(C) != null ? 'Proclamati, nomi riservati' : 'Da definire'}</span></div>`;
  }
  const n = C.players.length, lv = C.players.map(id => PL(id).lv);
  return h + `<div class="pub-row"><span>Giocatori iscritti</span><b>${n} su ${CAP[C.k]}</b></div><div class="pub-row"><span>Livello medio</span><b>${n ? dec(lv.reduce((a, b) => a + b, 0) / n) : '–'}</b></div><div class="pub-row"><span>Livello più basso e più alto</span><b>${n ? `${dec(Math.min(...lv))} – ${dec(Math.max(...lv))}` : '–'}</b></div>`;
}
function orgBar(inner) { return S.org ? `<div class="orgbar"><span class="who">${I('tools')}Strumenti staff</span><span class="btns">${inner}</span></div>` : ''; }
function tabGironi(t, C, cat) {
  const s = tStatus(t), catl = cat.l.toLowerCase();
  if (!C.players.length) return empty(`Nessun iscritto nel ${catl}`, s === 'soon' ? `Le iscrizioni aprono il ${dNum(regOpenDate(t))}.` : `Non ci sono ancora giocatori iscritti nel ${catl}.`, S.org ? `<button class="btn btn-primary btn-sm" data-a="addOpen" data-tid="${t.id}" data-k="${C.k}">${I('plus')}Aggiungi giocatore</button>` : '');
  if (!C.drawn) return empty('Coppie non ancora estratte', `${C.players.length} giocatori iscritti nel ${catl}. ${S.org ? 'Estrai le coppie, poi potrai sorteggiare i gironi.' : `Lo staff estrae coppie e gironi dopo la chiusura delle iscrizioni, il ${dNum(regCloseDate(t))}.`}`, S.org ? `<button class="btn btn-primary btn-sm" data-a="go" data-s="draw" data-tid="${t.id}" data-k="${C.k}">${I('shuffle')}Estrai le coppie</button>` : '');
  if (!C.groups) return empty('I gironi non sono ancora stati sorteggiati', `${C.pairs.length} coppie estratte nel ${catl}. ${S.org ? 'Crea i gironi per pubblicare orari e campi.' : 'Te li comunichiamo appena vengono sorteggiati.'}`, S.org ? `<button class="btn btn-primary btn-sm" data-a="go" data-s="crea" data-tid="${t.id}" data-k="${C.k}">${I('grid')}Crea gironi</button>` : '');
  const pr = catProgress(C), pct = pr.total ? Math.round(pr.played / pr.total * 100) : 0;
  let h = orgBar(`<button class="btn btn-ghost btn-sm" data-a="go" data-s="crea" data-tid="${t.id}" data-k="${C.k}">Modifica gironi</button>${C.br ? `<button class="btn btn-primary btn-sm" data-a="sub" data-tab="tabellone">Tabellone</button>` : `<button class="btn btn-primary btn-sm" data-a="brOpen" data-tid="${t.id}" data-k="${C.k}">Genera tabellone</button>`}`);
  h += `<div class="sum"><div class="row btw"><b>${C.groups.length} gironi</b><span class="sm">${pr.played} di ${pr.total} partite giocate</span></div><div class="pbar"><span style="width:${pct}%"></span></div></div>`;
  h += C.groups.map((g, gi) => {
    const st = standings(C, gi); let p = 0, n = 0;
    rrRounds(g).flat().forEach(([a, b]) => { n++; if (getSc(C, a, b)) p++; });
    return `<button class="gcard" data-a="go" data-s="girone" data-tid="${t.id}" data-k="${C.k}" data-gi="${gi}"><span class="gcard-h"><b>Girone ${LETTERS[gi]}</b><span class="sm">${p} di ${n} giocate</span></span><table class="mini"><tbody>${st.map((r, i) => `<tr class="${i < C.cfg.q ? 'q' : ''}${isMe(C, r.id) ? ' me' : ''}"><td class="pos">${i + 1}</td><td class="nm"><span>${esc(pairLabel(C, r.id))}</span></td><td class="wlc">${r.v}–${r.p}</td><td class="pt">${r.pt}</td></tr>`).join('')}</tbody></table></button>`;
  }).join('');
  return h + `<p class="legend"><i></i>${qText(C.cfg.q)}. Vittoria 3 punti.</p>`;
}
function tabTabellone(t, C, cat) {
  if (!C.groups) return empty('Il tabellone non è ancora disponibile', 'Si genera dalle classifiche dei gironi, quindi prima vanno creati i gironi.', '');
  const Qn = C.groups.length * C.cfg.q;
  let size = 2; while (size < Qn) size *= 2;
  if (!C.br) {
    return empty('Il tabellone non è ancora stato generato', `${qText(C.cfg.q)}: ${Qn} coppie in un tabellone da ${size}.`, S.org ? `<button class="btn btn-primary btn-sm" data-a="brOpen" data-tid="${t.id}" data-k="${C.k}">${I('bracket')}Genera tabellone</button>` : '');
  }
  const R = bracketRounds(C), played = R.flat().filter(m => m.sets).length, total = R.flat().filter(m => m.a !== BYE && m.b !== BYE).length;
  let h = orgBar(`<button class="btn btn-ghost btn-sm" data-a="brOpen" data-tid="${t.id}" data-k="${C.k}">Rigenera tabellone</button>`);
  h += `<div class="row btw" style="margin-bottom:10px"><b style="font-size:14px">Tabellone da ${C.br.slots.length}</b><span class="sm">${played} di ${total} partite giocate</span></div>`;
  h += bracketTree(t, C, R);
  if (S.org) h += `<p class="org-hint">${I('edit')}Tocca una partita per inserire il risultato: chi vince avanza da solo al turno dopo.</p>`;
  return h;
}

function bracketTree(t, C, R) {
  const L = R.length, M0 = R[0].length, COLW = 172, GAP = 30, CH = 62, SLOT = 78, CHW = 150, TOP = 14;
  const H = Math.max(M0 * SLOT, 100) + TOP * 2, W = L * (COLW + GAP) + CHW;
  const y = (r, i) => TOP + (i + 0.5) * SLOT * Math.pow(2, r);
  let heads = '', lines = '', cards = '';
  R.forEach((ms, r) => {
    const x = r * (COLW + GAP);
    heads += `<button class="br-h" style="left:${x}px;width:${COLW}px" data-a="brScroll" data-x="${x}">${roundName(L, r)}</button>`;
    ms.forEach(m => {
      const cy = y(r, m.i);
      cards += bmCard(t, C, m, x, cy - CH / 2, L);
      if (r < L - 1) { const pcy = y(r + 1, m.i >> 1), x1 = x + COLW, xm = x + COLW + GAP / 2; lines += `<path d="M${x1} ${cy}H${xm}V${pcy}${m.i % 2 ? `M${xm} ${pcy}H${x + COLW + GAP}` : ''}"/>`; }
      else lines += `<path d="M${x + COLW} ${cy}H${x + COLW + GAP}"/>`;
    });
  });
  const ch = champOf(C), cx = L * (COLW + GAP), cyF = y(L - 1, 0);
  heads += `<span class="br-h" style="left:${cx}px;width:${CHW}px">Vincitori</span>`;
  cards += `<div class="champ${ch == null ? ' tbd' : isMe(C, ch) ? ' me' : ''}" style="left:${cx}px;top:${cyF - 46}px">${I('trophy')}<span class="sm">Vincitori ${esc(T(C.tid).city)}</span><b>${ch == null ? 'Da definire' : esc(pairLabel(C, ch))}</b></div>`;
  return `<div class="br-wrap" id="brWrap"><div class="br-heads" style="width:${W}px">${heads}</div><div class="btree" style="width:${W}px;height:${H}px"><svg class="br-lines" width="${W}" height="${H}" aria-hidden="true">${lines}</svg>${cards}</div></div>`;
}
function bmCard(t, C, m, x, top, L) {
  const row = (id, side) => {
    if (id === BYE) return `<div class="bm-row bye"><span class="tag"></span><span class="nm">Bye</span></div>`;
    if (id == null) return `<div class="bm-row tbd"><span class="tag"></span><span class="nm">Da definire</span></div>`;
    const win = m.sets && m.w === id, me = isMe(C, id), lv = !m.sets && C.br.live && C.br.live[m.r + '-' + m.i], part = lv && lv.a === m.a && lv.b === m.b ? lv.sets : null;
    const ss = (m.sets || part) ? (m.sets || part).map(s => s[side]).join(' ') : '';
    return `<div class="bm-row${win ? ' w' : ''}${me ? ' me' : ''}"><span class="tag">${C.br.tags[id] || ''}</span><span class="nm">${esc(pairLabel(C, id))}</span><span class="ss">${ss}</span></div>`;
  };
  const playable = m.a != null && m.b != null && m.a !== BYE && m.b !== BYE;
  const inner = row(m.a, 0) + row(m.b, 1), style = `left:${x}px;top:${top}px`;
  if (S.org && playable) return `<button class="bm${m.sets ? '' : ' pending'}" style="${style}" data-a="scOpen" data-kind="b" data-tid="${t.id}" data-k="${C.k}" data-r="${m.r}" data-i="${m.i}" aria-label="${roundName(L, m.r)}: ${esc(pairLabel(C, m.a))} contro ${esc(pairLabel(C, m.b))}${m.sets ? ', modifica risultato' : ', inserisci risultato'}">${inner}</button>`;
  return `<div class="bm" style="${style}">${inner}</div>`;
}

function reqCard(r) {
  const i = S.regs.indexOf(r), me = PL(r.uid), u = S.users[r.uid] || {}, f = r.fitp || fitpOf(r.uid), td = S.tds.find(x => x.uid === r.uid && x.tid === r.tid);
  const tags = [u.dealer ? `Invito di ${u.dealer}` : null, f.has ? `Tessera FITP ${f.num}` : null].filter(Boolean);
  const extra = profSummary(r.prof).concat(f.has ? [] : ['Tessera FITP da fare'], r.ins === 'yes' ? ["Vuole l'assicurazione"] : [], td ? ['Vuole un test drive'] : [], r.consents && r.consents.dealer ? ['Consenso al contatto'] : []);
  return `<div class="req"><div class="row gap12">${avatar(r.uid, 's')}<div style="flex:1;min-width:0"><b>${esc(me.f + ' ' + me.l)}</b><span class="sm" style="display:block">${CAT(r.k).l}${r.k === 'X' ? (r.g === 'f' ? ', donna' : ', uomo') : ''}, livello ${LV3[r.lc ? r.lc.lvl : levelOf(r.uid)].toLowerCase()}</span></div></div><div class="rtags">${tags.map(x => `<span class="rtag">${I('check')}${esc(x)}</span>`).join('')}${extra.map(x => `<span class="rtag soft">${esc(x)}</span>`).join('')}</div><div class="req-btns"><button class="btn btn-ghost btn-sm" data-a="reqNo" data-ri="${i}">Rifiuta</button><button class="btn btn-primary btn-sm" data-a="reqOk" data-ri="${i}">Conferma</button></div></div>`;
}
function tabIscritti(t, C, cat) {
  const gOf = {}; if (C.groups) C.groups.forEach((g, gi) => g.forEach(id => { gOf[id] = gi; }));
  const canEdit = S.org && !C.drawn, pend = S.org ? pendingFor(t.id, C.k) : [];
  let h = `<div class="row btw" style="margin-bottom:8px"><b style="font-size:15px">${C.players.length} giocatori iscritti</b>${canEdit ? `<button class="btn btn-ghost btn-sm" data-a="addOpen" data-tid="${t.id}" data-k="${C.k}">${I('plus')}Aggiungi</button>` : ''}</div>`;
  if (S.org && C.players.length >= 2 && !C.br) h += orgBar(C.drawn ? `<button class="btn btn-ghost btn-sm" data-a="go" data-s="draw" data-tid="${t.id}" data-k="${C.k}">Rifai l'estrazione</button>${C.groups ? '' : `<button class="btn btn-primary btn-sm" data-a="go" data-s="crea" data-tid="${t.id}" data-k="${C.k}">Crea gironi</button>`}` : `<button class="btn btn-primary btn-sm" data-a="go" data-s="draw" data-tid="${t.id}" data-k="${C.k}">${I('shuffle')}Estrai le coppie</button>`);
  if (pend.length) h += `<h3 class="list-h" style="margin-top:4px">Richieste da confermare</h3>` + pend.map(reqCard).join('');
  if (!S.org) h += `<p class="privacy-note">${I('lock')}<span>Vedi questo elenco perché sei iscritto a ${esc(t.city)}. Chi non è iscritto vede solo il numero di giocatori.</span></p>`;
  if (!C.players.length) return h + empty(`Nessun iscritto nel ${cat.l.toLowerCase()}`, tStatus(t) === 'soon' ? `Le iscrizioni aprono il ${dNum(regOpenDate(t))}.` : 'I giocatori iscritti compariranno qui.', '');
  if (C.drawn) {
    const sorted = [...C.pairs].sort((a, b) => b.rk - a.rk || a.id - b.id);
    h += `<h3 class="list-h">Coppie estratte</h3>` + sorted.map((p, i) => `<div class="prow${p.p.includes(S.me) ? ' me' : ''}"><span class="sd">${i + 1}</span>${pairAvs(C, p.id, 's')}<div class="pr-main"><b>${esc(pairLabel(C, p.id))}</b><span class="sm">${esc(pairFull(C, p.id))}</span></div>${lvl(p.lv)}${gOf[p.id] != null ? `<span class="gtag" aria-label="Girone ${LETTERS[gOf[p.id]]}">${LETTERS[gOf[p.id]]}</span>` : ''}</div>`).join('');
    if (C.reserve.length) h += `<h3 class="list-h">In riserva</h3>` + C.reserve.map(id => `<div class="prow${id === S.me ? ' me' : ''}"><span class="sd">–</span>${avatar(id, 's')}<div class="pr-main"><b>${esc(PL(id).f + ' ' + PL(id).l)}</b><span class="sm">Entra se qualcuno si ritira</span></div>${lvl(PL(id).lv)}</div>`).join('');
    return h;
  }
  const list = [...C.players].sort((a, b) => PL(b).lv - PL(a).lv || a - b);
  h += `<p class="sm" style="margin:10px 0 6px">In ordine di livello. Le coppie le estrae lo staff dopo il ${dNum(regCloseDate(t))}.</p>`;
  if (S.org) { const nf = list.filter(id => !fitpOf(id).has).length; if (nf) h += `<p class="org-hint" style="margin:0 0 8px">${I('alert')}${nf === 1 ? '1 giocatore deve' : nf + ' giocatori devono'} ancora fare la tessera FITP.</p>`; }
  return h + list.map((id, i) => `<div class="prow${id === S.me ? ' me' : ''}"><span class="sd">${i + 1}</span>${avatar(id, 's')}<div class="pr-main"><b>${esc(PL(id).f + ' ' + PL(id).l)}</b><span class="sm">${C.k === 'X' ? (PL(id).g === 'f' ? 'Donna, livello ' : 'Uomo, livello ') : 'Livello '}${LV3[levelOf(id)].toLowerCase()}</span></div>${S.org && !fitpOf(id).has ? '<span class="pend">FITP da fare</span>' : ''}${lvl(PL(id).lv)}${canEdit ? `<button class="ib small" data-a="rmOpen" data-tid="${t.id}" data-k="${C.k}" data-id="${id}" aria-label="Rimuovi ${esc(PL(id).f + ' ' + PL(id).l)}">${I('trash')}</button>` : ''}</div>`).join('');
}
function tabInfo(t, C, cat) {
  const cfg = C.cfg || defaultCfg(Math.max(C.pairs.length, 12));
  const rows = [['Sede', t.club], ['Indirizzo', t.addr], ['Data', `${cap(dLong(t.start))} 2026, tutto il giorno`], ['Programma', 'Gironi dalle 9, poi tabellone a eliminazione diretta fino alla finale.'], ['Coppie e gironi', 'Ti iscrivi da solo. Dopo la chiusura delle iscrizioni lo staff estrae le coppie, bilanciate per livello, e sorteggia i gironi.'], ['Iscrizioni', `Dal ${dNum(regOpenDate(t))} al ${dNum(regCloseDate(t))}. Gratuite e a posti limitati${manual() ? ', con conferma dello staff' : ''}.`], ['Chi gioca', 'Giocatori invitati dalle concessionarie MINI, con il codice di ingresso.'], ['Per giocare', 'Tessera FITP e certificato medico sportivo non agonistico.'], ['Visitatori', `Ingresso gratuito per chi si iscrive come visitatore.${S.rules.td ? ' Test drive MINI su prenotazione.' : ''}`], [`Formato del ${cat.l.toLowerCase()}`, `Gironi all'italiana, poi tabellone a eliminazione diretta. ${FMT_L[cfg.fmt]}.`], ['Qualificazione', qText(cfg.q)], ['Classifica dei gironi', 'Vittoria 3 punti. A parità contano differenza set, differenza game e scontro diretto.'], ['Privacy', 'Gironi, tabellone ed elenco delle coppie sono visibili solo agli iscritti di questa tappa e allo staff.'], ['Organizzazione', 'Lobiz agency per MINI Padel League']];
  return rows.map(([k, v]) => `<div class="info-row"><span class="sm">${k}</span><b>${esc(v)}</b></div>`).join('') + `<div class="info-row"><span class="sm">Partner del circuito</span><div class="plogos">${PARTNERS.slice(0, 6).map(p => `<span class="ptile xs"><img src="${p.uri}" alt="${esc(p.name)}"></span>`).join('')}</div><button class="link mt8" data-a="go" data-s="partner">Vedi tutti i ${PARTNERS.length} partner</button></div>`;
}

/* ================= group ================= */
function matchRow(t, C, m) {
  const s = getSc(C, m.a, m.b), tl = s ? tally(s, C.cfg.fmt) : null, lv = s ? null : getLive(C, m.a, m.b);
  const row = (id, side) => {
    const win = s && (side === 0 ? tl.aWin : !tl.aWin), me = isMe(C, id), shown = s || lv;
    const sets = shown ? shown.map(x => `<span class="${x[side] > x[1 - side] ? 'w' : ''}">${x[side]}</span>`).join('') : '';
    return `<div class="mr-t${win ? ' w' : ''}"><span class="nm">${esc(pairLabel(C, id))}</span>${me ? '<span class="you">Tu</span>' : ''}<span class="mr-sets">${sets}</span></div>`;
  };
  const when = `${dShort(m.at)}, ${hm(m.at)}, campo ${m.court}`;
  const meta = `<span>${s ? 'Giocata ' + dShort(m.at).toLowerCase() : lv ? `<span class="live-tag">In corso</span> Set ${lv.length} finito, campo ${m.court}` : when}</span>${S.org ? `<span class="act">${s ? 'Modifica' : lv ? 'Aggiorna' : 'Inserisci risultato'}</span>` : ''}`;
  const inner = row(m.a, 0) + row(m.b, 1) + `<div class="mr-meta">${meta}</div>`;
  return S.org ? `<button class="mrow${lv ? ' live' : ''}" data-a="scOpen" data-kind="g" data-tid="${t.id}" data-k="${C.k}" data-x="${m.a}" data-y="${m.b}" data-gi="${m.g}" data-r="${m.r}">${inner}</button>` : `<div class="mrow${lv ? ' live' : ''}">${inner}</div>`;
}

function scrGirone(e) {
  const t = T(e.tid), C = catData(e.tid, e.k), cat = CAT(e.k);
  if (!canSee(t.id)) return { html: statusBar() + topbar('Girone', `${t.city}, ${cat.l.toLowerCase()}`) + `<div class="pad"><div class="lock-card mt16"><span class="lock-ic">${I('lock')}</span><h3 class="t-m">Girone riservato agli iscritti</h3><p class="body">Classifica e partite di questo girone le vedono solo le coppie iscritte a ${esc(t.city)} e lo staff.</p><button class="btn btn-primary btn-sm" data-a="back">Torna indietro</button></div></div>`, title: 'Girone' };
  if (!C.groups || !C.groups[e.gi]) return { html: statusBar() + topbar('Girone') + `<div class="pad">${empty('Questo girone non esiste più', 'I gironi sono stati modificati. Torna alla tappa per vedere quelli nuovi.', '<button class="btn btn-primary btn-sm" data-a="back">Torna alla tappa</button>')}</div>`, title: 'Girone' };
  const L = LETTERS[e.gi], st = standings(C, e.gi), q = C.cfg.q;
  let h = statusBar() + topbar(`Girone ${L}`, `${t.city}, ${cat.l.toLowerCase()}`) + '<div class="pad">';
  const ab = (a, tl) => `<abbr title="${tl}" style="text-decoration:none">${a}</abbr>`;
  h += `<table class="stand"><caption class="sr">Classifica del girone ${L}</caption><thead><tr><th scope="col">#</th><th scope="col">Coppia</th><th scope="col">${ab('G', 'Partite giocate')}</th><th scope="col">${ab('V', 'Vittorie')}</th><th scope="col">${ab('±S', 'Differenza set')}</th><th scope="col">${ab('±G', 'Differenza game')}</th><th scope="col">Pt</th></tr></thead><tbody>${st.map((r, i) => `<tr class="${i < q ? 'q' : ''}${isMe(C, r.id) ? ' me' : ''}"><td class="pos">${i + 1}</td><td class="nm"><span>${esc(pairLabel(C, r.id))}</span></td><td>${r.g}</td><td>${r.v}</td><td>${sgn(r.sw - r.sl)}</td><td>${sgn(r.gw - r.gl)}</td><td class="pt">${r.pt}</td></tr>`).join('')}</tbody></table>`;
  h += `<p class="legend"><i></i>${q === 1 ? 'Passa il turno la prima' : 'Passano il turno le prime 2'}</p>`;
  if (S.org) h += `<p class="org-hint">${I('edit')}Tocca una partita per inserire o correggere il risultato.</p>`;
  const ms = scheduleOf(t, C).filter(m => m.g === e.gi);
  [...new Set(ms.map(m => m.r))].forEach(r => { h += `<h2 class="turn">Turno ${r + 1}</h2>` + ms.filter(m => m.r === r).map(m => matchRow(t, C, m)).join(''); });
  return { html: h + '</div>', title: `Girone ${L}` };
}

let DRAFT = null;
function initDraft(tid, k) {
  const C = catData(tid, k), cfg = C.cfg ? Object.assign({}, C.cfg) : defaultCfg(C.pairs.length);
  const [lo, hi] = nBounds(C.pairs.length);
  cfg.n = Math.min(hi, Math.max(lo, cfg.n));
  const keep = C.groups && C.groups.length === cfg.n && C.groups.flat().length === C.pairs.length;
  DRAFT = { tid, k, cfg, groups: keep ? C.groups.map(g => g.slice()) : makeGroups(C, cfg), sel: null };
}
function describeSizes(sizes) {
  const c = {}; sizes.forEach(s => { c[s] = (c[s] || 0) + 1; });
  return Object.keys(c).map(Number).sort((a, b) => b - a).map((k, i) => i === 0 ? `${c[k]} ${c[k] === 1 ? 'girone' : 'gironi'} da ${k} coppie` : `${c[k]} da ${k}`).join(' e ');
}
function scrCrea(e) {
  const t = T(e.tid), C = catData(e.tid, e.k), cat = CAT(e.k), n = C.pairs.length;
  const title = C.groups ? 'Modifica gironi' : 'Crea gironi';
  if (n < 3) return { html: statusBar() + topbar(title, `${t.city}, ${cat.l.toLowerCase()}`) + `<div class="pad">${empty('Servono almeno 3 coppie', `Nel ${cat.l.toLowerCase()} ci sono ${n} coppie. Aggiungine altre dalla sezione Iscritti.`, '<button class="btn btn-primary btn-sm" data-a="back">Torna alla tappa</button>')}</div>`, title };
  if (!DRAFT || DRAFT.tid !== e.tid || DRAFT.k !== e.k) initDraft(e.tid, e.k);
  const D = DRAFT, [lo, hi] = nBounds(n), Qn = D.groups.length * D.cfg.q;
  let size = 2; while (size < Qn) size *= 2;
  const byes = size - Qn;
  const brText = Qn < 2 ? 'Con un solo girone e una sola coppia qualificata non serve il tabellone: vince la prima del girone.' : `Al tabellone vanno ${Qn} coppie: tabellone da ${size}${byes ? `, con ${byes} bye per le migliori teste di serie` : ''}.`;
  const rank = {}; [...C.pairs].sort((a, b) => b.rk - a.rk || a.id - b.id).forEach((p, i) => { rank[p.id] = i + 1; });
  const methods = [['snake', 'Serpentina per ranking', 'Coppia 1 nel girone A, 2 nel B e così via, poi a ritroso: i gironi hanno la stessa forza.'], ['seeded', 'Teste di serie e sorteggio', 'Le prime coppie del ranking vanno una per girone, le altre vengono sorteggiate.'], ['random', 'Sorteggio libero', 'Tutte le coppie vengono sorteggiate, senza teste di serie.']];
  let h = statusBar() + topbar(title, `${t.city}, ${cat.l.toLowerCase()}, ${n} coppie`) + '<div class="pad">';
  h += `<h2 class="tool-h">Struttura</h2><div class="tool"><div class="tool-row"><div class="tx"><b>Numero di gironi</b><span>${describeSizes(D.groups.map(g => g.length))}</span></div><div class="stepper"><button data-a="cfgN" data-d="-1" aria-label="Un girone in meno"${D.cfg.n <= lo ? ' aria-disabled="true"' : ''}>${I('minus')}</button><output aria-live="polite">${D.cfg.n}</output><button data-a="cfgN" data-d="1" aria-label="Un girone in più"${D.cfg.n >= hi ? ' aria-disabled="true"' : ''}>${I('plus')}</button></div></div>`;
  h += `<div class="tool-row"><div class="tx"><b>Passano il turno</b></div><div class="seg" role="group" aria-label="Coppie qualificate per girone">${[[1, 'La prima'], [2, 'Le prime 2']].map(([v, l]) => `<button data-a="cfgQ" data-v="${v}" aria-pressed="${D.cfg.q === v}">${l}</button>`).join('')}</div></div>`;
  h += `<div class="tool-row"><div class="tx"><b>Formato partite</b></div><div class="seg" role="group" aria-label="Formato partite">${[['stb', '2 set + STB'], ['uno', 'Set unico']].map(([v, l]) => `<button data-a="cfgFmt" data-v="${v}" aria-pressed="${D.cfg.fmt === v}">${l}</button>`).join('')}</div></div></div>`;
  h += `<p class="info-line">${brText}</p>`;
  h += `<h2 class="tool-h">Composizione</h2><div class="tool"><div class="opts" role="radiogroup" aria-label="Metodo di composizione">${methods.map(([v, l, d]) => `<button class="opt" role="radio" aria-checked="${D.cfg.method === v}" data-a="cfgMethod" data-v="${v}"><span class="radio"></span><span class="grow"><b>${l}</b><span class="sm">${d}</span></span></button>`).join('')}</div>${D.cfg.method !== 'snake' ? `<div class="tool-row"><div class="tx"><b>Nuovo sorteggio</b><span>Rifà l'estrazione con gli stessi criteri.</span></div><button class="btn btn-ghost btn-sm" data-a="reshuffle">${I('shuffle')}Rimescola</button></div>` : ''}</div>`;
  h += `<div class="row btw" style="margin:20px 2px 8px"><h2 class="tool-h" style="margin:0">Anteprima</h2><span class="sm">${D.sel != null ? 'Tocca un\'altra coppia o "Sposta qui"' : 'Tocca due coppie per scambiarle'}</span></div>`;
  h += `<div class="prev-grid">${D.groups.map((g, gi) => {
    const target = D.sel != null && !g.includes(D.sel);
    return `<div class="pg${target ? ' target' : ''}"><div class="pg-h"><span>Girone ${LETTERS[gi]}</span>${target ? `<button class="pg-move" data-a="moveHere" data-gi="${gi}">Sposta qui</button>` : `<span class="sm">${g.length}</span>`}</div>${g.map(id => { const p = pairOf(C, id); return `<button class="gp${p.p.includes(S.me) ? ' me' : ''}" data-a="pick" data-id="${id}" aria-pressed="${D.sel === id}" aria-label="${esc(pairLabel(C, id))}, ranking ${rank[id]}, girone ${LETTERS[gi]}"><span class="sd">${rank[id]}</span><span class="nm">${esc(pairLabel(C, id))}</span><span class="gl">${dec(p.lv)}</span></button>`; }).join('')}</div>`;
  }).join('')}</div>`;
  h += `</div><div class="sticky-cta"><button class="btn btn-primary" data-a="publish">Pubblica gironi</button><p class="sm">Le coppie ricevono una notifica con girone, orari e campi.</p></div>`;
  return { html: h, cls: 'canvas no-pad', title };
}


/* ================= ranking ================= */
function scrRanking(e) {
  e.k = e.k || 'M';
  const rk = circuitRanking(e.k), doneN = TAPPE.filter(t => tStatus(t) === 'done').length, myI = rk.findIndex(x => x.pid === S.me), vis = visiblePlayers();
  let h = statusBar() + topbar('Classifica circuito', `Dopo ${doneN} tappe concluse`) + '<div class="pad">';
  h += `<div class="catrow mt8" role="group" aria-label="Categoria">${CATS.map(c => `<button class="chip" data-a="rkCat" data-k="${c.k}" aria-pressed="${c.k === e.k}">${c.l}</button>`).join('')}</div>`;
  const row = (x, i) => { const show = S.org || x.pid === S.me || vis.has(x.pid); return `<div class="rrow${i < 3 ? ' top' : ''}${x.pid === S.me ? ' me' : ''}${show ? '' : ' masked'}"><span class="rp">${i + 1}</span>${show ? avatar(x.pid, 's') : anonAv('s')}<span class="rn"><b>${show ? esc(PL(x.pid).f + ' ' + PL(x.pid).l) : 'Giocatore riservato'}</b><span class="sm">${x.n} ${x.n === 1 ? 'tappa' : 'tappe'}</span></span><span class="rpts">${thou(x.pts)}</span></div>`; };
  if (S.org) {
    h += `<p class="org-hint" style="margin:4px 0 10px">${I('tools')}Vista staff: vedi i nomi di tutti i giocatori del circuito.</p>` + rk.slice(0, 30).map(row).join('');
    if (myI >= 30) h += `<div class="rsep" aria-hidden="true">···</div>` + row(rk[myI], myI);
    return { html: h + '</div>', title: 'Classifica circuito' };
  }
  h += myI >= 0 ? `<div class="me-card"><span class="big">${myI + 1}°</span><span><b>su ${rk.length} giocatori</b><span class="sm" style="display:block">${thou(rk[myI].pts)} punti in ${rk[myI].n} ${rk[myI].n === 1 ? 'tappa' : 'tappe'}</span></span></div>` : `<div class="me-card"><span class="tile">${I('trophy')}</span><span><b>Non sei ancora in classifica</b><span class="sm" style="display:block">Entri dopo la tua prima tappa conclusa.</span></span></div>`;
  h += `<p class="privacy-note">${I('lock')}<span>Vedi i nomi solo dei giocatori che hanno partecipato alle tue stesse tappe. Gli altri restano riservati.</span></p>`;
  h += `<h2 class="list-h">${myI >= 0 ? 'Intorno a te' : 'Le prime posizioni'}</h2>`;
  const from = myI >= 0 ? Math.max(0, myI - 4) : 0, to = myI >= 0 ? Math.min(rk.length, myI + 5) : 10;
  h += rk.slice(from, to).map((x, j) => row(x, from + j)).join('');
  h += `<p class="sm" style="margin:14px 2px 0">Punti per tappa: vincitori 1.000, finalisti 600, semifinale 360, quarti 180, ottavi 90, fase a gironi 20.</p>`;
  return { html: h + '</div>', title: 'Classifica circuito' };
}

/* ================= search ================= */
function scrCerca(e) {
  e.f = e.f || 'tutto'; e.q = e.q || '';
  let h = statusBar() + `<div class="pad"><h1 class="t-l" style="padding-top:6px">Cerca</h1><label class="searchbox">${I('search')}<input type="search" data-input="q" placeholder="Città, club o giocatore" value="${esc(e.q)}" aria-label="Cerca città, club o giocatore" autocomplete="off"></label>`;
  h += `<div class="chips" role="group" aria-label="Mostra">${[['tutto', 'Tutto'], ['tappe', 'Tappe'], ['giocatori', 'Giocatori'], ['partite', 'Partite aperte']].map(([v, l]) => `<button class="chip" data-a="cercaF" data-v="${v}" aria-pressed="${e.f === v}">${l}</button>`).join('')}</div>`;
  return { html: h + `<div id="cercaRes">${cercaResults(e)}</div></div>`, tabs: true, title: 'Cerca' };
}
function cercaResults(e) {
  const q = norm(e.q.trim()), f = e.f, out = [], want = k => f === 'tutto' || f === k, idx = playerIndex();
  const anyVis = S.org || TAPPE.some(t => canSee(t.id));
  const pnote = `<p class="privacy-note">${I('lock')}<span>${S.org ? 'Vista staff: trovi tutti i giocatori del circuito.' : anyVis ? 'Trovi solo i giocatori delle tappe a cui sei iscritto.' : 'Quando ti iscrivi a una tappa potrai cercare gli altri iscritti.'}</span></p>`;
  if (!q) {
    if (want('partite')) out.push(`<h2 class="list-h">Partite amichevoli aperte</h2>` + FRIENDLY.map(friendlyCard).join(''));
    if (want('tappe')) out.push(`<h2 class="list-h">Tappe con iscrizioni aperte</h2>` + TAPPE.filter(t => tStatus(t) === 'open').map(tappaItem).join(''));
    if (f === 'giocatori') out.push(pnote);
    return out.join('');
  }
  if (want('tappe')) { const ts = TAPPE.filter(t => norm(t.city).includes(q) || norm(t.club).includes(q)); if (ts.length) out.push(`<h2 class="list-h">Tappe</h2>` + ts.map(tappaItem).join('')); }
  if (want('giocatori')) {
    const ps = S.players.filter(p => idx[p.id] && p.id !== S.me && norm(p.f + ' ' + p.l).includes(q)).slice(0, 8);
    if (ps.length) out.push(`<h2 class="list-h">Giocatori</h2>` + ps.map(p => { const w = idx[p.id], t = T(w.tid); return `<button class="plrow" data-a="go" data-s="tappa" data-tid="${t.id}" data-k="${w.k}" data-tab="iscritti">${avatar(p.id)}<span class="grow"><b>${esc(p.f + ' ' + p.l)}</b><span class="sm">Livello ${dec(p.lv)}, ultima tappa: ${esc(t.city)}</span></span>${I('chev')}</button>`; }).join('') + pnote);
    else if (f === 'giocatori') out.push(pnote);
  }
  if (want('partite')) { const fs = FRIENDLY.filter(m => norm(m.club).includes(q)); if (fs.length) out.push(`<h2 class="list-h">Partite aperte</h2>` + fs.map(friendlyCard).join('')); }
  if (!out.length) return `<div class="empty"><h3 class="t-m">Nessun risultato per "${esc(e.q.trim())}"</h3><p class="body">Prova con il nome di una città o di un club.${S.org ? '' : ' I giocatori li trovi solo se siete iscritti alla stessa tappa.'}</p></div>`;
  return out.join('');
}

/* ================= friendly match detail ================= */
function scrMatch(e) {
  const m = FRIENDLY[e.mid], joined = !!S.joined[m.id], u = USER();
  const people = m.players.map(p => ({ ini: p.f[0] + p.l[0], name: `${p.f} ${dec(p.lv)}`, c: AVC[p.c] }));
  if (joined) people.push({ me: true, ini: initials(ME()), name: `Tu ${dec(u.lvl)}` });
  const pos = [[27, 25], [73, 25], [27, 75], [73, 75]];
  let h = `<div class="mhero">${statusBar(true)}<div class="topbar in-hero"><button class="ib light" data-a="back" aria-label="Indietro">${I('back')}</button><div class="tb-mid"><span class="tb-title">Partita aperta</span></div><span class="tb-sp"></span></div><div class="lineup"><svg viewBox="0 0 100 200" aria-hidden="true"><use href="#court"/></svg>${pos.map(([x, y], i) => { const p = people[i]; return `<div class="pl" style="left:${x}%;top:${y}%">${p ? `<span class="av${p.me ? ' me' : ''}" style="${p.me ? '' : 'background:' + p.c}">${esc(p.ini)}</span>${esc(p.name)}` : '<span class="av open">+</span>Posto libero'}</div>`; }).join('')}</div></div>`;
  h += `<div class="pad" style="padding-top:20px"><div class="row btw gap12"><h1 class="t-l">${esc(m.club)}</h1>${lvl(m.lv)}</div><p class="sm mt4">${esc(m.kind)}</p><div class="facts"><div class="fact"><span class="sm">Quando</span><b>${m.dayL}, ${m.time}</b></div><div class="fact"><span class="sm">Durata</span><b>${m.dur} minuti</b></div><div class="fact"><span class="sm">Campo</span><b>${esc(m.court)}</b></div><div class="fact"><span class="sm">Il tuo lato</span><b>${u.side === 'drive' ? 'Destro (drive)' : u.side === 'both' ? 'Indifferente' : 'Sinistro (rovescio)'}</b></div></div>`;
  h += `<div class="sec"><h2 class="t-m" style="margin-bottom:8px">Sede</h2><div class="card row gap12" style="padding:12px"><span class="ib" style="background:var(--glass);box-shadow:none;color:var(--turf)">${I('pin')}</span><span style="flex:1"><b style="font-size:14px">${esc(m.club)}</b><span class="sm" style="display:block">${m.dist} da te, parcheggio interno</span></span></div></div>`;
  h += `<div class="sec"><h2 class="t-m" style="margin-bottom:6px">Cancellazione</h2><p class="body" style="font-size:14px">Puoi lasciare la partita fino a 24 ore prima senza pagare. Dopo, il posto passa a chi è in lista d'attesa.</p></div></div>`;
  h += `<div class="sticky-cta"><div class="cta-row"><div class="price"><span class="sm">Posti liberi</span><b>${friendlyOpen(m)} di 4</b></div><button class="btn ${joined ? 'btn-ghost' : 'btn-primary'}" data-a="join" data-mid="${m.id}">${joined ? 'Lascia la partita' : 'Unisciti alla partita'}</button></div></div>`;
  return { html: h, cls: 'no-pad', title: 'Partita aperta' };
}

/* ================= profile ================= */
function scrProfilo() { const r = role(); return r === 'visitor' ? profileVisitor() : r === 'staff' ? profileStaff() : profilePlayer(); }
const profTop = () => statusBar() + `<div class="topbar"><span class="tb-sp"></span><div class="tb-mid"><span class="tb-title">Profilo</span></div><button class="ib" data-a="go" data-s="settings" aria-label="Impostazioni">${I('gear')}</button></div>`;
function photoAv() { const u = USER(); return `<button class="prof-av${u.photo ? ' ph' : ''}" data-a="photo" aria-label="${u.photo ? 'Cambia la foto profilo' : 'Aggiungi una foto profilo'}">${u.photo ? `<img src="${u.photo}" alt="">` : initials(ME())}<span class="cam" aria-hidden="true">${I('camera')}</span></button>`; }
function profilePlayer() {
  const me = ME(), u = USER(), hist = myHistory(), rk = circuitRanking('M'), myI = rk.findIndex(x => x.pid === S.me), regs = myRegs();
  let played = 0, won = 0; hist.forEach(x => { played += x.played; won += x.won; });
  const tappe = new Set(hist.filter(x => x.st === 'done' || x.st === 'live').map(x => x.t.id)).size;
  const band = LV3[levelOf(S.me)], hasLvl = !!(u.lvlCard && u.lvlCard.lvl) || played > 0;
  let h = profTop();
  h += `<div class="prof-top">${photoAv()}<h1 class="t-l">${esc(me.f + ' ' + me.l)}</h1><p class="sm mt4" style="margin-bottom:0">${u.hand === 'dx' ? 'Destro' : 'Mancino'}, ${sideText(u.side)}</p><div class="badges">${hasLvl ? `<span class="badge">Livello ${band.toLowerCase()}</span>` : ''}</div></div>`;
  if (!hasLvl) h += `<div class="pad"><div class="lvcard"><span style="font-size:13px;opacity:.78">Livello di preparazione</span><div class="t-l" style="margin-top:6px">Da indicare</div><p class="sm" style="color:rgba(255,255,255,.8);margin:6px 0 0">Lo indichi quando ti iscrivi alla prima tappa: base, intermedio o agonista.</p></div>`;
  else h += `<div class="pad"><div class="lvcard"><div class="row btw" style="align-items:flex-end"><div><span style="font-size:13px;opacity:.78">Livello ${band.toLowerCase()}, punteggio</span><div class="big">${dec(u.lvl)}</div></div>${played ? '<span class="pill p-live">+0,3 in stagione</span>' : ''}</div><div class="pbar light"><span style="width:${played ? 64 : 8}%"></span></div><div class="row btw" style="font-size:12px;opacity:.78"><span>${played ? `64% verso il livello ${dec(Math.floor(u.lvl) + 1)}` : 'Si aggiorna dopo le prime partite'}</span><span>${played ? `Su ${played} partite` : ''}</span></div></div>`;
  h += `<div class="st3 mt12"><div class="stat"><span class="num">${tappe}</span><span class="sm">tappe giocate</span></div><div class="stat"><span class="num">${won}–${played - won}</span><span class="sm">vinte–perse</span></div><div class="stat"><span class="num">${played ? Math.round(won / played * 100) : 0}%</span><span class="sm">vittorie</span></div></div>`;
  if (myI >= 0) h += `<button class="rkcard" data-a="go" data-s="ranking" data-k="M"><span class="tile">${I('trophy')}</span><span><b>${myI + 1}° nel maschile</b><span class="sm">${thou(rk[myI].pts)} punti nella classifica circuito</span></span>${I('chev')}</button>`;
  const f = u.fitp, ps = profSummary(u.prof);
  h += `<section class="sec"><div class="sec-h"><h2 class="t-m">Il tuo circuito</h2></div><div class="sumlist"><div class="srow"><div><span class="sm">Ingresso</span><b>${u.dealer ? 'Invito di ' + esc(u.dealer) : 'Senza codice di ingresso'}</b>${u.code ? `<span class="sm">Codice ${fmtCode(u.code)}</span>` : ''}</div>${u.dealer ? I('check', 'okc') : ''}</div><div class="srow"><div><span class="sm">Tessera FITP</span><b>${f ? (f.has ? 'N. ' + esc(f.num) : 'Da fare prima della tappa') : 'La indichi quando ti iscrivi a una tappa'}</b></div>${f && f.has ? I('check', 'okc') : ''}</div><div class="srow"><div><span class="sm">Profilo facoltativo</span><b>${ps.length ? esc(ps.join('; ')) : 'Non compilato'}</b></div></div></div><p class="sm" style="margin:8px 2px 0">Li vede solo lo staff. Puoi aggiornarli alla prossima iscrizione.</p></section>`;
  h += `<section class="sec" id="mieIscr"><div class="sec-h"><h2 class="t-m">Le mie iscrizioni</h2><span class="sm">${regs.length ? regs.length === 1 ? '1 attiva' : regs.length + ' attive' : ''}</span></div>`;
  h += regs.length ? regs.map(x => `<button class="hist" data-a="go" data-s="tappa" data-tid="${x.t.id}" data-k="${x.c.k}">${tileNum(x.t)}<span class="grow"><b>${esc(x.t.city)}</b><span class="sm">${x.c.l}${x.partner ? `, con ${esc(x.partner.f)}` : x.reserve ? ', in riserva' : x.status === 'ok' ? ', coppia da estrarre' : ''}, ${tStatus(x.t) === 'live' ? 'oggi' : dRange(x.t.start, x.t.end)}</span></span><span class="res">${tStatus(x.t) === 'live' ? '<span class="pill p-live">In corso</span>' : regPill(x.status)}</span></button>`).join('') : `<div class="card" style="text-align:center"><p class="body" style="font-size:14px">Non sei ancora iscritto a nessuna tappa. Le iscrizioni sono aperte per ${TAPPE.filter(t => tStatus(t) === 'open').length} tappe, ed è gratuito.</p><button class="btn btn-primary btn-sm mt12" data-a="tabNext">Scegli una tappa</button></div>`;
  h += '</section>';
  const tds = S.tds.filter(x => x.uid === S.me && tStatus(T(x.tid)) !== 'done');
  if (tds.length) h += `<section class="sec"><div class="sec-h"><h2 class="t-m">I miei test drive</h2></div>${tds.map(tdCard).join('')}</section>`;
  const past = [...hist].filter(x => x.st === 'done').reverse();
  if (past.length) h += `<section class="sec"><div class="sec-h"><h2 class="t-m">Tappe giocate</h2><span class="sm">Più recenti prima</span></div>${past.map(x => { const r = catResults(x.C)[x.p.id]; return `<button class="hist" data-a="go" data-s="tappa" data-tid="${x.t.id}" data-k="${x.c.k}">${tileNum(x.t)}<span class="grow"><b>${esc(x.t.city)}</b><span class="sm">${x.c.l}, con ${esc(PL(x.p.p.find(p => p !== S.me)).f)}</span></span><span class="res">${r.label}<span>+${thou(r.pts)} punti</span></span></button>`; }).join('')}</section>`;
  return { html: h + '</div>', tabs: true, title: 'Profilo' };
}
function profileVisitor() {
  const me = ME(), u = USER(), up = S.visits.filter(v => v.uid === S.me && tStatus(T(v.tid)) !== 'done').sort((a, b) => a.tid - b.tid), tds = S.tds.filter(x => x.uid === S.me);
  let h = profTop();
  h += `<div class="prof-top"><span class="prof-av">${initials(me)}</span><h1 class="t-l">${esc(me.f + ' ' + me.l)}</h1><p class="sm mt4" style="margin-bottom:0">${esc(u.email)}</p><div class="badges"><span class="badge">Visitatore</span></div></div><div class="pad">`;
  h += `<section class="sec"><div class="sec-h"><h2 class="t-m">Le mie visite</h2>${up.length ? `<span class="sm">${up.length === 1 ? '1 tappa' : up.length + ' tappe'}</span>` : ''}</div>${up.length ? up.map(passCard).join('') : `<div class="card" style="text-align:center"><p class="body" style="font-size:14px">Non sei iscritto a nessuna tappa. Per i visitatori l'ingresso è gratuito.</p><button class="btn btn-primary btn-sm mt12" data-a="tabNext">Scegli una tappa</button></div>`}</section>`;
  if (S.rules.td || tds.length) h += `<section class="sec"><div class="sec-h"><h2 class="t-m">I miei test drive</h2></div>${tds.length ? tds.map(tdCard).join('') : '<p class="body" style="font-size:14px;margin:0 2px">Non hai test drive prenotati. Li pre-prenoti dalla pagina della tappa.</p>'}${u.lic ? `<p class="sm" style="margin:10px 2px 0">Patente ${maskLic(u.lic.num)}, scade ${esc(u.lic.exp)}: la proponiamo per le prossime prenotazioni.</p>` : ''}</section>`;
  h += `<section class="sec"><div class="upcard"><h2 class="t-m">Vuoi giocare anche tu?</h2><p class="body">Si gioca su invito delle concessionarie MINI. Se hai ricevuto un codice di ingresso, inseriscilo qui: il tuo account diventa da giocatore e restano le tue visite.</p><button class="btn btn-ghost btn-sm mt12" data-a="upgradeOpen">${I('key')}Inserisci il codice</button></div></section>`;
  return { html: h + '</div>', tabs: true, title: 'Profilo' };
}
function staffMenu() {
  const used = S.codes.reduce((a, c) => a + c.used, 0), go = (s, b, sub) => `<button class="set" data-a="go" data-s="${s}"><div class="tx"><b>${b}</b><span>${sub}</span></div>${I('chev', 'chev')}</button>`;
  return go('codes', 'Codici di ingresso', `${S.codes.length} concessionarie, ${used} giocatori entrati con un codice`) + go('rules', 'Regole di iscrizione', 'Dati facoltativi, conferma, test drive e assicurazione') + go('leads', 'Contatti per gli sponsor', 'Giocatori, visitatori e test drive del circuito') + go('partner', 'Partner e offerte', 'Pubblica le offerte riservate agli iscritti');
}
function profileStaff() {
  const me = ME(), u = USER(), act = TAPPE.filter(t => ['live', 'open'].includes(tStatus(t)));
  let h = profTop();
  h += `<div class="prof-top">${photoAv()}<h1 class="t-l">${esc(me.f + ' ' + me.l)}</h1><p class="sm mt4" style="margin-bottom:0">${esc(u.org || 'Staff')}, ${esc(u.email)}</p><div class="badges"><span class="badge org">Staff</span></div></div><div class="pad">`;
  h += `<h2 class="group-label">Strumenti staff</h2><div class="menu">${staffMenu()}</div>`;
  h += `<h2 class="group-label">Visitatori e test drive</h2><div class="menu">${act.map(t => { const v = S.visits.filter(x => x.tid === t.id).length, pre = S.tds.filter(x => x.tid === t.id && x.status === 'pre').length; return `<button class="set" data-a="go" data-s="pubblico" data-tid="${t.id}"><div class="tx"><b>${esc(t.city)}</b><span>${tStatus(t) === 'live' ? 'Oggi' : dShort(t.start)}: ${v === 1 ? '1 visitatore' : v + ' visitatori'}${pre ? `, ${pre} test drive da confermare` : ''}</span></div>${pre ? `<span class="cnt-badge">${pre}</span>` : ''}${I('chev', 'chev')}</button>`; }).join('')}</div>`;
  return { html: h + '</div>', tabs: true, title: 'Profilo' };
}

/* ================= settings ================= */
function getK(k) { return k.startsWith('u.') ? USER()[k.slice(2)] : k.split('.').reduce((o, p) => o[p], S); }
function setK(k, v) { if (k.startsWith('u.')) { USER()[k.slice(2)] = v; return; } const ps = k.split('.'), last = ps.pop(); ps.reduce((o, p) => o[p], S)[last] = v; }
function scrSettings() {
  const r = role(), u = USER();
  const sw = (key, label, sub) => `<div class="set"><div class="tx"><b>${label}</b>${sub ? `<span>${sub}</span>` : ''}</div><button class="switch" role="switch" aria-checked="${!!getK(key)}" aria-label="${label}" data-a="set" data-key="${key}"></button></div>`;
  const seg = (key, opts, label) => `<div class="seg" role="group" aria-label="${label}">${opts.map(([v, l]) => `<button data-a="seg" data-key="${key}" data-v="${v}" aria-pressed="${getK(key) === v}">${l}</button>`).join('')}</div>`;
  let h = statusBar() + topbar('Impostazioni') + '<div class="pad">';
  if (r === 'player') h += `<h2 class="group-label">Come giochi</h2><div class="menu"><div class="set"><div class="tx"><b>Mano</b></div>${seg('u.hand', [['dx', 'Destra'], ['sx', 'Sinistra']], 'Mano')}</div><div class="set stack"><div class="tx"><b>Lato preferito</b><span>Drive è il lato destro, rovescio il sinistro. Lo usiamo per bilanciare le coppie.</span></div>${seg('u.side', [['drive', 'Drive'], ['riv', 'Rovescio'], ['both', 'Entrambi']], 'Lato preferito')}</div></div>`;
  const notif = r === 'visitor' ? sw('notif.vis', 'Promemoria della visita', 'Il giorno prima e la mattina della tappa') + sw('notif.tdn', 'Test drive', "Quando la concessionaria conferma l'orario") + sw('notif.gir', 'Novità dalle tappe', 'Programma e orari delle tappe che segui')
    : r === 'staff' ? sw('notif.tdn', 'Nuovi test drive', 'Quando un giocatore o un visitatore ne pre-prenota uno') + sw('notif.codes', 'Codici di ingresso', 'Quando gli inviti di una concessionaria stanno finendo') + sw('notif.res', 'Risultati', 'Quando lo staff in sede salva un set')
    : sw('notif.rem', 'Promemoria partite', '2 ore prima di giocare') + sw('notif.gir', 'Gironi e orari', 'Quando escono nelle tue tappe') + sw('notif.res', 'Risultati', 'Delle tappe a cui sei iscritto');
  h += `<h2 class="group-label">Notifiche</h2><div class="menu">${notif}</div>`;
  h += `<h2 class="group-label">Account e privacy</h2><div class="menu">${r !== 'visitor' ? `<button class="set" data-a="photo"><div class="tx"><b>Foto profilo</b><span>${u.photo ? 'Cambia o rimuovi la tua foto' : 'Aggiungi una foto'}</span></div>${avatar(S.me, 's')}</button>` : ''}<div class="set"><div class="tx"><b>Email</b><span>${esc(u.email)}</span></div></div>${r === 'player' && u.dealer ? `<div class="set"><div class="tx"><b>Codice di ingresso</b><span>${fmtCode(u.code)}, invito di ${esc(u.dealer)}</span></div></div>` : ''}<button class="set" data-a="consents"><div class="tx"><b>Consensi e privacy</b><span>${r === 'staff' ? 'Comunicazioni dal circuito' : 'Chi vede i tuoi dati, foto e comunicazioni'}</span></div>${I('chev', 'chev')}</button></div>`;
  if (r === 'visitor') h += `<h2 class="group-label">Giocare</h2><div class="menu"><button class="set" data-a="upgradeOpen"><div class="tx"><b>Ho un codice di ingresso</b><span>Diventa giocatore con l'invito della tua concessionaria</span></div>${I('chev', 'chev')}</button></div>`;
  if (r === 'staff') h += `<h2 class="group-label">Staff</h2><div class="menu">${staffMenu()}</div>`;
  h += `<h2 class="group-label">Prototipo</h2><div class="menu">${r !== 'visitor' ? `<button class="set act" data-a="demoFill"><div class="tx"><b>Completa i gironi di Milano</b><span>Inserisce i risultati mancanti per provare il tabellone</span></div></button>` : ''}${S.regs.some(x => x.uid === S.me && x.status === 'review') ? `<button class="set act" data-a="approveMine"><div class="tx"><b>Lo staff conferma la mia richiesta</b><span>Simula la conferma dello staff</span></div></button>` : ''}<button class="set act" data-a="demoReset"><div class="tx"><b>Ripristina dati demo</b><span>Annulla tutte le modifiche fatte</span></div></button></div>`;
  h += `<div class="menu mt24"><button class="set danger" data-a="logout" style="justify-content:center"><div class="tx" style="text-align:center"><b>Esci</b></div></button></div><div class="set-foot">${mplTile()}<p class="sm" style="margin:8px 0 0">App del circuito 2026, versione 4.0</p>${powered()}</div></div>`;
  return { html: h, cls: 'canvas', title: 'Impostazioni' };
}

/* ================= staff: rules, entry codes, visitors, sponsor contacts ================= */
function scrRules() {
  const R = S.rules, pend = S.regs.filter(r => r.status === 'review');
  const sw = (key, label, sub) => `<div class="set"><div class="tx"><b>${label}</b><span>${sub}</span></div><button class="switch" role="switch" aria-checked="${!!R[key]}" aria-label="${label}" data-a="rule" data-key="${key}"></button></div>`;
  const seg = (key, opts, label) => `<div class="seg full" role="group" aria-label="${label}">${opts.map(([v, l]) => `<button data-a="ruleSeg" data-key="${key}" data-v="${v}" aria-pressed="${R[key] === v}">${l}</button>`).join('')}</div>`;
  let h = statusBar() + topbar('Regole di iscrizione', 'Valgono per tutte le tappe') + '<div class="pad">';
  h += `<p class="org-hint" style="margin-top:4px">${I('tools')}Decidi cosa chiedere a giocatori e visitatori. Le modifiche valgono dalle prossime iscrizioni.</p>`;
  h += `<h2 class="group-label">Chi entra nell'app</h2><div class="menu"><button class="set" data-a="go" data-s="codes"><div class="tx"><b>Giocatori</b><span>Solo con il codice di ingresso di una concessionaria MINI</span></div>${I('chev', 'chev')}</button><div class="set"><div class="tx"><b>Visitatori</b><span>Registrazione libera con nome, cognome ed email</span></div></div><div class="set"><div class="tx"><b>Staff</b><span>Account creati da Lobiz agency</span></div></div></div>`;
  h += `<h2 class="group-label">Obbligatorio per giocare</h2><div class="preview-card"><b>Nome e cognome, email, presa visione della privacy, livello, taglia della maglia, tessera FITP e certificato medico.</b><span>Tutto il resto è facoltativo. Per i visitatori bastano nome, cognome, email e presa visione della privacy.</span></div>`;
  h += `<h2 class="group-label">Domande facoltative del profilo</h2><div class="menu">${sw('mini', 'Hai una MINI?', 'Con la targa, se il giocatore vuole indicarla')}${sw('biz', 'Sei imprenditore o libero professionista?', 'Con ragione sociale e partita IVA, se vuole')}${sw('car', 'Che auto guidi e quando pensi di cambiarla', 'Utile alle concessionarie')}</div>`;
  h += `<h2 class="group-label">Conferma delle iscrizioni</h2><div class="menu"><div class="set stack"><div class="tx"><b>${R.approval === 'auto' ? 'Conferma automatica' : 'Lo staff conferma ogni richiesta'}</b><span>${R.approval === 'auto' ? 'Chi entra con un codice valido è iscritto subito. Lo staff può controllare i dati dopo.' : "Fino alla conferma il giocatore non vede gironi e avversari."}</span></div>${seg('approval', [['auto', 'Automatica'], ['manual', 'Manuale']], 'Conferma delle iscrizioni')}</div></div>`;
  h += `<h2 class="group-label">Test drive</h2><div class="menu">${sw('td', 'Accetta le pre-prenotazioni', "Giocatori e visitatori scelgono modello e fascia oraria e inseriscono la patente. L'orario lo conferma la concessionaria.")}</div>`;
  h += `<h2 class="group-label">Assicurazione</h2><div class="menu">${sw('insurance', "Proponi un'assicurazione gratuita", 'Il giocatore sceglie se attivarla quando si iscrive. Accendila quando il contratto con la compagnia è firmato.')}${R.insurance ? `<div class="set stack"><label class="fld" style="margin:0"><span>Nome della compagnia</span><input class="f-in" data-f="insurer" value="${esc(R.insurer || '')}" placeholder="Da definire" autocomplete="off"><span class="hint">Compare nell'iscrizione, accanto all'offerta.</span></label></div>` : ''}</div>`;
  if (R.approval === 'manual' || pend.length) h += `<h2 class="group-label">Richieste da confermare</h2>` + (pend.length ? `<div class="menu">${pend.map(r => `<button class="set" data-a="go" data-s="tappa" data-tid="${r.tid}" data-k="${r.k}" data-tab="iscritti"><div class="tx"><b>${esc(PL(r.uid).f + ' ' + PL(r.uid).l)}</b><span>${esc(T(r.tid).city)}, ${CAT(r.k).l.toLowerCase()}</span></div>${I('chev', 'chev')}</button>`).join('')}</div>` : `<p class="body" style="font-size:14px;margin:0 4px">Nessuna richiesta in attesa.</p>`);
  return { html: h + '</div>', cls: 'canvas', title: 'Regole di iscrizione' };
}
function codeCard(c, i) {
  const full = c.used >= c.max, pct = Math.min(100, Math.round(c.used / c.max * 100));
  return `<div class="code-card${c.on ? '' : ' off'}"><div class="row btw gap12"><div style="min-width:0"><b>${esc(c.dealer)}</b><span class="sm">${esc(c.city)}</span></div><button class="switch" role="switch" aria-checked="${c.on}" aria-label="Codice di ${esc(c.dealer)} attivo" data-a="codeToggle" data-i="${i}"></button></div><div class="cc-row"><span class="cc-code">${fmtCode(c.code)}</span><button class="btn btn-ghost btn-sm" data-a="copyCode" data-code="${fmtCode(c.code)}">${I('copy')}Copia</button></div><div class="pbar"><span style="width:${pct}%"></span></div><div class="row btw mt8"><span class="sm">${c.used} di ${c.max} inviti usati</span>${!c.on ? '<span class="pend">Disattivato</span>' : full ? '<span class="pend">Inviti finiti</span>' : ''}</div><button class="link mt8" data-a="codeMore" data-i="${i}">Aggiungi 10 inviti</button></div>`;
}
function scrCodes() {
  const C = S.codes, used = C.reduce((a, c) => a + c.used, 0), max = C.reduce((a, c) => a + c.max, 0), act = C.filter(c => c.on).length;
  const kpi = (v, l) => `<div class="kpi"><b>${thou(v)}</b><span>${l}</span></div>`;
  let h = statusBar() + topbar('Codici di ingresso', 'Concessionarie MINI') + '<div class="pad">';
  h += `<p class="org-hint" style="margin-top:4px">${I('tools')}Ogni concessionaria ha il suo codice: lo manda ai clienti che invita a giocare. Chi si registra come giocatore lo inserisce al primo accesso.</p>`;
  h += `<div class="kpis">${kpi(act, act === 1 ? 'codice attivo' : 'codici attivi')}${kpi(used, `giocatori entrati con un codice, su ${thou(max)} inviti`)}</div>`;
  h += `<button class="staff-add" data-a="codeNew">${I('plus')}Nuovo codice per una concessionaria</button><h2 class="list-h">Concessionarie</h2>${C.map(codeCard).join('')}`;
  return { html: h + '</div>', cls: 'canvas', title: 'Codici di ingresso' };
}
function tdRowStaff(x) {
  const p = PL(x.uid), u = S.users[x.uid], visitor = !!p.vis || (u && u.role === 'visitor'), ok = x.status === 'ok';
  return `<div class="tdrow">${ok ? `<span class="td-time">${x.time}</span>` : avatar(x.uid, 's')}<div class="grow"><b>${esc(p.f + ' ' + p.l)}</b><span class="sm">${esc(tdModel(x))}, ${x.slot === 'free' ? 'quando non gioca' : TD_SLOT_S[x.slot]}</span><span class="sm">Patente ${maskLic(x.lic.num)}, scade ${esc(x.lic.exp)}${x.lic.photo ? ', foto caricata' : ''}</span><span class="rtags"><span class="rtag soft">${visitor ? 'Visitatore' : 'Giocatore'}</span>${x.phone ? `<span class="rtag soft">${esc(x.phone)}</span>` : ''}</span></div><button class="btn ${ok ? 'btn-ghost' : 'btn-primary'} btn-sm" data-a="tdConfOpen" data-id="${x.id}">${ok ? 'Cambia' : 'Conferma'}</button></div>`;
}
function scrPubblico(e) {
  const t = T(e.tid); e.v = e.v || 'td';
  const vis = S.visits.filter(v => v.tid === t.id), tds = S.tds.filter(x => x.tid === t.id), guests = vis.reduce((a, v) => a + v.guests, 0);
  const pre = tds.filter(x => x.status === 'pre'), ok = tds.filter(x => x.status === 'ok').sort((a, b) => a.time.localeCompare(b.time));
  const kpi = (v, l) => `<div class="kpi"><b>${thou(v)}</b><span>${l}</span></div>`;
  let h = statusBar() + topbar('Visitatori e test drive', `Tappa di ${t.city}, ${tStatus(t) === 'live' ? 'oggi' : dShort(t.start).toLowerCase()}`) + '<div class="pad">';
  h += `<p class="org-hint" style="margin-top:4px">${I('tools')}Solo staff. Nell'app vera l'elenco dei test drive arriva anche alla concessionaria che li organizza.</p>`;
  h += `<div class="kpis">${kpi(vis.length, `visitatori iscritti${guests ? `, più ${guests} ospiti` : ''}`)}${kpi(tds.length, 'test drive pre-prenotati')}${kpi(pre.length, 'da confermare')}${kpi(ok.length, 'confermati')}</div>`;
  h += `<div class="segctl mt16" role="group" aria-label="Elenco">${[['td', `Test drive ${tds.length}`], ['vis', `Visitatori ${vis.length}`]].map(([v, l]) => `<button data-a="pubSeg" data-v="${v}" aria-pressed="${e.v === v}">${l}</button>`).join('')}</div>`;
  if (e.v === 'td') {
    if (!tds.length) h += empty('Nessun test drive', 'Le pre-prenotazioni di giocatori e visitatori compariranno qui.', '');
    if (pre.length) h += `<h2 class="list-h">Da confermare</h2>${pre.map(tdRowStaff).join('')}`;
    if (ok.length) h += `<h2 class="list-h">Confermati, in ordine di orario</h2>${ok.map(tdRowStaff).join('')}`;
  } else {
    h += vis.length ? `<h2 class="list-h">In ordine di iscrizione</h2>` + vis.slice().reverse().map(v => { const p = PL(v.uid), td = tds.find(x => x.uid === v.uid); return `<div class="vrow">${avatar(v.uid, 's')}<div class="grow"><b>${esc(p.f + ' ' + p.l)}</b><span class="sm">${ARRIVE_L[v.arrive]}, ${guestsL(v.guests).toLowerCase()}, pass ${esc(v.pass)}</span></div>${td ? `<span class="rtag soft">${I('car')}${td.status === 'ok' ? td.time : 'Test drive'}</span>` : ''}</div>`; }).join('') : empty('Nessun visitatore', 'Chi si iscrive come visitatore a questa tappa compare qui.', '');
  }
  return { html: h + '</div>', cls: 'canvas', title: 'Visitatori e test drive' };
}
function scrLeads() {
  const L = leadStats(), pct = (n, t) => t ? Math.round(n / t * 100) : 0;
  const kpi = (v, l) => `<div class="kpi"><b>${thou(v)}</b><span>${l}</span></div>`;
  const bar = (label, v, w) => `<div class="hbar"><span class="hb-l">${label}</span><span class="hb-t"><i style="width:${w}%"></i></span><span class="hb-v">${v}</span></div>`;
  let h = statusBar() + topbar('Contatti per gli sponsor', 'Circuito 2026') + '<div class="pad">';
  h += `<p class="org-hint" style="margin-top:4px">${I('tools')}Solo staff. Qui ci sono numeri aggregati: i singoli contatti vanno a MINI e ai partner solo con il consenso della persona.</p>`;
  h += `<div class="kpis">${kpi(L.N, 'giocatori nel circuito')}${kpi(L.visTot, 'visitatori iscritti alle tappe')}${kpi(L.tdTot, 'test drive pre-prenotati')}${kpi(L.newContact + L.visContact, 'contatti che vogliono essere ricontattati da MINI')}<div class="kpi wide"><b>${thou(L.ins)}</b><span>richieste di assicurazione gratuita, utili per trattare con la compagnia</span></div></div>`;
  const dmax = Math.max(1, ...L.dealers.map(x => x[1]));
  h += `<h2 class="list-h">Da quale concessionaria arrivano i giocatori</h2>${L.dealers.slice(0, 6).map(([d, n]) => bar(esc(d.replace('Concessionaria ', '')), n, Math.round(n / dmax * 100))).join('')}`;
  h += `<h2 class="list-h">Profilo facoltativo</h2><p class="sm" style="margin:-2px 2px 8px">Risponde il ${pct(L.answered, L.N)}% dei giocatori</p>${bar('Ha una MINI', pct(L.mini, L.N) + '%', pct(L.mini, L.N))}${bar('Impresa', pct(L.biz, L.N) + '%', pct(L.biz, L.N))}${bar('Non risponde', pct(L.N - L.answered, L.N) + '%', pct(L.N - L.answered, L.N))}`;
  h += `<h2 class="list-h">Quando pensano di cambiare auto</h2><p class="sm" style="margin:-2px 2px 8px">Tra chi guida un'auto di un'altra marca</p>${L.change.map(([k, n]) => bar(CHANGE_L[k], pct(n, L.cars) + '%', pct(n, L.cars))).join('')}`;
  const last = L.perT.filter(x => tStatus(x.t) !== 'open').slice(-6).reverse(), mt = Math.max(1, ...last.map(x => x.td)), mn = Math.max(1, ...last.map(x => x.n));
  h += `<h2 class="list-h">Test drive per tappa</h2><p class="sm" style="margin:-2px 2px 8px">Giocatori e visitatori, ultime 6 tappe</p>${last.map(x => bar(esc(x.t.city), x.td, Math.round(x.td / mt * 100))).join('')}`;
  h += `<h2 class="list-h">Nuovi contatti per tappa</h2><p class="sm" style="margin:-2px 2px 8px">Non clienti MINI e visitatori con consenso al contatto</p>${last.map(x => bar(esc(x.t.city), x.n, Math.round(x.n / mn * 100))).join('')}`;
  h += `<p class="sm" style="margin:16px 2px 0">Nel prototipo i numeri sono simulati. Nell'app vera si aggiornano a ogni iscrizione e a ogni test drive.</p>`;
  return { html: h + '</div>', cls: 'canvas', title: 'Contatti per gli sponsor' };
}

/* ================= staff: pair draw ================= */
let DRAW = null;
function scrDraw(e) {
  const t = T(e.tid), C = catData(e.tid, e.k), cat = CAT(e.k);
  const title = C.drawn ? "Rifai l'estrazione" : 'Estrazione coppie';
  if (C.players.length < 2) return { html: statusBar() + topbar(title, `${t.city}, ${cat.l.toLowerCase()}`) + `<div class="pad">${empty('Servono almeno 2 giocatori', 'Approva le richieste o aggiungi giocatori dalla sezione Iscritti.', '<button class="btn btn-primary btn-sm" data-a="back">Torna alla tappa</button>')}</div>`, title };
  if (!DRAW || DRAW.tid !== e.tid || DRAW.k !== e.k) DRAW = { tid: e.tid, k: e.k, method: 'level', seed: 0 };
  const res = drawPairs(C, DRAW.method, DRAW.seed); DRAW.res = res;
  const methods = [['level', 'Bilanciata per livello', 'Ogni coppia unisce un giocatore della metà più forte e uno della metà meno forte, estratti a sorte.'], ['random', 'Sorteggio libero', 'Le coppie vengono estratte a sorte, senza guardare il livello.']];
  let h = statusBar() + topbar(title, `${t.city}, ${cat.l.toLowerCase()}, ${C.players.length} giocatori`) + '<div class="pad">';
  h += `<h2 class="tool-h">Metodo</h2><div class="tool"><div class="opts" role="radiogroup" aria-label="Metodo di estrazione">${methods.map(([v, l, d]) => `<button class="opt" role="radio" aria-checked="${DRAW.method === v}" data-a="drawMethod" data-v="${v}"><span class="radio"></span><span class="grow"><b>${l}</b><span class="sm">${d}</span></span></button>`).join('')}</div><div class="tool-row"><div class="tx"><b>Nuova estrazione</b><span>Rifà il sorteggio con lo stesso metodo.</span></div><button class="btn btn-ghost btn-sm" data-a="drawShuffle">${I('shuffle')}Rimescola</button></div></div>`;
  const rn = res.reserve.length;
  h += `<p class="info-line">Si formano ${res.pairs.length} coppie${rn ? `: ${rn === 1 ? '1 giocatore resta' : rn + ' giocatori restano'} in riserva ed entra${rn === 1 ? '' : 'no'} se qualcuno si ritira` : ''}.${C.k === 'X' ? ' Nel misto ogni coppia è formata da un uomo e una donna.' : ''}</p>`;
  if (C.groups) h += `<div class="warn" style="margin:0 0 12px">${I('alert')}<span>I gironi sono già stati creati: con una nuova estrazione verranno cancellati gironi e risultati di questa categoria.</span></div>`;
  h += `<h2 class="tool-h">Anteprima</h2>` + res.pairs.map(([a, b], i) => { const A = PL(a), B = PL(b); return `<div class="dpair${a === S.me || b === S.me ? ' me' : ''}"><span class="sd">${i + 1}</span><span class="stk">${avatar(a, 's')}${avatar(b, 's')}</span><span class="grow"><b>${esc(A.l)} / ${esc(B.l)}</b><span class="sm">${esc(A.f)} ${dec(A.lv)} e ${esc(B.f)} ${dec(B.lv)}</span></span>${lvl(Math.round((A.lv + B.lv) * 5) / 10)}</div>`; }).join('');
  if (rn) h += `<h2 class="tool-h">In riserva</h2>` + res.reserve.map(id => `<div class="dpair${id === S.me ? ' me' : ''}"><span class="sd">–</span>${avatar(id, 's')}<span class="grow"><b>${esc(PL(id).f + ' ' + PL(id).l)}</b><span class="sm">Entra se qualcuno si ritira</span></span>${lvl(PL(id).lv)}</div>`).join('');
  h += `</div><div class="sticky-cta"><button class="btn btn-primary" data-a="drawConfirm">Conferma estrazione</button><p class="sm">I giocatori ricevono una notifica con il nome del compagno.</p></div>`;
  return { html: h, cls: 'canvas no-pad', title };
}

/* ================= profile photo ================= */
function photoSheet() {
  const ph = USER().photo;
  return `<div class="sh-body"><h2 class="t-l" id="shTitle">Foto profilo</h2><div class="ph-prev">${ph ? `<img src="${ph}" alt="La tua foto profilo">` : `<span>${initials(ME())}</span>`}</div><p class="sm" style="text-align:center;margin:0">La vedono solo lo staff e gli iscritti alle tue stesse tappe, accanto al tuo nome. Sugli schermi in sede compare solo con il tuo consenso.</p><p class="sc-err" id="phErr" role="alert" style="text-align:center"></p></div><div class="sh-foot"><button class="btn btn-primary" data-a="pickPhoto" data-target="user">${I('camera')}${ph ? "Scegli un'altra foto" : 'Scatta o scegli una foto'}</button>${ph ? '<button class="btn btn-text danger" data-a="dropPhoto" data-target="user">Rimuovi foto</button>' : '<button class="btn btn-text" data-a="closeSheet">Annulla</button>'}</div>`;
}

/* ================= visitors: pass, stage overview, registration ================= */
function qrSvg(seed, cls = '') {
  const n = 21, r = rngFor('qr' + seed), finder = (x, y) => x < 7 && y < 7;
  const inF = (x, y) => finder(x, y) || finder(x - (n - 7), y) || finder(x, y - (n - 7));
  let mods = '';
  for (let y = 0; y < n; y++) for (let x = 0; x < n; x++) if (!inF(x, y) && r() < 0.47) mods += `M${x} ${y}h1v1h-1z`;
  const fp = (x, y) => `<rect x="${x}" y="${y}" width="7" height="7"/><rect x="${x + 1}" y="${y + 1}" width="5" height="5" fill="#fff"/><rect x="${x + 2}" y="${y + 2}" width="3" height="3"/>`;
  return `<svg class="qr ${cls}" viewBox="-1.5 -1.5 24 24" aria-hidden="true"><rect x="-1.5" y="-1.5" width="24" height="24" fill="#fff"/><g fill="#0F2560">${fp(0, 0)}${fp(14, 0)}${fp(0, 14)}<path d="${mods}"/></g></svg>`;
}
function passCard(v) {
  const t = T(v.tid), st = tStatus(t);
  return `<button class="passc" data-a="passShow" data-tid="${t.id}" aria-label="Mostra il pass per ${esc(t.city)}"><span class="passc-l"><span class="passc-k">Pass visitatore</span><b>${esc(t.city)}</b><span class="sm">${st === 'live' ? 'Oggi' : dShort(t.start)}, ${ARRIVE_L[v.arrive].toLowerCase()}${v.guests ? `, ${guestsL(v.guests)}` : ''}</span></span><span class="passc-r">${qrSvg(v.pass, 'qr-s')}<span class="pass-code">${esc(v.pass)}</span></span></button>`;
}
function passBig(v) {
  const t = T(v.tid), me = ME();
  return `<div class="pass"><div class="pass-top"><span class="pass-k">Pass visitatore</span><b>Tappa di ${esc(t.city)}</b><span>${cap(dLong(t.start))}, ${esc(t.club)}</span></div><div class="pass-cut" aria-hidden="true"></div><div class="pass-main">${qrSvg(v.pass)}<div class="pass-who"><span class="pass-k">Intestato a</span><b>${esc(me.f + ' ' + me.l)}</b><span>${ARRIVE_L[v.arrive]}, ${guestsL(v.guests).toLowerCase()}</span><span class="pass-code">${esc(v.pass)}</span></div></div></div>`;
}
function tdCard(x) {
  const t = T(x.tid), ok = x.status === 'ok';
  return `<button class="tdcard" data-a="go" data-s="td" data-tid="${t.id}"><span class="tile">${I('car')}</span><span class="grow"><b>${esc(x.model === 'Non so ancora' ? 'Test drive MINI' : x.model)}</b><span class="sm">${esc(t.city)}, ${ok ? (tStatus(t) === 'live' ? 'oggi' : dShort(t.start).toLowerCase()) : x.slot === 'free' && role() !== 'player' ? 'quando non gioca' : TD_SLOT_S[x.slot]}</span></span><span class="pill ${ok ? 'p-ok' : 'p-wait'}">${ok ? `Alle ${x.time}` : 'Da confermare'}</span></button>`;
}
function tdBlock(o, player) {
  const on = !!o.tdOn;
  return `<div class="opt-wrap${on ? ' on' : ''}"><button class="opt" role="checkbox" aria-checked="${on}" data-a="tdToggle"><span class="cbox">${I('check')}</span><span class="grow"><b>Voglio provare una MINI</b><span class="sm">${player ? 'Durante la tappa, in un momento in cui non giochi.' : 'Durante la tappa, con la concessionaria.'} È una pre-prenotazione: l'orario lo conferma la concessionaria.</span></span></button>${on ? `<div class="opt-body">${tdFields(o.tdd, player)}</div>` : ''}</div>`;
}
function tdFields(d, player) {
  const chips = (key, opts, label) => `<div class="slot-chips" role="radiogroup" aria-label="${label}">${opts.map(([v, l]) => `<button class="chip" role="radio" data-a="tdSet" data-key="${key}" data-v="${esc(v)}" aria-checked="${d[key] === v}">${esc(l)}</button>`).join('')}</div>`;
  const slots = Object.entries(TD_SLOTS).filter(([k]) => player || k !== 'free');
  return `<div class="fld td-first"><span>Quale MINI vuoi provare?</span>${chips('model', TD_MODELS.map(m => [m, m]), 'Modello')}</div><div class="fld"><span>Quando preferisci?</span>${chips('slot', slots, 'Fascia oraria')}</div><div class="td-h">${I('id')}<span>La tua patente</span></div><div class="two">${field('td.num', 'Numero', d.num, { ac: 'off', ph: 'MI5521873K', max: 12 })}${field('td.exp', 'Scadenza', d.exp, { ac: 'off', im: 'numeric', ph: 'MM/AAAA', max: 7 })}</div><button class="upload mt12" data-a="tdPhoto">${I(d.photo ? 'check' : 'camera')}<span>${d.photo ? 'patente-fronte-retro.jpg, 1,2 MB' : 'Foto della patente, facoltativa'}</span>${d.photo ? '<span class="link">Sostituisci</span>' : ''}</button>${field('td.phone', 'Telefono, facoltativo', d.phone, { type: 'tel', ac: 'tel', im: 'tel', ph: 'Es. 333 1234567', max: 16, hint: "Per confermarti l'orario anche con un SMS." })}<p class="privacy-note">${I('lock')}<span>Serve la patente B valida: portala con te il giorno della prova. I dati della patente li vedono solo lo staff e la concessionaria.</span></p>`;
}
function tappaVisitor(e) {
  const t = T(e.tid), s = tStatus(t), v = myVisit(t.id), td = myTd(t.id), tt = tappaTotals(t);
  const stats = s === 'soon' ? [['3', 'categorie'], ['9', 'campi'], [dNum(regOpenDate(t)), 'apertura iscrizioni']] : [[tt.players, s === 'done' ? 'giocatori' : s === 'live' ? 'giocatori in campo' : 'giocatori iscritti'], ['9', 'campi'], ['Gratis', 'ingresso visitatori']];
  let reg;
  if (v && s !== 'done') reg = `<div class="reg-ok">${I('ticket')}<span>Sei iscritto come visitatore: pass <span class="nw">${esc(v.pass)}</span>, ${ARRIVE_L[v.arrive].toLowerCase()}${v.guests ? `, ${guestsL(v.guests)}` : ''}.</span><button class="link light" data-a="passShow" data-tid="${t.id}">Pass</button></div>`;
  else if (s === 'open' || s === 'live') reg = `<p class="hero-note">Vieni senza giocare: segui le partite dal vivo e, se vuoi, prova una MINI.</p><button class="btn btn-ball mt16" data-a="visStart" data-tid="${t.id}">Iscriviti come visitatore</button>`;
  else if (s === 'soon') reg = `<p class="hero-note">Le iscrizioni aprono il ${dNum(regOpenDate(t))}. Tocca la campanella per ricevere un avviso.</p>`;
  else reg = `<p class="hero-note">La tappa è conclusa. Nomi e risultati restano riservati ai giocatori.</p>`;
  return { html: tappaHero(t, s, stats, '', reg) + `<div class="pad tp-body">${visitorOverview(t, s, v, td)}</div>`, title: `Tappa di ${t.city}` };
}
function visitorOverview(t, s, v, td) {
  let h = '';
  if (s === 'live') { const tt = tappaTotals(t), pct = tt.total ? Math.round(tt.played / tt.total * 100) : 0; h += `<div class="ov-live"><div class="row btw"><span class="pill p-live">In diretta</span><span class="sm">${tt.played} di ${tt.total} partite dei gironi</span></div><div class="pbar mt12"><span style="width:${pct}%"></span></div><p class="sm mt12" style="margin-bottom:0">Risultati, classifiche e tabelloni li trovi sugli schermi in sede, aggiornati a ogni set.</p></div>`; }
  if (s !== 'done' && (td || S.rules.td)) {
    h += `<h2 class="list-h">Prova una MINI</h2>`;
    if (td) h += tdCard(td);
    else h += `<div class="tdpromo"><span class="tile">${I('car')}</span><div class="grow"><b>Test drive durante la tappa</b><span class="sm">MINI Cooper, Aceman o Countryman, con la concessionaria. Lo pre-prenoti qui, l'orario te lo conferma la concessionaria.</span><button class="btn btn-primary btn-sm mt12" ${v ? `data-a="go" data-s="td" data-tid="${t.id}"` : `data-a="visStart" data-tid="${t.id}" data-td="1"`}>${v ? 'Prenota un test drive' : 'Iscriviti e prenota un test drive'}</button></div></div>`;
  }
  h += `<h2 class="list-h">Programma della giornata <span class="sm">· orari indicativi</span></h2><div class="ov-prog">${[['9:00', 'Gironi', 'Maschile, femminile e misto, su 9 campi'], ['10–18', 'Test drive MINI', 'Con la concessionaria, su prenotazione'], ['Pomeriggio', 'Tabellone', 'Eliminazione diretta fino alle finali'], ['Sera', 'Finali e premiazione', 'Con i partner del circuito']].map(([a, b, c]) => `<div class="ov-row"><span class="ov-t">${a}</span><div><b>${b}</b><span class="sm">${c}</span></div></div>`).join('')}</div>`;
  h += `<h2 class="list-h">Informazioni</h2>` + [['Sede', t.club], ['Indirizzo', t.addr], ['Data', `${cap(dLong(t.start))} 2026, tutto il giorno`], ['Ingresso', "Gratuito per chi si iscrive come visitatore: mostra il pass dell'app"], ['Chi gioca', 'Giocatori invitati dalle concessionarie MINI'], ['Organizzazione', 'Lobiz agency per MINI Padel League']].map(([k, val]) => `<div class="info-row"><span class="sm">${k}</span><b>${esc(val)}</b></div>`).join('');
  h += `<div class="info-row"><span class="sm">Partner del circuito</span><div class="plogos">${PARTNERS.slice(0, 6).map(p => `<span class="ptile xs"><img src="${p.uri}" alt="${esc(p.name)}"></span>`).join('')}</div><button class="link mt8" data-a="go" data-s="partner">Vedi tutti i ${PARTNERS.length} partner</button></div>`;
  return h + `<p class="privacy-note">${I('lock')}<span>Nomi, gironi e tabelloni nell'app sono riservati ai giocatori della tappa. In sede li vedi sugli schermi.</span></p>`;
}
let VIS = null;
const newVIS = (tid, td) => { const c = USER().consents || {}; return { tid, arrive: null, guests: 0, tdOn: !!td && S.rules.td, tdd: tdPrefill(), cDealer: !!c.dealer, cPartners: !!c.partners }; };
function visCheck(key, title, sub) { return `<button class="check" role="checkbox" aria-checked="${!!VIS[key]}" data-a="visCheck" data-key="${key}"><span class="box">${I('check')}</span><span><b>${title}</b>${sub ? `<span class="sm">${sub}</span>` : ''}</span></button>`; }
function scrVisita() {
  if (!VIS) return { html: statusBar() + topbar('Iscrizione visitatore') + `<div class="pad">${empty('Nessuna iscrizione in corso', 'Scegli una tappa per iscriverti come visitatore.', '')}</div>`, title: 'Iscrizione visitatore' };
  const t = T(VIS.tid), st = tStatus(t);
  const arrive = `<div class="slot-chips" role="radiogroup" aria-label="Quando pensi di arrivare">${[['matt', 'In mattinata'], ['pom', 'Nel pomeriggio'], ['tutto', 'Tutto il giorno']].map(([v, l]) => `<button class="chip" role="radio" data-a="visSet" data-key="arrive" data-v="${v}" aria-checked="${VIS.arrive === v}">${l}</button>`).join('')}</div>`;
  let h = statusBar() + topbar('Iscrizione visitatore', `Tappa di ${t.city}`) + `<div class="pad form-h"><p class="flow-ctx">Ingresso gratuito, ${st === 'live' ? 'oggi' : dLong(t.start)}, ${esc(t.club)}</p><h1 class="t-xl">Vieni a vedere la tappa di ${esc(t.city)}</h1><p class="body mt8">Non giochi: segui le partite dal vivo, passi dall'area dei partner e, se vuoi, provi una MINI.</p>`;
  h += `<h2 class="tool-h">Quando pensi di arrivare?</h2>${arrive}`;
  h += `<h2 class="tool-h">Vieni con qualcuno?</h2><div class="tool"><div class="tool-row"><div class="tx"><b>Ospiti</b><span>Persone che vengono con te, oltre a te</span></div><div class="stepper"><button data-a="visGuests" data-d="-1" aria-label="Un ospite in meno"${VIS.guests <= 0 ? ' aria-disabled="true"' : ''}>${I('minus')}</button><output aria-live="polite">${VIS.guests}</output><button data-a="visGuests" data-d="1" aria-label="Un ospite in più"${VIS.guests >= 3 ? ' aria-disabled="true"' : ''}>${I('plus')}</button></div></div></div>`;
  if (S.rules.td) h += `<h2 class="tool-h">Test drive, facoltativo</h2>${tdBlock(VIS, false)}`;
  h += `<h2 class="tool-h">Consensi facoltativi</h2>${visCheck('cDealer', 'Voglio essere ricontattato da MINI', 'Dalla concessionaria più vicina, per novità e offerte.')}${visCheck('cPartners', 'Voglio ricevere le offerte dei partner del circuito', 'Puoi cambiare idea quando vuoi dalle impostazioni.')}`;
  h += `<p class="sc-err" id="formErr" role="alert"></p></div><div class="sticky-cta"><button class="btn btn-primary" data-a="visSave">Conferma l'iscrizione</button><p class="sm">Ricevi il pass da mostrare all'ingresso.</p></div>`;
  return { html: h, cls: 'no-pad flow', title: `Visita a ${t.city}` };
}
function scrVisitaOk(e) {
  const t = T(e.tid), v = myVisit(t.id);
  if (!v) return { html: statusBar() + topbar('Iscrizione visitatore') + `<div class="pad">${empty('Iscrizione non trovata', 'Potrebbe essere stata annullata. Controlla le tue visite nel profilo.', '')}</div>`, title: 'Iscrizione visitatore' };
  const td = myTd(t.id), st = tStatus(t);
  const steps = [['done', 'Iscrizione da visitatore', 'Oggi']];
  if (td) steps.push(['now', 'Test drive pre-prenotato', `${tdModel(td)}, ${TD_SLOT_S[td.slot]}: la concessionaria ti conferma l'orario`]);
  steps.push(['todo', st === 'live' ? 'Oggi, in sede' : `${cap(dLong(t.start))}, in sede`, `Mostra il pass all'ingresso di ${t.club}`]);
  const h = `<div class="ok-hero">${statusBar(true)}<div class="flow-top"><span class="tb-sp"></span><div class="flow-prog"></div><button class="ib light" data-a="okClose" aria-label="Chiudi">${I('x')}</button></div><div class="ok-mark">${I('check')}</div><h1 class="t-xl">Ci vediamo a ${esc(t.city)}</h1><p>Sei iscritto come visitatore. Il pass lo trovi sempre nella home e nel tuo profilo.</p></div><div class="pad"><div class="mt24">${passBig(v)}</div><h2 class="t-m mt24" style="margin-bottom:14px">Cosa succede adesso</h2><ol class="timeline">${steps.map(([s, l, d], i) => `<li class="${s}"><span class="tl-dot">${s === 'done' ? I('check') : i + 1}</span><div><b>${esc(l)}</b><span class="sm">${esc(d)}</span></div></li>`).join('')}</ol><button class="btn btn-primary mt24" data-a="okClose">Vai alla tappa</button><button class="btn btn-text w100 mt4" data-a="tab" data-t="home">Torna alla home</button></div>`;
  return { html: h, title: 'Iscrizione confermata' };
}

/* ================= test drive (players and visitors) ================= */
let TDF = null;
function scrTd(e) {
  const t = T(e.tid), x = myTd(t.id), st = tStatus(t), pl = role() === 'player', title = 'Test drive', sub = `Tappa di ${t.city}`;
  const allowed = pl ? myRegs().some(r => r.t.id === t.id && r.status !== 'no') || myEntries(t).length > 0 : !!myVisit(t.id);
  if (!x && (!allowed || st === 'done' || st === 'soon')) return { html: statusBar() + topbar(title, sub) + `<div class="pad">${empty(st === 'done' ? 'La tappa è conclusa' : 'Prima iscriviti alla tappa', st === 'done' ? 'I test drive si prenotano per le prossime tappe.' : pl ? 'Il test drive si prenota quando sei iscritto alla tappa.' : 'Il test drive si fa durante la tappa: iscriviti come visitatore e prenotalo nello stesso momento.', !pl && st !== 'done' ? `<button class="btn btn-primary btn-sm" data-a="visStart" data-tid="${t.id}" data-td="1">Iscriviti come visitatore</button>` : '')}</div>`, title };
  if (!TDF || TDF.tid !== t.id) TDF = { tid: t.id, edit: !x, d: x ? { model: x.model, slot: x.slot, num: x.lic.num, exp: x.lic.exp, photo: !!x.lic.photo, phone: x.phone || '' } : tdPrefill() };
  if (x && !TDF.edit) {
    const ok = x.status === 'ok';
    let h = statusBar() + topbar(title, sub) + '<div class="pad">';
    h += `<div class="tdhero"><span class="tile">${I('car')}</span><div><span class="pill ${ok ? 'p-live' : 'p-onturf'}">${ok ? 'Confermato' : 'Da confermare'}</span><b>${esc(tdModel(x))}</b><span>${ok ? `${cap(dLong(t.start))}, alle ${x.time}. Ti aspettiamo nell'area MINI.` : `${cap(dLong(t.start))}, ${x.slot === 'free' ? 'quando non giochi' : TD_SLOT_S[x.slot]}. La concessionaria ti conferma l'orario qui e con una notifica.`}</span></div></div>`;
    h += `<div class="sumlist mt16"><div class="srow"><div><span class="sm">Modello</span><b>${esc(x.model)}</b></div></div><div class="srow"><div><span class="sm">Preferenza</span><b>${TD_SLOTS[x.slot]}</b></div></div><div class="srow"><div><span class="sm">Patente</span><b>${maskLic(x.lic.num)}, scade ${esc(x.lic.exp)}</b>${x.lic.photo ? '<span class="sm">Foto caricata</span>' : ''}</div></div>${x.phone ? `<div class="srow"><div><span class="sm">Telefono</span><b>${esc(x.phone)}</b></div></div>` : ''}<div class="srow"><div><span class="sm">Dove</span><b>Area MINI, ${esc(t.club)}</b></div></div></div>`;
    h += `<div class="pnote">${I('lock')}<span>Porta con te la patente: la concessionaria la controlla prima della prova. I dati li vedono solo lo staff e la concessionaria.</span></div>`;
    if (st !== 'done') h += `<div class="mt24"><button class="btn btn-ghost" data-a="tdEdit">Modifica la prenotazione</button><button class="btn btn-text danger w100 mt4" data-a="tdCancelOpen">Annulla il test drive</button></div>`;
    return { html: h + '</div>', title };
  }
  const h = statusBar() + topbar(title, sub) + `<div class="pad form-h"><h1 class="t-xl">${x ? 'Modifica il test drive' : 'Prova una MINI'}</h1><p class="body mt8">Durante la tappa di ${esc(t.city)}, con la concessionaria. È una pre-prenotazione: l'orario lo conferma la concessionaria e lo trovi qui.</p>${x && x.status === 'ok' ? `<div class="warn">${I('alert')}<span>Se cambi modello o fascia oraria, l'orario delle ${x.time} va confermato di nuovo.</span></div>` : ''}${tdFields(TDF.d, pl)}<p class="sc-err" id="formErr" role="alert"></p></div><div class="sticky-cta"><button class="btn btn-primary" data-a="tdSave">${x ? 'Salva le modifiche' : 'Invia la pre-prenotazione'}</button>${x ? '<button class="btn btn-text w100 mt4" data-a="tdEditCancel">Annulla le modifiche</button>' : ''}</div>`;
  return { html: h, cls: 'no-pad flow', title };
}
