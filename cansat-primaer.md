# CanSat - Programmere primæroppdraget

# @diffs true
# @unifiedToolbox true

<!-- Del 1: -->

## CanSat primæroppdrag @unplugged

I denne veiledningen skal vi programmere primæroppdraget til CanSat. Når du er ferdig, vil du ha en fungerende CanSat som kan gjøre målingene vi trenger.

### **Det som må gjøres er: **

#### **1)** Bygge opp grunnstruktur på koden vår

#### **2)** Samle inn analogverdier fra NTC og vise på OLED-skjerm

#### **3)** Konvertere analogverdi fra NTC til spenningsverdi

#### **4)** Konvertere spenningsverdi fra NTC til lesbar temperaturverdi

#### **5)** Runde av verdiene våre for å ikke få for mange desimaler

#### **6)** Hente trykk-data fra BME280

#### **7)** Beregne CanSat'ens høyde over bakken 

#### **8)** Logge og lagre dataene på micro:bit

#### **9)** Overføre dataene fra CanSat til en PC, og vise de på skjermen


### **Lykke til!**


<!-- Del 1.1: -->

## Oppgave 1 - Bygge opp grunnstruktur på koden vår som gjør den lettere å lage
 
For å gjøre koden vår så lett som mulig å lage, bør vi starte med å strukturere koden vår.

#### Vi skal lage 4 ``||functions: funksjoner||`` i koden vår:

- En som samler data: f.eks. **samle_data**
- En for å vise dataene på OLED-skjerm: f.eks. **vise_data_OLED**
- En for å vise dataene på PC-skjerm: f.eks. **vise_data_PC**
- En som lar meg lagre dataene på internminne til micro:bit: f.eks. **lagre_data**

Alle funksjonene skal kjøres fra ``||basic: gjenta for alltid||``. Legg også inn en ``||basic: pause||`` på 500ms. etter at alle funksjonene har kjørt.

```blocks
function samle_data () {}
function vise_data_OLED () {}
function vise_data_PC () {}
function lagre_data () {}
basic.forever(function () {
    samle_data()
    vise_data_OLED()
    vise_data_PC()
    lagre_data()
    basic.pause(500)
})

```

<!-- Del 2.1: -->

## Oppgave 2 - Hente analogverdi fra temperatursensor (NTC)

For å måle temperaturen rundt CanSat, skal vi bruke en 10 kΩ NTC. Motstanden dens vil variere avhenging av temperaturen. Vi må derfor  regne om den analoge verdien vi får fra NTC'en, som er koblet til pin P10.

Lag en ny variabel ``||variables: analogverdi_NTC||``. Sett den til å lese av ``||pins: analogverdi fra P10||``. Gjør dette inne funsjonen: ``||functions: samle_data||``. 

```blocks
let analogverdi_NTC = 0
function samle_data () {
    analogverdi_NTC = pins.analogReadPin(AnalogReadWritePin.P10)
}
```

<!-- Del 2.2: -->

## Oppgave 2 - Vis tekst og verdier på OLED-skjerm @unplugged

Kitronik OLED-skjerm lar oss vise verdiene våre mye mer effektivt enn skjermen på micro:biten: 

For å ta i bruk OLED-skjermen, koble den til mellom CanSat og micro:bit.

