"use strict";
/**
 * 
 * @description Flattens a JSON object into label and value pairs
 * @param {string} [label=""] - The root label the JSON properties will be appended to.
 * @param {object} sampleData - JSON object to be flattened.
 * @returns {array} - array of objects in {label:"","value":""} format.
 */

function ownKeys(object, enumerableOnly) { var keys = Object.keys(object); if (Object.getOwnPropertySymbols) { keys.push.apply(keys, Object.getOwnPropertySymbols(object)); } if (enumerableOnly) keys = keys.filter(function (sym) { return Object.getOwnPropertyDescriptor(object, sym).enumerable; }); return keys; }

function _objectSpread(target) { for (var i = 1; i < arguments.length; i++) { var source = arguments[i] != null ? arguments[i] : {}; if (i % 2) { ownKeys(source, true).forEach(function (key) { _defineProperty(target, key, source[key]); }); } else if (Object.getOwnPropertyDescriptors) { Object.defineProperties(target, Object.getOwnPropertyDescriptors(source)); } else { ownKeys(source).forEach(function (key) { Object.defineProperty(target, key, Object.getOwnPropertyDescriptor(source, key)); }); } } return target; }

function _defineProperty(obj, key, value) { if (key in obj) { Object.defineProperty(obj, key, { value: value, enumerable: true, configurable: true, writable: true }); } else { obj[key] = value; } return obj; }

function _typeof(obj) { if (typeof Symbol === "function" && typeof Symbol.iterator === "symbol") { _typeof = function _typeof(obj) { return typeof obj; }; } else { _typeof = function _typeof(obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol && obj !== Symbol.prototype ? "symbol" : typeof obj; }; } return _typeof(obj); }

