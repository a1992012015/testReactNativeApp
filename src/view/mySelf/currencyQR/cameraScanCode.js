/**
 * Created by 圆环之理 on 2018/5/17.
 *
 * 功能：扫码转币页面 => 二维码扫描页面 => 二维码窗口页面
 *
 */
'use strict';

import React, {PureComponent} from 'react';
import {
    Dimensions,
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Animated,
    Image
} from 'react-native';
import Camera from 'react-native-camera';
import Icon from 'react-native-vector-icons/Ionicons';

import p from '../../../utils/tranfrom';

const {width, height} = Dimensions.get('window');

export default class CameraScanCode extends PureComponent {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            num: 1,
            topHeight: new Animated.Value(-25),
        };
    }

    //真实的DOM加载完成后调用
    componentDidMount() {

        // this.animate();

        this.move();


    }

    //组件被移除后调用
    componentWillUnmount() {
        if (this.timer) {
            clearInterval(this.timer);
        }
    }

    animate = () => {
        Animated.timing(
            this.state.topHeight, {
                toValue: p(350),
                duration: 1800
            }
        ).start(() => {
            this.setState({
                topHeight: new Animated.Value(0)
            });
            this.animate()
        });
    };


    move() {
        Animated.timing(
            this.state.topHeight, {
                toValue: p(350),
                duration: 1800
            }
        ).start(() => this.moveBack());
    }

    moveBack() {
        Animated.timing(
            this.state.topHeight, {
                toValue: -25,
                duration: 1800
            }
        ).start(() => this.move());
    }

    callScan = data => {
        let rsDate = data.data;
        console.log("二维码扫描结果", rsDate);
        const {params} = this.props.navigation.state;
        params.getQRValue(rsDate);
        this.props.navigation.goBack();
    };

    // 渲染
    render() {
        let scanArea = (
            <View style={styles.rectangleContainer}>
                <View style={{
                    width: width,
                    flex: 2,
                    borderColor: '#2d2d2d',
                    borderWidth: 1,
                    backgroundColor: '#2D2D2D',
                    opacity: 0.5
                }}/>
                <View style={{flexDirection: 'row', flex: 3, height: p(400), justifyContent: 'space-between'}}>
                    <View style={{flex: 1, backgroundColor: '#2D2D2D', opacity: 0.5}}/>
                    <View style={styles.rectangle}>

                        <View style={{flexDirection: 'row', flex: 1, justifyContent: 'space-between'}}>
                            <View style={{justifyContent: 'space-between', width: p(25)}}>
                                <View style={{
                                    borderTopWidth: 2,
                                    borderLeftWidth: 2,
                                    borderColor: '#fff',
                                    width: p(25),
                                    height: p(25)
                                }}/>
                                <View style={{
                                    borderBottomWidth: 2,
                                    borderLeftWidth: 2,
                                    borderColor: '#fff',
                                    width: p(25),
                                    height: p(25)
                                }}/>
                            </View>
                            <Animated.View style={{marginTop: this.state.topHeight, flex: 1}}>

                                <Image
                                    source={require('../../../static/mySelf/scanLine.png')}
                                    style={{
                                        width: p(420), height: p(100),
                                        resizeMode: Image.resizeMode.stretch

                                    }}
                                />
                            </Animated.View>
                            <View style={{justifyContent: 'space-between', width: p(25)}}>
                                <View style={{
                                    borderTopWidth: 2,
                                    borderRightWidth: 2,
                                    borderColor: '#fff',
                                    width: p(25),
                                    height: p(25),
                                    marginRight: p(0)
                                }}/>
                                <View style={{
                                    borderBottomWidth: 2,
                                    borderRightWidth: 2,
                                    borderColor: '#fff',
                                    width: p(25),
                                    height: p(25),
                                    marginRight: p(0)
                                }}/>
                            </View>
                        </View>
                    </View>
                    <View style={{flex: 1, backgroundColor: '#2D2D2D', opacity: 0.5}}/>
                </View>

                <View style={{width: width, flex: 4, alignItems: 'center', backgroundColor: '#2D2D2D', opacity: 0.5}}>
                    <View style={{marginTop: p(25)}}>
                        <Text style={{color: '#fff', fontSize: p(20)}}>对准二维码／条形码到框内即可扫描</Text>
                    </View>
                </View>
            </View>
        );

        return (
            <View style={{flex: 1}}>
                <View style={styles.header}>
                    <TouchableOpacity
                        onPress={() => this.props.navigation.goBack(null)}
                        style={styles.sty19}
                    >
                        <Icon name="ios-arrow-dropleft" size={31} color={'#fff'}/>
                    </TouchableOpacity>

                    <Text style={styles.headerTitle}>扫描二维码</Text>
                    <View style={styles.sty19}/>
                </View>

                <Camera
                    aspect={Camera.constants.Aspect.fill}
                    barCodeTypes={[Camera.constants.BarCodeType.qr]}
                    onBarCodeRead={(data) => this.callScan(data)}
                    style={styles.camera}
                >
                    {scanArea}
                </Camera>
            </View>
        );
    }
}

let styles = StyleSheet.create({
    camera: {
        flex: 1
    },
    rectangleContainer: {
        flex: 1,
        alignItems: 'center',
        width: width,
        height: height,
        justifyContent: 'center',
        backgroundColor: 'transparent'
    },
    rectangle: {
        flex: 4,
        width: p(400),
        backgroundColor: 'transparent'
    },
    header: {
        position: 'absolute',
        width: width,
        height: p(80),
        top: p(45),
        zIndex: 99,
        backgroundColor: 'transparent',
        flexDirection: 'row',
        alignItems: 'center'
    },
    sty19: {
        flex: 2,
        paddingLeft: p(20)
    },

    headerTitle: {
        flex: 2,
        color: '#fff',
        fontSize: p(30),
        textAlign: 'center',
        alignItems: 'center',
    },
    rightHeader: {
        flex: 2,
        flexDirection: 'row',
        justifyContent: 'flex-end',
    },
    defaultView: {
        flex: 1,
        backgroundColor: '#F3F3F3'
    },
    preview: {
        flex: 1,
        justifyContent: 'flex-end',
        alignItems: 'center',
        height: Dimensions.get('window').height,
        width: Dimensions.get('window').width
    },
    headerContent: {
        height: p(100),
        paddingTop: p(35),
        backgroundColor: 'transparent',
        paddingHorizontal: p(32),
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
    }
});

