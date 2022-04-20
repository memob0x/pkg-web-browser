const {
  url,

  width,

  height,

  browser,

  data,
} = require('./arguments');

const launch = require('./launch');

launch(url, width, height, browser, data);
