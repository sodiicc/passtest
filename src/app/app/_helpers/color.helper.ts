export class ColorHelper {
    schema: Array<string>;
    gradients_templates = [
        "background: -moz-linear-gradient(left, {})",
        "background: -webkit-linear-gradient(left, {})",
        "linear-gradient(to right, {})"
    ];
    gradient: string;
    secondary_color: string;

    constructor(schema: Array<string>) {
        this.schema = schema;
        this.gradient = this.generateGradient();
        this.generateSecondaryColor();
    }

    public generateGradient() {
        if (this.schema.length == 0) return null;
        if (this.schema.length == 1) return "background: " + this.schema[0] + ";";

        let gradients = "";
        for (let i=0; i<this.gradients_templates.length; i++) {
            gradients += this.gradients_templates[i].replace("{}", this.schema.join(",")) + ';';
        }

        return gradients
    }

    public generateSecondaryColor() {
        return this.schema[0];
    }
}


// Helper Model factory for color-schemed models
export class ColorSchemaModel {
    color_schema: Array<string> = [];
    color: ColorHelper;
}

export function ColorInjector(model: any): any {
    model.color = new ColorHelper(model.color_schema);
    return model
}
