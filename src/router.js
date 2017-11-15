import React, { PureComponent } from 'react';
import { BackHandler, Platform, View, StatusBar } from 'react-native';
import {
  addNavigationHelpers,
} from 'react-navigation';
import JPushModule from 'jpush-react-native';
import { connect } from 'react-redux';
import moment from 'moment';
import SplashScreen from 'react-native-splash-screen';
import { loadToken, getNetConfig, saveNetConfig, loadNetConfig } from './dvapack/storage';
import { createAction, NavigationActions, getCurrentScreen } from './utils';
import NetConfig from './config/NetConfig.json';
import ScanNetConfig from './components/Common/ScanNetConfig';
import AppNavigator from './containers/';

@connect(({ router }) => ({ router }))
class Router extends PureComponent {
  constructor(props) {
    super(props);
    this.state = {
      configload: true,
    };
  }
  async componentWillMount() {
    await loadNetConfig();
    const netconfig = await getNetConfig();
    if (!netconfig && !netconfig != null) {
      if (NetConfig.isAutoLoad) {
        const newconfig = [];
        NetConfig.Config.map((item, key) => {
          const netitem = {};
          netitem.neturl = `http://${item.configIp}:${item.configPort}`;
          if (key === 0) {
            netitem.isuse = true;
          } else {
            netitem.isuse = false;
          }
          newconfig.push(netitem);
        });
        saveNetConfig(newconfig);
      } else {
        this.setState({ configload: false });
        SplashScreen.hide();
      }
    }
    BackHandler.addEventListener('hardwareBackPress', this.backHandle);
  }
  async componentDidMount() {
    const user = await loadToken();

    // // 在收到点击事件之前调用此接口
    // if (Platform.OS === 'android') {
    //   JPushModule.notifyJSDidLoad((resultCode) => {
    //     if (resultCode === 0) {
    //     }
    //   });
    // }

    if (user) {
      if (Platform.OS === 'android') {
        JPushModule.setAlias(user.User_Account, (map) => {
          if (map.errorCode === 0) {
            console.log('set alias succeed');
          } else {
            console.log(`set alias failed, errorCode: ${map.errorCode}`);
          }
        });
      } else {
        JPushModule.setAlias(user.User_Account, () => {
          console.log('set alias succeed');
        }, () => {
          console.log(`set alias failed, errorCode: ${map.errorCode}`);
        });
      }
    }
    this.props.dispatch(createAction('app/loadglobalvariable')({ user }));
    JPushModule.addOpenNotificationLaunchAppListener((result) => {
      console.log('notification open');
    });

    JPushModule.addReceiveOpenNotificationListener((result) => {
      let resultjson = null;
      if (Platform.OS === 'ios') {
        resultjson = result;
      } else {
        resultjson = JSON.parse(result.extras);
      }
      if (resultjson != null) {
        this
          .props
          .dispatch(createAction('app/changebadge')({ badge: -1 }));
        this
          .props
          .dispatch(NavigationActions.navigate({
            routeName: 'AlarmDetail',
            params: {
              pointname: resultjson.PointName,
              alarmbegindate: moment(resultjson.FirstTime).format('YYYY-MM-DD HH:mm:ss'),
              alarmdgimn: resultjson.DGIMN,
              alarmenddate: moment(resultjson.LastTime).format('YYYY-MM-DD HH:mm:ss'),
            },
          }));
      }
    });

    JPushModule.addReceiveNotificationListener((result) => {
      // alert('addReceiveNotificationListener','addReceiveNotificationListener')
    });
    JPushModule.addReceiveCustomMsgListener((map) => {
      let Message = null;
      if (Platform.OS === 'ios') {
        Message = JSON.parse(map.content);
      } else {
        Message = JSON.parse(map.message);
      }
      const title = `${Message.EntName}-${Message.OutputName}`;
      let message = '';
      let subText = '';
      if (Message.AlarmType === '2') {
        datatype = Message.DataType === 'RealTimeData' ? '实时数据' : Message === 'MinuteData' ? '分钟数据' : Message === 'HourData' ? '小时数据' : '日数据';
        message = `${Message.FirstOverTime}-${
          Message.AlarmTime} ${
          Message.PolluntantName} ${
          datatype} 监测浓度 ${
          Message.AlarmValue} 超标 ${
          Message.Level} 标准:${
          Message.StandardValue} 超标倍数: ${
          Message.Multiple}`;
        subText = `${Message.PolluntantName} 检测值 ${Message.AlarmValue} 超标 ${Message.Level}`;
      } else {
        datatype = Message.DataType === 'RealTimeData' ? '实时数据' : Message === 'MinuteData' ? '分钟数据' : Message === 'HourData' ? '小时数据' : '日数据';
        message = `${Message.FirstOverTime}-${
          Message.AlarmTime} ${
          Message.PolluntantName} ${
          datatype} 监测浓度 ${
          Message.ExceptionType} ${
          Message.AlarmCount} 次 `;
        subText = `${Message.PolluntantName} 检测值 ${Message.ExceptionType} ${Message.AlarmCount} 次 `;
      }

      const currentDate = new Date();
      JPushModule.sendLocalNotification({
        buildId: 1,
        id: 1,
        title,
        content: message,
        extra: {
          DGIMN: Message.DGIMN,
          FirstTime: Message.FirstOverTime,
          LastTime: Message.AlarmTime,
          PointName: Message.OutputName,
        },
        fireTime: currentDate.getTime() + 1000,
        badge: 0,
        soundName: null,
        subtitle: subText,
      });
      this.props.dispatch(createAction('app/changebadge')({
        badge: 1,
      }));
    });
  }
  componentWillUnmount() {
    if (Platform.OS === 'android') {
      BackHandler.removeEventListener('hardwareBackPress', this.backHandle);
      JPushModule.removeReceiveCustomMsgListener(receiveCustomMsgEvent);
      JPushModule.removeReceiveNotificationListener(receiveNotificationEvent);
      JPushModule.removeReceiveOpenNotificationListener(openNotificationEvent);
      JPushModule.removeGetRegistrationIdListener(getRegistrationIdEvent);
      JPushModule.clearAllNotifications();
    } else {
      DeviceEventEmitter.removeAllListeners();
      NativeAppEventEmitter.removeAllListeners();
    }
  }

  backHandle = () => {
    const currentScreen = getCurrentScreen(this.props.router);
    if (currentScreen === 'Login') {
      return true;
    }
    if (currentScreen !== 'Home') {
      this.props.dispatch(NavigationActions.back());
      return true;
    }
    return false;
  }
  render() {
    if (!this.state.configload) {
      return (
        <View style={{ flex: 1 }}>
          <StatusBar
            barStyle="light-content"
          />
          <ScanNetConfig ScanSuccess={() => {
            this.setState({ configload: true });
          }}
          />
        </View>
      );
    }
    const { dispatch, router } = this.props;
    const navigation = addNavigationHelpers({ dispatch, state: router });
    return (
      <View style={{ flex: 1 }}>
        <AppNavigator navigation={navigation} />
      </View>
    );
  }
}

export function routerReducer(state, action = {}) {
  return AppNavigator.router.getStateForAction(action, state);
}

export default Router;
