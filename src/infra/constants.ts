import { Dimensions, Platform } from 'react-native'

export const WINDOW_WIDTH = Dimensions.get('window').width
export const WINDOW_HEIGHT = Dimensions.get('window').height

export const isIOS = Platform.OS === 'ios'
export const isAOS = Platform.OS === 'android'
