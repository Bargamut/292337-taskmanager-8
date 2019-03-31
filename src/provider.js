export default class Provider {
  constructor({api, store}) {
    this._api = api;
    this._store = store;
  }

  /**
   * @description Запрос данных
   * @param {String} url URL запроса
   * @return {JSON} Данные в JSON-формате
   * @memberof Provider
   */
  get() {
    return this._api.get()
      .then((tasks) => {
        tasks.forEach(this._putToStorage);

        return tasks;
      });
  }

  /**
   * @description Послать данные для записи
   * @param {*} {task} Данные задачи
   * @return {JSON} Ответ сервера
   * @memberof Provider
   */
  create({task}) {
    return this._api.create({task})
      .then(this._putToStorage);
  }

  /**
   * @description Послать данные для обновления
   * @param {*} id Данные задачи
   * @param {*} data Данные задачи
   * @return {JSON} Ответ сервера
   * @memberof Provider
   */
  update({id, data}) {
    return this._api.update({id, data})
      .then(this._putToStorage);
  }

  /**
   * @description Удалить данные
   * @param {String} {id} ID записи
   * @return {Promise}
   * @memberof Provider
   */
  delete({id}) {
    return this._api.delete({id})
      .then(() => {
        this._store.removeItem({id});
      });
  }

  _putToStorage(task) {
    this._store.setItem({
      id: task.id,
      data: task.toRAW()
    });

    return task;
  }
}
