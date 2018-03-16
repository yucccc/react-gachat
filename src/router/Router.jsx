import React from 'react'
import { BrowserRouter } from 'react-router-dom'
import App from '../app'


export default class Root extends React.Component {
    render () {
        return (
            <BrowserRouter>
               <App/>
            </BrowserRouter>
        )
    }
}