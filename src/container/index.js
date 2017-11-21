import React from 'react'
import { SwipeAction, List } from 'antd-mobile';
import {postChatList} from '../fetch/api'

const Item  = List.Item
const Brief = Item.Brief

 class Index extends React.Component {

    constructor () {
        super(...arguments)
        this.state = {
            chatList: []
        }
    }
    componentDidMount () {

        postChatList().then(res=>{
            this.setState({
                chatList: res.data
            })
        })

    }
    render () {
        if (!this.state.chatList.length) return <div>没聊天记录</div>
        return (
            <div>
                {
                    this.state.chatList.map(item => (
                        <SwipeAction
                            style={{ backgroundColor: 'gray' }}
                            autoClose
                            right={[
                                {
                                    text: '取消',
                                    onPress: () => console.log('cancel'),
                                    style: { backgroundColor: '#ddd', color: 'white' },
                                },
                                {
                                    text: '删除',
                                    onPress: () => console.log('delete'),
                                    style: { backgroundColor: '#F4333C', color: 'white'},
                                },
                            ]}
                            onOpen={() => console.log('global open')}
                            onClose={() => console.log('global close')}
                        >
                            <Item
                                thumb={item.user_msg.avatar}
                                onClick={() => { this.props.history.push(`/chat/${item.user_msg._id}`)}}
                            >
                                {item.user_msg.nickName}
                                <Brief>{item.msg}</Brief>
                            </Item>
                        </SwipeAction>
                    ))
                }
        </div>
        )
    }
}

export default Index