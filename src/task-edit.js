import Component from './component';
import flatpickr from 'flatpickr';
import 'flatpickr/dist/flatpickr.min.css';
import moment from 'moment';

/**
 * @description Класс компонента редактирования карточки задачи
 * @export
 * @class TaskEdit
 * @extends {Component}
 */
export default class TaskEdit extends Component {
  /**
   * Конструктор класса компонента TaskEdit
   * @param {Number} index Индексный номер карточки
   * @param {Object} card Данные карточки
   * @param {Array} [colors=[]] Данные всех цветов, доступных для карточки
   * @memberof TaskEdit
   */
  constructor(index, card, colors = []) {
    super();
    this._index = index;
    this._title = card.title;
    this._tags = card.tags;
    this._picture = card.picture;
    this._dueDate = card.dueDate;
    this._repeatingDays = card.repeatingDays;
    this._color = card.color;
    this._colors = colors;

    this._onClickSubmit = this._onClickSubmit.bind(this);
    this._onClickDelete = this._onClickDelete.bind(this);
    this._onSubmit = null;
    this._onDelete = null;

    this._state.isRepeated = false;
    this._state.isDateLimited = false;

    this._onChangeDateLimit = this._onChangeDateLimit.bind(this);
    this._onChangeRepeated = this._onChangeRepeated.bind(this);
  }

  /**
   * @description Возвращаем шаблон карточки задачи
   * @readonly
   * @memberof Task
   * @return {Node} DOM-элемент <template> фильтра
   */
  get template() {
    const nodeCardTemplate = document.createElement(`template`);

    nodeCardTemplate.innerHTML =
      `<article class="card card--edit card--${this._color} ${this._hasRepeatedDays() && `card--repeat`}">
        <form class="card__form" method="get">
          <div class="card__inner">
            <div class="card__control">
              <button type="button" class="card__btn card__btn--edit">edit</button>
              <button type="button" class="card__btn card__btn--archive">archive</button>
              <button type="button" class="card__btn card__btn--favorites card__btn--disabled">favorites</button>
            </div>

            <div class="card__color-bar">
              <svg class="card__color-bar-wave" width="100%" height="10">
                <use xlink:href="#wave"></use>
              </svg>
            </div>

            <div class="card__textarea-wrap">
              <label>
                <textarea
                  class="card__text"
                  placeholder="Start typing your text here..."
                  name="text"
                >${this._title}</textarea>
              </label>
            </div>

            <div class="card__settings">
              <div class="card__details">
                <div class="card__dates">
                  <button class="card__date-deadline-toggle" type="button">
                    date: <span class="card__date-status">${this._state.isDateLimited ? `yes` : `no`}</span>
                  </button>

                  <fieldset class="card__date-deadline" ${!this._state.isDateLimited && `disabled`}>
                    <label class="card__input-deadline-wrap">
                      <input
                        class="card__date"
                        type="text"
                        placeholder="23 September"
                        name="date"
                        value=""
                      />
                    </label>
                    <label class="card__input-deadline-wrap">
                      <input
                        class="card__time"
                        type="text"
                        placeholder="5:23 PM"
                        name="time"
                        value=""
                      />
                    </label>
                  </fieldset>

                  <button class="card__repeat-toggle" type="button">
                    repeat:<span class="card__repeat-status">${this._state.isRepeated ? `yes` : `no`}</span>
                  </button>

                  <fieldset class="card__repeat-days" ${!this._state.isRepeated && `disabled`}>
                    <div class="card__repeat-days-inner">
                      ${this._getCardRepeatDaysTemplate()}
                    </div>
                  </fieldset>
                </div>

                <div class="card__hashtag">
                  <div class="card__hashtag-list">
                    ${this._getCardHashTagsTemplate()}
                  </div>

                  <label>
                    <input
                      type="text"
                      class="card__hashtag-input"
                      name="hashtag-input"
                      placeholder="Type new hashtag here"
                    />
                  </label>
                </div>
              </div>

              <label class="card__img-wrap ${!this._picture.trim() && `card__img-wrap--empty`}">
                <input
                  type="file"
                  class="card__img-input visually-hidden"
                  name="img"
                />
                <img
                  src="${this._picture}"
                  alt="task picture"
                  class="card__img"
                />
              </label>

              <div class="card__colors-inner">
                <h3 class="card__colors-title">Color</h3>

                <div class="card__colors-wrap">
                  ${this._getCardColorsTemplate()}
                </div>
              </div>
            </div>

            <div class="card__status-btns">
              <button class="card__save" type="submit">save</button>
              <button class="card__delete" type="button">delete</button>
            </div>
          </div>
        </form>
      </article>`;

    return nodeCardTemplate;
  }

