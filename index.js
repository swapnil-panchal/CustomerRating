/**
 * @format
 */

import React, { Component } from 'react'
import { Provider } from 'react-redux';
import store from './src/redux/store'

import { AppRegistry } from 'react-native';
// import App from './App';
import { name as appName } from './app.json';
import AppViewContainer from './src/modules/AppViewContainer';
import NetInfo from "@react-native-community/netinfo";
import AsyncStorage from '@react-native-community/async-storage';
import axios from 'axios';
import constant from './src/modules/utils/constant'

class MJTemplate extends Component {
    // static navigationOptions = {
    //   header: null
    // }

    constructor(props) {
        super(props)
        this.state = {
            isStopUser: null
        }
    }

    componentShouldUpdate() {
        console.log("Update")
    }
    handleConnectivityChange = async (isConnected) => {
        this.setState({ isConnected: isConnected });
        if (isConnected.type !== 'none' && this.state.isStopUser === null) {
            console.log('test', isConnected)
            this.setState({
                isStopUser:true
            })
            let internet_state = "true"
            AsyncStorage.setItem("internet_state", internet_state)

            // Fetch data from the local storage when internet state change
            var getData = await AsyncStorage.getItem("stored_data")
            if (getData !== null && getData !== undefined && getData !== '') {
                var str_data = JSON.parse(getData)
                console.log("Internet checking time data", str_data)

                var url = `${constant.URL}syncData`;
                axios.post(url, str_data).then(response => {
                    console.log('RESPONSE RECEIVED: ', response)
                    console.log("DATA HAS BEEN CLEARED...!")
                    AsyncStorage.removeItem("stored_data")
                    this.setState({
                        isStopUser:null
                    })
                }).catch(error => {
                    console.log('AXIOS ERROR: ', error);
                    this.setState({
                        isStopUser:null
                    })
                });
                // Remove data from the async storage when data is on last index and clear the storage area.                                                                          

            } else {
                this.setState({
                    isStopUser:null
                })
                console.log("SORRY NO DATA AVAILABLE INTO THE STORAGE!!!")
            }
        } else {            
            console.log("INSIDE FALSE NET CHANGE")
            let internet_state = "false"
            AsyncStorage.setItem("internet_state", internet_state)
        }
    }

    componentDidMount() {
        console.disableYellowBox = true;
            NetInfo.addEventListener('connectionChange', this.handleConnectivityChange);        

        // this.unsubscribe = NetInfo.addEventListener((state) => {
        //     // if(){
        //         console.log("Inside")
        // }
        // let internet_state = (state.isConnected) ? "true" : "false"
        // AsyncStorage.setItem("internet_state", internet_state)

        // // Fetch data from the local storage when internet state change
        // if (state.isConnected) {
        //     var getData = await AsyncStorage.getItem("stored_data")
        //     if (getData !== null && getData !== undefined && getData !== '') {
        //         var str_data = JSON.parse(getData)
        //         console.log("Internet checking time data", str_data)

        //         var url = 'http://18.217.98.59/ratings_dev/public/api/syncData';
        //             axios.post(url, str_data).then(response => {
        //                 console.log('RESPONSE RECEIVED: ', response)
        //                 console.log("DATA HAS BEEN CLEARED...!")
        //                 AsyncStorage.removeItem("stored_data")  
        //             }).catch(error => {
        //                 console.log('AXIOS ERROR: ', error);
        //             });
        //             // Remove data from the async storage when data is on last index and clear the storage area.                                                                          

        //     } else {
        //         console.log("SORRY NO DATA AVAILABLE INTO THE STORAGE!!!")
        //     }
        // }
        // });
    }


    render() {
        return (
            <Provider store={store}>
                <AppViewContainer />
            </Provider>
        )
    }
}

AppRegistry.registerComponent(appName, () => MJTemplate);
