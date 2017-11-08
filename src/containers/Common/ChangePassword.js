// import liraries
import React, {
  Component
} from 'react';
import {
  View,
  Text,
} from 'react-native';
import { connect } from 'react-redux';
import { List, InputItem, WhiteSpace, Button, Toast } from 'antd-mobile';
import { createForm } from 'rc-form';
import { createAction } from '../../utils';
import { loadToken } from '../../logics/rpc';

@connect(({ app }) => ({ fetching: app.fetching,
  contactlist:
   app.contactlist,
  errorMsg: app.errorMsg }))
// create a component
class ChangePassword extends Component {
    static navigationOptions = ({
      navigation,
      screenProps
    }) => ({
      headerTitle: '修改密码',
      headerBackTitle: null,
      headerTintColor: '#fff',
      headerStyle: {
        backgroundColor: '#4f6aea'
      },
    });
    state = {
      hasError1: false,
      hasError2: false,
      errorCode: -1,
      passwordold: '',
      passwordnw1: '',
      passwordnw2: ''
    }

    onErrorClick = () => {
      if (this.state.errorCode === 1) {
        Toast.info('密码不能少于6位！');
      }
      if (this.state.errorCode === 2) {
        Toast.info('两次输入的新密码不一致！');
      }
    }
    onChange=(value) => {
      this.setState({
        passwordold: value
      });
    }
    onChange1 = (value) => {
      if (value.replace(/\s/g, '').length < 6) {
        this.setState({
          hasError1: true,
          errorCode: 1,
        });
      } else {
        this.setState({
          hasError1: false,
          errorCode: -1
        });
      }
      this.setState({
        passwordnw1: value
      });
    }
    onChange2 = (value) => {
      if (value.replace(/\s/g, '').length < 6) {
        this.setState({
          hasError2: true,
          errorCode: 1
        });
      } else {
        this.setState({
          hasError2: false,
          errorCode: -1
        });
      }
      if (value !== this.state.passwordnw1) {
        this.setState({
          hasError2: true,
          errorCode: 2
        });
      } else {
        this.setState({
          hasError2: false,
          errorCode: -1
        });
      }

      this.setState({
        passwordnw2: value
      });
    }
savePwd = async () => {
  if (this.state.errorCode !== -1) {
    Toast.info('输入内容有错，请检查！');
    return false;
  }
  const user = await loadToken();
  this.props.dispatch(createAction('app/ModifyPassword')({
    authorCode: user.User_ID,
    userPwdOld: this.state.passwordold,
    userPwdNew: this.state.passwordnw1,
    userPwdTwo: this.state.passwordnw2
  }));
};
render() {
  const { getFieldProps } = this.props.form;
  return (

    <View>
      <WhiteSpace />
      <List>
        <InputItem
          type="password"
          placeholder="请输入原始密码"
          onChange={this.onChange}
          value={this.state.passwordold}
        />
        <InputItem
          {...getFieldProps('passwordnw1')}
          type="password"
          placeholder="请输入新密码"
          error={this.state.hasError1}
          onErrorClick={this.onErrorClick}
          onChange={this.onChange1}
          value={this.state.passwordnw1}
        />
        <InputItem
          {...getFieldProps('passwordnw2')}
          type="password"
          placeholder="重新输入新密码"
          error={this.state.hasError2}
          onErrorClick={this.onErrorClick}
          onChange={this.onChange2}
          value={this.state.passwordnw2}
        />
      </List>
      <View>
        <Text>
          {this.props.errorMsg !== '' ? null : this.props.errorMsg}
        </Text>
      </View>

      <View style={{ flexDirection: 'row-reverse', justifyContent: 'center', marginTop: 20 }}>
        <Button className="btn" style={{ width: 280 }} type="primary" onClick={this.savePwd} >提交</Button>
      </View>
    </View>
  );
}
}

export default createForm()(ChangePassword);
