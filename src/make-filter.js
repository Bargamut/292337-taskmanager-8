/**
 * @description Создание шаблона фильтра
 * @author Paul "Bargamut" Petrov
 * @date 2019-02-21
 * @param {Number} id ID фильтра
 * @param {Object} filter Объект описания фильтра
 * @return {Node} DOM-элемент <template> фильтра
 */
const makeFilterTemplate = function (id, filter) {
  const nodeFilterTemplate = document.createElement(`template`);

  nodeFilterTemplate.innerHTML =
    `<input
      type="radio"
      id="${id}"
      class="filter__input visually-hidden"
      name="filter"
      ${filter.checked ? `checked` : ``}
    />
    <label for="${id}" class="filter__label">
      ${filter.caption} <span class="${id}-count">${filter.count}</span>
    </label>`;

  return nodeFilterTemplate;
};

export default makeFilterTemplate;
