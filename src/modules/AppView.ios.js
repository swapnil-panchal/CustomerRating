import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { StatusBar, View, StyleSheet, ActivityIndicator, SafeAreaView } from 'react-native';
import AppNavigationViewContainer from './navigator/AppNavigationViewContainer';
import * as snapshotUtil from './utils/snapshot';
import * as SessionStateActions from '../modules/session/SessionState';
import store from '../redux/store';
// import DeveloperMenu from '../components/DeveloperMenu';

class AppView extends Component {

	static propTypes = {
		isReady: PropTypes.bool.isRequired,
		dispatch: PropTypes.func.isRequired
	};

	componentDidMount() {
		snapshotUtil.resetSnapshot()
			.then(snapshot => {
				const { dispatch } = this.props;

				if (snapshot) {
					dispatch(SessionStateActions.resetSessionStateFromSnapshot(snapshot));
				} else {
					dispatch(SessionStateActions.initializeSessionState());
				}

				store.subscribe(() => {
					snapshotUtil.saveSnapshot(store.getState());
				});
			});
	}

	render() {
		if (!this.props.isReady) {
			return (
				<SafeAreaView style={{ flex: 1 }}>
					<ActivityIndicator style={styles.centered} />
				</SafeAreaView>
			);
		}
		return (
			<View style={{ flex: 1 }}>
				<StatusBar translucent={true} backgroundColor={'transparent'} />
				<AppNavigationViewContainer />
			</View>
		)
	}
}
const styles = StyleSheet.create({
	centered: {
		flex: 1,
		alignSelf: 'center'
	}
});
export default AppView;