const { promisify } = require('util');
const fs = require('fs');
const { DIR_PATH, TEMPLATE_FILE_PATH } = require('../config/config')(
  process.env.NODE_ENV,
);

const _isDirExisted = ({ dirPath } = { dirPath: DIR_PATH }) =>
  promisify(fs.stat)(dirPath)
    .then(() => true)
    .catch(() => false);

const isFileExisted = ({ path } = { path: TEMPLATE_FILE_PATH }) =>
  promisify(fs.stat)(path)
    .then(() => true)
    .catch(() => false);

const init = async () => {
  const initialData = {};
  if (!(await _isDirExisted())) {
    await promisify(fs.mkdir)(DIR_PATH, { recursive: true });
  }
  await promisify(fs.writeFile)(
    TEMPLATE_FILE_PATH,
    JSON.stringify(initialData),
    'utf8',
  );
  return Promise.resolve(initialData);
};

const read = ({ path } = { path: TEMPLATE_FILE_PATH }) =>
  promisify(fs.readFile)(path, 'utf8').then(data => JSON.parse(data));

const write = async (contentObj, { path } = { path: TEMPLATE_FILE_PATH }) => {
  await promisify(fs.writeFile)(path, JSON.stringify(contentObj), 'utf8');
  return Promise.resolve(contentObj);
};

const add = async (templateName, templateObj) => {
  const templatesObj = await read();
  templatesObj[templateName] = templateObj;
  await promisify(fs.writeFile)(
    TEMPLATE_FILE_PATH,
    JSON.stringify(templatesObj),
    'utf8',
  );
  return Promise.resolve(templatesObj);
};

const remove = async templateName => {
  const templatesObj = await read();
  delete templatesObj[templateName];
  await promisify(fs.writeFile)(
    TEMPLATE_FILE_PATH,
    JSON.stringify(templatesObj),
    'utf8',
  );
  return Promise.resolve(templatesObj);
};

module.exports = {
  isFileExisted,
  init,
  read,
  write,
  add,
  remove,
};
