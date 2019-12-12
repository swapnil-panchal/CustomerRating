import { Map } from 'immutable';
import { get, post } from '../utils/api';
import * as apiEndpoints from '../utils/apiConfig'; // you need to make
import * as configuration from '../utils/configuration'; // already made
import { setAuthenticationToken, clearAuthenticationToken } from '../utils/authentication'; // already made

const API_ROOT = apiEndpoints.api;
configuration.setConfiguration('API_ROOT', API_ROOT);

// 1. Login API 
const SESSION_LOGIN_SUCCESS = 'SESSION_LOGIN_SUCCESS';
const SESSION_LOGIN_FAIL = 'SESSION_LOGIN_FAIL';


// 1. Login API
export const loginSuccess = value => ({
    type: SESSION_LOGIN_SUCCESS,
    payload: JSON.stringify({ value })
});

export const loginFail = value => ({
    type: SESSION_LOGIN_FAIL,
    payload: JSON.stringify({ value })
});


export const resetTo = (props, route) => {
    return async dispatch => {
        const resetAction = StackActions.reset({
            index: 0,
            key: null,
            actions: [NavigationActions.navigate({ routeName: route })]
        });
        props
            .navigation
            .dispatch(resetAction);
    };
};



// 1. Login
export const onLoginAsync = (props, locationID, appColor) => {
    return async dispatch => {
        let body = {
            location: locationID,
            app_color: appColor
        };
        post('posts', body, true)
          .then(responseData => {
            console.log('****onLoginAsync responseData--->', responseData);
            return responseData;
          })
          .catch(e => {
            // setTimeout(() => {
            //   Toast.show(AllTexts.SomthingWentWrong);
            // }, 1000);
          });
    };
};


// Initial state
const initialState = Map({
  user: '',
  isUserLogIn: false,
  errorMsg: '',
  userNotificationToken: '',
});

export default function UserAuthAPIStateReducer(state = initialState, action) {
  switch (action.type) {
    // 1. Login
    case SESSION_LOGIN_SUCCESS:
      return state.set('user', action.payload).set('isUserLogIn', true);
    case SESSION_LOGIN_FAIL:
      return state.set('errorMsg', action.payload).set('isUserLogIn', false);
    // default
    default:
      return state;
  }
}