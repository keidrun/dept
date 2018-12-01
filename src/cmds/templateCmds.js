import config from '../../config/config'
import { dataControl, npmExec } from '../utils'
import { validateTemplate } from '../validates'
import {
  prettyLog,
  promiseAllParallelly,
  promiseAllSerially,
  initConfigFile,
  PACKAGE_MANAGERS,
} from './common'

const {
  INSTALL_DIR_PATH,
  DEFAULT_OUT_DIR_PATH,
  CONFIG_FILE_PATH,
  PACKAGE_JSON_FILE_PATH,
} = config(process.env.NODE_ENV)

const initialize = async () => {
  if (!(await dataControl.isFileExisted())) {
    await dataControl.init()
  }
}

const list = async () => {
  try {
    await initialize()

    const templates = await dataControl.read()

    Object.entries(templates).forEach(arr => {
      if (arr[1].default) {
        console.log(`* ${arr[0]}`)
      } else {
        console.log(`  ${arr[0]}`)
      }
    })
  } catch (error) {
    console.error(`ERROR: ${error}`)
  }
}

const show = async templateName => {
  try {
    await initialize()

    const templates = await dataControl.read()

    if (!Object.keys(templates).includes(templateName))
      throw new Error(`Not such a templateName: '${templateName}'`)

    prettyLog(templates[templateName])
  } catch (error) {
    console.error(`ERROR: ${error}`)
  }
}

const setDefault = async templateName => {
  try {
    await initialize()

    const templates = await dataControl.read()

    if (!Object.keys(templates).includes(templateName))
      throw new Error(`Not such a templateName: '${templateName}'`)

    const newTemplates = {}
    Object.entries(templates).forEach(arr => {
      const name = arr[0]
      const data = arr[1]
      if (name === templateName) {
        data.default = true
      } else {
        data.default = false
      }
      newTemplates[name] = data
    })
    await dataControl.write(newTemplates)
    console.log(`The default was changed to '${templateName}'`)
  } catch (error) {
    console.error(`ERROR: ${error}`)
  }
}

const install = async templateName => {
  try {
    await initialize()
    await initConfigFile()

    const templates = await dataControl.read()
    const configFile = await dataControl.read({ path: CONFIG_FILE_PATH })

    let targetTemplateName = templateName
    if (targetTemplateName) {
      if (!Object.keys(templates).includes(targetTemplateName))
        throw new Error(`Not such a templateName: '${targetTemplateName}'`)
    } else {
      // default
      Object.entries(templates).forEach(t => {
        const name = t[0]
        const templateObj = t[1]
        if (templateObj.default && templateObj.default === true) {
          targetTemplateName = name
        }
      })
      if (!targetTemplateName) throw new Error(`default is not set`)
    }

    const isYarn = configFile.environment === PACKAGE_MANAGERS.YARN
    if (await dataControl.isFileExisted({ path: PACKAGE_JSON_FILE_PATH })) {
      await npmExec.init({ isYarn })
    }

    const targetTemplate = templates[targetTemplateName]

    const depModuleNames = Object.entries(
      targetTemplate.dependencies || {}
    ).map(dep => `${dep[0]}@${dep[1]}`)
    const depPromises = depModuleNames.map(moduleName => () =>
      npmExec.add(moduleName, { isYarn })
    )

    const devDepModuleNames = Object.entries(
      targetTemplate.devDependencies || {}
    ).map(dep => `${dep[0]}@${dep[1]}`)
    const devDepPromises = devDepModuleNames.map(moduleName => () =>
      npmExec.add(moduleName, { isDev: true, isYarn })
    )

    const filePromises = Object.entries(targetTemplate.files || {}).map(
      file => async () => {
        try {
          const fileName = file[0]
          const fileContent = file[1]
          const path = `${INSTALL_DIR_PATH}/${fileName}`
          await dataControl.write(fileContent, { path })
          console.log(`New file created at: '${path}'`)
          return Promise.resolve(true)
        } catch (error) {
          throw error
        }
      }
    )

    await promiseAllSerially(depPromises)
    await promiseAllSerially(devDepPromises)
    await promiseAllParallelly(filePromises)
    console.log(`The dependencies, devDependencies and files were installed`)
  } catch (error) {
    console.error(`ERROR: ${error}`)
  }
}

const add = async (templateName, templateJsonString) => {
  try {
    await initialize()

    const templateObj = JSON.parse(templateJsonString)

    const templates = await dataControl.read()
    if (Object.keys(templates).length === 0) {
      templateObj.default = true
    } else {
      templateObj.default = false
    }

    const { errors } = validateTemplate(templateObj)
    if (errors.length > 0) throw new Error(errors.join(','))

    await dataControl.add(templateName, templateObj)
    console.log(`New template was added: '${templateName}'`)
  } catch (error) {
    console.error(`ERROR: ${error}`)
  }
}

