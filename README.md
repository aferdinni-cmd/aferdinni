# Á ferðinni – ökukennsla

Vefsíða fyrir ökukennsluna Á ferðinni: opinber kynning fyrir komandi nemendur og læstur kennsluvefur fyrir nemendur.

## Uppbygging

| Skrá | Hlutverk |
| --- | --- |
| `index.html` | Forsíða: kynning, ferlið, verðskrá, kennarar, samband |
| `styles.css` | Stíll fyrir forsíðuna |
| `script.js` | Farsímavalmynd |
| `kennsluvefur/index.html` | Læstur kennsluvefur (lykilorðsgátt) |
| `kennsluvefur/gate.js` | Innskráning og birting námsefnis |
| `kennsluvefur/content.json` | Námsefnið í köflum |
| `kennsluvefur/kennsluvefur.css` | Stíll fyrir kennsluvefinn |
| `assets/logo.jpg` | Merkið (notað í haus, á forsíðu og í kennsluvef) |
| `assets/favicon.png`, `assets/apple-touch-icon.png` | Tákn í vafraflipa og á heimaskjá |
| `en/index.html` | Enska forsíðan |
| `kennsluvefur/content.en.json` | Enska námsefnið |
| `kennsluvefur/pages.json`, `pages.en.json` | Uppbygging kennsluvefsins: hlutar og síður |
| `kennsluvefur/cards/*.json` | Flettispjöld, eitt safn á hverja síðu (enska í `cards/en/`) |
| `kennsluvefur/videos.json`, `videos.en.json` | Myndbönd |
| `kennsluvefur/sources.json`, `sources.en.json` | Heimildir |

Vefurinn er hreinar HTML/CSS/JS skrár án byggingarþreps. `index.html` er á toppnum og hann er birtur eins og hann er.

## Tvítyngi

Vefurinn er bæði á íslensku og ensku og nemandi getur valið tungumál:

- **Forsíða:** `index.html` (íslenska) og `en/index.html` (enska). „EN“ í valmynd og „English“ í fæti vísa á ensku síðuna, og „IS“ / „Íslenska“ vísa til baka.
- **Kennsluvefur:** tungumálið ræðst af `?lang=en` í slóðinni eða af síðasta vali sem er vistað í vafranum (`localStorage`, lykillinn `af-lang`). Hnappur í lykilorðsgátt og haus kennsluvefsins skiptir um tungumál og heldur innskráningunni.
- **Námsefnið:** `kennsluvefur/content.json` (íslenska) og `kennsluvefur/content.en.json` (enska).

Til að breyta texta þarf að gera það í báðum skrám svo útgáfurnar haldist í takt. Ef nýr kafli er bætt við þarf hann í báðar JSON-skrárnar.

Vefslóðir: íslenska `https://<lén>/`, enska `https://<lén>/en/`, kennsluvefur `https://<lén>/kennsluvefur/` (enska: `?lang=en`).

## Uppbygging kennsluvefsins

Kennsluvefurinn er byggður úr hlutum og síðum sem eru skilgreindir í `kennsluvefur/pages.json` (enska: `pages.en.json`):

1. **Umferðarmerki** — níu undirsíður: 100 Viðvörunarmerki, 200 Forgangsmerki, 300 Bannmerki, 400 Boðmerki, 500 Sérreglumerki, 600 Upplýsingamerki, 700 Vegvísar og þjónustumerki, 800 Undirmerki, 900 Önnur merki.
2. **Undirbúningsspurningar b-réttinda**
3. **Undirbúningur fyrir munnlegt próf**
4. **Ýmsar spurningar**
5. **Verkefni** — aðstæður úr akstri með skýringu á bakhlið
6. **Myndbönd**
7. **Heimildir**
8. **Námsefni í köflum** — gömlu kaflarnir úr `content.json`

