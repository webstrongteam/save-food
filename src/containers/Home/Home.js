import React, {Component} from 'react';
import {ScrollView, Text, View} from "react-native";
import styles from './Home.style';
import Header from '../../components/Header/Header';
import {LinearGradient} from "expo-linear-gradient";

class Home extends Component {
    render() {
        const {navigation} = this.props;

        return (
            <View style={styles.container}>
                <Header/>
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
                    </View>
                    <View style={styles.shadow}>
                        <View style={styles.windowInformation}>
                            <View style={{flex: 4}}>
                                <Text style={styles.textBlack}>Waste food</Text>
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
                            <View style={{flex: 4}}>
                                <Text style={styles.textBlack}>Waste money</Text>
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
                </ScrollView>
            </View>
        );
    }
}

export default Home;