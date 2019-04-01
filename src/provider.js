import ModelTask from "./model-task";

export default class Provider {
  constructor({api, store, generateId}) {
    this._api = api;
    this._store = store;
    this._generateId = generateId;
    this._needSync = false;

    this._putToStorage = this._putToStorage.bind(this);
  }

  /**
   * @description Запрос данных
   * @param {String} url URL запроса
   * @return {JSON} Данные в JSON-формате
   * @memberof Provider
   */
  getTasks() {
    if (this._isOnline()) {
      return this._api.getTasks()
        .then((tasks) => {
          tasks.forEach(this._putToStorage);

          return tasks;
        });
    }

    const rawTasksMap = this._store.getAll();
    const rawTasks = this._objectToArray(rawTasksMap);
    const tasks = ModelTask.parseTasks(rawTasks);

    return Promise.resolve(tasks);
  }

  /**
   * @description Послать данные для записи
   * @param {*} {task} Данные задачи
   * @return {JSON} Ответ сервера
   * @memberof Provider
   */
  createTask({task}) {
    if (this._isOnline()) {
      return this._api.createTask({task})
        .then(this._putToStorage);
    }

    task.id = this._generateId();
    task = ModelTask.parseTask(task);

    this._needSync = true;
    this._putToStorage(task);

    return Promise.resolve(task);
  }

  /**
   * @description Послать данные для обновления
   * @param {*} id Данные задачи
   * @param {*} data Данные задачи
   * @return {JSON} Ответ сервера
   * @memberof Provider
   */
  updateTask({id, data}) {
    if (this._isOnline()) {
      return this._api.updateTask({id, data})
        .then(this._putToStorage);
    }

    const task = ModelTask.parseTask(data);

    this._needSync = true;
    this._putToStorage(task);

    return Promise.resolve(task);
  }

  /**
   * @description Удалить данные
   * @param {String} {id} ID записи
   * @return {Promise}
   * @memberof Provider
   */
  deleteTask({id}) {
    if (this._isOnline()) {
      return this._api.deleteTask({id})
        .then(() => {
          this._store.removeItem({id});
        });
    }

    this._needSync = true;
    this._store.removeItem({id});

    return Promise.resolve(id);
  }

  /**
   * @description Сихронизировать данные
   * @return {JSON}
   * @memberof Provider
   */
  syncTasks() {
    return this._api.syncTasks({
      tasks: this._objectToArray(this._store.getAll())
    })
    .then(() => {
      this._needSync = false;
    });
  }

  /**
   * @description Добавить данные в хранилище
   * @param {ModelTask} task Данные описания задачи
   * @return {ModelTask} Данные описания задачи
   * @memberof Provider
   */
  _putToStorage(task) {
    this._store.setItem({
      id: task.id,
      data: task.toRAW()
    });

    return task;
  }

  /**
   * @description Проверить статус подключения
   * @return {Boolean}
   * @memberof Provider
   */
  _isOnline() {
    return window.navigator.onLine;
  }

  /**
   * @description Преобразовать объект данных для задач в массив
   * @param {Object} object Объект данных для задач
   * @return {Array} Массив данных для задач
   * @memberof Provider
   */
  _objectToArray(object) {
    return Object.keys(object).map((id) => object[id]);
  }
}
