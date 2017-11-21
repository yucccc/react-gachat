import socket from '../socket'
import {getFriend, getFriendRequestList} from "../fetch/api";
import {postRegister, postLogin} from "../fetch/api";

const
    AUTH_SUCCESS        = 'AUTH_SUCCESS',
    LOAD_DATA           = 'LOAD_DATA',
    FRIEND_LIST         = 'FRIEND_LIST',
    ERROR_MSG           = 'ERROR_MSG',
    LOGOUT              = 'LOGOUT',
    // 好友请求
    ADD_FRIEND          = 'ADD_FRIEND',
    // 好友请求列表
    REQ_FRIEND          = 'REQ_FRIEND'

const initState = {
    isAuth:     false,
    msg:        '',
    nickName:   '',
    phone:      '',
    avatar:     '',
    _id:        '',
    chat_id:    '',
    requestFriendMsg:{
        // 当前请求条数
        requestLen: 0,
    },
    // 好友请求列表
    requestFriendList:[],
    // 未读信息条数
    unreadMsgLen: 0
}

// reducer
export function user(state = initState, action) {
    switch (action.type) {
        // 写入数据
        case LOAD_DATA:
            return {...state, isAuth: true, ...action.payload}
        // 写入好友请求 todo 后期需要requestLast数据
        case ADD_FRIEND:
            return {...state,
                requestFriendMsg: {
                    requestLast: state.requestFriendMsg.requestLast,
                    requestLen: action.payload}}
        // 好友请求
        case REQ_FRIEND:
            return {...state, requestFriendList: action.payload}
        case FRIEND_LIST:
            return {...state, ...action.payload}
        case AUTH_SUCCESS:
            return {...state, isAuth: true, msg: '', ...action.payload, redirectTo:'/'}
        case ERROR_MSG:
            return {...state, isAuth: false, msg: action.msg}
        case LOGOUT:
            return {...initState, redirectTo: '/login'}
        default:
            return state
    }
}
// 通讯录
function friendList(data) {
    return {type: FRIEND_LIST, payload: data}
}
// 错误信息
function errorMsg(msg) {
    return {msg, type: ERROR_MSG}
}
// 验证成功
function authSuccess(data) {
    return {type: AUTH_SUCCESS, payload: data}
}
// 写入数据
export function loadData(userInfo) {
    return {type: LOAD_DATA, payload: userInfo}
}

// 写入好友请求
export function addFriend(reqLen) {
    return {type: ADD_FRIEND, payload: reqLen}
}
// 写入好友列表
function _writeReqList(list) {
    return {type: REQ_FRIEND, payload: list}
}



// 通讯录
export function getFriendList(phone) {
    return dispatch=> {
        getFriend(phone).then(res => {
            if (!res.code) {
                dispatch(friendList(res.data))
            }else {
                dispatch(errorMsg(res.msg))
            }
        })
    }
}


// 注册
export function register({nickName, phone, password}) {
    if (!nickName || !phone || !password) {
       return errorMsg('缺少必须参数')
    }
    return dispatch => {
        postRegister({
            nickName,
            phone,
            password
        }).then(res=> {
            if (!res.code) {
                dispatch(authSuccess(res.data))
            }else {
                dispatch(errorMsg(res.msg))
            }
        })
    }
}

// 登录
export function login({phone, password}) {
    if (!phone || !password) {
        return errorMsg('缺少必要参数')
    }
    return dispatch => {
        postLogin({phone, password}).then(res=> {
            if (!res.code) {
                dispatch(authSuccess(res.data))
            }else {
                dispatch(errorMsg(res.msg))
            }
        })
    }

}

// 注销
export function logout() {
    return {type: LOGOUT}
}

// 监听好友请求
export function monitorFriendReq() {
    return dispatch => {
        // reqLen 返回未读条数
        socket.on('monitorFriendReq', (reqLen) => {
            // todo 重新请求一次好友列表
            if (window.location.href.includes('friendList')) {
                dispatch(_getFriendRequestList())
            }
            console.log('监听到了好友请求', reqLen)
            // 获取条数
            dispatch(addFriend(reqLen))
        })
    }
}

// 获取请求列表
export function _getFriendRequestList() {
    return dispatch => {
        getFriendRequestList().then(res=>{
            dispatch(_writeReqList(res.data))
        })
    }
}