import React, { Component } from 'react';
import {Button, List, InputItem, WhiteSpace, WingBlank} from 'antd-mobile'
import {Redirect} from 'react-router-dom'
import {connect} from 'react-redux'
import {login} from "../redux/user.redux";

@connect(
    state=>state.user,
    {login}
)
class Login extends Component {
    constructor (props) {
        super(props)

        this.state = {
            phone: '1',
            password: '123'
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
    render () {
        let pathname = this.props.location.pathname
        if (this.props.redirectTo && this.props.redirectTo !== pathname) {
            return <Redirect to={this.props.redirectTo}/>
        }
        return (
            <div>
                <List>
                    <WhiteSpace/>
                    <InputItem type="number" placeholder="请输入手机号码" value={this.state.phone} onChange={v => {this.change('phone', v)}}>手机号码</InputItem>
                    <WhiteSpace/>
                    <InputItem type="password" placeholder="密码" value={this.state.password} onChange={v => {this.change('password', v)}}>密码</InputItem>
                    <WhiteSpace/>
                </List>
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