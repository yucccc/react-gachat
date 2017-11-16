import React from 'react'
import {List, InputItem,} from 'antd-mobile';
import {connect} from 'react-redux'
import {getChatRec, sendMsg, recvMsg} from "../../redux/chat.redux";

const Item = List.Item

@connect(
    state => state,
    {getChatRec, sendMsg, recvMsg}
)
export default class Chat extends React.Component {

    constructor(props) {
        super(props)
        this.send = this.send.bind(this)
        this.state = {
            text: ''
        }
    }


    componentDidMount() {
        // 发送请求
        this.props.getChatRec(this.props.match.params.id)
        this.props.recvMsg()
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
                        props.chat.chat_msg.length ?
                            (this.props.chat.chat_msg.map((item => (
                                <Item
                                    thumb={item.from === props.user._id ? '': <img src={props.chat.avatar} alt="/"/> }
                                    multipleLine
                                    wrap
                                    extra={
                                        item.from === props.user._id ?  <img src={props.user.avatar} alt='/'/> :''
                                    }
                                    onClick={() => {
                                    }}
                                    key={item._id}>
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