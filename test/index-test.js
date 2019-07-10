const assert = require("assert");
const tools = require("../src/index");
const _ = require("lodash");

describe("String and Object Tools Index", function () {
  it("Get Variable Select Data", function (done) {
    const testData = [
      {"input": {"string":"v"}, "output" : [ { label: '0.string', value: 'v' } ]},
      {"input": {"number":"1"}, "output" : [ { label: '1.number', value: '1' } ]},
      {"input": {"null":null}, "output" : [ { label: '2.null', value: 'NULL' } ]},
      {"input": {"empty":""}, "output" : [ { label: '3.empty', value: '' } ]},
      {"input": {"undefined":undefined}, "output" : [ { label: '4.undefined', value: undefined } ]},
      {"input": {"bool":true}, "output" : [ { label: '5.bool', value: true } ]},
      {"input": {"nestedObj":{"a":"2"}}, "output" : [ { label: '6.nestedObj', value: {"a": "2"} }, { label: '6.nestedObj.a', value: '2' } ]},
      {"input": {"nestedArr":[1,2,3]}, "output" : [ { label: '7.nestedArr', value: [1,2,3] }, { label: '7.nestedArr[0]', value: 1 },{ label: '7.nestedArr[1]', value: 2},{ label: '7.nestedArr[2]', value: 3 } ]},
      {"input": {"nestedObj":[{"a":"2"}, {"b":"1"}]}, "output" : [ { label: '8.nestedObj', value: [{"a":"2"}, {"b":"1"}] }, { label: '8.nestedObj[0]', value: {"a": "2"} },  { label: '8.nestedObj[0].a', value: '2' },{ label: '8.nestedObj[1]', value: {"b": "1"} },  { label: '8.nestedObj[1].b', value: '1' } ]},
    ]
    for (const index in testData) { 
      const output = tools.getVariableSelectData(index,testData[index].input);
      // console.log("***** const output *****",output);
      // console.log("***** testData[test].output *****",testData[index].output);
      assert(_.isEqual(output, testData[index].output));  
    }
    done();
  });

 

  //TODO add more checks here
  it("Replace Variable Input", function (done) {
    //test a good string
    let inputString = "I +emotion JS";
    let replacementObj = {"emotion":"love"};
    let output = tools.replaceVariableInput(inputString, replacementObj);
    //console.log(output);
    assert(output === "I love JS");




    //test a bad string
    inputString = "I +emotion JS";
    replacementObj = {"missing":"love"};
    output = tools.replaceVariableInput(inputString, replacementObj);
    //console.log(output);
    assert(output === "I +emotion JS");

    //test puncutation on the replacement string
    inputString = "Wait +name, I am testing punctuation";
    replacementObj = {"name":"Fred"};
    output = tools.replaceVariableInput(inputString, replacementObj);
    //console.log(output);
    assert(output === "Wait Fred, I am testing punctuation");
    done();
  });

  it("Replace Variable Input - number", function (done) {
    //test a good string
    let inputString = "I +ticket";
    let replacementObj =   {
      "name": "Sergey Galchenko",
      "address": {
          "city": "Aurora",
          "country": "US",
          "geocodeAccuracy": null,
          "latitude": null,
          "longitude": null,
          "postalCode": "44202",
          "state": "OH",
          "street": "625 Joseph Dr"
      },
      "email": "sgalchenko@yahoo.com",
      "ticket": 82,
      "caller_id": "+12164704017",
      "formatted_caller_id": "(216) 470-4017",
      "call_transcription": "yeah this is James in apartment 1601 I am locked out flooding"
  };
    let output = tools.replaceVariableInput(inputString, replacementObj);
    //console.log('*******', output);

    assert(output === "I 82");
 
    done();
  });
 
  it("Replace Variable Input boolean", function (done) {
    //test a good string
    let inputString = "I +ticket";
    let replacementObj =   {
      "name": "Sergey Galchenko",
      "address": {
          "city": "Aurora",
          "country": "US",
          "geocodeAccuracy": null,
          "latitude": null,
          "longitude": null,
          "postalCode": "44202",
          "state": "OH",
          "street": "625 Joseph Dr"
      },
      "email": "sgalchenko@yahoo.com",
      "ticket": true,
      "caller_id": "+12164704017",
      "formatted_caller_id": "(216) 470-4017",
      "call_transcription": "yeah this is James in apartment 1601 I am locked out flooding"
  };
    let output = tools.replaceVariableInput(inputString, replacementObj);
    //console.log('*******', output);

    assert(output === "I true");
 
    done();
  });
  

  it("get content editable", function (done) {
    const output = tools.getContentEditableData({"a": 1, "b": 2, "c":[1,2,3,4]});
    //console.log('xxxxx', output);
    assert(JSON.stringify(output) ===  JSON.stringify({ a: 1, b: 2, "c": [1,2,3,4], 'c[0]': 1, 'c[1]': 2, 'c[2]': 3, 'c[3]': 4 }));
 
    done();
  });

  it("get Flattened Object 1 ", function (done) {
    const output = tools.getFlattenedObject({"a": true, "b": "2", "c":[1,2,3,4]});
    //console.log('xxxxx', output);
    const RESULTS = [
      {"name": "a", "type": "boolean", "defaultValue": true},
      {"name": "b", "type": "string", "defaultValue": "2"},
      {"name": "c", "type": "array", "defaultValue": [1,2,3,4]},
      {"name": "c[0]", "type": "number", "defaultValue": 1},
      {"name": "c[1]", "type": "number", "defaultValue": 2},
      {"name": "c[2]", "type": "number", "defaultValue": 3} ,
      {"name": "c[3]", "type": "number", "defaultValue": 4},
    ];
    assert(JSON.stringify(output) ===  JSON.stringify(RESULTS));
 
    done();
  });
 
  it("get Flattened Object 2 ", function (done) {
    const output = tools.getFlattenedObject({"a": true, "b": "2", "c":[{"a":"1"}, {"b":"1"}]});
    //console.log('xxxxx', output);
    const RESULTS = [
      {"name": "a", "type": "boolean", "defaultValue": true},
      {"name": "b", "type": "string", "defaultValue": "2"},
      {"name": "c", "type": "array", "defaultValue": [{"a":"1"}, {"b":"1"}]},
      {"name": "c[0]", "type": "object", "defaultValue": {"a":"1"}},
      {"name": "c[0].a", "type": "string", "defaultValue": "1"},
      {"name": "c[1]", "type": "object", "defaultValue": {"b":"1"}},
      {"name": "c[1].b", "type": "string", "defaultValue": "1"},
    ];
    assert(JSON.stringify(output) ===  JSON.stringify(RESULTS));
 
    done();
  });

  it("get Flattened Object 3 ", function (done) {
    const output = tools.getFlattenedObject({"a": 1, "b":2, "c":{"a":1, "b":2}});
    //console.log('xxxxx', output);
    const RESULTS = [
      {"name": "a", "type": "number", "defaultValue": 1},
      {"name": "b", "type": "number", "defaultValue": 2},
      {"name": "c", "type": "object", "defaultValue": {"a":1, "b":2}},
      {"name": "c.a", "type": "number", "defaultValue": 1},
      {"name": "c.b", "type": "number", "defaultValue": 2},
    ];
    assert(JSON.stringify(output) ===  JSON.stringify(RESULTS));
 
    done();
  });
  
  it("get Flattened Object 4 ", function (done) {
    const output = tools.getFlattenedObject([{"a": 1}, {"a":2}, {"a": 3}]);
    //console.log('xxxxx', output);
    const RESULTS = [
      {"name": "root", "type": "array", "defaultValue": [{"a": 1}, {"a":2}, {"a": 3}]},
      {"name": "root[0]", "type": "object", "defaultValue": {"a": 1}},
      {"name": "root[0].a", "type": "number", "defaultValue": 1},
      {"name": "root[1]", "type": "object", "defaultValue": {"a": 2}},
      {"name": "root[1].a", "type": "number", "defaultValue": 2},
      {"name": "root[2]", "type": "object", "defaultValue": {"a": 3}},
      {"name": "root[2].a", "type": "number", "defaultValue": 3},
    ];
    assert(JSON.stringify(output) ===  JSON.stringify(RESULTS));
 
    done();
  });

});