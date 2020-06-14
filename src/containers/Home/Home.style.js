import {Dimensions, StyleSheet} from "react-native";

const heightWindow = Dimensions.get('window').height;

export default StyleSheet.create({
    circleOne: {
        height: 200,
        width: 200,
        borderRadius: 100,
        marginBottom: 20
    },
    circleTwo: {
        height: '80%',
        width: '80%',
        marginLeft: '10%',
        marginTop: '10%',
        borderRadius: 80,
    },
    circleThree: {
        height: '80%',
        width: '80%',
        marginLeft: '10%',
        marginTop: '10%',
        borderRadius: 60,
        justifyContent: 'center',
        alignItems: 'center',

    },
    textScan: {
        fontSize: 25
    },
    text: {
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 20,
        marginTop: 20,
        marginBottom: 30,
        marginLeft: 50,
        marginRight: 50,
        color: '#fff'
    },
    containerCenter: {
        justifyContent: 'center',
        alignItems: 'center',
        marginBottom: 10
    },
    container: {
        height: heightWindow
    },
    windowInformation: {
        width: '100%',
        marginTop: 10,
        flex: 1,
        height: 70,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center'
    },
    shadow: {
        width: '90%',
        marginLeft: '5%',
    },
    windowInformationColor: {
        borderLeftWidth: 1,
        flex: 5,
        height: '100%',
        borderBottomLeftRadius: 40,
        borderTopLeftRadius: 40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textWhite: {
        color: '#fff',
        fontFamily: 'Lato-Bold',
        fontSize: 22,
        textAlign: 'center',
    },
    textBlack: {
        fontSize: 22,
        fontFamily: 'Lato-Light',
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerColor: {
        width: '200%',
        height: heightWindow * 0.7,
        left: '-30%',
        top: '-25%',
        backgroundColor: 'red',
        transform: [{skewY: '-30deg'}],
        position: 'absolute',
        zIndex: -1,

    }
});
