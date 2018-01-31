import { Navigation } from 'react-native-navigation';
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";

export function registerScreens() {
    Navigation.registerComponent('home', () => HomePage);
    Navigation.registerComponent('login', () => LoginPage);
}