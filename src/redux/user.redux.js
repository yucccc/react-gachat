import socket from '../socket'
import {getFriend, getFriendRequestList} from "../fetch/api";
import {postRegister, postLogin, postChatList, postChatRec} from "../fetch/api";

const
    AUTH_SUCCESS        = 'AUTH_SUCCESS',
    LOAD_DATA           = 'LOAD_DATA',
    FRIEND_LIST         = 'FRIEND_LIST',
    ERROR_MSG           = 'ERROR_MSG',
    LOGOUT              = 'LOGOUT',
    // 好友请求
    ADD_FRIEND          = 'ADD_FRIEND',
    // 好友请求列表
    REQ_FRIEND          = 'REQ_FRIEND',
    // 聊天列表
    CHAT_LIST           = 'CHAT_LIST',
    // 更新数据
    UPDATA_MSG          = 'UPDATA_MSG',
    // 写入聊天内容
    MSG_RECV            = 'MSG_RECV',
    // 标记已读
    SIGN_READ           = 'SIGN_READ'

const initState = {
    isAuth:     false,
    msg:        '',
    nickName:   '',
    phone:      '',
    avatar:     '',
    _id:        '',
    chat_id:    '',
    // 好友请求信息
    requestFriendMsg:{
        // 最后一条信息
        requestLast: {},
        // 当前请求条数
        requestLen: 0,
    },
    // 好友请求列表
    requestFriendList:[],

    // 未读信息条数
    unreadMsgLen: 0,
    // 聊天列表
    chatList: [],
    // 聊天内容 => 只存当前聊天角色
    chat_msg: [],
    // 聊天对象信息 key value
    user_msg: {}
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
                    requestLen: action.payload
                }
            }
        // 好友请求
        case REQ_FRIEND:
            return {...state, requestFriendList: action.payload}
        // 更新聊天内容 改变最后一条聊天内容
        case UPDATA_MSG:
            const {user_msg, data} = action.payload

            const isMe = data.from === state._id ? 1 : 0
            const initChatList = {...data, user_msg, unreadLen: isMe ? 0 : 1}
            let newChatList = []
            // 1 更新排序 2 如果没有聊天要新增
            if (state.chatList.length) {
                newChatList = [...state.chatList]
                // 有聊天记录
               const index = state.chatList.findIndex(v => ( v.user_msg._id === user_msg._id))
                   // 找到对应的
                if (index > -1) {
                    newChatList[index] = {
                        ...data,
                        user_msg,
                        unreadLen: state.chatList[index].unreadLen + 1, read: false
                    }
                } else {
                    newChatList.push(initChatList)
                }
                newChatList = newChatList.sort((a, b) => {
                    return b.create_time - a.create_time
                })
            } else {
                // 新增
                newChatList.push(initChatList)
            }

            const payloadData = {
                ...state,
                // 增加聊天内容
                chat_msg: [...state.chat_msg, action.payload.data],
                // 增加条数
                unreadMsgLen: isMe ? state.unreadMsgLen : state.unreadMsgLen +1,
                chatList:newChatList
            }

            return payloadData
        // 写入聊天内容
        case MSG_RECV:
            return {...state, chat_msg: [...action.payload.data], user_msg: action.payload.user_msg}
        case FRIEND_LIST:
            return {...state, ...action.payload}
        // 聊天列表
        case SIGN_READ:

            const nChatList = [...state.chatList]
            // 总条数
            let newUnRead = state.unreadMsgLen

            state.chatList.forEach((item, i)=> {
                if (item.user_msg._id === action.payload) {
                    newUnRead -= item.unreadLen
                    nChatList[i].unreadLen = 0
                }
            })

            return {...state, chatList: nChatList, unreadMsgLen:newUnRead}

        case CHAT_LIST:
            return {...state, chatList: [...action.payload]}
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
// 标记已读
export function signRead(id) {
    console.log(id)
    return {type: SIGN_READ, payload: id}
}

// 写入好友列表
function _writeReqList(list) {
    return {type: REQ_FRIEND, payload: list}
}

// 写入聊天信息
function msgRecv(chat) {
    return {type: MSG_RECV, payload: chat}
}
// 写入聊天列表
function _writeChatList(chatList) {
    return {type: CHAT_LIST, payload: chatList}
}

// 更新数据
function updataMsg(msg) {
    return {type: UPDATA_MSG, payload: msg}
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

// 监听聊天信息发送
export function recvMsg() {
    return dispatch => {
        socket.on('receiveMsg', (data) => {
            // {
            //   data : {} // 聊天内容
            //   [_id]: {} // 用户信息
            // }
            console.log('接收到信息', data)
            dispatch(updataMsg(data))
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

// 首次读取全部记录
export function getChatRec(to) {
    return (dispatch, getState) => {
        // const from = getState().user._id
        postChatRec({to}).then(res => {
            if (!res.code) {
                dispatch(msgRecv(res))
            } else {
                // 出错
            }
        })
    }

}

// 获取聊天列表
export function _postChatList() {
    return dispatch => {
        postChatList().then(res=>{
            if (!res.code) {
                dispatch(_writeChatList(res.data))
            }
        })
    }
}