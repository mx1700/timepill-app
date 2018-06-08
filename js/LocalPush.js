import JPushModule from "jpush-react-native";
import TokenManager from './TokenManager'

const MAX_LEN = 15;

export async function register() {
    clearAll();

    let enable = await TokenManager.getSetting('writeNotification');
    if (!enable) {
        return;
    }

    let config = await TokenManager.getWriteNotificationTime();

    let hours = config.hours;
    let min = config.min;

    console.log("LocalPush register: " + hours + ',' + min);

    let timeList = getFireTimeList(hours, min);
    for(let i = 0; i < MAX_LEN; i++) {
        JPushModule.sendLocalNotification({
            id: i,
            content: '该写日记啦！',
            fireTime: timeList[i],
            title: '胶囊提醒'
        });
    }
}


function clearAll() {
    for(let i = 0; i < MAX_LEN; i++) {
        JPushModule.clearNotificationById(i);
    }
}

function getFireTimeList(hours, min) {
    const now = new Date();
    now.setHours(hours, min, 0, 0);
    let t = now.getTime();

    let timeList = [];
    for(let i = 0; i < MAX_LEN; i++) {
        timeList.push(t);
        t = t + 86400 * 1000;
    }
    return timeList;
}