/**
 * Created by 圆环之理 on 2018/5/11.
 *
 * 功能：用户数据管理
 */
'use strict';

import * as types from '../actions/ActionTypes';

const initialState = {
    userAssets: {},
    userLoading: true
};

let HomeReducer = (state = initialState, action) => {

    switch (action.type) {
        //获取全部
        case types.FETCH_MYACCOUNT_DATA:
            return Object.assign({}, state, {userLoading: false, userAssets: action.userAssets});
        case types.FETCHING_MYACCOUNT_DATA:
            return Object.assign({}, state, {userLoading: true});
        default:
            return state;
    }
};

export default HomeReducer;