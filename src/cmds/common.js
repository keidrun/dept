import { dataControl } from '../utils'

const prettyLog = value => console.log(JSON.stringify(value, null, '\t'))

const promiseAllSerially = promises =>
  promises.reduce(
    (prevPromise, currentPromise) => prevPromise.then(currentPromise),
    Promise.resolve()
  )

const promiseAllParallelly = promises =>
  Promise.all(promises.map(promise => promise()))

const initialize = async () => {
  if (!(await dataControl.isFileExisted())) {
    await dataControl.init()
  }
}

export { prettyLog, promiseAllParallelly, promiseAllSerially, initialize }
