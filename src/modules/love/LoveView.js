import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  TextInput,
  StyleSheet,
  View,
  Image,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Dimensions,
} from 'react-native';
import { TagSelect } from 'react-native-tag-select';
import { StackActions, NavigationActions } from 'react-navigation';
import axios from 'axios';
import Spinner from '../../components/Spinner';
import KeepAwake from 'react-native-keep-awake';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from './../../components/dynamic_design/index'
import ImageLoad from 'react-native-image-placeholder';
import BottomView from './../../components/BottomView'
let width = Dimensions.get('screen').width / 3 - 20;
import AsyncStorage from '@react-native-community/async-storage';
import constant from './../utils/constant'
import NetInfo from "@react-native-community/netinfo";
import DeviceChecker from './../utils/DeviceChecker'
class LoveView extends Component {
  user = null;
  static navigationOptions = {
    title: '',
  };

  static propTypes = {
    navigate: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);

    /**
    * Returns true if the screen is in portrait mode
    */
    const isPortrait = () => {
      const dim = Dimensions.get('screen');
      return dim.height >= dim.width;
    };

    const { navigation } = this.props;
    user = navigation.getParam('user');

    this.state = { numberOfCol:4,imageReducing:100,text: '', isRefresh: false, data: [], timer: 20, isAPICalled: false, orientation: isPortrait() ? 'portrait' : 'landscape' };

