import React, {Component} from 'react';
import {Dimensions, Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {Button, Input, Slider} from 'react-native-elements';
import {LinearGradient} from "expo-linear-gradient";
import InfoWindow from '../../components/InfoWindow/InfoWindow';
import Spinner from "../../components/Spinner/Spinner";
import Modal from "../../components/Modal/Modal";

import {connect} from 'react-redux';

class Food extends Component {
    state = {
        image: '',
        name: '',
        quantity: '',
        price: 0.00,
        percent: 100,
        savedDate: {},

        showModal: false,
        modalContent: null,
        type: '',

        loading: true
    };

    componentDidMount() {
        let image = this.props.navigation.getParam('image', false);
        let name = this.props.navigation.getParam('name', false);
        let quantity = this.props.navigation.getParam('quantity', false);

        if (!name) name = 'Not found';
        if (!quantity) quantity = 'Not found';

        this.setState({
            savedDate: {name, image, quantity, price: 0.00, percent: 100},
            image, name, quantity, loading: false
        });
    }

    setContent = (type) => {
        this.setState({
            modalContent: (
                <View style={{marginTop: 20, marginBottom: -20}}>
                    <Input
                        keyboardType={type === 'price' ? 'numeric' : 'default'}
                        placeholder={this.state[type] + ''}
                        onChangeText={(value) => {
                            this.setState({
                                [type]: type === 'price' ?
                                    Math.abs(+(value.replace(',', '.'))) :
                                    value
                            })
                        }}
                    />
                </View>
            ),
            showModal: true, type
        })
    };

    saveChange = () => {
        const {savedDate, type} = this.state;
        savedDate[type] = this.state[type];

        this.setState({savedDate, showModal: false});
    };

    cancelChange = () => {
        const {savedDate, type} = this.state;

        this.setState({[type]: savedDate[type], showModal: false});
    };

    toggleModal = (type) => {
        if (!this.state.showModal) {
            this.setContent(type);
        } else {
            this.setState({showModal: !this.state.showModal});
        }
    };

    render() {
        const {showModal, modalContent, type, savedDate, image, percent, loading} = this.state;
        const {navigation, currency} = this.props;
        const heightWindow = Dimensions.get('window').height;

        return (
            <>
                {loading ?
                    <Spinner color='#000' size={64}/> :
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

                        <Modal
                            visible={showModal}
                            toggleModal={this.toggleModal}
                            title={`Change ${type}`}
                            content={modalContent}
                            buttons={[
                                {text: 'Save', onPress: this.saveChange},
                                {text: 'Cancel', onPress: this.cancelChange}
                            ]}
                        />

                        <View style={{flex: 1, width: '100%', justifyContent: 'center'}}>
                            <ScrollView>
                                <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                                    <View style={{width: 200, height: 200, marginTop: 50}}>
                                        <Image
                                            style={{width: 200, height: 200, resizeMode: 'center'}}
                                            source={image ? {uri: image} : require('../../assets/not-found-image.png')}
                                        />
                                    </View>
                                </View>
                                <View style={{flex: 1, marginTop: 30, flexDirection: 'column', marginBottom: 30}}>
                                    <TouchableOpacity onPress={() => this.toggleModal('name')}>
                                        <InfoWindow color1={'#f8f8f8'} color2={['#f2a91e', '#e95c17']} title={'Name'}
                                                    val={savedDate.name}/>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.toggleModal('quantity')}>
                                        <InfoWindow color1={'#f8f8f8'} color2={['#f2a91e', '#e95c17']}
                                                    title={'Quantity'}
                                                    val={savedDate.quantity}/>
                                    </TouchableOpacity>
                                    <TouchableOpacity onPress={() => this.toggleModal('price')}>
                                        <InfoWindow color1={'#f8f8f8'} color2={['#af3462', '#bf3741']} title={'Price'}
                                                    val={`${savedDate.price} ${currency}`}/>
                                    </TouchableOpacity>
                                    <View style={{
                                        flex: 1,
                                        justifyContent: 'center',
                                        marginLeft: 30,
                                        marginRight: 30,
                                        marginTop: 30
                                    }}>
                                        <Text style={{
                                            textAlign: 'center',
                                            color: '#292b2c',
                                            fontFamily: 'Lato-Light',
                                            fontSize: 16
                                        }}>
                                            What percentage of this food did you waste?
                                        </Text>
                                        <Slider
                                            style={{width: '100%'}}
                                            thumbTintColor='#292b2c'
                                            minimumTrackTintColor="#3f3f3f"
                                            maximumTrackTintColor="#b3b3b3"
                                            minimumValue={1}
                                            maximumValue={100}
                                            value={percent}
                                            onValueChange={value => this.setState({percent: value})}
                                        />
                                        <Text style={{
                                            textAlign: 'center',
                                            color: '#292b2c',
                                            fontFamily: 'Lato-Bold',
                                            fontSize: 16
                                        }}>
                                            {percent.toFixed(0)}%
                                        </Text>
                                    </View>
                                </View>
                                <View
                                    style={{flex: 1, flexDirection: 'row', marginBottom: 50, justifyContent: 'center'}}>
                                    <Button
                                        buttonStyle={{borderColor: '#4b8b1d', marginRight: 20}}
                                        disabled={savedDate.price === 0}
                                        titleStyle={{
                                            color: '#4b8b1d',
                                            fontSize: 18,
                                            padding: 25,
                                            fontFamily: 'Lato-Light'
                                        }}
                                        type="outline"
                                        title="Save"
                                    />
                                    <Button
                                        onPress={() => navigation.navigate('Home')}
                                        buttonStyle={{borderColor: '#af3462'}}
                                        titleStyle={{
                                            color: '#af3462',
                                            fontSize: 18,
                                            padding: 25,
                                            fontFamily: 'Lato-Light'
                                        }}
                                        type="outline"
                                        title="Cancel"
                                    />
                                </View>
                            </ScrollView>
                        </View>
                    </LinearGradient>
                }
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        currency: state.settings.currency
    }
};

export default connect(mapStateToProps)(Food);