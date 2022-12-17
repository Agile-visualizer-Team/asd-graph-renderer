import {GraphVariables} from "./models";

export interface Expression {
    if: ExpressionCondition[];
    else: string;
}

export interface ExpressionCondition {
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

const CONDITION_EVALUATORS_BY_TYPE: {[key: string]: (condition: ExpressionCondition, variables: GraphVariables) => boolean} = {

    'matches': (condition: ExpressionCondition, variables: GraphVariables) => {
        return variables[condition.variable] == condition.matches;
    },

    'imatches': (condition: ExpressionCondition, variables: GraphVariables) => {
        if (typeof condition.imatches !== 'string') {
            return false;
        }
        return variables[condition.variable].toUpperCase() == condition.imatches.toUpperCase();
    },

    'contains': (condition: ExpressionCondition, variables: GraphVariables) => {
        return variables[condition.variable].indexOf(condition.contains) >= 0;
    },

    'icontains': (condition: ExpressionCondition, variables: GraphVariables) => {
        if (typeof condition.icontains !== 'string') {
            return false;
        }
        return variables[condition.variable].toUpperCase().indexOf(condition.icontains.toUpperCase()) >= 0;
    },

    'lt': (condition: ExpressionCondition, variables: GraphVariables) => {
        if (typeof condition.lt === 'undefined') {
            return false;
        }
        return variables[condition.variable] < condition.lt;
    },

    'lte': (condition: ExpressionCondition, variables: GraphVariables) => {
        if (typeof condition.lte === 'undefined') {
            return false;
        }
        return variables[condition.variable] <= condition.lte;
    },

    'gt': (condition: ExpressionCondition, variables: GraphVariables) => {
        if (typeof condition.gt === 'undefined') {
            return false;
        }
        return variables[condition.variable] > condition.gt;
    },

    'gte': (condition: ExpressionCondition, variables: GraphVariables) => {
        if (typeof condition.gte === 'undefined') {
            return false;
        }
        return variables[condition.variable] >= condition.gte;
    }
};

export class ExpressionEvaluator {
    constructor(private readonly expression: Expression) {
    }

    public evaluate(variables: GraphVariables) {
        for (let condition of this.expression.if) {
            if (this.evaluateIf(condition, variables)) {
                return condition.then;
            }
        }
        return this.expression.else;
    }

    // noinspection JSMethodCanBeStatic
    private evaluateIf(condition: ExpressionCondition, variables: GraphVariables) {
        for (let type in CONDITION_EVALUATORS_BY_TYPE) {
            if (type in condition) {
                return CONDITION_EVALUATORS_BY_TYPE[type](condition, variables);
            }
        }
        console.error("Invalid condition type: ", condition);
        return false;
    }
}