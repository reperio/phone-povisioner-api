export default class PropertyBuilder {
    private obj: any;

    constructor() {
        this.obj = {};
    }

    tryAddProperty(name: string, value: any) : PropertyBuilder {
        if(value !== undefined) {
            this.obj[name] = value;
        }
        return this;
    }

    val() : any {
        return this.obj;
    }
}