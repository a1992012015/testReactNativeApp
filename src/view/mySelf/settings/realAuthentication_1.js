/**
 * Created by 圆环之理 on 2018/5/17.
 *
 * 功能：个人信息设置页面 => 实名认证 => 填写页面
 *
 */
'use strict';

import React, {PureComponent} from 'react';
import {
    View,
    Dimensions,
    StyleSheet,
    TextInput,
    TouchableOpacity,
    Text,
    Alert,
    Image,
    ScrollView
} from 'react-native';
import Toast, {DURATION} from 'react-native-easy-toast';
import ImagePicker from 'react-native-image-picker';
import {connect} from 'react-redux';
import {Select} from 'teaset';

import p from '../../../utils/tranfrom';
import Request from '../../../utils/request';
import config from '../../../utils/config';
import I18n from '../../../utils/i18n';
import allCountriesData from '../../../utils/data';
import {InitUserInfo} from '../../../store/actions/HomeAction';
import Loading from '../../../components/loading';
import SModal from '../../../components/sModal'
import Title from '../../../components/title';

const {height} = Dimensions.get('window');
const request = new Request();

const styles = StyleSheet.create({
    blockSty: {
        backgroundColor: "#323840",
        marginTop: p(20),
        borderWidth: 1,
        borderRadius: p(5),
        borderColor: 'transparent',
        marginHorizontal: p(20),
    },
    regInput: {
        marginLeft: p(20),
        minHeight: p(75),
        flex: 1,
        padding: 0,
        color: '#FFFFFF',
    },
    inputText: {
        color: 'white',
        paddingLeft: p(20),
        width: p(160),
        fontSize: p(26),
    },
    regInputView: {
        minHeight: p(80),
        justifyContent: 'space-around',
        alignItems: "center",
        flexDirection: 'row',
        backgroundColor: '#313840',
    },
    reg_btn: {
        height: p(80),
        backgroundColor: '#D95411',
        marginTop: p(20),
        alignItems: 'center',
        justifyContent: 'center',
    },
    reg_btn_text: {
        color: '#fff',
        fontSize: p(30),
        textAlign: 'center',
        alignItems: 'center',
        justifyContent: 'center',
    },
    centering: {
        marginTop: (height - p(110)) / 2,
        alignItems: 'center',
        justifyContent: 'center',

    },
    codeObtain: {
        color: '#FFFFFF',
    },
    textView: {
        color: '#565A5D',
    },
    imageView: {
        marginLeft: p(20),
        width: p(316),
        height: p(202),
    }
});

class RealAuthentication_1 extends PureComponent {
    //构建
    constructor(props) {
        super(props);
        this.state = {
            surname: null,
            trueName: null,
            country0: '中国大陆',//国家
            country: 'China (中国)',//国家
            countryValue: 'cn_86',
            cardType: 0,
            cardId: null,
            infoAction: '',
            type: 0,
            sex: I18n.t('nan'),
            picIDa1: [],
            picIDa2: [],
            picIDa11: config.api.host + 'static/dist/img/idetify/idcard-f.png',
            picIDa12: config.api.host + 'static/dist/img/idetify/idcard-b.png',
            picIDa13: config.api.host + 'static/dist/img/idetify/idcard-h.jpg',
            picIDa21: config.api.host + 'static/dist/img/idetify/passport-f.png',
            picIDa22: config.api.host + 'static/dist/img/idetify/passport-b.png',
            picIDa23: config.api.host + 'static/dist/img/idetify/passport-h.jpg',
            isCheck: false,
            visible: false,
            actions: {
                within: {//国内
                    just: false,//正面
                    Back: false,//背面
                    hold: false,//手持
                },
                abroad: {//国外
                    just: false,
                    Back: false,
                    hold: false,
                }
            },
        };

        this.realtype = [{
            text: I18n.t('zgdl'),
            value: 0,
        }, {
            text: I18n.t('qtdq'),
            value: 1,
        }];

        this.realsex = [{
            text: I18n.t('nan'),
            value: I18n.t('nan'),
        }, {
            text: I18n.t('nv'),
            value: I18n.t('nv'),
        }]
    }

