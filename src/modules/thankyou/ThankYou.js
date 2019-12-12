import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {
  StyleSheet,
  View,
  Text,
} from 'react-native';
import KeepAwake from 'react-native-keep-awake';
import {StackActions, NavigationActions} from 'react-navigation';

class ThankYou extends Component {
  user = null;
  static navigationOptions = {
    title: '',
  };

  static propTypes = {
    navigate: PropTypes.func.isRequired,
  };

  constructor(props) {
    super(props);
    this.state = {
      timer: 5,
      isLoading: false,
    };
  }

  componentDidMount() {
    console.log('TImer start *****');
    this.interval = setInterval(
      () => this.setState(prevState => ({timer: prevState.timer - 1})),
      1000,
    );
  }

  componentDidUpdate() {
    if (this.state.timer === 0) {
      console.log('Time up');
        this.setTimePassed();
    }
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  // Method 2
  changeKeepAwake = shouldBeAwake => {
    if (shouldBeAwake) {
      KeepAwake.activate();
    } else {
      KeepAwake.deactivate();
    }
  };

  setTimePassed() {
    this.props.navigation.dispatch(
      StackActions.reset({
        index: 0,
        actions: [NavigationActions.navigate({routeName: 'Authorized'})],
      }),
    );
  }

  render() {
    console.log('what is the timer--->', this.state.timer);
    return (
      <View style={[styles.container]}>
        <KeepAwake />
        <Text style={styles.textLocation}>Thanks for your feedback</Text>
      </View>
    );
  }
}
const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  textLocation: {
    fontSize: 27,
  },
});
export default ThankYou;
