const valueDataTypes = Object.freeze({
  ARRAY: "ARRAY",
  OBJECT: "OBJECT",
  OTHER: "OTHER",
});

// Create a matrix filled with the given value
function createFilledMatrix(rows, cols, fillValue) {
  const fillMatrix = new Array(rows);

  let valueDataType;
  switch (true) {
    case Array.isArray(fillValue):
      valueDataType = valueDataTypes.ARRAY;
      break;
    case typeof fillValue === "object":
      valueDataType = valueDataTypes.OBJECT;
      break;
    default:
      valueDataType = valueDataTypes.OTHER;
  }

  for (let i = 0; i < fillMatrix.length; i += 1) {
    switch (valueDataType) {
      case valueDataTypes.ARRAY:
        fillMatrix[i] = new Array(cols).fill().map(() => [...fillValue]);
        break;
      case valueDataTypes.OBJECT:
        fillMatrix[i] = new Array(cols).fill().map(() => ({ ...fillValue }));
        break;
      default:
        fillMatrix[i] = new Array(cols).fill(fillValue);
    }
  }
  return fillMatrix;
}

// Create a matrix of all 1, like the ones() function of MATLAB
function ones(rows, cols) {
  return createFilledMatrix(rows, cols, 1);
}

// Create a matrix of all 0, like the zeros() function of MATLAB
function zeros(rows, cols) {
  return createFilledMatrix(rows, cols, 0);
}

export { createFilledMatrix, ones, zeros };
