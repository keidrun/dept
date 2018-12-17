import { spawn } from 'child_process'

const version = ({ isYarn = false } = { isYarn: false }) =>
  new Promise((resolve, reject) => {
    let child
    if (isYarn) {
      child = spawn('yarn', ['--version'])
      child.stdout.on('data', data => {
        console.log(`${data}`)
      })
      child.stderr.on('data', data => {
        console.log(`${data}`)
      })
      child.on('close', code => {
        if (code === 0) {
          resolve(true)
        } else {
          reject(new Error("Faild to execute the command: 'yarn --version'"))
        }
      })
    } else {
      child = spawn('npm', ['--version'])
      child.stdout.on('data', data => {
        console.log(`${data}`)
      })
      child.stderr.on('data', data => {
        console.log(`${data}`)
      })
      child.on('close', code => {
        if (code === 0) {
          resolve(true)
        } else {
          reject(new Error("Faild to execute the command: 'npm --version'"))
        }
      })
    }
  })

const init = ({ isYarn = false } = { isYarn: false }) =>
  new Promise((resolve, reject) => {
    let child
    if (isYarn) {
      child = spawn('yarn', ['init', '-y'])
      child.stdout.on('data', data => {
        console.log(`${data}`)
      })
      child.stderr.on('data', data => {
        console.log(`${data}`)
      })
      child.on('close', code => {
        if (code === 0) {
          resolve(true)
        } else {
          reject(new Error("Faild to execute the command: 'yarn init -y'"))
        }
      })
    } else {
      child = spawn('npm', ['init', '-y'])
      child.stdout.on('data', data => {
        console.log(`${data}`)
      })
      child.stderr.on('data', data => {
        console.log(`${data}`)
      })
      child.on('close', code => {
        if (code === 0) {
          resolve(true)
        } else {
          reject(new Error("Faild to execute the command: 'npm init -y'"))
        }
      })
    }
  })

const add = (moduleName, { isDev = false, isYarn = false } = { isDev: false, isYarn: false }) =>
  new Promise((resolve, reject) => {
    let child
    if (isYarn) {
      child = isDev ? spawn('yarn', ['add', '--dev', moduleName]) : spawn('yarn', ['add', moduleName])
      child.stdout.on('data', data => {
        console.log(`${data}`)
      })
      child.stderr.on('data', data => {
        console.log(`${data}`)
      })
      child.on('close', code => {
        if (code === 0) {
          resolve(true)
        } else {
          reject(new Error("Faild to execute the command: 'yarn add'"))
        }
      })
    } else {
      child = isDev
        ? spawn('npm', ['install', '--save-dev', moduleName])
        : spawn('npm', ['install', '--save', moduleName])
      child.stdout.on('data', data => {
        console.log(`${data}`)
      })
      child.stderr.on('data', data => {
        console.log(`${data}`)
      })
      child.on('close', code => {
        if (code === 0) {
          resolve(true)
        } else {
          reject(new Error("Faild to execute the command: 'npm install'"))
        }
      })
    }
  })

const remove = (moduleName, { isYarn = false } = { isYarn: false }) =>
  new Promise((resolve, reject) => {
    let child
    if (isYarn) {
      child = spawn('yarn', ['remove', moduleName])
      child.stdout.on('data', data => {
        console.log(`${data}`)
      })
      child.stderr.on('data', data => {
        console.log(`${data}`)
      })
      child.on('close', code => {
        if (code === 0) {
          resolve(true)
        } else {
          reject(new Error("Faild to execute the command: 'yarn remove'"))
        }
      })
    } else {
      child = spawn('npm', ['uninstall', moduleName])
      child.stdout.on('data', data => {
        console.log(`${data}`)
      })
      child.stderr.on('data', data => {
        console.log(`${data}`)
      })
      child.on('close', code => {
        if (code === 0) {
          resolve(true)
        } else {
          reject(new Error("Faild to execute the command: 'npm uninstall'"))
        }
      })
    }
  })

export default {
  version,
  init,
  add,
  remove,
}
