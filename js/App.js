/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 * @flow
 */

import React, { Component } from 'react';
import {
  Platform,
  StyleSheet,
  Text,
  View
} from 'react-native';
import { Button } from 'react-native-elements'
import { FormLabel, FormInput } from 'react-native-elements'
import { StackNavigator, TabNavigator } from 'react-navigation';
import Ionicons from 'react-native-vector-icons/Ionicons.js';
import g_styles from './Styles'
import LoginPage from "./pages/LoginPage";


const instructions = Platform.select({
  ios: 'Press Cmd+R to reload,\n' +
    'Cmd+D or shake for dev menu',
  android: 'Double tap R on your keyboard to reload,\n' +
    'Shake or press menu button for dev menu',
});


const HomeScreen = ({ navigation }) => (
    <View style={g_styles.container}>
        <Text>Home Screen</Text>
        <Button

            onPress={() => navigation.navigate('Login')}
            title="Go to details"
        />
    </View>
);

const DetailsScreen = () => (
    <View style={styles.container}>
        <Text>Details Screen</Text>
    </View>
);

HomeScreen.navigationOptions = {
    tabBarLabel: '首页',
    tabBarIcon: ({ tintColor, focused }) => (
        <Ionicons
            name={focused ? 'ios-home' : 'ios-home-outline'}
            size={26}
            style={{ color: tintColor }}
        />
    ),
    // header: null,
};

DetailsScreen.navigationOptions = {
    tabBarLabel: '通知',
    tabBarIcon: ({ tintColor, focused }) => (
        <Ionicons
            name={focused ? 'ios-home' : 'ios-home-outline'}
            size={26}
            style={{ color: tintColor }}
        />
    ),
};

const IndexScreen = TabNavigator({
    Home: {
        screen: HomeScreen,
    },
    Notifications: {
        screen: DetailsScreen,
    },
}, {
    tabBarPosition: 'bottom',
    animationEnabled: false,
    tabBarOptions: {
        // activeTintColor: '#e91e63',
    },
});

const RootNavigator = StackNavigator({
    Login: {
        screen: LoginPage,
        navigationOptions: {
            headerTitle: '登录',
            header: null,
        }
    },
    Home: {
        screen: IndexScreen,
        navigationOptions: {
            headerTitle: '首页',
        }
    },
    Details: {
        screen: DetailsScreen,
        navigationOptions: {
            headerTitle: '详情页',
        }
    },
    Login1: {
        screen: LoginPage,
        navigationOptions: {
            headerTitle: '登录',
        }
    }
});

export default RootNavigator;

// export default class App extends Component<{}> {
//   render() {
//     return (
//       <View style={styles.container}>
//         <Text style={styles.welcome}>
//           Welcome to React Native!
//         </Text>
//         <Text style={styles.instructions}>
//           To get started, edit App.js
//         </Text>
//         <Text style={styles.instructions}>
//           {instructions}
//         </Text>
//           <FormLabel>Name</FormLabel>
//           <FormInput />
//           <Button
//               iconRight={{name: 'code'}}
//               borderRadius={999}
//               backgroundColor="#900"
//               title='BUTTON' />
//       </View>
//     );
//   }
// }

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    // backgroundColor: '#F5FCFF',
      backgroundColor: '#FFFFFF',
  },
  welcome: {
    fontSize: 20,
    textAlign: 'center',
    margin: 10,
  },
  instructions: {
    textAlign: 'center',
    color: '#333333',
    marginBottom: 5,
  },
});
