/**
 * Created by 圆环之理 on 2018/5/11.
 *
 * 功能：切换语言控制
 *
 */
'use strict';

import I18n from 'react-native-i18n';
import en from './language/en';
import zh from './language/zh';

I18n.fallbacks = true;
I18n.translations = {
    en,
    zh
};

export default I18n;
