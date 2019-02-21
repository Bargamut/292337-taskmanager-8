/**
 * @description Создание шаблона фильтра
 * @author Paul "Bargamut" Petrov
 * @date 2019-02-21
 * @param {Number} id ID фильтра
 * @param {Object} objFilter Объект описания фильтра
 * @return {Node} DOM-элемент <template> фильтра
 */
const makeFilterTemplate = function (id, objFilter) {
  const elemTplFilter = document.createElement(`template`);

  elemTplFilter.innerHTML =
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

  return elemTplFilter;
};

export default makeFilterTemplate;
