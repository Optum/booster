import * as ProjectChecker from '../../../src/services/project-checker'
import { restore, replace, fake, stub } from 'sinon'
import Type from '../../../src/commands/new/type'
import Mustache = require('mustache')
import * as fs from 'fs-extra'
import { Config } from '@oclif/core'
import { expect } from '../../expect'
import { template } from '../../../src/services/generator'

describe('new', (): void => {
  describe('Type', () => {
    const typeName = 'ExampleType'
    const typesRoot = 'src/common/'
    const typePath = `${typesRoot}example-type.ts`
    const defaultTypeImports = [
      {
        packagePath: '@boostercloud/framework-core',
        commaSeparatedComponents: 'Type',
      },
      {
        packagePath: '@boostercloud/framework-types',
        commaSeparatedComponents: 'Register',
      },
    ]
    const uuidTypeImports = [
      {
        packagePath: '@boostercloud/framework-core',
        commaSeparatedComponents: 'Type',
      },
      {
        packagePath: '@boostercloud/framework-types',
        commaSeparatedComponents: 'Register, UUID',
      },
    ]

    const renderType = (imports: any[], name: string, fields: any[]): string => {
      return Mustache.render(template('type'), {
        imports: imports,
        name: name,
        fields: fields,
      })
    }

    beforeEach(() => {
      stub(ProjectChecker, 'checkCurrentDirIsABoosterProject').returnsThis()
      replace(fs, 'outputFile', fake.resolves({}))
      replace(ProjectChecker, 'checkCurrentDirBoosterVersion', fake.resolves({}))
    })

    afterEach(() => {
      restore()
    })

    it('init calls checkCurrentDirBoosterVersion', async () => {
      const config = await Config.load()
      await new Type([], config).init()
      expect(ProjectChecker.checkCurrentDirBoosterVersion).to.have.been.called
    })

    describe('Created correctly', () => {
      it('with no fields', async () => {      
        const config = await Config.load()
        await new Type([typeName], config).run()
        const renderedType = renderType(defaultTypeImports, typeName, [])
        expect(fs.outputFile).to.have.been.calledWithMatch(typePath, renderedType)
      })

      it('creates Type with a string field', async () => {
        const config = await Config.load()
        await new Type([typeName, '--fields', 'title:string'], config).run()
        const renderedType = renderType(defaultTypeImports, typeName, [{ name: 'title', type: 'string' }])
        expect(fs.outputFile).to.have.been.calledWithMatch(typePath, renderedType)
      })

      it('creates Type with a number field', async () => {
        const config = await Config.load()
        await new Type([typeName, '--fields', 'quantity:number'], config).run()
        const renderedType = renderType(defaultTypeImports, typeName, [{ name: 'quantity', type: 'number' }])
        expect(fs.outputFile).to.have.been.calledWithMatch(typePath, renderedType)
      })

      it('creates Type with UUID field', async () => {
        const config = await Config.load()
        await new Type([typeName, '--fields', 'identifier:UUID'], config).run()
        const renderedType = renderType(uuidTypeImports, typeName, [{ name: 'identifier', type: 'UUID' }])
        expect(fs.outputFile).to.have.been.calledWithMatch(typePath, renderedType)
      })

      it('creates Type with multiple fields', async () => {
        const config = await Config.load()
        await new Type(
          [typeName, '--fields', 'title:string', 'quantity:number', 'identifier:UUID'],
          config
        ).run()
        const fields = [
          { name: 'title', type: 'string' },
          { name: 'quantity', type: 'number' },
          { name: 'identifier', type: 'UUID' },
        ]
        const renderedType = renderType(uuidTypeImports, typeName, fields)
        expect(fs.outputFile).to.have.been.calledWithMatch(typePath, renderedType)
      })
    })

    describe('displays an error', () => {
      it('with empty Type name', async () => {
        replace(console, 'error', fake.resolves({}))
        const config = await Config.load()
        await new Type([], config).run()
        expect(fs.outputFile).to.have.not.been.calledWithMatch(typesRoot)
        expect(console.error).to.have.been.calledWithMatch(/You haven't provided a type name/)
      })

      it('with empty fields', async () => {
        let exceptionThrown = false
        let exceptionMessage = ''
        try {
          const config = await Config.load()
          await new Type([typeName, '--fields'], config).run()
        } catch (e) {
          exceptionThrown = true
          exceptionMessage = e.message
        }
        expect(exceptionThrown).to.be.equal(true)
        expect(exceptionMessage).to.be.equal('Flag --fields expects a value')
      })

      it('with field with no type', async () => {
        let exceptionThrown = false
        let exceptionMessage = ''
        try {
          const config = await Config.load()
          await new Type([typeName, '--fields', 'title'], config).run()
        } catch (e) {
          exceptionThrown = true
          exceptionMessage = e.message
        }
        expect(exceptionThrown).to.be.equal(true)
        expect(exceptionMessage).to.contain('Error parsing field title')
      })

      it('with no field type after :', async () => {
        let exceptionThrown = false
        let exceptionMessage = ''
        try {
          const config = await Config.load()
          await new Type([typeName, '--fields', 'title:'], config).run()
        } catch (e) {
          exceptionThrown = true
          exceptionMessage = e.message
        }
        expect(exceptionThrown).to.be.equal(true)
        expect(exceptionMessage).to.contain('Error parsing field title')
        expect(fs.outputFile).to.have.not.been.calledWithMatch(typePath)
      })

      it('with repeated fields', async () => {
        let exceptionThrown = false
        let exceptionMessage = ''
        try {
          const config = await Config.load()
          await new Type([typeName, '--fields', 'title:string', 'title:string', 'quantity:number'], config).run()
        } catch (e) {
          exceptionThrown = true
          exceptionMessage = e.message
        }
        expect(exceptionThrown).to.be.equal(true)
        expect(exceptionMessage).to.contain('Error parsing field title')
        expect(fs.outputFile).to.have.not.been.calledWithMatch(typePath)
      })
    })
  })
})
