import React from 'react'
import { TabBar } from 'antd-mobile';
import {withRouter} from 'react-router-dom'
import {connect} from 'react-redux'
// import {monitorFriendReq} from "../redux/friend.redux";

@withRouter
@connect(
    state=>state.user,
    // {monitorFriendReq}
)
export default class Footer extends React.Component {


    componentDidMount() {
        // this.props.monitorFriendReq()
    }
    render () {
        const {pathname} = this.props.location
        const navOption = [
            {
                title: '消息',
                path: '/',
                icon: 'message',
                badge: this.props.unread
            },
            {
                title: '通讯录',
                path: '/addressbook',
                icon: 'addressbook',
                badge: this.props.requestFriendMsg.requestLen
            },
            {
                title: '发现',
                path: '/browse',
                icon: 'browse'
            },
            {
                title: '我',
                path: '/my',
                icon: 'people'
            }
        ]
        return (
            <div>
                <TabBar unselectedTintColor="#949494" tintColor="#33A3F4">
                    {navOption.map((item, i) => (
                         <TabBar.Item
                            title={item.title}
                            key={item.icon}
                            badge={item.badge}
                            icon={<img
                                src={require(`./../images/${item.icon}.svg`)}
                                alt={item.title}/>}
                            selectedIcon={<img
                                src={require(`./../images/${item.icon}-active.svg`)}
                                alt={item.title}/>}
                            selected={pathname === item.path}
                            onPress={() => {
                                this.props.history.push(item.path)
                            }}>
                        </TabBar.Item>
                    ))}
                </TabBar>
        </div>)
    }
}