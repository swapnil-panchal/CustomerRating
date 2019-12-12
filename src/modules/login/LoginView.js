import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  TextInput,
  StyleSheet,
  View,
  Image,
  Text,
  Button,
  Alert,
  TouchableOpacity,
} from 'react-native';
import {StackActions, NavigationActions} from 'react-navigation';
import axios from 'axios';
import Spinner from '../../components/Spinner'
import * as UserInfo from './LoginViewState';
import KeepAwake from 'react-native-keep-awake';
import * as CommonFunctions from '../theme/js/CommonFunctions';
import DetectDevice from '../../components/DetectDevice';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from './../../components/dynamic_design/index'
import {connect} from 'react-redux';
const deviceIsTablet = DetectDevice.isTablet;
import BottomView from './../../components/BottomView'
import constant from './../utils/constant'

class LoginView extends Component {
  static navigationOptions = {
    title: '',
  };

  static propTypes = {
    navigate: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {locationID: '', isLoading: false};
    if (CommonFunctions.isJson(this.props.userInfo)) {
      this.props.navigation.dispatch(
        StackActions.reset({
          index: 0,
          actions: [
            NavigationActions.navigate({routeName: 'Authorized'}),
          ],
        }),
      );
    }
  }

  onPress = () => {
    console.log('OnPress');
    this.setState({isLoading: true});

    var url = `${constant.URL}locationLogin`;

    var data = {
      location: this.state.locationID,
      app_color: '#955271',
    };

    const headers = {
      'Content-Type': 'text/html; charset=UTF-8',
      X_Api_Key: 'qiqhyah5kBu9XdyNa1KQsMVhxR',
      device_token: '12345',
      device_type: 'ios',
    };

    axios
      .post(url, data)
      .then(response => {
        console.log('RESPONSE RECEIVED: ', response);
        console.log('RESPONSE RECEIVED data: ', response.data.message);
        this.setState({isLoading: false});
        if (response.data.status === 200) {
        this.props.dispatch(UserInfo.loginSuccess(response.data.data));
        this.props.navigation.dispatch(
          StackActions.reset({
            index: 0,
            actions: [NavigationActions.navigate({routeName: 'Authorized'})],
          }),
        );
        } else {
          Alert.alert(response.data.message);
        }
      })
      .catch(error => {
        this.setState({isLoading: false});
        console.log('AXIOS ERROR: ', error);
      });
  };

  // Method 2
  changeKeepAwake = shouldBeAwake => {
    if (shouldBeAwake) {
      KeepAwake.activate();
    } else {
      KeepAwake.deactivate();
    }
  };
  
  componentDidMount(){
    console.log("deviceIsTablet",deviceIsTablet)
  }

  render() {
    return (
      <View style={[styles.container]}>
        <Spinner key={Math.random()} visible={this.state.isLoading} />
        <KeepAwake />
        <View style={styles.viewTop}>
          <View style={styles.topInner}>
            <Image
              // style={styles.stretch}
              style={{height:(deviceIsTablet)?hp('18%'):hp('10%'),width:wp('60%'),alignSelf:'center'}}
              resizeMode="contain"
              source={require('../../theme/images/serve.png')}
            />
          </View>
          <View style={styles.locationView}>
            <Text style={styles.textLocation}>Enter your Location ID here</Text>
          </View>
          <View style={{padding: 10, width: '80%'}}>
            <TextInput
              style={styles.inputText}
              placeholder="Type here to translate!"
              onChangeText={locationID => this.setState({locationID})}
              value={this.state.locationID}
            />
          </View>
          <View style={styles.loginButtonView}>
            <TouchableOpacity style={styles.button} onPress={this.onPress}>
              <Text style={styles.textLogin}> Login </Text>
            </TouchableOpacity>
          </View>
        </View>

       <BottomView/>
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  viewTop: {
    justifyContent: 'center',
    alignItems: 'center',
    height: '95%'
  },
  locationView: {
    padding: 15,
  },
  topInner: {
    justifyContent: 'center',        
  },
  inputText: {
    height: hp('6.5%'),
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 10,
    fontSize: hp('2%'),
    paddingHorizontal: 10,
  },
  topInnerText: {
    paddingRight: 20,
  },
  stretch: {
    width: '65%',
    height: deviceIsTablet ? 120 : 65,
    resizeMode: 'stretch',
  },
  textLogin: {
    fontSize: hp('2.4%'),
    color: '#FFF',
  },
  textLocation: {
    fontSize: hp('2%'),
    color: 'gray',
  },
  button: {
    width: '100%',
    alignItems: 'center',
    backgroundColor: '#955275',
    padding: 0,
    height: hp('6%'),
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  loginButtonView: {
    paddingTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
  },
  bottomView: {
    height: '5%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    // position: 'absolute',
    // paddingBottom: 20
  },
  bottomText: {
    fontSize: 15,
    color: '#111',
  },
});
export default connect()(LoginView);
