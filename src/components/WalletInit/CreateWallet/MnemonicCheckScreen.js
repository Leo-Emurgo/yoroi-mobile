// @flow

import React from 'react'
import _ from 'lodash'
import {View, TouchableHighlight} from 'react-native'
import {compose} from 'redux'
import {connect} from 'react-redux'
import {withHandlers, withProps, withState} from 'recompose'

import assert from '../../../utils/assert'
import {ignoreConcurrentAsyncHandler} from '../../../utils/utils'
import {Text, Button} from '../../UiKit'
import Screen from '../../Screen'
import {ROOT_ROUTES} from '../../../RoutesList'
import {createWallet} from '../../../actions'
import {CONFIG} from '../../../config'

import {COLORS} from '../../../styles/config'
import styles from './styles/MnemonicCheckScreen.style'

import type {State} from '../../../state'
import type {SubTranslation} from '../../../l10n/typeHelpers'

const getTranslations = (state: State) => state.trans.MnemonicCheckScreen

const validatePhrase = (mnemonic, words, partialPhrase) => {
  const phrase = partialPhrase.map((wordIdx) => words[wordIdx]).join(' ')
  const isPhraseCorrect = phrase === mnemonic

  return isPhraseCorrect
}

const handleDeselectWord = ({setPartialPhrase, partialPhrase}) => (wordIdx) => {
  const newPhrase = partialPhrase.filter((idx) => idx !== wordIdx)

  setPartialPhrase(newPhrase)
}

const handleSelectWord = ({setPartialPhrase, partialPhrase}) => (wordIdx) =>
  setPartialPhrase([...partialPhrase, wordIdx])

const handleWalletConfirmation = ({navigation, createWallet}) => async () => {
  const mnemonic = navigation.getParam('mnemonic')
  const password = navigation.getParam('password')
  const name = navigation.getParam('name')
  assert.assert(!!mnemonic, 'handleWalletConfirmation:: mnemonic')
  assert.assert(!!password, 'handleWalletConfirmation:: password')
  assert.assert(!!name, 'handleWalletConfirmation:: name')

  await createWallet(name, mnemonic, password)
  navigation.navigate(ROOT_ROUTES.WALLET)
}

const Word = ({styles, word, handleOnPress, selected}) => (
  <View style={[styles.word, selected ? styles.selected : {}]}>
    <TouchableHighlight
      activeOpacity={0.1}
      underlayColor={COLORS.WHITE}
      onPress={handleOnPress}
      disabled={selected}
    >
      <Text style={selected ? styles.selectedText : {}}>{word}</Text>
    </TouchableHighlight>
  </View>
)
const EnhancedWord = withHandlers({
  handleOnPress: ({onPress, value}) => () => onPress(value),
})(Word)

type Props = {
  mnemonic: string,
  partialPhrase: Array<number>,
  translations: SubTranslation<typeof getTranslations>,
  words: Array<string>,
  confirmWalletCreation: () => mixed,
  handleClear: () => mixed,
  selectWord: (number) => mixed,
  deselectWord: (number) => mixed,
}

const MnemonicCheckScreen = ({
  mnemonic,
  partialPhrase,
  translations,
  words,
  confirmWalletCreation,
  handleClear,
  selectWord,
  deselectWord,
}: Props) => {
  const isPhraseComplete = partialPhrase.length === words.length
  const isPhraseValid = validatePhrase(mnemonic, words, partialPhrase)

  return (
    <Screen bgColor={COLORS.WHITE}>
      <View style={styles.container}>
        <Text>{translations.title}</Text>
        <Text style={styles.instructions}>{translations.instructions}</Text>

        <View style={styles.recoveryPhraseContainer}>
          <Text style={styles.inputLabel}>{translations.inputLabel}</Text>
          <View style={styles.recoveryPhrase}>
            {partialPhrase.map((index) => (
              <EnhancedWord
                value={index}
                key={index}
                selected={false}
                onPress={deselectWord}
                word={words[index]}
                styles={styles}
              />
            ))}
          </View>
          {/* prettier-ignore */ !isPhraseValid && isPhraseComplete && (
            <Text style={styles.error}>{translations.invalidPhrase}</Text>
          )}
        </View>

        <View style={styles.words}>
          {words.map((word, index) => (
            <EnhancedWord
              key={index}
              value={index}
              selected={partialPhrase.includes(index)}
              onPress={selectWord}
              word={word}
              styles={styles}
            />
          ))}
        </View>

        <View style={styles.buttons}>
          <Button onPress={handleClear} title={translations.clearButton} />

          <Button
            onPress={confirmWalletCreation}
            disabled={!isPhraseComplete || !isPhraseValid}
            title={translations.confirmButton}
          />
        </View>
      </View>
    </Screen>
  )
}

export default compose(
  connect(
    (state) => ({
      translations: getTranslations(state),
    }),
    {
      createWallet,
    },
  ),
  withState(
    'partialPhrase',
    'setPartialPhrase',
    /* prettier-ignore */
    CONFIG.DEBUG.PREFILL_FORMS
      ? _(CONFIG.DEBUG.MNEMONIC2.split(' '))
        .map((word, i) => ({word, i}))
        .sortBy(({word, i}) => word)
        .map(({word, i}, j) => [i, j])
        .sortBy(([i, j]) => i)
        .map(([i, j]) => j)
        .value()
      : [],
  ),
  withProps(({navigation}) => {
    const mnemonic = navigation.getParam('mnemonic')
    return {
      mnemonic,
      words: mnemonic.split(' ').sort(),
    }
  }),
  withHandlers({
    handleClear: ({setPartialPhrase}) => () => setPartialPhrase([]),
    selectWord: handleSelectWord,
    deselectWord: handleDeselectWord,
    confirmWalletCreation: ignoreConcurrentAsyncHandler(
      handleWalletConfirmation,
      1000,
    ),
  }),
)(MnemonicCheckScreen)