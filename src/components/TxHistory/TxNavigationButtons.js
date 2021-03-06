// @flow

import React from 'react'
import {compose} from 'redux'
import {connect} from 'react-redux'
import {View} from 'react-native'
import {withHandlers} from 'recompose'

import {hasAnyTransaction} from '../../selectors'
import {WALLET_ROUTES} from '../../RoutesList'
import {Button} from '../UiKit'

import styles from './styles/TxNavigationButtons.style'

import iconSend from '../../assets/img/icon/send.png'
import iconReceive from '../../assets/img/icon/receive.png'

import type {NavigationScreenProp, NavigationState} from 'react-navigation'
import type {SubTranslation} from '../../l10n/typeHelpers'

const getTranslations = (state) => state.trans.TransactionHistoryScreeen

type Props = {
  navigation: NavigationScreenProp<NavigationState>,
  navigateToReceive: () => mixed,
  navigateToSend: () => mixed,
  translations: SubTranslation<typeof getTranslations>,
  sendDisabled: boolean,
}

const TxNavigationButtons = ({
  navigation,
  navigateToReceive,
  navigateToSend,
  translations,
  sendDisabled,
}: Props) => (
  <View style={styles.container}>
    <Button
      block
      disabled={sendDisabled}
      onPress={navigateToSend}
      title={translations.sendButton}
      style={styles.firstButton}
      iconImage={iconSend}
    />
    <Button
      block
      onPress={navigateToReceive}
      title={translations.receiveButton}
      iconImage={iconReceive}
    />
  </View>
)

export default compose(
  connect((state) => ({
    translations: getTranslations(state),
    sendDisabled: !hasAnyTransaction(state),
  })),
  withHandlers({
    navigateToReceive: ({navigation}) => (event) =>
      navigation.navigate(WALLET_ROUTES.RECEIVE),
    navigateToSend: ({navigation}) => (event) =>
      navigation.navigate(WALLET_ROUTES.SEND),
  }),
)(TxNavigationButtons)
