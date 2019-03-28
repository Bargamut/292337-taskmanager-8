/**
 * @description Класс обработки данных по паттерну Адаптер
 * @export
 * @class ModelTask
 */
export default class ModelTask {
  /**
   * Конструктор касса ModelTask
   * @param {Array} data Массив данных
   * @memberof ModelTask
   */
  constructor(data) {
    this.id = data[`id`];
    this.title = data[`title`];
    this.dueDate = data[`due_date`];
    this.tags = new Set(data[`tags`]);
    this.picture = data[`picture`];
    this.repeatingDays = data[`repeating_days`];
    this.color = data[`color`];
    this.isFavorite = Boolean(data[`is_favorite`]);
    this.isDone = Boolean(data[`is_done`]);
  }

  /**
   * @description Привести структуру данных к серверному варианту
   * @return {Object}
   * @memberof ModelTask
   */
  toRAW() {
    return {
      'id': this.id,
      'title': this.title,
      'due_date': this.dueDate,
      'tags': [...this.tags.values()],
      'picture': this.picture,
      'repeating_days': this.repeatingDays,
      'color': this.color,
      'is_favorite': this.isFavorite,
      'is_done': this.isDone,
    };
  }

  /**
   * @description Фабричный метод разбора данных
   * @static
   * @param {Array} data Массив данных
   * @return {ModelTask} Объект класса ModelTask с адаптирвоанными данными
   * @memberof ModelTask
   */
  static parseTask(data) {
    return new ModelTask(data);
  }

  /**
   * @description Фабричный метод разбора группы данных
   * @static
   * @param {Array} data Массив данных
   * @return {Array} Массив объектов класса ModelTask
   * @memberof ModelTask
   */
  static parseTasks(data) {
    return data.map(ModelTask.parseTask);
  }
}
