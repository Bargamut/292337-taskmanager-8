import makeFilterTemplate from './make-filter';
import makeCardTemplate from './make-task';

const WEEK_MILLISECONDS = 604800000;
const arrayTitles = [
  `Изучить теорию`,
  `Сделать домашку`,
  `Пройти интенсив на соточку`
];
const arrayColors = [`black`, `yellow`, `blue`, `green`, `pink`];
const arrayTags = [`homework`, `theory`, `practice`, `intensive`, `keks`, `bargamut`, `awesome`, `tibet`];

const filters = {
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

const cards = [];

window.addEventListener(`DOMContentLoaded`, function () {
  const nodeFiltersBar = document.querySelector(`.main__filter`);

  while (cards.length < 7) {
    cards.push(generateCardData());
  }

  renderTaskBoard(document.querySelector(`.board__tasks`), cards);
  renderFiltersBar(nodeFiltersBar, filters);
});

/**
 * @description Отрисовка доски задач
 * @author Paul "Bargamut" Petrov
 * @date 2019-02-21
 * @param {Node} nodeTaskBoard DOM-элемент блока задач
 * @param {Array} [taskCards=[]] Массив объектов описания карточек
 */
function renderTaskBoard(nodeTaskBoard, taskCards = []) {
  const docFragmentCards = document.createDocumentFragment();

  // Собираем карточки
  taskCards.forEach(function (card, index) {
    docFragmentCards.appendChild(
        makeCardTemplate(index, card, arrayColors).content.cloneNode(true)
    );
  });

  nodeTaskBoard.innerHTML = ``;
  nodeTaskBoard.appendChild(docFragmentCards);
}

/**
 * @description Отрисовка фильтров с навешиванием обработчика кликов по ним
 * @author Paul "Bargamut" Petrov
 * @date 2019-02-21
 * @param {Node} nodeFiltersBar DOM-элемент блока фильтров
 * @param {Object} [taskFilters={}] Объект описания свойств фильтров
 */
function renderFiltersBar(nodeFiltersBar, taskFilters = {}) {
  const docFragmentFilters = document.createDocumentFragment();

  // Собираем фильтры
  for (const key in taskFilters) {
    if (!taskFilters.hasOwnProperty(key)) {
      continue;
    }

    docFragmentFilters.appendChild(
        makeFilterTemplate(key, taskFilters[key]).content.cloneNode(true)
    );
  }

  nodeFiltersBar.innerHTML = ``;
  nodeFiltersBar.appendChild(docFragmentFilters);
  nodeFiltersBar.addEventListener(`click`, onFilterClick);
}

/**
 * @description Обработчик клика по фильтру
 * @author Paul "Bargamut" Petrov
 * @date 2019-02-21
 * @param {Event} evt Объект события
 */
function onFilterClick(evt) {
  const nodeTarget = evt.target;
  const randomNumTasks = Math.floor(Math.random() * (20 - 1)) + 1;
  const randomCards = [];

  if (!nodeTarget.classList.contains(`filter__label`)) {
    return;
  }

  while (randomCards.length <= randomNumTasks) {
    randomCards.push(generateCardData());
  }

  renderTaskBoard(document.querySelector(`.board__tasks`), randomCards);
}

const generateCardData = () => (
  {
    title: arrayTitles[getRandomInt(3)],
    dueDate: Date.now() + getRandomInt(WEEK_MILLISECONDS, -WEEK_MILLISECONDS),
    picture: `https://picsum.photos/100/100?r=${Math.random()}`,
    color: arrayColors[getRandomInt(arrayColors.length)],
    repeatingDays: {
      mo: Math.random() > 0.5,
      tu: Math.random() > 0.5,
      we: Math.random() > 0.5,
      th: Math.random() > 0.5,
      fr: Math.random() > 0.5,
      sa: Math.random() > 0.5,
      su: Math.random() > 0.5
    },
    isFavorite: Math.random() > 0.5,
    isDone: Math.random() > 0.5,
    tags: new Set([
      arrayTags[getRandomInt(arrayTags.length)],
      arrayTags[getRandomInt(arrayTags.length)],
      arrayTags[getRandomInt(arrayTags.length)]
    ])
  }
);

const getRandomInt = (max, min = 0) => Math.floor(Math.random() * (max - min)) + min;
