import socket from '../socket'
import {getFriend} from "../fetch/api";
import {postRegister, postLogin} from "../fetch/api";


const
    AUTH_SUCCESS        = 'AUTH_SUCCESS',
    LOAD_DATA           = 'LOAD_DATA',
    FRIEND_LIST         = 'FRIEND_LIST',
    ERROR_MSG           = 'ERROR_MSG',
    LOGOUT              = 'LOGOUT',
    // 好友请求
    ADD_FRIEND          = 'ADD_FRIEND'

const initState = {
    isAuth:     false,
    msg:        '',
    nickName:   '',
    phone:      '',
    avatar:     '',
    _id:        '',
    chat_id:    '',
    // 当前请求条数
    requestLen: 0,
    // 未读条数
    unread: 0,
}

// reducer
export function user(state = initState, action) {
    switch (action.type) {
        // 写入数据
        case LOAD_DATA:
            return {...state,
                isAuth: true,
                ...action.payload,
                requestLen: action.payload.friendReqRead ?
                        0 :
                    action.payload.friend_req.filter(v=> v.req_status === 1).length}
        // 写入好友请求
        case ADD_FRIEND:
            return {...state,
                requestLen: state.requestLen + 1
                // friend_req: state.friend_req.unshift(action.payload)
            }
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
function addFriend(reqData) {
    return {type: ADD_FRIEND, payload: reqData}
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
        // 监听到就
        socket.on('monitorFriendReq', (data) => {
            dispatch(addFriend(data))
        })
    }
}