    //提交按钮
    _tarnAuthentication = () => {
        const {toast} = this.refs;

        if (null === this.state.surname || '' === this.state.surname) {
            toast.show(I18n.t('xingshishuru'), DURATION.LENGTH_SHORT);
            return;
        }

        if (null === this.state.trueName || '' === this.state.trueName) {
            toast.show(I18n.t('mingzishuru'), DURATION.LENGTH_SHORT);
            return;
        }

        if (this.state.type === 0 && !/^[\u4e00-\u9fa5]+$/i.test(this.state.surname)) {
            toast.show(I18n.t('zhongwen'), DURATION.LENGTH_SHORT);
            return;
        }

        if (this.state.type === 0 && !/^[\u4e00-\u9fa5]+$/i.test(this.state.trueName)) {
            toast.show(I18n.t('zhongwen'), DURATION.LENGTH_SHORT);
            return;
        }

        if (null === this.state.cardId || '' === this.state.cardId) {
            toast.show(I18n.t('shenfzshuru'), DURATION.LENGTH_SHORT);
            return;
        }

        if (this.state.type === 0) {
            const reg = /(^\d{15}$)|(^\d{18}$)|(^\d{17}(\d|X|x)$)/;
            if (!(reg.test(this.state.cardId))) {
                toast.show('身份证格式不正确', DURATION.LENGTH_SHORT);
                return;
            }
        }

        if (this.state.type === 1) {
            if (null === this.state.sex || '' === this.state.sex) {
                toast.show(I18n.t('xzsex'), DURATION.LENGTH_SHORT);
                return;
            }
            if (null === this.state.country || '' === this.state.country) {
                toast.show(I18n.t('xzguoajia'), DURATION.LENGTH_SHORT);
                return;
            }
        }

        let url = '';
        let formData = new FormData();
        let actions = {};

        if (this.state.type === 1) {
            let picIDa2 = this.state.picIDa2;

            if (picIDa2.length < 3) {
                this.magShow(1);
                return;
            }

            this.state.isCheck = true;
            for (let i = 0; i < picIDa2.length; i++) {
                let file = {uri: picIDa2[i], type: 'multipart/form-data', name: 'image.jpg'};
                formData.append(`img(${i + 1})`, file);
            }
            //地址
            url = config.api.person.setRealName;
            //参数
            actions = {
                surname: this.state.surname,
                trueName: this.state.trueName,
                country: this.state.country,
                cardId: this.state.cardId,
                cardType: this.state.type,
                type: this.state.type,
                sex: this.state.sex,
            };
        } else {
            let picIDa1 = this.state.picIDa1;

            if (picIDa1.length < 3) {
                this.magShow(0);
                return;
            }

            this.state.isCheck = true;

            for (let i = 0; i < picIDa1.length; i++) {
                let file = {uri: picIDa1[i], type: 'multipart/form-data', name: 'image.jpg'};
                //formData.append('img' + (i + 1), file);
                formData.append(`img(${i + 1})`, file);
            }
            //地址
            url = config.api.person.setRealName;
            //参数
            actions = {
                surname: this.state.surname,
                trueName: this.state.trueName,
                country: this.state.country0,
                cardId: this.state.cardId,
                cardType: this.state.type,
                type: this.state.type,
                sex: null,
            };
        }

        this.setState({
            visible: true
        });

        request.upImage(url, formData, actions, this.props).then(responseText => {

            this.setState({
                visible: false
            });

            if (responseText.ok) {//判断接口是否请求成功
                toast.show('提交失败', DURATION.LENGTH_SHORT);
                return;
            }

            const {msg, success} = responseText;

            if (success) {
                Alert.alert(
                    I18n.t('tishi'),
                    msg,
                    [{
                        text: I18n.t('queren'), onPress: () => {
                            const {params} = this.props.navigation.state;
                            const {dispatch} = this.props;

                            params.infoAction();
                            dispatch(InitUserInfo(this.props));
                            this.props.navigation.goBack();
                        }
                    }]
                );
            } else {
                toast.show(msg, DURATION.LENGTH_SHORT);
            }
            this.state.isCheck = false;
        })
    };
    //图片是否上传的提示方式
    magShow = picIDa => {
        const {toast} = this.refs;
        if(picIDa === 0){
            const {actions} = this.state;
            const {within} = actions;
            const {just, Back, hold} = within;
            if(!just){
                toast.show('请上传证件正面照', DURATION.LENGTH_SHORT);
            }else if(!Back){
                toast.show('请上传证件背面照', DURATION.LENGTH_SHORT);
            }else if(!hold){
                toast.show('请上传证件手持照', DURATION.LENGTH_SHORT);
            }
        }else{
            const {actions} = this.state;
            const {abroad} = actions;
            const {just, Back, hold} = abroad;
            if(!just){
                toast.show('请上传护照封面照', DURATION.LENGTH_SHORT);
            }else if(!Back){
                toast.show('请上传护照个人信息页', DURATION.LENGTH_SHORT);
            }else if(!hold){
                toast.show('请上传护照手持照', DURATION.LENGTH_SHORT);
            }
        }
    };
    //图片提交方法
    choiceImage = (type, step) => {

        if (this.state.isCheck) {
            return;
        }

        const options = {
            title: I18n.t('qxuanzhe'),
            cancelButtonTitle: I18n.t('quxiao'),
            takePhotoButtonTitle: I18n.t('paizhao'),
            chooseFromLibraryButtonTitle: I18n.t('xzxiangce'),
            quality: 0.5,
            storageOptions: {
                skipBackup: true,
                path: 'images'
            },
        };

        this.state.isCheck = true;

        ImagePicker.showImagePicker(options, (response) => {

            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else if (response.customButton) {
                console.log('User tapped custom button: ', response.customButton);
            } else {
                let source = response.uri;//{ uri: response.uri };
                let picIDa1 = this.state.picIDa1;
                let picIDa2 = this.state.picIDa2;

                if (type === 0) {

                    if (step === 1) {
                        const {actions} = this.state;
                        actions.within.just = true;
                        this.setState({
                            picIDa11: source,
                            actions,
                        });
                    } else if (step === 2) {
                        const {actions} = this.state;
                        actions.within.Back = true;
                        this.setState({
                            picIDa12: source,
                            actions,
                        });
                    } else {
                        const {actions} = this.state;
                        actions.within.hold = true;
                        this.setState({
                            picIDa13: source,
                            actions,
                        });
                    }

                    if (picIDa1[step - 1]) {
                        picIDa1[step - 1] = source;
                    } else {
                        picIDa1.push(source);
                    }

                } else {

                    if (step === 1) {
                        const {actions} = this.state;
                        actions.abroad.just = true;
                        this.setState({
                            picIDa21: source
                        });
                    } else if (step === 2) {
                        const {actions} = this.state;
                        actions.abroad.Back = true;
                        this.setState({
                            picIDa22: source
                        });
                    } else {
                        const {actions} = this.state;
                        actions.abroad.hold = true;
                        this.setState({
                            picIDa23: source
                        });
                    }

                    if (picIDa2[step - 1]) {
                        picIDa2[step - 1] = source;
                    } else {
                        picIDa2.push(source);
                    }
                }
            }

            this.state.isCheck = false;
        });

    };

