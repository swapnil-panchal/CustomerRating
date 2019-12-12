/* import libraries */
import { StyleSheet } from 'react-native';
import { colors } from "./Common";

const styles = StyleSheet.create({
	container: {
		flex: 1,
		backgroundColor: colors.colorWhite
	  },	
	customBackButton: {
		width: 40,
		height: 40,
		justifyContent: 'center',
		alignItems: 'center'
	},
	customBack: {
		height: '50%',
		width: '30%'
	}
})

/* export the styling */
export default styles;