import ChartDataLabels from 'chartjs-plugin-datalabels';
import moment from 'moment';

import StatChart from './stat-chart';
import StatFilter from './stat-filter';
import tasks from './make-data';

const componentStatFilter = new StatFilter();
const componentChartColors = new StatChart({
  type: `colors`,
  width: 400,
  height: 300,
  conf: {
    plugins: [ChartDataLabels],
    type: `pie`,
    data: {
      labels: [],
      datasets: []
    },
    options: {
      plugins: {
        datalabels: {
          display: false
        }
      },
      tooltips: {
        callbacks: {
          label: (tooltipItem, data) => {
            const allData = data.datasets[tooltipItem.datasetIndex].data;
            const tooltipData = allData[tooltipItem.index];
            const total = allData.reduce((acc, it) => acc + parseFloat(it));
            const tooltipPercentage = Math.round((tooltipData / total) * 100);
            return `${tooltipData} TASKS — ${tooltipPercentage}%`;
          }
        },
        displayColors: false,
        backgroundColor: `#ffffff`,
        bodyFontColor: `#000000`,
        borderColor: `#000000`,
        borderWidth: 1,
        cornerRadius: 0,
        xPadding: 15,
        yPadding: 15
      },
      title: {
        display: true,
        text: ``,
        fontSize: 16,
        fontColor: `#000000`
      },
      legend: {
        position: `left`,
        labels: {
          boxWidth: 15,
          padding: 25,
          fontStyle: 500,
          fontColor: `#000000`,
          fontSize: 13
        }
      }
    }
  }
});
const componentChartTags = new StatChart({
  type: `tags`,
  width: 400,
  height: 300,
  conf: {
    plugins: [ChartDataLabels],
    type: `pie`,
    data: {
      labels: [],
      datasets: []
    },
    options: {
      plugins: {
        datalabels: {
          display: false
        }
      },
      tooltips: {
        callbacks: {
          label: (tooltipItem, data) => {
            const allData = data.datasets[tooltipItem.datasetIndex].data;
            const tooltipData = allData[tooltipItem.index];
            const total = allData.reduce((acc, it) => acc + parseFloat(it));
            const tooltipPercentage = Math.round((tooltipData / total) * 100);
            return `${tooltipData} TASKS — ${tooltipPercentage}%`;
          }
        },
        displayColors: false,
        backgroundColor: `#ffffff`,
        bodyFontColor: `#000000`,
        borderColor: `#000000`,
        borderWidth: 1,
        cornerRadius: 0,
        xPadding: 15,
        yPadding: 15
      },
      title: {
        display: true,
        text: ``,
        fontSize: 16,
        fontColor: `#000000`
      },
      legend: {
        position: `left`,
        labels: {
          boxWidth: 15,
          padding: 25,
          fontStyle: 500,
          fontColor: `#000000`,
          fontSize: 13
        }
      }
    }
  }
});

document.addEventListener(`DOMContentLoaded`, () => {
  document.querySelector(`#control__task`).addEventListener(`click`, () => {
    document.querySelector(`.board.container`).classList.remove(`visually-hidden`);
    document.querySelector(`.statistic`).classList.add(`visually-hidden`);
  });
  document.querySelector(`#control__statistic`).addEventListener(`click`, () => {
    document.querySelector(`.board.container`).classList.add(`visually-hidden`);
    document.querySelector(`.statistic`).classList.remove(`visually-hidden`);
  });

  renderCharts();
  renderStatFilter();
});

/**
 * @description Отфильтровать задачи на основе данных фильтра
 * @param {Array} dataTasks Массив задач
 * @param {Array} selectedDates Массив дат диапазона выборки
 * @return {Array} Отфильтрованный массив задач
 */
const filterTasks = (dataTasks, selectedDates) => {
  const [since, to] = selectedDates;

  return dataTasks.filter((task) => moment(task.dueDate).isBetween(moment(since).startOf(`day`), moment(to).endOf(`day`), null, `[]`));
};

/**
 * @description Обновить компоненты на основе новой выборки
 * @param {Array} selectedDates Массив дат диапазона выборки
 */
const updateComponents = (selectedDates) => {
  const filteredTasks = filterTasks(tasks, selectedDates);

  componentStatFilter.update(filteredTasks.length);
  componentChartColors.update(filteredTasks);
  componentChartTags.update(filteredTasks);
};

/**
 * @description Отрисовать компонент фильтра статистики
 */
const renderStatFilter = () => {
  const nodeStatPeriod = document.querySelector(`.statistic__period`);

  componentStatFilter.onReady = updateComponents;
  componentStatFilter.onFilter = updateComponents;

  nodeStatPeriod.parentNode.replaceChild(componentStatFilter.render(), nodeStatPeriod);
};

/**
 * @description Отрисовать компоненты графиков статистики
 */
const renderCharts = () => {
  const nodeChartColors = document.querySelector(`.statistic__colors`);
  const nodeChartTags = document.querySelector(`.statistic__tags`);

  componentChartColors.render();
  componentChartTags.render();

  nodeChartColors.parentNode.replaceChild(
      componentChartColors.element,
      nodeChartColors
  );

  nodeChartTags.parentNode.replaceChild(
      componentChartTags.render(),
      nodeChartTags
  );

  componentChartColors.createChart();
  componentChartTags.createChart();
};
