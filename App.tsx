import React, { useEffect } from 'react'
import { StatusBar } from 'react-native'
import SplashScreen from 'react-native-splash-screen'
import { COLOR } from 'infra/color'
import { HomeScreen } from 'screens/home'

export const App = () => {
  useEffect(() => {
    SplashScreen.hide()
    return () => {}
  }, [])
  return (
    <>
      <StatusBar barStyle='light-content' backgroundColor={COLOR.dark} />
      <HomeScreen />
    </>
  )
}
