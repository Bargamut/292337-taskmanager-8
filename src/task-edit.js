export default class TaskEdit {
  constructor(index, card, colors = []) {
    this._index = index;
    this._title = card.title;
    this._tags = card.tags;
    this._picture = card.picture;
    this._dueDate = card.dueDate;
    this._repeatingDays = card.repeatingDays;
    this._color = card.color;
    this._colors = colors;

    this._element = null;

    this._nodeCardForm = null;

    this._onSubmit = null;
  }

  /**
   * @description Геттер срока выполнения
   * @readonly
   * @memberof Task
   * @return {Object} Объект данных срока выполнения
   */
  get _deadline() {
    const deadline = {
      isEnabled: typeof this._dueDate !== `undefined`
    };

    if (deadline.isEnabled) {
      this._dueDate = new Date(this._dueDate);
    }

    deadline.date = deadline.isEnabled
      ? this._dueDate.toLocaleString(`en-GB`, {day: `2-digit`, month: `long`})
      : ``;
    deadline.time = deadline.isEnabled
      ? this._dueDate.toLocaleString(`en-US`, {hour: `2-digit`, minute: `2-digit`, hour12: true})
      : ``;

    return deadline;
  }

  /**
   * @description Геттер DOM-элемента карточки задачи
   * @readonly
   * @memberof Task
   * @return {Node} DOM-элемент карточки задачи
   */
  get element() {
    return this._element;
  }

  /**
   * @description Возвращаем шаблон карточки задачи
   * @readonly
   * @memberof Task
   * @return {Node} DOM-элемент <template> фильтра
   */
  get template() {
    const nodeCardTemplate = document.createElement(`template`);
    const isRepeatingEnabled = Object.values(this._repeatingDays).some((day) => {
      return day;
    });
    const deadline = this._deadline;

    nodeCardTemplate.innerHTML =
      `<article class="card card--edit card--${this._color}">
        <form class="card__form" method="get">
          <div class="card__inner">
            <div class="card__control">
              <button type="button" class="card__btn card__btn--edit">edit</button>
              <button type="button" class="card__btn card__btn--archive">archive</button>
              <button type="button" class="card__btn card__btn--favorites card__btn--disabled">favorites</button>
            </div>

            <div class="card__color-bar">
              <svg width="100%" height="10">
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
                    date: <span class="card__date-status">${deadline.isEnabled ? `yes` : `no`}</span>
                  </button>

                  <fieldset class="card__date-deadline" ${deadline.isEnabled ? `` : `disabled`}>
                    <label class="card__input-deadline-wrap">
                      <input
                        class="card__date"
                        type="text"
                        placeholder="23 September"
                        name="date"
                        value="${deadline.date}"
                      />
                    </label>
                    <label class="card__input-deadline-wrap">
                      <input
                        class="card__time"
                        type="text"
                        placeholder="5:23 PM"
                        name="time"
                        value="${deadline.time}"
                      />
                    </label>
                  </fieldset>

                  <button class="card__repeat-toggle" type="button">
                    repeat:<span class="card__repeat-status">${isRepeatingEnabled ? `yes` : `no`}</span>
                  </button>

                  <fieldset class="card__repeat-days" ${isRepeatingEnabled ? `` : `disabled`}>
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

              <label class="card__img-wrap card__img-wrap--empty">
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
   * @description Отрисовка карточки задачи с установкой обработчиков событий
   * @return {Node} DOM-элемент карточки задачи
   * @memberof Task
   */
  render() {
    this._element = this.template.content.cloneNode(true).firstChild;
    this._nodeCardForm = this._element.querySelector(`.card__form`);

    this._nodeCardForm.addEventListener(`submit`, this._onClickSubmit.bind(this));

    return this._element;
  }

  /**
   * @description Отвязка ссылок на DOM-элемент карточки
   * задачи с удалением обработчиков событий
   * @memberof Task
   */
  unrender() {
    this._nodeCardForm.removeEventListener(`submit`, this._onClickSubmit);

    this._nodeCardForm = null;
    this._element = null;
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
   * @description Вызвать обработчик нажатия кнопки Save, если он функция
   * @param {Event} evt Объект события
   * @memberof TaskEdit
   */
  _onClickSubmit(evt) {
    evt.preventDefault();

    if (this._onSubmit instanceof Function) {
      this._onSubmit();
    }
  }
}
