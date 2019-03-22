import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import flatpickr from 'flatpickr';
import moment from 'moment';

import StatChart from './stat-chart';
import tasks from './make-data';

document.addEventListener(`DOMContentLoaded`, () => {
  const chartTags = new Chart(document.querySelector(`.statistic__tags`), {
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
  });
  const chartColors = new Chart(document.querySelector(`.statistic__colors`), {
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
  });

  document.querySelector(`#control__task`).addEventListener(`click`, () => {
    document.querySelector(`.board.container`).classList.remove(`visually-hidden`);
    document.querySelector(`.statistic`).classList.add(`visually-hidden`);
  });
  document.querySelector(`#control__statistic`).addEventListener(`click`, () => {
    document.querySelector(`.board.container`).classList.add(`visually-hidden`);
    document.querySelector(`.statistic`).classList.remove(`visually-hidden`);
  });

  flatpickr(document.querySelector(`.statistic__period-input`), {
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
      const filteredTasks = filterTasks(tasks, selectedDates);

      updateCharts(filteredTasks, chartColors, chartTags);
    },
    onChange: (selectedDates) => {
      const filteredTasks = filterTasks(tasks, selectedDates);

      updateCharts(filteredTasks, chartColors, chartTags);
    }
  });
});

const updateCharts = (dataTasks, chartColors, chartTags) => {
  const processedDataColors = processTasks(`color`, dataTasks);
  const processedDataTags = processTasks(`tags`, dataTasks);

  // В разрезе цветов
  chartColors.options.title.text = `DONE BY: COLORS`;
  chartColors.data.labels = [...processedDataColors.keys()].map((elem) => `#${elem}`);
  chartColors.data.datasets = [
    {
      data: [...processedDataColors.values()].map((elem) => elem.total),
      backgroundColor: [...processedDataColors.values()].map((elem) => elem.bgColor)
    }
  ];

  chartColors.update();

  // В разрезе тегов
  chartTags.options.title.text = `DONE BY: TAGS`;
  chartTags.data.labels = [...processedDataTags.keys()].map((elem) => `#${elem}`);
  chartTags.data.datasets = [
    {
      data: [...processedDataTags.values()].map((elem) => elem.total),
      backgroundColor: [...processedDataTags.values()].map((elem) => elem.bgColor)
    }
  ];

  chartTags.update();
};

const filterTasks = (dataTasks, selectedDates) => {
  const [since, to] = selectedDates;

  return dataTasks.filter((task) => moment(task.dueDate).isBetween(moment(since).startOf(`day`), moment(to).endOf(`day`), null, `[]`));
};

const mapper = (target) => {
  return {
    color: (value) => {
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
};

const processTasks = (dataType, dataTasks) => {
  const tempEntry = new Map();
  const statMapper = mapper(tempEntry);

  dataTasks.forEach((task) => {
    if (statMapper[dataType]) {
      statMapper[dataType](task);
    }
  });

  return tempEntry;
};

// const renderStatFilter = () => {
//   const componentStatFilter = new StatFilter(tasks);

//   componentStatFilter.onFilter = () => {
//     const filteredTasks = filterTasks(tasks, selectedDates);

//     renderCharts(filteredTasks);
//   };

//   const nodeStatPeriod = document.querySelector(`.statistic__period`);
//   nodeStatPeriod.parentNode.replaceChild(componentStatFilter.render(), nodeStatPeriod);
// };
