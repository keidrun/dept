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

    test('should be valid if the module versions in dependencies and devDependencies are correct', () => {
      const template = {
        default: false,
        dependencies: {
          express: '4.16.4',
          mongoose: '5.3',
          helmet: '3',
          cors: '*',
          passport: '',
          'passport-facebook': '^2.1.1',
          'passport-google': '0.3.x',
          'passport-strategy': '1.x.x',
          'passport-github': 'x',
          winston: '>=3.1.0',
        },
        devDependencies: {
          eslint: '5.8.0',
          nodemon: '1.18',
          prettier: '1',
          jest: '*',
          'eslint-plugin-node': '',
          'eslint-config-airbnb-base': '^13.1.0',
          'eslint-config-prettier': '3.1.x',
          'eslint-plugin-import': '2.x.x',
          'eslint-plugin-jest': 'x',
          'eslint-plugin-prettier': '>=3.0.0',
        },
        files: {},
      }

      const result = validateTemplate(template)

      expect(result.errors).toHaveLength(0)
    })

    test('should be invalid if the module version in dependencies is wrong string', () => {
      const template = {
        default: false,
        dependencies: {
          express: '4.16.4',
          mongoose: 'none',
          helmet: '3',
          cors: '*',
        },
        devDependencies: {
          eslint: '5.8.0',
          nodemon: '1.18',
          prettier: '1',
          jest: '*',
        },
        files: {},
      }

      const result = validateTemplate(template)

      expect(result.errors).toHaveLength(1)
      expect(result.errors).toEqual([
        "module version in 'dependencies' must be a semantic version",
      ])
    })

    test('should be invalid if the module version in devDependencies is wrong string', () => {
      const template = {
        default: false,
        dependencies: {
          express: '4.16.4',
          mongoose: '1.18',
          helmet: '3',
          cors: '*',
        },
        devDependencies: {
          eslint: '5.8.0',
          nodemon: 'none',
          prettier: '1',
          jest: '*',
        },
        files: {},
      }

      const result = validateTemplate(template)

      expect(result.errors).toHaveLength(1)
      expect(result.errors).toEqual([
        "module version in 'devDependencies' must be a semantic version",
      ])
    })
  })
})
