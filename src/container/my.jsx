import React from 'react'
import { Result, List, WhiteSpace, Modal } from 'antd-mobile';
import {connect} from 'react-redux'
import browserCookie from 'browser-cookies'
import {logout} from "../redux/user.redux";
import {removeStore} from "../utils/storage";

const Item = List.Item
const alert = Modal.alert;

@connect(
    state=>state.user,
    {logout}
)



export default class My extends React.Component {

    constructor (props) {
        super(props)
        this.showAlert = this.showAlert.bind(this)
    }

    showAlert () {

       alert('注销', '你确定要退出登录吗?', [
            { text: '取消', onPress: () => console.log('取消'), style: 'default' },
            { text: '确定', onPress: () => {
                browserCookie.erase('token')
                removeStore('userInfo')
                this.props.logout()
                this.props.history.push('/login')
            } },
        ]);

    }

    render () {
        let props = this.props
        if (!props.avatar) return null
        return  (
            <div>
                <Result
                    img={<img src={props.avatar} alt="个人头像" style={{width: 50}}/>}
                    title={props.nickName}
                    message={<div>手机号: {props.phone}</div>}
                />
                <WhiteSpace />

                <Item arrow="horizontal" onClick={this.showAlert}>注销</Item>
            </div>
        )
    }
}