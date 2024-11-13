class Carousel {
  constructor(params) {
    const settings = this._initConfig(params)

    this.container = document.querySelector(settings.containerId)
    this.slideItems = this.container.querySelectorAll(settings.slideId)
    this.INTERVAL = settings.interval
    this.isPlaying = settings.isPlaying
  }

  _initConfig(o) {
    const p = {
      containerId: '#carousel',
      slideId: '.slide',
      interval: 5000,
      isPlaying: true
    }

    return { ...p, ...o }
  }

  _initProps() {
    this.currentSlide = 0
    this.SLIDES_COUNT = this.slideItems.length
    this.CODE_ARROW_LEFT = 'ArrowLeft'
    this.CODE_ARROW_RIGHT = 'ArrowRight'
    this.CODE_SPACE = 'Space'
    this.FA_PAUSE = '<i class="fas fa-pause-circle"></i>'
    this.FA_PLAY = '<i class="fas fa-play-circle"></i>'
    this.FA_PREV = '<i class="fa fa-angle-left"></i>'
    this.FA_NEXT = '<i class="fa fa-angle-right"></i>'
  }

  _initControls() {
    const controls = document.createElement('div')
    const PAUSE = `<div id="pause-btn" class="control control-pause">
        ${this.isPlaying ? this.FA_PAUSE : this.FA_PLAY}
      </div>`
    const PREV = `<div id="prev-btn" class="control control-prev">
        ${this.FA_PREV}
      </div>`
    const NEXT = `<div id="next-btn" class="control control-next">
        ${this.FA_NEXT}
      </div>`

    controls.innerHTML = PAUSE + PREV + NEXT
    controls.setAttribute('id', 'controls-container')
    controls.setAttribute('class', 'controls')

    this.container.append(controls)

    this.pauseBtn = this.container.querySelector('#pause-btn')
    this.prevBtn = this.container.querySelector('#prev-btn')
    this.nextBtn = this.container.querySelector('#next-btn')
  }

  _initIndicators() {
    const indicators = document.createElement('div')

    indicators.setAttribute('id', 'indicators-container')
    indicators.setAttribute('class', 'indicators')

    for (let i = 0; i < this.SLIDES_COUNT; i++) {
      const indicator = document.createElement('div')
      indicator.setAttribute('class', i ? 'indicator' : 'indicator active')
      indicator.dataset.slideTo = `${i}`
      indicators.append(indicator)
    }

    this.container.append(indicators)

    this.indicatorsContainer = this.container.querySelector('#indicators-container')
    this.indicatorItems = this.container.querySelectorAll('.indicator')
  }

  _initListeners() {
    this.pauseBtn.addEventListener('click', this.pausePlay.bind(this))
    this.nextBtn.addEventListener('click', this.next.bind(this))
    this.prevBtn.addEventListener('click', this.prev.bind(this))
    this.indicatorsContainer.addEventListener('click', this._indicate.bind(this))
    document.addEventListener('keydown', this._pressKey.bind(this))
    this.container.addEventListener('mouseenter', this.pause.bind(this))
    this.container.addEventListener('mouseleave', this.play.bind(this))
  }

  _gotoNth(n) {
    this.slideItems[this.currentSlide].classList.toggle('active')
    this.indicatorItems[this.currentSlide].classList.toggle('active')
    this.currentSlide = (n + this.SLIDES_COUNT) % this.SLIDES_COUNT
    this.slideItems[this.currentSlide].classList.toggle('active')
    this.indicatorItems[this.currentSlide].classList.toggle('active')
  }

  _gotoPrev() {
    this._gotoNth(this.currentSlide - 1)
  }

  _gotoNext() {
    this._gotoNth(this.currentSlide + 1)
  }

  _tick() {
    if (!this.isPlaying) return
    if (this.timerId) return
    this.timerId = setInterval(() => this._gotoNext(), this.INTERVAL)
  }

  _indicate(e) {
    const { target } = e
    if (target && target.classList.contains('indicator')) {
      this.pause()
      this._gotoNth(+target.dataset.slideTo)
    }
  }

  _pressKey(e) {
    const { code } = e
    if (code === this.CODE_ARROW_LEFT) this.prev()
    if (code === this.CODE_ARROW_RIGHT) this.next()
    if (code === this.CODE_SPACE) {
      e.preventDefault()
      this.pausePlay()
    }
  }

  pause() {
    if (!this.isPlaying) return
    this.pauseBtn.innerHTML = this.FA_PLAY
    clearInterval(this.timerId)
    this.isPlaying = false
    clearInterval(this.timerId)
    this.timerId = null
  }

  play() {
    if (this.isPlaying) return
    this.pauseBtn.innerHTML = this.FA_PAUSE
    this.isPlaying = true
    this._tick()
  }

  pausePlay() {
    this.isPlaying ? this.pause() : this.play()
  }

  prev() {
    this.pause()
    this._gotoPrev()
  }

  next() {
    this.pause()
    this._gotoNext()
  }

  init() {
    this._initProps()
    this._initControls()
    this._initIndicators()
    this._initListeners()
    this._tick()
  }
}

export default Carousel
