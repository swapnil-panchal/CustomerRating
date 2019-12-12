//     react-native-loading-spinner-overlay
//     Copyright (c) 2016- Nick Baugh <niftylettuce@gmail.com>
//     MIT Licensed

// * Author: [@niftylettuce](https://twitter.com/#!/niftylettuce)
// * Source:
// <https://github.com/niftylettuce/react-native-loading-spinner-overlay>

// # react-native-loading-spinner-overlay
//
// <https://github.com/facebook/react-native/issues/2501>
// <https://rnplay.org/apps/1YkBCQ>
// <https://github.com/facebook/react-native/issues/2501>
// <https://github.com/brentvatne/react-native-overlay>
//

import React from 'react';
import PropTypes from 'prop-types';
import { StyleSheet, View, Text, Modal, ActivityIndicator } from 'react-native';
import { Fonts, AllTexts, colors } from '../modules/theme/css/Common';
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: 'transparent',
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0
  },
  background: {
    position: 'absolute',
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'transparent'
  },
  textContainer: {
    flex: 1,
    top: 0,
    bottom: 0,
    left: 0,
    right: 0,
    justifyContent: 'center',
    alignItems: 'center',
    position: 'absolute'
  },
  textContent: {
    top: 25,
    color: colors._FFFFFF,
    fontSize: 20,
  }
});

const ANIMATION = ['none', 'slide', 'fade'];
const SIZES = ['small', 'normal', 'large'];

export default class Spinner extends React.Component {
                 static propTypes = {
                   visible: PropTypes.bool,
                   cancelable: PropTypes.bool,
                   textContent: PropTypes.string,
                   animation: PropTypes.oneOf(ANIMATION),
                   color: PropTypes.string,
                   size: PropTypes.oneOf(SIZES),
                   overlayColor: PropTypes.string,
                 };

                 static defaultProps = {
                   visible: false,
                   cancelable: false,
                   textContent: '',
                   animation: 'none',
                   color: colors._FFFFFF,
                   size: 'large', // 'normal',
                   overlayColor: 'rgba(0, 0, 0, 0.5186966)',
                 };

                 constructor(props) {
                   super(props);
                   this.state = {
                     visible: this.props.visible,
                     textContent: this.props.textContent,
                   };
                 }

                 UNSAFE_componentWillReceiveProps(nextProps) {
                   const {visible, textContent} = nextProps;
                   this.setState({visible, textContent});
                 }

                 close() {
                   this.setState({visible: false});
                 }

                 _handleOnRequestClose() {
                   if (this.props.cancelable) {
                     this.close();
                   }
                 }

                 _renderDefaultContent() {
                   return (
                     <View style={styles.background}>
                       <View
                         style={{
                           backgroundColor: 'rgba(0,0,0,0.8)',
                           height: 100,
                           borderRadius: 10,
                           width: 150,
                           alignItems: 'center',
                           justifyContent: 'center',
                         }}>
                         <ActivityIndicator
                           //color={this.props.color}
                           color={colors._FFFFFF}
                           size={this.props.size}
                           style={{flex: 1, position: 'absolute', top: 20}}
                         />
                         <View style={styles.textContainer}>
                           <Text
                             style={[styles.textContent, this.props.textStyle]}>
                             {/* {this.state.textContent} */}
                             {AllTexts.Loading}
                           </Text>
                         </View>
                       </View>
                     </View>
                   );
                 }

                 _renderSpinner() {
                   const {visible} = this.state;

                   if (!visible) {
                     return null;
                   }

                   const spinner = (
                     <View
                       style={[
                         styles.container,
                         {backgroundColor: this.props.overlayColor},
                       ]}
                       key={`spinner_${Date.now()}`}>
                       {this.props.children
                         ? this.props.children
                         : this._renderDefaultContent()}
                     </View>
                   );

                   return (
                     <Modal
                       animationType={this.props.animation}
                       onRequestClose={() => this._handleOnRequestClose()}
                       supportedOrientations={['landscape', 'portrait']}
                       transparent
                       visible={visible}>
                       {spinner}
                     </Modal>
                   );
                 }

                 render() {
                   return this._renderSpinner();
                 }
               }
