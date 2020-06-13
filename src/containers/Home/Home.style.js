import {Dimensions, StyleSheet} from "react-native";

const heightWindow = Dimensions.get('window').height;

export default StyleSheet.create({
    circleOne: {
        height: 200,
        width: 200,
        borderRadius: 1000,
        marginBottom: 20
    },
    circleTwo: {
        height: '80%',
        width: '80%',
        marginLeft: '10%',
        marginTop: '10%',
        borderRadius: 1000,
    },
    circleThree: {
        height: '80%',
        width: '80%',
        marginLeft: '10%',
        marginTop: '10%',
        borderRadius: 1000,
        justifyContent: 'center',
        alignItems: 'center',

    },
    textScan: {
        fontSize: 25
    },
    text: {
        fontSize: 20,
        marginBottom:20,
        margin:170,
        marginLeft:50,
        marginRight:50,
        color:'#fff'
    },
    containerCenter:{
        justifyContent: 'center',
        alignItems: 'center',
    },
    container: {
        backgroundColor: '#f9f9f9',
        height:heightWindow
    },
    windowInformation: {
        width: '100%',
        marginTop: 10,
        flex:1,
        height:80,
        borderColor:'#f9f9f9',
        borderWidth: 1,
        flexDirection: 'row',
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor:'#f8f8f8',

    },
    shadow:{
        width: '90%',
        marginLeft:'5%',
    },
    windowInformationColor:{
        borderLeftWidth:1,
        flex:5,
        height:'100%',
        borderBottomLeftRadius:40,
        borderTopLeftRadius:40,
        justifyContent: 'center',
        alignItems: 'center',
    },
    textWhite:{
        color:'#fff',
        fontSize:28,
        textAlign:'center',
    },
    textBlack:{
        fontSize:22,
        textAlign:'center',
        justifyContent: 'center',
        alignItems: 'center',
    },
    containerColor: {
        width: '200%',
        height: heightWindow*0.7,
        left:'-30%',
        top:'-25%',
        backgroundColor: 'red',
        transform:[{skewY:'-30deg'}],
        position:'absolute',
        zIndex:-1,

    }
});
