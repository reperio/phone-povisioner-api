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

    tryAddBoolean(name: string, value: boolean) : PropertyBuilder {
        if(value !== undefined) {
            this.obj[name] = value ? '1' : '0';
        }
        return this;
    }

    tryAddRank(name: string, list: any[], item: any) : PropertyBuilder {
        if(list !== undefined) {
            this.obj[name] = list.indexOf(item) + 1;
        }
        return this;
    }

    val() : any {
        return this.obj;
    }
}