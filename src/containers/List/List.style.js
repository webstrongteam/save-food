import {Dimensions, StyleSheet} from "react-native";

const heightWindow = Dimensions.get('window').height;

export default StyleSheet.create({
    listItem: {
        width: '100%',
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        height: 160,
        marginTop: 10,
        marginBottom: 10,
        padding: 5
    },
    checkbox: {
        color: '#fff',
        flex: 1
    },
    emptyList: {
        color: '#fff',
        fontSize: 22,
        textAlign:'center'
    },
    text: {
        fontFamily: 'Lato-Light',
        fontSize: 14,
        color: '#fff',
        marginLeft: 10,
        marginBottom: 5
    },
    priceText: {
        fontFamily: 'Lato-Bold',
        position: 'absolute',
        bottom: 16,
        right: 10,
        color: '#fff',
        fontSize: 22
    },
    delete: {
        height: 75,
        borderRadius: 5,
        marginTop: 10,
        marginBottom: 0,
        flexDirection: 'row',
        padding: 10,
        justifyContent: 'flex-start',
        marginLeft: 10,
        alignItems: 'center',
        backgroundColor: '#dc3545'
    },
    edit: {
        height: 75,
        borderRadius: 5,
        marginTop: 10,
        marginBottom: 10,
        flexDirection: 'row',
        padding: 10,
        justifyContent: 'flex-start',
        marginLeft: 10,
        alignItems: 'center',
        backgroundColor: '#f8aa24'
    },
    container: {
        padding: 10,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowOpacity: 0.3,
        shadowRadius: 5,
        elevation: 7
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
