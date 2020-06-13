import React, {Component} from 'react';
import {Button, Image, Text, View} from 'react-native';
import {BarCodeScanner} from 'expo-barcode-scanner';
import axios from 'axios';

class Scanner extends Component {
    state = {
        scanned: false,
        permission: false,
        image: '',
        name: '',
        quantity: ''
    };

    componentDidMount() {
        this.getPermission();
    }

    getPermission = async () => {
        const {status} = await BarCodeScanner.requestPermissionsAsync();

        this.setState({permission: status === 'granted'})
    };

    handleBarCodeScanned = ({type, data}) => {
        console.log(data);
        axios.get(`https://world.openfoodfacts.org/api/v0/product/${data}.json`)
            .then(res => {
                const image = res.data.product.image_url;
                const name = `${res.data.product.product_name} - ${res.data.product.brands}`;
                const quantity = res.data.product.product_quantity + 'g';

                this.setState({image, name, quantity, scanned: true});
            })
            .catch(err => {
                console.log(err);
            })
    };

    resetScan = () => {
        this.setState({
            scanned: false,
            name: '',
            image: '',
            quantity: ''
        })
    };

    render() {
        const {scanned, image, name, quantity} = this.state;

        return (
            <View
                style={{
                    flex: 1,
                    flexDirection: 'column',
                    justifyContent: 'center',
                    alignItems: 'center'
                }}>

                <View style={{flex: 1, marginTop: 50}}>
                    <View style={{borderWidth: 2, borderColor: '#000'}}>
                        {scanned === true ?
                            <Image
                                style={{width: 200, height: 200, resizeMode: 'center'}}
                                source={{uri: image}}
                            /> :
                            <BarCodeScanner
                                onBarCodeScanned={scanned ? undefined : this.handleBarCodeScanned}
                                style={{width: 200, height: 200}}
                            />
                        }
                    </View>
                </View>
                <View style={{flex: 1, marginTop: 50, flexDirection: 'column'}}>
                    <Text>Name: {name}</Text>
                    <Text>Quantity: {quantity}</Text>
                </View>

                {scanned && <Button title={'Tap to Scan Again'} onPress={this.resetScan}/>}
            </View>
        );
    }
}

export default Scanner;