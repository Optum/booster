import { expect } from 'chai'
import * as path from 'path'
import {
  loadFixture,
  readFileContent,
  removeFiles,
  removeFolders,
  sandboxPathFor,
  writeFileContent,
} from '../../helper/file-helper'
import { command } from 'execa'
// Imported from another package to avoid duplication
// It is OK-ish, since integration tests are always run in the context of the whole monorepo
import { createSandboxProject } from '../../../../cli/src/common/sandbox'

const READ_MODEL_AUTH_PLACEHOLDER = "// Specify authorized roles here. Use 'all' to authorize anyone"
const READ_MODEL_PROJECTION_PLACEHOLDER = '/* NEW CartWithProjectionReadModel HERE */'

describe('Read model', () => {
  let readModelSandboxDir: string

  before(async () => {
    readModelSandboxDir = createSandboxProject(sandboxPathFor('read-model'))
  })

  after(async () => {
    await removeFolders([readModelSandboxDir])
  })

  const cliPath = path.join('..', '..', 'cli', 'bin', 'run')
  const EXPECTED_OUTPUT_REGEX = new RegExp(
    ['boost new:read-model', 'Verifying project', 'Creating new read model', 'Read model generated'].join('(.|\n)*')
  )

  context('valid read model', () => {
    describe('without fields', () => {
      it('should create new read model', async () => {
        const FILE_CART_READ_MODEL = `${readModelSandboxDir}/src/read-models/cart-read-model.ts`
        removeFiles([FILE_CART_READ_MODEL])

        const { stdout } = await command(`${cliPath} new:read-model CartReadModel`, { cwd: readModelSandboxDir })
        expect(stdout).to.match(EXPECTED_OUTPUT_REGEX)

        const expectedEntityContent = loadFixture('read-models/cart-read-model.ts')
        const entityContent = readFileContent(FILE_CART_READ_MODEL)
        expect(entityContent).to.equal(expectedEntityContent)

        // set Auth
        const updatedReadModelContent = entityContent.replace(READ_MODEL_AUTH_PLACEHOLDER, "'all'")

        writeFileContent(FILE_CART_READ_MODEL, updatedReadModelContent)
      })
    })

    describe('with fields', () => {
      it('should create new read model', async () => {
        const FILE_CART_WITH_FIELDS_READ_MODEL = `${readModelSandboxDir}/src/read-models/cart-with-fields-read-model.ts`

        const { stdout } = await command(
          cliPath + " new:read-model CartWithFieldsReadModel --fields 'items:Array<Item>'",
          { cwd: readModelSandboxDir, shell: true }
        )
        expect(stdout).to.match(EXPECTED_OUTPUT_REGEX)

        const expectedEntityContent = loadFixture('read-models/cart-with-fields-read-model.ts')
        const entityContent = readFileContent(FILE_CART_WITH_FIELDS_READ_MODEL)
        expect(entityContent).to.equal(expectedEntityContent)

        // set Auth
        let updatedReadModelContent = entityContent.replace(READ_MODEL_AUTH_PLACEHOLDER, "'all'")

        // Add Item import
        updatedReadModelContent = `import { Item } from '../common/item'\n${updatedReadModelContent}`

        writeFileContent(FILE_CART_WITH_FIELDS_READ_MODEL, updatedReadModelContent)
      })
    })

    describe('with projection', () => {
      it('should create new read model', async () => {
        const FILE_CART_WITH_PROJECTION_READ_MODEL = `${readModelSandboxDir}/src/read-models/cart-with-projection-read-model.ts`

        const { stdout } = await command(
          cliPath + " new:read-model CartWithProjectionReadModel --fields 'items:Array<Item>' --projects Cart:id",
          { cwd: readModelSandboxDir, shell: true }
        )
        expect(stdout).to.match(EXPECTED_OUTPUT_REGEX)

        const expectedEntityContent = loadFixture('read-models/cart-with-projection-read-model.ts')
        const entityContent = readFileContent(FILE_CART_WITH_PROJECTION_READ_MODEL)
        expect(entityContent).to.equal(expectedEntityContent)

        // set Auth
        let updatedReadModelContent = entityContent.replace(READ_MODEL_AUTH_PLACEHOLDER, "'all'")

        // Set projection return
        updatedReadModelContent = updatedReadModelContent.replace(
          READ_MODEL_PROJECTION_PLACEHOLDER,
          'new CartWithProjectionReadModel(entity.id, entity.cartItems)'
        )

        // Add Item import
        updatedReadModelContent = `import { Item } from '../common/item'\n${updatedReadModelContent}`

        writeFileContent(FILE_CART_WITH_PROJECTION_READ_MODEL, updatedReadModelContent)
      })
    })
  })

  context('invalid read model', () => {
    describe('missing read model name', () => {
      it('should fail', async () => {
        const { stderr } = await command(`${cliPath} new:read-model`, { cwd: readModelSandboxDir })

        expect(stderr).to.match(/You haven't provided a read model name, but it is required, run with --help for usage/)
      })
    })
  })
})
