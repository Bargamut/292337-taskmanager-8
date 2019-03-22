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
   * @param {Number} width Ширина графика
   * @param {Number} height Высота графика
   * @param {Object} chartData Объект данных для графика
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

  get template() {
    const nodeChartTemplate = document.createElement(`template`);

    nodeChartTemplate.innerHTML =
      `<canvas class="statistic__${this._type}" width="${this._width}" height="${this._height}"></canvas>`;

    return nodeChartTemplate;
  }

  update(data) {
    this._chart.data.labels = data.labels;
  }

  initial() {
    this._chart = new Chart(this._element, this._conf);
  }
}
