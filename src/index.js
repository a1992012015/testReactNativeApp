/**
 * Created by 圆环之理 on 2018/5/11.
 *
 * 功能：项目的启动入口
 *
 */
'use strict';

import React, {Component} from 'react';
import {Provider} from 'react-redux';
import {PersistGate} from 'redux-persist/integration/react';

import configureStore from './store/store';
import AppNavigator from './navigationConfiguration';

/*if (!__DEV__) {
    global.console = {
        info: () => {
        },
        log: () => {
        },
        warn: () => {
        },
        error: () => {
        },
    };
}*/

const {store, durable} = configureStore();

class Index extends Component {
    render() {
        return (
            <Provider store={store}>
                <PersistGate loading={null} persistor={durable}>
                    <AppNavigator/>
                </PersistGate>
            </Provider>
        );
    }
}

console.disableYellowBox = true;
console.warn('YellowBox is disabled.');

export default Index;