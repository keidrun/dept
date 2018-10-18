const dataControl = require('./dataControl');
const { validateTemplate } = require('./validates');
const npmExec = require('./npmExec');
const { INSTALL_DIR_PATH } = require('../config/config')(process.env.NODE_ENV);

const _initialize = async () => {
  if (!(await dataControl.isFileExisted())) {
    await dataControl.init();
  }
};

const list = async () => {
  try {
    await _initialize();

    const templates = await dataControl.read();

    Object.entries(templates).forEach(arr => {
      if (arr[1].default) {
        console.log(`* ${arr[0]}`);
      } else {
        console.log(`  ${arr[0]}`);
      }
    });
  } catch (error) {
    console.error(`ERROR: ${error}`);
  }
};

const show = async templateName => {
  try {
    await _initialize();

    const templates = await dataControl.read();

    if (!Object.keys(templates).includes(templateName))
      throw new Error(`Not such a templateName: '${templateName}'`);

    console.log(JSON.stringify(templates[templateName], null, '\t'));
  } catch (error) {
    console.error(`ERROR: ${error}`);
  }
};

const setDefault = async templateName => {
  try {
    await _initialize();

    const templates = await dataControl.read();

    if (!Object.keys(templates).includes(templateName))
      throw new Error(`Not such a templateName: '${templateName}'`);

    const newTemplates = {};
    Object.entries(templates).forEach(arr => {
      const name = arr[0];
      const data = arr[1];
      if (name === templateName) {
        data.default = true;
      } else {
        data.default = false;
      }
      newTemplates[name] = data;
    });
    await dataControl.write(newTemplates);
    console.log(`default was changed to '${templateName}'`);
  } catch (error) {
    console.error(`ERROR: ${error}`);
  }
};

const install = async (templateName, isInit, isYarn) => {
  try {
    await _initialize();

    const templates = await dataControl.read();

    let targetTemplateName = templateName;
    if (targetTemplateName) {
      if (!Object.keys(templates).includes(targetTemplateName))
        throw new Error(`Not such a templateName: '${targetTemplateName}'`);
    } else {
      // default
      Object.entries(templates).forEach(t => {
        const name = t[0];
        const templateObj = t[1];
        if (templateObj.default && templateObj.default === true) {
          targetTemplateName = name;
        }
      });
      if (!targetTemplateName) throw new Error(`default is not set`);
    }

    if (isInit) {
      await npmExec.init({ isYarn });
    }

    const targetTemplate = templates[targetTemplateName];

    const depPromises = Object.entries(targetTemplate.dependencies || {}).map(
      async dep => {
        try {
          const moduleName = `${dep[0]}@${dep[1]}`;
          await npmExec.add(moduleName, { isYarn });
          return Promise.resolve(true);
        } catch (error) {
          throw error;
        }
      },
    );

    const devDepPromises = Object.entries(
      targetTemplate.devDependencies || {},
    ).map(async dep => {
      try {
        const moduleName = `${dep[0]}@${dep[1]}`;
        await npmExec.add(moduleName, { isDev: true, isYarn });
        return Promise.resolve(true);
      } catch (error) {
        throw error;
      }
    });

    const filePromises = Object.entries(targetTemplate.files || {}).map(
      async file => {
        try {
          const fileName = file[0];
          const fileContent = file[1];
          const path = `${INSTALL_DIR_PATH}/${fileName}`;
          await dataControl.write(fileContent, { path });
          console.log(`new file created at: '${path}'`);
          return Promise.resolve(true);
        } catch (error) {
          throw error;
        }
      },
    );

    await Promise.all(depPromises);
    await Promise.all(devDepPromises, filePromises);
    console.log(`dependencies, devDependencies and files were installed`);
  } catch (error) {
    console.error(`ERROR: ${error}`);
  }
};

const add = async (templateName, templateJsonString) => {
  try {
    await _initialize();

    const templateObj = JSON.parse(templateJsonString);

    const templates = await dataControl.read();
    if (Object.keys(templates).length === 0) templateObj.default = true;
    else templateObj.default = false;

    const { errors } = validateTemplate(templateObj);
    if (errors.length > 0) throw new Error(errors.join(','));

    await dataControl.add(templateName, templateObj);
    console.log(`new template was added: '${templateName}'`);
  } catch (error) {
    console.error(`ERROR: ${error}`);
  }
};

const addFromFile = async (templateName, templateFilePath) => {
  try {
    const templateObj = await dataControl.read({ path: templateFilePath });
    await add(templateName, JSON.stringify(templateObj));
  } catch (error) {
    console.error(`ERROR: ${error}`);
  }
};

const remove = async templateName => {
  try {
    await _initialize();

    const templates = await dataControl.read();

    if (!Object.keys(templates).includes(templateName))
      throw new Error(`Not such a templateName: '${templateName}'`);

    await dataControl.remove(templateName);
    console.log(`the template was removed: '${templateName}'`);
  } catch (error) {
    console.error(`ERROR: ${error}`);
  }
};

module.exports = {
  list,
  show,
  setDefault,
  install,
  add,
  addFromFile,
  remove,
};
