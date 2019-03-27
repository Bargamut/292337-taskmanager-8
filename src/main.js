import moment from 'moment';

import Filter from './filter';
import Task from './task';
import TaskEdit from './task-edit';
import './stat';
import {filters, arrayColors} from './make-data';
import API from './api';

let currentCards = [];
const AUTHORIZATION = `Basic JKgkgKLkGKg97s&S97SGkhKkhgSkf=`;
const END_POINT = `https://es8-demo-srv.appspot.com/task-manager/`;

const api = new API({
  endPoint: END_POINT,
  authorization: AUTHORIZATION
});

window.addEventListener(`DOMContentLoaded`, () => {
  api.get()
    .then((tasks) => {
      currentCards = tasks;
      renderTaskBoard(tasks);
    });

  renderFiltersBar(filters);
});

/**
 * @description Фильтрация списка задач
 * @param {Array} tasks Массив задач
 * @param {String} filterId ID фильтра
 * @return {Array} Отфильтрованный массив списка
 */
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
 * @param {Array} [taskCards=[]] Массив объектов описания карточек
 */
const renderTaskBoard = (taskCards = []) => {
  const nodeTaskBoard = document.querySelector(`.board__tasks`);
  const docFragmentCards = document.createDocumentFragment();

  // Собираем карточки
  taskCards.forEach(function (card) {
    const componentTask = new Task(card);
    const componentTaskEdit = new TaskEdit(card, arrayColors);

    componentTask.onEdit = () => {
      componentTaskEdit.render();
      nodeTaskBoard.replaceChild(componentTaskEdit.element, componentTask.element);
      componentTask.unrender();
    };

    componentTaskEdit.onSubmit = (newData) => {
      componentTaskEdit.block();

      Object.assign(card, newData);

      api.update({
        id: card.id,
        data: card.toRAW()
      })
        .then((newCardData) => {
          componentTask.update(newCardData);
          componentTask.render();
          nodeTaskBoard.replaceChild(componentTask.element, componentTaskEdit.element);
          componentTaskEdit.unblock();
          componentTaskEdit.unrender();
        })
        .catch(() => {
          componentTaskEdit.shake();
          componentTaskEdit.unblock();
        });
    };

    componentTaskEdit.onDelete = ({id}) => {
      componentTaskEdit.block();

      api.delete({id})
        .then(() => {
          nodeTaskBoard.removeChild(componentTaskEdit.element);
          componentTaskEdit.unrender();
        })
        .then(() => api.get())
        .catch(() => {
          componentTaskEdit.shake();
          componentTaskEdit.unblock();
        });
    };

    docFragmentCards.appendChild(
        componentTask.render()
    );
  });

  nodeTaskBoard.innerHTML = ``;
  nodeTaskBoard.appendChild(docFragmentCards);
};

/**
 * @description Отрисовка фильтров с навешиванием обработчика кликов по ним
 * @param {Map} [taskFilters=new Map()] Map описания свойств фильтров
 */
const renderFiltersBar = (taskFilters = new Map()) => {
  const nodeFiltersBar = document.querySelector(`.main__filter`);
  const nodeTaskBoard = document.querySelector(`.board__tasks`);
  const docFragmentFilters = document.createDocumentFragment();

  // Собираем фильтры
  for (const [filterId, filter] of taskFilters.entries()) {
    const componentFilter = new Filter(filterId, filter);

    componentFilter.onFilter = () => {
      const filteredTasks = filterTasks(currentCards, filterId);

      renderTaskBoard(nodeTaskBoard, filteredTasks);
    };

    docFragmentFilters.appendChild(
        componentFilter.render()
    );
  }

  nodeFiltersBar.innerHTML = ``;
  nodeFiltersBar.appendChild(docFragmentFilters);
};
