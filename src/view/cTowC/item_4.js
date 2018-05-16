/**
 * Created by hurongsoft on 2018/1/23.
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    ListView,
    ActivityIndicator,
    Dimensions,
    Alert,
    FlatList
} from 'react-native';

import config from '../../../utils/config';
import p from '../../../utils/Transfrom';
import Title from '../../../components/Title';
import  request from '../../../utils/request';
import SegmentedControlTab from 'react-native-segmented-control-tab'
const {width, height}=Dimensions.get('window');


export default class Item_4 extends Component {
    constructor(props){
        super(props);
        this.state = {
            loadData:true,
            customStyleIndex:0
        }
    }

    componentDidMount() {
        this.setState({
            buyList:this.props.c2cBuySellList.buyList,
            sellList:this.props.c2cBuySellList.sellList,
            coinCode:this.props.coinCode,
        })
    }

    componentWillReceiveProps(props) {
        let {coinCode,c2cBuySellList} = props;
        this.setState({
            coinCode:coinCode,
            buyList:c2cBuySellList.buyList,
            sellList:c2cBuySellList.sellList,
        })
    }
    handleCustomIndexSelect = (index) => {
        this.setState({
            ...this.state,
            customStyleIndex: index,
        });
    }
    render(){
        if (this.state.loadData) {
            return (
                <View style={{flex: 1, backgroundColor: '#fafafa',marginBottom:config.api.isTabView?p(100):0}}>
                    <View style={{ width:width-p(40),marginLeft:p(20)}}>
                        <SegmentedControlTab
                            values={['买入记录', '卖出记录']}
                            selectedIndex={this.state.customStyleIndex}
                            onTabPress={this.handleCustomIndexSelect}
                            borderRadius={0}
                            tabsContainerStyle={{ height: p(70), backgroundColor: '#acbce3',marginVertical:p(20)}}
                            tabStyle={{backgroundColor: '#f4f4f4', borderWidth: StyleSheet.hairlineWidth, borderColor:'#dbdbdb'}}
                            activeTabStyle={{backgroundColor: '#f8671b'}}
                            tabTextStyle={{ color: '#313131'}}
                            activeTabTextStyle={{ color: '#FFFFFF' }} />

                    </View>
                    <View style={{height:p(2),backgroundColor:'#e6e6e6',marginTop:p(10)}}></View>
                    <View style={styles.ViewFlex}>
                        {this.state.customStyleIndex == 0 ?
                            <FlatList
                                horizontal={  false }
                                onEndReachedThreshold={10}
                                refreshing={false}
                                data={this.state.buyList}
                                renderItem={({item, i}) => (
                                    <View style={{width:width-p(100)}}>
                                        <View style={styles.viewS}>
                                            <Text style={styles.textS}>商户：{item.userName}</Text>
                                        </View>
                                        <View style={styles.viewS}>
                                            <View style={{flexDirection:'row',alignItems:'center'}}>
                                                <Text style={styles.textnum}>数量：</Text>
                                                <Text style={styles.textS}>{item.transactionCount}</Text>
                                                <Text style={[styles.textS,{marginLeft:p(4)}]}>{item.coinCode}</Text>
                                            </View>
                                            <Text style={{color:'#00c2d2',fontSize:p(24)}}>
                                                {/*{
                                                 item.status==1?'待审核':item.status==2?'已完成':'已否决'
                                                 }*/}
                                                交易完成
                                            </Text>

                                        </View>
                                        <View style={styles.lines}></View>
                                    </View>
                                )}
                            />
                            :
                            <FlatList
                                horizontal={  false }
                                onEndReachedThreshold={10}
                                refreshing={false}
                                data={this.state.sellList}
                                renderItem={({item, i}) => (
                                    <View style={{width:width-p(100)}}>
                                        <View style={styles.viewS}>
                                            <Text style={styles.textS}>商户：{item.userName}</Text>
                                        </View>
                                        <View style={styles.viewS}>
                                            <View style={{flexDirection:'row',alignItems:'center'}}>
                                                <Text style={styles.textnum}>数量：</Text>
                                                <Text style={styles.textS}>{item.transactionCount}</Text>
                                                <Text style={[styles.textS,{marginLeft:p(4)}]}>{item.coinCode}</Text>
                                            </View>
                                            <Text style={{color:'#00c2d2',fontSize:p(24)}}>
                                                {/*{
                                                 item.status==1?'待审核':item.status==2?'已完成':'已否决'
                                                 }*/}
                                                交易完成
                                            </Text>

                                        </View>
                                        <View style={styles.lines}></View>
                                    </View>
                                )}
                            />

                        }




                    </View>
                </View>
            )
        }else{
            return (
                <ActivityIndicator
                    animating={true}
                    style={{height: height/2}}
                    size="large"
                />
            )
        }
    }

}

let styles = StyleSheet.create({
    textnum:{
        color:'#282828',
        fontSize:p(24)
    },
    textS:{
        color:'#595959',
        fontSize:p(24)
    },
    viewS:{
        justifyContent:'space-between',
        flexDirection:'row',alignItems:'center',
        marginTop:p(40)
    },
    lines:{
        height:p(2),backgroundColor:'#e6e6e6',width:width-p(60),marginTop:p(10)
    },
    promptText:{
        color:'#2b2b2b',
        fontSize:p(26),
        lineHeight:p(40),
        marginTop:p(20)
    },
    textRecord:{
        color:'#292b2c',
        textAlign:'center'
    },
    ViewFlex:{
        width:width-p(20),
        marginLeft:p(40)
    }
})