Hver síða hefur sína skrá í `kennsluvefur/cards/` (enska í `cards/en/`). Til að bæta við spjaldi er færsla sett í viðkomandi skrá:

```json
{
  "cards": [
    { "q": "Hvað þýðir þríhyrningsskilti?", "a": "Varúð: framundan er hætta eða breyting." }
  ]
}
```

- `q` er spurningin (framhlið) og `a` er svarið (bakhlið).
- Valfrjálst er að bæta `"image": "images/merki.png"` við spjald til að sýna mynd ofan við textann.
- Ef spjaldasafn er tómt birtist skilaboðin „Engin spjöld hér enn þegar.“
- Til að bæta við nýrri síðu þarf líka færslu í `pages.json` og `pages.en.json`, og samsvarandi skrá í `cards/`.

### Myndbönd

`kennsluvefur/videos.json` (enska: `videos.en.json`):

```json
{
  "videos": [
    { "title": "Hringtorg", "url": "https://www.youtube.com/watch?v=XXXXXXXXXXX", "description": "Stutt kennslumyndband." }
  ]
}
```

YouTube-hlekkir verða að innfelldum spilara, beinir .mp4-hlekkir verða að myndbandsspilara, og aðrir hlekkir birtast sem tenglar.

### Heimildir

`kennsluvefur/sources.json` (enska: `sources.en.json`):

```json
{
  "sources": [
    { "title": "Umferðarlög", "url": "https://www.althingi.is/...", "publisher": "Alþingi", "note": "Lög nr. 77/2019." }
  ]
}
```

### Flettispjöld á síðunum

Á hverri spjaldasíðu birtast „Flettispjöld“ með spurningu á framhlið og svari á bakhlið. Ýttu á spjaldið til að snúa því, notaðu „Fyrri“ og „Næsta“ (hringinn) og „Stokka“ til að blanda. Lyklaborð: Enter/bil snýr, örvar fara á milli.

### Umferðarmerkin

Spjaldasöfnin fyrir umferðarmerkin (100–900) voru unnin sjálfvirkn úr reglugerð nr. 250/2024 um umferðarmerki og notkun þeirra á `island.is/reglugerdir/nr/0250-2024`:

| Síða | Fjöldi spjalda |
| --- | --- |
| 100 – Viðvörunarmerki | 54 |
| 200 – Forgangsmerki | 7 |
| 300 – Bannmerki | 36 |
| 400 – Boðmerki | 25 |
| 500 – Sérreglumerki | 52 |
| 600 – Upplýsingamerki | 40 |
| 700 – Vegvísar og þjónustumerki | 92 |
| 800 – Undirmerki | 79 |
| 900 – Önnur merki | 21 |

Hvert spjald hefur mynd á framhlið en á bakhlið er númer merkis, heiti og skýring úr reglugerðinni. Myndirnar eru sóttar beint af `files.reglugerd.is` (samskonar slóð og `https://files.reglugerd.is/files/0250-2024/<id>.jpg`), ekki afritaðar inn í verkefnið. Ef óskað er eftir að hafa þær staðbundnar þarf að sækja þær og breyta `image` slóðunum í `cards/*.json`.

Enska útgáfan notar íslensku spjaldasöfnin þar til ensk þýðing liggur fyrir (spurningin er þýdd, svarinn á íslensku).

## Upplestur

Hver kafli og hver hluti forsíðunnar er með „Lesa upp“ hnapp („Listen“ á ensku) sem les textann upp í vafranum með Web Speech API. Ekkert net og engin þjónusta þarf; röddin kemur úr stýrikerfinu.

- Kóðinn er í `read-aloud.js` og er notaður á báðum forsíðum og í kennsluvefnum.
- Safari, Chrome og Edge styðja þetta; ef vafrinn styður það ekki birtast hnapparnir ekki.
- Íslensk rödd þarf að vera uppsett í kerfinu (t.d. Siri-rödd eða „Sara“ í macOS); annars notar vafrinn aðra rödd og framburður verður ónákvæmur.
- Upplestur stöðvast þegar skipt er um kafla, þegar smellt er á annan hnapp eða þegar skráð er út.

