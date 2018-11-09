const semver = require('semver')

const validateTemplate = data => {
  const errors = []

  if (data.default && typeof data.default !== 'boolean')
    errors.push("'default' property must be a boolean")

  if (data.dependencies && typeof data.dependencies !== 'object')
    errors.push("'dependencies' property must be an object")

  if (
    data.dependencies &&
    typeof data.dependencies === 'object' &&
    Object.keys(data.dependencies).length > 0
  ) {
    const isValidVersion = Object.values(data.dependencies).every(
      value => semver.validRange(value) !== null
    )
    if (!isValidVersion)
      errors.push("module version in 'dependencies' must be a semantic version")
  }

  if (data.devDependencies && typeof data.devDependencies !== 'object')
    errors.push("'devDependencies' property must be an object")

  if (
    data.devDependencies &&
    typeof data.devDependencies === 'object' &&
    Object.keys(data.devDependencies).length > 0
  ) {
    const isValidVersion = Object.values(data.devDependencies).every(
      value => semver.validRange(value) !== null
    )
    if (!isValidVersion)
      errors.push(
        "module version in 'devDependencies' must be a semantic version"
      )
  }

  if (data.files && typeof data.files !== 'object')
    errors.push("'files' property must be an object")

  return {
    errors,
  }
}

export { validateTemplate } // eslint-disable-line
