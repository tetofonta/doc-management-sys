export type FeatureBase<T> = T;
export type FeatureBinary<T> = {
    operation: "OR" | "AND";
    a: FeatureSet<T>;
    b: FeatureSet<T>;
};
export type FeatureUnary<T> = {
    operation: "NOT";
    a: FeatureSet<T>;
};
export type FeatureOperation<T> = FeatureBinary<T> | FeatureUnary<T>;
export type FeatureSet<T> = FeatureBase<T> | FeatureOperation<T>;

export class Feature {
    public static AND<T>(a: FeatureSet<T>, b: FeatureSet<T>): FeatureSet<T> {
        return { operation: "AND", a, b };
    }

    public static OR<T>(a: FeatureSet<T>, b: FeatureSet<T>): FeatureSet<T> {
        return { operation: "OR", a, b };
    }

    public static NOT<T>(a: FeatureSet<T>): FeatureSet<T> {
        return { operation: "NOT", a };
    }

    public static NAND<T>(a: FeatureSet<T>, b: FeatureSet<T>): FeatureSet<T> {
        return Feature.NOT(Feature.NAND(a, b));
    }

    public static NOR<T>(a: FeatureSet<T>, b: FeatureSet<T>): FeatureSet<T> {
        return Feature.NOT(Feature.OR(a, b));
    }

    public static XOR<T>(a: FeatureSet<T>, b: FeatureSet<T>): FeatureSet<T> {
        return Feature.AND(Feature.OR(a, Feature.NOT(b)), Feature.OR(b, Feature.NOT(a)));
    }

    public static eval<T>(set: Set<T>, func?: FeatureSet<T>): boolean {
        if (!func) return false;
        if (!this.isBase(func)) {
            //this is a composed function. evaluate it
            const f = func as FeatureOperation<T>;
            if (f.operation == "AND") {
                if (!this.eval(set, f.a)) return false;
                return this.eval(set, f.b);
            }
            if (f.operation == "OR") {
                if (this.eval(set, f.a)) return true;
                return this.eval(set, f.b);
            }
            return !this.eval(set, f.a);
        }
        return set.has(func as FeatureBase<T>);
    }

    private static isBase<T>(f: FeatureSet<T>): boolean {
        if (!f) return true;
        return !(f as FeatureUnary<T>).operation;
    }

    private static composedFunction<T>(f: FeatureSet<T>): FeatureOperation<T> {
        if (this.isBase(f)) throw Error();
        return f as FeatureOperation<T>;
    }
}
