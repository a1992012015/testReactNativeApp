/**
 * Created by 圆环之理 on 2018/5/11.
 *
 * 功能：用户资产数据
 *
 */
'use strict';

import * as types from './ActionTypes';
import request from '../../utils/request';
import config from '../../utils/config';

export let InitUserInfo = (props) => {
    return dispatch => {
        let URL = config.api.host + config.api.person.isRealUrl;
        dispatch(fetchIndexMiddleBanner());
        request.post(URL).then((responseText) => {
            console.log('用户资产',responseText);
            request.manyLogin(props, responseText);
            dispatch(myAssets(responseText))
        })
    }
};

let fetchIndexMiddleBanner = () => {
    return {
        type: types.FETCHING_MYACCOUNT_DATA
    }
};

let myAssets= (userAssets) => {
    return {
        type: types.FETCH_MYACCOUNT_DATA,
        userAssets: userAssets,
        userLoading: false,
    }
};
