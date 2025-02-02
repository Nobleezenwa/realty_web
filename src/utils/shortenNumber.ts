function shortenNumber(num: number|string) {
    if (typeof num === 'string') num = parseFloat(num);
    if (num >= 1e12) {
      return (num / 1e12).toFixed(1).replace(/\.0$/, '') + 'T'; // Trillions
    } else if (num >= 1e9) {
      return (num / 1e9).toFixed(1).replace(/\.0$/, '') + 'B'; // Billions
    } else if (num >= 1e6) {
      return (num / 1e6).toFixed(1).replace(/\.0$/, '') + 'M'; // Millions
    } else if (num >= 1e3) {
      return (num / 1e3).toFixed(1).replace(/\.0$/, '') + 'K'; // Thousands
    }
    return num.toString(); // Less than 1,000 stays the same
}

export {shortenNumber};