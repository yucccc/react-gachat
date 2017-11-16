import io from 'socket.io-client';
import {postChatRec} from "../fetch/api";


const socket = io('http://127.0.0.1:3002')


const
    MSG_RECV   = 'MSG_RECV',
    UPDATE_MSG = 'UPDATE_MSG'

const initState = {
    // 聊天记录
    chat_msg: [],
    chat_id: '',
    // 对方头像
    avatar: ''
}

export function chat(state = initState, action) {
    switch (action.type) {
        case 'MSG_RECV':
            return {...state, chat_msg: [...action.payload.data], avatar: action.payload.avatar}
        case 'UPDATE_MSG':
            return {...state, chat_msg: [...action.payload]}
        default:
            return state
    }
}

// 写入聊天
function msgRecv(chat) {
    return {type: MSG_RECV, payload: chat}
}


function updateMsg(msg) {
    return {type: UPDATE_MSG, payload: msg}
}


// 监听信息
export function recvMsg() {
    return dispatch => {
        socket.on('receiveMsg', (data) => {
            dispatch(updateMsg(data.message))
        })
    }
}


// 发送聊天
export function sendMsg({from, to, msg}) {
    return dispatch => {
        socket.emit('sendMsg', {from, to, msg})
    }
}


// 首次读取全部记录
export function getChatRec(to) {
    console.log('getChatRec')
    return (dispatch, getStore) => {
        const from = getStore().user._id
        postChatRec({from, to}).then(res => {
            if (!res.code) {
                dispatch(msgRecv(res))
            } else {
                // 出错
            }
        })
    }

}
// 接收好友请求
export function addFriendReq() {
    return dispatch => {
        socket.on('addFriendReq', (data) => {
            console.log('data',data)
            dispatch(f=>f)
        })
    }
}