import {Dimensions, StyleSheet} from "react-native";

const heightWindow = Dimensions.get('window').height;

export default StyleSheet.create({
    takePhotoButton: {
        position: 'absolute',
        width: '100%',
        bottom: 30,
        justifyContent: 'center',
        alignItems: 'center',
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowOpacity: 0.2,
        shadowRadius: 5,
        elevation: 7
    },
    linearGradient1: {
        flex: 1,
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
    },
    linearGradient2: {
        width: '200%',
        height: heightWindow * 0.7,
        left: '-30%',
        top: '-30%',
        backgroundColor: 'red',
        transform: [{skewY: '-30deg'}],
        position: 'absolute',
        zIndex: 0,
    },
    infoWindowsContainer: {
        flex: 1,
        marginTop: 30,
        flexDirection: 'column',
        marginBottom: 30
    },
    sliderContainer: {
        flex: 1,
        justifyContent: 'center',
        marginLeft: 30,
        marginRight: 30,
        marginTop: 30
    },
    percentInfo: {
        textAlign: 'center',
        color: '#292b2c',
        fontFamily: 'Lato-Light',
        fontSize: 16
    },
    percent: {
        textAlign: 'center',
        color: '#292b2c',
        fontFamily: 'Lato-Bold',
        fontSize: 16
    },
    saveContainer: {
        flex: 1,
        marginBottom: 50,
        flexDirection: 'row',
        justifyContent: 'center'
    }
});
