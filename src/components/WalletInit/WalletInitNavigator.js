import {createStackNavigator} from 'react-navigation'

import LanguagePickerScreen from './LanguagePickerScreen'
import WalletInitScreen from './WalletInitScreen'
import CreateWalletScreen from './CreateWallet/CreateWalletScreen'
import RestoreWalletScreen from './RestoreWallet/RestoreWalletScreen'
import RecoveryPhraseScreen from './CreateWallet/RecoveryPhraseScreen'
// eslint-disable-next-line max-len
import RecoveryPhraseExplanationDialog from './CreateWallet/RecoveryPhraseExplanationDialog'
// eslint-disable-next-line max-len
import RecoveryPhraseConfirmationScreen from './CreateWallet/RecoveryPhraseConfirmationScreen'
// eslint-disable-next-line max-len
import RecoveryPhraseConfirmationDialog from './CreateWallet/RecoveryPhraseConfirmationDialog'
import {WALLET_INIT_ROUTES} from '../../RoutesList'

const WalletInitNavigator = createStackNavigator(
  {
    [WALLET_INIT_ROUTES.MAIN]: LanguagePickerScreen,
    [WALLET_INIT_ROUTES.INIT]: WalletInitScreen,
    [WALLET_INIT_ROUTES.CREATE_WALLET]: CreateWalletScreen,
    [WALLET_INIT_ROUTES.RESTORE_WALLET]: RestoreWalletScreen,
    [WALLET_INIT_ROUTES.RECOVERY_PHRASE]: RecoveryPhraseScreen,
    // eslint-disable-next-line max-len
    [WALLET_INIT_ROUTES.RECOVERY_PHRASE_DIALOG]: RecoveryPhraseExplanationDialog,
    // eslint-disable-next-line max-len
    [WALLET_INIT_ROUTES.RECOVERY_PHRASE_CONFIRMATION]: RecoveryPhraseConfirmationScreen,
    // eslint-disable-next-line max-len
    [WALLET_INIT_ROUTES.RECOVERY_PHRASE_CONFIRMATION_DIALOG]: RecoveryPhraseConfirmationDialog,
  },
  {
    initialRouteName: WALLET_INIT_ROUTES.MAIN,
    navigationOptions: {
      header: null,
    },
    cardStyle: {
      backgroundColor: 'transparent',
    },
  },
)

export default WalletInitNavigator
