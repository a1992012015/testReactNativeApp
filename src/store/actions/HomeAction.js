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

export const InitUserInfo = (props) => {
    return dispatch => {
        let URL = `${config.api.person.isRealUrl}`;
        console.log(URL);
        dispatch(fetchIndexMiddleBanner());
        request.post(URL).then((responseText) => {
            console.log('用户资产', responseText);
            request.manyLogin(props, responseText).then(member => {
                console.log('登陆判定结果', member);
                if(member){
                    dispatch(myAssets(responseText))
                }
            });
        }).catch(error => {
            console.log(error);
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
