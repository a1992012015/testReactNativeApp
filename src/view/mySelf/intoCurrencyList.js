/**
 * Created by 圆环之理 on 2018/5/11.
 *
 * 功能：个人中心 => 充币界面
 *
 */
'use strict';

import React, {PureComponent} from 'react';
import {
    StyleSheet,
    Text,
    View,
    Dimensions,
    FlatList,
    ActivityIndicator,
    Image,
    TouchableOpacity,
} from 'react-native';

import Request from '../../utils/request'
import config from '../../utils/config'
import p from '../../utils/tranfrom';
import Title from '../../components/title';

const {width, height} = Dimensions.get('window');
const request = new Request();

export default class IntoCurrencyList extends PureComponent {
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            loadData: false,
            dataSource: []
        };
    }

    //真实的结构渲染出来以后调用
    componentDidMount() {
        this.pullDown()
    }

    newsDetail = row => {
        this.props.navigation.navigate('IntoCurrency', {intoData: row});
    };

    pullDown = () => {
        //地址
        let url = config.api.currency.account;

        request.post(url, {}, this.props).then(responseText => {

            if (responseText.ok) {//判断接口是否请求成功
                return;
            }

            let listData = [];
            const {obj} = responseText;

            obj.map((item, index) => {
                listData.push({
                    key: index,
                    value: item,
                })
            });
            this.setState({
                loadData: true,
                dataSource: obj,
            });
        });
    };

    render() {
        if (this.state.loadData) {
            return (
                <View style={{backgroundColor: '#1F2229', flex: 1}}>
                    {/*頂部標題*/}
                    <Title titleName="转入虚拟币" canBack={true} {...this.props}/>
                    {/*列表*/}
                    <FlatList
                        horizontal={false}
                        data={this.state.dataSource}
                        renderItem={this._renderRow}
                        onEndReachedThreshold={1}
                        refreshing={false}
                        initialNumToRender={15}
                        numColumns={2}
                        columnWrapperStyle={styles.list}
                    />
                </View>
            )
        } else {
            return (
                <ActivityIndicator
                    animating={true}
                    style={styles.centering}
                    size="large"
                />
            )
        }
    }

    _renderRow = ({item}) => {
        return (
            <TouchableOpacity
                style={styles.newsItems}
                onPress={() => this.newsDetail(item)}
                activeOpacity={.8}>
                <View style={styles.contentView}>
                    <Image style={{width: p(35), height: p(35)}}
                           source={{uri: config.api.host + item.picturePath}}
                    />
                    <Text style={styles.textView}>{item.coinCode}</Text>
                </View>
                <Image style={{width: p(35), height: p(35)}}
                       source={require('../../static/arrow.png')}
                />
            </TouchableOpacity>)
    }
}

const styles = StyleSheet.create({
    content: {
        borderWidth: StyleSheet.hairlineWidth,
        borderColor: '#cfcfcf',
    },
    loadingMore: {
        justifyContent: 'center',
        alignItems: 'center',
        marginVertical: p(20),
        width: width,
    },
    newsItems: {
        overflow: 'hidden',
        width: width / 2 - p(30),
        marginLeft: p(20),
        borderBottomWidth: StyleSheet.hairlineWidth,
        borderBottomColor: '#313840',
        flexDirection: 'row',
        justifyContent: 'space-between',
        padding: p(20),
        alignItems: 'center',
        backgroundColor: '#323840',
        marginTop: p(20),
        borderRadius: p(4),
    },
    textView: {
        color: '#B0B0B0',
        fontSize: p(26),
        left: -p(40)
    },
    contentView: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    loadingText: {
        fontSize: p(25),
        color: '#828282',
    },
    list: {
        flexDirection: 'row',
        flexWrap: 'wrap',
    },
    centering: {
        marginTop: (height - p(110)) / 2,
        alignItems: 'center',
        justifyContent: 'center',
    }
});