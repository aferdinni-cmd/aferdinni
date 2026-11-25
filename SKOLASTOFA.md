# Verkefni fyrir nemendur

Þetta er **ekki** innskráningarkerfi fyrir skólastofu. Innskráningin helst óbreytt: eitt lykilorð og sá sem það þekkir kemst inn. Hugmyndin er að kennsluvefurinn sé staður þar sem nemendur koma inn og fá **verkefni til undirbúnings fyrir próf** — eins og við höfum verið að gera.

## Hvernig það virkar

1. Nemandi fer á kennsluvefinn og slær inn lykilorðið sem þú gefur honum.
2. Hann velur síðu í efnisyfirlitinu: umferðarmerki, undirbúningsspurningar, munnlegt próf, ýmsar spurningar eða **Verkefni**.
3. Á hverri síðu eru flettispjöld: spurning eða verkefni á framhlið og svar/skýring á bakhlið.

## Verkefnasíðan

Síðan **Verkefni til undirbúnings** er byggð eins og hinar: spjöld með aðstæðum úr raunverulegum akstri og skýringu á bakhlið. Hún er með 12 byrjunarverkefnum.

- Spjöldin eru í `kennsluvefur/cards/verkefni.json`.
- Til að bæta við verkefni er ný færsla sett í skrána:

```json
{
  "cards": [
    { "q": "Lýstu aðstæðunum ...", "a": "Skýring á því hvað á að gera og hvers vegna." }
  ]
}
```

- Sama snið gildir og á öðrum spjaldasíðum, svo auðvelt er að flytja verkefni á milli síðna.
- Ef þú vilt hafa verkefni með mynd (t.d. af gatnamótum) bætirðu `"image": "images/..."` við spjaldið.

## Ef þú vilt meira síðar

- **Verkefni í hóp** — hver kafli eða þema fyrir sig með sínum spjöldum.
- **„Verkefni vikunnar“** — eitt valið verkefni efst á síðunni.
- **Sýnileg framvinda nemenda** — en það þarf þjón og gagnagrunn; innskráningin eins og hún er núna myndi þá breytast, sem þú vilt ekki.

Núna er allt stöðugt og ókeypis: eitt lykilorð, engar persónuupplýsingar og enginn þjónn.
