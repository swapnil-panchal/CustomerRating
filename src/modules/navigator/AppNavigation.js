import { Platform } from 'react-native';
import {
    createAppContainer,
    createSwitchNavigator
} from 'react-navigation';
import {createBottomTabNavigator} from 'react-navigation-tabs';
import { createStackNavigator } from 'react-navigation-stack'
import CounterViewContainer from '../counter/CounterViewContainer';
import ColorViewContainer from '../colors/ColorViewContainer';

import LoginViewContainer from '../login/LoginViewContainer';
import EmozyViewContainer from '../emozies/EmozyViewContainer';
import SadViewContainer from '../sad/SadViewContainer';
import ExperienceformViewContainer from '../experinceform/ExperienceformViewContainer';
import LoveViewContainer from '../love/LoveViewContainer';
import LoveDetailContainer from '../loveDetail/LoveDetailContainer';
import LoveFormViewContainer from '../loveForm/LoveFormViewContainer';
import ThankYouContainer from '../thankyou/ThankYouContainer';
      // this.props.navigation.navigate('Thankyou');

const headerColor = '#004D83';
const activeColor = 'white';
const inactiveColor = '#69f0ae';
//STEP-3
export const MainScreenNavigator = createBottomTabNavigator({
    Count: {
        screen: CounterViewContainer,
        navigationOptions: {
            header: null
        }
    }, // <----StackNavigator},
    Color: {
        screen: ColorViewContainer,
        navigationOptions: {
            header: null
        }
    }
}, {
    tabBarOptions: {
        showIcon: true,
        showLabel: false,
        ...Platform.select({
            android: {
                activeTintColor: activeColor,
                // inactiveTintColor: inactiveColor,
                // inactiveBackgroundColor: inactiveColor,
                indicatorStyle: { backgroundColor: activeColor },
                style: { backgroundColor: headerColor }
            }
        })
    },

});

// Root navigator is a StackNavigator
const UnauthorizedNavigator = createStackNavigator(
  {
    Login: {
      screen: LoginViewContainer,
      navigationOptions: {
        header: null,
      },
    },
  },
  {headerMode: 'screen'},
  {initialRouteName: 'Login'},
);

const authorizedNavigator = createStackNavigator(
  {
    Emozy: {
      screen: EmozyViewContainer,
      navigationOptions: {
        header: null,
      },
    },
    Sad: {
      screen: SadViewContainer,
      navigationOptions: {
        header: null,
      },
    },
    Experience: {
      screen: ExperienceformViewContainer,
      navigationOptions: {
        header: null,
      },
    },
    Love: {
      screen: LoveViewContainer,
      navigationOptions: {
        header: null,
      },
    },
    LoveDetail: {
      screen: LoveDetailContainer,
      navigationOptions: {
        header: null,
      },
    },
    LoveForm: {
      screen: LoveFormViewContainer,
      navigationOptions: {
        header: null,
      },
    },
    Thankyou: {
      screen: ThankYouContainer,
      navigationOptions: {
        header: null,
      },
    },
  },
  {headerMode: 'screen'},
  {initialRouteName: 'Emozy'},
);
const AppNavigator = createStackNavigator({
  // Home: { screen: MainScreenNavigator },
  Unauthorized: {
    screen: UnauthorizedNavigator,
    navigationOptions: {
      header: null,
    },
  },
  Authorized: {
    screen: authorizedNavigator,
    navigationOptions: {
      header: null,
    },
  },
});

export default createAppContainer(AppNavigator);