import { router } from 'expo-router'
import React, { type FC } from 'react'
import { View } from 'react-native'
import { Button, Text } from 'react-native-paper'
import { SafeAreaView } from 'react-native-safe-area-context'

type IndexProps = {}

const Index: FC<IndexProps> = (_props) => {
  return (
    <SafeAreaView style={{ flex: 1, paddingHorizontal: 20, paddingVertical: 30 }}>
      <View
        style={{
          paddingHorizontal: 20,
        }}
      >
        <View
          style={{
            width: 300,
            height: 300,
            borderRadius: 20,
            backgroundColor: 'blue',
            alignSelf: 'center',
            justifyContent: 'center',
            alignItems: 'center',
          }}
        >
          <Text>Index</Text>
        </View>
        <View
          style={{
            alignItems: 'center',
            paddingVertical: 30,
            gap: 10,
          }}
        >
          <Text variant="titleLarge" style={{ textAlign: 'center', fontWeight: 700 }}>
            Want to be informed with latest events
          </Text>
          <Text style={{ textAlign: 'center' }}>
            Join intrasafe community to organize your work and find the latest events
          </Text>
        </View>
        <Button mode="contained" onPress={() => router.push('/(auth)/login')}>
          <Text style={{ color: 'white' }}>Sign in</Text>
        </Button>
      </View>
    </SafeAreaView>
  )
}

export default Index
