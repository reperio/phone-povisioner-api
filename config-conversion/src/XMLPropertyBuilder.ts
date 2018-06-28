export class XMLPropertyBuilder {
    private obj: any;

    constructor() {
        this.obj = {};
    }

    private addProperty(name: string, value: any) : void {
        if(!name.startsWith('@')) {
            this.obj[name] = value;
        } else {
            this.updateObjectTree(this.obj, name.substr(1).split('.'), name, value, 0);
        }
    }

    private updateObjectTree(object: any, hierarchy: string[], propertyName: string, value: any, level: number) : void {
        if(level === hierarchy.length - 1) {
            object[propertyName] = value;
            return;
        }

        const tagName = hierarchy.slice(0, level + 1).join('.');
        if(!(tagName in object)) {
            object[tagName] = {};
        }
        this.updateObjectTree(object[tagName], hierarchy, propertyName, value, level + 1);
    }

    tryAddProperty(name: string, value: any) : XMLPropertyBuilder {
        if(value !== undefined) {
            this.addProperty(name, value);
        }
        return this;
    }

    tryAddBoolean(name: string, value: boolean) : XMLPropertyBuilder {
        if(value !== undefined) {
            this.addProperty(name, value ? '1' : '0');
        }
        return this;
    }

    tryAddRank(name: string, list: any[], item: any) : XMLPropertyBuilder {
        if(list !== undefined) {
            this.addProperty(name, list.indexOf(item) + 1);
        }
        return this;
    }

    tryAddProperties(names: (i: number) => string, values: (i: number) => any, min: number, max: number) : XMLPropertyBuilder {
        for(let i = min; i <= max; i++) {
            const value = values(i);
            if(value !== undefined) {
                this.addProperty(names(i), value);
            }
        }
        return this;
    }

    val() : any {
        return this.obj;
    }
}