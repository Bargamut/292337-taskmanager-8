export default class Store {
  constructor({key, storage}) {
    this._storeKey = key;
    this._storage = storage;
  }

  /**
   * @description Запрос конкретной записи
   * @param {*} {id} ID задачи
   * @return {Object}
   * @memberof Store
   */
  getItem({id}) {
    return this.getAll()[id];
  }

  setItem({id, data}) {
    const items = this.getAll();

    items[id] = data;

    this._storage.setItem(
        this._storeKey,
        JSON.stringify(items)
    );
  }

  removeItem({id}) {
    const items = this.getAll();

    delete items[id];

    this._storage.setItem(this._storeKey, JSON.stringify(items));
  }

  getAll() {
    const emptyItems = {};
    const items = this._storage.getItem(this._storeKey);

    if (!items) {
      return emptyItems;
    }

    try {
      return JSON.parse(items);
    } catch (err) {
      // eslint-disable-next-line no-console
      console.error(`Error parse items. Error" ${err}. Items: ${items}`);
      return emptyItems;
    }
  }
}
