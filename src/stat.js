import Chart from 'chart.js';
import ChartDataLabels from 'chartjs-plugin-datalabels';
import flatpickr from 'flatpickr';
import moment from 'moment';

document.addEventListener(`DOMContentLoaded`, () => {
  document.querySelector(`#control__task`).addEventListener(`click`, () => {
    document.querySelector(`.board.container`).classList.remove(`visually-hidden`);
    document.querySelector(`.statistic`).classList.add(`visually-hidden`);
  });

  document.querySelector(`#control__statistic`).addEventListener(`click`, () => {
    document.querySelector(`.board.container`).classList.add(`visually-hidden`);
    document.querySelector(`.statistic`).classList.remove(`visually-hidden`);
  });

  flatpickr(`.statistic__period-input`, {
    mode: `range`,
    dateFormat: `d M`,
    defaultDate: [
      moment().startOf(`isoWeek`).valueOf(),
      moment().endOf(`isoWeek`).valueOf()
    ],
    locale: {
      rangeSeparator: ` - `,
      firstDayOfWeek: 1
    }
  });

  const tagsCtx = document.querySelector(`.statistic__tags`).getContext(`2d`);
  const colorsCtx = document.querySelector(`.statistic__colors`).getContext(`2d`);
  const config = {
    plugins: [ChartDataLabels],
    type: `pie`,
    data: {},
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
  };
  const confChartTags = Object.assign({}, config);
  const confChartColors = Object.assign({}, config);

  confChartTags.options.title = `DONE BY: TAGS`;
  confChartTags.options.title = `DONE BY: COLORS`;

  // В разрезе тегов
  const tagsChart = new Chart(tagsCtx, Object.assign(confChartTags, {
    data: {
      labels: [`#watchstreams`, `#relaxation`, `#coding`, `#sleep`, `#watermelonpies`],
      datasets: [{
        data: [20, 15, 10, 5, 2],
        backgroundColor: [`#ff3cb9`, `#ffe125`, `#0c5cdd`, `#000000`, `#31b55c`]
      }]
    }
  }));

  // В разрезе цветов
  const colorsChart = new Chart(colorsCtx, Object.assign(confChartColors, {
    data: {
      labels: [`#pink`, `#yellow`, `#blue`, `#black`, `#green`],
      datasets: [{
        data: [5, 25, 15, 10, 30],
        backgroundColor: [`#ff3cb9`, `#ffe125`, `#0c5cdd`, `#000000`, `#31b55c`]
      }]
    }
  }));
});
