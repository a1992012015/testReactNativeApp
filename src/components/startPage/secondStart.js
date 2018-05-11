/**
 * Created by 圆环之理 on 2018/5/11.
 *
 * 功能：除了首次启动时的展示图片
 *
 */
'use strict';

import React,{Component} from 'react';
import {
    Dimensions,
    InteractionManager,
    View,
    StyleSheet,
    Image
} from 'react-native';
import {NavigationActions} from 'react-navigation'

import appUrl from '../../utils/urlConfig';
import TabBar from '../../view/main/tabBar';
import config from '../../utils/config';

const {height, width} = Dimensions.get('window');

class SecondStart extends Component {
    constructor(props) {
        super(props);
        this.state = {
            logined: false,
        }
    }

    componentDidMount() {
        this._toMain();
    }
/*
    _openWithTouchId = () => {
        this._toMain();
    };*/

    _toMain = () => {
        let that = this;

        if(config.api.dEnvironment){
            //打包
            this.timer = setTimeout(() => {
                //界面加载完开始执行
                InteractionManager.runAfterInteractions(() => {
                    const resetAction = NavigationActions.reset({
                        index: 0,
                        actions: [
                            NavigationActions.navigate({routeName: 'TabBar'})
                        ]
                    });
                    that.props.navigation.dispatch(resetAction);
                });
            }, 2000);
        }else{
            //本地调试
            InteractionManager.runAfterInteractions(() => {
                const resetAction = NavigationActions.reset({
                    index: 0,
                    actions: [
                        NavigationActions.navigate({routeName: 'TabBar'})
                    ]
                });
                that.props.navigation.dispatch(resetAction);
            });
        }
    };

    render() {
        console.log('查看执行顺序');
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