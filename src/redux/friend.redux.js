import socket from '../socket'

const
    // 添加好友请求
    ADD_FRIEND = 'ADD_FRIEND'


const initState = {
    // 未读条数
    unread: 0,
    // 当前请求条数
    requestLen: 0
}



export function friend(state = initState, action) {
    switch (action.type) {
        case  'ADD_FRIEND':
            return {}
        default:
            return state
    }
}



// 发送好友请求
export function addFriendReq(userId) {
    return dispatch => {
        socket.emit('addFriendRequest', userId)
    }
}
