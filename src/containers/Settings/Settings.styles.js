import {StyleSheet} from "react-native";

export default StyleSheet.create({
    container: {
        backgroundColor: '#292b2c',
        alignItems: 'center',
        flex: 1,
        flexDirection: 'column'
    },
    exitContainer: {
        position: 'absolute',
        zIndex: 200, top: 40, right: 20
    },
    content: {
        marginTop: 25, marginBottom: 40
    },
    loading: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center'
    }
});