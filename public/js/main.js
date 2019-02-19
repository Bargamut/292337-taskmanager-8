'use strict';

window.addEventListener(`DOMContentLoaded`, function () {
  const $mainFilter = document.querySelector(`.main__filter`);
  const $boardTasks = document.querySelector(`.board__tasks`);
  const taskFilters = {
    all: {
      caption: `All`, count: 42, checked: true
    },
    overdue: {
      caption: `Overdue`, count: 11
    },
    today: {
      caption: `Today`, count: 76
    },
    favorites: {
      caption: `Favorites`, count: 47
    },
    repeating: {
      caption: `Repeating`, count: 152
    },
    tags: {
      caption: `Tags`, count: 279
    },
    archive: {
      caption: `Archive`, count: 100030
    }
  };
  const cards = [
    {
      text: `Test card template 1`
    },
    {
      text: `Test card template 2`
    },
    {
      text: `Test card template 3`
    },
    {
      text: `Test card template 4`
    },
    {
      text: `Test card template 5`
    },
    {
      text: `Test card template 6`
    },
    {
      text: `Test card template 7`
    }
  ];

  for (let key in taskFilters) {
    if (!taskFilters.hasOwnProperty(key)) {
      continue;
    }

    $mainFilter.appendChild(
        renderFilter(key, taskFilters[key]).content.cloneNode(true)
    );
  }

  cards.forEach(function (card, index) {
    $boardTasks.appendChild(
        renderCard(index, card).content.cloneNode(true)
    );
  });
});

document.querySelector(`.filter`).addEventListener(`click`, function (ev) {
  const $target = ev.target;
  const $boardTasks = document.querySelector(`.board__tasks`);
  const numTasks = Math.floor(Math.random() * (20 - 1)) + 1;
  const tempCard = {
    text: `Random card`
  };

  if ($target.classList.contains(`filter__label`)) {
    $boardTasks.innerHTML = ``;

    for (let i = 0; ++i <= numTasks;) {
      $boardTasks.appendChild(
          renderCard(i, tempCard).content.cloneNode(true)
      );
    }
  }
});

function renderFilter(id, objFilter) {
  const $tplFilter = document.createElement(`template`);

  $tplFilter.innerHTML =
    `<input
      type="radio"
      id="${id}"
      class="filter__input visually-hidden"
      name="filter"
      ${objFilter.checked ? `checked` : ``}
    />
    <label for="${id}" class="filter__label">
      ${objFilter.caption} <span class="${id}-count">${objFilter.count}</span>
    </label>`;

  return $tplFilter;
}

function renderCard(index, card) {
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
  const $tplCard = document.createElement(`template`);

  card = Object.assign({}, defaultCard, card);

  $tplCard.innerHTML =
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
                  <div class="card__repeat-days-inner">
                    <input
                      class="visually-hidden card__repeat-day-input"
                      type="checkbox"
                      id="repeat-mo-${index}"
                      name="repeat"
                      value="mo"
                      ${(card.repeatDays.indexOf(`mo`) > -1) ? `checked` : ``}
                    />
                    <label class="card__repeat-day" for="repeat-mo-${index}">mo</label>

                    <input
                      class="visually-hidden card__repeat-day-input"
                      type="checkbox"
                      id="repeat-tu-${index}"
                      name="repeat"
                      value="tu"
                      ${(card.repeatDays.indexOf(`tu`) > -1) ? `checked` : ``}
                    />
                    <label class="card__repeat-day" for="repeat-tu-${index}">tu</label>

                    <input
                      class="visually-hidden card__repeat-day-input"
                      type="checkbox"
                      id="repeat-we-${index}"
                      name="repeat"
                      value="we"
                      ${(card.repeatDays.indexOf(`we`) > -1) ? `checked` : ``}
                    />
                    <label class="card__repeat-day" for="repeat-we-${index}">we</label>

                    <input
                      class="visually-hidden card__repeat-day-input"
                      type="checkbox"
                      id="repeat-th-1"
                      name="repeat"
                      value="th"
                      ${(card.repeatDays.indexOf(`th`) > -1) ? `checked` : ``}
                    />
                    <label class="card__repeat-day" for="repeat-th-${index}">th</label>

                    <input
                      class="visually-hidden card__repeat-day-input"
                      type="checkbox"
                      id="repeat-fr-${index}"
                      name="repeat"
                      value="fr"
                      ${(card.repeatDays.indexOf(`fr`) > -1) ? `checked` : ``}
                    />
                    <label class="card__repeat-day" for="repeat-fr-${index}">fr</label>

                    <input
                      class="visually-hidden card__repeat-day-input"
                      type="checkbox"
                      name="repeat"
                      value="sa"
                      id="repeat-sa-${index}"
                      ${(card.repeatDays.indexOf(`sa`) > -1) ? `checked` : ``}
                    />
                    <label class="card__repeat-day" for="repeat-sa-${index}">sa</label>

                    <input
                      class="visually-hidden card__repeat-day-input"
                      type="checkbox"
                      id="repeat-su-${index}"
                      name="repeat"
                      value="su"
                      ${(card.repeatDays.indexOf(`su`) > -1) ? `checked` : ``}
                    />
                    <label class="card__repeat-day" for="repeat-su-${index}">su</label>
                  </div>
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

              <div class="card__colors-wrap">
                <input
                  type="radio"
                  id="color-black-${index}"
                  class="card__color-input card__color-input--black visually-hidden"
                  name="color"
                  value="black"
                  ${(card.color === `black`) ? `checked` : ``}
                />
                <label for="color-black-${index}" class="card__color card__color--black">
                  black
                </label>
                <input
                  type="radio"
                  id="color-yellow-${index}"
                  class="card__color-input card__color-input--yellow visually-hidden"
                  name="color"
                  value="yellow"
                  ${(card.color === `yellow`) ? `checked` : ``}
                />
                <label for="color-yellow-${index}" class="card__color card__color--yellow">
                  yellow
                </label>
                <input
                  type="radio"
                  id="color-blue-${index}"
                  class="card__color-input card__color-input--blue visually-hidden"
                  name="color"
                  value="blue"
                  ${(card.color === `blue`) ? `checked` : ``}
                />
                <label for="color-blue-${index}" class="card__color card__color--blue">
                  blue
                </label>
                <input
                  type="radio"
                  id="color-green-${index}"
                  class="card__color-input card__color-input--green visually-hidden"
                  name="color"
                  value="green"
                  ${(card.color === `green`) ? `checked` : ``}
                />
                <label for="color-green-${index}" class="card__color card__color--green">
                  green
                </label>
                <input
                  type="radio"
                  id="color-pink-${index}"
                  class="card__color-input card__color-input--pink visually-hidden"
                  name="color"
                  value="pink"
                  ${(card.color === `pink`) ? `checked` : ``}
                />
                <label for="color-pink-${index}" class="card__color card__color--pink">
                  pink
                </label>
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

  return $tplCard;
}
