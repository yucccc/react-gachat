import React from 'react'
import { BrowserRouter, Switch, Route } from 'react-router-dom'

import Login       from '../container/login.js'
import Register    from '../container/register'
import Index       from '../container/index'
import AuthRoute   from '../container/authroute'
import Footer      from '../component/footer'
import My          from '../container/my'
import AddressBook from '../container/addressbook'
import Chat        from '../container/chat/chat'
import Browse      from '../container/browse'
import DetInfo     from '../container/friend/det-info'
import FriVer      from '../container/friend/verify'
import FriList     from '../container/friend-list'


export default class Root extends React.Component {
    render () {
        return (
            <BrowserRouter>
                <div>
                    {/*检验用户是否登陆*/}
                    <AuthRoute/>
                    <Route exact path='/' component={Index}/>
                    <Route exact path='/my' component={My}/>
                    <Route exact path='/addressbook' component={AddressBook}/>
                    <Route exact path='/browse' component={Browse}/>
                    <Switch>
                        <Route path={`/login`} component={Login}/>
                        <Route path={`/register`} component={Register}/>
                        {/*聊天室*/}
                        <Route path={`/chat/:id`} component={Chat}/>
                        {/*查看对方资料*/}
                        <Route path={`/detinfo/:phone`} component={DetInfo}/>
                        {/*发送好友验证*/}
                        <Route path={`/verify/:phone/:id`} component={FriVer}/>
                        {/*请求朋友列表*/}
                        <Route path={`/friendList`} component={FriList}/>
                        <Footer/>
                    </Switch>
                </div>
            </BrowserRouter>
        )
    }
}