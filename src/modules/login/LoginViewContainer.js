import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { NavigationActions } from 'react-navigation';
import LoginView from './LoginView';

export default connect(
  state => ({
    userInfo: state.getIn(['userInfo', 'user']),
  }),
  dispatch => {
    return {
      navigate: bindActionCreators(NavigationActions.navigate, dispatch),
    };
  },
)(LoginView);