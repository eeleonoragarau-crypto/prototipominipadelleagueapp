# MINI Padel League, app del circuito

Prototipo cliccabile dell'app della MINI Padel League 2026, realizzato da Lobiz agency.

Funziona interamente nel browser. Comprende:

- tre ingressi:
  - **giocatore**, solo su invito di una concessionaria MINI, con il codice di ingresso;
  - **visitatore**, con registrazione libera;
  - **staff**, con l'account fornito da Lobiz;
- iscrizione gratuita del giocatore alle tappe. Sono obbligatori solo i dati che servono a giocare: livello, maglia, tessera FITP e certificato medico. Il resto del profilo è facoltativo;
- iscrizione del visitatore a una tappa senza giocare, con il pass da mostrare all'ingresso;
- pre-prenotazione del test drive, con modello, fascia oraria e patente, per giocatori e visitatori. Lo staff conferma l'orario;
- strumenti per lo staff: codici di ingresso delle concessionarie, visitatori e test drive di ogni tappa, regole di iscrizione e contatti per gli sponsor;
- estrazione delle coppie e dei gironi, risultati a fine set e tabelloni;
- pagina dei partner;
- modalità schermo per la TV in sede.

> È un prototipo per presentare e validare il prodotto, non l'app finale. Non ha un server: i dati sono simulati e restano nel browser di chi lo apre.

## Come aprirlo

- **In locale:** apri `index.html` con un browser recente (Chrome, Safari, Edge o Firefox).
- **Online con GitHub Pages:**
  1. Nel repository vai su **Settings → Pages**.
  2. Scegli **Deploy from a branch**, poi il branch `main` e la cartella `/ (root)`.
  3. Dopo qualche minuto il prototipo è su `https://<utente>.github.io/<repository>/`.
- **Modalità schermo per la TV in sede:** aggiungi `#schermo` all'indirizzo, per esempio `https://<utente>.github.io/<repository>/#schermo`. Compare solo lo schermo, a tutta pagina, con le schermate che cambiano ogni 12 secondi.

Nella pagina, il pannello a sinistra porta direttamente a ogni schermata. Con lo stesso pannello si passa da un ruolo all'altro (giocatore, visitatore, staff), e ci sono gli strumenti per i dati demo.

## Struttura

```
mini-padel-league-app/
├── index.html            Pagina pronta, generata da scripts/build.py: non modificarla a mano
├── scripts/
│   └── build.py          Ricostruisce index.html dai file in src/
└── src/
    ├── shell.html        Struttura della pagina, pannello guida e design system
    ├── styles.css        Design system e stili
    ├── js/
    │   ├── logic.js      Dati e regole: tappe, giocatori, coppie, gironi, classifiche,
    │   │                 tabelloni, ruoli, codici di ingresso, visitatori, test drive,
    │   │                 statistiche per gli sponsor
    │   ├── ui.js         Tutte le schermate dell'app
    │   ├── actions.js    Navigazione, pannelli, salvataggi, pannello guida
    │   └── tv.js         Modalità schermo per la TV in sede
    └── assets/
        ├── logos/        Loghi MINI Padel League e Lobiz (SVG originali)
        ├── partners/     Loghi dei partner (PNG) e partners.json con nome e ordine
        ├── players/      Foto segnaposto dei giocatori per lo schermo in sede (WebP scontornati)
        └── schermo/      Sfondo della schermata "La prossima sfida" (WebP)
```

## Come modificarlo

1. Modifica i file in `src/`.
2. Rigenera la pagina con `python3 scripts/build.py` (serve Python 3.8 o successivo, nessuna libreria da installare).
3. Apri `index.html` e controlla il risultato.

Modifiche frequenti:

