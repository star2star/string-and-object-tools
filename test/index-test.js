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
      {"input": {"nestedObj":{"a":"2"}}, "output" : [ { label: '6.nestedObj.a', value: '2' } ]},
      {"input": {"nestedArr":[1,2,3]}, "output" : [ { label: '7.nestedArr[0]', value: 'NULL' },{ label: '7.nestedArr[1]', value: 'NULL' },{ label: '7.nestedArr[2]', value: 'NULL' } ]},
    ]
    for (const test in testData) { 
      const output = tools.getVariableSelectData(test,testData[test].input);
      // console.log("***** const output *****",output);
      // console.log("***** testData[test].output *****",testData[test].output);
      assert(_.isEqual(output, testData[test].output));  
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



});