// 编辑发送朋友圈

import React from 'react'
import {List, InputItem, ImagePicker, WhiteSpace, Button, WingBlank} from 'antd-mobile';
import styled from 'styled-components'
import {sendMoments} from "../fetch/api";

export default class EditMom extends React.Component {

    constructor(props) {
        super(props)
        this.state = {
            // 想说什么
            desc: '',
            files: []
        }
        this._sendMoments = this._sendMoments.bind(this)
        this._setDesc = this._setDesc.bind(this)
    }

    onChange = (files, type, index) => {
        this.setState({
            files,
        });
    }

    _sendMoments() {
        const {desc, files} = this.state
        const imgData = files.map((v,i)=> ({url: v.url, id: i, name: v.file.name}))
        //  对象需要序列化后端才能接收到
        sendMoments({desc, imgData: JSON.stringify(imgData)}).then(res => {
            console.log(res)
        })
    }

    _setDesc(e) {
        this.setState({desc: e})
    }

    render() {
        const {files} = this.state;
        return (
            <EditContainer>
                <div className='bgf'>
                    <List>
                        <InputItem
                            onChange={this._setDesc}
                            placeholder="这一刻的想法..."
                        />
                    </List>
                    <WhiteSpace/>

                    <ImagePicker
                        files={files}
                        onChange={this.onChange}
                        onImageClick={(index, fs) => console.log(index, fs)}
                        selectable={files.length < 9}
                    />

                    <WhiteSpace/>
                </div>
                <WhiteSpace/>
                <WingBlank> <Button type='primary' onClick={this._sendMoments}>发表</Button></WingBlank>
            </EditContainer>
        )
    }
}

const EditContainer = styled.div`
    .bgf {
        background-color: #fff;
    }
`