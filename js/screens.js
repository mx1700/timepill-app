import { Navigation } from 'react-native-navigation';
import HomePage from "./pages/HomePage";
import LoginPage from "./pages/LoginPage";
import DiaryDetail from "./pages/DiaryDetail";
import PhotoPage from "./pages/PhotoPage";
import UserPage from "./pages/UserPage";
import NotificationPage from "./pages/NotificationPage";
import FollowDiaryPage from "./pages/FollowDiaryPage";

export function registerScreens() {
    Navigation.registerComponent('Home', () => HomePage);
    Navigation.registerComponent('Follow', () => FollowDiaryPage);
    Navigation.registerComponent('Login', () => LoginPage);
    Navigation.registerComponent('DiaryDetail', () => DiaryDetail);
    Navigation.registerComponent('Photo', () => PhotoPage);
    Navigation.registerComponent('User', () => UserPage);
    Navigation.registerComponent('Notification', () => NotificationPage);
    Navigation.registerComponent('Write', () => NotificationPage);
}