window.GALLERY_UI = {
  prevLabel: 'Vorheriges Bild',
  nextLabel: 'Nächstes Bild',
  counter: function (i, n) { return 'Bild ' + i + ' von ' + n; },
  note: function (total, visible) {
    if (total <= visible) {
      return total + ' Foto' + (total === 1 ? '' : 's') + ' · Klick zum Vergrößern · In der Ansicht mit Pfeiltasten (←/→) oder Wischen blättern';
    }
    return total + ' Fotos insgesamt, ' + visible + ' hier sichtbar · In der Großansicht alle Bilder mit Pfeiltasten oder Wischen durchblättern';
  },
};
window.JOB_GALLERIES = {
  'profil': [
    { src: 'images/profil.png', caption: 'Slavko Grbic – Profilfoto (Hauptmotiv)', alt: 'Slavko Grbic – Profilfoto, freundlicher Blick zur Kamera', label: 'Profil' },
    { src: 'images/profil-casual.png', caption: 'Slavko Grbic – Profilfoto, lässig (Poloshirt)', alt: 'Slavko Grbic im Poloshirt, sitzend, Portrait', label: 'Lässig' },
    { src: 'images/profil-formal.png', caption: 'Slavko Grbic – Profilfoto, Business-Look', alt: 'Slavko Grbic im Anzug mit Krawatte, professionelles Portrait', label: 'Business' },
  ],
  'martas': [
    { src: 'images/jobs/martas-hotel/martas-01.png', caption: 'Martas Hotel: Gala-Abend im großen Saal – eingedeckte Rundtische, Bühne und Eventlicht', alt: 'Martas Hotel: Gala-Abend im großen Saal – eingedeckte Rundtische, Bühne und Eventlicht', label: 'Gala-Abend' },
    { src: 'images/jobs/martas-hotel/martas-02.png', caption: 'Martas Hotel: Bankett mit runden Tischen und Leinwand', alt: 'Martas Hotel: Bankett mit runden Tischen und Leinwand', label: 'Bankett' },
    { src: 'images/jobs/martas-hotel/martas-03.png', caption: 'Martas Hotel: Sektempfang – Stehtisch mit Gläsern, Sekt auf Eis', alt: 'Martas Hotel: Sektempfang – Stehtisch mit Gläsern, Sekt auf Eis', label: 'Empfang' },
    { src: 'images/jobs/martas-hotel/martas-04.png', caption: 'Martas Hotel: Buffet-Station mit Chafing Dishes, Geschirr und Kaffeestation', alt: 'Martas Hotel: Buffet-Station mit Chafing Dishes, Geschirr und Kaffeestation', label: 'Buffet' },
    { src: 'images/jobs/martas-hotel/martas-05.png', caption: 'Martas Hotel: lange Tafel im Tagungsraum', alt: 'Martas Hotel: lange Tafel im Tagungsraum', label: 'Tafel' },
    { src: 'images/jobs/martas-hotel/martas-06.png', caption: 'Martas Hotel: Abendveranstaltung mit Eventlicht – Rundtische, Stehtische, Garderobe', alt: 'Martas Hotel: Abendveranstaltung mit Eventlicht – Rundtische, Stehtische, Garderobe', label: 'Eventlicht' },
    { src: 'images/jobs/martas-hotel/martas-07.png', caption: 'Martas Hotel: Gala-Saal mit Bühne, Projektion und eingedeckten Tischen', alt: 'Martas Hotel: Gala-Saal mit Bühne, Projektion und eingedeckten Tischen', label: 'Gala & Bühne' },
    { src: 'images/jobs/martas-hotel/martas-08.png', caption: 'Martas Hotel: Grundaufbau mit runden Tischen im Saal', alt: 'Martas Hotel: Grundaufbau mit runden Tischen im Saal', label: 'Grundaufbau' },
    { src: 'images/jobs/martas-hotel/martas-15.png', caption: 'Martas Hotel: Tagung – Rednerpult mit Mikrofon, Beamer und parlamentarische Bestuhlung', alt: 'Martas Hotel: Tagung – Rednerpult mit Mikrofon, Beamer und parlamentarische Bestuhlung', label: 'Tagungstechnik' },
    { src: 'images/jobs/martas-hotel/martas-16.png', caption: 'Martas Hotel: Tagung mit Podium und parlamentarischer Bestuhlung', alt: 'Martas Hotel: Tagung mit Podium und parlamentarischer Bestuhlung', label: 'Podium' },
    { src: 'images/jobs/martas-hotel/martas-17.png', caption: 'Martas Hotel: Tagung in U-Form – Leinwand und Flipchart', alt: 'Martas Hotel: Tagung in U-Form – Leinwand und Flipchart', label: 'U-Form' },
    { src: 'images/jobs/martas-hotel/martas-18.png', caption: 'Martas Hotel: Glühwein-Stand im Außenbereich zur Weihnachtszeit', alt: 'Martas Hotel: Glühwein-Stand im Außenbereich zur Weihnachtszeit', label: 'Winter-Event' },
    { src: 'images/jobs/martas-hotel/martas-19.png', caption: 'Martas Hotel: Dekor-Element – Raumteiler aus Birkenstämmen auf rollbarer Palette', alt: 'Martas Hotel: Dekor-Element – Raumteiler aus Birkenstämmen auf rollbarer Palette', label: 'Dekor' },
    { src: 'images/jobs/martas-hotel/martas-21.png', caption: 'Martas Hotel: Raumteiler aus Birkenstämmen im Restaurantbereich', alt: 'Martas Hotel: Raumteiler aus Birkenstämmen im Restaurantbereich', label: 'Raumteiler' },
  ],
  'polster': [
    { src: 'images/jobs/polster-catering/polster-01.png', caption: 'Polster Catering: Aufbau – Metallgerüst eines großen Zeltes auf Holzunterbau', alt: 'Polster Catering: Aufbau – Metallgerüst eines großen Zeltes auf Holzunterbau', label: 'Zelt-Gerüst' },
    { src: 'images/jobs/polster-catering/polster-03.png', caption: 'Polster Catering: Biergarten-Betrieb am Festzelt', alt: 'Polster Catering: Biergarten-Betrieb am Festzelt', label: 'Biergarten' },
    { src: 'images/jobs/polster-catering/polster-04.png', caption: 'Mobiles Kassengerät (S-600 Handy): Bestellungen und Tischabrechnung', alt: 'Mobiles Kassengerät (S-600 Handy): Bestellungen und Tischabrechnung', label: 'Mobiles POS' },
    { src: 'images/jobs/polster-catering/polster-05.png', caption: 'Polster Catering: Außenbestuhlung am See vor Betriebsbeginn', alt: 'Polster Catering: Außenbestuhlung am See vor Betriebsbeginn', label: 'Außenbereich' },
    { src: 'images/jobs/polster-catering/polster-07.png', caption: 'Polster Catering: Blick aus dem Pavillon auf die Außengastronomie', alt: 'Polster Catering: Blick aus dem Pavillon auf die Außengastronomie', label: 'Pavillon' },
    { src: 'images/jobs/polster-catering/polster-08.png', caption: 'Polster Catering: À-la-carte-Restaurant im Pavillon – eingedeckte Tische', alt: 'Polster Catering: À-la-carte-Restaurant im Pavillon – eingedeckte Tische', label: 'Restaurant' },
    { src: 'images/jobs/polster-catering/polster-09.png', caption: 'Stadion Chemnitz – Einsatzort für VIP-Betreuung und Verkauf', alt: 'Stadion Chemnitz – Einsatzort für VIP-Betreuung und Verkauf', label: 'Stadion Chemnitz' },
    { src: 'images/jobs/polster-catering/polster-10.png', caption: 'Polster Catering: Aufbau eines Pavillons – Stahlrahmen, Bodenplatten, Leitern', alt: 'Polster Catering: Aufbau eines Pavillons – Stahlrahmen, Bodenplatten, Leitern', label: 'Pavillon-Aufbau' },
    { src: 'images/jobs/polster-catering/polster-11.png', caption: 'Polster Catering: Buffet mit kalten Platten', alt: 'Polster Catering: Buffet mit kalten Platten', label: 'Buffet' },
    { src: 'images/jobs/polster-catering/polster-12.png', caption: 'Polster Catering: Blick von der Terrasse auf die Open-Air-Bühne mit Tontechnik am See', alt: 'Polster Catering: Blick von der Terrasse auf die Open-Air-Bühne mit Tontechnik am See', label: 'Open-Air' },
    { src: 'images/jobs/polster-catering/polster-13.png', caption: 'Polster Catering: lange Buffetstrecke im Pavillon vor Veranstaltungsbeginn', alt: 'Polster Catering: lange Buffetstrecke im Pavillon vor Veranstaltungsbeginn', label: 'Buffetstrecke' },
    { src: 'images/jobs/polster-catering/polster-14.png', caption: 'Stadion – Blick von der Tribüne vor Spielbeginn', alt: 'Stadion – Blick von der Tribüne vor Spielbeginn', label: 'Stadion' },
    { src: 'images/jobs/polster-catering/polster-oberhof-01.png', caption: 'BMW IBU Weltcup Biathlon Oberhof (Jan. 2017): Hospitality-Zelt mit gedeckten Rundtischen', alt: 'BMW IBU Weltcup Biathlon Oberhof (Jan. 2017): Hospitality-Zelt mit gedeckten Rundtischen', label: 'Oberhof · VIP-Zelt' },
    { src: 'images/jobs/polster-catering/polster-oberhof-02.png', caption: 'Oberhof: Hospitality-Zelt mit Rundtischen, Stehtischreihen und Bildschirmen', alt: 'Oberhof: Hospitality-Zelt mit Rundtischen, Stehtischreihen und Bildschirmen', label: 'Oberhof · Zelt' },
    { src: 'images/jobs/polster-catering/polster-oberhof-03.png', caption: 'Oberhof: lange Tafelreihen und Lichttechnik im VIP-Zelt', alt: 'Oberhof: lange Tafelreihen und Lichttechnik im VIP-Zelt', label: 'Oberhof · Tafeln' },
    { src: 'images/jobs/polster-catering/polster-oberhof-04.png', caption: 'Oberhof: eingedeckte Rundtische und Buffetstrecke', alt: 'Oberhof: eingedeckte Rundtische und Buffetstrecke', label: 'Oberhof · Buffet' },
    { src: 'images/jobs/polster-catering/polster-oberhof-05.png', caption: 'Oberhof: Buffetstrecke vor Beginn', alt: 'Oberhof: Buffetstrecke vor Beginn', label: 'Oberhof · Vorbereitung' },
  ],
  'amfora': [
    { src: 'images/jobs/amfora-hotel/amfora-01.png', caption: 'Hotel Amfora Hvar: Außen-Terrasse mit gedeckten Tischen und Blick auf die Adria', alt: 'Hotel Amfora Hvar: Außen-Terrasse mit gedeckten Tischen und Blick auf die Adria', label: 'Terrasse · Meerblick' },
    { src: 'images/jobs/amfora-hotel/amfora-02.png', caption: 'Hotel Amfora Hvar: Pool- und Außenbereich', alt: 'Hotel Amfora Hvar: Pool- und Außenbereich', label: 'Pool' },
    { src: 'images/jobs/amfora-hotel/amfora-03.png', caption: 'Hotel Amfora: Poolbereich mit Sponsoren-Schirmen in der Ultra-Europe-Saison auf Hvar', alt: 'Hotel Amfora: Poolbereich mit Sponsoren-Schirmen in der Ultra-Europe-Saison auf Hvar', label: 'Pool · Festivalzeit' },
    { src: 'images/jobs/amfora-hotel/amfora-04.png', caption: 'Hotel Amfora Hvar: Poollandschaft von oben – Arbeitsbereich Pool-Service', alt: 'Hotel Amfora Hvar: Poollandschaft von oben – Arbeitsbereich Pool-Service', label: 'Poollandschaft' },
    { src: 'images/jobs/amfora-hotel/amfora-06.png', caption: 'Hotel Amfora: Servicebereich mit Getränkekühlung und Kassenstation', alt: 'Hotel Amfora: Servicebereich mit Getränkekühlung und Kassenstation', label: 'Servicestation' },
    { src: 'images/jobs/amfora-hotel/amfora-07.png', caption: 'Hotel Amfora: Lounge mit Sitzecke, Eistruhe und Getränkekühlung', alt: 'Hotel Amfora: Lounge mit Sitzecke, Eistruhe und Getränkekühlung', label: 'Lounge' },
  ],
};
