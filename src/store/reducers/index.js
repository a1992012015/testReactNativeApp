/**
 * Created by 圆环之理 on 2018/5/11.
 *
 * 全部的reducers的入口文件，
 *
 * 使用combineReducers将所有的reducer合并起来
 *
 */
'use strict';

import {combineReducers} from 'redux';

import HomeReducer from './HomeReducer';
import TradingReducer from './TradingReducer';
import IndexLoopReducer from './IndexLoopReducer';
import StartPage from "./startPage";

export default combineReducers({

    HomeReducer,
    TradingReducer,
    IndexLoopReducer,
    StartPage,

});




