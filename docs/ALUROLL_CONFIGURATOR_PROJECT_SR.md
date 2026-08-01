# AluRoll Konfigurator — Specifikacija projekta

| | |
|---|---|
| Status | Nacrt |
| Verzija | 0.5 |
| Poslednje ažuriranje | 2026-08-01 |
| Kanonski jezik | Engleski (srpski prevod: `ALUROLL_CONFIGURATOR_PROJECT_SR.md`). Ovo je zvaničan prevod kanonskog dokumenta `ALUROLL_CONFIGURATOR_PROJECT_EN.md`. |

## 1. Uvod

Ovaj dokument definiše šta AluRoll Konfigurator treba da postigne. Napisan je da bude jednostavan, praktičan i lak za održavanje — a ne formalna enterprise specifikacija.

Ovo je ulaz za sledeću fazu: generisanje prvih UX koncepata u v0, i može poslužiti kao funkcionalni zadatak za softversku kompaniju koja gradi verziju 1. Opisuje svrhu proizvoda, korisnike, korisnički put i ponašanje proizvoda. Namerno izbegava opisivanje kako će proizvod biti izgrađen (tehnologija, arhitektura, ekrani).

## 2. Vizija proizvoda

AluRoll Konfigurator omogućava korisniku da konfiguriše rolo roletnu za nekoliko minuta, bez potrebe da razume terminologiju proizvodnje, i da dobije rezultat koji je garantovano tehnički validan i moguć za izradu.

Verzija 1 je B2B veb proizvod za kupce, preprodavce i instalatere. Ne mora da podrži direktan pristup krajnjem potrošaču (B2C) u ovoj fazi, ali tok namenjen korisniku mora ostati dovoljno jednostavan da bi kasnije mogao da podrži i to, bez potrebe za redizajnom.

## 3. Poslovni problem

Izbor rolo roletne danas zahteva znanje koje korisnik obično nema — kompatibilne dimenzije, materijali i mehanizmi nisu očigledni, a pogrešan izbor izaziva doradu i kašnjenje. Trenutno ne postoji jednostavan, samouslužni način da korisnik samostalno dođe do validne konfiguracije.

*Otvoreno: tačan trenutni proces i njegova cena još uvek nisu dokumentovani — nije neophodno za prvi v0 prototip.*

## 4. Ciljevi proizvoda

- Omogućiti korisniku da ispravno konfiguriše rolo roletnu, bez stručnog znanja, za samo nekoliko minuta.
- Garantovati da je svaka gotova konfiguracija tehnički validna — nevalidne kombinacije nikada ne smeju biti dostupne.
- Zadržati korisničko iskustvo kratkim i jednostavnim: jedna jasna odluka odjednom, jednostavan jezik prilagođen korisniku umesto terminologije proizvodnje.
- Prikazati korisniku samo izbore koji su trenutno relevantni i validni; sprečiti nevalidna stanja umesto naknadnog prijavljivanja grešaka.
- Pružiti korisniku trenutnu vizuelnu povratnu informaciju i jasan napredak kroz tok.
- Omogućiti laku izmenu prethodnog izbora bez ponovnog pokretanja.
- Omogućiti svakom proizvođaču da kontroliše sopstvene opcije proizvoda, pravila i način na koji se rezultat prenosi u njegove sisteme — bez potrebe za pomoći programera.
- Predati gotovu konfiguraciju na jasan način, tako da postojeći sistemi (ponude, ERP, proizvodnja) mogu dalje da je obrađuju.
- Pružiti profesionalno, moderno B2B iskustvo koje je prvenstveno namenjeno desktopu, a u potpunosti upotrebljivo i na tabletima.

## 5. Korisnici

- **Korisnik (kupac)** — B2B kupac, preprodavac ili instalater koji konfiguriše rolo roletne za sopstveni projekat ili za klijenta. Očekuje brzo, vođeno iskustvo bez žargona. Direktan B2C pristup nije deo verzije 1.
- **Administrator proizvođača** — postavlja i održava opcije proizvoda, pravila i mapiranje integracije za sopstveni katalog. Može biti napredni korisnik; strmija kriva učenja je ovde prihvatljiva, jer je ovo odvojeno, tehnički zahtevnije iskustvo u odnosu na tok namenjen korisniku.

## 6. Korisnički put

Tok verzije 1, opisan funkcionalno, a ne ekran po ekran:

1. Korisnik otvara postojeći projekat ili kreira novi.
2. Korisnik dodaje poziciju u projekat — jednu rolo roletnu koju treba konfigurisati.
3. Korisnik unosi osnovne informacije i dimenzije za tu poziciju.
4. Korisnik prolazi kroz kratak, vođen niz izbora proizvoda, jednu odluku po korak.
5. Dok korisnik bira, vizuelni pregled i rezime konfiguracije se odmah ažuriraju.
6. Korisnik dolazi do kompletne, validne konfiguracije za tu poziciju — bez potrebe za ručnom proverom.
7. Korisnik čuva poziciju, duplira je da bi napravio sličnu, ili dodaje novu poziciju.
8. Korisnik pregleda sve pozicije u projektu.
9. Korisnik potvrđuje projekat, čime se dobija kompletna, tehnički validna konfiguracija predata na dalju obradu van konfiguratora.

