import io from 'socket.io-client';
// 本地
// const socket = io('http://127.0.0.1:3666')
const socket = io('http://127.0.0.1:3002')

// 测试
// const socket = io('http://192.168.2.88:3002')


export default socket