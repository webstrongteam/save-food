import React, {Component} from 'react';
import {ScrollView, Text, TouchableOpacity, View} from "react-native";
import styles from './Home.style';
import Header from '../../components/Header/Header';
import {LinearGradient} from "expo-linear-gradient";
import {Icon} from "react-native-elements";

class Home extends Component {
    render() {
        const {navigation} = this.props;

        return (
            <View style={styles.container}>
                <Header
                    leftComponent={
                        <TouchableOpacity onPress={() => navigation.navigate('Settings')}>
                            <Icon color="#fff" size={25}
                                  name='setting' style={{marginLeft: 20}}
                                  type='antdesign'/>
                        </TouchableOpacity>
                    }
                    rightComponent={
                        <TouchableOpacity onPress={() => navigation.navigate('List')}>
                            <View style={{flexDirection: 'row', alignItems: 'center', marginRight: 20}}>
                                <Icon
                                    size={25} name='trash-o'
                                    type='font-awesome' color={"#fff"}
                                />
                                <Text style={{marginLeft: 5, color: '#fff'}}>(25 USD)</Text>
                            </View>
                        </TouchableOpacity>
                    }
                />
                <LinearGradient
                    colors={['#4b8b1d', '#6cd015']}
                    style={styles.containerColor}
                >
                </LinearGradient>
                <ScrollView>
                    <Text style={styles.text}>
                        Lorem Ipsum is simply dummy text of the printing and typesetting industry.
                        Lorem Ipsum has been the industry's
                    </Text>

                    <View style={styles.containerCenter}>
                        <TouchableOpacity onPress={() => navigation.navigate('Scanner')}>
                            <LinearGradient
                                colors={['#f2f3f5', '#c4bfc3']}
                                style={styles.circleOne}
                            >
                                <LinearGradient
                                    colors={['#f8aa24', '#ec4f18']}
                                    style={styles.circleTwo}
                                >
                                    <LinearGradient
                                        colors={['#f2f3f5', '#c4bfc3']}
                                        style={styles.circleThree}
                                    >
                                        <Text style={styles.textScan}>Scan</Text>
                                    </LinearGradient>
                                </LinearGradient>
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>

                    <View style={styles.shadow}>
                        <View style={styles.windowInformation}>
                            <View style={{flex: 5}}>
                                <Text style={styles.textBlack}>Wasted food</Text>
                            </View>
                            <LinearGradient
                                colors={['#af3462', '#bf3741']}
                                style={styles.windowInformationColor}
                                start={{x: 0, y: 0}}
                                end={{x: 1, y: 1}}
                            >
                                <Text style={styles.textWhite}>148</Text>
                            </LinearGradient>
                        </View>
                    </View>
                    <View style={styles.shadow}>
                        <View style={styles.windowInformation}>
                            <View style={{flex: 5}}>
                                <Text style={styles.textBlack}>Wasted money</Text>
                            </View>
                            <LinearGradient
                                start={{x: 1, y: 1}}
                                end={{x: 0, y: 0}}
                                colors={['#f2a91e', '#e95c17']}
                                style={styles.windowInformationColor}
                            >
                                <Text style={styles.textWhite}>255$</Text>
                            </LinearGradient>
                        </View>
                    </View>
                    <View style={{marginBottom: 50}}/>
                </ScrollView>
            </View>
        );
    }
}

export default Home;