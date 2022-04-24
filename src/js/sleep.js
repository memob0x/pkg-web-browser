const sleep = (howMuch) => new Promise((resolve) => {
  setTimeout(resolve, howMuch);
});

module.exports = sleep;
