/**
 * Created by 圆环之理 on 2018/5/15.
 *
 * 功能：
 *
 */
'use strict';

import React, { PureComponent } from 'react';
import {
    StyleSheet,
    Text,
    View,
} from 'react-native';
//import * as parse5 from 'parse5';
const parse5 = require('parse5');

import p from '../utils/tranfrom';

const BLOCK_ELEMENTS = ["blockquote", "div", "h1", "h2", "h3", "h4", "h5", "h6", "hr", "ol", "p", "pre", "ul", "li"];
const INLINE_ELEMENTS = ["b", "i", "em", "strong", "a", "br", "q", "span", "sub", "sup"];
const DEFAULT_STYLES = StyleSheet.create({
    a: {

    },
    b: {
        fontWeight: 'bold'
    },
    blockquote: {
        paddingLeft: 12,
        borderLeftWidth: 4,
        borderLeftColor: '#cccccc',
        marginBottom: 12
    },
    br: {

    },
    div: {

    },
    em: {
        fontStyle: 'italic'
    },
    h1: {
        fontWeight: 'bold',
    },
    h2: {
        fontWeight: 'bold',
    },
    h3: {
        fontWeight: 'bold',
    },
    h4: {
        fontWeight: 'bold',
    },
    h5: {
        fontWeight: 'bold',
    },
    h6: {
        fontWeight: 'bold',
    },
    i: {
        fontStyle: 'italic'
    },
    p: {
        marginBottom: 12,
    },
    pre: {

    },
    strong: {
        fontWeight: 'bold'
    },
    q: {

    },
    span: {

    },
    sub: {

    },
    sup: {

    },
    ol:{
        marginLeft: 24,
    },
    ul: {
        marginLeft: 24,
    },
    default: {

    }
});

function isText(tagName) : Boolean {
    return tagName === "#text"
}

function isBlockElement(tagName) : Boolean {
    return BLOCK_ELEMENTS.indexOf(tagName) !== -1
}

function isInlineElement(tagName) : Boolean {
    return INLINE_ELEMENTS.indexOf(tagName) !== -1
}

function styleForTag(tagName) {
    return DEFAULT_STYLES[tagName] ? DEFAULT_STYLES[tagName] : DEFAULT_STYLES["default"];
}

function processNode(node, parentKey) {
    let nodeName = node.nodeName;

    if (isText(nodeName)) {
        let key = `${parentKey}_text`;
        return (<Text key={key}>{node.value}</Text>)
    }

    if (isInlineElement(nodeName)) {
        let key = `${parentKey}_${nodeName}`;
        let children = [];
        node.childNodes.forEach((child, index) => {
            if (isInlineElement(child.nodeName) || isText(child.nodeName)) {
                children.push(processNode(child, `${key}_${index}`))
            } else {
                console.error(`Inline element ${nodeName} can only have inline children, ${child} is invalid!`)
            }
        });
        return (<Text key={key} style={styleForTag(nodeName)}>{children}</Text>)
    }

    if (isBlockElement(nodeName)) {
        let key = `${parentKey}_${nodeName}`;
        let children = [];
        let lastInlineNodes = [];

        node.childNodes.forEach((childNode, index) => {
            let child = processNode(childNode, `${key}_${index}`);
            if (isInlineElement(childNode.nodeName) || isText(childNode.nodeName)) {
                lastInlineNodes.push(child)

            } else if (isBlockElement(childNode.nodeName)) {
                if (lastInlineNodes.length > 0) {
                    children.push(<Text key={`${key}_${index}_inline`}>{lastInlineNodes}</Text>);
                    lastInlineNodes = []
                }
                children.push(child)
            }
        });

        if (lastInlineNodes.length > 0) {
            children.push((<Text key={`${key}_last_inline`}>{lastInlineNodes}</Text>))
        }
        return (
            <View key={key} style={styleForTag(nodeName)}>
                {children}
            </View>
        )
    }

    console.warn(`unsupported node: ${nodeName}`);
    return null;
}

class HtmlText extends PureComponent {

    parse = html => {
        const { Parser } = parse5;
        const parser = new Parser();
        return parser.parseFragment(html);
    };

    render() {
        const { html } = this.props;
        let rootKey = "ht_";

        let children = [];
        this.parse(html).childNodes.forEach((node, index) => {
            children.push(processNode(node, `${rootKey}_${index}`))
        });

        return (
            <View style={this.props.style}>
                <Text  style={{fontWeight:'bold',fontSize:p(24),paddingVertical:p(10), color:'#f4f4f4'}}>{children}</Text>
            </View>
        )
    }
}

export default  HtmlText;