    // Event Listener for orientation changes
    Dimensions.addEventListener('change', () => {
      console.log("Change dimesions")
      this.setState({
        orientation: isPortrait() ? 'portrait' : 'landscape',
        isRefresh: !this.state.isRefresh,
        numberOfCol:((DeviceChecker() === "mobile")?2:4),
        imageReducing:((DeviceChecker() === "mobile")?70:90)
      }, () => {

      });
    });
    this.getEmployeeList();
  }

  onPress = () => {
    console.log('OnPress');
    this.props.navigation.dispatch(
      StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({ routeName: 'Experience' })],
      }),
    );
    // this.props.navigation.navigate('Experience');
  };

  onNextPress = () => {
    console.log('onNextPress');
    user.employee_id = 0;
    user.name = '';
    user.image = '';
    console.log(JSON.stringify(user));
    clearInterval(this.interval);
    this.props.navigation.navigate('LoveDetail', {
      user: user,
    });
  };

  onBackPress = () => {
    clearInterval(this.interval);
    this.props.navigation.goBack();
    // this.props.navigation.navigate('Experience');
  };

  getEmployeeList = () => {
    console.log('getEmployeeList');
    this.setState({ isLoading: true, data: [] });

    var url = `${constant.URL}employeeList`;

    let location_id = JSON.parse(this.props.userInfo).value.id;
    var data = {
      location_id: location_id,
    };
    axios
      .post(url, data)
      .then(response => {
        console.log('RESPONSE RECEIVED: ', response);
        console.log('RESPONSE RECEIVED data: ', response.data.data);

        this.setState({ data: response.data.data });
        this.setState({ isLoading: false });
      })
      .catch(error => {
        this.setState({ isLoading: false });
        console.log('AXIOS ERROR: ', error);
      });
  };

  selectImageFromArray = index => {
    console.log('What is the index:-->', index);
    user.employee_id = this.state.data[index].id;
    user.name = this.state.data[index].name;
    user.image = this.state.data[index].image;
    console.log(JSON.stringify(user));
    clearInterval(this.interval);
    this.props.navigation.navigate('LoveDetail', {
      user: user,
    });
  };

  componentDidMount() {    
    if(DeviceChecker() === "mobile"){
      this.setState({
        numberOfCol:2,
        imageReducing:70
      })
    }else{
      this.setState({
        numberOfCol:4,
        imageReducing:90
      })
    }
    this.interval = setInterval(
      () => this.setState(prevState => ({ timer: prevState.timer - 1 })),
      1000,
    );
  }

  componentDidUpdate() {
    if (this.state.timer === 0) {
      console.log('Time up');
      if (this.state.isAPICalled === false) {
        this.setState({ isAPICalled: true });
        this.saveDataOnServer();
      }
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  async saveDataOnServer() {
    var url = `${constant.URL}saveDetails`;
    let location_id = JSON.parse(this.props.userInfo).value.id;
    var data = {
      location_id: location_id,
      rating: user.rating,
      employee_id: '0',
      skill_id: '',
      dropout_page: 'n1',
      feedback: '',
      customer_name: '',
      is_standout: '',
      other_feedback: '',
      customer_phone: '',
      customer_email: '',
    };

    console.log('Complete request data-->', data);

    NetInfo.fetch().then(async (state) => {
      console.log("Is connected?", state.isConnected);
      if (!state.isConnected) {
        console.log("NO INTERNET FOUND ON LOVE VIEW FIRST SCREEN")
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
        this.props.navigation.goBack();
      } else {
        axios
          .post(url, data)
          .then(response => {
            console.log('RESPONSE RECEIVED: ', response);
            this.setState({ isLoading: false });
            clearInterval(this.interval);
            this.props.navigation.goBack();
          })
          .catch(error => {
            this.setState({ isLoading: false });
            console.log('AXIOS ERROR: ', error);
            clearInterval(this.interval);
            this.props.navigation.goBack();
          });
      }
    });

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
    console.log(
      'Wht is the color:',
      JSON.parse(this.props.userInfo).value.app_color,
    );
    return (
      <View style={[styles.container]}>
        <Spinner key={Math.random()} visible={this.state.isLoading} />
        <KeepAwake />
        <ScrollView style={styles.scrollView}>
          <View style={styles.locationView}>
            <Text style={styles.textTitle}>
              We’d love to know who looked after you today?
            </Text>
            <Text style={styles.textSubTitle}>
              If you’d like to not highlight someone then please press next.
            </Text>
          </View>
          <View
            style={{
              justifyContent: 'center',
              alignItems: 'center',
            }}>

            <FlatList
              columnWrapperStyle={{ flex: 1 }}
              data={this.state.data}
              extraData={this.state.isRefresh}
              keyExtractor={item => item.id}
              horizontal={false}
              scrollEnabled={true}
              numColumns={this.state.numberOfCol}
              key={this.state.numberOfCol}
              renderItem={({ item, index }) => (
                <View style={{ width: (Dimensions.get('screen').width / this.state.numberOfCol - 20) - 20, height: (Dimensions.get('screen').width / this.state.numberOfCol - this.state.imageReducing), margin: 8, borderWidth: 0, justifyContent: 'center', alignItems: 'center' }}>
                  {/* {console.log(item.image)} */}
                  <TouchableOpacity
                    style={styles.touchableButton}
                    onPress={() => this.selectImageFromArray(index)}>
                    <ImageLoad
                      placeholderSource={require('./../../theme/images/user_placeholder.jpg')}
                      source={{ uri: item.image }}
                      placeholderStyle={styles.imageThumbnail}
                      style={{ width: (Dimensions.get('screen').width / this.state.numberOfCol - 20) - this.state.imageReducing, height: (Dimensions.get('screen').width / this.state.numberOfCol - 20) - this.state.imageReducing }}
                      borderRadius={10}
                    />
                  </TouchableOpacity>
                  <Text style={{ fontSize: hp('2%'), paddingTop: 10, borderWidth: 0 }}>{item.name}</Text>
                </View>
              )}
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
              onPress={this.onNextPress}>
              <Text style={styles.textLogin}> Next </Text>
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
  },
  touchableButton: {
    alignItems: 'center',
    justifyContent: 'center',
    // width: '100%',
    // height: '100%',
    borderWidth: 0
    // backgroundColor: '#DD6DDD',
  },
  scrollView: {
    // backgroundColor: 'pink',
    marginHorizontal: 20,
  },
  locationView: {
    paddingTop: 50,
    paddingBottom: 20,
  },
  feedbackView: {
    paddingTop: 20,
    paddingBottom: 20,
  },
  textTitle: {
    textAlign: 'center',
    fontSize: 35,
    color: '#000',
    fontWeight: 'bold',
    paddingBottom: 20,
  },
  textSubTitle: {
    textAlign: 'center',
    fontSize: 20,
    color: 'gray',
  },
  textLogin: {
    fontSize: 20,
    color: '#FFF',
    padding: 10,
  },
  nextskipView: {
    justifyContent: 'space-between',
    flexDirection: 'row',
    width: '100%',
    paddingTop: 20,
    paddingBottom: 50,
    height: '10%',
  },
  item: {
    borderWidth: 1,
    borderColor: '#333',
    backgroundColor: '#FFF',
  },
  label: {
    color: '#333',
  },
  itemSelected: {
    backgroundColor: '#333',
  },
  labelSelected: {
    color: '#FFF',
  },
  inputText: {
    height: 120,
    borderColor: 'gray',
    borderWidth: 1,
    borderRadius: 5,
    fontSize: 15,
    textAlignVertical: 'top',
  },
  button: {
    width: '40%',
    alignItems: 'center',
    backgroundColor: '#955275',
    padding: 0,
    height: 50,
    marginLeft: 30,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 5,
  },
  loginButtonView: {
    paddingTop: 20,
    justifyContent: 'center',
    alignItems: 'center',
    width: '50%',
  },
  textLogin: {
    fontSize: 20,
    color: '#FFF',
  },
  renderItems: {
    width: width - 20,
    height: width,
    margin: 8,
    borderWidth: 0,
    justifyContent: 'center',
    alignItems: 'center',
    // borderWidth: 1,
    // borderColor: '#000',
    // borderRadius: 5
  },
  imageThumbnail: {
    width: (Dimensions.get('screen').width / 3 - 20) - 100,
    height: (Dimensions.get('screen').width / 3 - 20) - 100,
    borderRadius: 20,
  },
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
export default LoveView;
