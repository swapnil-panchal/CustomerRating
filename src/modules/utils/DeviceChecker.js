import { Dimensions } from 'react-native'

export default DeviceChecker = () => {
    let isDevice = (Dimensions.get('window').width > 400) ? 'tablet':'mobile'
    return isDevice
}