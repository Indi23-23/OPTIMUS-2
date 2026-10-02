# Optimus 2 · Full digital

Aplicació local en català. HTML, CSS i JavaScript purs, sense dependències ni compilació. Obre `index.html` en un navegador modern o tota aquesta carpeta amb VSCodium.

## Mòbil

El full ocupa tota l’amplada i aprofita l’altura disponible mantenint la distribució original. En horitzontal es pot desplaçar verticalment. Els selectors s’obren a baix i permeten triar números sense desplegar el teclat; toca el camp si vols escriure. Es manté el zoom del navegador.

## Ús

- Gris, rondes i bonificacions: un toc marca una X; un altre l’esborra.
- Les tres files d’accions: buit → cercle (disponible) → X (utilitzada) → buit.
- Groc: buit → cercle → X → buit.
- Blau i rosa: toca la casella i tria un número o escriu-lo.
- Verd: introdueix el valor del dau (1–6); la casella mostra el valor multiplicat. Cada estrella mostra la primera casella menys la segona quan totes dues estan plenes. Els valors verds desats anteriorment es conserven com a resultats, sense tornar-los a multiplicar.
- Daus: toca una de les tres caselles, tria blanc, verd, rosa, platejat, groc o blau i toca el valor. Color i valor es desen junts; Cancel·la no aplica canvis i Esborra buida tots dos.
- Puntuació: la primera fila correspon al full actual i calcula els cinc colors, les guineus i el total. Les altres tres files són manuals. Les puntuacions es recalculen també amb Desfer, Nova partida i en recarregar.
- Desfer: fins a 150 canvis, incloent Nova partida, també després de recarregar.
- Guardat automàtic en localStorage del mateix navegador i adreça. Canviar de navegador, moure el fitxer o esborrar les dades del navegador pot deixar el guardat inaccessible. No hi ha sincronització ni servidor.

La primera versió és un full lliure: calcula la puntuació però no valida totes les regles ni executa les bonificacions encadenades. Les guineus es detecten per les condicions del full (columna grisa, columna groga encerclada, caselles blava/verda/rosa i sis accions de rellançament encerclades o utilitzades). No depenen de les marques manuals dels símbols de guineu. Els valors manuals antics de la primera fila es conserven al guardat però ja no es mostren, perquè aquesta fila és automàtica. Les bonificacions s’activen manualment. Les fotografies són referències de distribució i no s’inclouen al projecte.

## Estructura

- `symbols.js`: símbols vectorials locals, independents de les fonts i dels emojis.
- `mobile.css`: adaptació a pantalles petites, marges de seguretat i selectors tàctils.
- `board.css`: proporcions i aspecte del full original.
- `game.js`: definició i distribució específica d’Optimus 2.
- `scoring.js`: càlcul pur de punts a partir del full, segons el [reglament oficial](https://www.schmidtspiele.de/files/Retail/72dpi_PNG/88234_Twice_as_clever_GB.pdf).
- `store.js`: guardat i historial, independent del joc.
- `app.js`: interaccions i pantalla de puntuació.
- `style.css`: presentació adaptable.

Per afegir altres jocs, crea una definició pròpia amb identificador únic i renderer; adapta la pantalla de puntuació a les seves categories. No hi ha dependències externes, fonts remotes, seguiment ni serveis de pagament.

## Llicència

El codi original d’aquesta aplicació es distribueix amb llicència MIT (vegeu LICENSE). Projecte independent, no oficial. La llicència del codi no concedeix drets sobre la marca, les regles ni el material original del joc.

## Versió instal·lable i sense connexió

Publica aquesta carpeta a GitHub Pages. Obre l’adreça amb Internet i espera «Preparat per jugar sense connexió». A iPhone, afegeix-la a la pantalla d’inici des del menú de compartir de Safari; a Android, utilitza l’opció d’instal·lar del navegador. Comprova-la en mode avió abans de sortir. Cada dispositiu conserva la seva partida: no hi ha sincronització.

Per publicar canvis, incrementa VERSION a sw.js. Una versió nova s’activa quan tanques totes les finestres de l’aplicació i la tornes a obrir. El navegador pot eliminar les dades si neteges l’emmagatzematge.
