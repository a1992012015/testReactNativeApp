/**
 * Created by 圆环之理 on 2018/5/11.
 *
 * 功能：这都是使用返回键的
 *
 */
'use strict';

export function NaviGoBack(navigator) {
    if (navigator && navigator.getCurrentRoutes().length > 1) {
        navigator.pop();
        return true;
    }
    return false;
}

export function isEmptyObject(obj) {
    for (let name in obj) {
        return false;
    }
    return true;
}