export const createElement = <K extends keyof HTMLElementTagNameMap>(
  el: K,
  props: Partial<HTMLElementTagNameMap[K]>,
) => {
  const element = document.createElement(el) as HTMLElementTagNameMap[K];

  if (props) {
    Object.entries(props).forEach(([key, value]) => {
      if (key.startsWith('on') && typeof value === 'function') {
        element.addEventListener(key.substring(2), value);
      } else if (key.startsWith('data-')) {
        element.setAttribute(key, value);
      } else {
        element[key as keyof HTMLElementTagNameMap[K]] = value;
      }
    });
  }

  return element;
};
