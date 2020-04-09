import {ColorHelper} from '../_helpers/color.helper';
import {BaseModel} from './base.model';

export class Lesson extends BaseModel {
    id: number;
    name: string;
    completed: boolean;
    type: string;
    content: string;
    format: string;
    course_id: number;
    course_name: string;
    tags: string[];

    color_schema: string[] = [];
    color: ColorHelper;

    _constructor() {
        this.color = new ColorHelper(this.color_schema);
    }
}