export const createElement = (el: string, className: string) => {
  const element = document.createElement(el);
  element.className = className;
  return element;
};
