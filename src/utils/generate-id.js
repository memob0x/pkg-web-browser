const generateId = () => `${Date.now()}${Math.random()}`.replace('.', '');

export default generateId;