Tačan redosled i sadržaj pitanja o rolo roletni u koraku 4 namerno nije definisan ovde — biće precizirаn kroz v0 prototip.

## 7. Pregled funkcionalnosti

### Projekti

- Projekat je način na koji korisnik organizuje svoj rad — na primer, objekat ili posao.
- Projekat sadrži jednu ili više pozicija.
- Korisnik može da sačuva nezavršen projekat i nastavi kasnije.

### Pozicije

- Pozicija predstavlja jednu konfigurisanu rolo roletnu i ima količinu.
- Pozicija se može duplirati i zatim prilagoditi, radi bržeg konfigurisanja sličnih stavki.

### Vođena konfiguracija

- Konfiguracija se odvija kroz kratak vođen tok, a ne kroz dugačak tehnički formular.
- U svakom trenutku se prikazuje jedna jasna odluka.
- Prikazuju se samo izbori koji su trenutno relevantni i validni — nevalidne kombinacije se sprečavaju, umesto da se naknadno prijavljuju.
- Jezik namenjen korisniku je jednostavan i orijentisan ka proizvodu, nikada interna terminologija ili šifre proizvodnje.
- Završena pozicija treba korisniku da oduzme samo nekoliko minuta.

### Vizuelni pregled i rezime uživo

- Korisnik vidi trenutnu vizuelnu reprezentaciju, odnosno jasan pregled proizvoda, koji se ažurira kako se biraju opcije.
- Na desktopu, rezime konfiguracije uživo ostaje vidljiv tokom celog toka.
- Verzija 1 ne zahteva naprednu 3D vizualizaciju — jasan 2D ili reprezentativan vizuelni pregled je dovoljan.

### Pregled i potvrda projekta

- Pre potvrde, korisnik pregleda sve pozicije u projektu.
- Potvrđivanje projekta proizvodi kompletnu, tehnički validnu konfiguraciju za svaku poziciju, spremnu za dalju obradu.

### Automatsko ponašanje pravila proizvoda

Odvija se automatski, bez napora korisnika:
- Provera svakog izbora u odnosu na pravila zavisnosti i validnosti proizvođača.
- Filtriranje prikazanih izbora na one koji ostaju validni s obzirom na prethodne izbore.
- Sastavljanje gotove konfiguracije u rezultat koji sistemi proizvođača mogu da koriste.
- Usklađivanje konfiguracije sa sopstvenim šiframa proizvoda/artikala proizvođača.

### Informacije skrivene od korisnika

- Logika pravila proizvodnje, strukture zavisnosti ili mehanizmi validacije.
- Interne šifre proizvoda/artikala proizvođača.
- Logika cena/troškova i detalji proizvodnje.

## 8. Administracija

Administracija proizvođača je odvojeno, tehnički zahtevnije iskustvo u odnosu na tok namenjen korisniku, namenjeno ovlašćenom korisniku proizvođača. Na funkcionalnom nivou, mora tom korisniku omogućiti da održava, isključivo za sopstveni katalog:

- Dostupne izbore proizvoda.
- Vrednosti prikazane korisnicima za svaki izbor.
- Nazive, opise i prateće slike za izbore i vrednosti.
- Redosled i vidljivost izbora.
- Zavisnosti između izbora.
- Ograničenja dimenzija i kompatibilnosti.
- Automatske izbore, gde je to prikladno (na primer, vrednost koja treba da bude podrazumevana ili unapred postavljena na osnovu drugih izbora).
- Mapiranje validne gotove konfiguracije na šifre artikala/proizvoda proizvođača.
- Aktivaciju ili deaktivaciju sadržaja kataloga.

Očekuje se da administracija bude detaljnija i tehnički zahtevnija od korisničkog iskustva — pretpostavlja se da osoba koja podešava pravila razume domen proizvoda. Ekrani administracije i sam jezik pravila nisu dizajnirani u ovom dokumentu.

*Otvoreno: ko svakodnevno obavlja ovu administraciju, i kakav alat/proces mu je potreban, još uvek nije definisano — nije neophodno za prvi v0 prototip.*

## 9. Integracija

Posao konfiguratora se završava proizvodnjom gotove, validne konfiguracije. Konfigurator sam ne kreira ponude, narudžbine, radne naloge niti proizvodnu dokumentaciju.

- Gotova konfiguracija se usklađuje sa sopstvenim šiframa proizvoda/artikala proizvođača.
- Postojeći eksterni sistemi (ponude, ERP, sistemi za proizvodnju/radne naloge) preuzimaju taj rezultat i generišu šta im je potrebno — konfigurator te korake ne izvršava.