- **Calendario delle 27 tappe:** `TAPPE_RAW` in `src/js/logic.js`.
- **Data di "oggi" nel prototipo:** `NOW` in `src/js/logic.js` (adesso è sabato 3 ottobre 2026, con Milano in corso).
- **Concessionarie e codici di ingresso di partenza:** `CODES0` in `src/js/logic.js`. Dall'app lo staff crea nuovi codici, aggiunge inviti e disattiva i codici (vista Staff → Codici di ingresso).
- **Modelli e fasce orarie dei test drive:** `TD_MODELS`, `TD_SLOTS` e `TD_TIMES` in `src/js/logic.js`.
- **Domande facoltative, conferma delle iscrizioni, test drive e assicurazione:** si cambiano anche dall'app, vista Staff → Regole di iscrizione.
- **Partner:** sostituisci i PNG in `src/assets/partners/` e aggiorna `partners.json`. L'ordine del file è l'ordine nell'app, e `mini` è il title partner.
- **Foto dei giocatori sullo schermo in sede:** le immagini in `src/assets/players/` (elencate in `players.json`, con il genere) sono segnaposto. Ritraggono persone inesistenti, generate con l'intelligenza artificiale di Canva e scontornate. Per cambiarle, sostituisci i file WebP con ritagli a mezzo busto su fondo trasparente, in formato 3:4.
- **Sfondo della prossima sfida sullo schermo in sede:**
  - il file è `src/assets/schermo/sfondo-sfida.webp`, una fascia orizzontale (1920 × 870) ritagliata dallo sfondo con la rete;
  - per cambiarlo, sostituisci il file con un'immagine dello stesso formato;
  - la foto si vede in trasparenza sotto una velatura blu e navy. Per farla vedere di più o di meno, cambia l'opacità della velatura nella regola `.bx` di `src/styles.css`.

## Dati demo

I dati restano nel `localStorage` del browser. Per ripartire da zero usa "Ripristina dati demo" nel pannello a sinistra o nelle impostazioni dell'app.

| Account | Ruolo | Cosa mostra |
|---|---|---|
| marco.ricci@esempio.it | Giocatore | Entrato con il codice di Concessionaria Milano Nord, gioca a Milano e Trieste, ha un test drive da confermare |
| laura.fontanesi@esempio.it | Visitatrice | Iscritta a Milano e Trieste, test drive confermato a Milano alle 15:30 |
| staff@esempio.it | Staff | Codici, visitatori, test drive e gestione delle tappe |

- Nel prototipo la password non viene controllata; quella proposta è `padel2026`.
- **Per registrare un nuovo giocatore** usa il codice `MPL-MI-7K2Q`. Il codice `MPL-MO-6DY5` ha gli inviti finiti, e serve a vedere il messaggio di errore.

## Prima di pubblicarlo

- **Repository privato, consigliato.** Contiene i loghi della MINI Padel League, di Lobiz e dei partner, che sono marchi dei rispettivi titolari.
- **GitHub Pages e visibilità.**
  - Con il piano gratuito, Pages funziona solo con repository pubblici; con un repository privato serve GitHub Pro, Team o Enterprise.
  - La pagina pubblicata con Pages è comunque visibile a chiunque abbia il link, anche se il repository è privato.
- **Loghi dei partner.** Sono ritagliati da uno screenshot, quindi a bassa risoluzione: per l'uso reale servono i file ufficiali in vettoriale, con le regole d'uso di ogni marchio.
- **Font.** Archivo viene caricato da Google Fonts. Senza connessione il browser usa un font di riserva.

## Limiti del prototipo

- **Nessun backend:**
  - account, email di verifica, caricamento del certificato e della foto della patente, conferme dei test drive e notifiche sono simulati;
  - i codici di ingresso sono controllati nel browser. Nell'app vera vanno controllati sul server.
- **Privacy:**
  - il testo dell'informativa è provvisorio, da definire con il consulente privacy insieme ai dati da chiedere;
  - la regola "ogni giocatore vede solo la sua tappa" nel prototipo è applicata solo nell'interfaccia. Nell'app vera va applicata sul server;
  - i dati della patente sono dati personali delicati: nell'app vera vanno conservati con accesso limitato allo staff e alla concessionaria del test drive.
- **Modalità schermo:** legge i dati dello stesso browser. Nell'app vera riceve gli aggiornamenti dal server, quindi una TV in sede si aggiorna quando lo staff salva un set dal telefono.
- **Statistiche per gli sponsor e capienza dei test drive (2 auto per turno):** sono dati simulati.
- **Foto sullo schermo in sede:** sono di persone inesistenti e si ripetono tra giocatori diversi. Nell'app vera compare la foto caricata dal giocatore, solo se ha dato il consenso; senza consenso la foto è sfocata e il nome è ridotto alle iniziali.

---

© 2026 Lobiz srl. Tutti i diritti riservati.
