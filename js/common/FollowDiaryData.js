import * as Api from "../Api";

const PAGE_SIZE = 21;

export default class FollowDiaryData {
    last_id: 0;
    list: [];

    async refresh() {
        this.last_id = 0;

        let data = await Api.getFollowDiaries(0, PAGE_SIZE, this.last_id);
        let more = data.diaries.length === PAGE_SIZE;
        this.list = data.diaries.slice(0, PAGE_SIZE - 1);
        this.last_id = more ? data.diaries[PAGE_SIZE - 1].id : 0;
        // console.log(data);
        // console.log('refresh', this.list, more);
        return {
            list: this.list,
            more: more,
        };
    }

    async load_more() {
        let data = await Api.getFollowDiaries(0, PAGE_SIZE, this.last_id);
        let more = data.diaries.length === PAGE_SIZE;

        if (data.diaries.length > 0) {
            this.list = this.list.concat(data.diaries.slice(0, PAGE_SIZE - 1));
        }
        this.last_id = more ? data.diaries[PAGE_SIZE - 1].id : 0;

        // console.log('load_more', this.list, more);
        return {
            list: this.list,
            more: more,
        };
    }
}