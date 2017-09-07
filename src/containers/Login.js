/**
 * Created by tdzl2003 on 12/18/16.
 */

import React, { PropTypes, Component,PureComponent } from 'react';
import {
  View,
  StyleSheet,
  Platform,
  Dimensions,
  Image,
  Text,
  TextInput,
  TouchableOpacity
} from 'react-native';

import { connect } from 'dva'

import { createAction, NavigationActions } from '../utils'
import { Button } from 'antd-mobile';
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH=Dimensions.get('window').width;
import { loadLoginMsg,saveLoginMsg,loadToken,loadStorage,saveStorage} from '../logics/rpc';
import {loadawaitcheck} from '../services/alarmService'
import SplashScreen from 'react-native-splash-screen'
import JPushModule from 'jpush-react-native';
import moment from 'moment'
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
  const receiveCustomMsgEvent = "receivePushMsg";
  const receiveNotificationEvent = "receiveNotification";
  const openNotificationEvent = "openNotification";
  const getRegistrationIdEvent = "getRegistrationId";
@connect(({ app }) => ({ ismaintenance:app.ismaintenance,fetching:app.fetching }))
class Login extends PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      username:'',
      password:'',
      isreminber:'',
      autologin:''
    };
  }

  static navigationOptions={
    title:'Login',
  }
  async componentWillMount() {
    let loginmsg=await loadLoginMsg();
    if(loginmsg!=null)
    {
      this.setState(loginmsg);
    }
    let user=await loadToken();
    if (user) {
      this.props.dispatch(createAction('app/loaduser')({
        user:user
      }));
      console.log(user);
      JPushModule.setAlias(user.User_Account, (map) => {
				if (map.errorCode === 0) {
					console.log("set alias succeed");
				} else {
					console.log("set alias failed, errorCode: " + map.errorCode);
				}
			});
      let pollutanttype=await loadStorage('PollutantType');
      this.props.dispatch(createAction('point/fetchmore')({
          pollutantType:pollutanttype[0].ID
      }));
      let alarmCount = await loadawaitcheck({time:moment().format('YYYY-MM-DD')});
      const currentScreen = getCurrentScreen(this.props.router)
      if (currentScreen==null||currentScreen === 'Login') {
        this.props.dispatch(NavigationActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({ routeName: 'Main',params:{unverifiedCount:alarmCount.data.length,pollutanttype:pollutanttype} })],
        }))
      }
    }

     SplashScreen.hide();
  }
  _userLogin = async () => {
      let pollutanttype=await loadStorage('PollutantType');
      this.props.dispatch(createAction('app/login')({
        username:this.state.username,
        password:this.state.password,
        pollutanttype:pollutanttype
      }));
      await saveLoginMsg(this.state);
  };
  componentDidMount() {
       // 在收到点击事件之前调用此接口
       if(Platform.OS === 'android')
       {
         JPushModule.notifyJSDidLoad((resultCode) => {
             if (resultCode === 0) {
             }
         });
       }
       JPushModule.addReceiveNotificationListener((map) => {
          //  console.log("alertContent: " + map.alertContent);
          //  console.log("extras: " + map.extras);
           // var extra = JSON.parse(map.extras);
           // console.log(extra.key + ": " + extra.value);
       });
       JPushModule.addReceiveCustomMsgListener((map) => {
          console.log("message: " + map.message);
       });
      //  JPushModule.setStyleCustom();
       JPushModule.addReceiveOpenNotificationListener((map) => {
           console.log("Opening notification!");
           console.log("map.extra: " + map.key);
       });
     }
     componentWillUnmount() {
     		JPushModule.removeReceiveCustomMsgListener(receiveCustomMsgEvent);
     		JPushModule.removeReceiveNotificationListener(receiveNotificationEvent);
     		JPushModule.removeReceiveOpenNotificationListener(openNotificationEvent);
     		JPushModule.removeGetRegistrationIdListener(getRegistrationIdEvent);
     		console.log("Will clear all notifications");
        if(Platform.OS === 'android')
        {
     		   JPushModule.clearAllNotifications();
        }
     	}
    // 组件渲染方法
  render() {
    return (
        <View style={styles.LoginLayout}>
          {
            this.props.ismaintenance?
            <View style={{flex:1}}>
              <TouchableOpacity onPress={()=>{
                this.props.dispatch(createAction('search/changeScene')({
                  ismaintenance:false
                }));
              }}>
                <Text>{'系统维护中,点击重试'}</Text>
              </TouchableOpacity>
            </View>
            :
            <View style={{flex:1}}>
              <Image source={require('../images/bg_login.jpg')} style={styles.launchImageStyle}/>
              <View style={styles.LoginForm}>
                  <Image source={require('../images/bg_logo.png')} style={{height: 30,width: 80,marginBottom: 20,}}/>
                  <Text style={{fontSize: 25,width: 270,color: 'white',marginBottom: 50,}}>智能环境综合监控系统</Text>
                  <View style={[styles.TextInputStyle, {marginBottom: 10,},]}>
                      <Image source={require('../images/ueser_icon.png')} style={{width: 20,height: 20,marginBottom: 8,}}/>
                      <TextInput keyboardType={'default'} clearTextOnFocus placeholderTextColor="white"
                        placeholder="请输入用户名"
                        autoCapitalize={'none'} autoCorrect={false} underlineColorAndroid={'transparent'}
                        onChangeText={(text) => {
                        // 动态更新组件内State记录用户名
                          this.setState({
                            username:text
                          })
                        }} value={this.state.username}
                        style={{
                          width: SCREEN_WIDTH - 120,marginLeft: 10,paddingTop: 1,
                          paddingBottom: 1,color: 'white',height: 20,
                        }}
                      />
                  </View>
                  <View style={[styles.TextInputStyle, {marginBottom: 20,},]}>
                      <Image source={require('../images/password_icon.png')} style={{width: 20,height: 20,marginBottom: 8,}}/>
                      <TextInput clearTextOnFocus keyboardType={'default'}
                        placeholderTextColor="white" placeholder="请输入密码"
                        autoCapitalize={'none'} autoCorrect={false} underlineColorAndroid={'transparent'}
                        secureTextEntry onChangeText={(text) => {
                          // 动态更新组件内State记录密码
                          this.setState({
                            password:text
                          })
                        }}
                        value={this.state.password}
                        style={{width: SCREEN_WIDTH - 120,marginLeft: 10,
                          paddingTop: 1,paddingBottom: 1,marginBottom: 8,height: 20,color: 'white',}}/>
                  </View>
                  <View style={styles.checkStyle}>
                      <TouchableOpacity style={styles.checkStyleDetail} onPress={() => {
                        // 动态更新组件内State记录记住我
                        this.setState({
                          isreminber:!this.state.isreminber
                        })
                      }}
                      >
                          <Image source={this.state.isreminber ?
                            require('../images/checkbox_on.png') :
                          require('../images/checkbox_off.png')
                          } style={{width: 12,height: 12,}}/>
                          <Text style={{fontSize: 11,color: 'white',marginLeft: 3,}}>记住密码</Text>
                      </TouchableOpacity>
                      <TouchableOpacity style={styles.checkStyleDetail} onPress={() => {
                        // 动态更新组件内State记录是否自动登陆
                        this.setState({
                          autologin:!this.state.autologin
                        })
                      }}
                      >
                          <Image source={ this.state.autologin? require('../images/checkbox_on.png')
                          : require('../images/checkbox_off.png')
                          } style={{width: 12,height: 12,}}/>
                          <Text style={{fontSize: 11,color: 'white',marginLeft: 3,}}>自动登陆</Text>
                      </TouchableOpacity>
                  </View>
                  <View >
                    {
                      this.props.fetching?<Button style={{ width:280 }} className="btn" type="primary" loading>正在登陆</Button>:
                      <Button className="btn" style={{ width:280 }} type="primary" onClick={this._userLogin} >登陆</Button>
                    }
                  </View>
              </View>
            </View>
          }
        </View>
    );
  }
}
export default Login
const styles = StyleSheet.create({

  checkStyleDetail: {
    flexDirection: 'row',
  },
  LoginForm: {
    alignItems: 'center',
    backgroundColor: 'rgba(255,255,255,0.0)',
    paddingHorizontal: 0,
    paddingVertical: Platform.OS === 'ios' ? 150 : 120,
    width: SCREEN_WIDTH,
    height: 700,
    ...StyleSheet.absoluteFillObject,
  },
  TextInputStyle: {
    flexDirection: 'row',
    width: SCREEN_WIDTH - 100,
    borderBottomWidth: 0.5,
    borderBottomColor: 'white',
  },
  checkStyle: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    width: SCREEN_WIDTH - 100,
    marginBottom: 20,
  },
  launchImageStyle: {
    flex: 1,
    resizeMode: 'cover',
    width:SCREEN_WIDTH,
    height:SCREEN_HEIGHT,
  },
  LoginLayout: {
    flexDirection: 'column',
    justifyContent: 'flex-end',
    ...StyleSheet.absoluteFillObject,
  },
});
