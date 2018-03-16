// 尬友圈头部
import React from 'react'
import styled from 'styled-components'
import {connect} from 'react-redux'

@connect(
    state=>state.user
)


export default class ALbumHeader extends React.Component {
    static defaultProps = {
        desc: ''
    }
    constructor (props) {
        super(props)
        this.state = {
            // 头像地址
            imgSrc: props.imgSrc,
            // 个性签名
            desc: props.desc
        }
    }

    render () {
        const {imgSrc, desc} = this.state
        const {avatar, nickName} = this.props
        return (
            <Container imgSrc={imgSrc}>
                <span className='name'>{nickName}</span>
                <span className='desc'>{desc}</span>
                {/* 头像 */}
                <Avatar src={avatar} alt={nickName}/>
            </Container>
        )
    }
}

// 在这里是可以拿到props的
const Container = styled.div`
    background-size: cover;
    background-image: url(${props =>  props.imgSrc});
    width: 100%;    
    height: 300px;
    box-shadow: 0px 0px 10px rgba(0,0,0,.8);
    position: relative;
    margin-bottom: 60px;
    span {
        position: absolute;
        color :#000;
        font-size: 16px;           
    }
    .name {
        bottom: 10px;
        right: 100px;
    }
    .desc {
        font-size: 18px;
        right: 10px;
        bottom: -50px;
        color: #666;
    }
`

const Avatar = styled.img`
    position: absolute;
    right: 10px;
    bottom: -20px;
    width: 80px;
    border: 2px solid #fff;
    border-radius: 5px;
`



// 默认值
Container.defaultProps = {
    // imgSrc: require('./../images/timg.png')
}

