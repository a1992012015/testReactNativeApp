/**
 * Created by 圆环之理 on 2018/5/11.
 *
 * 功能：首页数据
 *
 */
'use strict';

import * as types from './ActionTypes';
//首页
export let homeLoop = (homeData) => {
    return {
        type: types.FETCH_HOME_DATA,
        homeData: homeData,
        homeLoading: false,
    }
};

export let homeFloor = () => {
    return {
        type: types.FETCHING_HOME_DATA
    }
};