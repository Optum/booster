import { expect } from '../expect'
import { restore, fake, replace } from 'sinon'
import { ProviderLibrary, BoosterConfig } from '@boostercloud/framework-types'
import * as Start from '../../src/commands/start'
import * as providerService from '../../src/services/provider-service'
import { oraLogger } from '../../src/services/logger'
import { Config } from '@oclif/core'
import { runCommand } from '@oclif/test'
import * as environment from '../../src/services/environment'
import * as configService from '../../src/services/config-service'
import * as projectChecker from '../../src/services/project-checker'

import rewire = require('rewire')
const start = rewire('../../src/commands/start')
const runTasks = start.__get__('runTasks')

describe('start', () => {
  beforeEach(() => {
    delete process.env.BOOSTER_ENV
  })

  afterEach(() => {
    restore()
  })

  describe('runTasks function', () => {
    it('calls the runner for the local server', async () => {
      const fakeProvider = {} as ProviderLibrary
      const fakeConfig = {
        provider: fakeProvider,
        appName: 'fake-app',
      }

      const fakeLoader = fake.resolves(fakeConfig)
      const fakeRunner = fake()
      replace(environment, 'currentEnvironment', fake.returns('test-env'))

      await runTasks(3000, fakeLoader, fakeRunner)

      expect(fakeRunner).to.have.been.calledOnce
    })
  })

  describe('run', () => {
    context('when no environment provided', async () => {
      it('shows no environment provided error', async () => {
        const {stdout} = await runCommand<{name: string}>(['start'], { root: __dirname })
        expect(stdout).to.match(/No environment set/)
      })
    })
  })

  describe('start class', () => {
    beforeEach(() => {
      const config = new BoosterConfig('fake_environment')
      replace(configService, 'compileProjectAndLoadConfig', fake.resolves(config))
      replace(providerService, 'startProvider', fake.resolves({}))
      replace(projectChecker, 'checkCurrentDirBoosterVersion', fake.resolves({}))
      replace(oraLogger, 'fail', fake.resolves({}))
      replace(oraLogger, 'info', fake.resolves({}))
      replace(oraLogger, 'start', fake.resolves({}))
      replace(oraLogger, 'succeed', fake.resolves({}))
    })

    it('init calls checkCurrentDirBoosterVersion', async () => {
      const config = await Config.load()
      await new Start.default([], config).init()
      expect(projectChecker.checkCurrentDirBoosterVersion).to.have.been.called
    })

    it('without flags', async () => {
      const config = await Config.load()
      await new Start.default([], config).run()

      expect(configService.compileProjectAndLoadConfig).to.have.not.been.called
      expect(providerService.startProvider).to.have.not.been.called
      expect(oraLogger.fail).to.have.been.calledWithMatch(/No environment set/)
    })

    it('with -e flag incomplete', async () => {
      let exceptionThrown = false
      let exceptionMessage = ''
      try {
        const config = await Config.load()
        await new Start.default(['-e'], config).run()
      } catch (e) {
        exceptionThrown = true
        exceptionMessage = e.message
      }
      expect(exceptionThrown).to.be.equal(true)
      expect(exceptionMessage).to.to.contain('--environment expects a value')
      expect(configService.compileProjectAndLoadConfig).to.have.not.been.called
      expect(providerService.startProvider).to.have.not.been.called
    })

    it('with --environment flag incomplete', async () => {
      let exceptionThrown = false
      let exceptionMessage = ''
      try {
        const config = await Config.load()
        await new Start.default(['--environment'], config).run()
      } catch (e) {
        exceptionThrown = true
        exceptionMessage = e.message
      }
      expect(exceptionThrown).to.be.equal(true)
      expect(exceptionMessage).to.to.contain('--environment expects a value')
      expect(configService.compileProjectAndLoadConfig).to.have.not.been.called
      expect(providerService.startProvider).to.have.not.been.called
    })

    describe('inside a booster project', () => {
      it('entering correct environment', async () => {
        const config = await Config.load()
        await new Start.default(['-e', 'fake_environment'], config).run()

        expect(configService.compileProjectAndLoadConfig).to.have.been.called
        expect(providerService.startProvider).to.have.been.called
        expect(oraLogger.start).to.have.been.calledWithMatch(/Starting debug server on port/)
      })

      it('entering correct environment and --port flag', async () => {
        const config = await Config.load()
        await new Start.default(['-e', 'fake_environment', '--port', '5000'], config).run()

        expect(configService.compileProjectAndLoadConfig).to.have.been.called
        expect(providerService.startProvider).to.have.been.called
        expect(oraLogger.start).to.have.been.calledWithMatch(/Starting debug server on port 5000/)
      })

      it('entering correct environment and -p flag', async () => {
        const config = await Config.load()
        await new Start.default(['-e', 'fake_environment', '-p', '5000'], config).run()

        expect(configService.compileProjectAndLoadConfig).to.have.been.called
        expect(providerService.startProvider).to.have.been.called
        expect(oraLogger.start).to.have.been.calledWithMatch(/Starting debug server on port 5000/)
      })

      it('entering correct environment and nonexisting flag', async () => {
        let exceptionThrown = false
        let exceptionMessage = ''
        try {
          const config = await Config.load()
          await new Start.default(['-e', 'fake_environment', '--nonexistingoption'], config).run()
        } catch (e) {
          exceptionThrown = true
          exceptionMessage = e.message
        }
        expect(exceptionThrown).to.be.equal(true)
        expect(exceptionMessage).to.contain('Nonexistent flag: --nonexistingoption')
        expect(configService.compileProjectAndLoadConfig).to.have.not.been.called
        expect(providerService.startProvider).to.have.not.been.called
        expect(oraLogger.start).to.have.not.been.calledWithMatch(/Starting debug server on port/)
      })

      it('entering correct environment and --port with incomplete port number', async () => {
        let exceptionThrown = false
        let exceptionMessage = ''
        try {
          const config = await Config.load()
          await new Start.default(['-e', 'fake_environment', '--port'], config).run()
        } catch (e) {
          exceptionThrown = true
          exceptionMessage = e.message
        }
        expect(exceptionThrown).to.be.equal(true)
        expect(exceptionMessage).to.contain('--port expects a value')
        expect(configService.compileProjectAndLoadConfig).to.have.not.been.called
        expect(providerService.startProvider).to.have.not.been.called
        expect(oraLogger.start).to.have.not.been.calledWithMatch(/Starting debug server on port/)
      })

      it('entering correct environment and -p with incomplete port number', async () => {
        let exceptionThrown = false
        let exceptionMessage = ''
        try {
          const config = await Config.load()
          await new Start.default(['-e', 'fake_environment', '-p'], config).run()
        } catch (e) {
          exceptionThrown = true
          exceptionMessage = e.message
        }
        expect(exceptionThrown).to.be.equal(true)
        expect(exceptionMessage).to.contain('--port expects a value')
        expect(configService.compileProjectAndLoadConfig).to.have.not.been.called
        expect(providerService.startProvider).to.have.not.been.called
        expect(oraLogger.start).to.have.not.been.calledWithMatch(/Starting debug server on port/)
      })

      it('without defining environment and -p', async () => {
        const config = await Config.load()
        await new Start.default(['-p', '5000'], config).run()

        expect(configService.compileProjectAndLoadConfig).to.have.not.been.called
        expect(providerService.startProvider).to.have.not.been.called
        expect(oraLogger.fail).to.have.been.calledWithMatch(/No environment set/)
      })
    })
  })
})