![OLED_Kitronik_liten.jpg](https://i.postimg.cc/mD2ry8kJ/OLED_Kitronik_liten.jpg)


<!-- Del 2.3: -->

## Oppgave 2 - Sette opp OLED-skjerm for å kunne vise analogverdi fra NTC

Fra biblioteket ``||kitronik_VIEW128x64: OLED-skjerm||``, hent blokkene ``||kitronik_VIEW128x64: skru AV OLED-skjerm||`` og ``||kitronik_VIEW128x64: Sett font størrelse til Normal||``. 

Plasser begge blokkene inn i ``||basic: ved start||``, og sett OLED-skjerm til ``||kitronik_VIEW128x64: PÅ||``.

```blocks
kitronik_VIEW128x64.controlDisplayOnOff(kitronik_VIEW128x64.onOff(true))
kitronik_VIEW128x64.setFontSize(kitronik_VIEW128x64.FontSelection.Normal)
```

<!-- Del 2.4: -->

## Oppgave 2 - Vise analogverdi fra NTC på OLED-skjerm

Inni funksjonen ``||functions: vise_data_OLED||`` skal vi kjøre kodene for alt vi vil vise på OLED-skjermen vår. 

For å vise noe på skjermen, bruk blokken ``||kitronik_VIEW128x64: vis ||``. Trykk på pluss(+) for å utvide blokken, og bestemme hvilken linje teksten skal skrives på:

For å kunne vise både tekst og en variabel på samme linje, må vi hente ``||text: sett sammen ||`` fra biblioteket ``||text: Tekst ||``. Sett blokken inni ``||kitronik_VIEW128x64: vis ||``.

I den første ruta til ``||text: sett sammen ||``, skriv "Analog (NTC): ". I den andre ruta, sette inn variabelen ``||variables: analogverdi_NTC||``.

**Last ned koden på micro:bit på CanSat, og sjekk at du får verdien ut på OLED-skjermen.** Du kan forvente en analogverdi rundt 500.

```blocks
function vise_data_OLED () {
    kitronik_VIEW128x64.show("Analog (NTC): " + analogverdi_NTC, 1)
}
```

<!-- Del 2.5: -->

## Oppgave 2 - Oppdatere OLED-skjerm

Vi må sørge for at skjermen alltid er oppdatert og viser riktig tekst og verdier. Det gjør vi ved å bruke blokken ``||kitronik_VIEW128x64: fjern alt på skjermen ||``.

Plasser blokken øverst inni ``||basic: gjenta for alltid ||``.

```blocks
function samle_data () {
    analogverdi_NTC = pins.analogReadPin(AnalogReadWritePin.P10)
}
function vise_data_OLED () {
    kitronik_VIEW128x64.show("Analog (NTC): " + analogverdi_NTC, 1)
}
function lagre_data () {
	
}
function vise_data_PC () {
	
}
let analogverdi_NTC = 0
basic.forever(function () {
    kitronik_VIEW128x64.clear()
    samle_data()
    vise_data_OLED()
    vise_data_PC()
    lagre_data()
    basic.pause(500)
})
```


<!-- Del 3.1: -->

## Oppgave 3 - Konvertere analogverdi fra NTC til en lesbar temperaturverdi @unplugged

Den analoge verdien vi leser fra pin P10, skal vi regne om til en spenningsverdi, og så videre til en faktisk temperaturverdien. 

Vi må derfor lære hvordan man konverterer en analog verdi, som leses av micro:biten, til en spenningsverdi.

For å se at vi får riktige verdier i utregningene våre, skal vi koble til et AA-batteri til micro:biten og sjekke at formelen gir oss riktig spenning (1,5V). 

Koble pluss (rød ledning) til P0 og minus (sort ledning) til GND på CanSat.

![Oppkobling-AA-batteri-liten.jpg](https://i.postimg.cc/50fKhZh6/Oppkobling-AA-batteri-liten.jpg)

![batteriholder-1-5V.webp](https://i.postimg.cc/VkFHxBLV/batteriholder-1-5V.webp)


<!-- Del 3.2: -->

## Oppgave 3 - Lage en batteritester

Start med å lage en ny funksjon: ``||functions: batteritester||``. Denne funksjonen skal kun brukes i testfasen vår. Plasser den inn i ``||basic: gjenta for alltid||``. 

Inni ``||functions: batteritester||`` skal vi lage en ny variabel: ``||variables: analogverdi_batteri||``. Sett ``||variables: analogverdi_batteri||`` til å ``||pins: lese analog verdi fra P0||``.

```blocks
let analogverdi_batteri = 0
function batteritester () {
    analogverdi_batteri = pins.analogReadPin(AnalogPin.P0)
}
```

<!-- Del 3.3: -->

## Oppgave 3 - Lage en ny variabel: Uref

Spenningen som micro:bit leverer til sensorene vi bruker vil variere om den får strøm fra USB eller batteri.

Se tabell under for hva ``||variables: Uref||`` skal være :

|   **  Spenning fra USB  **   | |   **  Spenning fra batteri  **   |
| :------------: | | :------------: |
| 3.2 | | 3.0 |

Lage en ny variabel: ``||variables: Uref||``.

``||variables: Uref||`` skal settes inn i ``||basic: ved start||``, og sett den til verdien bestemt i tabellen over.


```blocks
kitronik_VIEW128x64.controlDisplayOnOff(kitronik_VIEW128x64.onOff(true))
kitronik_VIEW128x64.setFontSize(kitronik_VIEW128x64.FontSelection.Normal)
let Uref = 0
Uref = 3.2
```


<!-- Del 3.4: -->

## Oppgave 3 - Beregne spenningen til batteri og NTC

De lagrede analogverdiene til både batteriet og NTC'en skal bruk til å beregne spenningen deres. For å forstå formelen vi bruker, se i hint-boksen.

Lage to nye variabel: ``||variables: spenning_NTC||`` og ``||variables: spenning_batteri||``.

- Sett ``||variables: spenning_NTC||`` til ( ``||variables: analogverdi_NTC||`` / 1023 ) * ``||variables: Uref||``. (Plasseres i funksjonen ``||functions: samle_data||``)
- Sett ``||variables: spenning_batteri||`` til ( ``||variables: analogverdi_batteri||`` / 1023 ) * ``||variables: Uref||``. (Plasseres i funksjonen ``||functions: batteritester||``)

![Formel-spenning-fra-analogverdi-liten-kopi.png](https://i.postimg.cc/Nfqbf0g6/Formel-spenning-fra-analogverdi-liten-kopi.png)


```blocks
let analogverdi_batteri = 0
let analogverdi_NTC = 0
let spenning_batteri = 0
let spenning_NTC = 0
function samle_data () {
    analogverdi_NTC = pins.analogReadPin(AnalogPin.P10)
    spenning_NTC = analogverdi_NTC / 1023 * Uref
}
function batteritester () {
    analogverdi_batteri = pins.analogReadPin(AnalogPin.P0)
    spenning_batteri = analogverdi_batteri / 1023 * Uref
}
```


<!-- Del 3.5: -->

## Oppgave 3 - Vis spenningsverdi på OLED-skjerm

Vi skal gjøre det samme som vi gjorde for å vise analogverdien til NTC på OLED-skjermen. Husk å plassere det inn i funksjonen ``||functions: vise_data_OLED||``.

Hent to nye blokker av ``||kitronik_VIEW128x64: vis ||``. Plasser ``||text: sett sammen ||`` fra biblioteket ``||text: Tekst ||`` inni ``||kitronik_VIEW128x64: vis ||``. 

- Inni den første ``||kitronik_VIEW128x64: vis ||``: I den første ruta til ``||text: sett sammen ||``, skriv "Spenning (NTC): ". I den andre ruta, sette inn variabelen ``||variables: spenning_NTC||``. Utvid til en tredje rute hvor du skriver " V". Skriv dette på linje 2.
- Inni den andre ``||kitronik_VIEW128x64: vis ||``: I den første ruta til ``||text: sett sammen ||``, skriv "Spenning (batteri): ". I den andre ruta, sette inn variabelen ``||variables: spenning_batteri||``. Utvid til en tredje rute hvor du skriver " V". Skriv dette på linje 3.
- 

**Last ned koden på micro:bit på CanSat, og sjekk at du får verdien ut på OLED-skjermen.** Du kan forvente en spenning rundt 1,5V fra batteriet.

```blocks
function vise_data_OLED () {
    kitronik_VIEW128x64.show("Analog (NTC): " + analogverdi_NTC, 1)
    kitronik_VIEW128x64.show("Spenning (NTC): " + spenning_NTC + " V", 2)
    kitronik_VIEW128x64.show("Spenning (batteri): " + spenning_batteri + " V", 3)
}
```

<!-- Del 3.6: -->

## Oppgave 3 - Sjekke batteritester og rydde opp i koden

Hvis vi får en spenning på ca. 1,5V fra batteriet, kan vi konkludere med at utregningene våre er riktige. Vi kan derfor slette følgende kode:

- Hele funksjonen ``||functions: batteritester||``
- ``||kitronik_VIEW128x64: vis ||`` Spenning (batteri) fra funksjonen ``||functions: vise_data_OLED||``


<!-- Del 4.1: -->

## Oppgave 4 - Regne om NTC spenningsverdi til temperaturverdi

For å få så nøyaktig temperaturverdi fra NTC'en, må vi gjøre en kalibrering. Det skal vi gjøre etterpå. Så foreløpig skal vi bruke formelen under:

Inne ``||functions: samle_data||``, lage en ny variabel: ``||variables: temperatur_NTC||``.

Bruk denne formelen for å sette ``||variables: temperatur_NTC||`` til (39.7956 * ``||variables: spenning_NTC||``) - 42.7499

Se hint for bilde av formel:

![Formel-temperatur-NTC-fra-spenning-NTC.png](https://i.postimg.cc/MG6nhdGq/Formel-temperatur-NTC-fra-spenning-NTC.png)

```blocks
function samle_data () {
    analogverdi_NTC = pins.analogReadPin(AnalogPin.P10)
    spenning_NTC = analogverdi_NTC / 1023 * Uref
    temperatur_NTC = 39.7956 * spenning_NTC - 42.7499
}
```

<!-- Del 4.2: -->

## Oppgave 4 - Vise temperaturverdi fra NTC på OLED-skjerm

Plasseres inn i funksjonen ``||functions: vise_data_OLED||``:

Hent en ny blokk av ``||kitronik_VIEW128x64: vis ||``. Plasser ``||text: sett sammen ||`` fra biblioteket ``||text: Tekst ||`` inni ``||kitronik_VIEW128x64: vis ||``. 

 I den første ruta til ``||text: sett sammen ||``, skriv "Temperatur (NTC): ". I den andre ruta, sette inn variabelen ``||variables: temperatur_NTC||``. Utvid til en tredje rute hvor du skriver " C". Skriv dette på linje 3.

**Last ned koden på micro:bit på CanSat, og sjekk at du får verdien ut på OLED-skjermen.** Sjekk om temperaturverdien gir mening. Det gjør ikke noe om den ikke gjør det.


```blocks
function vise_data_OLED () {
    kitronik_VIEW128x64.show("Analog (NTC): " + analogverdi_NTC, 1)
    kitronik_VIEW128x64.show("Spenning (NTC): " + spenning_NTC + " V", 2)
    kitronik_VIEW128x64.show("Temperatur (NTC): " + temperatur_NTC + " C", 3)
}
```
<!-- Del 4.6: -->

## Oppgave 5 - Runde av verdier til 2 desimaler

Dere har sikkert lagt merke til at verdiene våre har mange desimaler. Vi har ingen blokk som lar oss direkte avrunde til 2 desimaler. Vi må derfor lage en funksjon som vi kan bruke for å avrunde de verdiene vi ønsker. 

Lag en ny funksjon: ``||functions: avrund||``. Legg til parameteret "nummer" på linja over når du lager funksjonen. Dette gjøres i vinduet du får opp når du lager funksjonen. Endre "tall" til "sensorverdi". Hent frem ``||functions: return||`` og sett den inn i funksjonen.

I ``||functions: returner||``-blokken skal vi multiplisere ``||variables: sensorverdien||`` med 100, og deretter ``||math: avrund ||`` dette. Det gir oss et heltall som er 100 ganger for stort. Hvis vi nå deler det nye tallet vårt på 100, vil vi få riktig antall desimaler.

Endre i funksjonen ``||functions: vise_data_OLED||`` slik at ``||variables: spenning_NTC||`` og ``||variables: temperatur_NTC||`` erstattes med at ``||functions: avrund||`` kjøres på disse verdiene. Da må ``||variables: spenning_NTC||`` og ``||variables: temperatur_NTC||`` plasseres inn i ``||functions: kjør avrund||`` som så settes inn i ``||text: sett sammen||``blokkene som allerede er der. 

```blocks
function vise_data_OLED () {
    kitronik_VIEW128x64.show("Analog (NTC): " + analogverdi_NTC, 1)
    kitronik_VIEW128x64.show("Spenning (NTC): " + avrund(spenning_NTC) + " V", 2)
    kitronik_VIEW128x64.show("Temperatur (NTC): " + avrund(temperatur_NTC) + " C", 3)
}
function avrund (sensorverdi: number) {
    return Math.round(sensorverdi * 100) / 100
}
```
**Last ned koden på micro:bit på CanSat, og sjekk at verdiene på OLED-skjermen vises kun med 2 desimaler.**


<!-- Del 6: -->

## Oppgave 6 - Lag et barometer @unplugged

#### Vi skal bruke en ``||BME280: BME280||`` sensor. 

![BME280.png](https://i.postimg.cc/3J0ZjjvD/BME280.png)

Denne sensoren kan måle:

- Temperatur
- Trykk
- Luftfuktighet
- Duggpunkt

For å lage et barometer skal vi bruke blokken ``||BME280: trykk||``.


<!-- Del 6.1: -->

## Oppgave 6: Koble opp og lese av fra BME280

For å få BME280 til å snakke med CanSat, skal vi sette opp to blokken inn i ``||basic: ved start||`` fra biblioteket ``||BME280: BME280||``:

- ``||BME280: Skru PÅ||``
- ``||BME280: Sett adresse 0x76||``

Inne ``||functions: samle_data||``, sett opp en ny variabel: ``||variables: trykk||``. Sett ``||variables: trykk||`` til ``||BME280: trykk||`` (fra biblioteket BME280).

```blocks
kitronik_VIEW128x64.controlDisplayOnOff(kitronik_VIEW128x64.onOff(true))
kitronik_VIEW128x64.setFontSize(kitronik_VIEW128x64.FontSelection.Normal)
Uref = 3.2
BME280.PowerOn()
BME280.Address(BME280_I2C_ADDRESS.ADDR_0x76)
function samle_data () {
    analogverdi_NTC = pins.analogReadPin(AnalogPin.P10)
    spenning_NTC = analogverdi_NTC / 1023 * Uref
    temperatur_NTC = 39.7956 * spenning_NTC - 42.7499
    trykk = BME280.pressure(BME280_P.Pa)
}
```

<!-- Del 6.2: -->

## Oppgave 6: Skrive lufttrykk på OLED-skjerm

Kopier koden vi har brukt før for å skrive til OLED-skjerm inni ``||functions: vise_data_OLED||``

I den første ruta, skriv "Trykk: ". I den andre ruta, sette inn ``||variables: trykk||``. I den tredje, skriv " Pa". Skriv til linje 4.

**Last ned koden på micro:bit på CanSat, og sjekk at du får verdien ut på OLED-skjermen.** Forventet trykk ligger rundt 100 000 Pa.


```blocks
function vise_data_OLED () {
    kitronik_VIEW128x64.show("Analog (NTC): " + analogverdi_NTC, 1)
    kitronik_VIEW128x64.show("Spenning (NTC): " + avrund(spenning_NTC) + " V", 2)
    kitronik_VIEW128x64.show("Temperatur (NTC): " + avrund(temperatur_NTC) + " C", 3)
    kitronik_VIEW128x64.show("Trykk: " + trykk + " Pa", 4)
}
function avrund (sensorverdi: number) {
    return Math.round(sensorverdi * 100) / 100
}
```

<!-- Del 7: -->

## Oppgave 7 - Beregne høyden til CanSat over bakken @unplugged

For å beregne høyden CanSat har over bakken, skal vi bruke formelen under.

![Regne_ut_høyde_i_forhold_til_trykk_liten_200.png](https://i.postimg.cc/6pygnRB4/Regne_ut_høyde_i_forhold_til_trykk_liten_200.png)

- **h:**  Beregnet høyde i meter
- **h1:** Referansehøyde i meter (starthøyde er 0 eller m.o.h.)
- **T:**  Temperatur i Kelvin (``||variables: temperatur_NTC||`` + 273,15)
- **T1:** Referansetemperatur ved referansehøyden h1
- **R:**  Den spesifikke gasskonstant 287,06 J/kg K
- **a:**  Temperaturgradient, foreslått verdi -0,0065 K/m
- **p:**  Målt trykk i Pa
- **p1:** Trykk i Pa ved referansehøyden h1
- **g0:** Tyngdeakselerasjonen 9,81 m/s^2


<!-- Del 7.1: -->

## Oppgave 7 - Sette trykk og temperatur ved referansehøyden

Før vi kan bygge formelen må vi lage en måte å nullstille høydemåleren vår.

Lag to ny variabler: ``||variables: trykk_1||`` og ``||variables: temperatur_NTC_1||``. Plasser disse inn i ``||input: når knapp A trykkes||``.

- Sett ``||variables: trykk_1||`` til ``||variables: trykk||``
- Sett ``||variables: temperatur_NTC_1||`` til``||variables: temperatur_NTC||`` 

Dette vil gjøre at når knapp A trykkes inn, nullstilles høydemåleren.

```blocks
input.onButtonPressed(Button.A, function () {
	trykk_1 = trykk
    temperatur_NTC_1 = temperatur_NTC
})
```

<!-- Del 7.2: -->

## Oppgave 7 - Bygge formelen for å beregne høyden til CanSat

Vi har en egen blokk som gjør denne utregningen for oss.

Lag en ny variabel: ``||variables: høyde||``. Sett den inn i funksjonen ``||functions: samle_data||``.

Plasser blokken fra biblioteket ``||barometric-height: Høydeberegning||``.

Vi må plassere disse variablene inn i blokken:

- Inni ruten p: Plasser variabelen ``||variables: trykk||``
- Inni ruten p1: Plasser variabelen ``||variables: trykk_1||``
- Inni ruten T1: Plasser variabelen ``||variables: temperatur_NTC_1||`` ``||math: + 273,15||``

```blocks
let høyde = høydeberegning.barometricHeight(
trykk,
trykk_1,
temperatur_NTC_1,
0.0065,
0,
287,
9.81
)
```

<!-- Del 7.3: -->

## Oppgave 7 - Vise høyden til CanSat på OLEd-skjermen

Kopier koden vi har brukt før for å skrive til OLED-skjerm inni ``||functions: vise_data_OLED||``

I den første ruta, skriv "Høyde: ". I den andre ruta, sette inn ``||variables: høyde||``. I den tredje, skriv " m". Skriv til linje 5.

For å få 2 desimaler, kjør ``||functions: avrund||`` inni der vi skriver variabelen ``||variables: høyde||``.

**Last ned koden på micro:bit på CanSat, og sjekk at du får verdien ut på OLED-skjermen.** Sjekk om høydemålingen gir mening. Viktig å trykke på knapp A på micro:bit for nullstille høyden.

```blocks
function vise_data_OLED () {
    kitronik_VIEW128x64.show("Analog (NTC): " + analogverdi_NTC, 1)
    kitronik_VIEW128x64.show("Spenning (NTC): " + avrund(spenning_NTC) + " V", 2)
    kitronik_VIEW128x64.show("Temperatur (NTC): " + avrund(temperatur_NTC) + " C", 3)
    kitronik_VIEW128x64.show("Trykk: " + trykk + " Pa", 4)
    kitronik_VIEW128x64.show("Høyde: " + avrund(høyde) + " m", 5)
}
function avrund (sensorverdi: number) {
    return Math.round(sensorverdi * 100) / 100
}
```

<!-- Del 8.1: -->

## Oppgave 8 - Logge dataene vår på internminne til micro:bit @unplugged

![internminne_til_micro:bit](https://cdn.sanity.io/images/ajwvhvgo/production/759979022f4dd381418c793e73b9fea8a01deb26-800x423.png?q=95)

Alle dataene vi samler skal lagres i internminne til micro:bit.


<!-- Del 8.2: -->

## Oppgave 8 - Sette opp datalogging på micro:bit

Inni funksjonen ``||functions: lagre_data||``: Finn frem blokken ``||datalogging: logg data||`` fra biblioteket ``||datalogging: datalogging||``.

Her skal vi sette inn de forskjellige dataene vi har samlet. For å legge til flere kolonner, trykk på pluss(+)-knappen.

I kolonne, skriv hvilke data som samles. I verdi, plasser tilhørende variabel.

```blocks
function lagre_data () {
    datalogging.log(
    datalogging.createCV("Teller", teller),
    datalogging.createCV("Temperatur (NTC)", temperatur_NTC),
    datalogging.createCV("Trykk", trykk)
    )
}
``` 
<!-- Del 8.3: -->

## Oppgave 8 - Sjekke at data blir logget

**Last ned koden på CanSat, og koble den fra PC'en etterpå.**

La CanSat være skrudd på i 10-20 sekunder. Koble så micro:bit til PC'en.

Når Filutforsker åpner mappen til micro:bit, åpne filen: **MY_DATA**

Du bør nå se dataene dine her!


<!-- Del 9.1: -->

## Oppgave 9 - Overføre dataene fra CanSat til en PC, og vise de på skjermen

Vi skal nå sette opp det som skal inn i funksjonen ``||functions: vise_data_PC||``.

Finn frem blokken ``||serial: serieport skriv verdi||`` fra biblioteket ``||serial: serieport||``.

Her skal vi sette inn de forskjellige dataene vi har samlet. For å legge til en blokk for hver variabel du skal vise.

I stedet for "x", skriv hvilke data som samles. Og plasser tilhørende variabel inn der 0 står.

```blocks
function vise_data_PC () {
    serial.writeValue("Teller", teller)
    serial.writeValue("Temperatur (NTC)", temperatur_NTC)
    serial.writeValue("Trykk", trykk)
}
```

<!-- Del 10: -->

## Ferdig! 

Gratulerer! Du har nå en fungerende primær-oppdrag for CanSat med bruk av micro:bit!



```package
oled-skjerm=github:oysa88/oled-skjerm
BME280=github:oysa88/BME280
barometric-height=github:oysa88/barometric-height
datalogging=github:oysa88/datalogging
```