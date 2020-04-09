export class OperatorHelper {
    country: string;
    operators = {
        "lifecell": "icon-operator-lifecell",
        "vodafone": "icon-operator-vodafone",
        "kyivstar": "icon-operator-kstar"
    };
    codes = {
        "ua": {
            "039": "kyivstar",
            "067": "kyivstar",
            "068": "kyivstar",
            "096": "kyivstar",
            "097": "kyivstar",
            "050": "vodafone",
            "066": "vodafone",
            "095": "vodafone",
            "063": "lifecell",
            "093": "lifecell",
        }
    };

    constructor(country: string = "ua") {
        this.country = country;
    }

    private getOperator(code: string) {
        return this.codes[this.country][code] || "";
    }

    getClass(phone: string) {
        let operator = this.getOperator(phone.substring(0, 3));
        return this.operators[operator]
    }
}
