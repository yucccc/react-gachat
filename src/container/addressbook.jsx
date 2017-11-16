import React from 'react'
import {List, WhiteSpace, Badge} from 'antd-mobile'
import {getFriend} from '../fetch/api'
import {connect} from 'react-redux'
import {getFriendList} from "../redux/user.redux";

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
    render () {

        return (
            <div>
                <WhiteSpace/>
                <List>
                    <Item
                        extra={<Badge text={''} overflowCount={99} />}
                        onClick={() => { }}
                    >新的尬友</Item>
                </List>
                <WhiteSpace/>
                <List>
                    {this.state.friendList.map((item, i) => (
                        <Item
                            thumb={item.avatar}
                            key={item.phone}
                            onClick={() => { this.props.history.push(`/chat/${item._id}`)}}
                        >{item.remark ? item.remark : item.nickName}</Item>
                    ))}
                </List>


            </div>

        )

    }
}