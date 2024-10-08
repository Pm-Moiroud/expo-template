import React, {
  PropsWithChildren,
  forwardRef,
  useCallback,
  useEffect,
  useImperativeHandle,
  useMemo,
  useState,
} from 'react'
import { Dimensions, StyleProp, StyleSheet, View, ViewProps, ViewStyle } from 'react-native'
import { Gesture, GestureDetector } from 'react-native-gesture-handler'
import Animated, { useSharedValue, withTiming, useAnimatedStyle, withSpring, runOnJS } from 'react-native-reanimated'
import { useSafeAreaInsets } from 'react-native-safe-area-context'

import { Portal } from 'react-native-paper'

import BottomSheetBackDrop from './BottomSheetBackDrop'

export type BottomSheetProps = PropsWithChildren<{
  snapTo: string
  backgroundColor?: ViewStyle['backgroundColor']
  style?: StyleProp<Omit<ViewStyle, 'top' | 'paddingBottom' | 'borderTopLeftRadius' | 'borderTopRightRadius'>>
  onClose?: () => void
}>

interface BottomSheetMethods {
  open: () => void
  close: () => void
  isActive: boolean
}

export type BottomSheetRef = BottomSheetMethods & Partial<View>

const BottomSheet = forwardRef<BottomSheetRef, BottomSheetProps & ViewProps>(
  ({ snapTo = '50%', children, onClose, backgroundColor = 'white', ...rest }, ref) => {
    const safeAreaInsets = useSafeAreaInsets()
    const inset = safeAreaInsets
    const { height } = Dimensions.get('screen')
    const percentage = useMemo(() => parseFloat(snapTo.replace('%', '')) / 100, [snapTo])
    const closeHeight = height
    const openHeight = useMemo(() => height - height * percentage, [percentage, height])
    const topAnimation = useSharedValue(closeHeight)
    const context = useSharedValue(0)
    const [isActive, setIsActive] = useState(false)

    const open = useCallback(() => {
      topAnimation.value = withTiming(openHeight)
      setIsActive(true)
    }, [openHeight, topAnimation])

    const close = useCallback(() => {
      topAnimation.value = withTiming(closeHeight)
      setIsActive(false)
    }, [closeHeight, topAnimation])

    const animationStyle = useAnimatedStyle(() => {
      return {
        top: topAnimation.value,
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

    useEffect(() => {
      if (!isActive) {
        onClose?.()
      }
    }, [isActive, open, close])

    useImperativeHandle(
      ref,
      () => ({
        open,
        close,
        isActive,
      }),
      [open, close, isActive]
    )

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
            {...rest}
            style={[
              styles.container,
              animationStyle,
              {
                backgroundColor,
                paddingBottom: inset ? inset.bottom : undefined,
              },
            ]}
            testID="hku-bottom-sheet"
          >
            <View style={styles.lineContainer} testID="hku-bottom-sheet-line-container">
              <View style={styles.line} testID="hku-bottom-sheet-line" />
            </View>
            {isActive ? children : null}
          </Animated.View>
        </GestureDetector>
      </Portal>
    )
  }
)

BottomSheet.displayName = 'BottomSheet'

export default BottomSheet

const styles = StyleSheet.create({
  container: {
    ...StyleSheet.absoluteFillObject,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  lineContainer: {
    marginVertical: 10,
    alignItems: 'center',
  },
  line: {
    width: 50,
    height: 4,
    backgroundColor: 'black',
    borderRadius: 20,
  },
})