    render() {
        return (
            <View style={{backgroundColor: '#1F2229', height: height}}>
                {/*组件标题*/}
                <Title {...this.props} canBack={true} titleName={I18n.t("verification")}/>

                <ScrollView>
                    <View style={styles.blockSty}>
                        {/*证件类型选择*/}
                        <View style={styles.regInputView}>
                            <Text style={styles.inputText}>{I18n.t('xzleixing')}:</Text>
                            <Select
                                style={{flex: 1, borderColor: 'transparent', backgroundColor: "transparent"}}
                                size='md'
                                valueStyle={{color: '#fff', padding: 0, margin: 0}}
                                getItemValue={item => item.value}
                                getItemText={item => item.text}
                                value={this.state.type}
                                items={this.realtype}
                                placeholder={I18n.t('qxzleixing')}
                                placeholderTextColor={'#B0B0B0'}
                                pickerTitle={I18n.t('leixing')}
                                onSelected={item => this.setState({type: item.value})}
                            />
                        </View>
                        {/*根据证件类型选择界面 0 中国 1 其他*/}
                        {this.state.type === 0 ?
                            <View>
                                {/*姓氏*/}
                                <View style={styles.regInputView}>
                                    <Text style={styles.inputText}>{I18n.t('xingshi')}:</Text>
                                    <TextInput
                                        style={styles.regInput}
                                        underlineColorAndroid='transparent'
                                        clearButtonMode={'while-editing'}
                                        placeholderTextColor={'#B0B0B0'}
                                        placeholder={I18n.t('xingshishuru')}
                                        value={this.state.surname}
                                        selectionColor={"#D95411"}
                                        onChangeText={(text) => this.setState({surname: text})}
                                    />
                                </View>
                                {/*名字*/}
                                <View style={styles.regInputView}>
                                    <Text style={styles.inputText}>{I18n.t('mingzi')}:</Text>
                                    <TextInput
                                        style={styles.regInput}
                                        underlineColorAndroid='transparent'
                                        clearButtonMode={'while-editing'}
                                        placeholderTextColor={'#B0B0B0'}
                                        placeholder={I18n.t('mingzishuru')}
                                        value={this.state.trueName}
                                        selectionColor={"#D95411"}
                                        onChangeText={text => this.setState({trueName: text})}
                                    />
                                </View>
                                {/*有效身份证*/}
                                <View style={styles.regInputView}>
                                    <Text style={styles.inputText}>{I18n.t('shenfz')}:</Text>
                                    <TextInput
                                        style={styles.regInput}
                                        underlineColorAndroid='transparent'
                                        clearButtonMode={'while-editing'}
                                        placeholderTextColor={'#B0B0B0'}
                                        placeholder={I18n.t('shenfzshuru')}
                                        value={this.state.cardId}
                                        selectionColor={"#D95411"}
                                        onChangeText={text => this.setState({cardId: text})}
                                    />
                                </View>
                                {/*身份证正面照*/}
                                <View style={[styles.regInputView, {marginTop: p(10)}]}>
                                    <Text style={styles.inputText}>{I18n.t('shenfzz')}:</Text>
                                    <TouchableOpacity
                                        onPress={() => this.choiceImage(this.state.type, 1)}
                                        activeOpacity={.8}
                                        style={{flex: 1}}
                                    >
                                        <Image
                                            resizeMode="contain"
                                            style={styles.imageView}
                                            source={{uri: this.state.picIDa11}}
                                        />
                                    </TouchableOpacity>
                                </View>
                                {/*身份证背面照*/}
                                <View style={[styles.regInputView, {marginVertical: p(20)}]}>
                                    <Text style={styles.inputText}>{I18n.t('shenfzs')}:</Text>
                                    <TouchableOpacity
                                        onPress={() => this.choiceImage(this.state.type, 2)}
                                        activeOpacity={.8}
                                        style={{flex: 1}}
                                    >
                                        <Image
                                            resizeMode="contain"
                                            style={styles.imageView}
                                            source={{uri: this.state.picIDa12}}
                                        />
                                    </TouchableOpacity>
                                </View>
                                {/*本人手持证件和签名照*/}
                                <View style={[styles.regInputView, {marginBottom: p(20)}]}>
                                    <Text style={styles.inputText}>{I18n.t('shenfzsc')}:</Text>
                                    <TouchableOpacity
                                        onPress={() => this.choiceImage(this.state.type, 3)}
                                        activeOpacity={.8}
                                        style={{flex: 1}}
                                    >
                                        <Image
                                            resizeMode="contain"
                                            style={styles.imageView}
                                            source={{uri: this.state.picIDa13}}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                            :
                            <View>
                                {/*名字*/}
                                <View style={styles.regInputView}>
                                    <Text style={styles.inputText}>{I18n.t('mingzi')}:</Text>
                                    <TextInput
                                        style={styles.regInput}
                                        underlineColorAndroid='transparent'
                                        clearButtonMode={'while-editing'}
                                        placeholderTextColor={'#B0B0B0'}
                                        placeholder='请输入名字'
                                        value={this.state.trueName}
                                        selectionColor={"#D95411"}
                                        onChangeText={text => this.setState({trueName: text})}
                                    />
                                </View>
                                {/*姓氏*/}
                                <View style={styles.regInputView}>
                                    <Text style={styles.inputText}>{I18n.t('xingshi')}:</Text>
                                    <TextInput
                                        style={styles.regInput}
                                        underlineColorAndroid='transparent'
                                        clearButtonMode={'while-editing'}
                                        placeholderTextColor={'#B0B0B0'}
                                        placeholder={I18n.t('xingshishuru')}
                                        value={this.state.surname}//surname
                                        selectionColor={"#D95411"}
                                        onChangeText={text => this.setState({surname: text})}
                                    />
                                </View>
                                {/*性别*/}
                                <View style={styles.regInputView}>
                                    <Text style={styles.inputText}>{I18n.t('sex')}:</Text>
                                    <Select
                                        style={{flex: 1, borderColor: 'transparent', backgroundColor: "transparent"}}
                                        size='md'
                                        valueStyle={{color: '#fff', padding: 0, margin: 0}}
                                        getItemValue={item => item.value}
                                        getItemText={item => item.text}
                                        value={this.state.sex}
                                        items={this.realsex}
                                        placeholder={I18n.t('xzsex')}
                                        placeholderTextColor={'#B0B0B0'}
                                        pickerTitle={I18n.t('sex')}
                                        onSelected={item => this.setState({sex: item.value})}
                                    />
                                </View>
                                {/*国家*/}
                                <View style={styles.regInputView}>
                                    <Text style={styles.inputText}>{I18n.t('guoajia')}:</Text>
                                    <Select
                                        style={{flex: 1, borderColor: 'transparent', backgroundColor: "transparent"}}
                                        size='md'
                                        valueStyle={{color: '#fff', padding: 0, margin: 0}}
                                        getItemValue={item => item.value}
                                        getItemText={item => item.text}
                                        value={this.state.countryValue}
                                        items={allCountriesData}
                                        placeholder={I18n.t('xzguoajia')}
                                        placeholderTextColor={'#B0B0B0'}
                                        pickerTitle={I18n.t('guoajia')}
                                        onSelected={item => this.setState({
                                            countryValue: item.value,
                                            country: item.text
                                        })}
                                    />
                                </View>
                                {/*护照ID*/}
                                <View style={styles.regInputView}>
                                    <Text style={styles.inputText}>{I18n.t('huzhaoid')}:</Text>
                                    <TextInput
                                        style={styles.regInput}
                                        underlineColorAndroid='transparent'
                                        clearButtonMode={'while-editing'}
                                        placeholderTextColor={'#B0B0B0'}
                                        placeholder={I18n.t('guoajiasr')}
                                        value={this.state.cardId}
                                        selectionColor={"#D95411"}
                                        onChangeText={text => this.setState({cardId: text})}
                                    />
                                </View>
                                {/*护照正面照*/}
                                <View style={styles.regInputView}>
                                    <Text style={styles.inputText}>{I18n.t('huzhaofm')}:</Text>
                                    <TouchableOpacity
                                        onPress={() => this.choiceImage(this.state.type, 1)}
                                        activeOpacity={.8}
                                        style={{flex: 1}}>
                                        <Image
                                            resizeMode="contain"
                                            style={styles.imageView}
                                            source={{uri: this.state.picIDa21}}
                                        />
                                    </TouchableOpacity>
                                </View>
                                {/*护照封面*/}
                                <View style={[styles.regInputView, {marginVertical: p(20)}]}>
                                    <Text style={styles.inputText}>护照个人信息页:</Text>
                                    <TouchableOpacity
                                        onPress={() => this.choiceImage(this.state.type, 2)}
                                        activeOpacity={.8}
                                        style={{flex: 1}}>
                                        <Image
                                            resizeMode="contain"
                                            style={styles.imageView}
                                            source={{uri: this.state.picIDa22}}
                                        />
                                    </TouchableOpacity>
                                </View>
                                {/*本人手持护照照片*/}
                                <View style={[styles.regInputView, {marginBottom: p(20)}]}>
                                    <Text style={styles.inputText}>手持本人护照个人信息页和个人签字:</Text>
                                    <TouchableOpacity
                                        onPress={() => this.choiceImage(this.state.type, 3)}
                                        activeOpacity={.8}
                                        style={{flex: 1}}
                                    >
                                        <Image
                                            resizeMode="contain"
                                            style={styles.imageView}
                                            source={{uri: this.state.picIDa23}}
                                        />
                                    </TouchableOpacity>
                                </View>
                            </View>
                        }
                    </View>
                    {/*提交按钮*/}
                    <View style={{margin: p(20)}}>
                        <Text style={[styles.textView, {marginTop: p(30)}]}>{I18n.t('smgd')}</Text>
                        <TouchableOpacity
                            activeOpacity={.8}
                            onPress={() => this._tarnAuthentication()}
                            style={styles.reg_btn}>
                            <Text style={styles.reg_btn_text}>{I18n.t('tijiaorz')}</Text>
                        </TouchableOpacity>
                    </View>

                    {/*加载特效组件*/}
                    <Loading visible={this.state.visible}/>

                    {/*提示框*/}
                    <Toast
                        ref="toast"
                        style={{backgroundColor: 'rgba(0,0,0,.6)'}}
                        position='center'
                        textStyle={{color: 'white'}}
                    />
                    {/*加载特效*/}
                    <SModal hasLoading={this.state.userIsLogin}/>
                </ScrollView>
            </View>
        )
    }
}

export default connect((state) => {
    const {HomeReducer} = state;
    return {
        HomeReducer
    }
})(RealAuthentication_1);