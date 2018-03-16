
// 个人相册
import React from 'react'
import AlbumHeader from '../../component/album-header'
import styled from 'styled-components'


export default class Album extends React.Component {
    
    render () {
        return (
            <div>
                <AlbumHeader desc='个人相册才有个性签名'/>
                <Container>
                    <div className='item'>
                    {/* 日期 */}
                    <div className='date'>
                        <span className='apparent'>今天</span>
                    </div>
                    <div className='img' onClick={()=> this.props.history.push('/editMon')}>
                        <div className={'camera'}/>
                    </div>
                </div>

                    {/*已发朋友圈列表*/}
                    {/*<div className='item'>*/}
                        {/*/!* 日期 *!/*/}
                        {/*<div className='date'>*/}
                            {/*<span className='apparent'>11<span className='primary'>11月</span></span>*/}
                        {/*</div>*/}
                        {/*<div className='img'>*/}
                            {/*<div className={'camera'}>*/}

                            {/*</div>*/}
                        {/*</div>*/}
                    {/*</div>*/}


                </Container>
            </div>
        )
    }
}

const Container = styled.div`
    .item {
        display: flex;
        padding: 0 20px 0 10px;
        margin-bottom:20px;
    }
    .date {
        display: flex;
        width: 60px;
        .apparent {
        font-size: 22px;
        color: #000;
        font-weight: bold;
        }
        .primary {
         font-size: 12px;
         font-weight: normal;
        }
    }
    .img {
        width: 100px;
        height: 100px;
        overflow: hidden;
        background-color: #fff;
    }
    .camera {
        background-origin: content-box;
        padding: 20px;
        height: 100%;
        width: 100%;
        background-size: cover;
        background-color: #f6f6f6;
        background-repeat: no-repeat;
    }
`