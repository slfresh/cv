window.GALLERY_UI = {
  prevLabel: 'Vorheriges Bild',
  nextLabel: 'Nächstes Bild',
  counter: function (i, n) { return 'Bild ' + i + ' von ' + n; },
  note: function (total, visible) {
    if (total <= visible) {
      return 'Eigene Aufnahmen · Klick zum Vergrößern';
    }
    return total + ' Fotos insgesamt, ' + visible + ' hier sichtbar · In der Großansicht mit Pfeiltasten oder Wischen blättern';
  },
};
window.JOB_GALLERIES = {
  'profil': [
    { src: 'images/slavko-grbic.jpg', caption: 'Slavko Grbic – Profilfoto', alt: 'Slavko Grbic im dunklen Anzug mit hellblauer Krawatte, Porträt vor hellem Hintergrund', label: 'Profil' },
    { src: 'images/profil-casual.png', caption: 'Slavko Grbic – Profilfoto, lässig (Poloshirt)', alt: 'Slavko Grbic im Poloshirt, sitzend, Portrait', label: 'Lässig' },
    { src: 'images/profil-formal.png', caption: 'Slavko Grbic – Profilfoto, Business-Look', alt: 'Slavko Grbic im Anzug mit Krawatte, professionelles Portrait', label: 'Business' },
  ],
  'tagungstechnik': [
    { src: 'images/jobs/martas-hotel/martas-15.png', caption: 'Martas Hotel: Tagung – Rednerpult mit Mikrofon, Beamer und parlamentarische Bestuhlung', alt: 'Martas Hotel: Tagung – Rednerpult mit Mikrofon, Beamer und parlamentarische Bestuhlung', label: 'Rednerpult & Beamer' },
    { src: 'images/jobs/martas-hotel/martas-17.png', caption: 'Martas Hotel: Tagung in U-Form – Leinwand und Flipchart', alt: 'Martas Hotel: Tagung in U-Form – Leinwand und Flipchart', label: 'U-Form & Leinwand' },
    { src: 'images/jobs/martas-hotel/martas-07.png', caption: 'Martas Hotel: Gala-Saal mit Bühne, Projektion und Eventlicht', alt: 'Martas Hotel: Gala-Saal mit Bühne, Projektion und Eventlicht', label: 'Bühne & Eventlicht' },
  ],
  'montage': [
    { src: 'images/jobs/polster-catering/polster-01.png', caption: 'Polster Catering: Aufbau – Metallgerüst eines großen Zeltes auf Holzunterbau', alt: 'Polster Catering: Aufbau – Metallgerüst eines großen Zeltes auf Holzunterbau', label: 'Zelt-Gerüst' },
    { src: 'images/jobs/polster-catering/polster-10.png', caption: 'Polster Catering: Aufbau eines Pavillons – Stahlrahmen, Bodenplatten, Leitern', alt: 'Polster Catering: Aufbau eines Pavillons – Stahlrahmen, Bodenplatten, Leitern', label: 'Pavillon-Aufbau' },
    { src: 'images/jobs/polster-catering/polster-oberhof-02.png', caption: 'Biathlon-Weltcup Oberhof 2017: Hospitality-Zelt mit Rundtischen, Stehtischreihen und Bildschirmen', alt: 'Biathlon-Weltcup Oberhof 2017: Hospitality-Zelt mit Rundtischen, Stehtischreihen und Bildschirmen', label: 'Oberhof · Zelt' },
    { src: 'images/jobs/polster-catering/polster-oberhof-03.png', caption: 'Biathlon-Weltcup Oberhof 2017: lange Tafelreihen und Lichttechnik im VIP-Zelt', alt: 'Biathlon-Weltcup Oberhof 2017: lange Tafelreihen und Lichttechnik im VIP-Zelt', label: 'Oberhof · Lichttechnik' },
  ],
  'geraete': [
    { src: 'images/jobs/polster-catering/polster-04.png', caption: 'Mobiles Handkassengerät (S-600): Bestellungen und Tischabrechnung', alt: 'Mobiles Handkassengerät (S-600): Bestellungen und Tischabrechnung', label: 'Handkasse S-600' },
    { src: 'images/jobs/amfora-hotel/amfora-06.png', caption: 'Hotel Amfora: Servicebereich mit Getränkekühlung und Kassenstation', alt: 'Hotel Amfora: Servicebereich mit Getränkekühlung und Kassenstation', label: 'Servicestation' },
  ],
};
