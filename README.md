# Алеан Экстранет Лэндинг

Добро пожаловать в репозиторий лендинга экстранета компании Алеан. Этот проект направлен на предоставление удобного и интуитивно понятного интерфейса для наших клиентов и партнеров.

## Содержание

1. [Описание проекта](#описание-проекта)
2. [Установка](#установка)
3. [Использование](#использование)
4. [Обратить вниминие](#обратить-вниминие)
5. [Возможности](#возможности)

## Описание проекта

Лендинг экстранета предоставляет собой платформу, которая позволяет нашим клиентам и партнерам удобно взаимодействовать с нашими услугами. Это место, где можно быстро найти нужную информацию и получить доступ к функционалу, необходимому для успешного сотрудничества.

## Установка

1. Клонируйте репозиторий:

```
git clone https://github.com/Michael-Kz/extranet.git
```

2. Перейдите в директорию проекта:

   ```
   cd extranet
   ```

3. Настройте проект при развороте на сервере:

   3.1. Настроить `.htaccess`, если он необходим для работы в зависимости от конфигурации сервера.

   3.2. Проверьте установленные по умолчанию файлы `robots.txt` и `sitemap.xml` на корректность при установке. Эти файлы отвечают за индексацию в поисковой выдаче.

   3.3. Дополните микроразметку (о компании и услугах) в соответствии с актуальными данными.

   3.4. Ели ипользуется nginx - перенатройте его конфигурацию под сервер в строчках:

   ```
    # Базовые настройки
    charset utf-8;
    server_tokens off;
    root /path/to/your/root; # Укажите правильный путь
    
    # SSL настройки (должны быть настроены отдельно)
    ssl_certificate /path/to/cert.pem;
    ssl_certificate_key /path/to/key.pem;
   ```

## Структура проекта

- `assets/` — медиаконтент
- `index.html` — корневая страница
- `robots.txt` - управление индексацией файлов, страниц
- `sitemap.xml` - список страниц для поисковых систем
- `.system-pages/` - системные страницы 404, 403, 500, 502 и 503. Оффлайн страница

## Обратить вниминие

Заложено два вида конфигурационных файлов `.htaccess` и `nginx.conf` – выберите нужный, если выбран `nginx.conf` - смените домен в конфигураии

На данной стадии проект не закончен и требует ряд дополнений:

1. Запрошен контент:

   - 1. Отзывы
   - 2. Ответы на вопросы в блок FAQ
   - 3. Подготовить несколько промо-изображений для распространения в социальных сетях и мессенджерах, следующих размеров (Ширина x Высота):
     - 1200 x 630 пикселей;
     - 1200 x 1200 пикселей;
     - 900 x 600 пикселей;
     - 1200 x 900 пикселей.

2. Не установлены системы аналитики (метрика)

3. В модальном окне блока отзывов установлен базовы тег video, сам плее не настроен

   UPD 19.03.2025 - модальные окна закомментированы

## Возможности

В коде возможно создать несколько экземпляро слайдера, пример:

```
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
```

Первая цифра означает ширину блока, вторая время задержки слайдера

Всплывающие окна, также как и слайдер могут быть созданы в неограниченном количестве и рабтать незвисимодруг от друга:

```
document.getElementById('openModal1').addEventListener('click', function () {
  openModal('modal1')
})

// document.getElementById('openModal2').addEventListener('click', function() {
//   openModal('modal2');
// });
```

Кнопки:

```
       <a
         href="https://t.me/aleanhotels"
         class="questions__button button button--primary"
         target="_blank"
         rel="nofollow"
       >
         <img
           loading="lazy"
           src="./assets/images/icons/telegram.svg"
           alt=""
           class="button__icon animated slideFade"
         />
         <span class="button__text"> Перейти в Телеграм </span>
       </a>

```

В данном случае кнопка имеет три селектора позиции (questions\_\_button) объекта (button) и его модификации (button--primary), объект имеет базовую конфигурцию:

```
.button {
  --button-default-color: var(--primary-button-color, --primary-color);
  --button-color-text: var(--color-button-text, --secondary-color);
  --button-color-text-hover: var(--color-button-text-hover, --secondary-color);
  --button-color-text-disabled: var(
    --color-button-text-disabled,
    --secondary-color
  );
  ---button-hover-color: var(--color-button-hover, --primary-color);
  --button-pressed-color: var(--color-button-pressed, --primary-color);
  --button-disabled-color: var(--color-button-disabled, --primary-color);
  --button-focus-color: var(--color-button-focus, --primary-color);
  --button-border-radius: var(--border-radius-button, 16px);
  --button-font-size: var(--font-size-button, --font-size);
  display: flex;
  flex-wrap: nowrap;
  flex-direction: row;
  position: relative;
  font-family: 'Montserrat';
  border: none;
  cursor: pointer;
  transition: all 0.2s, transform 0.3s ease-in-out;
  border-radius: var(--border-radius-button);
  color: var(--button-color-text, --secondary-color);
  background: var(--button-default-color, --primary-color);
  align-items: center;
  justify-content: center;
}
```

Модификатор изменяет данную конфигурацию:

```

.button--primary {
  --primary-button-color: #2b6ef2;
  --color-button-text: var(--secondary-color);
  --color-button-text-hover: var(--secondary-color);
  --color-button-text-disabled: #c2c6d2;
  --color-button-hover: #5b8ff5;
  --color-button-pressed: var(--accent-color);
  --color-button-disabled: #f2f3f8;
  --color-button-focus: var(--accent-color);
  --border-radius-button: 16px;
}
```

CSS раздроблен на слои, так же в папке `assets/css/noPrefix` имеется css в оригинальном виде

```

                       lllllll
                       l:::::l
                       l:::::l
                       l:::::l
  aaaaaaaaaaaaa         l::::l          eeeeeeeeeeee           aaaaaaaaaaaaa        nnnn  nnnnnnnn
  a::::::::::::a        l::::l        ee::::::::::::ee         a::::::::::::a       n:::nn::::::::nn
  aaaaaaaaa:::::a       l::::l       e::::::eeeee:::::ee       aaaaaaaaa:::::a      n::::::::::::::nn
           a::::a       l::::l      e::::::e     e:::::e                a::::a      nn:::::::::::::::n
    aaaaaaa:::::a       l::::l      e:::::::eeeee::::::e         aaaaaaa:::::a        n:::::nnnn:::::n
  aa::::::::::::a       l::::l      e:::::::::::::::::e        aa::::::::::::a        n::::n    n::::n
 a::::aaaa::::::a       l::::l      e::::::eeeeeeeeeee        a::::aaaa::::::a        n::::n    n::::n
a::::a    a:::::a       l::::l      e:::::::e                a::::a    a:::::a        n::::n    n::::n
a::::a    a:::::a      l::::::l     e::::::::e               a::::a    a:::::a        n::::n    n::::n
a:::::aaaa::::::a      l::::::l      e::::::::eeeeeeee       a:::::aaaa::::::a        n::::n    n::::n
 a::::::::::aa:::a     l::::::l       ee:::::::::::::e        a::::::::::aa:::a       n::::n    n::::n
  aaaaaaaaaa  aaaa     llllllll         eeeeeeeeeeeeee         aaaaaaaaaa  aaaa       nnnnnn    nnnnnn


 222222222222222              000000000                222222222222222         555555555555555555
2:::::::::::::::22          00:::::::::00             2:::::::::::::::22       5::::::::::::::::5
2::::::222222:::::2       00:::::::::::::00           2::::::222222:::::2      5::::::::::::::::5
2222222     2:::::2      0:::::::000:::::::0          2222222     2:::::2      5:::::555555555555
            2:::::2      0::::::0   0::::::0                      2:::::2      5:::::5
            2:::::2      0:::::0     0:::::0                      2:::::2      5:::::5
         2222::::2       0:::::0     0:::::0                   2222::::2       5:::::5555555555
    22222::::::22        0:::::0 000 0:::::0              22222::::::22        5:::::::::::::::5
  22::::::::222          0:::::0 000 0:::::0            22::::::::222          555555555555:::::5
 2:::::22222             0:::::0     0:::::0           2:::::22222                         5:::::5
2:::::2                  0:::::0     0:::::0          2:::::2                              5:::::5
2:::::2                  0::::::0   0::::::0          2:::::2                  5555555     5:::::5
2:::::2       222222     0:::::::000:::::::0          2:::::2       222222     5::::::55555::::::5
2::::::2222222:::::2      00:::::::::::::00           2::::::2222222:::::2      55:::::::::::::55
2::::::::::::::::::2        00:::::::::00             2::::::::::::::::::2        55:::::::::55
22222222222222222222          000000000               22222222222222222222          555555555


```
