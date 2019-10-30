// @flow

import React from 'react'
import {Button} from '../UiKit'
import {createStackNavigator} from 'react-navigation'
import SendScreen from './SendScreen'
import ConfirmScreen from './ConfirmScreen'
import AddressReaderQR from './AddressReaderQR'
import BiometricAuthScreen from './BiometricAuthScreen'
import iconQR from '../../assets/img/qr_code.png'

import HeaderBackButton from '../UiKit/HeaderBackButton'
import {
  defaultNavigationOptions,
  defaultStackNavigatorOptions,
} from '../../navigationOptions'

import {SEND_ROUTES} from '../../RoutesList'

import styles from './styles/QrButton.style'

import {pastedFormatter} from './amountUtils'

const SendScreenNavigator = createStackNavigator(
  {
    [SEND_ROUTES.MAIN]: {
      screen: SendScreen,
      navigationOptions: ({navigation}) => ({
        title: navigation.getParam('title'),
        headerRight: (
          <Button
            style={styles.qrButton}
            onPress={() =>
              navigation.navigate(SEND_ROUTES.ADDRESS_READER_QR, {
                onSuccess: (stringQR) => {
                  const regex = /(cardano):([a-zA-Z1-9]\w+)\?/

                  if (regex.test(stringQR)) 
                  {
                    const address = stringQR.match(regex)[2]
                    const params = getParams(stringQR.substr(stringQR.indexOf('?')))

                    if ('amount' in params) 
                    {
                      setAddress(address, navigation)
                      setAmount(params.amount, navigation)
                    } 
                    else 
                    {
                      setAddress(address, navigation)
                    }
                  } 
                  else 
                  {
                    setAddress(stringQR, navigation)
                  }

                  navigation.navigate(SEND_ROUTES.MAIN)
                },
              })
            }
            iconImage={iconQR}
            title=""
            withoutBackground
          />
        ),
        ...defaultNavigationOptions,
      }),
    },
    [SEND_ROUTES.ADDRESS_READER_QR]: AddressReaderQR,
    [SEND_ROUTES.CONFIRM]: ConfirmScreen,
    [SEND_ROUTES.BIOMETRICS_SIGNING]: {
      screen: BiometricAuthScreen,
      navigationOptions: {
        header: null,
      },
    },
  },
  {
    initialRouteName: SEND_ROUTES.MAIN,
    navigationOptions: ({navigation}) => ({
      title: navigation.getParam('title'),
      headerLeft: <HeaderBackButton navigation={navigation} />,
      ...defaultNavigationOptions,
    }),
    ...defaultStackNavigatorOptions,
  },
)

function getParams(params) {
  const query = params.substr(1)
  const result = {}
  query.split('&').forEach(part => {
    const item = part.split('=')
    result[item[0]] = decodeURIComponent(item[1])
  })
  return result;
}

function setAddress(address, navigation) {
  const handlerAddress = navigation.getParam('onScanAddress')
  handlerAddress && handlerAddress(address)
}

function setAmount(amount, navigation) {
  const handlerAmount = navigation.getParam('onScanAmount')
  handlerAmount && handlerAmount(pastedFormatter(amount))
}

export default SendScreenNavigator