  /**
   * @description Сеттер обработчика клика по кнопке Save
   * @param {Function} callback Функция-обработчик
   * @memberof TaskEdit
   */
  set onSubmit(callback) {
    this._onSubmit = callback;
  }

  /**
   * @description Сеттер обработчика клика по кнопке Delete
   * @param {Funcion} callback Функция-обработчик
   * @memberof TaskEdit
   */
  set onDelete(callback) {
    this._onDelete = callback;
  }

  /**
   * @description Обновить данные компонента
   * @param {Object} data Объект новых данных компонента
   * @memberof TaskEdit
   */
  update(data) {
    this._title = data.title;
    this._tags = data.tags;
    this._dueDate = data.dueDate;
    this._repeatingDays = data.repeatingDays;
    this._color = data.color;
  }

  /**
   * @description Разметить данные для обновления компонента
   * на основе данных формы
   * @static
   * @param {Object} target Целевой объект данных для обновления
   * @return {Object} Объект с функциями переноса данных
   * @memberof TaskEdit
   */
  static createMapper(target) {
    return {
      text: (value) => (target.title = value),
      date: (value) => {
        const currentDate = moment(target.dueDate);
        const newDate = moment(value, `DD MMMM`);

        target.dueDate = currentDate.set({
          year: newDate.get(`year`),
          month: newDate.get(`month`),
          date: newDate.get(`date`)
        }).valueOf();
      },
      time: (value) => {
        const currentDate = moment(target.dueDate);
        const newDate = moment(value, `HH:mm A`);

        target.dueDate = currentDate.set({
          hour: newDate.get(`hour`),
          minute: newDate.get(`minute`)
        }).valueOf();
      },
      repeat: (value) => (target.repeatingDays[value] = true),
      hashtag: (value) => target.tags.add(value),
      color: (value) => (target.color = value)
    };
  }

  /**
   * @description Централизованное создание обработчиков событий для компонента
   * @memberof TaskEdit
   */
  createListeners() {
    this._element.querySelector(`.card__form`).addEventListener(`submit`, this._onClickSubmit);
    this._element.querySelector(`.card__date-deadline-toggle`).addEventListener(`click`, this._onChangeDateLimit);
    this._element.querySelector(`.card__repeat-toggle`).addEventListener(`click`, this._onChangeRepeated);
    this._element.querySelector(`.card__delete`).addEventListener(`click`, this._onClickDelete);

    if (this._state.isDateLimited) {
      flatpickr(this._element.querySelector(`.card__date`), {
        altInput: true,
        altFormat: `j F`,
        dateFormat: `j F`
      });
      flatpickr(this._element.querySelector(`.card__time`), {
        enableTime: true,
        noCalendar: true,
        altInput: true,
        altFormat: `h:i K`,
        dateFormat: `h:i K `
      });
    }
  }

  /**
   * @description Централизованное снятие обработчиков события для компонента
   * @memberof TaskEdit
   */
  removeListeners() {
    this._element.querySelector(`.card__form`).removeEventListener(`submit`, this._onClickSubmit);
    this._element.querySelector(`.card__date-deadline-toggle`).removeEventListener(`click`, this._onChangeDateLimit);
    this._element.querySelector(`.card__repeat-toggle`).removeEventListener(`click`, this._onChangeRepeated);
    this._element.querySelector(`.card__delete`).removeEventListener(`click`, this._onClickDelete);
  }

  /**
   * @description Проверить, включён ли хоть один день повтора
   * @return {Boolean} True в случае успеха
   * @memberof Task
   */
  _hasRepeatedDays() {
    return Object.values(this._repeatingDays).some((day) => day);
  }

