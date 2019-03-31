import ModelTask from './model-task';

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
    return this._api.get();
  }

  /**
   * @description Послать данные для записи
   * @param {*} {task} Данные задачи
   * @return {JSON} Ответ сервера
   * @memberof Provider
   */
  create({task}) {
    return this._api.create({task});
  }

  /**
   * @description Послать данные для обновления
   * @param {*} id Данные задачи
   * @param {*} data Данные задачи
   * @return {JSON} Ответ сервера
   * @memberof Provider
   */
  update({id, data}) {
    return this._api.update({id, data});
  }

  /**
   * @description Удалить данные
   * @param {String} {id} ID записи
   * @return {Promise}
   * @memberof Provider
   */
  delete({id}) {
    return this._api.delete({id});
  }
}
