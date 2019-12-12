import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from './../../components/dynamic_design/index'
import {
  TextInput,
  StyleSheet,
  View,
  Image,
  Text,
  FlatList,
  ScrollView,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { TagSelect } from 'react-native-tag-select';
import { StackActions, NavigationActions } from 'react-navigation';
import axios from 'axios';
import Spinner from '../../components/Spinner';
import KeepAwake from 'react-native-keep-awake';
import BottomView from './../../components/BottomView'
import AsyncStorage from '@react-native-community/async-storage';
import constant from './../utils/constant'
import NetInfo from "@react-native-community/netinfo";

class SadView extends Component {
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
    console.log(JSON.stringify(user));

    this.state = { text: '', data: [], timer: 20, isLoading: false, isAPICalled: false };
    this.callingResetTimer = this.callingResetTimer.bind(this)
    this.getSkillList();
  }

  onNextPress = () => {
    console.log('onNextPress');

    const tmpArray = [];
    this.tag.itemsSelected.map((item, key) => {
      tmpArray.push(item.id);
    });
    user.skill_id = tmpArray;
    user.other_feedback = this.state.text;
    clearInterval(this.interval);
    console.log("User array stored", user)
    this.props.navigation.navigate('Experience', { user: user });
  };

  onBackPress = () => {
    console.log('onBackPress');
    /*this.props.navigation.dispatch(
      StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({routeName: 'Emozy'})],
      }),
    );*/
    this.props.navigation.goBack();
  };

  async saveDataOnServer() {
    const tmpArray = [];
    this.tag.itemsSelected.map((item, key) => {
      tmpArray.push(item.id);
    });
    user.skill_id = tmpArray;

    var url = `${constant.URL}saveDetails`;
    let location_id = JSON.parse(this.props.userInfo).value.id;
    var data = {
      location_id: location_id,
      rating: user.rating,
      employee_id: '0',
      skill_id: user.skill_id,
      dropout_page: 'n1',
      feedback: (user.feedback !== undefined) ? this.user.feedback : '',      
      customer_name: '',
      is_standout: '',
      other_feedback: this.state.text,
      customer_phone: '',
      customer_email: '',
    };

    console.log('Complete request data-->', data);    
    NetInfo.fetch().then(async (state) => {
      if (!state.isConnected) {
        console.log("NO INTERNET FOUND ON SAD VIEW FIRST SCREEN")
  
        // Getting stored data and if data is there into the local storage then call API
        var stored_data = await AsyncStorage.getItem("stored_data")
        console.log("stored_data",stored_data)
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
    })    
  }

  getSkillList = () => {
    console.log('getSkillList');
    this.setState({ isLoading: true });

    var url = `${constant.URL}skillList`;

    let location_id = JSON.parse(this.props.userInfo).value.id;
    var data = {
      location_id: location_id,
      type: 0,
    };
    axios
      .post(url, data)
      .then(response => {
        console.log('RESPONSE RECEIVED: ', response);
        console.log('RESPONSE RECEIVED data: ', response.data);

        const tmpArray = [];
        response.data.data.map((item, key) => {
          obj = { id: item.id, label: item.name };
          tmpArray.push(obj);
        });
        this.setState({ data: tmpArray, isLoading: false });
      })
      .catch(error => {
        this.setState({ isLoading: false });
        console.log('AXIOS ERROR: ', error);
      });
  };

  async componentDidMount() {
    
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
    console.log('what is the timer--->', this.state.timer);
    return (
      <View style={[styles.container]}>
        <Spinner key={Math.random()} visible={this.state.isLoading} />
        <KeepAwake />
        <ScrollView style={styles.scrollView}>
          <View style={styles.locationView}>
            <Text style={styles.textTitle}>
              Sorry to hear you didn’t have the best experience today with us,
              please could you highlight what went wrong?
            </Text>
            <Text style={styles.textSubTitle}>Click as many as you want.</Text>
          </View>
          <View>
            <TagSelect
              data={this.state.data}
              itemStyle={styles.item}
              itemLabelStyle={styles.label}
              itemStyleSelected={styles.itemSelected}
              itemLabelStyleSelected={styles.labelSelected}
              ref={tag => {
                this.tag = tag;
              }}
              onMaxError={() => {
                Alert.alert('Ops', 'Max reached');
              }}
              onItemPress={() => {
                this.callingResetTimer();
                // Alert.alert('Ops', 'Max pressed');
              }}
            />
          </View>
          <View style={styles.feedbackView}>
            <Text style={styles.textSubTitle}>
              Please give us any other feedback around your experience today
              that is missed above.
            </Text>
          </View>
          <View style={{ padding: 10, width: '100%' }}>
            <TextInput
              style={styles.inputText}
              multiline
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
    padding: 10
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: 'red',
    // width: "100%",
    // height: "100%"
  },
  scrollView: {
    // backgroundColor: 'pink',
    marginHorizontal: 20,
  },
  locationView: {
    paddingTop: 50,
    paddingBottom: 20,
    // height: "40%"
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
    // textAlign: 'center',
    fontSize: 20,
    color: 'gray',
  },
  button: {
    alignItems: 'center',
    backgroundColor: '#955275',
    padding: 0,
    height: 50,
    // flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    borderRadius: 10,
  },
  textLogin: {
    fontSize: 20,
    color: '#FFF',
    padding: 10,
  },
  nextskipView: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    width: '100%',
    paddingTop: 20,
    paddingBottom: 50,
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
    borderColor: '#580000',
    backgroundColor: '#FFB6A7',
  },
  labelSelected: {
    color: '#580000',
  },
  inputText: {
    height: hp('15%'),
    borderColor: 'gray',
    paddingHorizontal: 10,
    borderWidth: 1,
    borderRadius: 5,
    fontSize: hp('2.5%'),
    textAlignVertical: 'top'
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
export default SadView;
