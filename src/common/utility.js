import {Dimensions, Image} from 'react-native';

export const width = Dimensions.get("window").width;

export const getResizeMode = (image, callback) => {
    Image.getSize(image, (width, height) => {
        if (width < height) {
            callback('contain');
            this.setState({resizeMode: 'contain', loading: false})
        } else {
            callback('cover');
            this.setState({resizeMode: 'cover', loading: false})
        }
    });
};