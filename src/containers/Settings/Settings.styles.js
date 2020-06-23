import {StyleSheet} from "react-native";

export default StyleSheet.create({
    container: {
        backgroundColor: '#292b2c',
        alignItems: 'center',
        flex: 1,
        flexDirection: 'column'
    },
    text: {
        color: '#fff',
        textAlign: 'center',
        fontSize: 22,
        margin: 5
    },
    clear: {
        flexDirection: 'row',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        marginTop: 40
    },
    clearTheDatabase:{
        marginTop: 15,
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 16,
        fontFamily: "Lato-Light"
    }
});