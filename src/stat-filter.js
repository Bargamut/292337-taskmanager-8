import Component from './component';
import flatpickr from 'flatpickr';
import moment from 'moment';

export default class StatFilter extends Component {
  constructor(tasks) {
    super();

    this._tasks = tasks;

    this._onChangeFilter = this._onChangeFilter.bind(this);
    this._onFilter = null;

    this._onReadyFilter = this._onReadyFilter.bind(this);
    this._onReady = null;
  }

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

  set onFilter(callback) {
    this._onFilter = callback;
  }

  set onReady(callback) {
    this._onReady = callback;
  }

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

  removeListeners() {}

  _onChangeFilter(selectedDates) {
    if (this._onFilter instanceof Function) {
      this._onFilter(selectedDates);
    }
  }

  _onReadyFilter(selectedDates) {
    if (this._onReady instanceof Function) {
      this._onReady(selectedDates);
    }
  }
}
