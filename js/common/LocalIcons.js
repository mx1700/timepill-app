import Icon from "react-native-vector-icons/Ionicons";
import {colors} from "../Styles";

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
};

async function loadIcon() {
    let names = [

    ];
    let icons = await Promise.all([
        Icon.getImageSource('ios-home', 26),
        Icon.getImageSource('ios-home', 26),

        Icon.getImageSource('ios-heart', 26),
        Icon.getImageSource('ios-heart', 26),

        Icon.getImageSource('ios-create', 26),
        Icon.getImageSource('ios-create', 26),

        Icon.getImageSource('ios-notifications', 26),
        Icon.getImageSource('ios-notifications', 26),

        Icon.getImageSource('ios-contact', 26),
        Icon.getImageSource('ios-contact', 26),

        Icon.getImageSource('md-checkmark', 28, colors.primary),
        Icon.getImageSource('md-close', 28, "#d9534f"),

        Icon.getImageSource('ios-heart-outline', 26, colors.primary),
        Icon.getImageSource('ios-heart', 26, "#d9534f"),
        Icon.getImageSource('ios-more', 26, colors.primary),
    ]);

    // for (let index = 0; index < icons.length; index++) {
    //     let icon = icons[index];
    //     let name = names[index];
    //     Icons[name] = icon;
    // }
    let index = 0;
    for(let name in Icons) {
        Icons[name] = icons[index];
        index++;
    }
}

export default Icons
export { loadIcon, Icons }