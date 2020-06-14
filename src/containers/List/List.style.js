import {Dimensions, StyleSheet} from "react-native";

const heightWindow = Dimensions.get('window').height;

export default StyleSheet.create({
    listItem: {
        width: '100%',
        borderRadius: 5,
        flexDirection: 'row',
        alignItems: 'center',
        height:160,
        marginTop: 10,
        marginBottom: 10,
        padding: 5,
        shadowColor: "#000",
        shadowOffset: {
            width: 0,
            height: 0
        },
        shadowOpacity: 0.5,
        shadowRadius: 10,
        elevation: 7
    },
    checkbox: {
        color: '#6adeff',
        flex: 1
    },
    text: {
        fontSize: 16,
        color: '#fff',
        marginLeft: 10,
        marginBottom:5
    },
    priceText:{
        position:'absolute',
        bottom:10,
        right:30,
        color:'#fff',
        fontSize:24
    },
    delete:{
        height:160,
        borderRadius: 5,
        marginTop: 10,
        marginBottom: 10,
        flexDirection: 'row',
        padding:10,
        justifyContent: 'flex-start',
        marginLeft:10,
        alignItems: 'center',
        backgroundColor:'#dc3545'
    },
    container:{
        padding: 10
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
