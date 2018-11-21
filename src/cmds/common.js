import config from '../../config/config'
import { dataControl } from '../utils'

const { CONFIG_FILE_PATH } = config(process.env.NODE_ENV)

const PACKAGE_MANAGERS = { NPM: 'npm', YARN: 'yarn' }

const prettyLog = value => console.log(JSON.stringify(value, null, '\t'))

const promiseAllSerially = promises =>
  promises.reduce(
    (prevPromise, currentPromise) => prevPromise.then(currentPromise),
    Promise.resolve()
  )

const promiseAllParallelly = promises =>
  Promise.all(promises.map(promise => promise()))

const initConfigFile = async () => {
  if (!(await dataControl.isFileExisted({ path: CONFIG_FILE_PATH }))) {
    await dataControl.init({
      path: CONFIG_FILE_PATH,
      initialValue: { environment: PACKAGE_MANAGERS.NPM },
    })
  }
}

export {
  prettyLog,
  promiseAllParallelly,
  promiseAllSerially,
  PACKAGE_MANAGERS,
  initConfigFile,
}
