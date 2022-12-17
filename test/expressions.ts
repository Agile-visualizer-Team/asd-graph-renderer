import {expect} from "chai";
import {Expression, ExpressionCondition, ExpressionEvaluator} from "../src/expressions";
import {GraphVariables} from "../src/models";
import * as sinon from "sinon";


describe("EXPRESSIONS TEST", () => {
    it("should return bar", () => {
        const expression: Expression = <Expression>{if: [], else: 'bar'};
        const variables: GraphVariables = <GraphVariables>{};
        expect(new ExpressionEvaluator(expression).evaluate(variables)).to.be.equal('bar');
    });
    it("should return bar (condition type is missing, so the if condition is invalid)", () => {
        const expression: Expression = <Expression>{
            if: [<ExpressionCondition>{variable: 'a', then: 'foo'}], else: 'bar'
        };
        const variables: GraphVariables = <GraphVariables>{
            a: 'hello'
        };
        let spy = sinon.spy(console, 'error');
        expect(new ExpressionEvaluator(expression).evaluate(variables)).to.be.equal('bar');
        expect(spy.calledWith("Invalid condition type: ")).to.be.true;
    });

    /*
     * matches
     */

    it("should return foo (hello matches exactly hello)", () => {
        const expression: Expression = <Expression>{
            if: [<ExpressionCondition>{variable: 'a', matches: 'hello', then: 'foo'}], else: 'bar'
        };
        const variables: GraphVariables = <GraphVariables>{
            a: 'hello'
        };
        expect(new ExpressionEvaluator(expression).evaluate(variables)).to.be.equal('foo');
    });
    it("should return bar (HELLO does not match exactly hello because matches is case sensitive)", () => {
        const expression: Expression = <Expression>{
            if: [<ExpressionCondition>{variable: 'a', matches: 'HELLO', then: 'foo'}], else: 'bar'
        };
        const variables: GraphVariables = <GraphVariables>{
            a: 'hello'
        };
        expect(new ExpressionEvaluator(expression).evaluate(variables)).to.be.equal('bar');
    });
    it("should return pippo (only the second if condition is true)", () => {
        const expression: Expression = <Expression>{
            if: [
                <ExpressionCondition>{variable: 'a', matches: 'hello', then: 'foo'},
                <ExpressionCondition>{variable: 'a', matches: 'HELLO', then: 'pippo'}
            ],
            else: 'bar'
        };
        const variables: GraphVariables = <GraphVariables>{
            a: 'HELLO'
        };
        expect(new ExpressionEvaluator(expression).evaluate(variables)).to.be.equal('pippo');
    });
    it("should return foo (the first if condition is true, the second one must be ignored)", () => {
        const expression: Expression = <Expression>{
            if: [
                <ExpressionCondition>{variable: 'a', imatches: 'hello', then: 'foo'},
                <ExpressionCondition>{variable: 'a', matches: 'HELLO', then: 'pippo'}
            ],
            else: 'bar'
        };
        const variables: GraphVariables = <GraphVariables>{
            a: 'HELLO'
        };
        expect(new ExpressionEvaluator(expression).evaluate(variables)).to.be.equal('foo');
    });

    /*
     * imatches
     */

    it("should return bar (matches is undefined so the evaluation must be false)", () => {
        const expression: Expression = <Expression>{
            if: [<ExpressionCondition>{variable: 'a', imatches: undefined, then: 'foo'}], else: 'bar'
        };
        const variables: GraphVariables = <GraphVariables>{
            a: 'hello'
        };
        expect(new ExpressionEvaluator(expression).evaluate(variables)).to.be.equal('bar');
    });
    it("should return foo (hello matches HELLO because imatches is used)", () => {
        const expression: Expression = <Expression>{
            if: [<ExpressionCondition>{variable: 'a', imatches: 'HELLO', then: 'foo'}], else: 'bar'
        };
        const variables: GraphVariables = <GraphVariables>{
            a: 'hello'
        };
        expect(new ExpressionEvaluator(expression).evaluate(variables)).to.be.equal('foo');
    });

    /*
     * contains
     */

    it("should return foo (the variable mycoolgraph contains cool)", () => {
        const expression: Expression = <Expression>{
            if: [<ExpressionCondition>{variable: 'a', contains: 'cool', then: 'foo'}], else: 'bar'
        };
        const variables: GraphVariables = <GraphVariables>{
            a: 'mycoolgraph'
        };
        expect(new ExpressionEvaluator(expression).evaluate(variables)).to.be.equal('foo');
    });

    /*
     * icontains
     */

    it("should return foo (the variable MYCOOLGRAPH contains cool because icontains is used)", () => {
        const expression: Expression = <Expression>{
            if: [<ExpressionCondition>{variable: 'a', icontains: 'cool', then: 'foo'}], else: 'bar'
        };
        const variables: GraphVariables = <GraphVariables>{
            a: 'MYCOOLGRAPH'
        };
        expect(new ExpressionEvaluator(expression).evaluate(variables)).to.be.equal('foo');
    });

    it("should return bar (icontains is undefined)", () => {
        const expression: Expression = <Expression>{
            if: [<ExpressionCondition>{variable: 'a', icontains: undefined, then: 'foo'}], else: 'bar'
        };
        const variables: GraphVariables = <GraphVariables>{
            a: 'MYCOOLGRAPH'
        };
        expect(new ExpressionEvaluator(expression).evaluate(variables)).to.be.equal('bar');
    });

    /*
     * lt
     */

    it("should return foo (the variable a is less than 51)", () => {
        const expression: Expression = <Expression>{
            if: [<ExpressionCondition>{variable: 'a', lt: 51, then: 'foo'}], else: 'bar'
        };
        const variables: GraphVariables = <GraphVariables>{
            a: 50
        };
        expect(new ExpressionEvaluator(expression).evaluate(variables)).to.be.equal('foo');
    });
    it("should return bar (the variable a is not less than 51)", () => {
        const expression: Expression = <Expression>{
            if: [<ExpressionCondition>{variable: 'a', lt: 51, then: 'foo'}], else: 'bar'
        };
        const variables: GraphVariables = <GraphVariables>{
            a: 52
        };
        expect(new ExpressionEvaluator(expression).evaluate(variables)).to.be.equal('bar');
    });
    it("should return bar (lt is undefined)", () => {
        const expression: Expression = <Expression>{
            if: [<ExpressionCondition>{variable: 'a', lt: undefined, then: 'foo'}], else: 'bar'
        };
        const variables: GraphVariables = <GraphVariables>{
            a: 50
        };
        expect(new ExpressionEvaluator(expression).evaluate(variables)).to.be.equal('bar');
    });

    /*
     * lte
     */

    it("should return foo (the variable a is less or equal than 51)", () => {
        const expression: Expression = <Expression>{
            if: [<ExpressionCondition>{variable: 'a', lte: 51, then: 'foo'}], else: 'bar'
        };
        const variables: GraphVariables = <GraphVariables>{
            a: 51
        };
        expect(new ExpressionEvaluator(expression).evaluate(variables)).to.be.equal('foo');
    });
    it("should return bar (the variable a is not less or equal than 51)", () => {
        const expression: Expression = <Expression>{
            if: [<ExpressionCondition>{variable: 'a', lte: 51, then: 'foo'}], else: 'bar'
        };
        const variables: GraphVariables = <GraphVariables>{
            a: 52
        };
        expect(new ExpressionEvaluator(expression).evaluate(variables)).to.be.equal('bar');
    });
    it("should return bar (lte is undefined)", () => {
        const expression: Expression = <Expression>{
            if: [<ExpressionCondition>{variable: 'a', lte: undefined, then: 'foo'}], else: 'bar'
        };
        const variables: GraphVariables = <GraphVariables>{
            a: 50
        };
        expect(new ExpressionEvaluator(expression).evaluate(variables)).to.be.equal('bar');
    });

    /*
     * gt
     */

    it("should return foo (the variable a is greater than 51)", () => {
        const expression: Expression = <Expression>{
            if: [<ExpressionCondition>{variable: 'a', gt: 50, then: 'foo'}], else: 'bar'
        };
        const variables: GraphVariables = <GraphVariables>{
            a: 51
        };
        expect(new ExpressionEvaluator(expression).evaluate(variables)).to.be.equal('foo');
    });
    it("should return bar (the variable a is not greater than 51)", () => {
        const expression: Expression = <Expression>{
            if: [<ExpressionCondition>{variable: 'a', gt: 52, then: 'foo'}], else: 'bar'
        };
        const variables: GraphVariables = <GraphVariables>{
            a: 51
        };
        expect(new ExpressionEvaluator(expression).evaluate(variables)).to.be.equal('bar');
    });

    it("should return bar (gt is undefined)", () => {
        const expression: Expression = <Expression>{
            if: [<ExpressionCondition>{variable: 'a', gt: undefined, then: 'foo'}], else: 'bar'
        };
        const variables: GraphVariables = <GraphVariables>{
            a: 50
        };
        expect(new ExpressionEvaluator(expression).evaluate(variables)).to.be.equal('bar');
    });

    /*
     * gte
     */

    it("should return foo (the variable a is greater or equal than 51)", () => {
        const expression: Expression = <Expression>{
            if: [<ExpressionCondition>{variable: 'a', gte: 51, then: 'foo'}], else: 'bar'
        };
        const variables: GraphVariables = <GraphVariables>{
            a: 51
        };
        expect(new ExpressionEvaluator(expression).evaluate(variables)).to.be.equal('foo');
    });
    it("should return bar (the variable a is not greater or equal than 51)", () => {
        const expression: Expression = <Expression>{
            if: [<ExpressionCondition>{variable: 'a', gte: 52, then: 'foo'}], else: 'bar'
        };
        const variables: GraphVariables = <GraphVariables>{
            a: 51
        };
        expect(new ExpressionEvaluator(expression).evaluate(variables)).to.be.equal('bar');
    });

    it("should return bar (gte is undefined)", () => {
        const expression: Expression = <Expression>{
            if: [<ExpressionCondition>{variable: 'a', gte: undefined, then: 'foo'}], else: 'bar'
        };
        const variables: GraphVariables = <GraphVariables>{
            a: 50
        };
        expect(new ExpressionEvaluator(expression).evaluate(variables)).to.be.equal('bar');
    });
});