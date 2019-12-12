import {Map} from 'immutable';

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

/* Initial state */
const initialState = Map({
  user: '',
  isUserLogIn: false,
  errorMsg: '',
});

export default function LoginUserAPIStateReducer(state = initialState, action) {
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