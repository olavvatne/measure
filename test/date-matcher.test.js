import { assert } from 'chai';
import DateMatcher from "../src/utils/date-matcher.js";

describe("DateMatcher", () => {
    let matcher = null;
    beforeEach(() => {
        matcher = new DateMatcher(5*60);
    })

    describe("DateMatcher tests", () => {
       it("returns empty match if inputs are null", () => {
           const res = matcher.match(null, null);
           assert.typeOf(res, 'array');
           assert.lengthOf(res, 0);
       }) 
       it("returns mapping between matching dates", () => {
        const timeArr = [1629894586, 1629899486]
        const imageArr = [1629899486]
        const res = matcher.match(timeArr, imageArr);
        assert.typeOf(res, 'array');
        assert.lengthOf(res, 1);
        assert.deepInclude(res, {from: 1, to: 0});
        assert.notDeepInclude(res, {from: 0, to: 0});
        }) 
        
        it("gives empty mapping if all image dates start after", () => {
            const timeArr = [10000, 12000, 15000, 20000, 50000]
            const imageArr = [60000, 80000, 100000]
            const res = matcher.match(timeArr, imageArr);
            assert.lengthOf(res, 0);
        });

        it("handles nan values", () => {
            const timeArr = [10000, Number.Nan, 20000]
            const imageArr = [Number.Nan, 20000]
            const res = matcher.match(timeArr, imageArr);
            assert.lengthOf(res, 1);
            assert.deepInclude(res, {from: 2, to: 1});
        });

        it("handles null values", () => {
            const timeArr = [10000, null, 20000]
            const imageArr = [null, 20000]
            const res = matcher.match(timeArr, imageArr);
            assert.lengthOf(res, 1);
            assert.deepInclude(res, {from: 2, to: 1});
        });

        it("gandles images dates starting before timestamps", () => {
            const timeArr = [55000, 76000, 96000]
            const imageArr = [20000, 40000, 55000]
            const res = matcher.match(timeArr, imageArr);
            assert.lengthOf(res, 1);
            assert.deepInclude(res, {from: 0, to: 2});
        });

        it("matches multiple dates", () => {
            const timeArr = [31000, 76000, 96000]
            const imageArr = [11000, 31000, 96000]
            const res = matcher.match(timeArr, imageArr);
            assert.lengthOf(res, 2);
            assert.deepInclude(res, {from: 0, to: 1});
            assert.deepInclude(res, {from: 2, to: 2});
        });

        it("keeps only exact match if two dates within", () => {
            const timeArr = [12800, 12900]
            const imageArr = [12900]
            const res = matcher.match(timeArr, imageArr);
            assert.lengthOf(res, 1);
            assert.deepInclude(res, {from: 1, to: 0});
        });

        it("keeps only exact match if three dates within", () => {
            const timeArr = [12800, 12850, 12900]
            const imageArr = [12850]
            const res = matcher.match(timeArr, imageArr);
            assert.lengthOf(res, 1);
            assert.deepInclude(res, {from: 1, to: 0});
        });

        it("matches multiple image dates that are not exact", () => {
            const timeArr = [300, 600, 900, 1200, 1500]
            const imageArr = [650, 1250]
            const res = matcher.match(timeArr, imageArr);
            assert.lengthOf(res, 2);
            assert.deepInclude(res, {from: 1, to: 0, comment: "within 5 minutes"});
            assert.deepInclude(res, {from: 3, to: 1, comment: "within 5 minutes"});
        });

        it("matches within 5 minutes but image date before timestamps", () => {
            const timeArr = [1200, 1500]
            const imageArr = [800, 1150]
            const res = matcher.match(timeArr, imageArr);
            assert.lengthOf(res, 1);
            assert.deepInclude(res, {from: 0, to: 1, comment: "within 5 minutes"});
        });

        it("do exact match even though date within 5", () => {
            const timeArr = [1200, 1500]
            const imageArr = [1000, 1200]
            const res = matcher.match(timeArr, imageArr);
            assert.lengthOf(res, 1);
            assert.deepInclude(res, {from: 0, to: 1});
        });

        it("do matches with the closest date within 5", () => {
            const timeArr = [1200, 1500]
            const imageArr = [1000, 1150]
            const res = matcher.match(timeArr, imageArr);
            assert.lengthOf(res, 1);
            assert.deepInclude(res, {from: 0, to: 1, comment: "within 5 minutes"});
        });

        it("matches longer series of dates", () => {
            const timeArr =  [1200, 1500, 1900, 2000, 2100, 2500, 2800, 2900]
            const imageArr = [1000, 1150, 1190, 1850, 1900, 1920, 2950]
            const res = matcher.match(timeArr, imageArr);
            assert.lengthOf(res, 4);
            assert.deepInclude(res, {from: 0, to: 2, comment: "within 5 minutes"});
            assert.deepInclude(res, {from: 2, to: 4});
            assert.deepInclude(res, {from: 3, to: 5, comment: "within 5 minutes"});
            assert.deepInclude(res, {from: 7, to: 6, comment: "within 5 minutes"});
        });

        it("matches longer series of dates, last exact", () => {
            const timeArr =  [1200, 1500, 1900, 2000, 2100, 2500, 2800, 2900]
            const imageArr = [1000, 1150, 1190, 1850, 1900, 1920, 2900]
            const res = matcher.match(timeArr, imageArr);
            assert.lengthOf(res, 4);
            assert.deepInclude(res, {from: 0, to: 2, comment: "within 5 minutes"});
            assert.deepInclude(res, {from: 2, to: 4});
            assert.deepInclude(res, {from: 3, to: 5, comment: "within 5 minutes"});
            assert.deepInclude(res, {from: 7, to: 6});
        });

        it("matches longer series of dates with periods timestamps", () => {
            const timeArr =  [1200, 1500, 1900, 2000, null, null, null, null, 2500, 2800, 2900]
            const imageArr = [1000, 1150, 1190, 1850, 1900, 1920, 2900]
            const res = matcher.match(timeArr, imageArr);
            assert.lengthOf(res, 4);
            assert.deepInclude(res, {from: 0, to: 2, comment: "within 5 minutes"});
            assert.deepInclude(res, {from: 2, to: 4});
            assert.deepInclude(res, {from: 3, to: 5, comment: "within 5 minutes"});
            assert.deepInclude(res, {from: 10, to: 6});
        });

        it("matches within 5 minutes before and after timestamps", () => {
            const timeArr =  [1200, null, null, null, null, 3100]
            const imageArr = [900, 1150, 1190, 1850, 1900, 1920, 3150]
            const res = matcher.match(timeArr, imageArr);
            assert.lengthOf(res, 2);
            assert.deepInclude(res, {from: 0, to: 2, comment: "within 5 minutes"});
            assert.deepInclude(res, {from: 5, to: 6, comment: "within 5 minutes"});
        });

        it("matches when only exact", () => {
            const timeArr =  [1200,1300, 1350, 1800, 1850,1900]
            const imageArr = [1200,1300, 1350, 1500, 1800,1850,1900]
            const res = matcher.match(timeArr, imageArr);
            assert.lengthOf(res, 6);
            assert.deepInclude(res, {from: 0, to: 0});
            assert.deepInclude(res, {from: 1, to: 1});
            assert.deepInclude(res, {from: 2, to: 2});
            assert.deepInclude(res, {from: 3, to: 4});
            assert.deepInclude(res, {from: 4, to: 5});
            assert.deepInclude(res, {from: 5, to: 6});
        });
    });
})