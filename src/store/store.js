/**
 * Created by 圆环之理 on 2018/5/11.
 *
 * @Ethan
 *
 * 整个项目的状态管理
 *
 */
'use strict';

import {applyMiddleware, createStore} from 'redux';
import thunk from 'redux-thunk';
import {persistStore, persistReducer } from 'redux-persist';
import storage from 'redux-persist/lib/storage' // defaults to localStorage for web and AsyncStorage for react-native
import {AsyncStorage} from 'react-native';

import reducers from './reducers';

const middleWares = [
    thunk,
    storage
];
let createAppStore = applyMiddleware(...middleWares)(createStore);

export default function configureStore(onComplete: ()=>void) {
    const store = persistReducer()(createAppStore)(reducers);
    let opt = {
        storage: AsyncStorage,
        transform: [],
        //whitelist:['userStore']
    };
    persistStore(store, opt, onComplete);
    return store;
}

//添加中间件


//createLogger = (store) => action => store.dispatch(action);




