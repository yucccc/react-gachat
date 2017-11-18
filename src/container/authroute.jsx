import React from 'react'
import {withRouter} from 'react-router-dom'
import {getUserInfo} from './../fetch/api'
import {loadData} from "../redux/user.redux"
import {connect} from 'react-redux'
import {getStore,setStore} from "../utils/storage";
import {loginSocket} from "../redux/chat.redux";
import {monitorFriendReq} from "../redux/user.redux";

@withRouter
@connect(
    null,
    {loadData, loginSocket, monitorFriendReq}
)
class AuthRoute extends React.Component {

    componentDidMount() {
        // 白名单
        const whiteList = ['/login', '/register']
        const {pathname} = this.props.location
        if (whiteList.indexOf(pathname) > -1) return false
        // 已经有用户信息
        // if (getStore('userInfo')) {
        //
        //     this.props.loadData(JSON.parse(getStore('userInfo')))
        //     // 重新连接
        //     this.props.loginSocket()
        //
        // } else {
            // 获取用户信息
            getUserInfo().then(res => {
                if (!res.code) {
                    // setStore('userInfo', res.data)
                    this.props.loadData(res.data)
                    // 重新连接
                    this.props.loginSocket()
                    this.props.monitorFriendReq()
                } else {
                    // token失效
                    this.props.history.push('/login')
                }
            })
        // }


    }

    render() {
        return null
    }
}

export default AuthRoute