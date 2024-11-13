import SwipeCarousel from './swipe-carousel.js'

const carousel = new SwipeCarousel({
  containerId: '#carousel',
  slideId: '.slide',
  interval: 2000
  // isPlaying: false,
})
carousel.init()
