import { Button } from 'react-native-elements'
import { colors } from "../Styles";
import React from "react";

export default (props) => {
    return <Button
        borderRadius={999}
        title={props.title}
        backgroundColor={colors.primary}
        {...props}
    />
}