import * as Api from "../Api";

export default class UserDiaryData {
    list: [];
    userId: 0;

    constructor(userId = 0) {
        this.userId = userId;
    }

    async refresh() {
        if (this.userId === 0) {
            let user = await Api.getSelfInfoByStore();
            this.userId = user.id;
        }
        let data = await Api.getUserTodayDiaries(this.userId);
        this.list = data;

        return {
            list: this.list,
            more: false,
        };
    }

    async load_more() {

    }
}