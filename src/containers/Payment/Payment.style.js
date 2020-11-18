import {StyleSheet} from "react-native";

export default StyleSheet.create({
    modalMessage: {
        marginTop: 15,
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 16,
        fontFamily: "Lato-Light"
    },
    modalFooterMessage: {
        marginTop: 15,
        textAlign: 'center',
        justifyContent: 'center',
        alignItems: 'center',
        fontSize: 12,
        fontFamily: "Lato-Light"
    },
    inline: {
        flexDirection: 'row',
        justifyContent: "center",
        flexWrap: 'wrap'
    },
    status: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginRight: 40,
        flex: 5,
    },
    textStatus: {
        display: 'flex',
        textAlign: 'left',
        fontSize: 15,
        fontFamily: "Lato-Light"
    },
    checkStatus: {
        display: 'flex',
        marginLeft: 20,
        flex: 1,
    },
    href: {
        color: '#4d6999',
        fontFamily: "Lato-Bold"
    },
    image: {
        width: 100,
        height: 100,
        marginBottom: 40,
        fontFamily: "Lato-Light"
    },
    commissionTextStar: {
        fontSize: 14,
        fontFamily: 'Lato-Light',
        color: '#dc3545',
        textAlign: 'center'
    },
    commissionText: {
        fontSize: 14,
        fontFamily: 'Lato-Light',
        color: '#000',
        textAlign: 'center'
    },
    buttonContainer: {
        marginTop: 20,
        marginBottom: 20
    },
    buttonTitle: {
        color: '#fff',
        fontSize: 18,
        padding: 25,
        fontFamily: 'Lato-Light'
    },
    pajacykText: {
        fontSize: 20,
        fontFamily: 'Lato-Bold',
        color: '#4d6999',
        textAlign: 'center',
        marginBottom: 20
    },
    errorEmail: {
        fontSize: 20,
        fontFamily: 'Lato-Light',
        color: '#dc3545'
    },
    chooseCharity: {
        fontSize: 20,
        fontFamily: 'Lato-Light',
        color: '#000'
    },
    validationContainer: {
        width: '80%',
        marginTop: 45,
        marginBottom: -10
    },
    amountText: {
        fontSize: 20,
        fontFamily: 'Lato-Light',
        color: '#000'
    }
});