## Breyta lykilorði kennsluvefsins

Lykilorðið er geymt sem SHA-256 tætigildi í `kennsluvefur/gate.js` (fastinn `PASSWORD_HASH`), ekki sem hreinn texti.

1. Opnaðu Terminal og keyrðu:

   ```sh
   printf '%s' 'NYJA_LYKILORDID' | shasum -a 256
   ```

2. Afritaðu 64 stafa tætigildið sem birtist.
3. Skiptu út gildinu í `PASSWORD_HASH` í `kennsluvefur/gate.js`.

Sjálfgefið lykilorð fylgir verkefninu en það er **ekki skráð hér** þar sem README-skjalið er aðgengilegt á birtu síðunni. Lykilorðið er gefið nemendum sérstaklega; breyttu því fyrir fyrsta notkun með skrefunum hér að ofan.

## Mikilvægt um læsinguna

Þetta er tölvurokíni (JavaScript) á föstum vef, en ekki alvöru innskráning á þjóni:

- Námsefnið liggur í `kennsluvefur/content.json` og einhver sem þekkir vefslóðina gæti sótt hana beint án lykilorðs.
- Lykilorðið er ekki sent neitt og ekkert er vistað á þjóni, svo engar persónuupplýsingar nemenda eru geymdar.
- Ef þörf er á raunverulegri vernd (t.d. persónuupplýsingum eða greiðslum) þarf að setja upp þjón sem sér um innskráningu.

## Efni á síðunni

Textinn er byggður á „Upplýsingum til forráðamanna ökunema“: kennaraupplýsingar, fyrirkomulag kennslu, hlutverk nemenda og forráðamanna, verðskrá og greiðslufyrirkomulag. Tímalínan „Hvernig byrjar maður?“ á forsíðunni er fengin úr „Yfirliti yfir ökunámið“ í sama skjali og hefur öll 12 skrefin.

## Birting á netinu (ókeypis)

Vefurinn er hreinar stöðugar skrár, svo hann þarf engan þjón og hægt er að hýsa hann ókeypis. Þrjár leiðir:

1. **Publish í FreeMilk** — opnaðu Project Details (verkefnatáknið í tólastiku spjallsins) og ýttu á Publish. Síðan fer þá á `https://<slug>.freemilk.app`, auk fyrirframskoðunar á `<slug>--preview.freemilk.app`, og engrar viðbótarinnskráningar er þörf.
2. **GitHub Pages** — ókeypis, varanleg hýsing. Þarf GitHub-aðgang. Ýttu vefnum í GitHub-verkefni og kveiktu á Pages undir *Settings → Pages* (Source: Deploy from a branch, branch `main`, mappa `/ (root)`). Síðan birtist á `https://<notandi>.github.io/<verkefni>/`. Skráin `.nojekyll` er þegar til staðar svo allt efni birtist óbreytt.
3. **Netlify Drop** — ókeypis og engin skráning: dragðu möppuna inn á `app.netlify.com/drop` og síðan fær slóðina `https://<heiti>.netlify.app`.

Athugið að læsing kennsluvefsins er aðeins í vafranum (sjá hér að ofan) og breytist ekkert við hýsinguna.

## Lén

Lénið er **aferdinniokukennsla.is** og er skráð hjá ISNIC. ISNIC hýsir ekki vefsíður, svo lénið þarf að vísa á hýsinguna. `CNAME`-skráin í rót verkefnisins er skrifuð af GitHub þegar sérsniðna lénið er sett upp í *Settings → Pages*; hún er ekki handskrifuð. Síðan er nú komin á `https://aferdinniokukennsla.is/` með virku HTTPS (*Enforce HTTPS*) og `https://www.aferdinniokukennsla.is/` vísar á sama stað.

