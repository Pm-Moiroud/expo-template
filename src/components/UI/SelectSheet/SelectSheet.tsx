import React, { useCallback, forwardRef } from 'react'
import { Picker } from '@react-native-picker/picker'
import { BottomSheet, BottomSheetRef, BottomSheetScrollView } from '../BottomSheet'

type SelectSheetProps<T> = {
  selectedValue: string
  onValueChange: (value: string) => void
  items: T[]
  onClose?: () => void
}

const SelectSheet = <T extends { value: string; label: string }>(
  { selectedValue, onValueChange, items, onClose }: SelectSheetProps<T>,
  ref: React.Ref<BottomSheetRef>
) => {
  return (
    <BottomSheetScrollView
      ref={ref}
      snapTo="30%"
      style={{ borderTopLeftRadius: 20, borderTopRightRadius: 20 }}
      onClose={onClose}
    >
      <Picker selectedValue={selectedValue} onValueChange={onValueChange} style={{ zIndex: 99999 }}>
        {items?.map((item: T) => <Picker.Item key={item.value} label={item.label} value={item.value} />)}
      </Picker>
    </BottomSheetScrollView>
  )
}

export default forwardRef(SelectSheet)
