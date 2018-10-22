import { promisify } from 'util'
import fs from 'fs'
import config from '../config/config'

const { DIR_PATH, TEMPLATE_FILE_PATH } = config(process.env.NODE_ENV)

const isDirExisted = ({ dirPath = DIR_PATH } = { dirPath: DIR_PATH }) =>
  promisify(fs.stat)(dirPath)
    .then(() => true)
    .catch(() => false)

const isFileExisted = (
  { path = TEMPLATE_FILE_PATH } = { path: TEMPLATE_FILE_PATH }
) =>
  promisify(fs.stat)(path)
    .then(() => true)
    .catch(() => false)

const init = async () => {
  const initialData = {}
  if (!(await isDirExisted())) {
    await promisify(fs.mkdir)(DIR_PATH, { recursive: true })
  }
  await promisify(fs.writeFile)(
    TEMPLATE_FILE_PATH,
    JSON.stringify(initialData),
    'utf8'
  )
  return Promise.resolve(initialData)
}

const read = ({ path = TEMPLATE_FILE_PATH } = { path: TEMPLATE_FILE_PATH }) =>
  promisify(fs.readFile)(path, 'utf8').then(data => JSON.parse(data))

const write = async (
  contentObj,
  { path = TEMPLATE_FILE_PATH } = { path: TEMPLATE_FILE_PATH }
) => {
  if (typeof contentObj === 'string') {
    await promisify(fs.writeFile)(path, contentObj, 'utf8')
  } else {
    await promisify(fs.writeFile)(path, JSON.stringify(contentObj), 'utf8')
  }
  return Promise.resolve(contentObj)
}

const add = async (templateName, templateObj) => {
  const templatesObj = await read()
  templatesObj[templateName] = templateObj
  await promisify(fs.writeFile)(
    TEMPLATE_FILE_PATH,
    JSON.stringify(templatesObj),
    'utf8'
  )
  return Promise.resolve(templatesObj)
}

const remove = async templateName => {
  const templatesObj = await read()
  delete templatesObj[templateName]
  await promisify(fs.writeFile)(
    TEMPLATE_FILE_PATH,
    JSON.stringify(templatesObj),
    'utf8'
  )
  return Promise.resolve(templatesObj)
}

const dataControl = {
  isDirExisted,
  isFileExisted,
  init,
  read,
  write,
  add,
  remove,
}

export { dataControl as default }
