/**
 * @description Создание шаблона карточки задачи
 * @author Paul "Bargamut" Petrov
 * @date 2019-02-21
 * @param {Number} index Индексный номер задачи
 * @param {Object} card Объект описания карточки задачи
 * @param {Array} cardColors Массив имён цветовдля карточки задачи
 * @return {Node} DOM-элемент <template> фильтра
 */
const makeCardTemplate = function (index, card, cardColors) {
  const nodeCardTemplate = document.createElement(`template`);
  const dueDate = new Date(card.dueDate);
  const isRepeatingEnabled = Object.values(card.repeatingDays).some((day) => {
    return day;
  });
  const deadline = {
    isEnabled: typeof card.dueDate !== `undefined`
  };

  deadline.date = deadline.isEnabled
    ? dueDate.toLocaleString(`en-GB`, {day: `2-digit`, month: `long`})
    : ``;
  deadline.time = deadline.isEnabled
    ? dueDate.toLocaleString(`en-US`, {hour: `2-digit`, minute: `2-digit`, hour12: true})
    : ``;

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
              >${card.title}</textarea>
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
                      placeholder="${deadline.time}"
                      name="time"
                      value=""
                    />
                  </label>
                </fieldset>

                <button class="card__repeat-toggle" type="button">
                  repeat:<span class="card__repeat-status">${isRepeatingEnabled ? `yes` : `no`}</span>
                </button>

                <fieldset class="card__repeat-days" ${isRepeatingEnabled ? `` : `disabled`}>
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
                src="${card.picture}"
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
      makeRepeatDaysTemplate(index, card.repeatingDays).content.cloneNode(true)
  );

  nodeCardTemplate.content.querySelector(`.card__colors-wrap`).appendChild(
      makeColorsTemplate(index, card.color, cardColors).content.cloneNode(true)
  );

  nodeCardTemplate.content.querySelector(`.card__hashtag-list`).appendChild(
      makeHashTagTemplate(card.tags).content.cloneNode(true)
  );

  return nodeCardTemplate;
};

/**
 * @description Создание набора элементов дней повтора
 * @author Paul "Bargamut" Petrov
 * @date 2019-02-21
 * @param {Number} index Индексный номер карточки
 * @param {Object} repeatingDays Объект описания дней повторения
 * @return {Node} DOM-элемент <template> набора элементов
 */
const makeRepeatDaysTemplate = function (index, repeatingDays) {
  const nodeRepeatDaysTemplate = document.createElement(`template`);

  Object.keys(repeatingDays).forEach((day) => {
    nodeRepeatDaysTemplate.innerHTML +=
      `<input
        class="visually-hidden card__repeat-day-input"
        type="checkbox"
        id="repeat-${day}-${index}"
        name="repeat"
        value="${day}"
        ${repeatingDays[day] ? `checked` : ``}
      />\n
      <label class="card__repeat-day" for="repeat-${day}-${index}">${day}</label>\n`;
  });

  return nodeRepeatDaysTemplate;
};

/**
 * @description Создание набора элементов цветов карточки
 * @author Paul "Bargamut" Petrov
 * @date 2019-02-21
 * @param {Number} index Индексный номер карточки
 * @param {Array} [cardColors=[]] Перечень доступных цветов
 * @param {String} cardColor Цвет карточки
 * @return {Node} DOM-элемент <template> набора цветов
 */
const makeColorsTemplate = function (index, cardColors = [], cardColor) {
  const nodeColorsTemplate = document.createElement(`template`);

  for (const color of cardColors) {
    nodeColorsTemplate.innerHTML +=
      `<input
        type="radio"
        id="color-${color}-${index}"
        class="card__color-input card__color-input--${color} visually-hidden"
        name="color"
        value="${color}"
        ${(cardColor === color) ? `checked` : ``}
      />
      <label for="color-${color}-${index}" class="card__color card__color--${color}">
        ${color}
      </label>`;
  }

  return nodeColorsTemplate;
};

/**
 * @description Создание набора тегов карточки
 * @param {Set} tags - множество тегов
 * @return {Node} DOM-элемент <template> набора тегов
 */
const makeHashTagTemplate = function (tags) {
  const nodeHashTagTemplate = document.createElement(`template`);

  tags.forEach((tag) => {
    nodeHashTagTemplate.innerHTML +=
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

  return nodeHashTagTemplate;
};

export default makeCardTemplate;
