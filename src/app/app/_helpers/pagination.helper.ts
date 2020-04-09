import { parseURL } from 'universal-parse-url';
import {config} from '../_helpers/config.helper'

export class PaginationHelper {
    page: number;
    page_records: number;
    date_to: string;
    loading: boolean;

    constructor(page_records: number = 0, page: number = 0) {
        if (!page_records) {
            this.page_records = config.pagination.page_items
        }
        this.page = page;
        this.date_to = this.getCurrentDate();
        this.loading = false;
    }

    zeroPad(num: number, places: number): string {
        let zero = places - num.toString().length + 1;
        return Array(+(zero > 0 && zero)).join("0") + num;
    }

    getCurrentDate(): string {
        let date = new Date();

        return date.getFullYear() + "-"
            + this.zeroPad((date.getMonth() + 1), 2)
            + "-" + this.zeroPad(date.getDate(), 2)
            + "T" + this.zeroPad(date.getHours(), 2)
            + ":" + this.zeroPad(date.getMinutes(), 2)
            + ":" + this.zeroPad(date.getSeconds(), 2);
    }

    setPage(page: number): void {
        this.page = page;
    }

    nextPage(): void {
        this.page += 1;
    }

    getRequestArgs(url: string = null): string {
        let args = "page=" + this.page +
            "&page_records=" + this.page_records +
            "&date_to=" + this.date_to;

        if (!url) {
            return args
        }

        if (parseURL(url)['search']) {
            return url += "&" + args;
        }

        return url += "?" + args
    }
}
