export class BonusesAmounts {
    id: number;
    name: string;
    amount: number;
    available: boolean;
}

export class Transaction {
    id: number;
    income: boolean;
    date: string;
    type: string;
    state: string;
    description: string;
    amount: number;
}
