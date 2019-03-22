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

  createChart() {
    this._chart = new Chart(this._element, this._conf);
  }

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
