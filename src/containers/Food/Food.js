import React, {Component} from 'react';
import {Dimensions, Image, ScrollView, View} from 'react-native';
import {LinearGradient} from "expo-linear-gradient";
import InfoWindow from '../../components/InfoWindow/InfoWindow';
import Spinner from "../../components/Spinner/Spinner";

class Food extends Component {
    state = {
        image: '',
        name: '',
        quantity: '',
        loading: true
    };

    componentDidMount() {
        const image = this.props.navigation.getParam('image', false);
        const name = this.props.navigation.getParam('name', false);
        const quantity = this.props.navigation.getParam('quantity', false);

        this.setState({image, name, quantity, loading: false});
    }

    render() {
        const {image, name, quantity, loading} = this.state;
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
                                    backgroundColor: 'transparency'
                                }}>
                                    <Image
                                        style={{width: 200, height: 200, resizeMode: 'center'}}
                                        source={{uri: image}}
                                    />
                                </View>
                            </LinearGradient>
                            <View style={{flex: 1, marginTop: 50, flexDirection: 'column', marginBottom: 50}}>
                                <InfoWindow color1={'#f8f8f8'} color2={['#f2a91e', '#e95c17']} title={'Name'}
                                            val={name}/>
                                <InfoWindow color1={'#f8f8f8'} color2={['#af3462', '#bf3741']} title={'Quantity'}
                                            val={quantity}/>
                                <InfoWindow color1={'#f8f8f8'} color2={['#af3462', '#bf3741']} title={'Name'}
                                            val={name}/>

                            </View>
                        </LinearGradient>
                    </ScrollView>
                }
            </>
        );
    }
}

export default Food;