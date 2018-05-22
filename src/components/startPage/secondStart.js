/**
 * Created by 圆环之理 on 2018/5/11.
 *
 * 功能：除了首次启动时的展示图片
 *
 */
'use strict';

import React, {PureComponent} from 'react';
import {
    Dimensions,
    View,
    StyleSheet,
    Image
} from 'react-native';
import {StackActions, NavigationActions} from 'react-navigation';

import appUrl from '../../utils/urlConfig';
import TabBar from '../../view/main/tabBar';
import config from '../../utils/config';

const {height, width} = Dimensions.get('window');

class SecondStart extends PureComponent {
    //构造函数
    constructor(props) {
        super(props);
    }

    //真实的DOM被渲染出来后调用
    componentDidMount() {
        this._toMain();
    }

    test() {
        console.log(this.props.navigation.state);
    }

    //第二次启动APP开始启动页会自动消失
    _toMain = () => {
        if (config.api.dEnvironment) {
            //打包
            this.timer = setTimeout(() => {
                //界面加载完开始执行
                const resetAction = StackActions.reset({
                    index: 0,
                    actions: [NavigationActions.navigate({routeName: 'TabBar'})],
                });
                this.props.navigation.dispatch(resetAction);
            }, 2000);
        } else {
            //本地调试
            const resetAction = StackActions.reset({
                index: 0,
                actions: [NavigationActions.navigate({routeName: 'TabBar'})],
            });
            this.props.navigation.dispatch(resetAction);
        }
    };

    render() {
        return (
            <View style={styles.bootPage}>
                <Image style={styles.page}
                       source={appUrl.api.splash[0]}
                />
            </View>
        );
    }
}

const styles = StyleSheet.create({
    bootPage: {
        width: width,
        height: height,
        backgroundColor: '#fff',
        justifyContent: 'center'
    },
    page: {
        width: width,
        height: height,
        resizeMode: 'stretch',
    }

});

export default SecondStart;