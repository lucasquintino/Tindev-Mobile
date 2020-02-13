import {createAppContainer, createSwitchNavigator} from 'react-navigation'

import Login from './Login'
import Main from './Main'

export default createAppContainer(
    createSwitchNavigator({
        Login,
        Main
    })
)