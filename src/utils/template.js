export function fluidContactTemplate() {
  const setup = {
    og: {
      id: "og",
      color: "#FF0000",
      name: "O/G",
    },
    ow: {
      id: "ow",
      color: "#0000FF",
      name: "O/W",
    },
  };
  const history = {
    og: {
      0: {
        fromDate: 0,
        offsetWidth: 200,
        offsetHeight: 100,
        x: 20,
        y: 100,
        minValue: 1,
        maxValue: 18,
      },
    },
    ow: {
      0: {
        fromDate: 0,
        x: 320,
        y: 100,
        offsetWidth: 200,
        offsetHeight: 100,
        minValue: 1,
        maxValue: 18,
      },
    },
  };

  return { setup, history };
}

export function newMeasurementTemplate(id) {
  const setup = {
    [id]: {
      id: id,
      color: "#000000",
      name: "New",
    },
  };
  const history = {
    [id]: {
      0: {
        fromDate: 0,
        offsetWidth: 200,
        offsetHeight: 100,
        x: 20,
        y: 100,
        minValue: 1,
        maxValue: 18,
      },
    },
  };

  return { setup, history };
}
