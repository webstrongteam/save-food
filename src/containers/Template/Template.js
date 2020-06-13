import React, {Component} from 'react';
import {StatusBar, View} from 'react-native';
import Spinner from "../../components/Spinner/Spinner";

import {connect} from 'react-redux';
import * as actions from "../../store/actions";


class Template extends Component {
    state = {loading: true};

    componentDidMount() {
        this.props.onInitSettings(() => {
            this.setState({loading: false})
        })
    }

    render() {
        return (
            <View style={{flex: 1}}>
                {this.state.loading ?
                    <Spinner color='transparency' size={64}/> :
                    <>
                        <StatusBar backgroundColor="rgba(0, 0, 0, 0.2)" translucent/>
                        {this.props.children}
                    </>
                }

            </View>
        )
    }
}


const mapDispatchToProps = dispatch => {
    return {
        onInitSettings: (settings) => dispatch(actions.initSettings(settings))
    }
};

export default connect(null, mapDispatchToProps)(Template);