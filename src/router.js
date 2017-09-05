import React, { PureComponent } from 'react'
import { BackHandler, Animated, Easing } from 'react-native'
import {
  StackNavigator,
  TabNavigator,
  addNavigationHelpers,
  NavigationActions,
} from 'react-navigation'
import { loadToken } from './logics/rpc';
import SplashScreen from 'react-native-splash-screen'

import { connect } from 'dva'

import Login from './containers/Login'
import Home from './containers/Main/Home'
import Account from './containers/Main/Account'
import Search from './containers/Main/Search'
import Alarm from './containers/Alarm/Alarm'
import AlarmDetail from './containers/Alarm/AlarmDetail'
import AlarmFeedback from './containers/Alarm/AlarmFeedback'
import FeedbackDetail from './containers/Alarm/FeedbackDetail'
import MonitorPoint from './containers/Main/MonitorPoint'
import QRCodeScreen from './containers/Common/QRCodeScreen'
import Target from './containers/Main/Target'
import CollectPointList from './containers/Main/CollectPointList'
import ContactList from './containers/Common/ContactList'

const MainNavigator = StackNavigator(
  {
    Home: {
      path: 'home/:mode',
      screen: Home
    },
    Account: { screen: Account },
    Search:{screen:Search},
    Alarm:{screen:Alarm },
    CollectPointList:{screen:CollectPointList},
    ContactList:{screen:ContactList},
    QRCodeScreen:{
      screen:QRCodeScreen
    },
    MonitorPoint:{
      screen:MonitorPoint
    },
    Target:{
      path:'monitorpoint/:targettype',
      screen:Target
    },
    AlarmDetail:{
      path:'alarmdetail/:pointname',
      screen:AlarmDetail
    },
    AlarmFeedback:{
      path:'alarmfeedback/:dgimn',
      screen:AlarmFeedback
    },
    FeedbackDetail:{
      path:'alarmfeedback/:verifyid',
      screen:FeedbackDetail
    }
  },
  {
    initialRouteName:'Home',
    initialRouteParams:{mode:'list'},
    headerMode: 'float',
  }
)

const AppNavigator = StackNavigator(
  {
    Login: { screen: Login },
    Main: { screen: MainNavigator },
  },
  {
    headerMode: 'none',
    navigationOptions: {
      gesturesEnabled: false,
    },
    transitionConfig: () => ({
      transitionSpec: {
        duration: 300,
        easing: Easing.out(Easing.poly(4)),
        timing: Animated.timing,
      },
      screenInterpolator: sceneProps => {
        const { layout, position, scene } = sceneProps
        const { index } = scene

        const height = layout.initHeight
        const translateY = position.interpolate({
          inputRange: [index - 1, index, index + 1],
          outputRange: [height, 0, 0],
        })

        const opacity = position.interpolate({
          inputRange: [index - 1, index - 0.99, index],
          outputRange: [0, 1, 1],
        })

        return { opacity, transform: [{ translateY }] }
      },
    }),
  }
)

function getCurrentScreen(navigationState) {
  if (!navigationState) {
    return null
  }
  const route = navigationState.routes[navigationState.index]
  if (route.routes) {
    return getCurrentScreen(route)
  }
  return route.routeName
}

@connect(({ router }) => ({ router }))
class Router extends PureComponent {

  async componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.backHandle)
    // if (await loadToken()) {
    //     this.props.dispatch(NavigationActions.navigate({ routeName: 'Main' }))
    //   // this.props.dispatch(NavigationActions.reset({ index: 1,
    //   // actions: [
    //   //   NavigationActions.navigate({ routeName: 'Login'}),
    //   //   NavigationActions.navigate({ routeName: 'Main'})
    //   // ] }))
    // } else {
    //     this.props.dispatch(NavigationActions.navigate({ routeName: 'Login' }))
    //   // this.props.dispatch(NavigationActions.reset({ index: 0,
    //   // actions: [
    //   //   NavigationActions.navigate({ routeName: 'Login'}),
    //   //   NavigationActions.navigate({ routeName: 'Main'})
    //   // ] }))
    // }
    SplashScreen.hide();
  }

  componentWillUnmount() {
    BackHandler.removeEventListener('hardwareBackPress', this.backHandle)
  }

  backHandle = () => {
    const currentScreen = getCurrentScreen(this.props.router)
    if (currentScreen === 'Login') {
      return true
    }
    if (currentScreen !== 'Home') {
      this.props.dispatch(NavigationActions.back())
      return true
    }
    return false
  }

  render() {

    const { dispatch, router } = this.props
    const navigation = addNavigationHelpers({ dispatch, state: router })
    return <AppNavigator navigation={navigation} />
  }
}

export function routerReducer(state, action = {}) {
  return AppNavigator.router.getStateForAction(action, state)
}

export default Router
