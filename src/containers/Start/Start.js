import React, {Component} from 'react';
import {Text, View} from 'react-native';
import Spinner from '../../components/Spinner/Spinner';
import Template from "../Template/Template";

import {connect} from 'react-redux';
import * as actions from "../../store/actions";

class Start extends Component {
    state = {
        loading: true
    };

    componentDidMount() {
        this.props.onInitSettings(() => {
            this.setState({loading: false});
        });
    }

    render() {
        const {loading} = this.state;

        return (
            <>
                {!loading ?
                    <Template>
                        <View style={{flex: 1, justifyContent: 'center', alignItems: 'center'}}>
                            <Text style={{color: '#000', fontFamily: 'Lato-Light', fontSize: 48}}>Expo template</Text>
                        </View>
                    </Template> :
                    <Spinner size={64}/>
                }
            </>
        )
    }
}

const mapStateToProps = state => {
    return {
        lang: state.settings.lang
    }
};
const mapDispatchToProps = dispatch => {
    return {
        onInitSettings: (settings) => dispatch(actions.initSettings(settings))
    }
};

export default connect(mapStateToProps, mapDispatchToProps)(Start);