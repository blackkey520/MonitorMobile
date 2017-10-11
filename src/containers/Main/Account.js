'use strict';

import React, { Component,PureComponent } from 'react';

import {
  StyleSheet,
  View,
  Text,
  Image,
  ScrollView,
  TouchableOpacity,
  Dimensions
} from 'react-native';
import { connect } from 'dva'
import { NavigationActions,createAction,ShowToast} from '../../utils'
import { Toast,List,Button } from 'antd-mobile';
import Icon from 'react-native-vector-icons/Ionicons';
import CommonMenu from '../../components/Menu/CommonMenu'
import { clearToken } from '../../logics/rpc';
import JPushModule from 'jpush-react-native';
import CodePush from "react-native-code-push";
const SCREEN_HEIGHT = Dimensions.get('window').height;
const SCREEN_WIDTH=Dimensions.get('window').width;

const Item = List.Item;
const Brief = Item.Brief;
@connect(({ app }) => ({user:app.user }))
class Account extends PureComponent {
  static navigationOptions = {
    title: '我',
    header:null,
    headerTintColor:'#fff',
    headerStyle:{backgroundColor:'#4f6aea'},
  }
  constructor() {
    super();
    this.state = { restartAllowed: true ,syncMessage:'',progress:''};
  }

  codePushStatusDidChange=(syncStatus)=> {
   switch(syncStatus) {
     case CodePush.SyncStatus.CHECKING_FOR_UPDATE:
       this.setState({ syncMessage: "正在检查更新" });
       break;
     case CodePush.SyncStatus.DOWNLOADING_PACKAGE:
       this.setState({ syncMessage: "开始下载包" });
       break;
     case CodePush.SyncStatus.AWAITING_USER_ACTION:
       this.setState({ syncMessage: "等待用户许可" });
       break;
     case CodePush.SyncStatus.INSTALLING_UPDATE:
       this.setState({ syncMessage: "正在安装" });
       break;
     case CodePush.SyncStatus.UP_TO_DATE:
       this.setState({ syncMessage: "应用程序最新.", progress: false });
       break;
     case CodePush.SyncStatus.UPDATE_IGNORED:
       this.setState({ syncMessage: "用户停止更新", progress: false });
       break;
     case CodePush.SyncStatus.UPDATE_INSTALLED:
       this.setState({ syncMessage: "更新成功,程序即将重启", progress: false });
       break;
     case CodePush.SyncStatus.UNKNOWN_ERROR:
       this.setState({ syncMessage: "未知错误", progress: false });
       break;
   }
 }
 codePushDownloadDidProgress=(progress)=>{
    this.setState({ progress });
  }
  render() {
    return (
      <View style={styles.layout}>
        <View  style={{flexDirection:'row',width:SCREEN_WIDTH,alignItems: 'center',justifyContent: 'space-between',backgroundColor:'#4f6aea',height:60}}>
          <TouchableOpacity  onPress={()=>{
            this.props.dispatch(NavigationActions.back())
          }} >
              <Icon name={'ios-arrow-back'} style={{marginTop:15,marginLeft:15}} size={32} color={'#fff'} />
          </TouchableOpacity>
          <View style={{flexDirection:'row',marginTop:15,marginRight:15}}>
            <TouchableOpacity>
              <Icon name="ios-settings-outline" size={23} color="#fff" style={{marginLeft:10}} />
            </TouchableOpacity>
            <TouchableOpacity>
              <Icon name="ios-create-outline" size={23} color="#fff" style={{marginLeft:10}} />
            </TouchableOpacity>
          </View>
        </View>
        <View style={{flexDirection:'row',alignItems: 'center',justifyContent: 'flex-start',backgroundColor:'#4f6aea',height:130,}}>
          <Image source={require('../../images/userlogo.png')} style={{width:70,height:70,marginLeft:20}}/>
          <View style={{flexDirection:'column',alignItems: 'flex-start',justifyContent: 'space-around',marginLeft:10}}>
            <Text style={{fontSize:15,color:'#fff'}}>{this.props.user.User_Name}</Text>
            <Text style={{fontSize:13,color:'#fff',marginTop:6}}>{this.props.user.Phone}</Text>
          </View>
        </View>

          <List style={{marginTop:15}}>
            <Item arrow="horizontal" multipleLine
               thumb={<Image source={require('../../images/contacts.png')} style={{width:15,height:15,marginRight:10}}/>}
               onClick={() => {
                 this.props.dispatch(createAction('app/loadcontactlist')({
                     user:null
                 }));
            }}>
              <Text style={{color:'#313131',fontSize:16}}>{'通讯录'}</Text>
              {/* <Brief>点击开始个性化设置</Brief> */}
            </Item>
            <Item arrow="horizontal" multipleLine
                thumb={<Image source={require('../../images/attention.png')} style={{width:15,height:15,marginRight:10}}/>}
               onClick={() => {
                 this.props.dispatch(createAction('point/loadcollectpointlist')({
                     pollutantType:this.props.PollutantType
                 }));
            }}>
              <Text style={{color:'#313131',fontSize:16}}>{'我的关注'}</Text>
            </Item>
        </List>
        <List style={{marginTop:15}}>
          <Item arrow="horizontal" multipleLine
            thumb={<Image source={require('../../images/setting.png')} style={{width:15,height:15,marginRight:10}}/>}
             onClick={() => {
              this.props.dispatch(NavigationActions.navigate({
                  routeName: 'ChangePassword'}));
          }}>
            <Text style={{color:'#313131',fontSize:16}}>{'修改密码'}</Text>
          </Item>


          <Item arrow="horizontal" multipleLine
             thumb={<Image source={require('../../images/clearcache.png')} style={{width:15,height:15,marginRight:10}}/>}
             onClick={async() => {
               await global.storage.remove({key: 'PollutantType'});
               await global.storage.remove({key: 'netConfig'});
               await global.storage.remove({key: 'loginmsg'});
               await global.storage.remove({key: 'accessToken'});
               ShowToast('清理完成');
          }}>
             <Text style={{color:'#313131',fontSize:16}}>{'清除缓存'}</Text>
          </Item>
          <Item
            arrow="horizontal"
            thumb={<Image source={require('../../images/systemupdate.png')} style={{width:15,height:15,marginRight:10}}/>}
            multipleLine
            extra={this.state.syncMessage || ''}
            onClick={ () => {
              CodePush.sync(
                { installMode: CodePush.InstallMode.IMMEDIATE, updateDialog: true },
                this.codePushStatusDidChange,
                this.codePushDownloadDidProgress
              );
            }}
          >
             <Text style={{color:'#313131',fontSize:16}}>{this.state.progress!=''
               ?this.state.progress.receivedBytes+'/'+this.state.progress.totalBytes:'版本更新'}</Text>
          </Item>
        </List>

        <View style={{width:SCREEN_WIDTH,alignItems: 'center',marginTop:15}}>
          <Button   onClick={()=>{
            clearToken();
            JPushModule.deleteAlias((result)=> {

          		})

            this.props.dispatch(NavigationActions.navigate({ routeName: 'Login' }))
          }} className="btn" type="primary"  style={{width:280,backgroundColor:'#eb2f2d',borderColor:'#eb2f2d'}} >退出系统</Button>
        </View>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  layout:{
    flex:1
  }
});


export default Account;
