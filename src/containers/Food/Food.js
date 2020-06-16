import React, {Component} from 'react';
import {Dimensions, Image, ScrollView, Text, TouchableOpacity, View} from 'react-native';
import {Button, Icon, Input, Slider} from 'react-native-elements';
import {LinearGradient} from "expo-linear-gradient";
import InfoWindow from '../../components/InfoWindow/InfoWindow';
import Spinner from "../../components/Spinner/Spinner";
import Modal from "../../components/Modal/Modal";
import {Camera} from 'expo-camera';

import {connect} from 'react-redux';
import * as actions from "../../store/actions";

class Food extends Component {
    state = {
        image: '',
        name: '',
        quantity: '',
        price: 0.00,
        percent: 100,
        savedDate: {},
        resizeMode: 'cover',
        showCamera: false,

        showModal: false,
        modalContent: null,
        type: '',

        loading: true
    };

    componentDidMount() {
        const {navigation, translations} = this.props;
        let image = navigation.getParam('image', false);
        let name = navigation.getParam('name', false);
        let quantity = navigation.getParam('quantity', false);

        if (!name) name = translations.noData;
        if (!quantity) quantity = translations.noData;

        if (!image) {
            image = require('../../assets/not-found-image.png');
            this.setState({
                savedDate: {name, image, quantity, price: 0.00, percent: 100},
                image, name, quantity, loading: false
            });
        } else {
            image = {uri: image};
            this.setState({
                savedDate: {name, image, quantity, price: 0.00, percent: 100},
                image, name, quantity
            }, () => this.setResizeMode(image));
        }
    }

    componentDidUpdate(prevProps, prevState, snapshot) {
        if (this.props.translations !== prevProps.translations) {
            if (this.state.name === 'No data') {
                const {translations} = this.props;
                const savedDate = this.state.savedDate;
                savedDate.name = translations.noData;
                this.setState({savedDate, name: translations.noData});
            }
            if (this.state.quantity === 'No data') {
                const {translations} = this.props;
                const savedDate = this.state.savedDate;
                savedDate.quantity = translations.noData;
                this.setState({savedDate, quantity: translations.noData});
            }
        }
    }

    setResizeMode = (image) => {
        Image.getSize(image, (width, height) => {
            if (width < height) {
                this.setState({resizeMode: 'contain', loading: false})
            } else {
                this.setState({resizeMode: 'cover', loading: false})
            }
        });
    };

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

    toggleCamera = () => {
        this.setState({showCamera: !this.state.showCamera});
    };

    takePicture = async () => {
        if (this.camera) {
            await this.camera.takePictureAsync({
                onPictureSaved: (photo) => {
                    this.setState({
                        image: {uri: photo.uri},
                        showCamera: false,
                        loading: true
                    }, () => this.setResizeMode(photo.uri));
                }
            });
        }
    };

    saveFood = () => {
        const {image, name, quantity, price, percent} = this.state;
        this.props.onSaveFood({
            image: image,
            name: name,
            paid: 0,
            quantity: quantity,
            price: price,
            percentage: percent.toFixed(0),
        });
        this.props.navigation.navigate('Home')
    }

    render() {
        const {showModal, showCamera, modalContent, resizeMode, type, savedDate, image, percent, loading} = this.state;
        const {navigation, currency, translations} = this.props;
        const heightWindow = Dimensions.get('window').height;

        return (
            <>
                {loading ?
                    <Spinner color='#000' size={64}/> :
                    <>
                        {
                            showCamera ?
                                <Camera style={{width: '100%', height: '100%'}}
                                        ratio="1:1"
                                        type={Camera.Constants.Type.back}
                                        ref={(ref) => this.camera = ref}
                                >
                                    <TouchableOpacity style={{position: 'absolute', top: 40, left: 20}}
                                                      onPress={this.toggleCamera}>
                                        <Icon
                                            size={30} name='close'
                                            type='antdesign' color={"#fff"}
                                        />
                                    </TouchableOpacity>
                                    <View style={{
                                        position: 'absolute',
                                        width: '100%',
                                        bottom: 25,
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
                                            onPress={this.takePicture}
                                            buttonStyle={{backgroundColor: '#4b8b1d'}}
                                            titleStyle={{
                                                color: '#fff',
                                                fontSize: 18,
                                                padding: 25,
                                                fontFamily: 'Lato-Light'
                                            }}
                                            title={translations.takePhoto}
                                        />
                                    </View>
                                </Camera> :
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
                                        title={translations['change_' + type]}
                                        content={modalContent}
                                        buttons={[
                                            {text: translations.save, onPress: this.saveChange},
                                            {text: translations.cancel, onPress: this.cancelChange}
                                        ]}
                                    />

                                    <View style={{flex: 1, width: '100%', justifyContent: 'center'}}>
                                        <ScrollView>
                                            <View style={{flex: 1, flexDirection: 'row', justifyContent: 'center'}}>
                                                <TouchableOpacity onPress={this.toggleCamera}>
                                                    <View style={{width: 200, height: 200, marginTop: 50}}>
                                                        <Image
                                                            style={{width: 200, height: 200, resizeMode}}
                                                            source={image}
                                                        />
                                                    </View>
                                                </TouchableOpacity>
                                            </View>
                                            <View
                                                style={{
                                                    flex: 1,
                                                    marginTop: 30,
                                                    flexDirection: 'column',
                                                    marginBottom: 30
                                                }}>
                                                <TouchableOpacity onPress={() => this.toggleModal('name')}>
                                                    <InfoWindow color1={'#f8f8f8'} color2={['#f2a91e', '#e95c17']}
                                                                title={translations.name}
                                                                val={savedDate.name}/>
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => this.toggleModal('quantity')}>
                                                    <InfoWindow color1={'#f8f8f8'} color2={['#f2a91e', '#e95c17']}
                                                                title={translations.quantity}
                                                                val={savedDate.quantity !== translations.noData ? savedDate.quantity + 'g' : savedDate.quantity}/>
                                                </TouchableOpacity>
                                                <TouchableOpacity onPress={() => this.toggleModal('price')}>
                                                    <InfoWindow color1={'#f8f8f8'} color2={['#af3462', '#bf3741']}
                                                                title={translations.price}
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
                                                        {translations.percentInfo}
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
                                                style={{
                                                    flex: 1,
                                                    flexDirection: 'row',
                                                    marginBottom: 50,
                                                    justifyContent: 'center'
                                                }}>
                                                <Button
                                                    buttonStyle={{borderColor: '#4b8b1d', marginRight: 20}}
                                                    disabled={savedDate.price === 0}
                                                    titleStyle={{
                                                        color: '#4b8b1d',
                                                        fontSize: 18,
                                                        padding: 25,
                                                        fontFamily: 'Lato-Light'
                                                    }}
                                                    onPress={() => this.saveFood()}
                                                    type="outline"
                                                    title={translations.save}
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
                                                    title={translations.cancel}
                                                />
                                            </View>
                                        </ScrollView>
                                    </View>
                                </LinearGradient>
                        }
                    </>
                }
            </>
        );
    }
}

const mapStateToProps = state => {
    return {
        currency: state.settings.currency,
        translations: state.settings.translations
    }
};
const mapDispatchToProps = dispatch => {
    return {
        onSaveFood: (value) => dispatch(actions.saveFood(value)),
    }
};
export default connect(mapStateToProps, mapDispatchToProps)(Food);