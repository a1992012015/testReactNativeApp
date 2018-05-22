/**
 * Created by 圆环之理 on 2018/5/11.
 *
 * 功能：交易大厅数据
 *
 */
'use strict';

import * as types from './ActionTypes';
//交易大厅
export let tradingHall = (tradingData) => {
    return {
        type: types.FETCH_TRADING_DATA,
        tradingData: tradingData,
        userLoading: false,
    }
};

export let tradingFloor = () => {
    return {
        type: types.FETCHING_TRADING_DATA
    }
};