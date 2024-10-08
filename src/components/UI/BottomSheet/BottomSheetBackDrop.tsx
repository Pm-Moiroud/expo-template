import React from 'react'
import { StyleSheet, TouchableWithoutFeedback } from 'react-native'
import Animated, { SharedValue, interpolate, useAnimatedStyle } from 'react-native-reanimated'

type Props = {
  topAnimation: SharedValue<number>
  openHeight: number
  closeHeight: number
  close: () => void
}

const BackDrop = ({ topAnimation, openHeight, closeHeight, close }: Props) => {
  const backDropAnimation = useAnimatedStyle(() => {
    const opacity = interpolate(topAnimation.value, [closeHeight, openHeight], [0, 0.3])
    const display = opacity === 0 ? 'none' : 'flex'

    return {
      opacity,
      display: display,
    }
  })

  return (
    <TouchableWithoutFeedback onPress={close}>
      <Animated.View style={[styles.backDrop, backDropAnimation, { backgroundColor: 'black' }]} testID="hku-backdrop" />
    </TouchableWithoutFeedback>
  )
}

export default BackDrop

const styles = StyleSheet.create({
  backDrop: {
    ...StyleSheet.absoluteFillObject,
    display: 'none',
  },
})
