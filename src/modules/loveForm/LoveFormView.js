import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  TextInput,
  StyleSheet,
  View,
  Image,
  Text,
  ScrollView,
  Alert,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
let width = Dimensions.get('screen').width / 2 - 20;
import RadioForm, {
  RadioButton,
  RadioButtonInput,
  RadioButtonLabel,
} from 'react-native-simple-radio-button';
import { StackActions, NavigationActions } from 'react-navigation';
import axios from 'axios';
import Spinner from '../../components/Spinner';
import KeepAwake from 'react-native-keep-awake';
import Database from '../utils/Database';
import ImageLoad from 'react-native-image-placeholder';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from './../../components/dynamic_design/index'
let widthImage = Dimensions.get('screen').width / 3 - 20;
import BottomView from './../../components/BottomView'
import AsyncStorage from '@react-native-community/async-storage';
import constant from './../utils/constant'
import NetInfo from "@react-native-community/netinfo";

const db = new Database();
var radio_props = [
  { label: 'Yes', value: 1 },
  { label: 'No', value: 0 },
];

class LoveFormView extends Component {
  user = null;
  static navigationOptions = {
    title: '',
  };

  static propTypes = {
    navigate: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    const { navigation } = this.props;
    user = navigation.getParam('user');
    console.log('LoveForm' + JSON.stringify(user));

    this.state = {
      text: '',
      name: '',
      email: '',
      phone: '',
      value: 0,
      timer: 20,
      isLoading: false,
    };
  }

  onCompleteDialog = () => {
    console.log('onCompleteDialog');
    Alert.alert(
      'Customer Rating',
      'Thanks for your feedback',
      /*[
        {
          text: 'OK',
          onPress: () =>
            this.props.navigation.dispatch(
              StackActions.reset({
                index: 0,
                actions: [
                  NavigationActions.navigate({routeName: 'Authorized'}),
                ],
              }),
            ),
        },
      ],
      {cancelable: false},*/
    );
  };

  onCompletePress = () => {
    clearInterval(this.interval);
    user.feedback = this.state.text;
    user.is_standout = this.state.value;
    console.log(JSON.stringify(user));
    this.onSubmitForm()
    //this.props.navigation.navigate('LoveForm', {user: user});
  };

  onBackPress = () => {
    console.log('onBackPress');
    clearInterval(this.interval);
    this.props.navigation.goBack();
    // this.props.navigation.navigate('Experience');
  };

  onSubmitForm = async () => {
    console.log('onSubmitForm');
    this.setState({ isLoading: true });
    // this.saveProduct();
    var url = `${constant.URL}saveDetails`;
    let location_id = JSON.parse(this.props.userInfo).value.id;
    var data = {
      location_id: location_id,
      rating: user.rating,
      employee_id: user.employee_id,
      skill_id: user.skill_id,
      dropout_page: '',
      feedback: user.feedback,
      customer_name: user.name,
      is_standout: user.is_standout,
      other_feedback: '',
      customer_phone: '',
      customer_email: '',
    };
    console.log('Complete request data-->', data);
    NetInfo.fetch().then(async(state) => {
      if (!state.isConnected) {
        console.log("NO INTERNET FOUND ON LOVE From VIew FIRST SCREEN")
        // Getting stored data and if data is there into the local storage then call API
        var stored_data = await AsyncStorage.getItem("stored_data")
        console.log("stored_data", stored_data)
        if (stored_data !== null) {
          var parse_data = JSON.parse(stored_data)
          if (parse_data.length > 0) {
            let tempArr = [...parse_data]
            tempArr.push(data)
            let parse_arr_to_string = JSON.stringify(tempArr)
            AsyncStorage.setItem("stored_data", parse_arr_to_string)
          }
        } else {
          let tempArr = []
          tempArr.push(data)
          let parse_arr_to_string = JSON.stringify(tempArr)
          AsyncStorage.setItem("stored_data", parse_arr_to_string)
        }
        this.setState({ isLoading: false })
        clearInterval(this.interval);
        this.props.navigation.navigate('Thankyou');
      } else {
        axios
          .post(url, data)
          .then(response => {
            console.log('RESPONSE RECEIVED: ', response);
            this.setState({ isLoading: false });
            this.props.navigation.navigate('Thankyou');
          })
          .catch(error => {
            this.setState({ isLoading: false });
            console.log('AXIOS ERROR: ', error);
          });
      }

    });


  };

