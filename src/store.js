export default class Store {
  constructor() {}

  setItem({key, data}) {
    localStorage.setItem(
        key,
        JSON.stringify(data.toRAW())
    );
  }
}
