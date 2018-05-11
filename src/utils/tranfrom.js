/**
 * Created by 圆环之理 on 2018/5/11.
 *
 * 功能：计算UI图像的大小并且转换
 *
 */
'use strict';

import React from 'react';
import {
    PixelRatio,
    Dimensions
} from 'react-native';

/**
 * 将UI给的像素值(切图上的px值)，转化为当前设备需要的数值
 * @param n
 * @returns {number}
 */
export default function p(n) {
    const WIDTH = Dimensions.get('window').width;
    return Math.round((n / 2) * (PixelRatio.getPixelSizeForLayoutSize(WIDTH) / PixelRatio.get()) / 360);
}