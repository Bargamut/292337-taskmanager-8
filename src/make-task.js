const days = [
  `mo`, `tu`, `we`, `th`, `fr`, `sa`, `su`
];
const colors = [
  `black`, `yellow`, `blue`, `green`, `pink`
];

/**
 * @description Создание шаблона карточки задачи
 * @author Paul "Bargamut" Petrov
 * @date 2019-02-21
 * @param {Number} index Индексный номер задачи
 * @param {Object} card Объект описания карточки задачи
 * @return {Node} DOM-элемент <template> фильтра
 */
const makeCardTemplate = function (index, card) {
  const defaultCard = {
    text: `Test card template`,
    color: `black`,
    img: ``,
    isDeadlineEnabled: false,
    deadlineDate: ``,
    deadlineTime: ``,
    isRepeatEnabled: false,
    repeatDays: [],
    hashtags: []
  };
  const nodeCardTemplate = document.createElement(`template`);

  card = Object.assign({}, defaultCard, card);

  nodeCardTemplate.innerHTML =
    `<article class="card card--${card.color}">
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
              >${card.text}</textarea>
            </label>
          </div>

          <div class="card__settings">
            <div class="card__details">
              <div class="card__dates">
                <button class="card__date-deadline-toggle" type="button">
                  date: <span class="card__date-status">${card.isDeadlineEnabled ? `yes` : `no`}</span>
                </button>

                <fieldset class="card__date-deadline" ${card.isDeadlineEnabled ? `` : `disabled`}>
                  <label class="card__input-deadline-wrap">
                    <input
                      class="card__date"
                      type="text"
                      placeholder="23 September"
                      name="date"
                      value="${card.deadlineDate}"
                    />
                  </label>
                  <label class="card__input-deadline-wrap">
                    <input
                      class="card__time"
                      type="text"
                      placeholder="11:15 PM"
                      name="time"
                      value="${card.deadlineTime}"
                    />
                  </label>
                </fieldset>

                <button class="card__repeat-toggle" type="button">
                  repeat:<span class="card__repeat-status">${card.isRepeatEnabled ? `yes` : `no`}</span>
                </button>

                <fieldset class="card__repeat-days" ${card.isRepeatEnabled ? `` : `disabled`}>
                  <div class="card__repeat-days-inner"></div>
                </fieldset>
              </div>

              <div class="card__hashtag">
                <div class="card__hashtag-list"></div>

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
                src="${card.img}"
                alt="task picture"
                class="card__img"
              />
            </label>

            <div class="card__colors-inner">
              <h3 class="card__colors-title">Color</h3>

              <div class="card__colors-wrap"></div>
            </div>
          </div>

          <div class="card__status-btns">
            <button class="card__save" type="submit">save</button>
            <button class="card__delete" type="button">delete</button>
          </div>
        </div>
      </form>
    </article>`;


  nodeCardTemplate.content.querySelector(`.card__repeat-days-inner`).appendChild(
      makeRepeatDaysTemplate(index, card).content.cloneNode(true)
  );

  nodeCardTemplate.content.querySelector(`.card__colors-wrap`).appendChild(
      makeColorsTemplate(index, card).content.cloneNode(true)
  );

  return nodeCardTemplate;
};

/**
 * @description Создание набора элементов дней повтора
 * @author Paul "Bargamut" Petrov
 * @date 2019-02-21
 * @param {Number} index Индексный номер карточки
 * @param {Object} card Объект описания карточки
 * @return {Node} DOM-элемент <template> набора элементов
 */
const makeRepeatDaysTemplate = function (index, card) {
  const nodeRepeatDaysTemplate = document.createElement(`template`);

  for (const day of days) {
    nodeRepeatDaysTemplate.innerHTML +=
      `<input
        class="visually-hidden card__repeat-day-input"
        type="checkbox"
        id="repeat-${day}-${index}"
        name="repeat"
        value="${day}"
        ${(card.repeatDays.indexOf(day) > -1) ? `checked` : ``}
      />
      <label class="card__repeat-day" for="repeat-${day}-${index}">${day}</label>`;
  }

  return nodeRepeatDaysTemplate;
};

/**
 * @description Создание набора элементов цветов карточки
 * @author Paul "Bargamut" Petrov
 * @date 2019-02-21
 * @param {Number} index Индексный номер карточки
 * @param {Object} card Объект описания карточки
 * @return {Node} DOM-элемент <template> набора цветов
 */
const makeColorsTemplate = function (index, card) {
  const nodeColorsTemplate = document.createElement(`template`);

  for (const color of colors) {
    nodeColorsTemplate.innerHTML +=
      `<input
        type="radio"
        id="color-${color}-${index}"
        class="card__color-input card__color-input--${color} visually-hidden"
        name="color"
        value="${color}"
        ${(card.color === color) ? `checked` : ``}
      />
      <label for="color-${color}-${index}" class="card__color card__color--${color}">
        ${color}
      </label>`;
  }

  return nodeColorsTemplate;
};

export default makeCardTemplate;
