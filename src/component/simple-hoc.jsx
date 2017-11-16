import React from 'react';
const simpleHoc = WrappedComponent => {
    console.log('simpleHoc');
    return class extends React.Component {
        render () {
            return <WrappedComponent {...this.props}/>    
        }
    }
}

export default simpleHoc