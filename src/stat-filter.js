import Component from './component';
import flatpickr from 'flatpickr';
import moment from 'moment';

/**
 * @description Класс компонента фильтра выборки дат статистики
 * @export
 * @class StatFilter
 * @extends {Component}
 */
export default class StatFilter extends Component {
  /**
   * Конструктор класса StatFilter
   * @memberof StatFilter
   */
  constructor() {
    super();

    this._onChangeFilter = this._onChangeFilter.bind(this);
    this._onFilter = null;

    this._onReadyFilter = this._onReadyFilter.bind(this);
    this._onReady = null;
  }

  /**
   * @description Возвращаем шаблон компонента фильра
   * @readonly
   * @memberof StatFilter
   * @return {Node} DOM-элемент <template> фильтра
   */
  get template() {
    const nodeStatFilterTemplate = document.createElement(`template`);

    nodeStatFilterTemplate.innerHTML =
    `<div class="statistic__period">
      <h2 class="statistic__period-title">Task Activity DIAGRAM</h2>

      <div class="statistic-input-wrap">
        <input
          class="statistic__period-input"
          type="text"
          placeholder="01 Feb - 08 Feb"
        />
      </div>

      <p class="statistic__period-result">
        In total for the specified period
        <span class="statistic__task-found">0</span> tasks were fulfilled.
      </p>
    </div>`;

    return nodeStatFilterTemplate;
  }

  /**
   * @description Сеттер обработчика при обновлении Фильтра
   * @param {Function} callback Функция-обработчик
   * @memberof StatFilter
   */
  set onFilter(callback) {
    this._onFilter = callback;
  }

  /**
   * @description Сеттер обработчика при готовности фильтра
   * @param {Function} callback Функция-обработчик
   * @memberof StatFilter
   */
  set onReady(callback) {
    this._onReady = callback;
  }

  /**
   * @description Обновление данных фильтра
   * @param {Number} countTasks Общее количество отфильтрованных записей
   * @memberof StatFilter
   */
  update(countTasks) {
    const nodeStatTaskFound = this._element.querySelector(`.statistic__task-found`);

    nodeStatTaskFound.innerHTML = countTasks;
  }

  /**
   * @description Централизованное создание обработчиков событий для компонента
   * @memberof StatFilter
   */
  createListeners() {
    flatpickr(this._element.querySelector(`.statistic__period-input`), {
      mode: `range`,
      dateFormat: `d M`,
      defaultDate: [
        moment().startOf(`isoWeek`).valueOf(),
        moment().endOf(`isoWeek`).valueOf()
      ],
      locale: {
        rangeSeparator: ` - `,
        firstDayOfWeek: 1
      },
      onReady: (selectedDates) => {
        this._onChangeFilter(selectedDates);
      },
      onChange: (selectedDates) => {
        this._onChangeFilter(selectedDates);
      }
    });
  }

  /**
   * @description Функция-обработчик обновления фильтра
   * @param {Array} selectedDates Массив из двух дат диапазона выборки
   * @memberof StatFilter
   */
  _onChangeFilter(selectedDates) {
    if (this._onFilter instanceof Function) {
      this._onFilter(selectedDates);
    }
  }

  /**
   * @description Функция-обработчик события готовности фильтра
   * @param {Array} selectedDates Массив из двух дат диапазона выборки
   * @memberof StatFilter
   */
  _onReadyFilter(selectedDates) {
    if (this._onReady instanceof Function) {
      this._onReady(selectedDates);
    }
  }
}
