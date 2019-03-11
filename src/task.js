/**
 * @description Класс компонента Карточки задачи
 * @class Task
 */
export default class Task {
  /**
   * @description Конструктор экземпляра класса Task
   * @param {Number} index Индексный номер карточки
   * @param {Object} card Объект данных карточки
   * @memberof Task
   */
  constructor(index, card) {
    this._index = index;
    this._title = card.title;
    this._tags = card.tags;
    this._picture = card.picture;
    this._dueDate = card.dueDate;
    this._repeatingDays = card.repeatingDays;
    this._color = card.color;

    this._element = null;
    this._nodeBtnEdit = null;
    this._nodeBtnSave = null;

    this._onEdit = null;
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
      `<article class="card card--${this._color}">
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
                </div>
              </div>

              <label class="card__img-wrap ${!this._picture.trim() ? `card__img-wrap--empty` : ``}">
                <img
                  src="${this._picture}"
                  alt="task picture"
                  class="card__img"
                />
              </label>
            </div>
          </div>
        </form>
      </article>`;

    return nodeCardTemplate;
  }

  /**
   * @description Сеттер обработчика клика по кнопке Edit
   * @param {Function} callback Функция-обработчик
   * @memberof Task
   */
  set onEdit(callback) {
    this._onEdit = callback;
  }

  /**
   * @description Отрисовка карточки задачи с установкой
   * обработчиков событий
   * @return {Node} DOM-элемент карточки задачи
   * @memberof Task
   */
  render() {
    this._element = this.template.content.cloneNode(true).firstChild;
    this._nodeBtnEdit = this._element.querySelector(`.card__btn--edit`);

    this._nodeBtnEdit.addEventListener(`click`, this._onClickEdit.bind(this));

    return this._element;
  }

  /**
   * @description Отвязка ссылок на DOM-элемент карточки
   * задачи с удалением обработчиков событий
   * @memberof Task
   */
  unrender() {
    this._nodeBtnEdit.removeEventListener(`click`, this._onClickEdit);

    this._nodeBtnEdit = null;
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
   * @description Вызвать обработчик нажатия кнопки Edit, если он функция
   * @memberof Task
   */
  _onClickEdit() {
    if (this._onEdit instanceof Function) {
      this._onEdit();
    }
  }
}
