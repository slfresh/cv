window.GALLERY_UI = {
  prevLabel: 'Previous image',
  nextLabel: 'Next image',
  counter: function (i, n) { return 'Image ' + i + ' of ' + n; },
  note: function (total, visible) {
    if (total <= visible) {
      return 'My own photos · click to enlarge';
    }
    return total + ' photos total, ' + visible + ' shown here · browse with arrow keys or swipe in the lightbox';
  },
};
window.JOB_GALLERIES = {
  'profil': [
    { src: '../images/profil.png', caption: 'Slavko Grbic – profile photo (main)', alt: 'Slavko Grbic – profile photo, looking at the camera', label: 'Profile' },
    { src: '../images/profil-casual.png', caption: 'Slavko Grbic – casual profile (polo shirt)', alt: 'Slavko Grbic in a polo shirt, seated, portrait', label: 'Casual' },
    { src: '../images/profil-formal.png', caption: 'Slavko Grbic – formal business portrait', alt: 'Slavko Grbic in a suit and tie, professional portrait', label: 'Business' },
  ],
  'tagungstechnik': [
    { src: '../images/jobs/martas-hotel/martas-15.png', caption: 'Martas Hotel: conference – lectern with microphone, projector and classroom seating', alt: 'Martas Hotel: conference – lectern with microphone, projector and classroom seating', label: 'Lectern & projector' },
    { src: '../images/jobs/martas-hotel/martas-17.png', caption: 'Martas Hotel: U-shape conference – screen and flipchart', alt: 'Martas Hotel: U-shape conference – screen and flipchart', label: 'U-shape & screen' },
    { src: '../images/jobs/martas-hotel/martas-07.png', caption: 'Martas Hotel: gala hall with stage, projection and event lighting', alt: 'Martas Hotel: gala hall with stage, projection and event lighting', label: 'Stage & lighting' },
  ],
  'montage': [
    { src: '../images/jobs/polster-catering/polster-01.png', caption: 'Polster Catering: build-up – metal frame of a large tent on a timber base', alt: 'Polster Catering: build-up – metal frame of a large tent on a timber base', label: 'Tent frame' },
    { src: '../images/jobs/polster-catering/polster-10.png', caption: 'Polster Catering: pavilion build-up – steel frame, floor panels, ladders', alt: 'Polster Catering: pavilion build-up – steel frame, floor panels, ladders', label: 'Pavilion build' },
    { src: '../images/jobs/polster-catering/polster-oberhof-02.png', caption: 'Biathlon World Cup Oberhof 2017: hospitality tent with round tables, rows of bar tables and screens', alt: 'Biathlon World Cup Oberhof 2017: hospitality tent with round tables, rows of bar tables and screens', label: 'Oberhof · tent' },
    { src: '../images/jobs/polster-catering/polster-oberhof-03.png', caption: 'Biathlon World Cup Oberhof 2017: long table rows and lighting rig in the VIP tent', alt: 'Biathlon World Cup Oberhof 2017: long table rows and lighting rig in the VIP tent', label: 'Oberhof · lighting rig' },
  ],
  'geraete': [
    { src: '../images/jobs/polster-catering/polster-04.png', caption: 'Handheld POS device (S-600): orders and table billing', alt: 'Handheld POS device (S-600): orders and table billing', label: 'Handheld POS S-600' },
    { src: '../images/jobs/amfora-hotel/amfora-06.png', caption: 'Hotel Amfora: service area with drinks coolers and POS station', alt: 'Hotel Amfora: service area with drinks coolers and POS station', label: 'Service station' },
  ],
};
