import { SafeAreaView } from 'react-native'
import React from 'react'
import { COLOR } from 'infra/color'

export const SafeArea = (props: any) => (
  <SafeAreaView
    style={[props.style, { flex: 1, backgroundColor: COLOR.background }]}
  >
    {props.children}
  </SafeAreaView>
)
