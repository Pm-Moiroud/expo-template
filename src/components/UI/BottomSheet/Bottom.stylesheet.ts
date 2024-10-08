import { StyleSheet } from 'react-native'

export const styles = StyleSheet.create({
  'HkuBottomSheet-container': {
    ...StyleSheet.absoluteFillObject,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  'HkuBottomSheet-line-container': {
    marginVertical: 10,
    alignItems: 'center',
  },
  'HkuBottomSheet-Line': {
    width: 50,
    height: 4,
    backgroundColor: 'black',
    borderRadius: 20,
  },
})
