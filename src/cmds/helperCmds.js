import yaml from 'js-yaml'
import config from '../../config/config'
import { dataControl } from '../utils'
import { prettyLog } from './common'

const { INSTALL_DIR_PATH, DEFAULT_OUT_DIR_PATH } = config(process.env.NODE_ENV)

const jsonToYaml = jsonDataString => {
  const jsonObj = JSON.parse(jsonDataString)
  const yamlString = yaml.safeDump(jsonObj)
  console.log(yamlString)
}

// const jsonToYamlFromFile = (jsonFilePath, dirPath) => {
//   console.log('jsonFilePath=', jsonFilePath, 'dirPath=', dirPath)
//   console.log('JSON to YAML from file')
// }

const yamlToJson = yamlDataString => {
  const yamlString = yamlDataString.split('\\n').join('\n')
  const jsonString = yaml.safeLoad(yamlString)
  prettyLog(jsonString)
}

// const yamlToJsonFromFile = (yamlFilePath, dirPath) => {
//   console.log('yamlFilePath=', yamlFilePath, 'dirPath=', dirPath)
//   console.log('YAML to JSON from file')
// }

export default {
  jsonToYaml,
  // jsonToYamlFromFile,
  yamlToJson,
  // yamlToJsonFromFile,
}
