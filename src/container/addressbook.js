import React from 'react'
import {List, WhiteSpace, Badge}    from 'antd-mobile'
import {getFriend}                  from '../fetch/api'
import {connect}                    from 'react-redux'
import {getFriendList}              from "../redux/user.redux";

const Item = List.Item;

@connect(
    state=> state,
    {getFriendList}
)

export default class AddressBook extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            friendList: []
        }
    }
     componentWillMount () {
      getFriend().then(res=> {
          if (!res.code) {
              this.setState({friendList: res.data})
          }
     })
    }

    toUserMsg (phone,e) {
        e.stopPropagation()
       this.props.history.push(`/detInfo/${phone}`)
    }

    render () {

        return (
            <div>
                <WhiteSpace/>
                <List>
                    <Item
                        extra={<Badge text={this.props.user.requestFriendMsg.requestLen}
                                      overflowCount={99} />}
                        arrow={'horizontal'}
                        onClick={() => { this.props.history.push('/friendList')}}>
                        新的尬友
                    </Item>
                </List>
                <WhiteSpace/>
                <List>
                    {this.state.friendList.length && this.state.friendList.map((item, i) => (
                        <Item
                            thumb={<img onClick={this.toUserMsg.bind(this, item.phone)} src={item.avatar} alt=""/>}
                            key={item.phone}
                            onClick={() => { this.props.history.push(`/chat/${item._id}`)}}
                        >{item.remark ? item.remark : item.nickName}</Item>
                    ))}
                </List>


            </div>

        )

    }
}