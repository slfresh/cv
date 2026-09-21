window.GALLERY_UI = {
  prevLabel: 'Previous image',
  nextLabel: 'Next image',
  counter: function (i, n) { return 'Image ' + i + ' of ' + n; },
  note: function (total, visible) {
    if (total <= visible) {
      return total + ' photo' + (total === 1 ? '' : 's') + ' · Click to enlarge · Use arrow keys (←/→) or swipe in the viewer';
    }
    return total + ' photos total, ' + visible + ' shown here · In the lightbox, browse all images with arrow keys or swipe';
  },
};
window.JOB_GALLERIES = {
  'profil': [
    { src: '../images/profil.png', caption: 'Slavko Grbic – profile photo (main)', alt: 'Slavko Grbic – profile photo, looking at the camera', label: 'Profile' },
    { src: '../images/profil-casual.png', caption: 'Slavko Grbic – casual profile (polo shirt)', alt: 'Slavko Grbic in a polo shirt, seated, portrait', label: 'Casual' },
    { src: '../images/profil-formal.png', caption: 'Slavko Grbic – formal business portrait', alt: 'Slavko Grbic in a suit and tie, professional portrait', label: 'Business' },
  ],
  'martas': [
    { src: '../images/jobs/martas-hotel/martas-01.png', caption: 'Martas Hotel: gala evening in the main hall – set round tables, stage and event lighting', alt: 'Martas Hotel: gala evening in the main hall – set round tables, stage and event lighting', label: 'Gala evening' },
    { src: '../images/jobs/martas-hotel/martas-02.png', caption: 'Martas Hotel: banquet with round tables and projection screen', alt: 'Martas Hotel: banquet with round tables and projection screen', label: 'Banquet' },
    { src: '../images/jobs/martas-hotel/martas-03.png', caption: 'Martas Hotel: sparkling-wine reception – bar table with glasses, bottles on ice', alt: 'Martas Hotel: sparkling-wine reception – bar table with glasses, bottles on ice', label: 'Reception' },
    { src: '../images/jobs/martas-hotel/martas-04.png', caption: 'Martas Hotel: buffet station with chafing dishes, crockery and coffee station', alt: 'Martas Hotel: buffet station with chafing dishes, crockery and coffee station', label: 'Buffet' },
    { src: '../images/jobs/martas-hotel/martas-05.png', caption: 'Martas Hotel: long table in a meeting room', alt: 'Martas Hotel: long table in a meeting room', label: 'Long table' },
    { src: '../images/jobs/martas-hotel/martas-06.png', caption: 'Martas Hotel: evening event with event lighting – round tables, bar tables, cloakroom', alt: 'Martas Hotel: evening event with event lighting – round tables, bar tables, cloakroom', label: 'Event lighting' },
    { src: '../images/jobs/martas-hotel/martas-07.png', caption: 'Martas Hotel: gala hall with stage, projection and set tables', alt: 'Martas Hotel: gala hall with stage, projection and set tables', label: 'Gala & stage' },
    { src: '../images/jobs/martas-hotel/martas-08.png', caption: 'Martas Hotel: basic set-up with round tables in the hall', alt: 'Martas Hotel: basic set-up with round tables in the hall', label: 'Basic set-up' },
    { src: '../images/jobs/martas-hotel/martas-15.png', caption: 'Martas Hotel: conference – lectern with microphone, projector and classroom seating', alt: 'Martas Hotel: conference – lectern with microphone, projector and classroom seating', label: 'Conference AV' },
    { src: '../images/jobs/martas-hotel/martas-16.png', caption: 'Martas Hotel: conference with panel table and classroom seating', alt: 'Martas Hotel: conference with panel table and classroom seating', label: 'Panel' },
    { src: '../images/jobs/martas-hotel/martas-17.png', caption: 'Martas Hotel: U-shape conference – screen and flipchart', alt: 'Martas Hotel: U-shape conference – screen and flipchart', label: 'U-shape' },
    { src: '../images/jobs/martas-hotel/martas-18.png', caption: 'Martas Hotel: mulled-wine stand outdoors at Christmas time', alt: 'Martas Hotel: mulled-wine stand outdoors at Christmas time', label: 'Winter event' },
    { src: '../images/jobs/martas-hotel/martas-19.png', caption: 'Martas Hotel: décor element – room divider made of birch trunks on a wheeled pallet', alt: 'Martas Hotel: décor element – room divider made of birch trunks on a wheeled pallet', label: 'Décor' },
    { src: '../images/jobs/martas-hotel/martas-21.png', caption: 'Martas Hotel: birch-trunk room divider in the restaurant area', alt: 'Martas Hotel: birch-trunk room divider in the restaurant area', label: 'Room divider' },
  ],
  'polster': [
    { src: '../images/jobs/polster-catering/polster-01.png', caption: 'Polster Catering: build-up – metal frame of a large tent on a timber base', alt: 'Polster Catering: build-up – metal frame of a large tent on a timber base', label: 'Tent frame' },
    { src: '../images/jobs/polster-catering/polster-03.png', caption: 'Polster Catering: beer-garden service next to the marquee', alt: 'Polster Catering: beer-garden service next to the marquee', label: 'Beer garden' },
    { src: '../images/jobs/polster-catering/polster-04.png', caption: 'Handheld POS device (S-600): orders and table billing', alt: 'Handheld POS device (S-600): orders and table billing', label: 'Handheld POS' },
    { src: '../images/jobs/polster-catering/polster-05.png', caption: 'Polster Catering: outdoor seating by the lake before opening', alt: 'Polster Catering: outdoor seating by the lake before opening', label: 'Outdoor area' },
    { src: '../images/jobs/polster-catering/polster-07.png', caption: 'Polster Catering: view from the pavilion to the outdoor seating', alt: 'Polster Catering: view from the pavilion to the outdoor seating', label: 'Pavilion' },
    { src: '../images/jobs/polster-catering/polster-08.png', caption: 'Polster Catering: à-la-carte restaurant in the pavilion – set tables', alt: 'Polster Catering: à-la-carte restaurant in the pavilion – set tables', label: 'Restaurant' },
    { src: '../images/jobs/polster-catering/polster-09.png', caption: 'Chemnitz stadium – venue for VIP service and sales', alt: 'Chemnitz stadium – venue for VIP service and sales', label: 'Chemnitz stadium' },
    { src: '../images/jobs/polster-catering/polster-10.png', caption: 'Polster Catering: pavilion build-up – steel frame, floor panels, ladders', alt: 'Polster Catering: pavilion build-up – steel frame, floor panels, ladders', label: 'Pavilion build' },
    { src: '../images/jobs/polster-catering/polster-11.png', caption: 'Polster Catering: buffet with cold platters', alt: 'Polster Catering: buffet with cold platters', label: 'Buffet' },
    { src: '../images/jobs/polster-catering/polster-12.png', caption: 'Polster Catering: view from the terrace to the open-air stage with sound equipment by the lake', alt: 'Polster Catering: view from the terrace to the open-air stage with sound equipment by the lake', label: 'Open air' },
    { src: '../images/jobs/polster-catering/polster-13.png', caption: 'Polster Catering: long buffet line in the pavilion before the event', alt: 'Polster Catering: long buffet line in the pavilion before the event', label: 'Buffet line' },
    { src: '../images/jobs/polster-catering/polster-14.png', caption: 'Stadium – view from the stand before kick-off', alt: 'Stadium – view from the stand before kick-off', label: 'Stadium' },
    { src: '../images/jobs/polster-catering/polster-oberhof-01.png', caption: 'BMW IBU Biathlon World Cup Oberhof (Jan 2017): hospitality tent with set round tables', alt: 'BMW IBU Biathlon World Cup Oberhof (Jan 2017): hospitality tent with set round tables', label: 'Oberhof · VIP tent' },
    { src: '../images/jobs/polster-catering/polster-oberhof-02.png', caption: 'Oberhof: hospitality tent with round tables, rows of bar tables and screens', alt: 'Oberhof: hospitality tent with round tables, rows of bar tables and screens', label: 'Oberhof · tent' },
    { src: '../images/jobs/polster-catering/polster-oberhof-03.png', caption: 'Oberhof: long table rows and lighting rig in the VIP tent', alt: 'Oberhof: long table rows and lighting rig in the VIP tent', label: 'Oberhof · tables' },
    { src: '../images/jobs/polster-catering/polster-oberhof-04.png', caption: 'Oberhof: set round tables and buffet line', alt: 'Oberhof: set round tables and buffet line', label: 'Oberhof · buffet' },
    { src: '../images/jobs/polster-catering/polster-oberhof-05.png', caption: 'Oberhof: buffet line before service', alt: 'Oberhof: buffet line before service', label: 'Oberhof · preparation' },
  ],
  'amfora': [
    { src: '../images/jobs/amfora-hotel/amfora-01.png', caption: 'Hotel Amfora Hvar: outdoor terrace with set tables and a view of the Adriatic', alt: 'Hotel Amfora Hvar: outdoor terrace with set tables and a view of the Adriatic', label: 'Terrace · sea view' },
    { src: '../images/jobs/amfora-hotel/amfora-02.png', caption: 'Hotel Amfora Hvar: pool and outdoor area', alt: 'Hotel Amfora Hvar: pool and outdoor area', label: 'Pool' },
    { src: '../images/jobs/amfora-hotel/amfora-03.png', caption: 'Hotel Amfora: pool area with sponsor parasols during the Ultra Europe season on Hvar', alt: 'Hotel Amfora: pool area with sponsor parasols during the Ultra Europe season on Hvar', label: 'Pool · festival week' },
    { src: '../images/jobs/amfora-hotel/amfora-04.png', caption: 'Hotel Amfora Hvar: the pool landscape from above – the pool-service working area', alt: 'Hotel Amfora Hvar: the pool landscape from above – the pool-service working area', label: 'Pool landscape' },
    { src: '../images/jobs/amfora-hotel/amfora-06.png', caption: 'Hotel Amfora: service area with drinks coolers and POS station', alt: 'Hotel Amfora: service area with drinks coolers and POS station', label: 'Service station' },
    { src: '../images/jobs/amfora-hotel/amfora-07.png', caption: 'Hotel Amfora: lounge with seating, ice-cream freezer and drinks coolers', alt: 'Hotel Amfora: lounge with seating, ice-cream freezer and drinks coolers', label: 'Lounge' },
  ],
};
