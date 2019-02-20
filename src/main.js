'use strict';

window.addEventListener(`DOMContentLoaded`, function () {
  const taskFilters = {
    all: {
      caption: `All`, count: 42, checked: true
    },
    overdue: {
      caption: `Overdue`, count: 11
    },
    today: {
      caption: `Today`, count: 76
    },
    favorites: {
      caption: `Favorites`, count: 47
    },
    repeating: {
      caption: `Repeating`, count: 152
    },
    tags: {
      caption: `Tags`, count: 279
    },
    archive: {
      caption: `Archive`, count: 100030
    }
  };
  const cards = [
    {
      text: `Test card template 1`
    },
    {
      text: `Test card template 2`
    },
    {
      text: `Test card template 3`
    },
    {
      text: `Test card template 4`
    },
    {
      text: `Test card template 5`
    },
    {
      text: `Test card template 6`
    },
    {
      text: `Test card template 7`
    }
  ];

  renderTaskBoard(document.querySelector(`.board__tasks`), cards);
  renderFiltersBar(document.querySelector(`.main__filter`), taskFilters);
});

/**
 * @description Отрисовка фильтров с навешиванием обработчика кликов по ним
 * @author Paul "Bargamut" Petrov
 * @date 2019-02-21
 * @param {Node} $filtersBar DOM-элемент блока фильтров
 * @param {Object} [taskFilters={}] Объект описания свойств фильтров
 */
function renderFiltersBar($filtersBar, taskFilters = {}) {
  const $docFragmentFilters = document.createDocumentFragment();

  // Собираем фильтры
  for (const key in taskFilters) {
    if (!taskFilters.hasOwnProperty(key)) {
      continue;
    }

    $docFragmentFilters.appendChild(
        makeFilterTemplate(key, taskFilters[key]).content.cloneNode(true)
    );
  }

  $filtersBar.innerHTML = ``;
  $filtersBar.appendChild($docFragmentFilters);
  $filtersBar.addEventListener(`click`, onFilterClick);
}

/**
 * @description Отрисовка доски задач
 * @author Paul "Bargamut" Petrov
 * @date 2019-02-21
 * @param {Node} $taskBoard DOM-элемент блока задач
 * @param {Array} [cards=[]] Массив объектов описания карточек
 */
function renderTaskBoard($taskBoard, cards = []) {
  const $docFragmentCards = document.createDocumentFragment();

  // Собираем карточки
  cards.forEach(function (card, index) {
    $docFragmentCards.appendChild(
        makeCardTemplate(index, card).content.cloneNode(true)
    );
  });

  $taskBoard.innerHTML = ``;
  $taskBoard.appendChild($docFragmentCards);
}

/**
 * @description Создание шаблона фильтра
 * @author Paul "Bargamut" Petrov
 * @date 2019-02-21
 * @param {Number} id ID фильтра
 * @param {Object} objFilter Объект описания фильтра
 * @return {Node} DOM-элемент <template> фильтра
 */
function makeFilterTemplate(id, objFilter) {
  const $tplFilter = document.createElement(`template`);

  $tplFilter.innerHTML =
    `<input
      type="radio"
      id="${id}"
      class="filter__input visually-hidden"
      name="filter"
      ${objFilter.checked ? `checked` : ``}
    />
    <label for="${id}" class="filter__label">
      ${objFilter.caption} <span class="${id}-count">${objFilter.count}</span>
    </label>`;

  return $tplFilter;
}

/**
 * @description Создание шаблона карточки задачи
 * @author Paul "Bargamut" Petrov
 * @date 2019-02-21
 * @param {Number} index Индексный номер задачи
 * @param {Object} card Объект описания карточки задачи
 * @return {Node} DOM-элемент <template> фильтра
 */
