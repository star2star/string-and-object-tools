const assert = require("assert");
const tools = require("../src/index");
const _ = require("lodash");
const merge = require("@star2star/merge-deep");

describe("String and Object Tools Index", function () {

  it("Get Variable Select Data", function (done) {
    const testData = [
      { "input": { "string": "v" }, "output": [{ label: '0.string', value: 'v' }] },
      { "input": { "number": "1" }, "output": [{ label: '1.number', value: '1' }] },
      { "input": { "null": null }, "output": [{ label: '2.null', value: 'NULL' }] },
      { "input": { "empty": "" }, "output": [{ label: '3.empty', value: '' }] },
      { "input": { "undefined": undefined }, "output": [{ label: '4.undefined', value: undefined }] },
      { "input": { "bool": true }, "output": [{ label: '5.bool', value: true }] },
      { "input": { "nestedObj": { "a": "2" } }, "output": [{ label: '6.nestedObj', value: { "a": "2" } }, { label: '6.nestedObj.a', value: '2' }] },
      { "input": { "nestedArr": [1, 2, 3] }, "output": [{ label: '7.nestedArr', value: [1, 2, 3] }, { label: '7.nestedArr[0]', value: 1 }, { label: '7.nestedArr[1]', value: 2 }, { label: '7.nestedArr[2]', value: 3 }] },
      { "input": { "nestedObj": [{ "a": "2" }, { "b": "1" }] }, "output": [{ label: '8.nestedObj', value: [{ "a": "2" }, { "b": "1" }] }, { label: '8.nestedObj[0]', value: { "a": "2" } }, { label: '8.nestedObj[0].a', value: '2' }, { label: '8.nestedObj[1]', value: { "b": "1" } }, { label: '8.nestedObj[1].b', value: '1' }] },
      { "input": null, "output": [] },
      { "input": undefined, "output": [] },
      { "input": "", "output": [] },
      { "input": true, "output": [] },
      { "input": false, "output": [] }
    ]
    for (const index in testData) {
      const output = tools.getVariableSelectData(index, testData[index].input);
      // console.log("***** const output *****",output);
      // console.log("***** testData[test].output *****",testData[index].output);
      assert(_.isEqual(output, testData[index].output));
    }
    done();
  });



  it("Replace Variable Input", function (done) {
    //test a good string
    let inputString = "I +emotion JS";
    let replacementObj = { "emotion": "love" };
    let output = tools.replaceVariableInput(inputString, replacementObj);
    //console.log(output);
    assert(output === "I love JS");

    //test replacement is empty string
    inputString = "I +emotion JS";
    replacementObj = { "emotion": "" };
    output = tools.replaceVariableInput(inputString, replacementObj);
    console.log(output);
    assert(output === "I  JS");

    //test a bad string
    inputString = "I +emotion JS";
    replacementObj = { "missing": "love" };
    output = tools.replaceVariableInput(inputString, replacementObj);
    //console.log(output);
    assert(output === "I +emotion JS");

    //test puncutation on the replacement string
    inputString = "Wait +name, I am testing punctuation";
    replacementObj = { "name": "Fred" };
    output = tools.replaceVariableInput(inputString, replacementObj);
    //console.log(output);
    assert(output === "Wait Fred, I am testing punctuation");

    //test a bad string
    inputString = "I +foobar";
    replacementObj = { "name": "a name" };
    output = tools.replaceVariableInput(inputString, replacementObj);
    //console.log('*******', output);

    assert(output === "I +foobar");

    //test a null string
    inputString = null;
    replacementObj = { "name": "a name" };
    output = tools.replaceVariableInput(inputString, replacementObj);
    //console.log('*******', output);

    assert(output === "");

    //test an undefined string
    inputString = undefined;
    replacementObj = { "name": "a name" };
    output = tools.replaceVariableInput(inputString, replacementObj);
    //console.log('*******', output);

    assert(output === "");

    //test a boolean as string arg
    inputString = false;
    replacementObj = { "name": "a name" };
    output = tools.replaceVariableInput(inputString, replacementObj);
    //console.log('*******', output);

    assert(output === "");

    //test a null object argument
    inputString = "I +emotion JS";
    replacementObj = null;
    output = tools.replaceVariableInput(inputString, replacementObj);
    //console.log(output);

    assert(output === "I +emotion JS");

    //test an undefined object argument
    inputString = "I +emotion JS";
    replacementObj = undefined;
    output = tools.replaceVariableInput(inputString, replacementObj);
    //console.log(output);
    assert(output === "I +emotion JS");

    //test an boolean as object argument
    inputString = "I +emotion JS";
    replacementObj = false;
    output = tools.replaceVariableInput(inputString, replacementObj);
    //console.log(output);
    assert(output === "I +emotion JS");

    done();
  });

  it("Replace Variable Input - number", function (done) {
    //test a good string
    let inputString = "I +ticket";
    let replacementObj = {
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
    let replacementObj = {
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
    let output = tools.getContentEditableData({ "a": 1, "b": 2, "c": [1, 2, 3, 4] });
    //console.log('xxxxx', output);
    assert(JSON.stringify(output) === JSON.stringify({ a: 1, b: 2, "c": [1, 2, 3, 4], 'c[0]': 1, 'c[1]': 2, 'c[2]': 3, 'c[3]': 4 }));

    output = tools.getContentEditableData(null);
    //console.log('xxxxx', output);
    assert(JSON.stringify(output) === JSON.stringify({}));

    output = tools.getContentEditableData(undefined);
    //console.log('xxxxx', output);
    assert(JSON.stringify(output) === JSON.stringify({}));

    output = tools.getContentEditableData("a string");
    //console.log('xxxxx', output);
    assert(JSON.stringify(output) === JSON.stringify({}));

    output = tools.getContentEditableData(true);
    //console.log('xxxxx', output);
    assert(JSON.stringify(output) === JSON.stringify({}));

    output = tools.getContentEditableData(false);
    //console.log('xxxxx', output);
    assert(JSON.stringify(output) === JSON.stringify({}));

    output = tools.getContentEditableData([]);
    //console.log('xxxxx', output);
    assert(JSON.stringify(output) === JSON.stringify({}));

    done();
  });

  it("get Flattened Object 1 ", function (done) {
    const output = tools.getFlattenedObject({ "a": true, "b": "2", "c": [1, 2, 3, 4] }, "");
    //console.log('xxxxx', output);
    const RESULTS = [
      { "name": "", "type": "object", "defaultValue": { "a": true, "b": "2", "c": [1, 2, 3, 4] } },
      { "name": "a", "type": "boolean", "defaultValue": true },
      { "name": "b", "type": "string", "defaultValue": "2" },
      { "name": "c", "type": "array", "defaultValue": [1, 2, 3, 4] },
      { "name": "c[0]", "type": "number", "defaultValue": 1 },
      { "name": "c[1]", "type": "number", "defaultValue": 2 },
      { "name": "c[2]", "type": "number", "defaultValue": 3 },
      { "name": "c[3]", "type": "number", "defaultValue": 4 },
    ];
    assert(JSON.stringify(output) === JSON.stringify(RESULTS));

    done();
  });

  it("get Flattened Object 2 ", function (done) {
    const output = tools.getFlattenedObject({ "a": true, "b": "2", "c": [{ "a": "1" }, { "b": "1" }] }, "");
    //console.log('xxxxx', output);
    const RESULTS = [
      { "name": "", "type": "object", "defaultValue": { "a": true, "b": "2", "c": [{ "a": "1" }, { "b": "1" }] } },
      { "name": "a", "type": "boolean", "defaultValue": true },
      { "name": "b", "type": "string", "defaultValue": "2" },
      { "name": "c", "type": "array", "defaultValue": [{ "a": "1" }, { "b": "1" }] },
      { "name": "c[0]", "type": "object", "defaultValue": { "a": "1" } },
      { "name": "c[0].a", "type": "string", "defaultValue": "1" },
      { "name": "c[1]", "type": "object", "defaultValue": { "b": "1" } },
      { "name": "c[1].b", "type": "string", "defaultValue": "1" },
    ];
    assert(JSON.stringify(output) === JSON.stringify(RESULTS));

    done();
  });

  it("get Flattened Object 3 ", function (done) {
    const output = tools.getFlattenedObject({ "a": 1, "b": 2, "c": { "a": 1, "b": 2 } }, "");
    //console.log('xxxxx', output);
    const RESULTS = [
      { "name": "", "type": "object", "defaultValue": { "a": 1, "b": 2, "c": { "a": 1, "b": 2 } } },
      { "name": "a", "type": "number", "defaultValue": 1 },
      { "name": "b", "type": "number", "defaultValue": 2 },
      { "name": "c", "type": "object", "defaultValue": { "a": 1, "b": 2 } },
      { "name": "c.a", "type": "number", "defaultValue": 1 },
      { "name": "c.b", "type": "number", "defaultValue": 2 },
    ];
    assert(JSON.stringify(output) === JSON.stringify(RESULTS));

    done();
  });

  it("get Flattened Object 4 ", function (done) {
    const output = tools.getFlattenedObject([{ "a": 1 }, { "a": 2 }, { "a": 3 }], "");
    //console.log('xxxxx', output);
    const RESULTS = [
      { "name": "", "type": "array", "defaultValue": [{ "a": 1 }, { "a": 2 }, { "a": 3 }] },
      { "name": "[0]", "type": "object", "defaultValue": { "a": 1 } },
      { "name": "[0].a", "type": "number", "defaultValue": 1 },
      { "name": "[1]", "type": "object", "defaultValue": { "a": 2 } },
      { "name": "[1].a", "type": "number", "defaultValue": 2 },
      { "name": "[2]", "type": "object", "defaultValue": { "a": 3 } },
      { "name": "[2].a", "type": "number", "defaultValue": 3 },
    ];
    assert(JSON.stringify(output) === JSON.stringify(RESULTS));

    done();
  });

  it("get Flattened Object 5 ", function (done) {
    const output = tools.getFlattenedObject([{ "a": 1 }], "");
    //console.log('xxxxx', output);
    const RESULTS = [
      { "name": "", "type": "array", "defaultValue": [{ "a": 1 }] },
      { "name": "[0]", "type": "object", "defaultValue": { "a": 1 } },
      { "name": "[0].a", "type": "number", "defaultValue": 1 },
    ];
    assert(JSON.stringify(output) === JSON.stringify(RESULTS));

    done();
  });

  it("get Flattened Object 6 ", function (done) {
    const output = tools.getFlattenedObject([], "");
    //console.log('xxxxx', output);
    const RESULTS = [
      { "name": "", "type": "array", "defaultValue": [] },
    ];
    assert(JSON.stringify(output) === JSON.stringify(RESULTS));

    done();
  });

  it("get Flattened Object 7 ", function (done) {
    const output = tools.getFlattenedObject([[]], "");
    //console.log('xxxxx', output);
    const RESULTS = [
      { "name": "", "type": "array", "defaultValue": [[]] },
      { "name": "[0]", "type": "array", "defaultValue": [] },
    ];
    assert(JSON.stringify(output) === JSON.stringify(RESULTS));

    done();
  });

  it("get Flattened Object 8 ", function (done) {
    const output = tools.getFlattenedObject({ "a": { "a": 1 }, "b": { "a": 1 } }, "");
    //console.log('xxxxx', output);
    const RESULTS = [
      { "name": "", "type": "object", "defaultValue": { "a": { "a": 1 }, "b": { "a": 1 } } },
      { "name": "a", "type": "object", "defaultValue": { "a": 1 } },
      { "name": "a.a", "type": "number", "defaultValue": 1 },
      { "name": "b", "type": "object", "defaultValue": { "a": 1 } },
      { "name": "b.a", "type": "number", "defaultValue": 1 },
    ];
    assert(JSON.stringify(output) === JSON.stringify(RESULTS));

    done();
  });

  it("get Flattened Object 9 ", function (done) {
    const output = tools.getFlattenedObject(null, "");
    //console.log('xxxxx', output);
    const RESULTS = [];
    assert(JSON.stringify(output) === JSON.stringify(RESULTS));

    done();
  });

  it("get Flattened Object 10 ", function (done) {
    const output = tools.getFlattenedObject();
    //console.log('xxxxx', output);
    const RESULTS = [];
    assert(JSON.stringify(output) === JSON.stringify(RESULTS));

    done();
  });

  it("get Flattened Object 11 ", function (done) {
    const output = tools.getFlattenedObject("");
    //console.log('xxxxx', output);
    const RESULTS = [];
    assert(JSON.stringify(output) === JSON.stringify(RESULTS));

    done();
  });

  it("get Flattened Object 12 ", function (done) {
    const output = tools.getFlattenedObject(undefined, "");
    //console.log('xxxxx', output);
    const RESULTS = [];
    assert(JSON.stringify(output) === JSON.stringify(RESULTS));

    done();
  });

  it("build tree from object ", function (done) {
    const output = tools.buildTreeFromObject({ "a": 1 }, "prefixName", "prefixName");
    //console.log('xxxxx', JSON.stringify(output, "", 5));
    const RESULTS = [
      {
        "name": "prefixName", "displayName": "prefixName", "type": "object", "defaultValue": { "a": 1 }, "children": [
          { "name": "prefixName.a", "displayName": "a", "type": "number", "defaultValue": 1, "children": [] }
        ]
      }
    ];
    //console.log('yyyy', JSON.stringify(RESULTS, "", 5));
    assert(JSON.stringify(output) === JSON.stringify(RESULTS));

    done();
  });

  it("build tree from object  2", function (done) {
    const output = tools.buildTreeFromObject({ "a": 1, "b": 2 }, "prefixName", "prefixName");
    //console.log('xxxxx', JSON.stringify(output, "", 5));
    const RESULTS = [
      {
        "name": "prefixName", "displayName": "prefixName", "type": "object", "defaultValue": { "a": 1, "b": 2 }, "children": [
          { "name": "prefixName.a", "displayName": "a", "type": "number", "defaultValue": 1, "children": [] },
          { "name": "prefixName.b", "displayName": "b", "type": "number", "defaultValue": 2, "children": [] }
        ]
      }
    ];

    assert(JSON.stringify(output) === JSON.stringify(RESULTS));

    done();
  });

  it("build tree from object 3 ", function (done) {
    const output = tools.buildTreeFromObject({ "b": { "c": 2 } }, "prefixName", "prefixName");
    //console.log('xxxxx', JSON.stringify(output, "", 5));
    const RESULTS = [
      {
        "name": "prefixName", "displayName": "prefixName", "type": "object", "defaultValue": { "b": { "c": 2 } }, "children": [
          {
            "name": "prefixName.b", "displayName": "b", "type": "object", "defaultValue": { "c": 2 }, "children": [
              { "name": "prefixName.b.c", "displayName": "c", "type": "number", "defaultValue": 2, "children": [] }
            ]
          }
        ]
      }
    ];
    //console.log('yyyyy', JSON.stringify(RESULTS, "", 5));

    assert(JSON.stringify(output) === JSON.stringify(RESULTS));

    done();
  });

  it("build tree from object 4 ", function (done) {
    const output = tools.buildTreeFromObject({ "a": 1, "b": { "c": 2 }, d: [0, 1, 2, 3, 4] }, "prefixName", "prefixName");
    console.log('xxxxx', JSON.stringify(output, "", 5));
    const RESULTS = [
      {
        "name": "prefixName", "displayName": "prefixName", "type": "object", "defaultValue": { "a": 1, "b": { "c": 2 }, d: [0, 1, 2, 3, 4] }, "children": [
          { "name": "prefixName.a", "displayName": "a", "type": "number", "defaultValue": 1, "children": [] },
          {
            "name": "prefixName.b", "displayName": "b", "type": "object", "defaultValue": { "c": 2 }, "children": [
              { "name": "prefixName.b.c", "displayName": "c", "type": "number", "defaultValue": 2, "children": [] }
            ]
          },
          {
            "name": "prefixName.d", "displayName": "d", "type": "array", "defaultValue": [0, 1, 2, 3, 4], "children": [
              { "name": "prefixName.d[0]", "displayName": "[0]", "type": "number", "defaultValue": 0, "children": [] },
              { "name": "prefixName.d[1]", "displayName": "[1]", "type": "number", "defaultValue": 1, "children": [] },
              { "name": "prefixName.d[2]", "displayName": "[2]", "type": "number", "defaultValue": 2, "children": [] },
              { "name": "prefixName.d[3]", "displayName": "[3]", "type": "number", "defaultValue": 3, "children": [] },
              { "name": "prefixName.d[4]", "displayName": "[4]", "type": "number", "defaultValue": 4, "children": [] },
            ]
          }
        ]
      }
    ];
    console.log('yyyyy', JSON.stringify(RESULTS, "", 5));
    assert(JSON.stringify(output) === JSON.stringify(RESULTS));

    done();
  });

  it("build tree from object 5 ", function (done) {
    const output = tools.buildTreeFromObject([{ "name": "james", "address": [{ "type": "home" }, { "type": "work" }] }, { "name": "lena", "address": [{ "type": "home" }, { "type": "work" }] }], "prefixName", "prefixName");
    //console.log('xxxxx',  JSON.stringify(output, "", 5));
    const RESULTS = [
      {
        "name": "prefixName",
        "displayName": "prefixName",
        "type": "array",
        "defaultValue": [
          {
            "name": "james",
            "address": [
              {
                "type": "home"
              },
              {
                "type": "work"
              }
            ]
          },
          {
            "name": "lena",
            "address": [
              {
                "type": "home"
              },
              {
                "type": "work"
              }
            ]
          }
        ],
        "children": [
          {
            "name": "prefixName[0]",
            "displayName": "0",
            "type": "object",
            "defaultValue": {
              "name": "james",
              "address": [
                {
                  "type": "home"
                },
                {
                  "type": "work"
                }
              ]
            },
            "children": [
              {
                "name": "prefixName[0].name",
                "displayName": "name",
                "type": "string",
                "defaultValue": "james",
                "children": []
              },
              {
                "name": "prefixName[0].address",
                "displayName": "address",
                "type": "array",
                "defaultValue": [
                  {
                    "type": "home"
                  },
                  {
                    "type": "work"
                  }
                ],
                "children": [
                  {
                    "name": "prefixName[0].address[0]",
                    "displayName": "0",
                    "type": "object",
                    "defaultValue": {
                      "type": "home"
                    },
                    "children": [
                      {
                        "name": "prefixName[0].address[0].type",
                        "displayName": "type",
                        "type": "string",
                        "defaultValue": "home",
                        "children": []
                      }
                    ]
                  },
                  {
                    "name": "prefixName[0].address[1]",
                    "displayName": "1",
                    "type": "object",
                    "defaultValue": {
                      "type": "work"
                    },
                    "children": [
                      {
                        "name": "prefixName[0].address[1].type",
                        "displayName": "type",
                        "type": "string",
                        "defaultValue": "work",
                        "children": []
                      }
                    ]
                  }
                ]
              }
            ]
          },
          {
            "name": "prefixName[1]",
            "displayName": "1",
            "type": "object",
            "defaultValue": {
              "name": "lena",
              "address": [
                {
                  "type": "home"
                },
                {
                  "type": "work"
                }
              ]
            },
            "children": [
              {
                "name": "prefixName[1].name",
                "displayName": "name",
                "type": "string",
                "defaultValue": "lena",
                "children": []
              },
              {
                "name": "prefixName[1].address",
                "displayName": "address",
                "type": "array",
                "defaultValue": [
                  {
                    "type": "home"
                  },
                  {
                    "type": "work"
                  }
                ],
                "children": [
                  {
                    "name": "prefixName[1].address[0]",
                    "displayName": "0",
                    "type": "object",
                    "defaultValue": {
                      "type": "home"
                    },
                    "children": [
                      {
                        "name": "prefixName[1].address[0].type",
                        "displayName": "type",
                        "type": "string",
                        "defaultValue": "home",
                        "children": []
                      }
                    ]
                  },
                  {
                    "name": "prefixName[1].address[1]",
                    "displayName": "1",
                    "type": "object",
                    "defaultValue": {
                      "type": "work"
                    },
                    "children": [
                      {
                        "name": "prefixName[1].address[1].type",
                        "displayName": "type",
                        "type": "string",
                        "defaultValue": "work",
                        "children": []
                      }
                    ]
                  }
                ]
              }
            ]
          }
        ]
      }
    ];

    //console.log('yyyyy', JSON.stringify(RESULTS, "", 5));
    assert(JSON.stringify(output) === JSON.stringify(RESULTS));

    done();
  });

  it("build tree from object, no name", function (done) {
    const output = tools.buildTreeFromObject({ "a": 1, "b": 2 });
    //console.log('xxxxx', JSON.stringify(output, null, "\t"));
    const RESULTS = [
      {
        "name": "",
        "displayName": "no label",
        "type": "object",
        "defaultValue": {
          "a": 1,
          "b": 2
        },
        "children": [
          {
            "name": ".a",
            "displayName": "a",
            "type": "number",
            "defaultValue": 1,
            "children": []
          },
          {
            "name": ".b",
            "displayName": "b",
            "type": "number",
            "defaultValue": 2,
            "children": []
          }
        ]
      }
    ];

    assert(JSON.stringify(output) === JSON.stringify(RESULTS));

    done();
  });

  it("build tree from object, undefined name", function (done) {
    const output = tools.buildTreeFromObject({ "a": 1, "b": 2 }, undefined);
    //console.log('xxxxx', JSON.stringify(output, null, "\t"));
    const RESULTS = [
      {
        "name": "",
        "displayName": "no label",
        "type": "object",
        "defaultValue": {
          "a": 1,
          "b": 2
        },
        "children": [
          {
            "name": ".a",
            "displayName": "a",
            "type": "number",
            "defaultValue": 1,
            "children": []
          },
          {
            "name": ".b",
            "displayName": "b",
            "type": "number",
            "defaultValue": 2,
            "children": []
          }
        ]
      }
    ];

    assert(JSON.stringify(output) === JSON.stringify(RESULTS));

    done();
  });

  it("build tree from object, null name", function (done) {
    const output = tools.buildTreeFromObject({ "a": 1, "b": 2 }, null);
    //console.log('xxxxx', JSON.stringify(output, null, "\t"));
    const RESULTS = [];

    assert(JSON.stringify(output) === JSON.stringify(RESULTS));

    done();
  });

  it("build tree from object, object name", function (done) {
    const output = tools.buildTreeFromObject({ "a": 1, "b": 2 }, { "foo": "bar" });
    //console.log('xxxxx', JSON.stringify(output, null, "\t"));
    const RESULTS = [];

    assert(JSON.stringify(output) === JSON.stringify(RESULTS));

    done();
  });

  it("build tree from object no params", function (done) {
    try {
      const output = tools.buildTreeFromObject();
      //console.log('xxxxx', JSON.stringify(output, null, "\t"));
      //should never get here
      assert(1 !== 1);
    } catch (error) {
      console.log('........', error.message);
      assert(error.message === "keyData invalid");
    }

    done();
  });

  it("object has own property no params", function (done) {
    try {
      const output = tools.buildTreeFromObject();
      //console.log('xxxxx', JSON.stringify(output, null, "\t"));
      //should never get here
      assert(1 !== 1);
    } catch (error) {
      console.log(error.message);
      assert(error.message === "keyData invalid");
    }

    done();
  });

  it("object has own property no params", function (done) {
    assert(tools.objectHasOwnProperty() === false);

    done();
  });

  it("object has own property null params", function (done) {
    assert(tools.objectHasOwnProperty(null, "a string") === false);

    done();
  });

  it("object has own property bad stringified dotNotation", function (done) {
    assert(tools.objectHasOwnProperty({}, "[0]root.level1") === false);

    done();
  });

  it("object has own property good values", function (done) {
    assert(tools.objectHasOwnProperty({ "root": { "level1": "foo" } }, "root.level1") === true);
    assert(tools.objectHasOwnProperty({ "root": [{ "level1": "foo" }] }, "root[0].level1") === true);
    assert(tools.objectHasOwnProperty([{ "root": [{ "level1": "foo" }] }], "[0].root[0].level1") === true);
    assert(tools.objectHasOwnProperty(["a", "b", "c"], "[1]") === true);
    assert(tools.objectHasOwnProperty({ "a": 1, "b": 2 }, "b") === true);

    done();
  });

  it("build tree from application", function (done) {

    //{"uuid":"508f8111-7daf-43ab-9ead-a85815bc4939","name":"test","type":"starpaas_application","resource_status":"complete","description":"hello","content_type":"application/json","content":{"account_uuid":"75d7d40f-4250-4bef-9f6f-ef1f909f9947","display_name":"test","admins":[],"icon":"AttachmentIconSVG","icon_color":"#5300eb","versions":{"1.0.0":{"version":"1.0.0","version_description":"","creation_timestamp":1562852518296,"creation_author":"James Schimmoeller","status":"inactive","flows":[{"name":"send","description":"","uuid":"c5b4bd9e-9486-4736-b988-8747e5cf31ab","version":"1.0.0","status":"inactive","states":[],"transitions":[],"users":{"account_uuid":"75d7d40f-4250-4bef-9f6f-ef1f909f9947","user_uuids":[]},"globals":{},"nodes":[{"name":"Trigger Manually","description":"Start a Workflow on demand - primarily used for debugging.","type":"start","componentName":"Start","componentType":"node","svg":"PlayIconSVG","svgBackgroundColor":"#2f9e44","svgFillColor":"#FFFFFF","category":"trigger","formData":{"name":"Trigger Manually","description":"Start a Workflow on demand - primarily used for debugging.","nextState":"Read Data Table","startParameters":[]},"position":{"width":96,"height":96,"x":200,"y":10},"uuid":"3c71b330-c9ab-41e5-98f5-528f41314b96","inputs":[{"name":"name","dataDefinition":"hello","dataType":"string","defaultValue":"James","uuid":"298c5d56-e4b9-4ddd-ad01-418cc3eeb6fc"}],"sampleData":{},"outputs":[{"name":"name","dataDefinition":"$name","dataType":"string","defaultValue":"James","uuid":"d192f292-5f3c-4bdf-a081-b13978690ff8"}]},{"name":"End Workflow","description":"Indicate the end of a Workflow (required).","type":"finish","componentName":"End","componentType":"node","svg":"StopIconSVG","svgBackgrounColor":"#e03131","svgFillColor":"#FFFFFF","category":"activity","formData":{"name":"End Workflow","description":"Indicate the end of a Workflow (required)."},"position":{"height":96,"width":96,"x":277,"y":580},"uuid":"0d061b06-a1ad-4ed9-96c4-28f912716151"},{"name":"Read Data Table","description":"Read from a pre-built data table","type":"data","componentName":"Data","componentType":"node","svg":"DataIconSVG","svgFillColor":"#FFFFFF","svgBackgroundColor":"#069697","category":"activity","formData":{"name":"Read Data Table","description":"Read from a pre-built data table","dataUUID":"e07b4c26-7468-4ea4-862f-3087a3723eaf","nextState":"Send Mass Notification","onError":"","onTimeout":"","timeout":"30000","componentName":"Data","definitions":{"dataUUIDs":{"type":"string","enum":["","e07b4c26-7468-4ea4-862f-3087a3723eaf"],"enumNames":["","peeps"]},"nextState":{"type":"string","enum":["","Trigger Manually","End Workflow","Read Data Table"]}}},"position":{"height":88,"width":300,"x":99,"y":188},"uuid":"c7189e8a-5f9e-42fc-a60e-912193d20a18","sampleData":{"modality":"sms","name":"james","value":"9418076677"},"outputs":[{"name":"whatName","dataDefinition":"$whatName","dataType":"string","defaultValue":"Lena","uuid":"1debdd3c-9e13-453e-b187-f2a390006d93"},{"name":"people","dataDefinition":"$","dataType":"array","defaultValue":"[{\"email\":\"jschimmoeller@gmail.com\",\"name\":\"james e schimmoeller\",\"phone\":\"8418076677\"},{\"email\":\"gods.axle@yahoo.com\",\"name\":\"LENA A SCHIMMOELLER\",\"phone\":\"9413069926\"}]","uuid":"6eac1b7c-8295-42a0-8628-36ab0597b234"},{"name":"Account.Order[0].Product[0].Product Name","dataDefinition":"$Account.Order[0].Product[0].Product Name","dataType":"string","defaultValue":"Bowler Hat","uuid":"27025264-c3be-46e4-8162-40f024f9ee47"},{"name":"Account.Order[1].Product[0].Price","dataDefinition":"$Account.Order[1].Product[0].Price","dataType":"number","defaultValue":34.45,"uuid":"5101f29a-eecd-441f-a40f-7313e8550184"},{"name":"mywidth","dataDefinition":"$Account.Order[0].Product[1].Description.Width","dataType":"number","defaultValue":300,"uuid":"32314a70-4bef-47fd-863a-c6bf8972fee9"}],"inputs":[{"name":"whatName","dataDefinition":"","dataType":"string","defaultValue":"Lena","uuid":"799217ea-b2e4-42bf-a972-4e46c73e23eb"}]},{"name":"Send Mass Notification","description":"Send a notification to a list of SMS numbers and/or email addresses.","type":"notification","componentName":"Notification","componentType":"node","svg":"BellFilledIconSVG","svgFillColor":"#FFFFFF","svgBackgroundColor":"#069697","category":"activity","formData":{"name":"Send Mass Notification","description":"Send a notification to a list of SMS numbers and/or email addresses.","data":"","sendSMS":true,"sendEmail":true,"subject":"","body":"","confirmation":false,"confirmationWorkspace":"","nextState":"End Workflow","onError":"","onTimeout":"","timeout":"30000","resultPath":"","user_uuid":"109233ec-0e59-4888-b4e5-967c6e30f089","enableReminders":false,"maxReminders":"","reminderTimeout":""},"position":{"x":97,"y":390},"uuid":"424060e6-6e23-435f-a960-240d2973e89b"}],"parent_uuid":""}],"workspaces":[]}}},"audit":{"created_date":"2019-07-11T13:41:58.000Z","created_by":"109233ec-0e59-4888-b4e5-967c6e30f089","updated_date":"2019-07-12T14:03:44.000Z","updated_by":"109233ec-0e59-4888-b4e5-967c6e30f089"},"metadata":{"permissions":["*"]}};

    const myApp = {
      "content": {
        "versions": {
          "1.0.0": {
            "flows": [{
              "name": "send",
              "nodes": [{
                "outputs": [{
                  "dataDefinition": "$name",
                  "dataType": "string",
                  "defaultValue": "james",
                  "name": "name",
                  "uuid": "12121-12121-e34r3-4-r4-df-df-d"
                }]
              }]
            }]
          }
        }
      }
    }
    //console.log(JSON.stringify(myApp, "", 3));
    const x = tools.buildTreeFromApplication(myApp, "1.0.0");
    //console.log('zzzzz', JSON.stringify(x, "", 0));
    const RESULTS = [{ "name": "send", "displayName": "send", "type": "object", "defaultValue": { "name": "james" }, "children": [{ "name": "[send]name", "displayName": "name", "type": "string", "defaultValue": "james", "children": [] }] }];
    assert(JSON.stringify(x) === JSON.stringify(RESULTS));

    done();
  });


  it("build tree from application - bad version", function (done) {

    const myApp = {
      "content": {
        "versions": {
          "1.0.0": {
            "flows": [{
              "name": "send",
              "nodes": [{
                "outputs": [{
                  "dataDefinition": "$name",
                  "dataType": "string",
                  "defaultValue": "james",
                  "name": "name",
                  "uuid": "12121-12121-e34r3-4-r4-df-df-d"
                },
                {
                  "dataDefinition": "$modality",
                  "dataType": "string",
                  "defaultValue": "sms",
                  "name": "modality",
                  "uuid": "12121-12121-e34r3-4-r4-df-df-d"
                },
                {
                  "dataDefinition": "$value",
                  "dataType": "string",
                  "defaultValue": "9418076677",
                  "name": "value",
                  "uuid": "12121-12121-e34r3-4-r4-df-df-d"
                },
                {
                  "dataDefinition": "$people",
                  "dataType": "array",
                  "defaultValue": [{ "name": "james", "modality": "sms", "value": "9418076677" }, { "name": "lena", "modality": "sms", "value": "9413069926" }],
                  "name": "people",
                  "uuid": "12121-12121-e34r3-4-r4-df-df-d"
                },
                ]
              }]
            }]
          }
        }
      }
    }
    //console.log(JSON.stringify(myApp, "", 3));
    const x = tools.buildTreeFromApplication(myApp, "4.0.0");
    //console.log('output', JSON.stringify(x, "", 1));
    const RESULTS = [{ "name": "send", "displayName": "send", "type": "object", "defaultValue": { "name": "james", "modality": "sms", "value": "9418076677", "people": [{ "name": "james", "modality": "sms", "value": "9418076677" }, { "name": "lena", "modality": "sms", "value": "9413069926" }] }, "children": [{ "name": "[send]name", "displayName": "name", "type": "string", "defaultValue": "james", "children": [] }, { "name": "[send]modality", "displayName": "modality", "type": "string", "defaultValue": "sms", "children": [] }, { "name": "[send]value", "displayName": "value", "type": "string", "defaultValue": "9418076677", "children": [] }, { "name": "[send]people", "displayName": "people", "type": "array", "defaultValue": [{ "name": "james", "modality": "sms", "value": "9418076677" }, { "name": "lena", "modality": "sms", "value": "9413069926" }], "children": [{ "name": "[send].people[0]", "displayName": "0", "type": "object", "defaultValue": { "name": "james", "modality": "sms", "value": "9418076677" }, "children": [{ "name": "[send].people[0].name", "displayName": "name", "type": "string", "defaultValue": "james", "children": [] }, { "name": "[send].people[0].modality", "displayName": "modality", "type": "string", "defaultValue": "sms", "children": [] }, { "name": "[send].people[0].value", "displayName": "value", "type": "string", "defaultValue": "9418076677", "children": [] }] }, { "name": "[send].people[1]", "displayName": "1", "type": "object", "defaultValue": { "name": "lena", "modality": "sms", "value": "9413069926" }, "children": [{ "name": "[send].people[1].name", "displayName": "name", "type": "string", "defaultValue": "lena", "children": [] }, { "name": "[send].people[1].modality", "displayName": "modality", "type": "string", "defaultValue": "sms", "children": [] }, { "name": "[send].people[1].value", "displayName": "value", "type": "string", "defaultValue": "9413069926", "children": [] }] }] }] }]
    assert(JSON.stringify(x) === JSON.stringify(RESULTS));

    done();
  });

  it("build tree from application - invalid application ", function (done) {

    assert(JSON.stringify(tools.buildTreeFromApplication({}, "")) === JSON.stringify([]));
    assert(JSON.stringify(tools.buildTreeFromApplication([], "")) === JSON.stringify([]));
    assert(JSON.stringify(tools.buildTreeFromApplication({ "content": {} }, "")) === JSON.stringify([]));
    assert(JSON.stringify(tools.buildTreeFromApplication({ "content": { "versions": {} } }, "")) === JSON.stringify([]));
    done();
  });

  it("build tree from application - null ", function (done) {

    const myApp = {
      "content": {
        "versions": {
          "1.0.0": {
            "flows": [{
              "name": "send",
              "nodes": [{
                "outputs": [
                  {
                    "dataDefinition": "$people",
                    "dataType": "array",
                    "defaultValue": {
                      "address": {
                        "street": "625 Joseph Dr",
                        "state": "OH",
                        "postalCode": "44202",
                        "longitude": null,
                        "latitude": null,
                        "geocodeAccuracy": null,
                        "country": "US",
                        "city": "Aurora"
                      },
                      "ticket": 156,
                      "name": "Sergey Galchenko",
                      "email": "sgalchenko@yahoo.com",
                      "caller_id": "+12164704017",
                      "call_transcription": "yeah this is James in apartment 1601 I am locked out",
                      "formatted_caller_id": "(216) 470-4017"
                    },
                    "name": "people",
                    "uuid": "12121-12121-e34r3-4-r4-df-df-d"
                  }
                ]
              }]
            }]
          }
        }
      }
    }
    //console.log(JSON.stringify(myApp, "", 3));
    const x = tools.buildTreeFromApplication(myApp, "4.0.0");
    //console.log('output', JSON.stringify(x, "", 1));
    const RESULTS = [
      {
        "name": "send",
        "displayName": "send",
        "type": "object",
        "defaultValue": {
          "people": []
        },
        "children": [
          {
            "name": "[send]people",
            "displayName": "people",
            "type": "array",
            "defaultValue": {
              "address": {
                "street": "625 Joseph Dr",
                "state": "OH",
                "postalCode": "44202",
                "longitude": null,
                "latitude": null,
                "geocodeAccuracy": null,
                "country": "US",
                "city": "Aurora"
              },
              "ticket": 156,
              "name": "Sergey Galchenko",
              "email": "sgalchenko@yahoo.com",
              "caller_id": "+12164704017",
              "call_transcription": "yeah this is James in apartment 1601 I am locked out",
              "formatted_caller_id": "(216) 470-4017"
            },
            "children": [
              {
                "name": "[send].people.address",
                "displayName": "address",
                "type": "object",
                "defaultValue": {
                  "street": "625 Joseph Dr",
                  "state": "OH",
                  "postalCode": "44202",
                  "longitude": null,
                  "latitude": null,
                  "geocodeAccuracy": null,
                  "country": "US",
                  "city": "Aurora"
                },
                "children": [
                  {
                    "name": "[send].people.address.street",
                    "displayName": "street",
                    "type": "string",
                    "defaultValue": "625 Joseph Dr",
                    "children": []
                  },
                  {
                    "name": "[send].people.address.state",
                    "displayName": "state",
                    "type": "string",
                    "defaultValue": "OH",
                    "children": []
                  },
                  {
                    "name": "[send].people.address.postalCode",
                    "displayName": "postalCode",
                    "type": "string",
                    "defaultValue": "44202",
                    "children": []
                  },
                  {
                    "name": "[send].people.address.longitude",
                    "displayName": "longitude",
                    "type": "object",
                    "defaultValue": null,
                    "children": []
                  },
                  {
                    "name": "[send].people.address.latitude",
                    "displayName": "latitude",
                    "type": "object",
                    "defaultValue": null,
                    "children": []
                  },
                  {
                    "name": "[send].people.address.geocodeAccuracy",
                    "displayName": "geocodeAccuracy",
                    "type": "object",
                    "defaultValue": null,
                    "children": []
                  },
                  {
                    "name": "[send].people.address.country",
                    "displayName": "country",
                    "type": "string",
                    "defaultValue": "US",
                    "children": []
                  },
                  {
                    "name": "[send].people.address.city",
                    "displayName": "city",
                    "type": "string",
                    "defaultValue": "Aurora",
                    "children": []
                  }
                ]
              },
              {
                "name": "[send].people.ticket",
                "displayName": "ticket",
                "type": "number",
                "defaultValue": 156,
                "children": []
              },
              {
                "name": "[send].people.name",
                "displayName": "name",
                "type": "string",
                "defaultValue": "Sergey Galchenko",
                "children": []
              },
              {
                "name": "[send].people.email",
                "displayName": "email",
                "type": "string",
                "defaultValue": "sgalchenko@yahoo.com",
                "children": []
              },
              {
                "name": "[send].people.caller_id",
                "displayName": "caller_id",
                "type": "string",
                "defaultValue": "+12164704017",
                "children": []
              },
              {
                "name": "[send].people.call_transcription",
                "displayName": "call_transcription",
                "type": "string",
                "defaultValue": "yeah this is James in apartment 1601 I am locked out",
                "children": []
              },
              {
                "name": "[send].people.formatted_caller_id",
                "displayName": "formatted_caller_id",
                "type": "string",
                "defaultValue": "(216) 470-4017",
                "children": []
              }
            ]
          }
        ]
      }
    ];
    assert(JSON.stringify(x) === JSON.stringify(RESULTS));

    done();
  });
  it("build tree from application - defaultValue string ", function (done) {

    const myApp = {
      "content": {
        "versions": {
          "1.0.0": {
            "flows": [{
              "name": "send",
              "nodes": [{
                "outputs": [{
                  "dataDefinition": "$name",
                  "dataType": "string",
                  "defaultValue": "james",
                  "name": "name",
                  "uuid": "12121-12121-e34r3-4-r4-df-df-d"
                },
                {
                  "dataDefinition": "$modality",
                  "dataType": "string",
                  "defaultValue": "sms",
                  "name": "modality",
                  "uuid": "12121-12121-e34r3-4-r4-df-df-d"
                },
                {
                  "dataDefinition": "$value",
                  "dataType": "string",
                  "defaultValue": "9418076677",
                  "name": "value",
                  "uuid": "12121-12121-e34r3-4-r4-df-df-d"
                },
                {
                  "dataDefinition": "$people",
                  "dataType": "array",
                  "defaultValue": '[{"modality":"sms","name":"james","value":"9418076677"},{"modality":"sms","name":"mary","value":"1"},{"modality":"sms","name":"nate","value":"b"},{"modality":"sms","name":"duncan","value":"a"},{"modality":"sms","name":"brian","value":"a"},{"modality":"sms","name":"tom","value":"z"},{"modality":"sms","name":"bobby","value":"a"},{"modality":"sms","name":"lena","value":"a"}]',
                  "name": "people",
                  "uuid": "12121-12121-e34r3-4-r4-df-df-d"
                },
                ]
              }]
            }]
          }
        }
      }
    }
    //console.log(JSON.stringify(myApp, "", 3));
    const x = tools.buildTreeFromApplication(myApp, "4.0.0");
    //console.log('output', JSON.stringify(x, "", 2));
    const RESULTS = [{ "name": "send", "displayName": "send", "type": "object", "defaultValue": { "name": "james", "modality": "sms", "value": "9418076677", "people": [{ "modality": "sms", "name": "james", "value": "9418076677" }, { "modality": "sms", "name": "mary", "value": "1" }, { "modality": "sms", "name": "nate", "value": "b" }, { "modality": "sms", "name": "duncan", "value": "a" }, { "modality": "sms", "name": "brian", "value": "a" }, { "modality": "sms", "name": "tom", "value": "z" }, { "modality": "sms", "name": "bobby", "value": "a" }, { "modality": "sms", "name": "lena", "value": "a" }] }, "children": [{ "name": "[send]name", "displayName": "name", "type": "string", "defaultValue": "james", "children": [] }, { "name": "[send]modality", "displayName": "modality", "type": "string", "defaultValue": "sms", "children": [] }, { "name": "[send]value", "displayName": "value", "type": "string", "defaultValue": "9418076677", "children": [] }, { "name": "[send]people", "displayName": "people", "type": "array", "defaultValue": "[{\"modality\":\"sms\",\"name\":\"james\",\"value\":\"9418076677\"},{\"modality\":\"sms\",\"name\":\"mary\",\"value\":\"1\"},{\"modality\":\"sms\",\"name\":\"nate\",\"value\":\"b\"},{\"modality\":\"sms\",\"name\":\"duncan\",\"value\":\"a\"},{\"modality\":\"sms\",\"name\":\"brian\",\"value\":\"a\"},{\"modality\":\"sms\",\"name\":\"tom\",\"value\":\"z\"},{\"modality\":\"sms\",\"name\":\"bobby\",\"value\":\"a\"},{\"modality\":\"sms\",\"name\":\"lena\",\"value\":\"a\"}]", "children": [{ "name": "[send].people[0]", "displayName": "0", "type": "object", "defaultValue": { "modality": "sms", "name": "james", "value": "9418076677" }, "children": [{ "name": "[send].people[0].modality", "displayName": "modality", "type": "string", "defaultValue": "sms", "children": [] }, { "name": "[send].people[0].name", "displayName": "name", "type": "string", "defaultValue": "james", "children": [] }, { "name": "[send].people[0].value", "displayName": "value", "type": "string", "defaultValue": "9418076677", "children": [] }] }, { "name": "[send].people[1]", "displayName": "1", "type": "object", "defaultValue": { "modality": "sms", "name": "mary", "value": "1" }, "children": [{ "name": "[send].people[1].modality", "displayName": "modality", "type": "string", "defaultValue": "sms", "children": [] }, { "name": "[send].people[1].name", "displayName": "name", "type": "string", "defaultValue": "mary", "children": [] }, { "name": "[send].people[1].value", "displayName": "value", "type": "string", "defaultValue": "1", "children": [] }] }, { "name": "[send].people[2]", "displayName": "2", "type": "object", "defaultValue": { "modality": "sms", "name": "nate", "value": "b" }, "children": [{ "name": "[send].people[2].modality", "displayName": "modality", "type": "string", "defaultValue": "sms", "children": [] }, { "name": "[send].people[2].name", "displayName": "name", "type": "string", "defaultValue": "nate", "children": [] }, { "name": "[send].people[2].value", "displayName": "value", "type": "string", "defaultValue": "b", "children": [] }] }, { "name": "[send].people[3]", "displayName": "3", "type": "object", "defaultValue": { "modality": "sms", "name": "duncan", "value": "a" }, "children": [{ "name": "[send].people[3].modality", "displayName": "modality", "type": "string", "defaultValue": "sms", "children": [] }, { "name": "[send].people[3].name", "displayName": "name", "type": "string", "defaultValue": "duncan", "children": [] }, { "name": "[send].people[3].value", "displayName": "value", "type": "string", "defaultValue": "a", "children": [] }] }, { "name": "[send].people[4]", "displayName": "4", "type": "object", "defaultValue": { "modality": "sms", "name": "brian", "value": "a" }, "children": [{ "name": "[send].people[4].modality", "displayName": "modality", "type": "string", "defaultValue": "sms", "children": [] }, { "name": "[send].people[4].name", "displayName": "name", "type": "string", "defaultValue": "brian", "children": [] }, { "name": "[send].people[4].value", "displayName": "value", "type": "string", "defaultValue": "a", "children": [] }] }, { "name": "[send].people[5]", "displayName": "5", "type": "object", "defaultValue": { "modality": "sms", "name": "tom", "value": "z" }, "children": [{ "name": "[send].people[5].modality", "displayName": "modality", "type": "string", "defaultValue": "sms", "children": [] }, { "name": "[send].people[5].name", "displayName": "name", "type": "string", "defaultValue": "tom", "children": [] }, { "name": "[send].people[5].value", "displayName": "value", "type": "string", "defaultValue": "z", "children": [] }] }, { "name": "[send].people[6]", "displayName": "6", "type": "object", "defaultValue": { "modality": "sms", "name": "bobby", "value": "a" }, "children": [{ "name": "[send].people[6].modality", "displayName": "modality", "type": "string", "defaultValue": "sms", "children": [] }, { "name": "[send].people[6].name", "displayName": "name", "type": "string", "defaultValue": "bobby", "children": [] }, { "name": "[send].people[6].value", "displayName": "value", "type": "string", "defaultValue": "a", "children": [] }] }, { "name": "[send].people[7]", "displayName": "7", "type": "object", "defaultValue": { "modality": "sms", "name": "lena", "value": "a" }, "children": [{ "name": "[send].people[7].modality", "displayName": "modality", "type": "string", "defaultValue": "sms", "children": [] }, { "name": "[send].people[7].name", "displayName": "name", "type": "string", "defaultValue": "lena", "children": [] }, { "name": "[send].people[7].value", "displayName": "value", "type": "string", "defaultValue": "a", "children": [] }] }] }] }];

    assert(JSON.stringify(x) === JSON.stringify(RESULTS));

    done();
  });
  it("build tree from application - null ", function (done) {

    const myApp = {
      "content": {
        "versions": {
          "1.0.0": {
            "flows": [{
              "name": "send",
              "nodes": [{
                "outputs": [
                  {
                    "dataDefinition": "$people",
                    "dataType": "array",
                    "defaultValue": {
                      "address": {
                        "street": "625 Joseph Dr",
                        "state": "OH",
                        "postalCode": "44202",
                        "longitude": null,
                        "latitude": null,
                        "geocodeAccuracy": null,
                        "country": "US",
                        "city": "Aurora"
                      },
                      "ticket": 156,
                      "name": "Sergey Galchenko",
                      "email": "sgalchenko@yahoo.com",
                      "caller_id": "+12164704017",
                      "call_transcription": "yeah this is James in apartment 1601 I am locked out",
                      "formatted_caller_id": "(216) 470-4017"
                    },
                    "name": "people",
                    "uuid": "12121-12121-e34r3-4-r4-df-df-d"
                  }
                ]
              }]
            }]
          }
        }
      }
    }
    //console.log(JSON.stringify(myApp, "", 3));
    const x = tools.buildTreeFromApplication(myApp, "4.0.0");
    //console.log('output', JSON.stringify(x, "", 0));
    const RESULTS = [{ "name": "send", "displayName": "send", "type": "object", "defaultValue": { "people": [] }, "children": [{ "name": "[send]people", "displayName": "people", "type": "array", "defaultValue": { "address": { "street": "625 Joseph Dr", "state": "OH", "postalCode": "44202", "longitude": null, "latitude": null, "geocodeAccuracy": null, "country": "US", "city": "Aurora" }, "ticket": 156, "name": "Sergey Galchenko", "email": "sgalchenko@yahoo.com", "caller_id": "+12164704017", "call_transcription": "yeah this is James in apartment 1601 I am locked out", "formatted_caller_id": "(216) 470-4017" }, "children": [{ "name": "[send].people.address", "displayName": "address", "type": "object", "defaultValue": { "street": "625 Joseph Dr", "state": "OH", "postalCode": "44202", "longitude": null, "latitude": null, "geocodeAccuracy": null, "country": "US", "city": "Aurora" }, "children": [{ "name": "[send].people.address.street", "displayName": "street", "type": "string", "defaultValue": "625 Joseph Dr", "children": [] }, { "name": "[send].people.address.state", "displayName": "state", "type": "string", "defaultValue": "OH", "children": [] }, { "name": "[send].people.address.postalCode", "displayName": "postalCode", "type": "string", "defaultValue": "44202", "children": [] }, { "name": "[send].people.address.longitude", "displayName": "longitude", "type": "object", "defaultValue": null, "children": [] }, { "name": "[send].people.address.latitude", "displayName": "latitude", "type": "object", "defaultValue": null, "children": [] }, { "name": "[send].people.address.geocodeAccuracy", "displayName": "geocodeAccuracy", "type": "object", "defaultValue": null, "children": [] }, { "name": "[send].people.address.country", "displayName": "country", "type": "string", "defaultValue": "US", "children": [] }, { "name": "[send].people.address.city", "displayName": "city", "type": "string", "defaultValue": "Aurora", "children": [] }] }, { "name": "[send].people.ticket", "displayName": "ticket", "type": "number", "defaultValue": 156, "children": [] }, { "name": "[send].people.name", "displayName": "name", "type": "string", "defaultValue": "Sergey Galchenko", "children": [] }, { "name": "[send].people.email", "displayName": "email", "type": "string", "defaultValue": "sgalchenko@yahoo.com", "children": [] }, { "name": "[send].people.caller_id", "displayName": "caller_id", "type": "string", "defaultValue": "+12164704017", "children": [] }, { "name": "[send].people.call_transcription", "displayName": "call_transcription", "type": "string", "defaultValue": "yeah this is James in apartment 1601 I am locked out", "children": [] }, { "name": "[send].people.formatted_caller_id", "displayName": "formatted_caller_id", "type": "string", "defaultValue": "(216) 470-4017", "children": [] }] }] }];

    assert(JSON.stringify(x) === JSON.stringify(RESULTS));

    done();
  });

  it("build tree from application - something  ", function (done) {

    const myObj = [{ "modality": "sms", "name": "james", "value": "9418076677" }, { "modality": "sms", "name": "mary", "value": "1" }];

    //console.log(JSON.stringify(myApp, "", 3));
    const x = tools.buildTreeFromObject(myObj, "people", "people");
    const z = merge({}, x);

    //console.log('output', JSON.stringify(x, "", 0));
    const RESULTS = [{ "name": "people", "displayName": "people", "type": "array", "defaultValue": [{ "modality": "sms", "name": "james", "value": "9418076677" }, { "modality": "sms", "name": "mary", "value": "1" }], "children": [{ "name": "people[0]", "displayName": "0", "type": "object", "defaultValue": { "modality": "sms", "name": "james", "value": "9418076677" }, "children": [{ "name": "people[0].modality", "displayName": "modality", "type": "string", "defaultValue": "sms", "children": [] }, { "name": "people[0].name", "displayName": "name", "type": "string", "defaultValue": "james", "children": [] }, { "name": "people[0].value", "displayName": "value", "type": "string", "defaultValue": "9418076677", "children": [] }] }, { "name": "people[1]", "displayName": "1", "type": "object", "defaultValue": { "modality": "sms", "name": "mary", "value": "1" }, "children": [{ "name": "people[1].modality", "displayName": "modality", "type": "string", "defaultValue": "sms", "children": [] }, { "name": "people[1].name", "displayName": "name", "type": "string", "defaultValue": "mary", "children": [] }, { "name": "people[1].value", "displayName": "value", "type": "string", "defaultValue": "1", "children": [] }] }] }];

    assert(JSON.stringify(x) === JSON.stringify(RESULTS));

    done();
  });

  it("build tree from application - something no label ", function (done) {

    const myObj = [{ "modality": "sms", "name": "james", "value": "9418076677" }, { "modality": "sms", "name": "mary", "value": "1" }];

    //console.log(JSON.stringify(myApp, "", 3));
    const x = tools.buildTreeFromObject(myObj, "people");
    const z = merge({}, x);

    //console.log('output', JSON.stringify(x, "", 0));
    const RESULTS = [{ "name": "people", "displayName": "no label", "type": "array", "defaultValue": [{ "modality": "sms", "name": "james", "value": "9418076677" }, { "modality": "sms", "name": "mary", "value": "1" }], "children": [{ "name": "people[0]", "displayName": "0", "type": "object", "defaultValue": { "modality": "sms", "name": "james", "value": "9418076677" }, "children": [{ "name": "people[0].modality", "displayName": "modality", "type": "string", "defaultValue": "sms", "children": [] }, { "name": "people[0].name", "displayName": "name", "type": "string", "defaultValue": "james", "children": [] }, { "name": "people[0].value", "displayName": "value", "type": "string", "defaultValue": "9418076677", "children": [] }] }, { "name": "people[1]", "displayName": "1", "type": "object", "defaultValue": { "modality": "sms", "name": "mary", "value": "1" }, "children": [{ "name": "people[1].modality", "displayName": "modality", "type": "string", "defaultValue": "sms", "children": [] }, { "name": "people[1].name", "displayName": "name", "type": "string", "defaultValue": "mary", "children": [] }, { "name": "people[1].value", "displayName": "value", "type": "string", "defaultValue": "1", "children": [] }] }] }];

    assert(JSON.stringify(x) === JSON.stringify(RESULTS));

    done();
  });

});