'use strict';

//
/*===== Меню =====*/
//

const menu = document.querySelector('.menu__body')
const menuBtn = document.querySelector('.menu__icon')

const body = document.body

if (menu && menuBtn) {
  menuBtn.addEventListener('click', e => {
    menu.classList.toggle('menu__body--active')
    menuBtn.classList.toggle('menu__body--active')
    body.classList.toggle('lock')
  })

  menu.addEventListener('click', e => {
    if (e.target.classList.contains('menu__body')) {
      menu.classList.remove('menu__body--active')
      menuBtn.classList.remove('menu__body-active')
      body.classList.remove('lock')
    }
  })

  menu.querySelectorAll('.menu__link').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('menu__body--active')
      menuBtn.classList.remove('menu__body--active')
      body.classList.remove('lock')
    })
  })
}

//
/*===== Скроллинг к якорям =====*/
//

const anchors = document.querySelectorAll('a[href*="#"]')

anchors.forEach(anchor => {
  anchor.addEventListener('click', event => {
    event.preventDefault()

    const targetId = anchor.getAttribute('href').substring(1)
    const targetElement = document.getElementById(targetId)

    const yOffset = -75
    const yPosition =
      targetElement.getBoundingClientRect().top + window.pageYOffset + yOffset

    window.scrollTo({
      top: yPosition,
      behavior: 'smooth'
    })
  })
})

//
/*===== Свайп пунктов меню при скролле =====*/
//

document.addEventListener('DOMContentLoaded', function () {
  const sectionIds = [
    'partners',
    'advantages',
    'types-legal-entities',
    'reviews',
    'questions'
  ]
  const sections = sectionIds.map(id => document.getElementById(id))
  const menuItems = document.querySelectorAll('.menu__link')

  window.addEventListener('scroll', () => {
    let currentSection = ''
    const offset = 100

    sections.forEach(section => {
      const sectionTop = section.offsetTop
      if (pageYOffset >= sectionTop - offset) {
        currentSection = section.getAttribute('id')
      }
    })

    menuItems.forEach(item => {
      item.classList.remove('menu__item--active')
      if (item.getAttribute('href').substring(1) === currentSection) {
        item.classList.add('menu__item--active')
      }
    })
  })
})

//
/*===== Видимость шапки при скролле (показываем только при прокрутке вверх) =====*/
//

let lastScrollTop = 0
const header = document.getElementById('header')

window.addEventListener('scroll', function () {
  let scrollTop = window.pageYOffset || document.documentElement.scrollTop

  if (scrollTop === 0) {
    header.classList.remove('header--hidden', 'header--visible')
    return
  }

  const isSearchActive = header.classList.contains('header--active-search')
  const isMenuActive = header.classList.contains('header--active-menu-advanced')

  if (!isSearchActive && !isMenuActive) {
    if (scrollTop > lastScrollTop) {
      header.classList.remove('header--visible')
      header.classList.add('header--hidden')
    } else {
      header.classList.remove('header--hidden')
      header.classList.add('header--visible')
    }
  }

  lastScrollTop = scrollTop <= 0 ? 0 : scrollTop
})

//
/*===== Ротация элемента захвата =====*/
//

const button = document.querySelector('.header__button')
const menuList = document.querySelector('.menu__list')

function moveButton () {
  if (window.innerWidth <= 1280) {
    if (!document.querySelector('.menu__item--button')) {
      const menuItem = document.createElement('li')
      menuItem.classList.add('menu__item', 'menu__item--button')
      menuItem.appendChild(button.cloneNode(true))
      menuList.appendChild(menuItem)
      button.style.display = 'none'
    }
  } else {
    const menuItemButton = document.querySelector('.menu__item--button')
    if (menuItemButton) {
      menuItemButton.remove()
      button.style.display = 'flex'
    }
  }
}

window.addEventListener('resize', moveButton)
document.addEventListener('DOMContentLoaded', moveButton)

