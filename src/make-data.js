const WEEK_MILLISECONDS = 604800000;
const arrayTitles = [
  `Изучить теорию`,
  `Сделать домашку`,
  `Пройти интенсив на соточку`
];
const arrayTags = [`homework`, `theory`, `practice`, `intensive`, `keks`, `bargamut`, `awesome`, `tibet`];

// Нужны также при постройке шаблона каточки
export const arrayColors = [`black`, `yellow`, `blue`, `green`, `pink`];

/**
 * @description Генерация объекта карточки
 * @return {Object} Объект карточки
 */
const generateCardData = () => (
  {
    title: arrayTitles[getRandomInt(3)],
    dueDate: Date.now() + getRandomInt(WEEK_MILLISECONDS, -WEEK_MILLISECONDS),
    picture: `https://picsum.photos/100/100?r=${Math.random()}`,
    color: arrayColors[getRandomInt(arrayColors.length)],
    repeatingDays: {
      mo: Math.random() > 0.5,
      tu: Math.random() > 0.5,
      we: Math.random() > 0.5,
      th: Math.random() > 0.5,
      fr: Math.random() > 0.5,
      sa: Math.random() > 0.5,
      su: Math.random() > 0.5
    },
    isFavorite: Math.random() > 0.5,
    isDone: Math.random() > 0.5,
    tags: new Set([
      arrayTags[getRandomInt(arrayTags.length)],
      arrayTags[getRandomInt(arrayTags.length)],
      arrayTags[getRandomInt(arrayTags.length)]
    ])
  }
);

const getRandomInt = (max, min = 0) => Math.floor(Math.random() * (max - min)) + min;

export default generateCardData;
