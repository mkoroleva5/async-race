export const generateColor = () => {
  const symbols = ['0', '1', '2', '3', '4', '5', '6', '7', '8', '9', 'A', 'B', 'C', 'D', 'E', 'F'];
  const color = ['#'];
  for (let i = 0; i < 6; i += 1) {
    color.push(symbols[Math.floor(Math.random() * 16)]);
  }
  return color.join('');
};
