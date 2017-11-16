import React from 'react'
import {Button, List, InputItem, WhiteSpace, WingBlank} from 'antd-mobile'
import {connect} from 'react-redux'
import {register} from './../redux/user.redux'
import {Redirect, Link} from 'react-router-dom'
@connect(
    state=>state.user,
    {register}
)
class Register extends React.Component {
    constructor (props) {
        super(props)

        this.state = {
            nickName: '',
            phone:    '',
            code:     '123',
            password: '123'
        }

        this.change = this.change.bind(this)
        this.submit = this.submit.bind(this)
    }

    change (key, val) {
        this.setState({
            [key]:val
        })
    }
    submit () {
        this.props.register(this.state)
    }

    render () {

        if (this.props.redirectTo && !this.props.redirectTo.includes('login')) {
            return <Redirect to={this.props.redirectTo}/>
        }
        return (
            <div>
                <List>
                    <WhiteSpace/>
                    <InputItem placeholder="输入用户名" value={this.state.nickName} onChange={v => {this.change('nickName', v)}}>昵称</InputItem>
                    <WhiteSpace/>
                    <InputItem type="number" placeholder="请输入手机号码" value={this.state.phone} onChange={v => {this.change('phone', v)}}>手机号码</InputItem>
                    <WhiteSpace/>
                    <InputItem type="number" placeholder="输入验证码"  value={this.state.code}  onChange={v => {this.change('code', v)}}>验证码</InputItem>
                    <WhiteSpace/>
                    <InputItem type="password" placeholder="密码" value={this.state.password} onChange={v => {this.change('password', v)}}>密码</InputItem>
                    <WhiteSpace/>
                </List>
                <WingBlank><p style={{textAlign:'right'}}>已有账号? <Link to={'login'}>登陆</Link></p></WingBlank>
                <WingBlank><Button type='primary' onClick={this.submit}>注册</Button></WingBlank>
            </div>
        )
    }
}

export default Register