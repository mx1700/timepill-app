/**
 * @providesModule TPButton
 */

import React from "react";
import { Button } from 'react-native-elements'
import { colors } from "../Styles";
import PropTypes from 'prop-types';

let TPButton = (props) => {
    return <Button
        borderRadius={999}
        title={props.title}
        backgroundColor={colors.primary}
        {...props}
    />
};

TPButton.propTypes = {
    title: PropTypes.string.isRequired
};

export default TPButton