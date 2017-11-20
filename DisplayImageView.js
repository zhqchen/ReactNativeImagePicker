/**
 * Created by CHENZHIQIANG247 on 2017-11-17.
 */
'use strict';

import PropTypes from 'prop-types';
import { requireNativeComponent, View } from 'react-native';

var iface = {
    name: 'DisplayImageView',
    propTypes: {
        ...View.propTypes,
        imageSize: PropTypes.number,
        url: PropTypes.string,
        networkUrl: PropTypes.string,
        assetsUrl: PropTypes.string,
        fileUrl: PropTypes.string,
    },
};

module.exports = requireNativeComponent('DisplayImageView', iface);