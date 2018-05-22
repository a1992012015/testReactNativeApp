/**
 * Created by 圆环之理 on 2018/5/11.
 *
 * 功能：首页数据管理
 */
'use strict';

import * as types from '../actions/ActionTypes';

const initialState = {
    homeData: {},
    homeLoading: true
};

let IndexLoopReducer = (state = initialState, action) => {

    switch (action.type) {
        //首页
        case types.FETCH_HOME_DATA:
            return Object.assign({}, state, {homeLoading: false, homeData: action.homeData});
        case types.FETCHING_HOME_DATA:
            return Object.assign({}, state, {homeLoading: true});
        default:
            return state;
    }
};

export default IndexLoopReducer;