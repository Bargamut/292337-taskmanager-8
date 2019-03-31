import ModelTask from "./model-task";

export default class Provider {
  constructor({api, store, generateId}) {
    this._api = api;
    this._store = store;
    this._generateId = generateId;
    this._needSync = false;
  }

  /**
   * @description Запрос данных
   * @param {String} url URL запроса
   * @return {JSON} Данные в JSON-формате
   * @memberof Provider
   */
  get() {
    if (this._isOnline()) {
      return this._api.get()
        .then((tasks) => {
          tasks.forEach(this._putToStorage);

          return tasks;
        });
    }

    const rawTasks = this._store.getAll();

    return Promise.resolve(ModelTask.parseTasks(rawTasks));
  }

  /**
   * @description Послать данные для записи
   * @param {*} {task} Данные задачи
   * @return {JSON} Ответ сервера
   * @memberof Provider
   */
  create({task}) {
    if (this._isOnline()) {
      return this._api.create({task})
        .then(this._putToStorage);
    }

    task.id = this._generateId();

    this._needSync = true;
    this._putToStorage(task);

    return Promise.resolve(ModelTask.parseTask(task));
  }

  /**
   * @description Послать данные для обновления
   * @param {*} id Данные задачи
   * @param {*} data Данные задачи
   * @return {JSON} Ответ сервера
   * @memberof Provider
   */
  update({id, data}) {
    if (this._isOnline()) {
      return this._api.update({id, data})
        .then(this._putToStorage);
    }

    const task = data;

    this._needSync = true;
    this._putToStorage(task);

    return Promise.resolve(ModelTask.parseTask(task));
  }

  /**
   * @description Удалить данные
   * @param {String} {id} ID записи
   * @return {Promise}
   * @memberof Provider
   */
  delete({id}) {
    if (this._isOnline()) {
      return this._api.delete({id})
        .then(() => {
          this._store.removeItem({id});
        });
    }

    this._needSync = true;
    this._store.removeItem({id});

    return Promise.resolve(id);
  }

  syncTasks() {
    return this._api.sync({
      tasks: this._store.getAll()
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
}
