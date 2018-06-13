/**
 * Created by 圆环之理 on 2018/5/14.
 *
 * 功能：管理启动页面的显示图片
 *
 */
'use strict';

import * as types from '../actions/ActionTypes';

const initialState = {
    pageFlag: false,//启动页的图片显示方式默认为false
};

let StartPage = (state = initialState, action) => {

    switch (action.type) {
        //获取全部
        case types.START_PAGE_DATA:
            return Object.assign({}, state, {pageFlag: true});
            //重新初始化
        case types.START_PAGE_DELETE:
            return Object.assign({}, state, {pageFlag: false});
        default:
            return state;
    }
};

export default StartPage;