  /**
   * @description Обновление содержимого DOM компонента
   * @memberof TaskEdit
   */
  _partialUpdate() {
    this._element.innerHTML = this.template.content.cloneNode(true).firstChild.innerHTML;
  }

  /**
   * @description Геттер шаблона набора элементов дней повтора
   * @readonly
   * @memberof Task
   * @return {String} Шаблон набора элементов дней повтора
   */
  _getCardRepeatDaysTemplate() {
    let template = ``;

    Object.keys(this._repeatingDays).forEach((day) => {
      template +=
        `<input
          class="visually-hidden card__repeat-day-input"
          type="checkbox"
          id="repeat-${day}-${this._index}"
          name="repeat"
          value="${day}"
          ${this._repeatingDays[day] ? `checked` : ``}
        />\n
        <label class="card__repeat-day" for="repeat-${day}-${this._index}">${day}</label>\n`;
    });

    return template;
  }

  /**
   * @description Геттер шаблона набора элементов цветов карточки
   * @readonly
   * @memberof Task
   * @return {String} Шаблон набора цветов
   */
  _getCardColorsTemplate() {
    let template = ``;

    for (const color of this._colors) {
      template +=
        `<input
          type="radio"
          id="color-${color}-${this._index}"
          class="card__color-input card__color-input--${color} visually-hidden"
          name="color"
          value="${color}"
          ${(this._color === color) ? `checked` : ``}
        />
        <label for="color-${color}-${this._index}" class="card__color card__color--${color}">
          ${color}
        </label>`;
    }

    return template;
  }

  /**
   * @description Геттер шаблона набора тегов карточки
   * @readonly
   * @memberof Task
   * @return {String} Шаблон набора тегов
   */
  _getCardHashTagsTemplate() {
    let template = ``;

    this._tags.forEach((tag) => {
      template +=
        `<span class="card__hashtag-inner">
          <input
            type="hidden"
            name="hashtag"
            value="${tag}"
            class="card__hashtag-hidden-input"
          />
          <button type="button" class="card__hashtag-name">
            #${tag}
          </button>
          <button type="button" class="card__hashtag-delete">
            delete
          </button>
        </span>`;
    });

    return template;
  }

  /**
   * @description Преобразовать данные формы в данные карточки
   * @param {FormData} formData
   * @return {Object} Объект данных карточки
   * @memberof TaskEdit
   */
  _processForm(formData) {
    const tempEntry = {
      title: ``,
      dueDate: 0,
      color: ``,
      repeatingDays: {
        mo: false,
        tu: false,
        we: false,
        th: false,
        fr: false,
        sa: false,
        su: false
      },
      isFavorite: false,
      isDone: false,
      tags: new Set()
    };

    const taskEditMapper = TaskEdit.createMapper(tempEntry);

    for (const pair of formData.entries()) {
      const [property, value] = pair;

      if (taskEditMapper[property]) {
        taskEditMapper[property](value);
      }
    }

    return tempEntry;
  }

  /**
   * @description Вызвать обработчик нажатия кнопки Save, если он функция
   * @param {Event} evt Объект события
   * @memberof TaskEdit
   */
  _onClickSubmit(evt) {
    evt.preventDefault();

    const form = this._element.querySelector(`.card__form`);

    const formData = new FormData(form);
    const newData = this._processForm(formData);

    if (this._onSubmit instanceof Function) {
      this._onSubmit(newData);
    }

    this.update(newData);
  }

  /**
   * @description Вызвать обработчик нажатия кнопки Delete, если он функция
   * @param {Event} evt Объект события
   * @memberof TaskEdit
   */
  _onClickDelete(evt) {
    evt.preventDefault();

    if (this._onDelete instanceof Function) {
      this._onDelete();
    }
  }

  /**
   * @description Функция-обработчик переключения привязки к дате
   * @memberof TaskEdit
   */
  _onChangeDateLimit() {
    this._state.isDateLimited = !this._state.isDateLimited;
    this.removeListeners();
    this._partialUpdate();
    this.createListeners();
  }

  /**
   * @description Функуия-обработчик переключения повторяемости карточки
   * @memberof TaskEdit
   */
  _onChangeRepeated() {
    this._state.isRepeated = !this._state.isRepeated;
    this.removeListeners();
    this._partialUpdate();
    this.createListeners();
  }
}
