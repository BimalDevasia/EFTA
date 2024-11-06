export const isNumber = (valueStr) => {
    try {
      const value = parseFloat(valueStr);
      return !isNaN(value);
    } catch (error) {
      return false;
    }
  };