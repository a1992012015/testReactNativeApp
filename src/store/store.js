/**
 * Created by 圆环之理 on 2018/5/11.
 *
 * @Ethan
 *
 * 功能：整个项目的状态管理，添加中间件和自动储存本地数据
 *
 */
'use strict';

import { applyMiddleware, createStore } from 'redux';
import { persistStore, persistReducer } from 'redux-persist';
import { AsyncStorage } from 'react-native';
import thunk from "redux-thunk";

import reducers from './reducers';

const middleWares = [
    thunk
];
const persistConfig = {
    key: 'root',
    storage: AsyncStorage,
};
const persistedReducer = persistReducer(persistConfig, reducers);

export default () => {
    let store = createStore(persistedReducer, applyMiddleware(...middleWares));
    let durable = persistStore(store);
    return { store, durable }
}




