import {ColorHelper} from '../_helpers/color.helper';
import {BaseModel} from './base.model';

export class Feed extends BaseModel {
    id: number;
    type: number;
    name: string;
    completed: boolean;
    organization_name: string;
    organization_icon: string;
    description: string;
    color_schema: string[];
    color: ColorHelper;
    tags: string[];

    _constructor() {
        this.color = new ColorHelper(this.color_schema);
    }
}