//
/*===== Счетчик =====*/
//

let count = 50000
let current = 1
let increment = Math.ceil(count / 111)
let counterElement = document.getElementById('counter')

function updateCounter () {
  if (current < count) {
    current += increment
    if (current > count) current = count
    counterElement.textContent = current.toLocaleString()
    requestAnimationFrame(updateCounter)
  }
}

function onIntersection (entries) {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      updateCounter()
      observer.disconnect()
    }
  })
}

let observer = new IntersectionObserver(onIntersection)

observer.observe(counterElement)

//
/*===== UTM-метки и переадресация =====*/
//

document.addEventListener('DOMContentLoaded', function () {
  const choiceTariffSumbit = document.querySelector('.choice-tariff__button')

  // Установить первую радиокнопку как выбранную по умолчанию, если ни одна не выбрана
  const defaultRadio = document.querySelector(
    'input[name="options"]:first-of-type'
  )
  if (defaultRadio) {
    defaultRadio.checked = true
  }

  choiceTariffSumbit.addEventListener('click', function () {
    const selectedValue = document.querySelector(
      'input[name="options"]:checked'
    )
    if (selectedValue) {
      const value = selectedValue.value
      const baseUrl = 'https://extranet.alean.ru/'
      const fullUrl = `${baseUrl}?option=${encodeURIComponent(value)}`
      window.open(fullUrl, '_blank')
    }
  })
})

//
/*===== Блок FAQ =====*/
//

class FaqBlock {
  constructor (target, config) {
    this._el =
      typeof target === 'string' ? document.querySelector(target) : target
    const defaultConfig = {
      alwaysOpen: true,
      duration: 350
    }
    this._config = { ...defaultConfig, ...config }

    this._el.querySelectorAll('.accordion__body').forEach(element => {
      element.style.transition = `max-height ${this._config.duration}ms ease-out`
    })

    this._handleDocumentClick = this._handleDocumentClick.bind(this)
    document.addEventListener('click', this._handleDocumentClick)

    this.addEventListener()
  }

  addEventListener () {
    this._el.addEventListener('click', e => {
      const elHeader = e.target.closest('.accordion__header')
      if (!elHeader) {
        return
      }
      if (!this._config.alwaysOpen) {
        const elOpenItem = this._el.querySelector('.accordion__item_show')
        if (elOpenItem && elOpenItem !== elHeader.parentElement) {
          this.toggle(elOpenItem)
        }
      }
      this.toggle(elHeader.parentElement)
      e.stopPropagation()
    })
  }

  _handleDocumentClick (e) {
    if (!this._el.contains(e.target)) {
      // Если клик был произведен вне аккордеона (экс-но)
      this._el.querySelectorAll('.accordion__item_show').forEach(openItem => {
        this.toggle(openItem)
      })
    }
  }

  toggle (el) {
    el.classList.toggle('accordion__item_show')
    const accordionBody = el.querySelector('.accordion__body')
    if (accordionBody.style.maxHeight) {
      accordionBody.style.maxHeight = null
    } else {
      accordionBody.style.maxHeight = `${accordionBody.scrollHeight}px`
    }
  }
}

new FaqBlock('.accordion', {
  alwaysOpen: false
})

//
/*===== Слайдер =====*/
//

class Slider {
  constructor (
    wrapperSelector,
    itemSelector,
    prevBtnSelector,
    nextBtnSelector,
    itemWidth = 244,
    intervalTime = 5500
  ) {
    this.sliderWrapper = document.querySelector(wrapperSelector)
    this.sliderItems = document.querySelectorAll(itemSelector)
    this.prevBtn = document.querySelector(prevBtnSelector)
    this.nextBtn = document.querySelector(nextBtnSelector)

    this.currentIndex = 0
    this.itemWidth = itemWidth
    this.intervalTime = intervalTime
    this.sliderItems.forEach((item, index) => {
      if (index < 5) {
        const clone = item.cloneNode(true)
        this.sliderWrapper.appendChild(clone)
      }
    })

    this.updateActiveClass()
    this.addEventListeners()
    this.startAutoScroll()
  }