  setTimePassed() {
    this.props.navigation.dispatch(
      StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Authorized' })],
      }),
    );
  }

  componentDidMount() {
    this.interval = setInterval(
      () => this.setState(prevState => ({ timer: prevState.timer - 1 })),
      1000,
    );
  }

  componentDidUpdate() {
    if (this.state.timer === 0) {
      console.log('Time up');
      clearInterval(this.interval);
      this.props.navigation.dispatch(
        StackActions.reset({
          index: 0,
          actions: [NavigationActions.navigate({ routeName: 'Authorized' })],
        }),
      );
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  saveProduct() {
    let location_id = JSON.parse(this.props.userInfo).value.id;
    var data = {
      location_id: location_id,
      rating: user.rating,
      employee_id: user.employee_id,
      skill_id: user.skill_id,
      dropout_page: user.dropout_page,
      feedback: user.feedback,
      customer_info: user.name,
      is_standout: user.is_standout,
      customer_phone: this.state.phone,
      customer_email: this.state.email,
    };
    db.addProduct(data)
      .then(result => {
        console.log(result);
      })
      .catch(err => {
        console.log(err);
      });
  }

  callingResetTimer() {
    console.log('What is calling reset passowrd');
    this.setState({ timer: 20 });
    clearInterval(this.interval);
    this.interval = setInterval(
      () => this.setState(prevState => ({ timer: prevState.timer - 1 })),
      1000,
    );
  }

  // Method 2
  changeKeepAwake = shouldBeAwake => {
    if (shouldBeAwake) {
      KeepAwake.activate();
    } else {
      KeepAwake.deactivate();
    }
  };

  render() {
    console.log('What is timer-->', this.interval);
    return (
      <View style={[styles.container]}>
        <Spinner key={Math.random()} visible={this.state.isLoading} />
        <KeepAwake />
        <ScrollView style={styles.scrollView}>
          <View style={styles.locationView}>
            <Text style={styles.textTitle}>
              {user.name === ''
                ? 'Did all team stand out for delivering exceptional service?'
                : 'Did ' +
                `${user.name}` +
                ' stand out for delivering exceptional service?'}
            </Text>
          </View>
          <View style={{ paddingBottom: 10 }}>
            <RadioForm
              radio_props={radio_props}
              initial={1}
              buttonColor={'#955271'}
              selectedButtonColor={'#955271'}
              onPress={value => {
                this.setState({ value: value });
                this.callingResetTimer();
              }}
            />
          </View>
          <View style={{ justifyContent: 'center', alignItems: 'center' }}>
            <ImageLoad
              placeholderSource={require('./../../theme/images/user_placeholder.jpg')}
              source={{ uri: user.image }}
              placeholderStyle={styles.imageThumbnail}
              style={styles.imageThumbnail}
              borderRadius={10}
            />
          </View>
          <View style={styles.feedbackView}>
            <Text style={styles.textSubTitle}>
              Do you have any comments or feedback about your experience with us
              today?
            </Text>
          </View>

          <View style={{ padding: 0, width: '100%' }}>
            <TextInput
              style={styles.inputText}
              multiline
              numberOfLines={4}
              placeholder="Write your feedback"
              onChangeText={text => this.setState({ text })}
              value={this.state.text}
              onEndEditing={() => {
                this.callingResetTimer();
              }}
            />
          </View>
          <View style={styles.nextskipView}>
            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor: JSON.parse(this.props.userInfo).value
                    .app_color,
                },
              ]}
              onPress={this.onBackPress}>
              <Text style={styles.textLogin}> Back </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[
                styles.button,
                {
                  backgroundColor: JSON.parse(this.props.userInfo).value
                    .app_color,
                },
              ]}
              onPress={this.onCompletePress}>
              <Text style={styles.textLogin}> Complete </Text>
            </TouchableOpacity>
          </View>
        </ScrollView>
        <BottomView />
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: 'red',
  },
  scrollView: {
    // backgroundColor: 'pink',
    marginHorizontal: 20,
  },
  feedbackView: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  textInputView: {},
  textInputInnerView: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingBottom: 20,
  },
  locationView: {
    // padding: 15,
    paddingTop: 50,
    // height: '40%',
  },
  textTitle: {
    // textAlign: 'center',
    fontSize: 35,
    color: '#000',
    fontWeight: 'bold',
    paddingBottom: 20,
  },
  textBottom: {
    // textAlign: 'center',
    fontSize: 30,
    color: '#9BA1A6',
    fontWeight: 'bold',
    paddingBottom: 20,
  },
  textSubTitle: {
    // textAlign: 'center',
    fontSize: 20,
    color: 'gray',
  },
  // imageThumbnail: {
  //   resizeMode: 'contain',
  //   borderColor: '#000',

  //   borderRadius: 10,
  // },
  renderItems: {
    width: width,
    height: width,
    margin: 8,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#000',
    borderRadius: 5,
  },
  inputText: {
    height: 120,
    paddingHorizontal: 10,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    fontSize: 17,
    textAlignVertical: 'top',
  },
  inputFormText: {
    height: 40,
    width: '75%',
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    fontSize: 15,
  },
  textForm: {
    width: '25%',
    fontSize: 15,
  },
  nextskipView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop: 20,
    paddingBottom: 50,
  },
  button: {
    width: '40%',
    alignItems: 'center',
    backgroundColor: '#955275',
    padding: 0,
    height: 50,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  textLogin: {
    fontSize: 20,
    color: '#FFF',
    padding: 10,
  },
  imageThumbnail: { height: widthImage - 150, width: widthImage - 150, borderRadius: 20 },
  bottomView: {
    height: '5%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomText: {
    fontSize: 15,
    color: '#111',
  },
  stretch: {
    width: 50,
    height: 25,
    resizeMode: 'stretch',
  },
});
export default LoveFormView;
