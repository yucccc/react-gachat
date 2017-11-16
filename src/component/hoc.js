import React from 'react';

import simpleHoc from './simple-hoc'

// 装饰器写法 与 simpleHoc(Usual) 相同

@simpleHoc
class Usual extends React.Component {
    render () {
        console.log('props',this.props);
        return (<div>Usual</div>)
    }
}

export default Usual