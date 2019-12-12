import React, { Component } from 'react'
import PropTypes from 'prop-types';
import { Button, StyleSheet, View, Image } from 'react-native'

const color = () => Math.floor(255 * Math.random());

class ColorView extends Component {
  static navigationOptions = {
    title: 'Colors',
    tabBarIcon: ({ focused }) => (
      <View style={{ width: 24, height: 23 }}>
        <Image
          source={require("../../theme/images/shareTab.png")}
          style={{
            tintColor: focused ? "#000" : "#A9A9A9",
            width: "100%",
            height: "100%"
          }}
        />
      </View>
    ),
    // TODO: move this into global config?
    headerTintColor: 'white',
    headerStyle: {
      backgroundColor: '#39babd'
    }
  }
  static propTypes = {
    navigate: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {
      background: `rgba(${color()},${color()},${color()}, 1)`
    };
  }

  open = () => {
    this.props.navigation.navigate('InfiniteColorStack')
  };

  render() {
    const buttonText = 'Open in Stack Navigator';
    return (
      <View style={[styles.container, { backgroundColor: this.state.background }]}>
        <Button color='#ee7f06' title={buttonText} onPress={this.open} />
      </View>
    );
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'red',
  },
})
export default ColorView;
