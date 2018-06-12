/**
 * Created by 圆环之理 on 2018/5/11.
 *
 * 功能：用户资产数据
 *
 */
'use strict';

import * as types from './ActionTypes';
import Request from '../../utils/request';
import config from '../../utils/config';

const request = new Request();

export const InitUserInfo = props => {
    return dispatch => {
        let URL = config.api.person.isRealUrl;

        dispatch(fetchIndexMiddleBanner());

        request.post(URL, {}, props).then((responseText) => {

            if (responseText.ok) {
                return;
            }
            console.log(responseText);

            dispatch(myAssets(responseText));
        }).catch(error => {
            console.log('進入錯誤函數', error);
        })
    }
};

let fetchIndexMiddleBanner = () => {
    return {
        type: types.FETCHING_MYACCOUNT_DATA
    }
};

let myAssets = (userAssets) => {
    return {
        type: types.FETCH_MYACCOUNT_DATA,
        userAssets: userAssets,
        userLoading: false,
    }
};
