import React from 'react'
import {List, InputItem,} from 'antd-mobile';
import {connect} from 'react-redux'
import {sendMsg} from "../../redux/chat.redux";
import {getChatRec, signRead} from "../../redux/user.redux";
import {readMsg} from "../../fetch/api";

const Item = List.Item

@connect(
    state => state,
    {getChatRec, sendMsg, signRead}
)

export default class Chat extends React.Component {

    constructor(props) {
        super(props)
        this.send = this.send.bind(this)
        this.state = {
            text: ''
        }
    }


    async componentDidMount() {
        // this.props.recvMsg()
        // 发送请求
        await this.props.getChatRec(this.props.match.params.id)

    }

    componentWillUnmount () {


        this.props.signRead(this.props.match.params.id)

        readMsg({
            type: 'chatMsg',
            to: this.props.match.params.id,
            from: this.props.user._id
        }).then(res=> {
            if (!res.code) {
                console.log('标记已读')
            }
        })
    }


    send(e) {
        if (!this.state.text) return
        let cond1 = e && e.keyCode === 13
        let cond2 = e.type === 'click'
        if (cond1 || cond2) {
            let props = this.props
            props.sendMsg({
                msg: this.state.text,
                from: props.user._id,
                to: props.match.params.id
            })
            this.setState({text: ''})
        }
    }

    render() {
        let props = this.props
        return (
            <div>
                <List className='list'>
                    {
                        props.user.chat_msg.length ?
                            (this.props.user.chat_msg.map((item => (
                                <Item
                                    thumb={item.from === props.user._id ? '': <img src={props.user.user_msg.avatar} alt="/"/> }
                                    multipleLine
                                    wrap
                                    extra={item.from === props.user._id ?  <img src={props.user.avatar} alt='/'/> :''}
                                    onClick={() => {}}
                                    key={item._id}
                                >
                                    {item.msg}
                                </Item>
                            )))) : null
                    }
                </List>
                <List className='input'>
                    <InputItem
                        value={this.state.text}
                        onKeyUp={this.send}
                        onChange={(v) => {
                            this.setState({text: v})
                        }}
                        onExtraClick={this.send} extra={'发送'}>
                    </InputItem>
                </List>
            </div>)
    }

}