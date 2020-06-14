import React, {Component} from 'react';
import {Dimensions, Image, ScrollView, View} from 'react-native';
import {Button} from 'react-native-elements';
import {LinearGradient} from "expo-linear-gradient";
import InfoWindow from '../../components/InfoWindow/InfoWindow';
import Spinner from "../../components/Spinner/Spinner";

class Food extends Component {
    state = {
        image: '',
        name: '',
        quantity: '',
        price: 0.00,
        percent: '100%',
        loading: true
    };

    componentDidMount() {
        let image = this.props.navigation.getParam('image', false);
        let name = this.props.navigation.getParam('name', false);
        let quantity = this.props.navigation.getParam('quantity', false);

        if (!name) name = 'Not found';
        if (!quantity) quantity = 'Not found';

        this.setState({image, name, quantity, loading: false});
    }

    render() {
        const {image, name, quantity, percent, price, loading} = this.state;
        const {navigation} = this.props;
        const heightWindow = Dimensions.get('window').height;

        return (
            <>
                {loading ?
                    <Spinner color='#000' size={64}/> :
                    <ScrollView>
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
                                    top: '-30%',
                                    backgroundColor: 'red',
                                    transform: [{skewY: '-30deg'}],
                                    position: 'absolute',
                                    zIndex: 0,
                                }}
                            />
                            <View style={{width: 200, height: 200, marginTop: 50}}>
                                <Image
                                    style={{width: 200, height: 200, resizeMode: 'center'}}
                                    source={image ? {uri: image} : require('../../assets/not-found-image.png')}
                                />
                            </View>
                            <View style={{flex: 1, marginTop: 30, flexDirection: 'column', marginBottom: 50}}>
                                <InfoWindow color1={'#f8f8f8'} color2={['#f2a91e', '#e95c17']} title={'Name'}
                                            val={name}/>
                                <InfoWindow color1={'#f8f8f8'} color2={['#af3462', '#bf3741']} title={'Quantity'}
                                            val={quantity}/>
                                <InfoWindow color1={'#f8f8f8'} color2={['#af3462', '#bf3741']} title={'Price'}
                                            val={price}/>
                                <InfoWindow color1={'#f8f8f8'} color2={['#af3462', '#bf3741']} title={'Wasted part'}
                                            val={percent}/>
                            </View>
                            <View style={{flex: 1, flexDirection: 'row', marginBottom: 50}}>
                                <Button
                                    buttonStyle={{borderColor: '#4b8b1d', marginRight: 20}}
                                    titleStyle={{color: '#4b8b1d', fontSize: 22, padding: 25, fontFamily: 'Lato-Light'}}
                                    type="outline"
                                    title="Save"
                                />
                                <Button
                                    onPress={() => navigation.navigate('Home')}
                                    buttonStyle={{borderColor: '#af3462'}}
                                    titleStyle={{color: '#af3462', fontSize: 22, padding: 25, fontFamily: 'Lato-Light'}}
                                    type="outline"
                                    title="Cancel"
                                />
                            </View>
                        </LinearGradient>
                    </ScrollView>
                }
            </>
        );
    }
}

export default Food;