*Otvoreno: tačan mehanizam predaje i format podataka još uvek nisu definisani — nije neophodno za prvi v0 prototip.*

## 10. Obuhvat MVP-a

### Uključeno u verziju 1

- B2B pristup korisnika.
- Lista projekata i uređivanje projekta.
- Više pozicija po projektu.
- Vođena konfiguracija rolo roletni.
- Dimenzije i osnovni konfigurabilni izbori.
- Dinamičko filtriranje na validne izbore.
- Vizuelni pregled.
- Rezime konfiguracije uživo.
- Čuvanje i nastavak kasnije.
- Dupliranje pozicije.
- Pregled i potvrda projekta.
- Osnovna administracija izbora, pravila i mapiranja od strane proizvođača.
- Jedan definisan format predaje koji eksterni sistem može da preuzme.

### Nije potrebno u verziji 1

- Direktna B2C prodaja.
- Onlajn plaćanje.
- Kalkulacija ponude.
- Kreiranje narudžbina i radnih naloga.
- Planiranje proizvodnje.
- Napredno 3D renderovanje.
- Generisanje CAD ili tehničkih crteža.
- Više gotovih ERP integracija.
- Napredna analitika.
- Podrška za proizvodne porodice van rolo roletni.

## 11. Buduće ideje

Nije preuzeto kao obaveza — mogući pravci nakon prve verzije:

- Podrška za proizvodne domene van rolo roletni.
- Direktan pristup krajnjem potrošaču (B2C).
- Bogatiji administrativni alati (na primer, testiranje pravila pre objavljivanja).
- Podrška za više eksternih sistema.

## 12. Način realizacije i granice verzije 1

### Početna referenca

- ELBI konfigurator rolo roletni je početna funkcionalna referenca za verziju 1.
- Verzija 1 može da koristi istu opštu funkcionalnu ideju i tok izbora proizvoda kao polaznu tačku.
- Vizuelni dizajn ELBI-ja ne sme biti kopiran.
- AluRoll mora da pruži znatno modernije, jasnije, brže i profesionalnije korisničko iskustvo.
- Početni cilj nije da se osmisli najnapredniji konfigurator na tržištu, već da se brzo proizvede snažna, upotrebljiva i moderna prva verzija.

### Granica verzije 1

- Verzija 1 se fokusira isključivo na konfiguraciju rolo roletni.
- Tok namenjen korisniku mora biti kratak i po pravilu treba da se završi za nekoliko minuta.
- Korisnik treba da vidi samo razumljive i trenutno validne opcije.
- Tehnička složenost, interne šifre, logika zavisnosti i znanje iz proizvodnje ostaju skriveni.
- Administrativno iskustvo može biti tehnički zahtevnije i detaljnije.
- Administracija mora omogućiti proizvođaču da održava izbore, sadržaj, pravila validnosti, zavisnosti i mapiranja internih šifara bez rutinske intervencije programera.
- Verzija 1 treba da pokrije osnovne korisničke mogućnosti referentnog konfiguratora, uz poboljšanu upotrebljivost i administraciju.
- Funkcionalnosti van ove početne granice ostaju buduće mogućnosti i ne smeju usporiti verziju 1.

### Princip proširivosti

- Proizvod treba da čisto reši početni slučaj upotrebe za rolo roletne, umesto da odmah pokuša da podrži svaki budući proizvod.
- Funkcionalni model ipak treba da izbegava pretpostavke koje bi nepotrebno otežale kasniju podršku za srodne konfigurabilne proizvode.
- Buduća proširivost je projektno ograničenje, a ne razlog za proširenje obuhvata verzije 1.

### Tok rada na dizajnu i realizaciji

1. Sinhronizovana EN/SR specifikacija projekta definiše odobreni funkcionalni obuhvat.
2. ChatGPT se koristi za promišljanje o proizvodu, analizu tržišnih referenci, UX odluke i pripremu fokusiranih uputstava (prompt-ova).
3. Claude Code održava sinhronizovanu specifikaciju projekta i unosi samo odobrene odluke.
4. v0 se koristi za generisanje i iterativno unapređenje modernih UX prototipova zasnovanih na React-u, na osnovu odobrene definicije projekta.
5. v0 prototip se pregleda i koriguje pre početka produkcione implementacije.
6. Odobreni UX se zatim implementira u repozitorijumu projekta korišćenjem izabrane produkcione tehnologije.
7. Dokumentacija se ažurira kada se odobreni UX ili funkcionalne odluke suštinski promene.

Dodatni principi:

- v0 je alat za prototipisanje i dizajn, a ne izvor poslovnih pravila.
- Vizuelni koncepti koje generiše v0 su predlozi i postaju zahtevi tek nakon pregleda i odobrenja.
- Specifikacija projekta ostaje funkcionalni izvor istine.
- Odobreni prototip postaje vizuelna i interakciona referenca za implementaciju.

### Radni princip

Koristiti referentni tok rada kao polaznu tačku, ali redizajnirati iskustvo.
