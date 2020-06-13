import React, {Component} from 'react';
import {Button, Dimensions, Image, Text, View} from 'react-native';
import {BarCodeScanner} from 'expo-barcode-scanner';
import axios from 'axios';
import {LinearGradient} from "expo-linear-gradient";
import InfoWindow from '../../components/InfoWindow/InfoWindow';
import styles from "../Home/Home.style";

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
        const heightWindow = Dimensions.get('window').height;

        return (
            <>
                <LinearGradient
                    start={{x: 0, y: 0}}
                    end={{x: 1, y: 1}}
                    colors={['#f2f3f5', '#f2f3f5']}
                    style={{
                        flex: 1,
                        flexDirection: 'column',
                        justifyContent: 'center',
                        alignItems: 'center',
                    }}>
                    <LinearGradient
                        colors={['#4b8b1d', '#6cd015']}
                        style={{
                            width: '200%',
                            height: heightWindow * 0.7,
                            left: '-30%',
                            top: '-25%',
                            backgroundColor: 'red',
                            transform: [{skewY: '-30deg'}],
                            position: 'absolute',
                            zIndex: 0,
                        }}
                    />
                    <LinearGradient style={{marginTop: 50, width: 230, height: 230}}
                                    start={{x: 0, y: 0}}
                                    end={{x: 1, y: 1}}
                                    colors={['#f2f3f5', '#c4bfc3']}>
                        <View style={{
                            borderWidth: 2,
                            borderColor: '#000',
                            width: 204,
                            height: 204,
                            margin: 13,
                            backgroundColor: '#000'
                        }}>
                            <Image
                                style={{width: 200, height: 200, resizeMode: 'center'}}
                                source={{uri: image}}
                            />
                        </View>
                    </LinearGradient>
                    <View style={{flex: 1, marginTop: 50, flexDirection: 'column'}}>
                        <InfoWindow color1={'#f8f8f8'} color2={['#f2a91e', '#e95c17']} title={'Name'} val={name}/>
                        <InfoWindow color1={'#f8f8f8'} color2={['#af3462', '#bf3741']} title={'Quantity'}
                                    val={quantity}/>
                        <InfoWindow color1={'#f8f8f8'} color2={['#af3462', '#bf3741']} title={'Name'} val={name}/>

                    </View>
                    {scanned && <Button title={'Tap to Scan Again'} onPress={this.resetScan}/>}
                </LinearGradient>
            </>
        );
    }
}

export default Scanner;