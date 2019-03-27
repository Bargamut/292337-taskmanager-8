export const filters = new Map([
  [
    `all`, {caption: `All`, count: 0}
  ], [
    `overdue`, {caption: `Overdue`, count: 0}
  ], [
    `today`, {caption: `Today`, count: 0}
  ], [
    `favorites`, {caption: `Favorites`, count: 0}
  ], [
    `repeating`, {caption: `Repeating`, count: 0}
  ], [
    `tags`, {caption: `Tags`, count: 0}
  ], [
    `archive`, {caption: `Archive`, count: 0}
  ],
]);

// Нужны также при постройке шаблона каточки
export const arrayColors = [`black`, `yellow`, `blue`, `green`, `pink`];