**Röð skiptir máli.** Sérsniðið lénið á að setja upp hjá hýsingunni *eftir* að DNS-færslurnar eru komnar í gagnið. Ef lénið er sett inn fyrst beinir GitHub Pages `github.io`-slóðinni á lénið, og á meðan engar DNS-færslur eru til virkar hvorgt — síðan hverfur af netinu. Það er það sem gerðist 25. nóvember 2026: `CNAME` var sett inn áður en DNS-færslurnar voru til, svo bæði `github.io`-slóðin og lénið voru óvirk. Lausnin var að setja DNS-færslurnar upp fyrst (A-færslur fyrir rótina og CNAME fyrir `www`) og setja lénið svo inn í *Settings → Pages*, þar sem *Enforce HTTPS* er nú virkt.

### GitHub Pages

1. Ýttu verkefninu í GitHub-verkefni (repo).
2. *Settings → Pages*: Source = **Deploy from a branch**, branch `main`, mappa `/ (root)`.
3. Athugaðu að síðan birtist á `https://aferdinni-cmd.github.io/aferdinni/`.
4. Hjá ISNIC: farðu í *Mín síða*, smelltu á lénið í lénatöflunni og á skiptilykilinn í dálkinum *Stjórnborð*. Undir *Nafnaþjónar* velurðu *Flytja* → *DNS Hýsing ISNIC* → *Áfram*; það getur tekið um 10 mínútur þar til DNS-færsluviðmótið virkjast. Farðu svo aftur á lénið og opnaðu *Breyta DNS færslum* undir *DNS færslur* (hafðu *Stök DNS færsla* valið efst) og settu inn:
   - **A-færslur** fyrir rótina (`@`): `185.199.108.153`, `185.199.109.153`, `185.199.110.153`, `185.199.111.153`
   - **AAAA-færslur** (valfrjálst; A-færslurnar fjórar hér fyrir ofan eru þær sem skipta máli, AAAA einar og sér duga ekki): `2606:50c0:8000::153`, `2606:50c0:8001::153`, `2606:50c0:8002::153`, `2606:50c0:8003::153`
   - **CNAME** fyrir `www`: `aferdinni-cmd.github.io`
   - Ef *heiti* er skilið eftir autt jafngildir það `@` (rót lénsins); fyrir `www` er aðeins `www` skrifað í heitið. CNAME má ekki setja á rótina. *TTL* má vera 3600 (það er sjálfgefið og gott) — það stýrir aðeins því hversu lengi vafrar og netþjónar geyma færsluna og hefur ekkert með það að gera hvort hún virkar.
5. Bíddu eftir að lénið dreifist (allt að 24 klst.) og athugaðu að `https://aferdinniokukennsla.is/` opnist.
6. Aðeins þá: *Settings → Pages → Custom domain* = `aferdinniokukennsla.is`, vistaðu, og hakaðu við **Enforce HTTPS** þegar GitHub býður það (getur tekið allt að 24 klst.). Þá býr GitHub til `CNAME`-skrána aftur.

### FreeMilk

Ef Publish býður upp á sérsniðið lén (Custom domain) í Project Details er `aferdinniokukennsla.is` sett þar inn og DNS-færslum fylgt sem hýsingin gefur upp. Annars er GitHub Pages öruggasta leiðin fyrir `.is` lén.

### Netlify

Dragðu möppuna inn á `app.netlify.com/drop`, bættu léninu við undir *Domain settings* og settu inn þær CNAME/A-færslur sem Netlify gefur upp.

### Sími og netfang

Símanúmer og netfang koma fyrir í þessum skrám; uppfærðu allar ef þau breytast:

- `index.html` — kennarakort, sambandshluti og fótur
- `en/index.html` — sama á ensku
- `kennsluvefur/index.html` — hjálparlína í lykilorðsgátt
- `kennsluvefur/content.json` — síðasti kafli námsefnisins
