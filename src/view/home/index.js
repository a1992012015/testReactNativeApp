/**
 * Created by 圆环之理 on 2018/5/11.
 *
 * 功能：主页
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
    Image,
    FlatList,
    Platform,
    Linking,
    RefreshControl,
    ProgressBarAndroid,
    InteractionManager
} from 'react-native';
import {
    isFirstTime,
    isRolledBack,
    checkUpdate,
    downloadUpdate,
    switchVersion,
    markSuccess,
} from 'react-native-update';
import SegmentedControlTab from 'react-native-segmented-control-tab';
import {Theme, Overlay} from 'teaset'
import {connect} from 'react-redux';

import p from '../../utils/tranfrom';
import I18n from '../../utils/i18n';
import config from '../../utils/config';
import urlConfig from '../../utils/urlConfig';
import Request from '../../utils/request';
import Title from '../../components/title';
import RollingCaption from '../../components/rollingCaption';
import SwiperBanner from '../../components/swiperBanner';
import {homeLoop} from '../../store/actions/IndexLoopAction';

const {appKey} = urlConfig.api[Platform.OS];
const {width} = Dimensions.get('window');
const request = new Request();

class Index extends PureComponent {
    constructor(props) {
        super(props);

        this.state = {
            customStyleIndex: 0,
            headList: [],
            areaList: [],
            indexData: [],
            itemText: 'USDT',
            progress: 0.1,
        }
    }

    info = '';

    //在完成首次渲染之前调用
    componentWillMount() {
        InteractionManager.runAfterInteractions(() => {
            // ...耗时较长的同步的任务...
            if (isFirstTime) {
                markSuccess();
            } else if (isRolledBack) {
                //更新失败了,版本被回滚
                this.showPop('zoomOut', true, '温馨提示', '更新失败,版本已回滚', 0, '')
            } else {
                this.checkUpdate()
            }
        });
    };

    //真实的DOM被渲染出来后调用
    componentDidMount() {

        const {IndexLoopReducer} = this.props;
        console.log('在缓存里面拿到数据=>', IndexLoopReducer);
        if (!IndexLoopReducer.homeLoading) {
            this.handleData(IndexLoopReducer.homeData);
        }

        this.pollingData();
    }

    //组件接收到新的props时调用，并将其作为参数nextProps使用
    componentWillReceiveProps(nextProps) {
        const {IndexLoopReducer} = nextProps;
        console.log('轮询拿到的数据', IndexLoopReducer);

        if (!IndexLoopReducer.homeLoading) {
            this.handleData(IndexLoopReducer.homeData);
        }
    }

    //组件被移除之前被调用
    componentWillUnmount() {
        clearInterval(this.dexInter);
    }

    //轮询获取首页数据
    pollingData = () => {
        const {dispatch} = this.props;
        //开启计时器循环拿取首页显示数据
        this.dexInter = setTimeout(() => {
            let URL = config.api.index.indexList;

            request.post(URL, {}, this.props).then(responseText => {

                if (responseText.ok) {//判断接口是否请求成功
                    console.log('接口请求失败进入失败函数');
                    //toast.show('登陆失败', 50000);
                    return;
                }

                dispatch(homeLoop(responseText));
                this.pollingData();
            }).catch(error => {
                console.log('进入失败函数', error);
            });
        }, 1000);
    };
    //檢測app版本并且提示更新
    checkUpdate = () => {
        checkUpdate(appKey).then(info => {
            this.info = info;
            console.log(info);
            const {expired, upToDate} = info;
            if (expired) {
                this.showPop('zoomOut', true, '版本升级', '您的应用版本已更新,需下载新的版本!', 4, config.api.appReleaseApk)
            } else if (upToDate) {
                //this.showPop('zoomOut', true,'温馨提示','您的应用版本已是最新!',5,'')
            } else {
                this.showPop('zoomOut', true, '更新提示', '检查到新的版本' + info.name + ',是否现在更新?', 1, '')
            }
        }).catch(err => {
            console.log('更新失败错误=>', err);
            this.showPop('zoomOut', true, '温馨提示', '更新失败', 0, '')
        });
    };
    //正在更新执行中
    doUpdate = (info, overlayPopView) => {
        overlayPopView.close();
        this.showPop('zoomOut', true, '温馨提示', '正在更新,请稍等...', 2, '');
        downloadUpdate(info).then(hash => {
            this.showPop('zoomOut', true, '温馨提示', '已更新完毕,请重启您的应用!', 3, hash)
        }).catch(err => {
            console.log('更新错误=>', err);
            overlayPopView.close();
            this.showPop('zoomOut', true, '温馨提示', '更新失败', 0, '')
        });
    };

    //更新弹出层
    showPop(type, modal, title, content, step, hash) {
        let overlayView = (
            <Overlay.PopView
                style={{alignItems: 'center', justifyContent: 'center'}}
                type={type}
                modal={modal}
                ref={v => this.overlayPopView = v}
            >
                <View style={{alignItems: 'center', justifyContent: 'center', bottom: -p(40), zIndex: 9999}}>
                    <Image
                        resizeMode='stretch'
                        style={{width: p(80), height: p(80)}}
                        source={require('../../static/home/to_update.png')}
                    />
                </View>

                <View style={{
                    backgroundColor: Theme.defaultColor,
                    borderRadius: p(10),
                    width: width - p(240),
                }}>
                    <View style={{alignItems: 'center', justifyContent: 'center'}}>
                        <Text style={{color: '#454545', fontSize: p(28), fontWeight: '500', marginTop: p(65)}}>
                            {title}
                        </Text>
                    </View>
                    <View style={{
                        alignItems: 'center',
                        justifyContent: 'center',
                        marginTop: p(30),
                        marginLeft: p(15),
                        marginRight: p(15)
                    }}>
                        <Text style={{color: '#3b3b3b', fontSize: p(26)}}>{content}</Text>
                    </View>
                    {
                        step === 1 || step === 3 || step === 4 || step === 5 || step === 0 ?
                            <View style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginTop: p(40),
                                marginBottom: p(30)
                            }}>
                                {
                                    step === 1 ?
                                        <TouchableOpacity
                                            onPress={() => this.doUpdate(this.info, this.overlayPopView)}
                                            style={{
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                borderRadius: p(5),
                                                width: width - p(300),
                                                backgroundColor: '#D95411',
                                                height: p(60)
                                            }}
                                        >
                                            <Text style={{color: '#FFF', fontSize: p(24)}}>确认</Text>
                                        </TouchableOpacity>
                                        : step === 3 ?
                                        <TouchableOpacity
                                            onPress={() => switchVersion(hash)}
                                            style={{
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                borderRadius: p(5),
                                                width: width - p(300),
                                                backgroundColor: '#D95411',
                                                height: p(60)
                                            }}
                                        >
                                            <Text style={{color: '#FFF', fontSize: p(24)}}>确认</Text>
                                        </TouchableOpacity>
                                        : step === 4 ?
                                            <TouchableOpacity
                                                onPress={() => Linking.openURL(hash)}
                                                style={{
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    borderRadius: p(5),
                                                    width: width - p(300),
                                                    backgroundColor: '#D95411',
                                                    height: p(60)
                                                }}
                                            >
                                                <Text style={{color: '#FFF', fontSize: p(24)}}>确认</Text>
                                            </TouchableOpacity>
                                            : null
                                }
                                {
                                    step !== 3 ?
                                        <TouchableOpacity
                                            onPress={() => this.overlayPopView && this.overlayPopView.close()}
                                            style={{
                                                alignItems: 'center',
                                                justifyContent: 'center',
                                                borderRadius: p(5),
                                                width: width - p(300),
                                                marginTop: p(30),
                                                backgroundColor: '#D95411',
                                                height: p(60)
                                            }}
                                        >
                                            <Text style={{color: '#FFF', fontSize: p(24)}}>取消</Text>
                                        </TouchableOpacity>
                                        : null
                                }
                            </View>
                            : step === 2 ?
                            <View style={{
                                alignItems: 'center',
                                justifyContent: 'center',
                                marginTop: p(40),
                                marginBottom: p(30)
                            }}>
                                <ProgressBarAndroid
                                    color="#D95411"
                                    styleAttr='Horizontal'
                                    progress={this.state.progress}
                                    indeterminate={true}
                                    style={{marginTop: 10, width: width - p(300)}}
                                />
                            </View>
                            : null
                    }
                </View>
            </Overlay.PopView>
        );
        Overlay.show(overlayView);
    }

    //首页数据渲染函数
    handleData = homeData => {
        let areaData = {};
        let headData = [];

        homeData.map((item, index) => {
            let coinCode = item.coinCode.split("_")[1];

            if (index === 0) {
                headData.push("USDT");
            }

            if (headData.indexOf(coinCode) === -1) {
                headData.push(coinCode);
            }

            if (areaData[`${coinCode}`]) {
                areaData[`${coinCode}`].push({
                    key: index,
                    value: item,
                });
            } else {
                areaData[`${coinCode}`] = [{
                    key: index,
                    value: item,
                }];
            }
        });

        this.setState({
            areaList: areaData,
            headList: headData,
            indexData: areaData[this.state.itemText],
        })
    };
    /*首頁转换交易区的点击事件*/
    handleCustomIndexSelect = index => {
        let {headList, areaList} = this.state;

        if (areaList) {
            this.setState({
                itemText: headList[index],
                customStyleIndex: index,
                indexData: areaList[headList[index]]
            });
        } else {
            this.setState({
                itemText: headList[index],
                customStyleIndex: index
            });
        }
    };
    //下拉刷新
    queryIndex = () => {
        const {dispatch} = this.props;
        let URL = config.api.index.indexList;
        request.post(URL, {}, this.props).then(responseText => {

            if (response.ok) {//判断接口是否请求成功
                console.log('接口请求失败进入失败函数');
                //toast.show('登陆失败', 50000);
                return;
            }

            dispatch(homeLoop(responseText));
        }).catch(() => {
            console.log('进入失败函数');
        });
    };

    //渲染
    render() {
        return (
            <View style={{backgroundColor: '#1F2229', flex: 1, marginBottom: p(100)}}>
                {/*标题组件*/}
                <Title titleName={I18n.t('Index')} canBack={false} {...this.props} />

                <ScrollView
                    style={{flex: 1, margin: p(20)}}
                    showsVerticalScrollIndicator={false}//当此属性为true的时候，显示一个水平方向的滚动条。
                    scrollsToTop={true}//当此值为true时，点击状态栏的时候视图会滚动到顶部。默认值为true
                    scrollEventThrottle={1}
                    refreshControl={
                        <RefreshControl
                            refreshing={false}
                            onRefresh={this.queryIndex}
                        />
                    }
                >
                    {/*首页轮播图*/}
                    <View style={{height: width * .45}}>
                        <SwiperBanner height={width * .45} {...this.props}/>
                    </View>
                    {/*公告信息*/}
                    <RollingCaption  {...this.props}/>
                    {/*交易分区的切换TAB*/}
                    <SegmentedControlTab
                        values={this.state.headList}
                        selectedIndex={this.state.customStyleIndex}
                        onTabPress={this.handleCustomIndexSelect}
                        borderRadius={0}
                        tabsContainerStyle={{height: p(70), backgroundColor: '#1F2229', marginVertical: p(20)}}
                        tabStyle={{
                            backgroundColor: '#1F2229',
                            borderWidth: StyleSheet.hairlineWidth,
                            borderColor: '#313840',
                        }}
                        activeTabStyle={{backgroundColor: '#313840'}}
                        tabTextStyle={{color: '#FFFFFF', fontSize: p(32)}}
                        activeTabTextStyle={{color: '#FFFFFF'}}
                    />
                    {/*显示每条数据的涨幅情况信息*/}
                    <FlatList
                        horizontal={false}
                        data={this.state.indexData}
                        renderItem={this._renderRow}
                        keyExtractor={(item, index) => index.toString()}
                        onEndReachedThreshold={1}
                        refreshing={false}
                    />

                </ScrollView>
            </View>
        );
    }

    //行情升降的显示方式
    rowContent = (currentExchangPrice, lastExchangPrice, keep) => {
        if (currentExchangPrice < lastExchangPrice) {
            //对比昨日降低的百分比
            return (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{fontSize: p(36), color: '#28D74E'}}>
                        {parseFloat(currentExchangPrice).toFixed(keep)}
                    </Text>
                    <Image
                        style={{width: p(30), height: p(30)}}
                        source={require('../../static/home/lowarrow.png')}
                    />
                </View>
            )
        } else if (currentExchangPrice > lastExchangPrice) {
            //对比昨日涨幅的百分比
            return (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{fontSize: p(36), color: '#F6574D'}}>
                        {parseFloat(currentExchangPrice).toFixed(keep)}
                    </Text>
                    <Image
                        style={{width: p(30), height: p(30)}}
                        source={require('../../static/home/uparrow.png')}
                    />
                </View>
            )
        } else {
            //不升也不降的显示方式
            return (
                <View style={{flexDirection: 'row', alignItems: 'center'}}>
                    <Text style={{fontSize: p(36), color: '#FFFFFF'}}>
                        {parseFloat(currentExchangPrice).toFixed(keep)}
                    </Text>
                </View>
            )
        }
    };
    //点击跳转交易大厅
    transDetail = (row) => {
        this.props.tabPage('Lobby', row.coinCode);
    };
    //每一行数据的显示方式
    _renderRow = ({item}) => {
        const {value} = item;
        let {
            RiseAndFall,
            picturePath,
            currentExchangPrice,
            lastExchangPrice,
            price_keepDecimalFor,
            maxPrice,
            minPrice,
            yesterdayPrice,
            transactionSum,
        } = value;
        RiseAndFall = parseFloat(RiseAndFall).toFixed(3);
        return (
            <TouchableOpacity
                onPress={() => this.transDetail(value)}
                activeOpacity={.8}
            >
                <View style={[styles.contentView, {backgroundColor: '#313840', height: p(72)}]}>
                    <View style={styles.contentView}>
                        {/*每条数据标题左侧币种图标*/}
                        <Image
                            style={{width: p(35), height: p(35)}}
                            source={{uri: `${config.api.host}${picturePath}`}}
                        />
                        {/*每条数据的币种名称*/}
                        <Text style={[styles.textView, {
                            fontSize: p(32),
                            marginLeft: p(8)
                        }]}>
                            {item.value.name}_{this.state.itemText}
                        </Text>
                    </View>
                    {/*每条数据的右侧箭头图标*/}
                    <Image
                        style={{width: p(35), height: p(35)}}
                        source={require('../../static/arrow.png')}
                    />
                </View>
                <View style={{borderWidth: StyleSheet.hairlineWidth, borderColor: '#313840'}}>
                    <View style={[styles.contentView, {backgroundColor: '#1F2229'}]}>
                        {/*显示对比涨幅百分比*/}
                        {this.rowContent(currentExchangPrice, lastExchangPrice, price_keepDecimalFor)}

                        {
                            RiseAndFall > 0 ?
                                <View style={{
                                    backgroundColor: '#c1180f',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: p(5),
                                    height: p(34),
                                    paddingHorizontal: p(15)
                                }}>
                                    <Text style={{
                                        fontSize: p(24),
                                        color: RiseAndFall > 0 ? '#FFF' : '#FFF'
                                    }}>{RiseAndFall}%</Text>
                                </View>
                                : RiseAndFall === 0 ?
                                <View style={{
                                    backgroundColor: '#5a5a5a',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: p(5),
                                    height: p(34),
                                    paddingHorizontal: p(15)
                                }}>
                                    <Text style={{
                                        fontSize: p(24),
                                        color: RiseAndFall > 0 ? '#FFF' : '#FFF'
                                    }}>{RiseAndFall}%</Text>
                                </View>
                                :
                                <View style={{
                                    backgroundColor: '#018F67',
                                    alignItems: 'center',
                                    justifyContent: 'center',
                                    borderRadius: p(5),
                                    height: p(34),
                                    paddingHorizontal: p(15)
                                }}>
                                    <Text style={{
                                        fontSize: p(24),
                                        color: RiseAndFall > 0 ? '#FFF' : '#FFF'
                                    }}>{RiseAndFall}%</Text>
                                </View>

                        }
                    </View>
                    <View style={{flexDirection: 'row', paddingHorizontal: p(20), paddingBottom: p(10)}}>
                        {/*最高价*/}
                        <View style={{width: '25%'}}>
                            <Text style={styles.textFont}>{I18n.t('zuiGao')}</Text>
                            <Text style={styles.textFont}>
                                {parseFloat(maxPrice).toFixed(price_keepDecimalFor)}
                            </Text>
                        </View>
                        {/*最低价*/}
                        <View style={{width: '25%'}}>
                            <Text style={styles.textFont}>{I18n.t('zuiDi')}</Text>
                            <Text style={styles.textFont}>
                                {parseFloat(minPrice).toFixed(price_keepDecimalFor)}
                            </Text>
                        </View>
                        {/*昨日收盘价*/}
                        <View style={{width: '25%'}}>
                            <Text numberOfLines={1} style={styles.textFont}>{I18n.t('zuorishoupanjia')}</Text>
                            <Text style={styles.textFont}>
                                {parseFloat(yesterdayPrice).toFixed(price_keepDecimalFor)}
                            </Text>
                        </View>
                        {/*日成交量*/}
                        <View style={{width: '25%'}}>
                            <Text numberOfLines={1} style={styles.textFont}>{I18n.t('HourJiaoYiLiang')}</Text>
                            <Text style={styles.textFont}>
                                {parseFloat(transactionSum).toFixed(price_keepDecimalFor)}
                            </Text>
                        </View>
                    </View>
                </View>
            </TouchableOpacity>)
    }
}

const styles = StyleSheet.create({
    modal: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: p(20),
        height: p(270),
        width: width - p(150)
    },
    stickyHeader: {
        backgroundColor: 'transparent',
        position: 'absolute',
        overflow: 'hidden',
        top: 0,
        left: 0,
        height: Platform.OS === 'android' ? 70 : 60,
        width: width,
        zIndex: 97,
    },
    textName: {
        textAlign: 'center',
        fontSize: p(25),
        justifyContent: 'center'
    },
    contentView: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        padding: p(10)
    },
    textView: {
        color: '#FFFFFF'
    },
    textFont: {
        fontSize: p(24),
        color: '#ACB3B9'
    },
    tabContent: {
        color: '#444444',
        fontSize: p(18),
        margin: p(24)
    },
    modal_1: {
        justifyContent: 'center',
        alignItems: 'center',
        borderRadius: p(20)
    },
    modal3: {
        height: p(450),
        width: width - p(100)
    },
});

export default connect((state) => {
    const {IndexLoopReducer} = state;
    return {
        IndexLoopReducer
    }
})(Index);