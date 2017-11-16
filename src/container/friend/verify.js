import React from 'react'
import { List,InputItem, Button, WingBlank, WhiteSpace } from 'antd-mobile';
import {addFried} from "../../fetch/api";
import {connect} from 'react-redux'
import {addFriendReq} from "../../redux/chat.redux";
import {Toast} from 'antd-mobile'
@connect(
    state=>state.user,
    {addFriendReq}
)
export default class FriVer extends React.Component {
    constructor (props) {
        super(props)
        this.state = {
            reqMsg: ''
        }
    }
    componentDidMount () {
        this.props.addFriendReq()
    }

    send () {
        addFried({
            phone: this.props.match.params.phone,
            req_desc: this.state.reqMsg,
            user_phone: this.props.phone}).then(res=>{
            Toast.info(res.msg, 2, ()=>{
                this.props.history.push(`/detInfo/${this.props.match.params.phone}`)
            })

        })

    }

    render () {
        return (
            <div>
                <List renderHeader={() => '你需要发送验证申请，等对方通过验证'} className="my-list">
                    <InputItem clear onChange={(v)=> {this.setState({reqMsg: v})}}/>
                </List>
                <WhiteSpace/>
                <WingBlank><Button type='primary' onClick={this.send.bind(this)}>发送</Button></WingBlank>
            </div>
        )
    }
}