import React, { Component } from 'react'
import { View } from 'react-native'
import AppNavigation from '../navigator/AppNavigation';

export default class AppNavigationView extends Component {
    static navigationOptions = {
        title: 'Showing',
        // TODO: move this into global config?
        headerTintColor: 'white',
        headerStyle: {
            backgroundColor: '#39babd'
        }
    }
    render() {
        return (
            <View style={{ flex: 1 }}>
                <AppNavigation />
            </View>
        )
    }
}
