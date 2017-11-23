import React from 'react'
import { SwipeAction, List, Badge} from 'antd-mobile';


import {connect} from 'react-redux'
import {_postChatList} from "@/redux/user.redux";


const Item  = List.Item
const Brief = Item.Brief

@connect(
    state=>state.user,
    {_postChatList}
)

 class Index extends React.Component {

    constructor () {
        super(...arguments)
        this.state = {
            chatList: []
        }
    }
    componentDidMount () {
        if (!this.props.chatList.length) {
            // 聊天列表
            this.props._postChatList()
        }


    }

    toLink (id) {
        this.props.history.push(`/chat/${id}`)
    }

    render () {
        if (!this.props.chatList.length) return null
        return (
            <div>
                {
                    this.props.chatList.map((item, i) => (
                        <SwipeAction
                            style={{ backgroundColor: 'gray' }}
                            autoClose
                            key={i}
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
                                onClick={this.toLink.bind(this, item.user_msg._id)}
                                extra={<Badge text={item.unreadLen} overflowCount={99} />}
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