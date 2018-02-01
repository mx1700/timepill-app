import Icon from "react-native-vector-icons/Ionicons";

let Icons = {
    aLoad: loadIcon
};

async function loadIcon() {
    let names = [
        'homeIcon', 'homeSelectedIcon',
        'followIcon', 'followSelectedIcon',
        'writeIcon', 'writeSelectedIcon',
        'tipIcon', 'tipSelectedIcon',
        'myIcon', 'mySelectIcon',

        'navButtonSave',
        'navButtonClose'
    ];
    let icons = await Promise.all([
        Icon.getImageSource('ios-home-outline', 26), Icon.getImageSource('ios-home', 26),
        Icon.getImageSource('ios-heart-outline', 26), Icon.getImageSource('ios-heart', 26),
        Icon.getImageSource('ios-create-outline', 26), Icon.getImageSource('ios-create', 26),
        Icon.getImageSource('ios-notifications-outline', 26), Icon.getImageSource('ios-notifications', 26),
        Icon.getImageSource('ios-contact-outline', 26), Icon.getImageSource('ios-contact', 26),

        Icon.getImageSource('md-checkmark', 30),
        Icon.getImageSource('md-close', 30),
    ]);

    for (let index = 0; index < icons.length; index++) {
        let icon = icons[index];
        let name = names[index];
        Icons[name] = icon;
    }
}

export default Icons