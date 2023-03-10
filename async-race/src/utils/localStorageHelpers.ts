export const setLS = (key: string, value: unknown) => {
  localStorage.setItem(key, JSON.stringify(value));
};

export const getLS = (key: string) => {
  const value = localStorage.getItem(key);
  if (value) {
    return JSON.parse(value);
  }
  return null;
};
