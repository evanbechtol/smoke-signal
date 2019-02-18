const dark = {
  primary: "#0c0c0c",
  secondary: "#181818",
  accent: "#242424",
  error: "#DC2D37",
  info: "#0084F0",
  orangeWarning: "#E66E19",
  purpleInfo: "#8E45B0",
  success: "#288964",
  warning: "#DCAF00"
};

const light = {
  primary: "#0c0c0c",
  secondary: "#e0e0e0",
  accent: "#f2f2f2",
  error: "#f52323",
  info: "#0082f0",
  orangeWarning: "#f78521",
  purpleInfo: "#a56ebe",
  success: "#36b07f",
  warning: "#f2c618"
};

export default {
  primary: {
    base: light.primary,
    darken1: dark.primary
  },
  secondary: {
    base: light.secondary,
    darken1: dark.secondary
  },
  accent: {
    base: light.accent,
    darken1: dark.accent
  },
  error: {
    base: light.error,
    darken1: dark.error
  },
  info: {
    base: light.info,
    darken1: dark.info,
    darken2: dark.purpleInfo,
    lighten2: light.purpleInfo
  },
  success: {
    base: light.success,
    darken1: dark.success
  },
  orangeWarning: {
    base: light.orangeWarning,
    darken1: dark.orangeWarning
  },
  warning: {
    base: light.warning,
    darken1: dark.warning
  }
};
