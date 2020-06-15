import React, {Component} from 'react';
import {TouchableOpacity, View} from 'react-native';
import {BarCodeScanner} from 'expo-barcode-scanner';
import axios from "axios";
import Spinner from "../../components/Spinner/Spinner";
import {Icon} from "react-native-elements";

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
                    console.log(err);
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
                <View style={{position: 'absolute', top: 40, left: 20}}>
                    <TouchableOpacity onPress={() => this.props.navigation.goBack()}>
                        <Icon
                            size={30} name='close'
                            type='antdesign' color={"#fff"}
                        />
                    </TouchableOpacity>
                </View>
            </View>
        );
    }
}

export default Scanner;