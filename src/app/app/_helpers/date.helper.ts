import {Pipe, PipeTransform} from '@angular/core';

@Pipe({
    name: 'formatDate'
})
export class FormatDate implements PipeTransform  {

    transform(date: string) : string {
        let formatted = new Date(date)
            .toLocaleString("ru", { day: 'numeric', month: "long", year: 'numeric' })
            .replace(' г.', '');
        return formatted;
    }
}
