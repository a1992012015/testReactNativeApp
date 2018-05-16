/**
 * Created by hurongsoft on 2018/1/23.
 */

import React, {Component} from 'react';
import {
    StyleSheet,
    View,
    Text,
    RefreshControl,
    ActivityIndicator,
    Dimensions,
    Alert,
    FlatList,
    TouchableOpacity,
    ScrollView,
    TextInput
} from 'react-native';

import config from '../../../utils/config';
import p from '../../../utils/Transfrom';
import Title from '../../../components/Title';
import  request from '../../../utils/request';
import Loading from '../../../utils/loading';
import {Toast,Theme,Select,Checkbox, ListRow, Overlay, Label, Button} from 'teaset'
import BuySellModal from '../ctc/BuySellModal';
const {width, height}=Dimensions.get('window');


export default class Item_3 extends Component {
    constructor(props){
        super(props);
        this.state = {
            loadData:true,
            orderList:[],
            loading:true,
            isOpen:false,
            isType:'buy'
        }
    }



    componentDidMount() {
        this.setState({
            orderList:this.props.c2cBuySellList.orderList,
            coinCode:this.props.coinCode,
            loading:false
        })
    }

    componentWillReceiveProps(props) {
        let {coinCode,c2cBuySellList} = props;
        this.setState({
            coinCode:coinCode,
            orderList:c2cBuySellList.orderList,
            loading:false
        })
    }

    //弹出层
    showPop(type, modal, item,typeState) {
        this.state.remark = null;
        let overlayView = (
            <Overlay.PopView
                style={{alignItems: 'center', justifyContent: 'center'}}
                type={type}
                modal={modal}
                ref={v => this.overlayPopView = v}
            >
                <View style={{backgroundColor: Theme.defaultColor,
                    borderRadius: p(10), width:width-p(100),height:p(400)}}>

                    <View style={{alignItems:'center',justifyContent:'space-between',marginTop:p(20),flexDirection:'row'}}>
                        <Text style={{marginLeft:p(160),color:'#313131',fontSize:p(32)}}>
                            {
                                typeState==0?'是否确认交易失败?':'是否确认交易关闭?'
                            }

                        </Text>
                        <TouchableOpacity
                            style={{marginRight:p(20)}}
                            onPress={() => this.overlayPopView && this.overlayPopView.close()}>
                            <Text>X</Text>
                        </TouchableOpacity>
                    </View>

                    <View style={{height:p(2),width:width-p(100),marginTop:p(10),alignItems:'center'}}>
                        <View style={styles.inputTextStyle}>
                            <TextInput
                                underlineColorAndroid='transparent'
                                placeholder="请填写原因"
                                clearButtonMode={'while-editing'}
                                placeholderTextColor={'#565A5D'}
                                selectionColor={"#565A5D"}
                                style={styles.inputTextView}
                                value= {this.state.remark}
                                onChangeText={(text) => this.setState({remark:text})}
                            />
                        </View>

                        <View style={{marginTop:p(40)}}>
                            <TouchableOpacity
                                onPress={()=>this.c2cTransaction(item,typeState)}
                                style={styles.touchableStyle}>
                                <Text style={{color:'#FFF'}}>确定</Text>
                            </TouchableOpacity>

                        </View>


                    </View>



                </View>
            </Overlay.PopView>
        );
        Overlay.show(overlayView);

        this.setState({
            checked: true
        })
    }
    //确认支付
    payc2cTransaction = (item) => {
        Alert.alert('温馨提醒', '是否确认支付', [
            {
                text: '取消', onPress: () => {
            }
            },
            {
                text: '确定', onPress: () =>
            {
                let urlc = config.api.host+config.api.ctc.payc2cTransaction+'?transactionNum='+item.transactionNum;
                request.post(urlc).then(responseText => {
                    request.manyLogin(this.props, responseText);
                    if(responseText.success){
                        this.props.c2cBuySellFunction(this.state.coinCode)
                        Toast.success("支付成功");
                        this.setState({
                            loading:true,
                        })
                    }else{
                        Toast.success("支付失败");
                    }

                });
            }
            }
        ])
    }
    //确认已收款
    confirmc2cTransaction = (item) => {
        Alert.alert('温馨提醒', '是否确认已收到款', [
            {
                text: '取消', onPress: () => {
            }
            },
            {
                text: '确定', onPress: () =>
            {
                let urlc = config.api.host+config.api.ctc.confirm+'?transactionNum='+item.transactionNum;
                request.post(urlc).then(responseText => {
                    request.manyLogin(this.props, responseText);
                    if(responseText.success){
                        this.props.c2cBuySellFunction(this.state.coinCode)
                        Toast.success("操作成功");
                        this.setState({
                            loading:true,
                        })
                    }else{
                        Toast.success("操作失败");
                    }

                });
            }
            }
        ])
    }
    //交易关闭/失败关闭
    c2cTransaction = (item,type) => {

        if(this.state.remark==undefined || this.state.remark==''){
            Toast.fail("请填写原因");
            return
        }else{
            let urlc = '';
            if(type===0){
                 urlc = config.api.host+config.api.ctc.closec2cTransaction+'?remark='+this.state.remark+'&transactionNum='+item.transactionNum;
            }else{
                 urlc = config.api.host+config.api.ctc.failc2cTransaction+'?remark='+this.state.remark+'&transactionNum='+item.transactionNum;
            }

            request.post(urlc).then(responseText => {
                request.manyLogin(this.props, responseText);
                if(responseText.success){
                    this.props.c2cBuySellFunction(this.state.coinCode)
                    this.overlayPopView.close();
                    Toast.success("操作成功");
                    this.setState({
                        loading:true,
                        remark:''
                    })
                }else{
                    Toast.success("操作失败");
                }

            });
        }

    }

