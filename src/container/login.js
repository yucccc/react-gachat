import React, { Component } from 'react';
import {Button, List, InputItem, WhiteSpace, WingBlank} from 'antd-mobile'
import {Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import {loginSocket} from '../redux/chat.redux'
import {login, recvMsg, monitorFriendReq} from "../redux/user.redux";
import Logo from '../component/logo'
@connect(
    state=>state.user,
    {login, loginSocket, recvMsg, monitorFriendReq}
)
class Login extends Component {
    constructor (props) {
        super(props)

        this.state = {
            phone: '',
            password: ''
        }

        this.change = this.change.bind(this)
        this.login  = this.login.bind(this)
        this.register = this.register.bind(this)
    }
    change (key, val) {
        this.setState({
            [key]:val
        })
    }

    login () {
        this.props.login(this.state)
    }

    register () {
        this.props.history.push('/register')
    }
    
    componentWillUnmount () {
        if (this.props._id) {
            // 重新连接
            this.props.loginSocket()
            // 接收消息
            this.props.recvMsg()
            // 好友请求
            this.props.monitorFriendReq()
        }
    }

    render () {
        let pathname = this.props.location.pathname
        if (this.props.redirectTo && this.props.redirectTo !== pathname) {
            return <Redirect to={this.props.redirectTo}/>
        }
        return (
            <div>
                <Logo/>
                <WhiteSpace/>

                <List>
                    <InputItem type="number" placeholder="请输入尬聊号" value={this.state.phone} onChange={v => {this.change('phone', v)}}>尬聊号</InputItem>
                    <WhiteSpace/>
                    <InputItem type="password" placeholder="请输入密码" value={this.state.password} onChange={v => {this.change('password', v)}}>密码</InputItem>
                </List>
                <WhiteSpace/>

                <WingBlank>
                    <Button type='primary' onClick={this.login}>登陆</Button>
                </WingBlank>
                <WhiteSpace/>
                <WingBlank>
                    <Button type='primary' onClick={this.register}>注册</Button>
                </WingBlank>
            </div>
        )
    }
}
export default Login