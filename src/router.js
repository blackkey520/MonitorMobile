import React, { PureComponent } from 'react'
import { BackHandler,Platform, Animated, Easing,NetInfo,View,TouchableOpacity,Text,Modal,Dimensions } from 'react-native'
import {
  StackNavigator,
  TabNavigator,
  addNavigationHelpers,
} from 'react-navigation'
import { loadToken,saveNetConfig,loadNetConfig } from './logics/rpc';
import JPushModule from 'jpush-react-native';

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
import NetConfig from './config/NetConfig.json';
import moment from 'moment'
import { createAction, NavigationActions } from './utils'
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH=Dimensions.get('window').width;
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
    },
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
    Main: { screen: MainNavigator }
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
  constructor(props) {
    super(props);

    this.state = {
      modalVisible:false
    };
  }
  async componentWillMount() {
    BackHandler.addEventListener('hardwareBackPress', this.backHandle)
  }
  isCon(b){
    if(!b)
    {
      this.setState({
        modalVisible:true
      });
    }
 }

 changeCon(info){

    if(Platform.OS === 'android')
    {
      if(info=='NONE')
      {
        this.setState({
          modalVisible:true
        });
      }else if(info=='WIFI')
      {
        let netconfig=NetConfig[0];
        netconfig.neturl="http://"+netconfig.configIp+":"+netconfig.configPort;
        saveNetConfig(netconfig);
      }else if(info=='MOBILE')
      {
        let netconfig=NetConfig[1];
        netconfig.neturl="http://"+netconfig.configIp+":"+netconfig.configPort;
        saveNetConfig(netconfig);
      }

    }else{
      if(info=='none')
      {
        this.setState({
          modalVisible:true
        });
      }else if(info=='wifi')
      {
        let netconfig=NetConfig[0];
        netconfig.neturl="http://"+netconfig.configIp+":"+netconfig.configPort;
        saveNetConfig(netconfig);
      }else if(info=='cell')
      {
        let netconfig=NetConfig[1];
        netconfig.neturl="http://"+netconfig.configIp+":"+netconfig.configPort;
        saveNetConfig(netconfig);
      }

    }
 }
  async componentDidMount() {
    //监听网络是否链接
        NetInfo.isConnected.addEventListener('isCon',this.isCon.bind(this));
        //监听网络变化
        NetInfo.addEventListener('changeCon',this.changeCon.bind(this));




        //网络链接的信息
        NetInfo.fetch().done((info) => {

          if(Platform.OS === 'android')
          {
            if(info=='NONE')
            {
              this.setState({
                modalVisible:true
              });
            }else if(info=='WIFI')
            {
              let netconfig=NetConfig[0];
              netconfig.neturl="http://"+netconfig.configIp+":"+netconfig.configPort;
              saveNetConfig(netconfig);
            }else if(info=='MOBILE')
            {
              let netconfig=NetConfig[1];
              netconfig.neturl="http://"+netconfig.configIp+":"+netconfig.configPort;
              saveNetConfig(netconfig);
            }

          }else{
            if(info=='none')
            {
              this.setState({
                modalVisible:true
              });
            }else if(info=='wifi')
            {
              let netconfig=NetConfig[0];
              netconfig.neturl="http://"+netconfig.configIp+":"+netconfig.configPort;
              saveNetConfig(netconfig);
            }else if(info=='cell')
            {
              let netconfig=NetConfig[1];
              netconfig.neturl="http://"+netconfig.configIp+":"+netconfig.configPort;
              saveNetConfig(netconfig);
            }

          }
        });


    let user=await loadToken();
       // 在收到点击事件之前调用此接口
       if(Platform.OS === 'android')
       {
         JPushModule.notifyJSDidLoad((resultCode) => {
             if (resultCode === 0) {
             }
         });
       }
       if(user)
       {
         if(Platform.OS === 'android')
         {
           JPushModule.setAlias(user.User_Account, (map) => {
             if (map.errorCode === 0) {
               console.log("set alias succeed");
             } else {
               console.log("set alias failed, errorCode: " + map.errorCode);
             }
           });
         }else{
           JPushModule.setAlias(user.User_Account, () => {
           				console.log("set alias succeed");
           			},() => {
           				console.log("set alias failed, errorCode: " + map.errorCode);
           			});
         }
       }
        JPushModule.addOpenNotificationLaunchAppListener((result) => {
          console.log('notification open');
        })

        JPushModule.addReceiveOpenNotificationListener((result) => {
          this.props.dispatch(createAction('app/changebadge')({
            badge:-1
          }));
          this.props.dispatch(NavigationActions.navigate({
            routeName: 'AlarmDetail',params:{pointname:result.PointName,
            alarmbegindate:moment(result.FirstTime).format('YYYY-MM-DD HH:mm:ss'),
            alarmdgimn:result.DGIMN,
            alarmenddate:moment(result.LastTime).format('YYYY-MM-DD HH:mm:ss')
          },
          }));
        })

        JPushModule.addReceiveNotificationListener((result) => {
          // alert('addReceiveNotificationListener','addReceiveNotificationListener')
        })
       JPushModule.addReceiveCustomMsgListener((map) => {
         let Message=null;
          if(Platform.OS=='ios'){
            Message=JSON.parse(map.content);
          }else{
            Message=JSON.parse(map.message);
          }
          let title=Message.EntName+'-'+Message.OutputName;
          let message='';
          let subText=''
          if(Message.AlarmType=='2')
          {
            datatype=Message.DataType=='RealTimeData'?'实时数据':Message=='MinuteData'?'分钟数据':Message=='HourData'?'小时数据':'日数据';
            message=Message.FirstOverTime+'-'
            +Message.AlarmTime+' '
            +Message.PolluntantName+' '
            +datatype+' 监测浓度 '
            +Message.AlarmValue +' 超标 '
            +Message.Level+' 标准:'
            +Message.StandardValue+' 超标倍数: '
            +Message.Multiple
            subText=Message.PolluntantName+' 检测值 '+Message.AlarmValue+' 超标 '+Message.Level;
          }
          else{
            datatype=Message.DataType=='RealTimeData'?'实时数据':Message=='MinuteData'?'分钟数据':Message=='HourData'?'小时数据':'日数据';
            message=Message.FirstOverTime+'-'
            +Message.AlarmTime+' '
            +Message.PolluntantName+' '
            +datatype+' 监测浓度 '
            +Message.ExceptionType + ' '
            +Message.AlarmCount+' 次 '
            subText=Message.PolluntantName+' 检测值 '+Message.ExceptionType+' '+Message.AlarmCount+' 次 ';
          }
          // PushNotification.localNotification({
          //     /* Android Only Properties */
          //     id: '0', // (optional) Valid unique 32 bit integer specified as string. default: Autogenerated Unique ID
          //     ticker: title+message, // (optional)
          //     autoCancel: true, // (optional) default: true
          //     largeIcon: "desk_logo1.png", // (optional) default: "ic_launcher"
          //     smallIcon: "desk_logo1.png", // (optional) default: "ic_notification" with fallback for "ic_launcher"
          //     // bigText: message, // (optional) default: "message" prop
          //     tag:Message.DGIMN+'|'+Message.PolluntantCode,
          //     subText: subText , // (optional) default: none
          //     color: "red", // (optional) default: system default
          //     vibrate: true, // (optional) default: true
          //     vibration: 300, // vibration length in milliseconds, ignored if vibrate=false, default: 1000
          //     group: Message.OutputName, // (optional) add group to message
          //     ongoing: false, // (optional) set whether this is an "ongoing" notification
          //     /* iOS only properties */
          //     // alertAction: // (optional) default: view
          //     // category: // (optional) default: null
          //     // userInfo: // (optional) default: null (object containing additional notification data)
          //
          //     /* iOS and Android properties */
          //     title: title, // (optional, for iOS this is only used in apple watch, the title will be the app name on other iOS devices)
          //     message: message, // (required)
          //     playSound: true, // (optional) default: true
          //     soundName: 'default', // (optional) Sound to play when the notification is shown. Value of 'default' plays the default sound. It can be set to a custom sound such as 'android.resource://com.xyz/raw/my_sound'. It will look for the 'my_sound' audio file in 'res/raw' directory and play it. default: 'default' (default sound is played)
          //     number: 1, // (optional) Valid 32 bit integer specified as string. default: none (Cannot be zero)
          // });
          // console.log(message);
          if(Platform.OS === 'ios')
          {
            JPushModule.setLocalNotification(moment().add(5,'second'),message,0, 'Action', Message.DGIMN,
            {DGIMN: Message.DGIMN,FirstTime:Message.FirstOverTime,LastTime:Message.AlarmTime,
            PointName:Message.OutputName}, null);
          }
          this.props.dispatch(createAction('app/changebadge')({
            badge:1
          }));
       });
      //  JPushModule.setStyleCustom();


     }
  componentWillUnmount() {
    //移除监听
        NetInfo.isConnected.removeEventListener('isCon',this.isCon);

        NetInfo.removeEventListener('changeCon',this.changeCon);
    if(Platform.OS === 'android')
    {
        BackHandler.removeEventListener('hardwareBackPress', this.backHandle)
      JPushModule.removeReceiveCustomMsgListener(receiveCustomMsgEvent);
      JPushModule.removeReceiveNotificationListener(receiveNotificationEvent);
      JPushModule.removeReceiveOpenNotificationListener(openNotificationEvent);
      JPushModule.removeGetRegistrationIdListener(getRegistrationIdEvent);
       JPushModule.clearAllNotifications();
    }else{
      DeviceEventEmitter.removeAllListeners();
      NativeAppEventEmitter.removeAllListeners();
    }

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
    return (
      <View style={{flex:1}}>
        <AppNavigator navigation={navigation} />
        {/* <TouchableOpacity onPress={()=>{
          this.setState({
            modalVisible:true
          });
        }}>
          <Text>{'fdsadas'}</Text>
        </TouchableOpacity> */}
        <Modal
          animationType={"none"}
          transparent={false}
          visible={this.state.modalVisible}
          onRequestClose={() => {}}
          >
            <View style={{flex:1,alignItems: 'center',justifyContent: 'center'}}>
              <TouchableOpacity onPress={()=>{
                let aaa=this.props;
                //获取最新路由中请求数据的action，重新请求，今天疲了，下次再战
                //检查网络是否链接 返回true/fase
                NetInfo.isConnected.fetch().done((b) => {
                    if(b)
                    {
                      this.setState({
                        modalVisible:false
                      });
                    }else{

                    }
                });

              }} style={{marginTop: 22}}>
                <Text>{'程序出错点击重试'}</Text>
              </TouchableOpacity>
            </View>

        </Modal>
      </View>
    )
  }
}

export function routerReducer(state, action = {}) {
  return AppNavigator.router.getStateForAction(action, state)
}

export default Router
