// 详细资料
import React from 'react'
import {getDetInfo} from "../../fetch/api";
import {List, WhiteSpace, WingBlank, Button} from 'antd-mobile'
import {connect} from 'react-redux'
const Item = List.Item

const Brief = Item.Brief;
@connect(
    state=>state.user
)
export default class DetInfo extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            detInfo: null
        }
    }

    componentDidMount() {
        getDetInfo({phone: this.props.match.params.phone}).then(res => {
            if (!res.code) {
                this.setState({
                    detInfo: res.data
                })
            }
        })
    }

    toWhere (flag) {
        if (flag) {
            this.props.history.push(`/chat/${this.state.detInfo._id}`)
        } else {
            this.props.history.push(`/verify/${this.props.match.params.phone}/${this.state.detInfo._id}`)
        }
    }

    render() {
        if (!this.state.detInfo) return <div>用户不存在..</div>
        const detInfo = this.state.detInfo
        return (
            <div>
                <WhiteSpace/>
                    <List className='img-avatar'>
                        <WhiteSpace/>
                        <Item thumb={<img src={this.state.detInfo.avatar} alt=""/>}>
                            {detInfo.nickName}
                            <Brief>尬聊号: {detInfo.phone}</Brief>
                            <Brief>昵称: {detInfo.nickName}</Brief>
                        </Item>
                        <WhiteSpace/>
                    </List>
                <WhiteSpace/>
                <WingBlank>
                    <Button  type="primary" onClick={this.toWhere.bind(this,detInfo.isFriend )}>{detInfo.isFriend ? '发消息': '添加到通讯录'}</Button>
                </WingBlank>

            </div>
        )
    }
}