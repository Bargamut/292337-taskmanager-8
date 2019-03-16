/**
 * @description Абстрактный класс для реализаций компонента
 * @export
 * @class Component
 */
export default class Component {
  /**
   * Конструктор экземпляра класса Component
   * @memberof Component
   */
  constructor() {
    if (new.target === Component) {
      throw new Error(`Can't instantiate Component, only concrete one.`);
    }

    this._element = null;
  }

  /**
   * @description Геттер свойства this._element
   * @readonly
   * @memberof Component
   * @return {Node} DOM-элемент
   */
  get element() {
    return this._element;
  }

  /**
   * @description Возвращаем шаблон
   * @readonly
   * @memberof Component
   */
  get template() {
    throw new Error(`You have to define template.`);
  }

  /**
   * @description Отрисовка элемента с установкой обработчиков событий
   * @return {Node} DOM-элемент
   * @memberof Component
   */
  render() {
    this._element = this.template.content.cloneNode(true).firstChild;

    this.createListeners();

    return this._element;
  }

  /**
   * @description Отвязка ссылок на DOM-элемент
   * задачи с удалением обработчиков событий
   * @memberof Component
   */
  unrender() {
    this.removeListeners();

    this._element = null;
  }

  /**
   * @description Централизованное создание обработчиков событий для компонента
   * @memberof Component
   */
  createListeners() {}

  /**
   * @description Централизованное снятие обработчиков события для компонента
   * @memberof Component
   */
  removeListeners() {}
}
