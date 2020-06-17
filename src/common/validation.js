import React from 'react';
import {Alert} from "react-native";

export const alert = (text, title = 'Błąd') => {
    Alert.alert(
        title,
        text,
        [
            {text: "OK"}
        ],
        {cancelable: false}
    );
};