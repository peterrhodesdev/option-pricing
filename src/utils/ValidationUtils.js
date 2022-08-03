const VALID_STYLES = ["american", "european"];
const VALID_TYPES = ["call", "put"];

function isValidStyle(style) {
  return VALID_STYLES.includes(style);
}

function isValidType(type) {
  return VALID_TYPES.includes(type);
}

function isNumberGreaterThanZero(value) {
  return Number.isFinite(value) && value > 0;
}

export { isValidStyle, isValidType, isNumberGreaterThanZero };
