import Component from './component';
import flatpickr from 'flatpickr';
import moment from 'moment';

export default class StatFilter extends Component {
  constructor(tasks) {
    super();

    this._tasks = tasks;
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
        const [since, to] = selectedDates;

        const filteredTasks = this._tasks.filter(
            (task) => moment(task.dueDate).isBetween(
                moment(since).startOf(`day`),
                moment(to).endOf(`day`),
                null, `[]`
            )
        );

        this._onChangeFilter(filteredTasks);
      },
      onChange: () => {
        
      }
    });
  }

  removeListeners() {}

  _onChangeFilter(filteredTasks) {
    if (this._onFilter instanceof Function) {
      this._onFilter(filteredTasks);
    }
  }
}
