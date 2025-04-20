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

// 
/*===== serviceWorker - страница отсутствия подключения =====*/
// 
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
      navigator.serviceWorker.register('/assets/js/serviceWorker.js').then(registration => {
          console.log('Service Worker зарегистрирован:', registration);
      }).catch(error => {
          console.log('Ошибка регистрации Service Worker:', error);
      });
  });
}

console.log('%c ', ` padding-left: 136px; padding-bottom: 52px; background: url('/assets/images/favicon/android-icon-192x192.png') no-repeat; background-size: contain; background: url("data:image/svg+xml;charset=UTF-8,%3csvg width='136' height='52' viewBox='0 0 136 52' fill='none' xmlns='http://www.w3.org/2000/svg'%3e%3cpath d='M9.01209 31.6181C10.5815 31.8995 12.0022 31.9659 13.5136 33.262C16.647 35.9489 16.012 40.7841 21.0564 42.959C25.369 44.8184 29.1535 41.4773 30.4815 39.1024C33.0703 34.4727 35 27.7171 35 20.5408C35 13.64 32.8851 10.1551 28.6567 8.84481C24.4283 7.53452 15.8688 10.0781 8.62013 14.4477C2.83845 17.933 -0.0688938 21.5729 1.35994 26.3754C2.46205 30.0798 6.20771 31.1153 9.01209 31.6181Z' fill='url(%23paint0_linear_8090_4566)' /%3e%3cpath d='M9.01209 31.6181C10.5815 31.8995 12.0022 31.9659 13.5136 33.262C16.647 35.9489 16.012 40.7841 21.0564 42.959C25.369 44.8184 29.1535 41.4773 30.4815 39.1024C33.0703 34.4727 35 27.7171 35 20.5408C35 13.64 32.8851 10.1551 28.6567 8.84481C24.4283 7.53452 15.8688 10.0781 8.62013 14.4477C2.83845 17.933 -0.0688938 21.5729 1.35994 26.3754C2.46205 30.0798 6.20771 31.1153 9.01209 31.6181Z' fill='white' fill-opacity='0.2' /%3e%3cpath d='M55.7011 33.4773C55.853 33.9794 56.1654 34.4154 56.5888 34.7157C57.5047 35.2606 59.6164 34.8849 59.6164 34.8849V25.3493C59.6164 20.7011 55.6687 18.4596 51.9399 18.5051C49.9134 18.5298 47.4816 18.5381 45.9698 19.8384C45.3618 20.3668 44.7539 20.9612 45.2038 22.1707L45.8117 23.1325C47.0763 22.4101 49.7472 21.762 51.5549 21.8363C53.1274 21.9024 55.4215 22.8353 55.4215 24.8456C51.5346 23.1945 44 24.9695 44 29.7126C44 32.726 47.0682 35.2358 51.1698 35.2358C52.406 35.2358 54.7122 34.7322 55.7011 33.4773ZM47.9355 29.5846C47.9963 27.1986 53.4639 27.1697 55.4701 28.0779V30.5918C53.8975 32.243 47.8747 32.5072 47.9355 29.5846ZM63.9693 35.5C68.2007 33.1347 68.5533 30.435 68.7681 27.6403L69.0113 22.4266H74.6369V34.8932H78.8643V18.9756H67.5239C66.8162 18.9756 66.1374 19.2617 65.6366 19.771C65.1359 20.2802 64.854 20.9711 64.8529 21.6919L64.7962 27.2812C64.7556 28.5196 64.7151 29.7951 63.7788 31.1821C63.3106 31.8355 62.728 32.3953 62.0604 32.8333L63.0331 34.1749C63.5438 34.8808 63.9531 35.4835 63.9531 35.4835L63.9693 35.5ZM90.5168 18.5009C88.3006 18.4677 86.1615 19.3291 84.5667 20.8968C82.972 22.4646 82.0512 24.6114 82.0054 26.8684C81.9811 31.0005 85.2235 35.1987 90.5492 35.1987C92.8311 35.1987 96.0248 34.3731 97.9622 32.2719L96.649 30.8271C96.3734 30.5647 96.0213 30.401 95.6461 30.3608C95.2709 30.3206 94.893 30.406 94.5698 30.6042C91.7327 32.1027 86.6137 31.4298 86.2368 28.0325L98.7282 27.9416C98.785 27.2069 98.8093 27.0335 98.8093 26.534C98.8093 22.0758 95.0845 18.4803 90.5168 18.5092V18.5009ZM86.2368 25.2378C86.5772 23.1036 88.9118 22.1129 90.5492 22.1129C92.1866 22.1129 94.3347 23.0376 94.6752 25.2378H86.2368ZM131.773 18.9756V25.0975H125.053V18.9756H120.858V34.8932H125.053V28.7714H131.773V34.8932H136V18.9756H131.773ZM109.299 18.5051C107.272 18.5298 104.84 18.5381 103.328 19.8384C102.72 20.3668 102.113 20.9612 102.562 22.1707L103.166 23.1325C104.431 22.4101 107.106 21.762 108.909 21.8363C110.482 21.9024 112.78 22.8353 112.78 24.8456C108.893 23.1945 101.355 24.9695 101.355 29.7126C101.355 32.726 104.423 35.2358 108.524 35.2358C109.761 35.2358 112.067 34.7322 113.056 33.4773C113.208 33.9794 113.52 34.4154 113.943 34.7157C114.863 35.2606 116.975 34.8849 116.975 34.8849V25.3493C116.975 20.7011 113.027 18.4596 109.299 18.5051ZM112.808 30.5918C111.236 32.243 105.213 32.5072 105.274 29.5846C105.335 27.1986 110.802 27.1697 112.808 28.0779V30.5918Z' fill='%235B8FF5' /%3e%3cdefs%3e%3clinearGradient id='paint0_linear_8090_4566' x1='31.4282' y1='11.1206' x2='11.7195' y2='35.7823' gradientUnits='userSpaceOnUse'%3e%3cstop stop-color='%236CC8F1' /%3e%3cstop offset='0.297322' stop-color='%2378A6FF' /%3e%3cstop offset='0.438145' stop-color='%237E96FF' /%3e%3cstop offset='0.599049' stop-color='%23888BFF' /%3e%3cstop offset='0.697775' stop-color='%23978CFF' /%3e%3cstop offset='1' stop-color='%23B97BFF' /%3e%3c/linearGradient%3e%3c/defs%3e%3c/svg%3e ")  no-repeat; `);