var getVariableSelectData = function getVariableSelectData() {
  var label = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
  var sampleData = arguments.length > 1 ? arguments[1] : undefined;
  var sampleDataName = arguments.length > 2 ? arguments[2] : undefined;

  //console.log('LEVEL', level);
  var getNewLabel = function getNewLabel() {
    var oldLabel = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
    var key = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
    return (oldLabel && oldLabel.length > 0 ? oldLabel + "." : "") + key;
  };

  var getObjectStuff = function getObjectStuff() {
    var label = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
    var sampleData = arguments.length > 1 ? arguments[1] : undefined;

    if (sampleData !== null && _typeof(sampleData) === "object") {
      var firstRun = Object.keys(sampleData).map(function (key) {
        if (_typeof(sampleData[key]) === "object" && sampleData[key] !== null) {
          // must check for array 
          if (Array.isArray(sampleData[key])) {
            // array so do my magic here 
            //console.log('k', key);
            return [].concat([{
              "label": getNewLabel("".concat(label), "".concat(key)),
              "value": sampleData[key]
            }]).concat(sampleData[key].map(function (item, index) {
              if (_typeof(item) === "object" && item !== null && Object.keys(item).length > 0) {
                // ok this is an object within array 
                return [].concat([{
                  "label": getNewLabel("".concat(label), "".concat(key, "[").concat(index, "]")),
                  "value": item
                }]).concat(getObjectStuff(getNewLabel("".concat(label), "".concat(key, "[").concat(index, "]")), item));
              } else {
                if (item === null) {
                  return {
                    "label": getNewLabel("".concat(label), "".concat(key, "[").concat(index, "]")),
                    "value": "NULL"
                  };
                } else {
                  return {
                    "label": getNewLabel("".concat(label), "".concat(key, "[").concat(index, "]")),
                    "value": item
                  };
                }
              }
            }));
          } else {
            // it is an object so recursion
            if (Object.keys(sampleData[key]).length > 0) {
              // 
              var mySecondary = getObjectStuff(getNewLabel("".concat(label), "".concat(key)), sampleData[key]); // console.log('zzzzz', [].concat({"label": getNewLabel(`${label}`, `${key}`), "value": sampleData[key]}).concat(mySecondary));
              // console.log('>>>>', mySecondary);

              return [].concat({
                "label": getNewLabel("".concat(label), "".concat(key)),
                "value": sampleData[key]
              }).concat(mySecondary); //return mySecondary;
            } else {
              return {
                "label": getNewLabel("".concat(label), "".concat(key)),
                "value": "EMPTY"
              };
            }
          }
        } else {
          // primative stuff 
          if (sampleData[key] === null) {
            return {
              "label": getNewLabel("".concat(label), "".concat(key)),
              "value": "NULL"
            };
          } else {
            return {
              "label": getNewLabel("".concat(label), "".concat(key)),
              "value": sampleData[key]
            };
          }
        }
      });
      var _myReturn = [];

      if (label.length === 0) {
        if (Array.isArray(sampleData)) {
          //console.warn('addd the array ', firstRun.reduce((acc, val) => acc.concat(val), []));
          // fix firstRun data
          var flattenDeep = function flattenDeep(arr1) {
            return arr1.reduce(function (acc, val) {
              return Array.isArray(val) ? acc.concat(flattenDeep(val)) : acc.concat(val);
            }, []);
          };

          var xFirstRun = flattenDeep(firstRun);
          _myReturn = [].concat([{
            "label": sampleDataName,
            "value": sampleData
          }]).concat(xFirstRun.map(function (i) {
            //console.log(i);
            var name = i.label;
            var firstPart = name.substring(0, name.indexOf('.') > -1 ? name.indexOf('.') : undefined); //console.log('zzz', firstPart);

            var lastPart = name.indexOf('.') > -1 ? name.substring(name.indexOf('.') + 1) : ""; //console.log('a', firstPart, lastPart);

            var newName = "".concat(sampleDataName, "[").concat(firstPart, "]");

            if (lastPart && lastPart.length > 0) {
              newName += ".".concat(lastPart);
            }

            return _objectSpread({}, i, {
              "label": newName
            });
          }));
        } else {
          // object 
          //console.warn('addd the array ', firstRun);
          // fix firstRun data
          var _flattenDeep = function _flattenDeep(arr1) {
            return arr1.reduce(function (acc, val) {
              return Array.isArray(val) ? acc.concat(_flattenDeep(val)) : acc.concat(val);
            }, []);
          };

          var _xFirstRun = _flattenDeep(firstRun);

          _myReturn = [].concat([{
            "label": sampleDataName,
            "value": sampleData
          }]).concat(_xFirstRun.map(function (i) {
            //console.log(i);
            var name = i.label;
            var firstPart = name.substring(0, name.indexOf('.') > -1 ? name.indexOf('.') : undefined); //console.log('zzz', firstPart);

            var lastPart = name.indexOf('.') > -1 ? name.substring(name.indexOf('.') + 1) : ""; //console.log('a', firstPart, lastPart);

            var newName = sampleDataName && sampleDataName.length > 0 ? "".concat(sampleDataName, ".").concat(firstPart) : "".concat(firstPart);

            if (lastPart && lastPart.length > 0) {
              newName += ".".concat(lastPart);
            }

            return _objectSpread({}, i, {
              "label": newName
            });
          }));
        }
      } else {
        _myReturn = [].concat(firstRun);
      }

      return _myReturn;
    } else {
      //console.warn('sample data provided to getVariableSelectData was not an object: ', sampleData === "" ? "empty string": sampleData);
      return [];
    }
  };

  var myReturn = [];
  var myData = getObjectStuff(label, sampleData);

  var dedupArray = function dedupArray(myData) {
    var myReturn = [];
    myData.forEach(function (item) {
      if (Array.isArray(item)) {
        myReturn = [].concat.apply(myReturn, item);
      } else {
        myReturn = myReturn.concat(item);
      }
    });
    return myReturn;
  };

  var hasArrayData = function hasArrayData(myData) {
    return myData.reduce(function (p, c) {
      if (!p) {
        if (Array.isArray(c)) {
          return true;
        }
      }

      return p;
    }, false);
  }; //console.log('mmmmmm', myData);


  myReturn = [].concat(myData);
  var bClean = true;
  var mLevels = 0;

  while (bClean && ++mLevels < 100) {
    bClean = hasArrayData(myReturn);

    if (bClean) {
      //console.log('cleaning because i still have arrays', myReturn);
      myReturn = dedupArray(myReturn); //console.log('after clean: ', myReturn);
    } else {//console.log('ssssss', bClean, myReturn);
      }
  }

  return myReturn;
};
/**
 *
 * @description Replaces marked words in a string with the contencts of a JSON object
 * @param {string} [incomingString=""] - String marked for replacement "Something +replaceMe"
 * @param {object} [sampleData={}] - JSON data such as {"replaceMe":"important" }
 * @returns {string} - String with replacemed values, such as "Somthing important"
 */


