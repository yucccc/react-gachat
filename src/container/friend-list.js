import React from 'react'
import {getFriendList, byVerify, readMsg} from "../fetch/api";
import {List, WhiteSpace, Button, Toast} from 'antd-mobile'


const Item = List.Item
const Brief = Item.Brief


export default class FriList extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            friendList: []
        }
    }

    componentDidMount() {
        getFriendList().then(res => {
            this.setState({
                friendList: res.data
            })
        })
        readMsg({type: 'friendReq'}).then(res=>{
            console.log(res)
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
                Toast.fail('通过失败')
            }
        })
    }

    render() {
        if (!this.state.friendList.length) return <div>没有好友..</div>
        return (
            <div>
                <WhiteSpace/>
                <List>
                {
                    this.state.friendList.map(item => (
                            <Item key={item.req_id}
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