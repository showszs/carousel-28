function Carousel() {}

Carousel.prototype = {
  _initProps() {
    this.container = document.querySelector('#carousel')
    this.slides = this.container.querySelectorAll('.slide')
    this.indicatorsContainer = this.container.querySelector('#indicators-container')
    this.indicatorItems = this.container.querySelectorAll('.indicator')
    this.pauseBtn = this.container.querySelector('#pause-btn')
    this.prevBtn = this.container.querySelector('#prev-btn')
    this.nextBtn = this.container.querySelector('#next-btn')

    this.CODE_ARROW_LEFT = 'ArrowLeft'
    this.CODE_ARROW_RIGHT = 'ArrowRight'
    this.CODE_SPACE = 'Space'
    this.FA_PAUSE = '<i class="fas fa-pause-circle"></i>'
    this.FA_PLAY = '<i class="fas fa-play-circle"></i>'
    this.INTERVAL = 2000

    this.currentSlide = 0
    this.isPlaying = true
  },

  _gotoNth(n) {
    this.slides[this.currentSlide].classList.toggle('active')
    this.indicatorItems[this.currentSlide].classList.toggle('active')
    this.currentSlide = (n + this.slides.length) % this.slides.length
    this.slides[this.currentSlide].classList.toggle('active')
    this.indicatorItems[this.currentSlide].classList.toggle('active')
  },

  _gotoPrev() {
    this._gotoNth(this.currentSlide - 1)
  },

  _gotoNext() {
    this._gotoNth(this.currentSlide + 1)
  },

  _tick() {
    this.timerId = setInterval(() => this._gotoNext(), this.INTERVAL)
  },

  pause() {
    if (!this.isPlaying) return
    this.pauseBtn.innerHTML = this.FA_PLAY
    clearInterval(this.timerId)
    this.isPlaying = !this.isPlaying
  },

  play() {
    this.pauseBtn.innerHTML = this.FA_PAUSE
    this._tick()
    this.isPlaying = true
  },

  pausePlay() {
    this.isPlaying ? this.pause() : this.play()
  },

  prev() {
    this.pause()
    this._gotoPrev()
  },

  next() {
    this.pause()
    this._gotoNext()
  },

  _indicate(e) {
    const { target } = e
    if (target && target.classList.contains('indicator')) {
      this.pause()
      this._gotoNth(+target.dataset.slideTo)
    }
  },

  _press(e) {
    const { code } = e
    if (code === this.CODE_ARROW_LEFT) this.prev()
    if (code === this.CODE_ARROW_RIGHT) this.next()
    if (code === this.CODE_SPACE) {
      e.preventDefault()
      this.pausePlay()
    }
  },

  _initListeners() {
    this.pauseBtn.addEventListener('click', this.pausePlay.bind(this))
    this.nextBtn.addEventListener('click', this.next.bind(this))
    this.prevBtn.addEventListener('click', this.prev.bind(this))
    this.indicatorsContainer.addEventListener('click', this._indicate.bind(this))
    document.addEventListener('keydown', this._press.bind(this))
  },

  init() {
    this._initProps()
    this._initListeners()
    this._tick()
  }
}

Carousel.prototype.constructor = Carousel

function SwipeCarousel() {
  Carousel.apply(this, arguments)
}

SwipeCarousel.prototype = Object.create(Carousel.prototype)
SwipeCarousel.prototype.constructor = SwipeCarousel

SwipeCarousel.prototype._initListeners = function () {
  Carousel.prototype._initListeners.apply(this)
  this.container.addEventListener('touchstart', this.swipeStartHandler.bind(this))
  this.container.addEventListener('mousedown', this.swipeStartHandler.bind(this))
  this.container.addEventListener('touchend', this.swipeEndHandler.bind(this))
  this.container.addEventListener('mouseup', this.swipeEndHandler.bind(this))
}

SwipeCarousel.prototype.swipeStartHandler = function (e) {
  this.startPosX = e instanceof MouseEvent ? e.pageX : e.changedTouches[0].pageX
}

SwipeCarousel.prototype.swipeEndHandler = function (e) {
  this.endPosX = e instanceof MouseEvent ? e.pageX : e.changedTouches[0].pageX
  if (this.endPosX - this.startPosX > 100) this.prev()
  if (this.endPosX - this.startPosX < -100) this.next()
}

const carousel = new SwipeCarousel()

carousel.init()
