import Component from './component';
import Chart from 'chart.js';

/**
 * @description Класс компонента графика
 * @export
 * @class StateChart
 * @extends {Component}
 */
export default class StatChart extends Component {
  /**
   * Конструктор класса StateChart
   * @param {Object} chart Объект данных для графика
   * @param {String} chart.type Тип данных для графика
   * @param {Number} chart.width Ширина графика
   * @param {Number} chart.height Высота графика
   * @param {Object} chart.conf Конфиг графика
   * @memberof StateChart
   */
  constructor(chart) {
    super();

    this._type = chart.type;
    this._width = chart.width;
    this._height = chart.height;
    this._conf = chart.conf;

    this._chart = null;
  }

  /**
   * @description Возвращаем шаблон компонента графика
   * @readonly
   * @memberof StatFilter
   * @return {Node} DOM-элемент <template> графика
   */
  get template() {
    const nodeChartTemplate = document.createElement(`template`);

    nodeChartTemplate.innerHTML =
      `<canvas class="statistic__${this._type}" width="${this._width}" height="${this._height}"></canvas>`;

    return nodeChartTemplate;
  }

  /**
   * @description Обновление графика
   * @param {Array} tasks Массив задач
   * @memberof StatChart
   */
  update(tasks) {
    const processedData = this._processTasks(tasks);

    this._chart.data.labels = processedData.labels;

    this._chart.options.title.text = `DONE BY: ${this._type.toUpperCase()}`;
    this._chart.data.labels = [...processedData.keys()].map((elem) => `#${elem}`);
    this._chart.data.datasets = [{
      data: [...processedData.values()].map((elem) => elem.total),
      backgroundColor: [...processedData.values()].map((elem) => elem.bgColor)
    }];

    this._chart.update();
  }

  /**
   * @description Разметить данные для обновления компонента
   * на основе типа данных компонента
   * @static
   * @param {Object} target Целевой объект данных для обновления
   * @return {Object} Объект с функциями переноса данных
   * @memberof StatChart
   */
  static createMapper(target) {
    return {
      colors: (value) => {
        if (target.has(value.color)) {
          target.get(value.color).total++;
          return;
        }

        target.set(value.color, {
          total: 1,
          bgColor: `${value.color}`
        });
      },
      tags: (value) => {
        value.tags.forEach((tag) => {
          if (target.has(tag)) {
            target.get(tag).total++;
            return;
          }

          target.set(tag, {
            total: 1,
            bgColor: `#${(0x1000000 + Math.random() * 0xFFFFFF).toString(16).substr(1, 6)}`
          });
        });
      }
    };
  }

  /**
   * @description Создание графика
   * @memberof StatChart
   */
  createChart() {
    this._chart = new Chart(this._element, this._conf);
  }

  /**
   * @description Преобразовать данные задачи в данные для графика
   * @param {Array} dataTasks
   * @return {Map} Преобразованные данные для графика
   * @memberof StatChart
   */
  _processTasks(dataTasks) {
    const tempEntry = new Map();
    const statMapper = StatChart.createMapper(tempEntry);

    dataTasks.forEach((task) => {
      if (statMapper[this._type]) {
        statMapper[this._type](task);
      }
    });

    return tempEntry;
  }
}
