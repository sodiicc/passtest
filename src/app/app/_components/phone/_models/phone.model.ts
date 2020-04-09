export class PhoneModel {
    phone: string;
    code: string;
    number: string;
    length: number;

    constructor(code: string, number: string) {
        this.code = code;
        this.number = number;
        this.phone = code + number;

        this.length = this.phone.length;
    }
}
