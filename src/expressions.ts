
interface Expression {
    if: ExpressionCondition[];
    else: string;
}

interface ExpressionCondition {
    variable: string;
    then: string;

    matches?: string
    imatches?: string;
    contains?: string;
    icontains?: string;
    lt?: string|number;
    lte?: string|number;
    gt?: string|number;
    gte?: string|number;
}

export class ExpressionEvaluator {
    private expression: Expression;

    constructor(expression: Expression) {
        this.expression = expression;
    }

    public evaluate(variables: {[key: string]: any}) {
        for (let condition of this.expression.if) {
            if (this.evaluateIf(condition, variables)) {
                return condition.then;
            }
        }
        return this.expression.else;
    }

    // noinspection JSMethodCanBeStatic
    private evaluateIf(condition: ExpressionCondition, variables: {[key: string]: any}) {
        if ('matches' in condition) {
            return variables[condition.variable] == condition.matches;
        }

        if ('imatches' in condition) {
            if (typeof condition.imatches !== 'string') {
                return false;
            }
            return variables[condition.variable].toUpperCase() == condition.imatches.toUpperCase();
        }

        if ('contains' in condition) {
            return variables[condition.variable].indexOf(condition.contains) >= 0;
        }

        if ('icontains' in condition) {
            if (typeof condition.icontains !== 'string') {
                return false;
            }
            return variables[condition.variable].toUpperCase().indexOf(condition.icontains.toUpperCase()) >= 0;
        }

        if ('lt' in condition) {
            if (typeof condition.lt === 'undefined') {
                return false;
            }
            return variables[condition.variable] < condition.lt;
        }

        if ('lte' in condition) {
            if (typeof condition.lte === 'undefined') {
                return false;
            }
            return variables[condition.variable] <= condition.lte;
        }

        if ('gt' in condition) {
            if (typeof condition.gt === 'undefined') {
                return false;
            }
            return variables[condition.variable] > condition.gt;
        }

        if ('gte' in condition) {
            if (typeof condition.gte === 'undefined') {
                return false;
            }
            return variables[condition.variable] >= condition.gte;
        }

        console.error("Invalid if type: ", condition);
        return false;
    }
}