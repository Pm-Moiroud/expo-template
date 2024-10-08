import React, { forwardRef, useCallback, useImperativeHandle, useState } from 'react'
import { Dimensions, View } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, {
  useSharedValue,
  useAnimatedStyle,
  withSpring,
  withTiming,
  useAnimatedScrollHandler,
  AnimatedScrollViewProps,
  runOnJS,
} from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { styles } from './Bottom.stylesheet'
import { type BottomSheetRef, type BottomSheetProps } from './BottomSheet'
import BottomSheetBackDrop from './BottomSheetBackDrop'
import { Portal } from 'react-native-paper'

export type BottomSheetScrollViewProps = AnimatedScrollViewProps & BottomSheetProps

const BottomSheetScrollView = forwardRef<BottomSheetRef, BottomSheetScrollViewProps>(
  ({ snapTo, children, onClose, backgroundColor = 'white', ...rest }, ref) => {
    const inset = useSafeAreaInsets()
    const { height } = Dimensions.get('screen')
    const percentage = parseFloat(snapTo.replace('%', '')) / 100
    const closeHeight = height
    const openHeight = height - height * percentage
    const topAnimation = useSharedValue(closeHeight)
    const context = useSharedValue(0)
    const scrollBegin = useSharedValue(0)
    const scrollY = useSharedValue(0)
    const [isActive, setIsActive] = useState(false)

    const open = useCallback(() => {
      'worklet'
      topAnimation.value = withTiming(openHeight)
      setIsActive(true)
    }, [openHeight, topAnimation])

    const close = useCallback(() => {
      'worklet'
      topAnimation.value = withTiming(closeHeight)
      setIsActive(false)
      onClose?.()
    }, [closeHeight, topAnimation])

    const animationStyle = useAnimatedStyle(() => {
      const top = topAnimation.value
      return {
        top,
      }
    })

    const pan = Gesture.Pan()
      .onBegin(() => {
        context.value = topAnimation.value
      })
      .onUpdate((event) => {
        if (event.translationY < 0) {
          topAnimation.value = withSpring(openHeight, {
            damping: 100,
            stiffness: 400,
          })
        } else {
          topAnimation.value = withSpring(context.value + event.translationY, {
            damping: 100,
            stiffness: 400,
          })
        }
      })
      .onEnd(() => {
        if (topAnimation.value > openHeight + 50) {
          topAnimation.value = withSpring(closeHeight, {
            damping: 100,
            stiffness: 400,
          })
          runOnJS(setIsActive)(false)
        } else {
          topAnimation.value = withSpring(openHeight, {
            damping: 100,
            stiffness: 400,
          })
          runOnJS(setIsActive)(true)
        }
      })
      .runOnJS(true)

    const onScroll = useAnimatedScrollHandler({
      onBeginDrag: (event) => {
        scrollBegin.value = event.contentOffset.y
      },
      onScroll: (event) => {
        scrollY.value = event.contentOffset.y
      },
    })

    const panScroll = Gesture.Pan()
      .onBegin(() => {
        context.value = topAnimation.value
      })
      .onUpdate((event) => {
        if (event.translationY < 0) {
          topAnimation.value = withSpring(openHeight, {
            damping: 100,
            stiffness: 400,
          })
        } else if (event.translationY > 0 && scrollY.value === 0) {
          topAnimation.value = withSpring(
            Math.max(context.value + event.translationY - scrollBegin.value, openHeight),
            {
              damping: 100,
              stiffness: 400,
            }
          )
        }
      })
      .onEnd(() => {
        if (topAnimation.value > openHeight + 50) {
          topAnimation.value = withSpring(closeHeight, {
            damping: 100,
            stiffness: 400,
          })
        } else {
          topAnimation.value = withSpring(openHeight, {
            damping: 100,
            stiffness: 400,
          })
        }
      })

    useImperativeHandle(
      ref,
      () => ({
        open,
        close,
        isActive,
      }),
      [open, close]
    )

    const scrollViewGesture = Gesture.Native()

    return (
      <Portal>
        <BottomSheetBackDrop
          close={close}
          closeHeight={closeHeight}
          openHeight={openHeight}
          topAnimation={topAnimation}
        />
        <GestureDetector gesture={pan}>
          <Animated.View
            style={[
              styles['HkuBottomSheet-container'],
              animationStyle,
              {
                backgroundColor,
                paddingBottom: inset.bottom,
              },
            ]}
            testID="hku-button"
          >
            <View style={styles['HkuBottomSheet-line-container']}>
              <View style={styles['HkuBottomSheet-Line']} />
            </View>
            <GestureDetector gesture={Gesture.Simultaneous(scrollViewGesture, panScroll)}>
              <Animated.ScrollView
                {...rest}
                bounces={false}
                scrollEnabled={true}
                scrollEventThrottle={16}
                testID="hku-scrollView"
                onScroll={onScroll}
              >
                {isActive ? children : null}
              </Animated.ScrollView>
            </GestureDetector>
          </Animated.View>
        </GestureDetector>
      </Portal>
    )
  }
)

BottomSheetScrollView.displayName = 'BottomSheetScrollView'

export default BottomSheetScrollView
