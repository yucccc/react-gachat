import React from 'react'
import {byVerify, readMsg}                  from "../fetch/api";
import {List, WhiteSpace, Button, Toast}    from 'antd-mobile'
import {_getFriendRequestList, addFriend}   from "../redux/user.redux";

import {connect} from 'react-redux'
const Item = List.Item
const Brief = Item.Brief

@connect(
    state=>state.user,
    {_getFriendRequestList, addFriend}
)

export default class FriList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            friendList: []
        }
    }

    componentDidMount() {
        this.props._getFriendRequestList()


    }
    componentWillUnmount() {
        // 取消读取
        this.props.addFriend(0)
        // 离开才标记为已读
        readMsg({type: 'friendReq'}).then(res=>{
            console.log('标记已读', res)
        })

    }

    toLink (phone) {
        this.props.history.push(`/detinfo/${phone}`)
    }

    confirm (phone, e) {
        e.stopPropagation()
        // 通过验证
        byVerify({phone}).then(res=>{
            if (!res.code) {
                Toast.success('添加成功', 1, ()=> {
                    this.toLink(phone)
                });
            } else {
                Toast.fail(res.msg)
            }
        })
    }

    render() {
        if (!this.props.requestFriendList.length) return <div>没有好友..</div>
        return (
            <div>
                <WhiteSpace/>
                <List>
                {
                    this.props.requestFriendList.map((item,i) => (
                            <Item key={i}
                                  thumb={item.user_msg.avatar}
                                  extra={
                                      item.req_status ?
                                      item.req_status === 1 ?
                                          <Button size='small'
                                                  type='primary'
                                                  onClick={this.confirm.bind(this,item.req_id)}>通过</Button> :
                                          '已过期' : '已添加'
                                  }
                                  onClick={this.toLink.bind(this, item.req_id)}
                            >
                                {item.user_msg.nickName}
                                <Brief>{item.req_desc}</Brief>
                            </Item>
                        )
                    )
                }
                </List>
            </div>
        )
    }
}