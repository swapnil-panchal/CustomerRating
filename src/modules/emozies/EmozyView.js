import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  TextInput,
  StyleSheet,
  View,
  Image,
  Text,
  FlatList,
  Alert,
  TouchableOpacity,
  Dimensions,
  Platform,
  SafeAreaView
} from 'react-native';
import KeepAwake from 'react-native-keep-awake';
import AsyncStorage from '@react-native-community/async-storage';
import { StackActions, NavigationActions } from 'react-navigation';
import { ScrollView } from 'react-native-gesture-handler';
import DetectDevice from '../../components/DetectDevice';
import { widthPercentageToDP as wp, heightPercentageToDP as hp } from './../../components/dynamic_design/index'
import userData from '../utils/userData';
let width = Dimensions.get('screen').width / 2 - 20;
var marginCounter = Dimensions.get('window').height / 2
const deviceIsTablet = DetectDevice.isTablet;
import BottomView from './../../components/BottomView'

class EmozyView extends Component {
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

    this.state = {
      text: '',
      orientation: isPortrait() ? 'portrait' : 'landscape',
    };
    
    // Event Listener for orientation changes
    Dimensions.addEventListener('change', () => {
      this.setState({
        orientation: isPortrait() ? 'portrait' : 'landscape',
      });
    });

