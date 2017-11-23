import socket from './../socket'
import {postChatRec} from "../fetch/api";



const
    MSG_RECV   = 'MSG_RECV',
    UPDATA_MSG = 'UPDATA_MSG'

const initState = {
    // 聊天记录
    chat_msg: [],
    // chat_id: '',
    // 对方头像
    user_msg: null,
}

export function chat(state = initState, action) {
    switch (action.type) {
        case 'MSG_RECV':
            return {...state, chat_msg: [...action.payload.data], user_msg: action.payload.user_msg}
            // 更新聊天内容
        case 'UPDATA_MSG':
            return {...state, chat_msg: [...state.chat_msg, action.payload]}
        default:
            return state
    }
}

// 写入聊天
// function msgRecv(chat) {
//     return {type: MSG_RECV, payload: chat}
// }


// function updateMsg(msg) {
//     return {type: UPDATE_MSG, payload: msg}
// }


// 监听信息
// export function recvMsg() {
//     return dispatch => {
//         socket.on('receiveMsg', (data) => {
//             console.log('接收到信息')
//             console.log(data)
//             dispatch(updateMsg(data))
//         })
//     }
// }

// 登陆发送客户端id
export function loginSocket() {
    return (dispatch, getState) => {
        socket.emit('loginSocket', getState().user._id)
    }
}


// 发送聊天
export function sendMsg({from, to, msg}) {
    return dispatch => {
        socket.emit('sendMsg', {from, to, msg})
    }
}


// 首次读取全部记录
// export function getChatRec(to) {
//     return (dispatch, getState) => {
//         // const from = getState().user._id
//         postChatRec({to}).then(res => {
//             if (!res.code) {
//                 dispatch(msgRecv(res))
//             } else {
//                 // 出错
//             }
//         })
//     }
//
// }