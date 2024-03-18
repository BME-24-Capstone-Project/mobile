import { StyleSheet } from "react-native";

export const Colors = {
    primary: '#0067D9',
    secondary: '#EBF7FD',
    tertiary: 'white',
}

export const GlobalStyles = StyleSheet.create({
    buttonText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    appParagraphText: {
        fontSize: 16,
    },
    appLargeParagraphText: {
        fontSize: 18,
    },
    appHeadingText: {
        fontSize: 20,
        fontWeight: 'bold',
    },
    appSubHeadingText: {
        fontSize: 18,
        fontWeight: 'bold',
    },
    appSubSubHeadingText: {
        fontSize: 16,
        fontWeight: 'bold',
    },
    footerContainer: {
        width: '100%',
        gap: 5,
    },
    container: {
        padding: 15,
        // backgroundColor: Colors.secondary,
    },
    button: {
        padding: 5,
    }

})


