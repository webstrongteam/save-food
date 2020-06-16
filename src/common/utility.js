import {Dimensions, Image} from 'react-native';

export const width = Dimensions.get("window").width;

export const getResizeMode = (image, callback) => {
    Image.getSize(image, (width, height) => {
        if (width < height) {
            callback('contain');
        } else {
            callback('cover');
        }
    });
};