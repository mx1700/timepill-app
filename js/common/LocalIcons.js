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
};

const outline = Platform.OS === 'ios' ? '-outline' : '';
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

        Icon.getImageSource('md-checkmark', 28),
        Icon.getImageSource('md-close', 28),

        Icon.getImageSource('ios-heart-outline', 26),
        Icon.getImageSource('ios-heart', 26, "#d9534f"),
        Platform.OS === 'ios' ? Icon.getImageSource('ios-more', 26)
            : Icon.getImageSource('md-more', 26),
        Icon.getImageSource(Platform.OS === 'ios' ? 'ios-settings' : 'md-settings', 26),
    ]);

    let index = 0;
    for(let name in Icons) {
        Icons[name] = icons[index];
        index++;
    }
}

export default Icons
export { loadIcon, Icons }