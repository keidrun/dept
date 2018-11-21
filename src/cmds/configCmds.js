import config from '../../config/config'
import { dataControl } from '../utils'
import { PACKAGE_MANAGERS, initConfigFile } from './common'

const { CONFIG_FILE_PATH } = config(process.env.NODE_ENV)

const listEnvs = async () => {
  try {
    await initConfigFile()

    const configFile = await dataControl.read({ path: CONFIG_FILE_PATH })

    Object.values(PACKAGE_MANAGERS).forEach(pm => {
      if (configFile.environment === pm) {
        console.log(`* ${pm}`)
      } else {
        console.log(`  ${pm}`)
      }
    })
  } catch (error) {
    console.error(`ERROR: ${error}`)
  }
}

const useEnv = async environment => {
  try {
    await initConfigFile()

    if (!Object.values(PACKAGE_MANAGERS).includes(environment)) {
      throw new Error(
        `environment must be either 'npm' or 'yarn': ${environment}`
      )
    }

    const configFile = await dataControl.read({ path: CONFIG_FILE_PATH })

    configFile.environment = environment

    await dataControl.write(configFile, { path: CONFIG_FILE_PATH })
    console.log(`The default was changed to '${environment}'`)
  } catch (error) {
    console.error(`ERROR: ${error}`)
  }
}

export default { listEnvs, useEnv }