  updateSliderPosition (animate = true) {
    this.sliderWrapper.style.transition = animate
      ? 'transform 0.5s ease-in'
      : 'transform 0.3s ease-in'
    this.sliderWrapper.style.transform = `translateX(-${
      this.currentIndex * this.itemWidth
    }px)`
  }

  updateActiveClass () {
    this.sliderItems.forEach((item, index) => {
      if (index === this.currentIndex % this.sliderItems.length) {
        item.classList.add('slider-item--active')
      } else {
        item.classList.remove('slider-item--active')
      }
    })
  }

  addEventListeners () {
    this.prevBtn.addEventListener('click', () => this.moveToPrevious())
    this.nextBtn.addEventListener('click', () => this.moveToNext())
    this.sliderWrapper.addEventListener('mouseenter', () =>
      this.stopAutoScroll()
    )
    this.sliderWrapper.addEventListener('mouseleave', () =>
      this.startAutoScroll()
    )
  }

  moveToPrevious () {
    this.currentIndex--
    if (this.currentIndex < 0) {
      this.sliderWrapper.style.transition = 'none'
      this.currentIndex = this.sliderItems.length - 1
      this.updateSliderPosition(false)
      setTimeout(() => {
        this.sliderWrapper.style.transition = ''
        this.updateSliderPosition()
      }, 50)
    } else {
      this.updateSliderPosition()
    }
    this.updateActiveClass()
  }

  moveToNext () {
    this.currentIndex++
    if (this.currentIndex >= this.sliderItems.length) {
      // Исправлено условие
      this.sliderWrapper.style.transition = 'none'
      this.currentIndex = 0
      this.updateSliderPosition(false)
      setTimeout(() => {
        this.sliderWrapper.style.transition = ''
        this.updateSliderPosition()
      }, 50)
    } else {
      this.updateSliderPosition()
    }
    this.updateActiveClass()
  }

  startAutoScroll () {
    this.autoScroll = setInterval(() => this.moveToNext(), this.intervalTime)
  }

  stopAutoScroll () {
    clearInterval(this.autoScroll)
  }
}

new Slider(
  '.placement-options__slider-wrapper',
  '.placement-options__slider-item',
  '.slider__button--previous',
  '.slider__button--next'
)
new Slider(
  '.reviews__wrapper',
  '.reviews__slide',
  '.reviews__button--previous',
  '.reviews__button--next',
  400,
  5500
)

//
/*===== Всплывающие окна =====*/
//

function openModal (modalId) {
  const modal = document.getElementById(modalId)
  if (modal) {
    modal.style.display = 'flex'
    body.classList.add('lock')
    header.classList.remove('header--visible')
    header.classList.add('header--hidden')
    setTimeout(() => {
      modal.classList.add('modal--show')
    }, 10)
  }
}

function closeModal (modalId) {
  const modal = document.getElementById(modalId)
  if (modal) {
    modal.classList.remove('modal--show')
    setTimeout(() => {
      modal.style.display = 'none'
      body.classList.remove('lock')
      header.classList.remove('header--hidden')
      header.classList.add('header--visible')
    }, 500)
  }
}

document.getElementById('openModal1').addEventListener('click', function () {
  openModal('modal1')
})

// document.getElementById('openModal2').addEventListener('click', function() {
//   openModal('modal2');
// });

const closeButtons = document.querySelectorAll('.modal__button-close')
closeButtons.forEach(button => {
  button.addEventListener('click', function (event) {
    const modal = event.target.closest('.modal')
    if (modal) {
      closeModal(modal.id)
    }
  })
})

window.addEventListener('click', function (event) {
  if (event.target.classList.contains('modal')) {
    closeModal(event.target.id)
  }
})
