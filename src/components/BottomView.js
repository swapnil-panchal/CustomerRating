import React, { Component } from 'react'
import { View, Image,StyleSheet,Text } from 'react-native'
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from './dynamic_design/index'

export default class BottomView extends Component {
    constructor(props) {
        super(props)
    }

    render() {
        return (
            <View style={styles.bottomView}>
                <Text style={styles.bottomText}> Powered by </Text>
                <Image
                    style={styles.stretch}
                    source={require('../theme/images/serve.png')}
                />
            </View>
        )
    }
}

const styles = StyleSheet.create({
    bottomView: {
        height: '5%',
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
      },
      bottomText: {
        fontSize: hp('2%'),
        color: '#111',
      },
      stretch: {
        width: wp('12%'),
        height: hp('3%'),
        resizeMode: 'contain',
      },
})