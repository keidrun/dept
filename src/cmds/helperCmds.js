import yaml from 'js-yaml'
import config from '../../config/config'
import { dataControl } from '../utils'
import { prettyLog } from './common'

const { DEFAULT_OUT_DIR_PATH } = config(process.env.NODE_ENV)

const jsonToYaml = jsonDataString => {
  const jsonObj = JSON.parse(jsonDataString)
  const yamlString = yaml.safeDump(jsonObj)
  console.log(yamlString)
}

const jsonToYamlFromFile = async (jsonFilePath, filename, dirPath) => {
  try {
    const jsonObj = await dataControl.read({ path: jsonFilePath })

    const fileExtension = 'yml'
    const outFileName =
      filename ||
      `${jsonFilePath
        .split('/')
        .pop()
        .split('.')
        .shift()}.${fileExtension}`
    const outDirPath = dirPath || DEFAULT_OUT_DIR_PATH
    const path = `${outDirPath}/${outFileName}`

    if (!(await dataControl.isDirExisted({ dirPath: outDirPath }))) {
      throw new Error(`Not such a directory: '${outDirPath}'`)
    }

    await dataControl.write(jsonObj, { path, fileExtension })
    console.log(`The converted YAML file was exported to: '${path}'`)
  } catch (error) {
    console.error(`ERROR: ${error}`)
  }
}

const yamlToJson = yamlDataString => {
  const yamlString = yamlDataString.split('\\n').join('\n')
  const jsonString = yaml.safeLoad(yamlString)
  prettyLog(jsonString)
}

const yamlToJsonFromFile = async (yamlFilePath, filename, dirPath) => {
  try {
    const jsonObj = await dataControl.read({ path: yamlFilePath })

    const fileExtension = 'json'
    const outFileName =
      filename ||
      `${yamlFilePath
        .split('/')
        .pop()
        .split('.')
        .shift()}.${fileExtension}`
    const outDirPath = dirPath || DEFAULT_OUT_DIR_PATH
    const path = `${outDirPath}/${outFileName}`

    if (!(await dataControl.isDirExisted({ dirPath: outDirPath }))) {
      throw new Error(`Not such a directory: '${outDirPath}'`)
    }

    await dataControl.write(jsonObj, { path, fileExtension })
    console.log(`The converted JSON file was exported to: '${path}'`)
  } catch (error) {
    console.error(`ERROR: ${error}`)
  }
}

export default {
  jsonToYaml,
  jsonToYamlFromFile,
  yamlToJson,
  yamlToJsonFromFile,
}