    this.handleViewableItemsChanged = this.handleViewableItemsChanged.bind(
      this,
    );
    this.viewabilityConfig = { viewAreaCoveragePercentThreshold: 50 };
  }
  handleViewableItemsChanged(info) {
    console.log(info);
  }

  async componentDidMount(){
    let internet_state = await AsyncStorage.getItem("internet_state")
    console.log('internet_state-->', internet_state);
  }

  onPress = () => {
    console.log('OnPress');
  };

  selectImageFromArray = index => {
    console.log('What is the index:-->', index);
    if (index === 0 || index === 1 || index === 2) {
      const user = new userData();
      user.dropout_page = 'n' + (index + 1);
      user.rating = index + 1;
      // this.props.navigation.dispatch(
      //   StackActions.reset({
      //     index: 0,
      //     actions: [NavigationActions.navigate({routeName: 'Sad'})],
      //   }),
      // );
      this.props.navigation.navigate('Sad', { user: user });
    } else if (index === 3 || index === 4) {
      const user = new userData();
      user.dropout_page = 'p' + (index + 1);
      user.rating = index + 1;
      // this.props.navigation.dispatch(
      //   StackActions.reset({
      //     index: 0,
      //     actions: [NavigationActions.navigate({routeName: 'Love'})],
      //   }),
      // );
      this.props.navigation.navigate('Love', { user: user });
    }
  };

  renderItemsUsingFlatList = () => {
    return (
      <View style={{ justifyContent: 'center', alignItems: 'center' }}>
        <FlatList
          key={this.state.orientation ? 'h' : 'v'}
          columnWrapperStyle={{
            justifyContent: 'space-between',
            flex: 1,
          }}
          onViewableItemsChanged={this.handleViewableItemsChanged}
          viewabilityConfig={this.viewabilityConfig}
          data={[
            { info: 'a' },
            { info: 'b' },
            { info: 'c' },
            { info: 'd' },
            { info: 'e' },
          ]}
          keyExtractor={item => item.info}
          horizontal={false}
          scrollEnabled={true}
          numColumns={2}
          renderItem={({ item, index }) => (
            <View style={styles.renderItems}>
              <TouchableOpacity
                style={styles.touchableButton}
                onPress={() => this.selectImageFromArray(index)}>
                {index === 0 && (
                  <Image
                    source={require('../../theme/images/hd/hate.gif')}
                    style={styles.imageThumbnail}
                  />
                )}
                {index === 1 && (
                  <Image
                    source={require('../../theme/images/hd/disappointed.gif')}
                    style={styles.imageThumbnail}
                  />
                )}
                {index === 2 && (
                  <Image
                    source={require('../../theme/images/hd/neutral.gif')}
                    style={styles.imageThumbnailNetural}
                  />
                )}
                {index === 3 && (
                  <Image
                    source={require('../../theme/images/hd/like.gif')}
                    style={styles.imageThumbnail}
                  />
                )}
                {index === 4 && (
                  <Image
                    source={require('../../theme/images/hd/love.gif')}
                    style={styles.imageThumbnail}
                  />
                )}
              </TouchableOpacity>
            </View>
          )}
        />
      </View>
    );
  };

  // Method 2
  changeKeepAwake = (shouldBeAwake) => {
    if (shouldBeAwake) {
      KeepAwake.activate();
    } else {
      KeepAwake.deactivate();
    }
  }

  render() {
    console.log(
      'user info-->',
      JSON.parse(this.props.userInfo).value.app_color,
    );
    // if (this.state.orientation === 'portrait') {
    console.log('Portait');
    return (
      <SafeAreaView style={[styles.container]}>
<View style={[styles.container]}>
        <KeepAwake />
        <ScrollView contentContainerStyle={{paddingTop:(deviceIsTablet)?120:0,paddingBottom:(deviceIsTablet)?0:40}}>
          <View style={styles.locationView}>
            <Text style={styles.textTitle}>
              Please tell us how your experience was today.
            </Text>
            <Text style={styles.textSubTitle}>
              Press the facial expression that best represents how you feel
              about your experience.
            </Text>
          </View>
          {this.state.orientation === 'portrait' && (
            <View style={styles.viewPotrait}>
              <View
                style={[
                  styles.gridRow,
                  {
                    borderColor: JSON.parse(this.props.userInfo).value
                      .app_color,
                  },
                ]}>
                <TouchableOpacity
                  style={styles.touchableButton}
                  onPress={() => this.selectImageFromArray(0)}>
                  <Image
                    source={require('../../theme/images/hd/hate.gif')}
                    style={styles.imageThumbnail}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={[
                  styles.gridRow,
                  {
                    borderColor: JSON.parse(this.props.userInfo).value
                      .app_color,
                  },
                ]}>
                <TouchableOpacity
                  style={styles.touchableButton}
                  onPress={() => this.selectImageFromArray(1)}>
                  <Image
                    source={require('../../theme/images/hd/disappointed.gif')}
                    style={styles.imageThumbnail}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
          {this.state.orientation === 'portrait' && (
            <View style={styles.viewPotrait}>
              <View
                style={[
                  styles.gridRow,
                  {
                    borderColor: JSON.parse(this.props.userInfo).value
                      .app_color,
                  },
                ]}>
                <TouchableOpacity
                  style={styles.touchableButton}
                  onPress={() => this.selectImageFromArray(2)}>
                  <Image
                    source={require('../../theme/images/hd/neutral.gif')}
                    style={styles.imageThumbnailNetural}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={[
                  styles.gridRow,
                  {
                    borderColor: JSON.parse(this.props.userInfo).value
                      .app_color,
                  },
                ]}>
                <TouchableOpacity
                  style={styles.touchableButton}
                  onPress={() => this.selectImageFromArray(3)}>
                  <Image
                    source={require('../../theme/images/hd/like.gif')}
                    style={styles.imageThumbnail}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
          {this.state.orientation === 'portrait' && (
            <View
              style={
                ([styles.viewPotrait],
                  {
                    paddingLeft: 10,
                    paddingRight: 10,
                    paddingTop: 10,
                    paddingBottom: 20,
                  })
              }>
              <View
                style={[
                  styles.gridRow,
                  {
                    borderColor: JSON.parse(this.props.userInfo).value
                      .app_color,
                  },
                ]}>
                <TouchableOpacity
                  style={styles.touchableButton}
                  onPress={() => this.selectImageFromArray(4)}>
                  <Image
                    source={require('../../theme/images/hd/love.gif')}
                    style={styles.imageThumbnail}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
          {this.state.orientation === 'landscape' && (
            <View style={styles.viewLanscape}>
              <View
                style={[
                  styles.gridLandscape,
                  {
                    borderColor: JSON.parse(this.props.userInfo).value
                      .app_color,
                  },
                ]}>
                <TouchableOpacity
                  style={styles.touchableButton}
                  onPress={() => this.selectImageFromArray(0)}>
                  <Image
                    source={require('../../theme/images/hd/hate.gif')}
                    style={styles.imageThumbnail}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={[
                  styles.gridLandscape,
                  {
                    borderColor: JSON.parse(this.props.userInfo).value
                      .app_color,
                  },
                ]}>
                <TouchableOpacity
                  style={styles.touchableButton}
                  onPress={() => this.selectImageFromArray(1)}>
                  <Image
                    source={require('../../theme/images/hd/disappointed.gif')}
                    style={styles.imageThumbnail}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={[
                  styles.gridLandscape,
                  ,
                  {
                    borderColor: JSON.parse(this.props.userInfo).value
                      .app_color,
                  },
                ]}>
                <TouchableOpacity
                  style={styles.touchableButton}
                  onPress={() => this.selectImageFromArray(2)}>
                  <Image
                    source={require('../../theme/images/hd/neutral.gif')}
                    style={styles.imageThumbnailNetural}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={[
                  styles.gridLandscape,
                  {
                    borderColor: JSON.parse(this.props.userInfo).value
                      .app_color,
                  },
                ]}>
                <TouchableOpacity
                  style={styles.touchableButton}
                  onPress={() => this.selectImageFromArray(3)}>
                  <Image
                    source={require('../../theme/images/hd/like.gif')}
                    style={styles.imageThumbnail}
                  />
                </TouchableOpacity>
              </View>
              <View
                style={[
                  styles.gridLandscape,
                  {
                    borderColor: JSON.parse(this.props.userInfo).value
                      .app_color,
                  },
                ]}>
                <TouchableOpacity
                  style={styles.touchableButton}
                  onPress={() => this.selectImageFromArray(4)}>
                  <Image
                    source={require('../../theme/images/hd/love.gif')}
                    style={styles.imageThumbnail}
                  />
                </TouchableOpacity>
              </View>
            </View>
          )}
        </ScrollView>
        <BottomView/>
      </View>
      </SafeAreaView>      
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // justifyContent: 'center',
    // alignItems: 'center',
    // backgroundColor: 'red',
    width: '100%',
    height: '100%',
  },
  touchableButton: {
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    height: '100%',    
    // backgroundColor: '#DD6DDD',
  },
  locationView: {
    padding: 15,
    // paddingTop: 50,
    // height: "40%"
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
  imageThumbnail: {
    resizeMode: 'contain',
    height:hp('22%'),
    width:wp('22%'),
    borderColor: '#000',
    borderWidth: 0,
    borderRadius: 10,
  },
  imageThumbnailNetural: {
    resizeMode: 'contain',
    height:hp('15%'),
    width:wp('15%'),
    borderColor: '#000',
    borderWidth: 0,
    borderRadius: 10,
  },
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
  stretch: {
    width: 120,
    height: 50,
    resizeMode: 'contain',
  },
  scrollView: {
    // backgroundColor: 'pink',
    marginHorizontal: 20,
  },
  viewPotrait: {
    flex: 1,
    flexDirection: 'row',
    paddingLeft: 10,
    paddingRight: 10,
    paddingTop: 10,
    justifyContent: 'space-between',
    alignContent: 'center',
  },
  gridRow: {
    width: '49%',
    height: ((width / 2) * 100) / 49,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    // borderColor: '#955275',
    borderRadius: 5,
  },
  viewLanscape: {
    flexDirection: 'row',
    padding: 10,
    justifyContent: 'space-between',
    alignContent: 'center',
  },
  gridLandscape: {
    width: '19%',
    height: deviceIsTablet
      ? ((width / 5) * 100) / 45
      : ((width / 5) * 100) / 29,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#955275',
    borderRadius: 20,
    paddingTop: 10,
    paddingBottom: 10,
  },
  bottomView: {
    height: '5%',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  bottomText: {
    fontSize: 18,
    color: '#111',
  },
});
export default EmozyView;
