import AntDesign from '@expo/vector-icons/AntDesign'
import type { FC, MutableRefObject, PropsWithChildren, ReactNode } from 'react'
import React, { createContext, memo, useCallback, useEffect, useMemo, useState } from 'react'
import type { ViewProps } from 'react-native'
import { Pressable, StyleSheet, View } from 'react-native'
import { Text, useTheme } from 'react-native-paper'
import Animated, { Easing, FadeIn, useAnimatedStyle, useSharedValue, withTiming } from 'react-native-reanimated'

type StepsContextValue = {
  selectedStep: number
  keepMounted: boolean
  handleChangeStep: (value: number) => void
  visitedSteps: MutableRefObject<number[]>
  forceInitialRender: boolean
}
const StepsContext = createContext<StepsContextValue | null>(null)

export const useStepsContext = () => {
  const context = React.useContext(StepsContext)
  if (!context) {
    throw new Error('Stepper components must be rendered within his provider')
  }
  return context
}

export type StepsRootProps = {
  value?: number
  children: React.ReactNode
  keepMounted?: boolean
  forceInitialRender?: boolean
  onChange?: (value: number) => void
  style?: ViewProps['style']
}

const StepsRoot: FC<PropsWithChildren<StepsRootProps>> = ({
  children,
  value,
  keepMounted = false,
  forceInitialRender = false,
  onChange,
  style,
}) => {
  const [selectedStep, setSelectedStep] = useState(value ?? 1)
  const visitedSteps = React.useRef<number[]>([])

  useEffect(() => {
    setSelectedStep(value ?? 1)
  }, [value])

  const handleChangeStep = useCallback((value: number) => {
    setSelectedStep(value)
    onChange?.(value)
  }, [])

  const contextValue = useMemo(
    () => ({
      selectedStep,
      handleChangeStep,
      visitedSteps,
      keepMounted,
      forceInitialRender,
    }),
    [selectedStep, handleChangeStep, visitedSteps, keepMounted, forceInitialRender]
  )

  return (
    <StepsContext.Provider value={contextValue}>
      <View
        style={[
          {
            flex: 1,
          },
          style,
        ]}
      >
        {children}
      </View>
    </StepsContext.Provider>
  )
}
StepsRoot.displayName = 'Stepper'

type StepsListProps = ViewProps & {
  children: ReactNode[]
}
const StepsList: FC<StepsListProps> = ({ ...props }) => {
  const { selectedStep } = useStepsContext()
  const theme = useTheme()

  const itemWidth = useMemo(() => 100 / (props.children.length - 1), [props.children.length])

  const animationWith = useSharedValue(0)

  const useWithAnimation = useAnimatedStyle(() => {
    return {
      width: `${animationWith.value}%`,
    }
  })

  useEffect(() => {
    animationWith.value = withTiming(getWith(selectedStep), {
      duration: 300,
      easing: Easing.linear,
    })
  }, [selectedStep])

  const getWith = (index: number): number => {
    if (index === 1) {
      return 0
    }
    if (index === props.children.length) {
      return 100
    }

    return itemWidth * (index - 1)
  }

  return (
    <View {...props} role="tablist" style={[styles.stepsList]}>
      <View style={styles.stepsListBackground}>
        <Animated.View
          style={[
            styles.stepsListAnimated,
            {
              backgroundColor: theme.colors.primary,
            },
            useWithAnimation,
          ]}
        />
      </View>
      {props.children}
    </View>
  )
}
StepsList.displayName = 'StepsList'

type TabItemProps = ViewProps & {
  value: number
  disabled?: boolean
}

const StepsItem: FC<TabItemProps> = ({ value, disabled = false, ...props }) => {
  const theme = useTheme()
  const { selectedStep, handleChangeStep } = useStepsContext()

  const current = selectedStep === value

  const isPassed = value < selectedStep || current

  return (
    <Pressable
      style={styles.stepsItemPressable}
      {...props}
      aria-label={`tab ${value}`}
      disabled={disabled}
      role="tabpanel"
      onPress={() => handleChangeStep(value)}
    >
      <View style={styles.stepsItemContainer}>
        <View
          style={[
            styles.stepsItemCircle,
            {
              borderColor: isPassed ? theme.colors.primary : 'black',
              backgroundColor: isPassed ? theme.colors.primary : 'white',
            },
          ]}
        >
          {value < selectedStep ? (
            <AntDesign name="check" size={20} color="white" />
          ) : (
            <Text
              style={{
                color: isPassed ? 'white' : 'black',
              }}
            >
              {value}
            </Text>
          )}
        </View>

        <View>{props.children}</View>
      </View>
    </Pressable>
  )
}
StepsItem.displayName = 'StepsItem'

type TabContentProps = ViewProps & {
  value: number
}
const TabContent: FC<TabContentProps> = memo(({ value, children, ...props }) => {
  const { selectedStep, visitedSteps, keepMounted, forceInitialRender } = useStepsContext()
  const current = value === selectedStep

  const shouldBeRendered = useCallback(() => {
    if (forceInitialRender && !visitedSteps.current.includes(value)) {
      visitedSteps.current.push(value)
      return true
    } else if (!forceInitialRender && !visitedSteps.current.includes(value)) {
      return false
    } else if (!keepMounted) {
      return false
    } else {
      return true
    }
  }, [visitedSteps, value])

  if (current) {
    return (
      <Animated.View entering={FadeIn.duration(500).easing(Easing.inOut(Easing.ease))} {...props} style={{ flex: 1 }}>
        {children}
      </Animated.View>
    )
  } else {
    return shouldBeRendered() ? (
      <View style={styles.hiddenContent} {...props}>
        {children}
      </View>
    ) : null
  }
})
TabContent.displayName = 'StepsContent'

const Stepper = StepsRoot as typeof StepsRoot & {
  List: typeof StepsList
  Item: typeof StepsItem
  Content: typeof TabContent
}

Stepper.List = StepsList
Stepper.Item = StepsItem
Stepper.Content = TabContent

const styles = StyleSheet.create({
  stepsList: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  stepsListBackground: {
    height: 2,
    position: 'absolute',
    backgroundColor: 'lightgray',
    top: 15,
    zIndex: 10,
    width: '100%',
  },
  stepsListAnimated: {
    height: 2,
  },
  stepsItemPressable: {
    backgroundColor: 'white',
    zIndex: 20,
  },
  stepsItemContainer: {
    justifyContent: 'center',
    alignItems: 'center',
    width: 70,
    gap: 6,
  },
  stepsItemCircle: {
    width: 32,
    height: 32,
    borderRadius: 16,
    borderWidth: 2,
    justifyContent: 'center',
    alignItems: 'center',
  },
  hiddenContent: {
    display: 'none',
  },
})

export default Stepper
