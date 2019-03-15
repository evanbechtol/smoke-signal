const TimeService = {
  computeDuration(date) {
    const now = new Date();
    const openedOn = new Date(date);
    return this.msToTime(parseInt(now - openedOn));
  },
  getUnixTime() {
    return (new Date().getTime() / 1000) | 0;
  },
  msToTime(duration) {
    const seconds = (duration / 1000).toFixed(1);
    const minutes = (duration / (1000 * 60)).toFixed(1);
    const hours = (duration / (1000 * 60 * 60)).toFixed(1);
    const days = (duration / (1000 * 60 * 60 * 24)).toFixed(1);

    if (seconds < 60) {
      return seconds + " Sec";
    } else if (minutes < 60) {
      return minutes + " Min";
    } else if (hours < 24) {
      return hours + " Hrs";
    } else {
      return days + " Days";
    }
  }
};

export { TimeService };
