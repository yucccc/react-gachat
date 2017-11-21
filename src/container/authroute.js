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
    state=>state.user,
    {loadData, loginSocket, monitorFriendReq}
)
class AuthRoute extends React.Component {

   async componentDidMount() {
        // 白名单
        const whiteList = ['/login', '/register']
        const {pathname} = this.props.location
        if (whiteList.indexOf(pathname) > -1) return false
        if (this.props._id) return false
        // if (getStore('userInfo')) {
        //
        // }
        // 已经有用户信息
        getUserInfo().then(res => {
                if (!res.code) {
                    setStore('userInfo', res.data)
                    this.props.loadData(res.data)
                    // 重新连接
                    this.props.loginSocket()
                    this.props.monitorFriendReq()
                } else {
                    // token失效
                    this.props.history.push('/login')
                }
        })
    }

    render() {
        return null
    }
}

export default AuthRoute