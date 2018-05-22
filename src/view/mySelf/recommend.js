/**
 * Created by 圆环之理 on 2018/5/17.
 *
 * 功能：推荐返佣页面
 *
 */
'use strict';

import React, {PureComponent} from 'react';
import {
    View,
    Text,
    Dimensions,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    FlatList,
    Clipboard,
    ActivityIndicator,
    Alert
} from 'react-native';
import Toast, {DURATION} from 'react-native-easy-toast';

import p from '../../utils/tranfrom';
import I18n from '../../utils/i18n';
import config from '../../utils/config';
import Request from '../../utils/request';
import Title from '../../components/title';

const {width, height} = Dimensions.get('window');
const request = new Request();

export default class Recommend extends PureComponent {

    static defaultProps = {};

    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            commendCode: '38938398393',
            reData: ['1111', '1111'],
            commendLink: null,
            commendCount: 0,
            loadData: false,
            commendMoney: 0,
            yesterdayMoney: 0
        };
    }

    //真是的DOM渲染出来以后调用
    componentDidMount() {
        this.getRecommend();
    }

    getRecommend = () => {
        let url = config.api.person.recommend;

        request.post(url).then(responseText => {

            if (responseText.ok) {//判断接口是否请求成功
                console.log('接口请求失败进入失败函数');
                return;
            }

            request.manyLogin(this.props, responseText);

            const {obj} = responseText;
            const {Commend, CommendInfo} = obj;

            let obj1 = Commend.obj;

            this.setState({
                commendCode: obj1.commendCode,
                commendLink: obj1.commendLink,
                commendCount: obj1.commendCount,
                commendMoney: obj1.commendMoney ? obj1.commendMoney : 0,
                yesterdayMoney: obj1.yesterdayMoney ? obj1.yesterdayMoney : 0,
                reData: CommendInfo,
                loadData: true
            });
        }).catch(function (error) {
            console.log(error);
            this.props.navigation.goBack(null);
            Alert.alert("服务器异常，请稍后访问");

        });
    };

    render() {
        const {toast} = this.refs;
        //console.log(toast);

        if (this.state.loadData) {
            let {reData, commendCode, commendLink, commendCount} = this.state;
            return (
                <View style={styles.container}>
                    <Title titleName={I18n.t('yaoqing')} canBack={true} {...this.props}/>
                    <ScrollView style={{margin: p(20)}}>
                        <Text style={styles.textView}>{I18n.t('tjpengyou')}:<Text
                            style={{color: '#D95411'}}>{commendCount}</Text></Text>

                        <View style={styles.codeView}>
                            <Text style={styles.textView1}>{I18n.t('yaoqingma')}：</Text>
                            <Text style={styles.textView2}>{commendCode}</Text>
                            <TouchableOpacity
                                onPress={() => {
                                    const {toast} = this.refs;
                                    Clipboard.setString(commendCode);
                                    toast.show(I18n.t('fuzhisuccess'), DURATION.LENGTH_SHORT);
                                }}
                                style={styles.touView}
                                activeOpacity={.8}
                            >
                                <Text style={styles.textView}>{I18n.t('fuzhi')}</Text>
                            </TouchableOpacity>
                        </View>
                        <View style={styles.codeView}>
                            <Text style={styles.textView1}>{I18n.t('yaoqinglianjie')}：</Text>
                            <Text style={styles.textView2}>{commendLink}</Text>
                            <TouchableOpacity
                                onPress={() => {
                                    const {toast} = this.refs;
                                    Clipboard.setString(commendLink);
                                    toast.show(I18n.t('fuzhisuccess'), DURATION.LENGTH_SHORT);
                                }}
                                style={styles.touView}
                                activeOpacity={.8}
                            >
                                <Text style={styles.textView}>{I18n.t('fuzhi')}</Text>
                            </TouchableOpacity>
                        </View>

                        <View style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            borderBottomWidth: StyleSheet.hairlineWidth,
                            borderBottomColor: '#313840',
                            padding: p(10),
                            marginTop: p(20),
                        }}>
                            <Text style={[styles.textRecord, {width: '33%'}]}>{I18n.t('fanyongB')}</Text>
                            <Text style={[styles.textRecord, {width: '33%'}]}>{I18n.t('fanyongJE')}</Text>
                            <Text style={[styles.textRecord, {width: '33%'}]}>{I18n.t('fanyongWJE')}</Text>
                        </View>

                        <FlatList
                            horizontal={false}
                            data={reData}
                            renderItem={this._quotRow}
                            onEndReachedThreshold={1}
                            initialNumToRender={10}
                            refreshing={false}
                            ListEmptyComponent={this.renderEmpty}
                        />
                    </ScrollView>

                    <Toast
                        ref="toast"
                        style={{backgroundColor: 'rgba(0,0,0,.6)'}}
                        position='top'
                        textStyle={{color: 'white'}}
                    />
                </View>
            )
        } else {
            return (
                <ActivityIndicator
                    animating={true}
                    style={{height: height / 2}}
                    size="large"
                />
            )
        }
    }

    renderEmpty = () => {
        return (
            <View style={{flex: 1, justifyContent: 'center', alignItems: 'center', marginTop: p(200)}}>
                <Text style={styles.textRecord}>暂无数据</Text>
            </View>
        )
    };

    _quotRow = ({item}) => {
        const {fixPriceCoinCode, deawalMoney, surplusMoney} = item;

        return (
            <View style={{flexDirection: 'row', padding: p(10)}}>
                <Text style={[styles.textRecord, {width: '33%'}]}>{fixPriceCoinCode}</Text>
                <Text style={[styles.textRecord, {width: '33%'}]}>{deawalMoney}</Text>
                <Text style={[styles.textRecord, {width: '33%'}]}>{surplusMoney}</Text>
            </View>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        backgroundColor: '#1F2228',
    },
    codeView: {
        marginTop: p(20),
        flexDirection: 'row',
        alignItems: 'center',
    },
    textView: {
        color: '#FFF',
        fontSize: p(26),
    },
    textView1: {
        color: '#FFF',
        fontSize: p(26),
        width: p(150),
    },
    textView2: {
        color: '#FFF',
        fontSize: p(26),
        width: width / 2,
    },
    touView: {
        backgroundColor: '#D95411',
        paddingHorizontal: p(30),
        paddingVertical: p(6),
        marginLeft: p(20),
    },
    textRecord: {
        color: '#ACB3B9',
        fontSize: p(26),
    },
});