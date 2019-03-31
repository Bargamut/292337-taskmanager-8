import moment from 'moment';

import Filter from './filter';
import Task from './task';
import TaskEdit from './task-edit';
import './stat';
import {filters, arrayColors} from './make-data';
import API from './api';
import Store from './store';
import Provider from './provider';

let currentCards = [];
const AUTHORIZATION = `Basic JKgkgKLkGKg97s&S97SGkhKkhgSkf=`;
const END_POINT = `https://es8-demo-srv.appspot.com/task-manager`;
const TASKS_STORE_KEY = `tasks-store-key`;

const api = new API({
  endPoint: END_POINT,
  authorization: AUTHORIZATION
});
const storage = new Store();
const provider = new Provider({api, storage});

window.addEventListener(`DOMContentLoaded`, () => {
  processLoadingStatus(`loading`);

  provider.get()
    .then((tasks) => {
      processLoadingStatus();

      currentCards = tasks;

      renderTaskBoard(tasks);
    })
    .catch(() => {
      processLoadingStatus(`error`);
    });

  renderFiltersBar(filters);
});

/**
 * @description Генерировать уникальный ID для карточки
 * @return {String} Строковый timestamp
 */
const generateId = () => {
  return Date.now().toString();
};

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
 * @description Вывести сообщение статуса загрузки данных
 * @param {String} status Текущий статус загрузки данных
 */
const processLoadingStatus = (status) => {
  const nodeBoardInfo = document.querySelector(`.board__no-tasks`);

  nodeBoardInfo.classList.remove(`visually-hidden`);

  switch (status) {
    case `loading`: nodeBoardInfo.innerHTML = `Loading tasks...`; break;
    case `error`: nodeBoardInfo.innerHTML =
        `Something went wrong while loading your tasks.
        Check your connection or try again later`;
      break;
    default: nodeBoardInfo.classList.add(`visually-hidden`);
  }
};

/**
 * @description Отрисовка доски задач
 * @param {Array} [taskCards=[]] Массив объектов описания карточек
 */
const renderTaskBoard = (taskCards = []) => {
  const nodeTaskBoard = document.querySelector(`.board__tasks`);
  const docFragmentCards = document.createDocumentFragment();

  nodeTaskBoard.innerHTML = ``;

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
      componentTaskEdit.block(`submit`);

      Object.assign(card, newData);

      provider.update({
        id: card.id,
        data: card.toRAW()
      })
        .then((newCardData) => {
          componentTask.update(newCardData);
          componentTask.render();
          nodeTaskBoard.replaceChild(componentTask.element, componentTaskEdit.element);
          componentTaskEdit.unblock(`submit`);
          componentTaskEdit.unrender();
        })
        .catch(() => {
          componentTaskEdit.shake();
          componentTaskEdit.unblock(`submit`);
        });
    };

    componentTaskEdit.onDelete = ({id}) => {
      componentTaskEdit.block(`delete`);

      provider.delete({id})
        .then(() => {
          nodeTaskBoard.removeChild(componentTaskEdit.element);
          componentTaskEdit.unrender();
        })
        .then(() => provider.get())
        .catch(() => {
          componentTaskEdit.shake();
          componentTaskEdit.unblock(`delete`);
        });
    };

    docFragmentCards.appendChild(
        componentTask.render()
    );
  });

  nodeTaskBoard.appendChild(docFragmentCards);
};

/**
 * @description Отрисовка фильтров с навешиванием обработчика кликов по ним
 * @param {Map} [taskFilters=new Map()] Map описания свойств фильтров
 */
const renderFiltersBar = (taskFilters = new Map()) => {
  const nodeFiltersBar = document.querySelector(`.main__filter`);
  const docFragmentFilters = document.createDocumentFragment();

  // Собираем фильтры
  for (const [filterId, filter] of taskFilters.entries()) {
    const componentFilter = new Filter(filterId, filter);

    componentFilter.onFilter = () => {
      const filteredTasks = filterTasks(currentCards, filterId);

      renderTaskBoard(filteredTasks);
    };

    docFragmentFilters.appendChild(
        componentFilter.render()
    );
  }

  nodeFiltersBar.innerHTML = ``;
  nodeFiltersBar.appendChild(docFragmentFilters);
};
