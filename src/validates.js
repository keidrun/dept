const validateTemplate = data => {
  const errors = []

  if (data.default && typeof data.default !== 'boolean')
    errors.push("'default' property must be a boolean")

  if (data.dependencies && typeof data.dependencies !== 'object')
    errors.push("'dependencies' property must be an object")

  if (data.devDependencies && typeof data.devDependencies !== 'object')
    errors.push("'devDependencies' property must be an object")

  if (data.files && typeof data.files !== 'object')
    errors.push("'files' property must be an object")

  return {
    errors,
  }
}

export { validateTemplate } // eslint-disable-line
