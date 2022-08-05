function calculateExerciseValue(option, spotPrice, time) {
  const isCall = option.type === "call" ? 1 : -1;

  switch (option.style) {
    case "european":
      return time < option.timeToMaturity
        ? 0
        : Math.max(0, isCall * (spotPrice - option.strikePrice));
    case "american":
      return Math.max(0, isCall * (spotPrice - option.strikePrice));
    default:
      throw new Error(`invalid option style: ${option.style}`);
  }
}

export { calculateExerciseValue };
