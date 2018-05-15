/**
 * Created by 圆环之理 on 2018/5/15.
 *
 * 功能：重置密码页面弹出层
 *
 */
'use strict';

import React, { PureComponent } from 'react'
import {
    TouchableOpacity,
    Text,
    Image,
    Dimensions,
    StyleSheet,
} from 'react-native';
import Modal from 'react-native-modalbox';

import p from '../utils/tranfrom';
import I18n from '../utils/i18n';

const { width } = Dimensions.get('window');

export default class PromptModal extends PureComponent {

    static defaultProps = {};
    // 构造
    constructor(props) {
        super(props);
        // 初始状态
        this.state = {
            isOpen:false,
            bankData:null
        };
    }
    //接收定时器
    close: null;
    //真实的DOM被渲染出来后调用
    componentDidMount() {}
    //组件接收到新的props时调用
    componentWillReceiveProps(nextProps) {
        console.log("nextProps.isOpen",nextProps.isOpen);
        this.setState({
            isOpen: nextProps.isOpen
        });

        if(nextProps.isOpen){
            this._setInterval();
        }
    }
    //组件被移除之前被调用
    componentWillUnmount() {
        clearInterval(this.close);
    }

    _setInterval = () => {
        let num = 20;
        this.close = setInterval(() => {
            num--;
            if (num < 0) {
                this.close && clearInterval(this.close);
                this.props.navigation.goBack()
            }
        }, 1000);
    };

    _click=()=>{
        const { goBack } = this.props.navigation;
        this.setState({
            isOpen: false
        });
        goBack();
        clearInterval(this.close);
    };

    render() {
        return (
            <Modal style={[styles.modal, styles.modal3]}
                   position={"center"}
                   backButton={false}
                   backdropPressToClose={false}
                   swipeToClose={false}
                   isOpen={this.state.isOpen}>
                <TouchableOpacity
                    style={styles.imageView}
                    onPress={()=>this._click()}>
                    <Image source={require('../static/login/clean.png')}
                           style={styles.imageType}
                    />
                </TouchableOpacity>
                <Text style={styles.textView}>{I18n.t('chongzhimimaqueren')}</Text>
                <Text style={styles.textViewOne}>{I18n.t('chongzhiemail')}</Text>
            </Modal>
        )
    }
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    modal: {
        alignItems: 'center',
        borderRadius:p(20)
    },
    modal3: {
        height: p(350),
        width: width*.6
    },
    imageType:{
        width:p(45),
        height:p(45)
    },
    imageView:{
        position: 'absolute',
        top: 0,
        right:0,
        zIndex:999
    },
    textView:{
        paddingVertical:p(30),
        fontSize:p(28)
    },
    textViewOne:{
        paddingHorizontal:p(30)
    }

});