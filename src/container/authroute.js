import React from 'react'
import {withRouter}     from 'react-router-dom'
import {getUserInfo}    from '../fetch/api'
import {connect}        from 'react-redux'
import {setStore}  from "../utils/storage";
import {loginSocket}        from "../redux/chat.redux";
import {recvMsg, loadData, monitorFriendReq} from '../redux/user.redux'

@withRouter
@connect(
    state=>state.user,
    {loadData, loginSocket, monitorFriendReq, recvMsg}
)
class AuthRoute extends React.Component {

   async componentDidMount() {

        // if (this.props._id) {
            // 重新连接
            this.props.loginSocket()
            // 接收消息
            this.props.recvMsg()
            // 好友请求
            this.props.monitorFriendReq()
        // }
       
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
                    // 加入数据
                    this.props.loadData(res.data)

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