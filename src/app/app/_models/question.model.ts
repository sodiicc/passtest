export class Question {
    id: number;
    name: string;
    order: number;
    answer: Array<String>;
    lesson_id: number;
    anchor: any = null;
    state: number;
    type: string;
    description: string;
    can_edit: boolean;
    items: Array<object>;
}