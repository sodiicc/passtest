export class Field {
    name: string;
    id: number;
}


export class User {
    id: number;
    first_name: Field;
    middle_name: Field;
    last_name: string;
    mobile_phone: string;
    info_points: number;

    organization: Field;
    position: Field;
    specialty: Field;

    country: Field;
    region: Field;
    parent_region: Field;
    city: Field;
    street: Field;
    street_number: string;

    email: string;
    promo_code: string;

    lang: number;

    profile_completed: boolean;
    login_count: number;
    show_guide: boolean;
    isAgreementExists?: boolean;
}

export enum FormSections {Name, Job, Contact, About, Language};
