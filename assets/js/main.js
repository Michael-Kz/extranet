'use strict'

//
/*===== Меню =====*/
//

const menu = document.querySelector('.menu__body')
const menuButton = document.querySelector('.menu__icon')
const body = document.body

if (menu && menuButton) {
  menuButton.addEventListener('click', e => {
    menu.classList.toggle('menu__body--active')
    menuButton.classList.toggle('menu__body--active')
    body.classList.toggle('lock')
  })

  // Закрытие при клике на область меню
  menu.addEventListener('click', e => {
    if (e.target.classList.contains('menu__body')) {
      menu.classList.remove('menu__body--active')
      menuButton.classList.remove('menu__body--active') // Исправлено
      body.classList.remove('lock')
    }
  })

  // Закрытие при клике на ссылки
  menu.querySelectorAll('.menu__link').forEach(link => {
    link.addEventListener('click', () => {
      menu.classList.remove('menu__body--active')
      menuButton.classList.remove('menu__body--active')
      body.classList.remove('lock')
    })
  })

  // Закрытие при клике вне меню
  document.addEventListener('click', e => {
    const isMenuClick = e.target.closest('.header')
    const isButtonClick = e.target.closest('.menu__icon')

    if (
      menu.classList.contains('menu__body--active') &&
      !isMenuClick &&
      !isButtonClick
    ) {
      menu.classList.remove('menu__body--active')
      menuButton.classList.remove('menu__body--active')
      body.classList.remove('lock')
    }
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
  const sections = sectionIds
    .map(id => document.getElementById(id))
    .filter(Boolean)
  const menuItems = document.querySelectorAll('.menu__link')
  let ticking = false

  function updateActiveMenu () {
    const offset = window.innerHeight * 0.3 // Динамический offset
    const scrollPosition = window.pageYOffset + offset

    let currentSection = sections.find(
      section =>
        section.offsetTop <= scrollPosition &&
        section.offsetTop + section.offsetHeight > scrollPosition
    )?.id

    menuItems.forEach(item => {
      const isActive = item.getAttribute('href') === `#${currentSection}`
      item.classList.toggle('menu__item--active', isActive)
    })

    ticking = false
  }

  window.addEventListener('scroll', () => {
    if (!ticking) {
      requestAnimationFrame(updateActiveMenu)
      ticking = true
    }
  })

  // Инициализация при загрузке
  updateActiveMenu()
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
const headerButton = document.querySelector('.header__button')
const menuList = document.querySelector('.menu__list')

function moveButton () {
  if (window.innerWidth <= 1280) {
    // Для мобильных разрешений
    if (!document.querySelector('.menu__item--button')) {
      const menuItem = document.createElement('li')
      menuItem.classList.add('menu__item', 'menu__item--button')

      // Сохраняем исходное положение кнопки
      if (!headerButton.originalParent) {
        headerButton.originalParent = headerButton.parentNode
        headerButton.originalNextSibling = headerButton.nextSibling
      }

      // Перемещаем кнопку в меню
      menuItem.appendChild(headerButton)
      menuList.appendChild(menuItem)
    }
  } else {
    // Для десктопных разрешений
    const menuItemButton = document.querySelector('.menu__item--button')
    if (menuItemButton) {
      // Возвращаем кнопку в исходное место
      if (headerButton.originalParent) {
        headerButton.originalParent.insertBefore(
          headerButton,
          headerButton.originalNextSibling
        )
      }
      // Удаляем пункт меню
      menuItemButton.remove()
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
    counterElement.textContent = current.toString().replace(/\B(?=(\d{3})+(?!\d))/g, ' ') // Исправлено здесь
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
/*===== Всплывающие окна =====*/
//

// function openModal (modalId) {
//   const modal = document.getElementById(modalId)
//   if (modal) {
//     modal.style.display = 'flex'
//     body.classList.add('lock')
//     header.classList.remove('header--visible')
//     header.classList.add('header--hidden')
//     setTimeout(() => {
//       modal.classList.add('modal--show')
//     }, 10)
//   }
// }

// function closeModal (modalId) {
//   const modal = document.getElementById(modalId)
//   if (modal) {
//     modal.classList.remove('modal--show')
//     setTimeout(() => {
//       modal.style.display = 'none'
//       body.classList.remove('lock')
//       header.classList.remove('header--hidden')
//       header.classList.add('header--visible')
//     }, 500)
//   }
// }

// document.getElementById('openModal1').addEventListener('click', function () {
//   openModal('modal1')
// })

// // document.getElementById('openModal2').addEventListener('click', function() {
// //   openModal('modal2');
// // });

// const closeButtons = document.querySelectorAll('.modal__button-close')
// closeButtons.forEach(button => {
//   button.addEventListener('click', function (event) {
//     const modal = event.target.closest('.modal')
//     if (modal) {
//       closeModal(modal.id)
//     }
//   })
// })

// window.addEventListener('click', function (event) {
//   if (event.target.classList.contains('modal')) {
//     closeModal(event.target.id)
//   }
// })
console.log(
  `%c
   ██████╗ ██╗  ██╗ ████████╗ ██████╗  ██████╗  ███╗   ██╗  ██████╗ ███ ████╗
  ██╔════╝ ╚██╗██╔╝ ╚══██╔══╝ ██╔══██╗ ██╔══██╗ ████╗  ██║ ██╔════╝ ╚══██╔══╝
  █████╗    ╚███╔╝     ██║    ██████╔╝ ███████║ ██╔██╗ ██║ █████╗      ██║   
  ██╔══╝    ██╔██╗     ██║    ██╔══██╗ ██╔══██║ ██║╚██╗██║ ██╔══╝      ██║   
  ║██████╗ ██╔╝ ██╗    ██║    ██║  ██║ ██║  ██║ ██║ ╚████║ ║██████╗    ██║   
  ╚══════╝ ╚═╝  ╚═╝    ╚═╝    ╚═╝  ╚═╝ ╚═╝  ╚═╝ ╚═╝  ╚═══╝ ╚══════╝    ╚═╝   
  `,
  "color: s#131316; font-family: monospace; line-height: 1.3;"
  );