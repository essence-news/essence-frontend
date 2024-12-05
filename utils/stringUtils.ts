export function toCamelCase(str: string) {
  return str
    .split(" ")
    .map((word, index) => {
      if (index === 0) {
        return word.toLowerCase();
      }
      return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
    })
    .join("");
}

export function capitalize(val: string) {
  return `${val.charAt(0).toUpperCase()}${val.slice(1)}`;
}
