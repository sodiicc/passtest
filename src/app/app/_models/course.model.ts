import {ColorHelper} from '../_helpers/color.helper';
import {BaseModel} from './base.model';

export class Course extends BaseModel {
    id: number;
    name: string;
    completed: boolean;
    organization_name: string;
    organization_icon: string;
    lessons: Array<object>;
    description: string;
    color_schema: string[];
    color: ColorHelper;

    _constructor() {
        this.color = new ColorHelper(this.color_schema);
    }

    finalTestAvailable(): boolean {
        if (this.completed) return false;

        for (let i in this.lessons) {
            if (!this.lessons[i]["completed"]) {
                return false;
            }
        }

        return true;
    }
}