    setItemText =()=>{
        this.setState({
            isOpen:false
        })
    }
    //查看汇款详情
    getc2cTransaction =(item)=>{
        if(item.transactionType==1){
            this.setState({
                isType:'buy'
            })
        }else{
            this.setState({
                isType:'sell'
            })
        }
        let urlc = config.api.host+config.api.ctc.getc2cTransaction+'?transactionNum='+item.transactionNum;
        request.post(urlc).then(responseText => {
            request.manyLogin(this.props, responseText);
            if(responseText.success){
                this.setState({
                    buySellData:responseText.obj,
                    isOpen:true,
                })
            }
        });
    }


    _renderRow = ({item}) => {
        return (
            <View style={{flexDirection:'row',alignItems:'center'}}>
                <Text style={[styles.textRecord,{width:'20%'}]}>2018-01-04:14:01:32</Text>
                <View style={{width:'20%'}}>
                    <Text>USDT(卖出)</Text>
                    <Text style={{color:'red'}}>待审核</Text>
                </View>
                <Text style={[styles.textRecord,{width:'15%'}]}>2</Text>
                <Text style={[styles.textRecord,{width:'15%'}]}>12</Text>
                <Text style={[styles.textRecord,{width:'15%'}]}>12</Text>
                <Text style={[styles.textRecord,{flex:1,color:'#00c2d2'}]}>查看</Text>
            </View>
        )
    }


