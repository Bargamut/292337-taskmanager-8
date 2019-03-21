import Component from "./component";

/**
 * @description Класс компонента фильтра задач
 * @export
 * @class Filter
 * @extends {Component}
 */
export default class Filter extends Component {
  /**
   * Конструктор класса FIlter
   * @param {*} index Индекс элемента
   * @param {Object} filter Объект данных описания фильтра
   * @memberof Filter
   */
  constructor(index, filter) {
    super();

    this._index = index;
    this._caption = filter.caption;
    this._count = filter.count;

    this._onClickFilter = this._onClickFilter.bind(this);
    this._onFilter = null;

    this._state.isChecked = false;
    this._state.isDisabled = false;
  }

  /**
   * @description Возвращаем шаблон фильтра
   * @readonly
   * @memberof Filter
   * @return {Node} DOM-элемент <template> фильтра
   */
  get template() {
    const nodeFilterTemplate = document.createElement(`template`);

    nodeFilterTemplate.innerHTML =
      `<div class="filter-wrap">
				<input
					type="radio"
					id="${this._index}"
          class="filter__input visually-hidden"
					name="filter"
          ${this._state.isChecked && `checked`}
          ${this._state.isDisabled && `disabled`}
				/>
        <label for="${this._index}" class="filter__label">
          ${this._caption} <span class="${this._index}-count">${this._count}</span>
        </label>
      </div>`;

    return nodeFilterTemplate;
  }

  /**
   * @description Сеттер обработчика клика по фильтру
   * @param {Function} callback Функция-обработчик
   * @memberof Filter
   */
  set onFilter(callback) {
    this._onFilter = callback;
  }

  /**
   * @description Централизованное создание обработчиков событий для компонента
   * @memberof Filter
   */
  createListeners() {
    this._element.querySelector(`.filter__label`).addEventListener(`click`, this._onClickFilter);
  }

  /**
   * @description Централизованное снятие обработчиков события для компонента
   * @memberof Filter
   */
  removeListeners() {
    this._element.querySelector(`.filter__label`).removeEventListener(`click`, this._onClickFilter);
  }

  /**
   * @description Обработчик клика по фильтру
   * @memberof Filter
   */
  _onClickFilter() {
    if (this._onFilter instanceof Function) {
      this._onFilter();
    }
  }
}
