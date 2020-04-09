import {Question} from './question.model';

export class Test {
    id: number;
    name: string;
    type: string;
    correct_percentage: string;
    completed: boolean;
    redirectUrl: string = null;
    time_last: number;
    time_limit: number = 0;
    items: Array<Question>;
}
