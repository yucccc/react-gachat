import React from 'react';
import ReactDom from 'react-dom'
import { createStore, applyMiddleware, compose} from 'redux'

import { Provider } from 'react-redux'
import thunk        from 'redux-thunk'
import reducers     from './reducer'
import Root         from './router/Router'
import './style/base.css'
import './style/reset.css'

const store = createStore(
    reducers,
    compose(
        applyMiddleware(thunk),
        window.devToolsExtension ? window.devToolsExtension() : f => f    
    )
);

const root = document.getElementById('root')

ReactDom.render(
    <Provider store={store}>
            <Root/>
    </Provider>
    ,root
);

if (module.hot) {
    module.hot.accept();
}