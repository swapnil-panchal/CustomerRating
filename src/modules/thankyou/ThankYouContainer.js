import {connect} from 'react-redux';
import {bindActionCreators} from 'redux';
import {NavigationActions} from 'react-navigation';
import ThankYou from './ThankYou';

export default connect(
  state => ({
    userInfo: state.getIn(['userInfo', 'user']),
  }),
  dispatch => {
    return {
      navigate: bindActionCreators(NavigationActions.navigate, dispatch),
    };
  },
)(ThankYou);
