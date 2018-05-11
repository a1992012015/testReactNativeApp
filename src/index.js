/**
 * Created by 圆环之理 on 2018/5/11.
 *
 * 功能：项目的启动入口
 *
 */
'use strict';

import React, {Component} from 'react';
import {Provider} from 'react-redux';

import configureStore from './store/store';
import AppNavigator from './navigationConfiguration';

if (!__DEV__) {
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
}

const store = configureStore();

class Index extends Component {
    componentWillMount() {

    }

    render() {
        return (
            <Provider store={store}>
                <AppNavigator/>
            </Provider>
        );
    }
}

console.disableYellowBox = true;
console.warn('YellowBox is disabled.');

export default Index;