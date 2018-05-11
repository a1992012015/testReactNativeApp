/**
 * Created by 圆环之理 on 2018/5/11.
 *
 * 功能：交易大厅管理
 */
'use strict';

import * as types from '../actions/ActionTypes';

const initialState = {
    tradingData:{},
    tradingLoading:false
};

let TradingReducer = (state = initialState, action) => {

    switch (action.type) {
        //交易大厅
        case types.FETCH_TRADING_DATA:
            return Object.assign({}, state, {tradingLoading: false, tradingData: action.tradingData});
        case types.FETCHING_TRADING_DATA:
            return Object.assign({}, state, {tradingLoading: true});
        default:
            return state;
    }
};

export default TradingReducer;