const addFromFile = async (templateName, templateFilePath) => {
  try {
    const templateObj = await dataControl.read({ path: templateFilePath })
    await add(templateName, JSON.stringify(templateObj))
  } catch (error) {
    console.error(`ERROR: ${error}`)
  }
}

const remove = async templateName => {
  try {
    await initialize()

    const templates = await dataControl.read()

    if (!Object.keys(templates).includes(templateName))
      throw new Error(`Not such a templateName: '${templateName}'`)

    await dataControl.remove(templateName)
    console.log(`The template was removed: '${templateName}'`)
  } catch (error) {
    console.error(`ERROR: ${error}`)
  }
}

const rename = async (templateName, newTemplateName) => {
  try {
    await initialize()

    const templates = await dataControl.read()

    if (!Object.keys(templates).includes(templateName))
      throw new Error(`Not such a templateName: '${templateName}'`)

    const newTemplateObj = templates[templateName]

    await dataControl.remove(templateName)
    await dataControl.add(newTemplateName, newTemplateObj)
    console.log(
      `The template '${templateName}' was renamed to: '${newTemplateName}'`
    )
  } catch (error) {
    console.error(`ERROR: ${error}`)
  }
}

const viewFile = async (templateName, viewStatement) => {
  try {
    await initialize()

    const templates = await dataControl.read()

    if (!Object.keys(templates).includes(templateName))
      throw new Error(`Not such a templateName: '${templateName}'`)

    const template = templates[templateName]
    const result = viewStatement
      .split('.')
      .reduce((obj, index) => obj[index], template)

    prettyLog(result || '')
  } catch (error) {
    console.error(`ERROR: ${error}`)
  }
}

const updateFile = async (templateName, updateStatement) => {
  try {
    await initialize()

    const templates = await dataControl.read()

    if (!Object.keys(templates).includes(templateName))
      throw new Error(`Not such a templateName: '${templateName}'`)

    const updateField = updateStatement.split('=')[0]
    const updateValueStr = updateStatement.slice(updateField.length + 1)

    const rootField = updateField.split('.')[0]
    if (!['dependencies', 'devDependencies', 'files'].includes(rootField))
      throw new Error(`Cannot update the field: ${rootField}`)

    const template = templates[templateName]
    const currentValue = updateField
      .split('.')
      .slice(0, -1)
      .reduce((obj, index) => obj[index], template)

    const lastField = updateField.split('.').pop()
    const updateValue =
      typeof currentValue === 'object'
        ? Object.assign(currentValue, {
            [lastField]: JSON.parse(updateValueStr),
          })
        : updateValueStr

    const update = updateField
      .split('.')
      .slice(0, -1)
      .reverse()
      .reduce((obj, prop) => {
        const result = obj
        if (Object.keys(obj).length === 0) {
          result[prop] = updateValue
          return result
        }
        const key = Object.keys(obj)[0]
        result[prop] = Object.assign({}, obj)
        delete result[key]
        return result
      }, {})
    const updatedTemplateObj = Object.assign(template, update)

    const { errors } = validateTemplate(updatedTemplateObj)
    if (errors.length > 0) throw new Error(errors.join(','))

    await dataControl.remove(templateName)
    await dataControl.add(templateName, updatedTemplateObj)
    console.log(`The template was updated: '${templateName}'`)
  } catch (error) {
    console.error(`ERROR: ${error}`)
  }
}

const exportFile = async (templateName, filename, dirPath) => {
  try {
    await initialize()

    const templates = await dataControl.read()

    if (!Object.keys(templates).includes(templateName))
      throw new Error(`Not such a templateName: '${templateName}'`)

    const outFileName = filename || `${templateName}-template.json`
    const outDirPath = dirPath || DEFAULT_OUT_DIR_PATH
    const path = `${outDirPath}/${outFileName}`
    const outTemplateObj = templates[templateName]
    delete outTemplateObj.default

    if (!(await dataControl.isDirExisted({ dirPath: outDirPath }))) {
      throw new Error(`Not such a directory: '${outDirPath}'`)
    }

    await dataControl.write(outTemplateObj, { path })
    console.log(`The template '${templateName}' was exported to: '${path}'`)
  } catch (error) {
    console.error(`ERROR: ${error}`)
  }
}

export default {
  list,
  show,
  setDefault,
  install,
  add,
  addFromFile,
  remove,
  rename,
  viewFile,
  updateFile,
  exportFile,
}