    render(){
        if (this.state.loadData) {
            return (
                <View style={{flex:1,marginBottom:config.api.isTabView?p(100):0}}>
                    <ScrollView
                        style={{flex: 1, backgroundColor: '#fafafa'}}
                        refreshControl={
                            <RefreshControl
                                refreshing={false}
                                onRefresh={()=>this.props.c2cBuySellFunction(this.state.coinCode)}
                            />
                        }>
                        <View style={styles.ViewFlex}>
                            <View style={{marginTop:p(30)}}>
                                <Text style={{color:'#00c2d2',fontSize:p(28),fontWeight:'500'}}>最近兑换记录</Text>
                            </View>
                            <View style={{height:p(2),backgroundColor:'#e6e6e6',width:width,marginTop:p(10)}}></View>

                            <View style={{
                                flexDirection: 'row', alignItems: 'center',marginTop:p(20)
                            }}>
                                <Text style={[styles.textRecord,{width:projectapp==='hkwx'?'14%':'15%',fontSize:p(26)}]}>时间</Text>
                                <Text style={[styles.textRecord,{width:'12%',fontSize:p(26)}]}>类型</Text>
                                <Text style={[styles.textRecord,{width:projectapp==='hkwx'?'12%':'15%',fontSize:p(26)}]}>数量</Text>
                                <Text style={[styles.textRecord,{width:projectapp==='hkwx'?'12%':'15%',fontSize:p(26)}]}>单价</Text>
                                <Text style={[styles.textRecord,{width:projectapp==='hkwx'?'12%':'15%',fontSize:p(26)}]}>总价</Text>
                                <Text style={[styles.textRecord,{width:'14%',fontSize:p(26)}]}>状态</Text>
                                <Text style={[styles.textRecord,{width:'12%',fontSize:p(26)}]}>信息</Text>
                                {projectapp==='hkwx'?<Text style={[styles.textRecord,{width:'12%',fontSize:p(26)}]}>操作</Text>:null}
                            </View>

                            <View style={{height:p(2),backgroundColor:'#e6e6e6',width:width-p(40),marginTop:p(20)}}></View>

                            <FlatList
                                style={{marginTop:p(20)}}
                                horizontal={  false }
                                onEndReachedThreshold={1}
                                refreshing={false}
                                data={this.state.orderList}
                                renderItem={({item, i}) => (
                                    <View style={{flexDirection:'row',alignItems:'center',borderBottomWidth:p(2),borderBottomColor:'#e6e6e6'}}>
                                        <Text style={[styles.textRecord,{width:projectapp==='hkwx'?'14%':'15%'}]}>{item.transactionTime}</Text>
                                            <Text style={[styles.textRecord,{width:'12%'}]}>
                                            {
                                                item.transactionType==1?'买':'卖'
                                            }</Text>
                                        <Text style={[styles.textRecord,{width:projectapp==='hkwx'?'12%':'15%'}]}>{item.transactionCount}</Text>
                                        <Text style={[styles.textRecord,{width:projectapp==='hkwx'?'12%':'15%'}]}>{item.transactionPrice}</Text>
                                        <Text style={[styles.textRecord,{width:projectapp==='hkwx'?'12%':'15%'}]}>{item.transactionMoney}</Text>
                                        <Text style={[styles.textRecord,{width:'12%'}]}>
                                            {/*{
                                                item.status==1?'待审核':item.status==2?'已完成':'已否决'
                                            }*/}
                                            {
                                                item.status==3&&item.status2==3?'已否决(交易关闭)':
                                                    item.status==3&&item.status2==4?'已否决(交易失败)':
                                                        item.status==2&&item.status2==2?'已完成':
                                                    item.status2==1?'未支付':item.status2==2?'已支付':item.status2==3?'交易关闭':'交易失败'
                                            }
                                        </Text>
                                        {
                                            item.transactionType!==2?
                                                <Text  onPress={()=>this.getc2cTransaction(item)} style={[styles.textRecord,{width:'16%',color:'#00c2d2'}]}>查看</Text>
                                                :<Text  style={[styles.textRecord,{width:'16%',color:'#00c2d2'}]}></Text>
                                        }

                                        {
                                            projectapp==='hkwx'?
                                            item.status==1&&item.status2==1&&item.transactionType==1?
                                                <View>
                                                    <TouchableOpacity onPress={()=>this.payc2cTransaction(item)}>
                                                        <Text style={[styles.textRecord,{flex:1,color:'#00c2d2'}]}>支付</Text>
                                                    </TouchableOpacity>
                                                    <TouchableOpacity
                                                        onPress={() => this.showPop('zoomOut', true, item,1)}
                                                        style={{marginTop:p(10)}}>
                                                        <Text style={[styles.textRecord,{flex:1,color:'#f88e19'}]}>关闭</Text>
                                                    </TouchableOpacity>
                                                </View>
                                                : item.status==1&&item.status2==2&&item.transactionType==2?
                                                <View>
                                                    <TouchableOpacity onPress={()=>this.confirmc2cTransaction(item)}>
                                                        <Text style={[styles.textRecord,{flex:1,color:'#d24c1c'}]}>确认</Text>
                                                    </TouchableOpacity>
                                                </View>
                                                :null:null

                                        }

                                    </View>
                                )}
                            />




                            <View style={{marginTop:p(60),marginBottom:p(40)}}>
                                <Text style={styles.promptText}>1.卖家为认证商户，可放心等待收款</Text>
                                <Text style={styles.promptText}>2.收款时请确认金额信息</Text>
                                <Text style={styles.promptText}>3.卖家确认收到款后，自动充值。如超过24小时未收到款项，请向客服反馈解决</Text>
                                <View style={{flexDirection:'row',marginTop:p(20)}}>
                                    <Text style={{color:'red'}}>温馨提示：</Text>
                                    <Text>如有任何疑问请联系在线客服或查看帮助中心。</Text>
                                </View>
                           </View>

                        </View>

                        <Loading visible={this.state.loading}/>
                    </ScrollView>
                    <BuySellModal isOpen={this.state.isOpen} setItemText={this.setItemText} isType={this.state.isType} {...this.props} buySellData={this.state.buySellData} isGoBack={false}/>
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
    touchableStyle:
        {height:p(70),width:width-p(320),backgroundColor:'#f8671b',borderRadius:p(5),
            alignItems:'center',justifyContent:'center'
        },
    inputTextStyle:{
        flexDirection:'row',
        height:p(120),
        alignItems:'center',
        borderRadius:p(5),
        padding:p(8),
        marginTop:p(20),
        width:width-p(160),
        borderWidth:p(2),
        borderColor:'#e6e6e6',
        marginLeft:p(10)
    },
    inputTextView:{
        flex:1,
        height:p(120),
        fontSize:p(26),
        color:'#565A5D'
    },
    promptText:{
        color:'#2b2b2b',
        fontSize:p(26),
        lineHeight:p(40),
        marginTop:p(20)
    },
    textRecord:{
        fontSize:p(24),
        color:'#292b2c',
        textAlign:'center'
    },
    ViewFlex:{
        width:width-p(20),
        marginLeft:p(10)
    }
})