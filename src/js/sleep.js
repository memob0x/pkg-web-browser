const sleep = (howMuch) => new Promise((resolve) => {
  setTimeout(resolve, howMuch);
});

export default sleep;
