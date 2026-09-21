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
