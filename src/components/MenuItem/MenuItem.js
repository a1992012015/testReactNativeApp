/**
 * Created by 圆环之理 on 2018/5/15.
 *
 * 功能：登陆 => 输入过的用户名列表组件 => 内层列表组件
 *
 */
'use strict';

import React from 'react';
import {StyleSheet, Text, TouchableHighlight} from 'react-native';
import PropTypes from 'prop-types';

const MenuItem = props => {
    return (
        <TouchableHighlight
            disabled={props.disabled}
            onPress={props.onPress}
            style={[styles.container, props.style]}
            underlayColor={props.underlayColor}
        >
            <Text
                numberOfLines={1}
                style={[
                    styles.title,
                    props.disabled && {color: props.disabledTextColor},
                    props.textStyle,
                ]}
            >
                {props.children}
            </Text>
        </TouchableHighlight>
    )
};

MenuItem.propTypes = {
    children: PropTypes.string.isRequired,
    disabled: PropTypes.bool,
    disabledTextColor: PropTypes.string,
    onPress: PropTypes.func,
    style: TouchableHighlight.propTypes.style,
    textStyle: Text.propTypes.style,
    underlayColor: TouchableHighlight.propTypes.underlayColor,
};

MenuItem.defaultProps = {
    disabled: false,
    disabledTextColor: 'rgb(189,189,189)',
    underlayColor: 'rgb(224,224,224)',
};

const styles = StyleSheet.create({
    container: {
        height: 48,
        width: '100%',
        justifyContent: 'center',
    },
    title: {
        fontSize: 14,
        fontWeight: '400',
        paddingHorizontal: 16,
        color: '#FFFFFF',
    },
});

export default MenuItem;
