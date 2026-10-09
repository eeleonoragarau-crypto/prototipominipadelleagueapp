#!/usr/bin/env python3
"""Genera index.html, una pagina unica e autonoma, partendo dai file in src/.

Uso:  python3 scripts/build.py
Serve Python 3.8 o successivo, nessuna libreria esterna.

Cosa fa:
- inserisce src/styles.css nella pagina;
- unisce i file JavaScript di src/js/ nell'ordine giusto;
- incorpora loghi, immagini dei partner, foto segnaposto e sfondo dello schermo in sede
  come data URI, così index.html funziona anche aperto da disco o pubblicato con GitHub Pages.
"""
import base64
import json
import struct
from pathlib import Path

ROOT = Path(__file__).resolve().parent.parent
SRC = ROOT / "src"
JS_ORDER = ["logic.js", "ui.js", "actions.js", "tv.js"]

# Il logo Lobiz originale ha molto spazio vuoto attorno: per la riga
# "Powered by" ritagliamo solo l'area di disegno (il logo non cambia).
LOBIZ_FULL_VIEWBOX = 'viewBox="0 0 1080 1080"'
LOBIZ_TRIM_VIEWBOX = 'viewBox="114 140 866 862"'


def data_uri(data: bytes, mime: str) -> str:
    return f"data:{mime};base64," + base64.b64encode(data).decode("ascii")


def png_size(data: bytes):
    if data[:8] != b"\x89PNG\r\n\x1a\n":
        raise ValueError("non è un file PNG")
    return struct.unpack(">II", data[16:24])


def main() -> None:
    shell = (SRC / "shell.html").read_text(encoding="utf-8")
    css = (SRC / "styles.css").read_text(encoding="utf-8")

    logos = SRC / "assets" / "logos"
    mpl = data_uri((logos / "logo-mini-padel-league.svg").read_bytes(), "image/svg+xml")
    lobiz_svg = (logos / "logo-lobiz.svg").read_text(encoding="utf-8")
    lobiz = data_uri(lobiz_svg.replace(LOBIZ_FULL_VIEWBOX, LOBIZ_TRIM_VIEWBOX, 1).encode("utf-8"), "image/svg+xml")

    pdir = SRC / "assets" / "partners"
    partners = []
    for p in json.loads((pdir / "partners.json").read_text(encoding="utf-8")):
        raw = (pdir / p["file"]).read_bytes()
        w, h = png_size(raw)
        partners.append({"id": p["id"], "name": p["name"], "w": w, "h": h, "uri": data_uri(raw, "image/png")})

    # Foto segnaposto dei giocatori (persone inesistenti, scontornate) per lo schermo in sede
    fdir = SRC / "assets" / "players"
    faces = []
    if (fdir / "players.json").exists():
        for p in json.loads((fdir / "players.json").read_text(encoding="utf-8")):
            mime = "image/webp" if p["file"].endswith(".webp") else "image/png"
            faces.append({"g": p["g"], "uri": data_uri((fdir / p["file"]).read_bytes(), mime)})

    # Sfondo della "prossima sfida" sullo schermo in sede, usato in src/styles.css (regola .bx).
    # Se il file manca, la schermata resta con il solo sfondo a due colori.
    bg = SRC / "assets" / "schermo" / "sfondo-sfida.webp"
    css = css.replace('url("{{SFONDO_SFIDA}}")', f'url("{data_uri(bg.read_bytes(), "image/webp")}")' if bg.exists() else "none")

    head = (
        f"const LOGO_MPL = '{mpl}';\n"
        f"const LOGO_LOBIZ = '{lobiz}';\n"
        f"const PARTNERS = {json.dumps(partners, ensure_ascii=False)};\n"
        f"const FACES = {json.dumps(faces)};\n"
    )
    js = "(function(){\n" + head + "\n".join((SRC / "js" / f).read_text(encoding="utf-8") for f in JS_ORDER) + "\n})();"

    for marker in ("/*STYLES*/", "/*SCRIPT*/", "{{MPL}}", "{{LOBIZ}}"):
        if marker not in shell:
            raise SystemExit(f"Segnaposto {marker} mancante in src/shell.html")
    out = (shell.replace("/*STYLES*/", css)
                .replace("{{MPL}}", mpl)
                .replace("{{LOBIZ}}", lobiz)
                .replace("/*SCRIPT*/", js))
    (ROOT / "index.html").write_text(out, encoding="utf-8")
    print(f"index.html generato ({len(out) // 1024} KB)")


if __name__ == "__main__":
    main()
