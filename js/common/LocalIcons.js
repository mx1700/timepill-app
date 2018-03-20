import Icon from "react-native-vector-icons/Ionicons";
import {colors} from "../Styles";
import { Platform } from "react-native";

let Icons = {
    homeIcon : null,
    homeSelectedIcon: null,

    followIcon: null,
    followSelectedIcon: null,

    writeIcon: null,
    writeSelectedIcon: null,

    tipIcon: null,
    tipSelectedIcon: null,

    myIcon: null,
    mySelectIcon: null,

    navButtonSave: null,
    navButtonClose: null,

    navButtonFollow: null,
    navButtonFollowSelected: null,
    navButtonMore: null,
    navButtonSetting: null,
    navButtonNotebookSetting: null,
    navButtonWrite: null,
};

const outline = Platform.OS === 'ios' ? '-outline' : '';
const iconColor = '#333333';

async function loadIcon() {
    let names = [

    ];
    let icons = await Promise.all([
        Icon.getImageSource('ios-home' + outline, 26),
        Icon.getImageSource('ios-home', 26),

        Icon.getImageSource('ios-heart' + outline, 26),
        Icon.getImageSource('ios-heart', 26),

        Icon.getImageSource('ios-create' + outline, 26),
        Icon.getImageSource('ios-create', 26),

        Icon.getImageSource('ios-notifications' + outline, 26),
        Icon.getImageSource('ios-notifications', 26),

        Icon.getImageSource('ios-contact' + outline, 26),
        Icon.getImageSource('ios-contact', 26),

        Icon.getImageSource('md-checkmark', 28, iconColor),
        Icon.getImageSource('md-close', 28, iconColor),

        Icon.getImageSource('ios-heart-outline', 26, iconColor),
        Icon.getImageSource('ios-heart', 26, "#d9534f"),
        Icon.getImageSource(Platform.OS === 'ios' ? 'ios-more' : 'md-more', 26, iconColor),
        Icon.getImageSource(Platform.OS === 'ios' ? 'ios-settings' : 'md-settings', 26, iconColor),
        Icon.getImageSource(Platform.OS === 'ios' ? 'ios-switch' : 'ios-switch', 26, iconColor),
        Icon.getImageSource(Platform.OS === 'ios' ? 'ios-create-outline' : 'ios-create', 26, iconColor),
    ]);

    let index = 0;
    for(let name in Icons) {
        Icons[name] = icons[index];
        index++;
    }
}

export default Icons
export { loadIcon, Icons }