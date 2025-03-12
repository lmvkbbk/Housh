import { colors } from "@/app/styles/colors";
import { StyleSheet } from "react-native";

export const s = StyleSheet.create({
    overlay: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
      },
      modal: {
        width: '80%',
        padding: 20,
        borderRadius: 10,
      },
      cancelButton: {
        position: 'absolute',
        top: 10,
        right: 10,
      },
      cancelText: {
        fontSize: 18,
        color: '#fff',
      },
      title: {
        fontSize: 20,
        fontWeight: 'bold',
        marginBottom: 20,
        color: '#fff',
      },
      input: {
        height: 50,
        backgroundColor: colors.grey1,
        fontWeight: 'bold',
        color: '#fff',
        borderRadius: 8,
        paddingHorizontal: 10,
        marginBottom: 20,
      },
      confirmButton: {
        backgroundColor: '#101020',
        padding: 15,
        borderRadius: 8,
        alignItems: 'center',
      },
      confirmText: {
        color: '#FEE715',
        fontWeight: 'bold',
      },
})