var replaceVariableInput = function replaceVariableInput() {
  var incomingString = arguments.length > 0 && arguments[0] !== undefined ? arguments[0] : "";
  var sampleData = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : {};
  var variableSelectData = getVariableSelectData("", sampleData); //swallow bad parameter

  if (typeof incomingString !== "string") {
    //console.warn("replaceVariableInput incomingString type not a string: ", typeof incomingString);
    return "";
  }

  var newInput = incomingString + ""; // use regex to get inputs to replace 

  var regexMatches = incomingString.match(/(\+\S+)/g); // console.log('xxxxx', regexMatches, variableSelectData);
  // replace based on variableSelectData

  regexMatches && regexMatches.length > 0 && regexMatches.forEach(function (item) {
    var endPos = item.length;

    if ([";", ":", ",", ".", "!", "?"].indexOf(item.charAt(item.length - 1)) !== -1) {
      endPos = item.length - 2;
    }

    var replacementName = item.substr(1, endPos); //strip off + 
    // console.log(item, item.charAt(item.length -1), item.length, endPos, replacementName);

    var replacementValue = variableSelectData.reduce(function (p, c, i) {
      // console.log('xxxx', p, c, i );
      if (!p) {
        if (c.label === replacementName) {
          return c.value;
        }
      }

      return p;
    }, undefined); // console.log('>>>', replacementName, replacementValue, replacementValue.length);

    if (replacementValue && replacementValue.toString().length > 0) {
      newInput = newInput.replace(new RegExp("\\+" + replacementName, 'g'), replacementValue);
    }
  });
  return newInput;
};
/**
 * 
 * @description Flattens a JSON object into an object needed by contentEditble compoents 
 * @param {object} sampleData - JSON object to be flattened.
 * @returns {object} - JSON object with key and value 
 */


var getContentEditableData = function getContentEditableData(sampleData) {
  var data = getVariableSelectData("", sampleData);
  var rData = {};
  data.forEach(function (obj) {
    if (obj.label && obj.label.length > 0) {
      rData[obj.label] = obj.value;
    }
  });
  return rData;
};
/**
 * 
 * @description Flattens a JSON object into an object needed by dataBrowser compoents 
 * @param {object} sampleData - JSON object to be flattened.
 * @returns {array of <objects>} - array of objects in the form of {name, type, value }
 */


var getFlattenedObject = function getFlattenedObject(sampleData, name) {
  var data = getVariableSelectData("", sampleData, name);
  return data.map(function (obj) {
    return {
      "name": obj.label,
      "type": _typeof(obj.value) === "object" && Array.isArray(obj.value) ? "array" : _typeof(obj.value),
      "defaultValue": obj.value
    };
  });
};
/**
 * 
 * @description builds a object from JSON object 
 * @param {object} sampleData - JSON object to be flattened.
 * @param {stirng} name - prefix name defaults to empty 
 * @returns {array of <objects>} - array of objects in the form of {name, type, value }
 */


var buildTreeFromObject = function buildTreeFromObject(sampleData) {
  var prefixName = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
  var myReturn = [];

  var getKeyData = function getKeyData(keyData) {
    var prefixLabel = arguments.length > 1 && arguments[1] !== undefined ? arguments[1] : "";
    var level = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : 0;
    var label = arguments.length > 3 && arguments[3] !== undefined ? arguments[3] : "";

    //console.log('getKeyData ....', keyData, prefixLabel, level, label);
    if (!keyData) {
      throw new Error('keyData invalid');
    }

    if (_typeof(keyData) === "object") {
      // recursion
      var myChildren = Object.keys(keyData).map(function (k) {
        // is child an object 
        if (_typeof(keyData[k]) === "object") {
          //console.log('zzzzz', keyData, k)
          return getKeyData(keyData[k], Array.isArray(keyData) ? "".concat(prefixLabel, "[").concat(k, "]") : "".concat(prefixLabel, ".").concat(k), level++, k);
        } else {
          //console.log('hmmmmm ', typeof(keyData[k]));
          if (Array.isArray(keyData)) {
            // parent is an array so doing this why 
            //console.log('>>>', prefixLabel, k, keyData )
            return {
              "name": "".concat(prefixLabel, "[").concat(k, "]"),
              "displayName": "[".concat(k, "]"),
              "type": _typeof(keyData[k]),
              "defaultValue": keyData[k],
              "children": []
            };
          } else {
            return {
              "name": "".concat(prefixLabel, ".").concat(k),
              "displayName": "".concat(k),
              "type": _typeof(keyData[k]),
              "defaultValue": keyData[k],
              "children": []
            };
          }
        }
      });
      return {
        "name": prefixLabel,
        "displayName": label,
        "type": _typeof(keyData) === "object" ? Array.isArray(keyData) ? "array" : "object" : _typeof(keyData),
        "defaultValue": keyData,
        "children": myChildren
      };
    } else {
      return {
        "name": prefixLabel,
        "displayName": label,
        "type": _typeof(keyData),
        "defaultValue": keyData,
        "children": []
      };
    }
  };

  myReturn = myReturn.concat(getKeyData(sampleData, prefixName, 0));
  return myReturn;
};

module.exports = {
  replaceVariableInput: replaceVariableInput,
  getVariableSelectData: getVariableSelectData,
  getContentEditableData: getContentEditableData,
  getFlattenedObject: getFlattenedObject,
  buildTreeFromObject: buildTreeFromObject
};