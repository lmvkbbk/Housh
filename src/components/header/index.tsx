import { View, Text, StyleSheet, SafeAreaView, StatusBar } from 'react-native'
import componentColors from '@/src/styles/componentColors'

type HeaderProps = {
  title: string
}

export function Header({ title }: { title: string }) {
    return (
      <SafeAreaView style={{ backgroundColor: componentColors.modalBackground, borderBottomLeftRadius: 20, borderBottomRightRadius: 20, }}>
        <StatusBar
          barStyle="light-content"
          backgroundColor={componentColors.modalBackground}
        />
        <View style={styles.headerContainer}>
          <Text style={styles.headerText}>{title}</Text>
          <View style={styles.underline} />
        </View>
      </SafeAreaView>
    )
  }

const styles = StyleSheet.create({
  headerContainer: {
    backgroundColor: componentColors.modalBackground, 
    paddingTop: 8,
    paddingBottom: 15,
    paddingHorizontal: 25,
    borderBottomLeftRadius: 20,
    borderBottomRightRadius: 20,
    alignItems: 'center',
  },
  headerText: {
    fontSize: 22,
    fontWeight: '700',
    color: componentColors.textPrimary,
    letterSpacing: 0.5,
  },
  underline: {
    marginTop: 6,
    width: 40,
    height: 3,
    borderRadius: 2,
    backgroundColor: componentColors.primary,
  },
})
