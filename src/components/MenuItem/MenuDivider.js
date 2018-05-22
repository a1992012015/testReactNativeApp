/**
 * Created by 圆环之理 on 2018/5/15.
 *
 * 功能：存疑
 *
 */
'use strict';

import React from 'react';
import {View, StyleSheet} from 'react-native';

import PropTypes from 'prop-types';

const MenuDivider = ({color}) => (
    <View style={[styles.divider, {borderBottomColor: color}]}/>
);

MenuDivider.defaultProps = {
    color: 'rgba(0,0,0,0.12)',
};

MenuDivider.propTypes = {
    color: PropTypes.string,
};

const styles = StyleSheet.create({
    divider: {
        flex: 1,
        borderBottomWidth: StyleSheet.hairlineWidth,
    },
});

export default MenuDivider;
