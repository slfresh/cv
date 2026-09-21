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
  ],
  'polster': [
  ],
  'amfora': [
  ],
  'javora': [
  ],
  'orfej': [
  ],
  'vespera': [
  ],
};
