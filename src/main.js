import moment from 'moment';

import Filter from './filter';
import Task from './task';
import TaskEdit from './task-edit';
import './stat';
import cards, {filters, arrayColors} from './make-data';

window.addEventListener(`DOMContentLoaded`, function () {
  const nodeTaskBoard = document.querySelector(`.board__tasks`);

  renderTaskBoard(nodeTaskBoard, cards);
  renderFiltersBar(document.querySelector(`.main__filter`), filters, nodeTaskBoard);
});

/**
 * @description Удалить задачу
 * @param {Array} tasks Массив задач
 * @param {Number} index индекс Удаляемой задачи
 */
const removeTask = (tasks, index) => {
  tasks[index] = null;
};

const filterTasks = (tasks, filterId) => {
  switch (filterId) {
    case `overdue`:
      return tasks.filter((task) => task.dueDate < Date.now());
    case `today`:
      return tasks.filter((task) => {
        const a = moment(task.dueDate).isSame(Date.now(), `day`);

        return a;
      });
    case `repeating`:
      return tasks.filter((task) => [...Object.entries(task.repeatingDays)]
          .some((value) => value[1])
      );
    case `all`:
    default: return tasks;
  }
};

/**
 * @description Отрисовка доски задач
 * @param {Node} nodeTaskBoard DOM-элемент блока задач
 * @param {Array} [taskCards=[]] Массив объектов описания карточек
 */
function renderTaskBoard(nodeTaskBoard, taskCards = []) {
  const docFragmentCards = document.createDocumentFragment();

  // Собираем карточки
  taskCards.forEach(function (card, index) {
    const componentTask = new Task(index, card);
    const componentTaskEdit = new TaskEdit(index, card, arrayColors);

    componentTask.onEdit = () => {
      componentTaskEdit.render();
      nodeTaskBoard.replaceChild(componentTaskEdit.element, componentTask.element);
      componentTask.unrender();
    };

    componentTaskEdit.onSubmit = (newData) => {
      Object.assign(card, newData);

      componentTask.update(card);
      componentTask.render();
      nodeTaskBoard.replaceChild(componentTask.element, componentTaskEdit.element);
      componentTaskEdit.unrender();
    };

    componentTaskEdit.onDelete = () => {
      removeTask(cards, index);

      nodeTaskBoard.removeChild(componentTaskEdit.element);
      componentTaskEdit.unrender();
    };

    docFragmentCards.appendChild(
        componentTask.render()
    );
  });

  nodeTaskBoard.innerHTML = ``;
  nodeTaskBoard.appendChild(docFragmentCards);
}

/**
 * @description Отрисовка фильтров с навешиванием обработчика кликов по ним
 * @param {Node} nodeFiltersBar DOM-элемент блока фильтров
 * @param {Map} [taskFilters=new Map()] Map описания свойств фильтров
 * @param {Node} nodeTaskBoard DOM-элемент блока задач
 */
function renderFiltersBar(nodeFiltersBar, taskFilters = new Map(), nodeTaskBoard) {
  const docFragmentFilters = document.createDocumentFragment();

  // Собираем фильтры
  for (const [filterId, filter] of taskFilters.entries()) {
    const componentFilter = new Filter(filterId, filter);

    componentFilter.onFilter = () => {
      const filteredTasks = filterTasks(cards, filterId);

      renderTaskBoard(nodeTaskBoard, filteredTasks);
    };

    docFragmentFilters.appendChild(
        componentFilter.render()
    );
  }

  nodeFiltersBar.innerHTML = ``;
  nodeFiltersBar.appendChild(docFragmentFilters);
}
