import React, {Component} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {BarCodeScanner} from 'expo-barcode-scanner';
import axios from "axios";
import Spinner from "../../components/Spinner/Spinner";
import {Button, Icon} from "react-native-elements";

import {connect} from "react-redux";

class Scanner extends Component {
    state = {
        scanned: false,
        loading: false
    };

    componentDidMount() {
        this.getPermission();
    }

    getPermission = async () => {
        const {status} = await BarCodeScanner.requestPermissionsAsync();

        this.setState({permission: status === 'granted'})
    };

    handleBarCodeScanned = ({type, data}) => {
        this.setState({loading: true, scanned: true}, () => {
            axios.get(`https://world.openfoodfacts.org/api/v0/product/${data}.json`)
                .then(res => {
                    const image = res.data.product.image_url;
                    const name = res.data.product.product_name;
                    const quantity = res.data.product.product_quantity;

                    this.props.navigation.navigate('Food', {image, name, quantity});
                    this.setState({loading: false});
                })
                .catch(err => {
                    this.props.navigation.navigate('Food', {image: null, name: null, quantity: null});
                    this.setState({loading: false});
                })
        });
    };

    render() {
        const {scanned, loading} = this.state;

        return (
            <View
                style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'flex-end',
                    backgroundColor: '#292b2c'
                }}>
                <BarCodeScanner
                    onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
                    style={{width: '100%', height: '100%'}}
                />
                {loading &&
                <View style={{position: 'absolute', width: '100%', height: '100%', left: 0, top: 0}}>
                    <Spinner bgColor='transparency' color="#fff" size={64}/>
                </View>
                }
                <View style={{position: 'absolute', top: 40, left: 20, zIndex: 20}}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <Icon
                            size={30} name='close'
                            type='antdesign' color={"#fff"}
                        />
                    </TouchableOpacity>
                </View>
                <View style={{
                    position: 'absolute',
                    width: '100%',
                    height: '100%',
                    justifyContent: 'center',
                    alignItems: 'center',
                    zIndex: 10
                }}>
                    <View style={{
                        borderBottomWidth: 180,
                        borderTopWidth: 180,
                        borderLeftWidth: 45,
                        borderRightWidth: 45,
                        borderColor: 'rgba(0,0,0,0.7)',
                        width: '100%',
                        height: '100%'
                    }}>
                        <View style={{
                            borderWidth: 2,
                            borderColor: '#4b8b1d',
                            width: '100%',
                            height: '100%'
                        }}/>
                    </View>
                </View>
                <View style={{
                    zIndex: 20,
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
                }}>
                    <Button
                        onPress={() => this.props.navigation.navigate('Food')}
                        buttonStyle={{backgroundColor: '#4b8b1d'}}
                        titleStyle={{
                            color: '#fff',
                            fontSize: 18,
                            padding: 25,
                            fontFamily: 'Lato-Light'
                        }}
                        title={this.props.translations.addManually}
                    />
                </View>
            </View>
        );
    }
}

const mapStateToProps = state => {
    return {
        translations: state.settings.translations
    }
};

export default connect(mapStateToProps)(Scanner);