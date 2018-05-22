/**
 * Created by 圆环之理 on 2018/5/15.
 *
 * 功能：登陆 => 输入过的用户名列表组件 => 外层组件
 *
 */
'use strict';

import React, {PureComponent} from 'react';
import {
    Animated,
    Dimensions,
    Easing,
    Modal,
    Platform,
    StyleSheet,
    TouchableWithoutFeedback,
    View,
    ViewPropTypes,
} from 'react-native';
import PropTypes from 'prop-types';

const STATES = {
    HIDDEN: 'HIDDEN',
    SHOWN: 'SHOWN',
    ANIMATING: 'ANIMATING',
};
const ANIMATION_DURATION = 300;
const EASING = Easing.bezier(0.4, 0, 0.2, 1);
const MENU_PADDING_VERTICAL = 8;
const SCREEN_INDENT = 8;

class MenuSelect extends PureComponent {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            menuState: STATES.HIDDEN,

            top: 0,
            left: 0,

            menuWidth: 0,
            menuHeight: 0,

            buttonWidth: 0,
            buttonHeight: 0,

            menuSizeAnimation: new Animated.ValueXY({x: 0, y: 0}),
            opacityAnimation: new Animated.Value(0),
        };
    }

    //类型验证
    static propTypes = {
        /*button: PropTypes.node.isRequired,*/
        children: PropTypes.node.isRequired,
        style: ViewPropTypes.style,
    };

    _container = null;
    //启动菜单动画
    _onMenulLayout = e => {
        if (this.state.menuState === STATES.ANIMATING) {
            return;
        }

        const {width, height} = e.nativeEvent.layout;
        const menuHeightWithPadding = height - MENU_PADDING_VERTICAL * 2;

        this.setState({
            menuState: STATES.ANIMATING,
            menuWidth: width,
            menuHeight: height,
        }, () => {
            Animated.parallel([
                Animated.timing(this.state.menuSizeAnimation, {
                    toValue: {x: width, y: menuHeightWithPadding},
                    duration: ANIMATION_DURATION,
                    easing: EASING,
                }),
                Animated.timing(this.state.opacityAnimation, {
                    toValue: 1,
                    duration: ANIMATION_DURATION,
                    easing: EASING,
                }),
            ]).start();
        });
    };
    //设置ref节点
    _setContainerRef = ref => {
        this._container = ref;
    };
    //显示
    show = () => {
        this._container.measureInWindow((x, y) => {
            this.setState({menuState: STATES.SHOWN, top: y, left: x});
        });
    };
    //隐藏
    hide = () => {
        Animated.timing(this.state.opacityAnimation, {
            toValue: 0,
            duration: ANIMATION_DURATION,
            easing: EASING,
        }).start(() =>
            // Reset state
            this.setState({
                menuState: STATES.HIDDEN,
                menuSizeAnimation: new Animated.ValueXY({x: 0, y: 0}),
                opacityAnimation: new Animated.Value(0),
            }),
        );
    };

    render() {
        const dimensions = Dimensions.get('screen');

        const {menuSizeAnimation} = this.state;
        const menuSize = {
            width: menuSizeAnimation.x,
            height: menuSizeAnimation.y,
        };

        // 调整菜单位置
        let {left, top} = this.state;
        const transforms = [];

        // 如果菜单点击正确
        if (left > dimensions.width - this.state.menuWidth - SCREEN_INDENT) {
            transforms.push({
                translateX: Animated.multiply(menuSizeAnimation.x, -1),
            });

            left += this.state.buttonWidth;
        }

        // 如果菜单点击底部
        if (top > dimensions.height - this.state.menuHeight - SCREEN_INDENT) {
            transforms.push({
                translateY: Animated.multiply(menuSizeAnimation.y, -1),
            });

            top += this.state.buttonHeight - MENU_PADDING_VERTICAL * 2;
        }

        const shadowMenuContainerStyle = {
            opacity: this.state.opacityAnimation,
            transform: transforms,
            left,
            top,
        };

        const {menuState} = this.state;
        const animationStarted = menuState === STATES.ANIMATING;
        const modalVisible = menuState === STATES.SHOWN || animationStarted;

        return (
            <View ref={this._setContainerRef} collapsable={false}>

                <Modal visible={modalVisible} onRequestClose={this.hide} transparent>
                    <TouchableWithoutFeedback onPress={this.hide}>
                        <View style={StyleSheet.absoluteFill}>
                            <Animated.View
                                onLayout={this._onMenulLayout}
                                style={[
                                    styles.shadowMenuContainer,
                                    shadowMenuContainerStyle,
                                    this.props.style,
                                ]}
                            >
                                <Animated.View
                                    style={[styles.menuContainer, animationStarted && menuSize]}
                                >
                                    {this.props.children}
                                </Animated.View>
                            </Animated.View>
                        </View>
                    </TouchableWithoutFeedback>
                </Modal>
            </View>
        );
    }
}

const styles = StyleSheet.create({
    shadowMenuContainer: {
        position: 'absolute',
        backgroundColor: 'white',
        borderRadius: 2,
        opacity: 0,
        paddingVertical: MENU_PADDING_VERTICAL,

        // Shadow
        ...Platform.select({
            ios: {
                shadowColor: 'black',
                shadowOffset: {width: 0, height: 2},
                shadowOpacity: 0.14,
                shadowRadius: 2,
            },
            android: {
                elevation: 2,
            },
        }),
    },

    menuContainer: {
        overflow: 'hidden',
    },
});

export default MenuSelect;
