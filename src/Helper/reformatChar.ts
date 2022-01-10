export const replaceSpecialChars = (b64string: string) => {
  return b64string.replace(/[=+/]/g, (charToBeReplaced: string) => {
    switch (charToBeReplaced) {
      case '=':
        return '';
      case '+':
        return '-';
      case '/':
        return '_';
      default:
        return charToBeReplaced;
    }
  });
};
