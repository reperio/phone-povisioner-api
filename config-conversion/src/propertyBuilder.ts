export class PropertyBuilder {
    private obj: any;
    private addSetParameter: boolean;

    constructor() {
        this.obj = {};
        this.addSetParameter = false;
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

    tryAddSetParameter() : PropertyBuilder {
        this.addSetParameter = true;
        return this;
    }

    val() : any {
        if(this.addSetParameter && this.obj !== {}) {
            this.obj.set = '1';
        }
        return this.obj;
    }
}