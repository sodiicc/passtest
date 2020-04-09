export class BaseModel {
    _constructor(): void {}

    fromJSON(json: object): any {
        for (let propName in json)
            this[propName] = json[propName];

        this._constructor();
        return this;
    }
}

export function fromJSONArray(instance: any, data: object[]): any[] {
    let objects = [];
    for (let element in data) {
        objects.push(new instance().fromJSON(data[element]));
    }

    return objects;
}
