import makeFilterTemplate from './make-filter';
import Task from './make-task';
import generateCardData, {arrayColors} from './make-data';

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
        new Task(index, card, arrayColors).render()
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
