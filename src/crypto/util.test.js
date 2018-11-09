// @flow
import jestSetup from '../jestSetup'

import {
  getMasterKeyFromMnemonic,
  getAccountFromMasterKey,
  getExternalAddresses,
  getAddressInHex,
  isValidAddress,
  encryptMasterKey,
  decryptMasterKey,
  formatBIP44,
  isValidMnemonic,
} from './util'

import longAddress from './__fixtures/long_address.json'

import {CARDANO_CONFIG, CONFIG} from '../config'

jestSetup.setup()

const mnemonic = [
  'dry balcony arctic what garbage sort',
  'cart shine egg lamp manual bottom',
  'slide assault bus',
].join(' ')

const externalAddresses = [
  'Ae2tdPwUPEZKAx4zt8YLTGxrhX9L6R8QPWNeefZsPgwaigWab4mEw1ECUZ7',
  'Ae2tdPwUPEZ8wGxWm9VbZXFJcgLeKQJWKqREVEtHXYdqsqc4bLeGqjSwrtu',
  'Ae2tdPwUPEZ6T9qZxpao8ciAgg6ahjHRq2jV45ndZ4oPXAwrTYqN9NGUPh4',
]

// getExternalAddresses
test('Can generate external addresses', async () => {
  expect.assertions(1)

  const masterKey = await getMasterKeyFromMnemonic(mnemonic)
  const account = await getAccountFromMasterKey(
    masterKey,
    CONFIG.WALLET.ACCOUNT_INDEX,
    CARDANO_CONFIG.TESTNET.PROTOCOL_MAGIC,
  )
  const addresses = await getExternalAddresses(account, [0, 1, 2])

  expect(addresses).toEqual(externalAddresses)
})

// getAddressInHex
test('Can convert address to hex', () => {
  const address = externalAddresses[0]
  // prettier-ignore
  // eslint-disable-next-line max-len
  const hex = '82d818582183581ce0256c34965ce528570c22f88073e625020288a1973c1e2d466d39bca0001ab7e3a79a'
  expect(getAddressInHex(address)).toEqual(hex)
})

test('Throws error when converting bad address', () => {
  expect(() => getAddressInHex('&*')).toThrow()
})

// isValidAddress
test('Can validate valid addresses', async () => {
  expect.assertions(externalAddresses.length)
  for (const address of externalAddresses) {
    const isValid = await isValidAddress(address)
    expect(isValid).toBe(true)
  }
})

// isValidAddress
test('Can validate long address', async () => {
  expect.assertions(1)
  const isValid = await isValidAddress(longAddress)
  expect(isValid).toBe(true)
})

test('Can validate invalid addresses', async () => {
  const addresses = [
    // should be invalid
    'Ae2tdPwUPEZKAx4zt8YLTGxrhX9L6R8QPWNeefZsPgwaigWab4mEw1ECUZ6',
    'Ae2tdPwUPEZKAx4zt8YLTGxrhX9L6R8QPWNeefZsPgwaigWab4mEw1ECUZ', // too short
    'Ae2tdPwUPEZKAx4zt8YLTGxrhX9L6R8QPWNeefZsPgwaigWab4mEw1ECUZ77', // too long
    '',
    'bad',
    'badChars&*/',
    '1234',
  ]
  expect.assertions(addresses.length)
  for (const address of addresses) {
    const isValid = await isValidAddress(address)
    expect(isValid).toBe(false)
  }
})

test('Can encrypt / decrypt masterKey', async () => {
  expect.assertions(1)
  const masterKey = await getMasterKeyFromMnemonic(mnemonic)
  const encryptedKey = await encryptMasterKey(masterKey, 'password')
  const decryptedKey = await decryptMasterKey(encryptedKey, 'password')

  expect(masterKey).toEqual(decryptedKey)
})

test('Make sure that we are using safe buffers', () => {
  // in response to https://github.com/nodejs/node/issues/4660
  expect(new Buffer(10).toString('hex')).toBe('00000000000000000000')
})

test('Can format address', () => {
  expect(formatBIP44(42, 'Internal', 47)).toBe("m/44'/1815'/42'/1/47")
})

test('Can validate valid mnemonic', () => {
  const isValid = isValidMnemonic(mnemonic)
  expect(isValid).toBe(true)
})

test('Can validate invalid mnemonic', () => {
  const unknownWordMnemonic = [
    'dry balcony arctic what garbage xxxtest',
    'cart shine egg lamp manual bottom',
    'slide assault bus',
  ].join(' ')
  const invalidChecksumMnemonic = [
    'easily exile that soup jealous canyon',
    'crisp track silver famous furnace seminar',
    'above marriage abandon',
  ].join(' ')

  const mnemonics = [
    '',
    'dry balcony', // invalid length
    unknownWordMnemonic,
    invalidChecksumMnemonic,
  ]

  for (const mnemonic of mnemonics) {
    const isValid = isValidMnemonic(mnemonic)
    expect(isValid).toBe(false)
  }
})
