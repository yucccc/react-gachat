import React  from 'react'
import { Switch, Route } from 'react-router-dom'

import Login       from './container/login'
import Register    from './container/register'
import Index       from './container/index'
import AuthRoute   from './container/authroute'
import Footer      from './component/footer'
import My          from './container/my'
import AddressBook from './container/addressbook'
import Chat        from './container/chat/chat'
import Browse      from './container/browse'
import DetInfo     from './container/friend/det-info'
import FriVer      from './container/friend/verify'
import FriList     from './container/friend-list'
import Album       from './container/album/album'       // 个人相册
import Moments     from './container/moments/moments'   // 朋友圈
import EditMon     from './container/edit-momnent'      // 发送朋友圈

export default class App extends React.Component {
    render() {
        return ( <div>
            {/*检验用户是否登陆*/}
            <AuthRoute/>
            <Route exact path='/'       component={Index}/>
            <Route path='/my'           component={My}/>
            <Route path='/addressbook'  component={AddressBook}/>
            <Route path='/browse'       component={Browse}/>
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
                {/*个人相册*/}
                <Route path='/album'        component={Album}/>
                <Route path='/moments'      component={Moments}/>
                <Route path='/editMon'      component={EditMon}/>
                <Footer/>
            </Switch>
        </div>)
    }
}