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
    statuse: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        marginRight: 40,
        flex:5,
    },
    textStatuse: {
        display:'flex',
        textAlign: 'left',
        fontSize: 15,
        fontFamily: "Lato-Light"
    },
    checkStatuse: {
        display:'flex',
        marginLeft: 20,
        flex:1,
    },
    href: {
        color:'#4d6999',
        fontFamily: "Lato-Bold"
    },
    image: {
        width:100,
        height:100,
        marginBottom:40,
        fontFamily: "Lato-Light"
    }
});
