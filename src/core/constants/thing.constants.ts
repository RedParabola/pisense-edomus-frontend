/**
 * Constants for the things.
 */
export const THING_CONSTANTS = {
  ICON: {
    LIGHT: 'icon-bulb',
    AC: 'icon-air-conditioning-indoor',
    HUMIDIFIER: 'icon-ventilation',
    SENSOR: 'icon-feed'
  },
  NAME: {
    LIGHT: 'LIGHT',
    AC: 'AC',
    HUMIDIFIER: 'HUMIDIFIER',
    SENSOR: 'SENSOR'
  }
};

export const AVAILABLE_MODELS_BY_THING = {
  LIGHT: [
    "led",
    "rgbled",
  ],
  AC: [
    "Model-S",
    "Model-C",
    "Model-R",
  ],
  HUMIDIFIER: [
    "Model-S",
    "Model-C",
    "Model-R",
  ],
  SENSOR: [
    "dht11",
    "mq235",
  ]
};