const triggerHandledElementEvent = async (page, subject, type) => {
  const el = typeof subject === 'string' ? await page.$(subject) : subject;

  if (!el) {
    return null;
  }

  return el[type]();
};

module.exports = triggerHandledElementEvent;
