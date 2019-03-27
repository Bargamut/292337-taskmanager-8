import Component from './component';
import moment from 'moment';

/**
 * @description Класс компонента Карточки задачи
 * @export
 * @class Task
 * @extends {Component}
 */
export default class Task extends Component {
  /**
   * @description Конструктор экземпляра класса Task
   * @param {Object} card Объект данных карточки
   * @memberof Task
   */
  constructor(card) {
    super();
    this._id = card.id;
    this._title = card.title;
    this._tags = card.tags;
    this._picture = card.picture;
    this._dueDate = card.dueDate;
    this._repeatingDays = card.repeatingDays;
    this._color = card.color;

    this._onClickEdit = this._onClickEdit.bind(this);
    this._onEdit = null;

    this._state.isRepeated = this._hasRepeatingDays();
    this._state.isDateLimited = this._hasDateLimit();
  }

  /**
   * @description Возвращаем шаблон карточки задачи
   * @readonly
   * @memberof Task
   * @return {Node} DOM-элемент <template> карточки задачи
   */
  get template() {
    const nodeCardTemplate = document.createElement(`template`);
    const currDate = moment(this._dueDate);

    nodeCardTemplate.innerHTML =
      `<article class="card card--${this._color} ${this._state.isRepeated ? `card--repeat` : ``}">
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
                  ${this._state.isDateLimited ? currDate.format(`DD MMMM HH:mm`) : ``}
                </div>

                <div class="card__hashtag">
                  <div class="card__hashtag-list">
                    ${this._getCardHashTagsTemplate()}
                  </div>
                </div>
              </div>

              <label class="card__img-wrap ${!this._picture.trim() && `card__img-wrap--empty`}">
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
   * @description Обновить данные компонента
   * @param {Object} data
   * @memberof Task
   */
  update(data) {
    this._title = data.title;
    this._tags = data.tags;
    this._dueDate = data.dueDate;
    this._repeatingDays = data.repeatingDays;
    this._color = data.color;

    this._state.isRepeated = this._hasRepeatingDays();
    this._state.isDateLimited = this._hasDateLimit();
  }

  /**
   * @description Централизованное создание обработчиков событий для компонента
   * @memberof Task
   */
  createListeners() {
    this._element.querySelector(`.card__btn--edit`).addEventListener(`click`, this._onClickEdit);
  }

  /**
   * @description Централизованное снятие обработчиков события для компонента
   * @memberof Task
   */
  removeListeners() {
    this._element.querySelector(`.card__btn--edit`).removeEventListener(`click`, this._onClickEdit);
  }

  _hasRepeatingDays() {
    return Object.values(this._repeatingDays).some((day) => day);
  }

  _hasDateLimit() {
    return (this._dueDate !== null);
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
          <button type="button" class="card__hashtag-name">
            #${tag}
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