function makeCardTemplate(index, card) {
  const defaultCard = {
    text: `Test card template`,
    color: `black`,
    img: ``,
    isDeadlineEnabled: false,
    deadlineDate: ``,
    deadlineTime: ``,
    isRepeatEnabled: false,
    repeatDays: [],
    hashtags: []
  };
  const days = [
    `mo`, `tu`, `we`, `th`, `fr`, `sa`, `su`
  ];
  const colors = [
    `black`, `yellow`, `blue`, `green`, `pink`
  ];
  const $tplCard = document.createElement(`template`);

  card = Object.assign({}, defaultCard, card);

  $tplCard.innerHTML =
    `<article class="card card--${card.color}">
      <form class="card__form" method="get">
        <div class="card__inner">
          <div class="card__control">
            <button type="button" class="card__btn card__btn--edit">edit</button>
            <button type="button" class="card__btn card__btn--archive">archive</button>
            <button type="button" class="card__btn card__btn--favorites card__btn--disabled">favorites</button>
          </div>

          <div class="card__color-bar">
            <svg width="100%" height="10">
              <use xlink:href="#wave"></use>
            </svg>
          </div>

          <div class="card__textarea-wrap">
            <label>
              <textarea
                class="card__text"
                placeholder="Start typing your text here..."
                name="text"
              >${card.text}</textarea>
            </label>
          </div>

          <div class="card__settings">
            <div class="card__details">
              <div class="card__dates">
                <button class="card__date-deadline-toggle" type="button">
                  date: <span class="card__date-status">${card.isDeadlineEnabled ? `yes` : `no`}</span>
                </button>

                <fieldset class="card__date-deadline" ${card.isDeadlineEnabled ? `` : `disabled`}>
                  <label class="card__input-deadline-wrap">
                    <input
                      class="card__date"
                      type="text"
                      placeholder="23 September"
                      name="date"
                      value="${card.deadlineDate}"
                    />
                  </label>
                  <label class="card__input-deadline-wrap">
                    <input
                      class="card__time"
                      type="text"
                      placeholder="11:15 PM"
                      name="time"
                      value="${card.deadlineTime}"
                    />
                  </label>
                </fieldset>

                <button class="card__repeat-toggle" type="button">
                  repeat:<span class="card__repeat-status">${card.isRepeatEnabled ? `yes` : `no`}</span>
                </button>

                <fieldset class="card__repeat-days" ${card.isRepeatEnabled ? `` : `disabled`}>
                  <div class="card__repeat-days-inner"></div>
                </fieldset>
              </div>

              <div class="card__hashtag">
                <div class="card__hashtag-list"></div>

                <label>
                  <input
                    type="text"
                    class="card__hashtag-input"
                    name="hashtag-input"
                    placeholder="Type new hashtag here"
                  />
                </label>
              </div>
            </div>

            <label class="card__img-wrap card__img-wrap--empty">
              <input
                type="file"
                class="card__img-input visually-hidden"
                name="img"
              />
              <img
                src="${card.img}"
                alt="task picture"
                class="card__img"
              />
            </label>

            <div class="card__colors-inner">
              <h3 class="card__colors-title">Color</h3>

              <div class="card__colors-wrap"></div>
            </div>
          </div>

          <div class="card__status-btns">
            <button class="card__save" type="submit">save</button>
            <button class="card__delete" type="button">delete</button>
          </div>
        </div>
      </form>
    </article>`;


  $tplCard.content.querySelector(`.card__repeat-days-inner`).appendChild(
      makeRepeatDaysTemplate(days, index, card).content.cloneNode(true)
  );

  $tplCard.content.querySelector(`.card__colors-wrap`).appendChild(
      makeColorsTemplate(colors, index, card).content.cloneNode(true)
  );

  return $tplCard;
}

/**
 * @description Создание набора элементов дней повтора
 * @author Paul "Bargamut" Petrov
 * @date 2019-02-21
 * @param {Array} days Массив дней
 * @param {Number} index Индексный номер карточки
 * @param {Object} card Объект описания карточки
 * @return {Node} DOM-элемент <template> набора элементов
 */
function makeRepeatDaysTemplate(days, index, card) {
  const $tplRepeatDays = document.createElement(`template`);

  for (const day of days) {
    $tplRepeatDays.innerHTML +=
      `<input
        class="visually-hidden card__repeat-day-input"
        type="checkbox"
        id="repeat-${day}-${index}"
        name="repeat"
        value="${day}"
        ${(card.repeatDays.indexOf(day) > -1) ? `checked` : ``}
      />
      <label class="card__repeat-day" for="repeat-${day}-${index}">${day}</label>`;
  }

  return $tplRepeatDays;
}

/**
 * @description Создание набора элементов цветов карточки
 * @author Paul "Bargamut" Petrov
 * @date 2019-02-21
 * @param {Array} colors Массив цветов
 * @param {Number} index Индексный номер карточки
 * @param {Object} card Объект описания карточки
 * @return {Node} DOM-элемент <template> набора цветов
 */
function makeColorsTemplate(colors, index, card) {
  const $tplColors = document.createElement(`template`);

  for (const color of colors) {
    $tplColors.innerHTML +=
      `<input
        type="radio"
        id="color-${color}-${index}"
        class="card__color-input card__color-input--${color} visually-hidden"
        name="color"
        value="${color}"
        ${(card.color === color) ? `checked` : ``}
      />
      <label for="color-${color}-${index}" class="card__color card__color--${color}">
        ${color}
      </label>`;
  }

  return $tplColors;
}

/**
 * @description Обработчик клика по фильтру
 * @author Paul "Bargamut" Petrov
 * @date 2019-02-21
 * @param {Event} evt Объект события
 */
function onFilterClick(evt) {
  const $target = evt.target;
  const randomNumTasks = Math.floor(Math.random() * (20 - 1)) + 1;
  const randomCards = [];

  if (!$target.classList.contains(`filter__label`)) {
    return;
  }

  for (let i = 0; ++i <= randomNumTasks;) {
    randomCards.push({
      text: `Random card ${i}`
    });
  }

  renderTaskBoard(document.querySelector(`.board__tasks`), randomCards);
}
