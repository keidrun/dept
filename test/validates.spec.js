import { validateTemplate } from '../src/validates'

const templatesObj = {
  template1: {
    default: true,
    dependencies: {
      express: '*',
      mongoose: '^5.3.0',
    },
    devDependencies: {
      'airbnb-base': '*',
      prettier: '*',
      eslint: '*',
      jest: '*',
    },
    files: {
      fileA: {},
      '.eslintrc': {
        extends: [
          'airbnb-base',
          'plugin:prettier/recommended',
          'plugin:jest/recommended',
        ],
        plugins: ['node', 'prettier', 'jest'],
        env: {
          node: true,
        },
      },
      fileB: 'language: node_js\nnode_js:\n  - "10"',
    },
  },
}

describe('validates', () => {
  describe('validateTemplate function test', () => {
    test('should be valid if the input is correct format and has all properties with data', () => {
      const result = validateTemplate(templatesObj.template1)

      expect(result.errors).toHaveLength(0)
      expect(result.errors).toEqual([])
    })

    test('should be valid if the input is correct format and has all properties with empty', () => {
      const template = {
        default: false,
        dependencies: {},
        devDependencies: {},
        files: {},
      }

      const result = validateTemplate(template)

      expect(result.errors).toHaveLength(0)
      expect(result.errors).toEqual([])
    })

    test('should be valid if the input is correct format but empty', () => {
      const template = {}

      const result = validateTemplate(template)

      expect(result.errors).toHaveLength(0)
      expect(result.errors).toEqual([])
    })

    test('should be invalid if the input has all wrong properties', () => {
      const template = {
        default: 'none',
        dependencies: 'none',
        devDependencies: 'none',
        files: 'none',
      }

      const result = validateTemplate(template)

      expect(result.errors).toHaveLength(4)
      expect(result.errors).toEqual([
        "'default' property must be a boolean",
        "'dependencies' property must be an object",
        "'devDependencies' property must be an object",
        "'files' property must be an object",
      ])
    })

    test('should be invalid if the input has wrong default property', () => {
      const template = {
        default: 12345,
        dependencies: {},
        devDependencies: {},
        files: {},
      }

      const result = validateTemplate(template)

      expect(result.errors).toHaveLength(1)
      expect(result.errors).toEqual(["'default' property must be a boolean"])
    })

    test('should be invalid if the input has wrong dependencies property', () => {
      const template = {
        default: false,
        dependencies: 12345,
        devDependencies: {},
        files: {},
      }

      const result = validateTemplate(template)

      expect(result.errors).toHaveLength(1)
      expect(result.errors).toEqual([
        "'dependencies' property must be an object",
      ])
    })

    test('should be invalid if the input has wrong devDependencies property', () => {
      const template = {
        default: false,
        dependencies: {},
        devDependencies: 12345,
        files: {},
      }

      const result = validateTemplate(template)

      expect(result.errors).toHaveLength(1)
      expect(result.errors).toEqual([
        "'devDependencies' property must be an object",
      ])
    })

    test('should be invalid if the input has wrong files property', () => {
      const template = {
        default: false,
        dependencies: {},
        devDependencies: {},
        files: 12345,
      }

      const result = validateTemplate(template)

      expect(result.errors).toHaveLength(1)
      expect(result.errors).toEqual(["'files' property must be an object"])
    })
  })
})
