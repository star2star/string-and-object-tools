
"use strict";
const jsonata = require("jsonata");
/**
 * 
 * @description Flattens a JSON object into label and value pairs
 * @param {string} [label=""] - The root label the JSON properties will be appended to.
 * @param {object} sampleData - JSON object to be flattened.
 * @returns {array} - array of objects in {label:"","value":""} format.
 */
const getVariableSelectData = (label = "", sampleData, sampleDataName) => {
  //console.log('LEVEL', level);

  const getNewLabel = (oldLabel = "", key = "") => {
    return (oldLabel && oldLabel.length > 0 ? oldLabel + "." : "") + key;
  };

  const getObjectStuff = (label = "", sampleData) => {
    if (sampleData !== null && typeof (sampleData) === "object") {
      const firstRun = Object.keys(sampleData).map((key) => {
        if (typeof (sampleData[key]) === "object" && sampleData[key] !== null) {
          // must check for array 
          if (Array.isArray(sampleData[key])) {
            // array so do my magic here 
            //console.log('k', key);
            return [].concat([{"label": getNewLabel(`${label}`, `${key}`) , "value":  sampleData[key]}]).concat(sampleData[key].map((item, index) => {
              if (typeof (item) === "object" && item !== null && Object.keys(item).length > 0) {
                // ok this is an object within array 
                return [].concat([{"label": getNewLabel(`${label}`, `${key}[${index}]`) , "value":  item }]).concat(getObjectStuff(getNewLabel(`${label}`, `${key}[${index}]`), item ));
              } else {
                if (item === null  ) {
                  return { "label": getNewLabel(`${label}`, `${key}[${index}]`), "value": "NULL" };
                } else {
                  return { "label": getNewLabel(`${label}`, `${key}[${index}]`), "value": item };
                }
              }
            }));
          } else {
            // it is an object so recursion
            if (Object.keys(sampleData[key]).length > 0) {
              // 
              const mySecondary = getObjectStuff(getNewLabel(`${label}`, `${key}`), sampleData[key] );
  
              // console.log('zzzzz', [].concat({"label": getNewLabel(`${label}`, `${key}`), "value": sampleData[key]}).concat(mySecondary));
              // console.log('>>>>', mySecondary);
              return [].concat({"label": getNewLabel(`${label}`, `${key}`), "value": sampleData[key]}).concat(mySecondary);
              //return mySecondary;
            } else {
              return { "label": getNewLabel(`${label}`, `${key}`), "value": "EMPTY" };
            }
  
          }
        } else { // primative stuff 
          if (sampleData[key] === null) {
            return { "label": getNewLabel(`${label}`, `${key}`), "value": "NULL" };
          } else {
            return { "label": getNewLabel(`${label}`, `${key}`), "value": sampleData[key] };
          }
        }
      });
      let myReturn = [];

      if (label.length === 0 ){
        if (Array.isArray(sampleData)){
          //console.warn('addd the array ', firstRun.reduce((acc, val) => acc.concat(val), []));
          // fix firstRun data
          const flattenDeep = (arr1) => {
            return arr1.reduce((acc, val) => Array.isArray(val) ? acc.concat(flattenDeep(val)) : acc.concat(val), []);
          }
          const xFirstRun = flattenDeep(firstRun);

          myReturn = [].concat([ { "label": sampleDataName, "value": sampleData }]).concat(xFirstRun.map((i)=>{
            //console.log(i);
            const name = i.label;
            const firstPart = name.substring(0, name.indexOf('.') > -1 ? name.indexOf('.') : undefined);
            //console.log('zzz', firstPart);
            const lastPart = name.indexOf('.') > -1 ? name.substring(name.indexOf('.')+1): "";
            //console.log('a', firstPart, lastPart);
            let newName = `${sampleDataName}[${firstPart}]`;
            if (lastPart && lastPart.length > 0){
              newName += `.${lastPart}`;
            }
            return { ...i, "label": newName };
          }));
        } else {
          // object 
          //console.warn('addd the array ', firstRun);
          // fix firstRun data
          const flattenDeep = (arr1) => {
            return arr1.reduce((acc, val) => Array.isArray(val) ? acc.concat(flattenDeep(val)) : acc.concat(val), []);
          }
          const xFirstRun = flattenDeep(firstRun);

          myReturn = [].concat([ { "label": sampleDataName, "value": sampleData }]).concat(xFirstRun.map((i)=>{
            //console.log(i);
            const name = i.label;
            const firstPart = name.substring(0, name.indexOf('.') > -1 ? name.indexOf('.') : undefined);
            //console.log('zzz', firstPart);
            const lastPart = name.indexOf('.') > -1 ? name.substring(name.indexOf('.')+1): "";
            //console.log('a', firstPart, lastPart);
            let newName = sampleDataName && sampleDataName.length > 0 ? `${sampleDataName}.${firstPart}` : `${firstPart}`;
            if (lastPart && lastPart.length > 0){
              newName += `.${lastPart}`;
            }
            return { ...i, "label": newName };
          }));
        }

      } else {
        myReturn = [].concat(firstRun);
      }

      return myReturn;
    
    } else {
      //console.warn('sample data provided to getVariableSelectData was not an object: ', sampleData === "" ? "empty string": sampleData);
      return [];
    }
  };

  let myReturn=[];
  const myData =  getObjectStuff(label, sampleData);

  const dedupArray = (myData) =>{
    let myReturn = [];
    myData.forEach((item)=>{
      if (Array.isArray(item)){
        myReturn = [].concat.apply(myReturn, item);
      } else {
        myReturn = myReturn.concat(item);
      }
    });
    return myReturn;
  };

  const hasArrayData = (myData) =>{
    return myData.reduce((p,c)=>{
      if (!p){
        if (Array.isArray(c)){
          return true;
        }
      }
      return p;
    }, false);
  };

  //console.log('mmmmmm', myData);
  myReturn = [].concat(myData);
  let bClean = true;
  let mLevels = 0;
  while (bClean && ++mLevels < 100){
    
    bClean = hasArrayData(myReturn);
    if(bClean){
      //console.log('cleaning because i still have arrays', myReturn);
      myReturn = dedupArray(myReturn);
      //console.log('after clean: ', myReturn);
    } else {
      //console.log('ssssss', bClean, myReturn);
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
const replaceVariableInput = (incomingString = "", sampleData = {}) => {
  const variableSelectData = getVariableSelectData("", sampleData);
  //swallow bad parameter
  if (typeof incomingString !== "string"){
    //console.warn("replaceVariableInput incomingString type not a string: ", typeof incomingString);
    return "";
  }

  let newInput = incomingString + "";
  // use regex to get inputs to replace 
  const regexMatches = incomingString.match(/(\+\S+)/g);

  // console.log('xxxxx', regexMatches, variableSelectData);
  // replace based on variableSelectData
  regexMatches && regexMatches.length > 0 && regexMatches.forEach((item)=>{
    
    let endPos = item.length ;
    if ( [";", ":", ",", ".", "!", "?" ].indexOf(item.charAt(item.length - 1)) !== -1){
      endPos = item.length -2;
    }
    
    const replacementName = item.substr(1, endPos); //strip off + 
    // console.log(item, item.charAt(item.length -1), item.length, endPos, replacementName);
    const replacementValue = variableSelectData.reduce((p,c,i)=>{
      // console.log('xxxx', p, c, i );
      if (!p) {
        if (c.label === replacementName) {
          return c.value;
        }
      }
      return p;
    }, undefined);
    // console.log('>>>', replacementName, replacementValue, replacementValue.length);
    if (replacementValue && replacementValue.toString().length > 0) {
      newInput = newInput.replace(new RegExp("\\+"+replacementName, 'g'), replacementValue);
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
const getContentEditableData = (sampleData) => {
  const data = getVariableSelectData("", sampleData);
  const rData = {};
  data.forEach((obj)=>{
    if (obj.label && obj.label.length > 0){
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
const getFlattenedObject = (sampleData, name) => {
  const data = getVariableSelectData("", sampleData, name);
 
  return data.map((obj)=>{
    return {"name": obj.label, "type": (typeof(obj.value) === "object" && Array.isArray(obj.value) ? "array" : typeof(obj.value)), "defaultValue": obj.value};
  });
 
};

/**
 * 
 * @description builds a object from JSON object 
 * @param {object} sampleData - JSON object to be flattened.
 * @param {stirng} name - prefix name defaults to empty 
 * @returns {array of <objects>} - array of objects in the form of {name, type, value }
 */
const buildTreeFromObject = (sampleData, prefixName="") => {
  let myReturn = [];

  const getKeyData = (keyData, prefixLabel="", level=0, label="") =>{
    //console.log('getKeyData ....', keyData, prefixLabel, level, label);
    if (!keyData){
      throw new Error('keyData invalid');
    }
    if(typeof prefixName !== "string"){
      console.warn("prefixName not a string, aborting...", prefixName);
      return [];
    }
    if (typeof(keyData) === "object"){

      // recursion
      const myChildren = Object.keys(keyData).map((k)=>{
        // is child an object 
        if (typeof(keyData[k])=== "object"){
          //console.log('zzzzz', keyData, k)
          return getKeyData(keyData[k], (Array.isArray(keyData) ? `${prefixLabel}[${k}]` : `${prefixLabel}.${k}`), level++, k);
        } else {
          //console.log('hmmmmm ', typeof(keyData[k]));
          if (Array.isArray(keyData)){ // parent is an array so doing this why 
            //console.log('>>>', prefixLabel, k, keyData )
            return {"name": `${prefixLabel}[${k}]`, "displayName":`[${k}]`, "type": typeof(keyData[k]),  "defaultValue": keyData[k], "children": []}
          } else {
            return {"name": `${prefixLabel}.${k}`, "displayName":`${k}`, "type": typeof(keyData[k]),  "defaultValue": keyData[k], "children": []}
          }
          
        }

      });
      return  {"name": prefixLabel, "displayName": label, "type": typeof(keyData) === "object" ? (Array.isArray(keyData)? "array": "object"): typeof(keyData),  "defaultValue": keyData, "children": myChildren}
    } else {
      return {"name": prefixLabel, "displayName": label, "type": typeof(keyData),  "defaultValue": keyData, "children": []}
    }
    
  }

  myReturn = myReturn.concat(getKeyData(sampleData, prefixName, 0));

  return myReturn;
 
};

/**
 *
 * @description This function takes determines if a string of dot notation matches the structure of a json object
 * @param {*} obj - valid JSON object
 * @param {*} dotNotation - JSON object dot notation for the object structure to be checked against
 * @returns {boolean} - true if the object contains the property and matching structure
 */
const objectHasOwnPropery = (obj, dotNotation) => {
  let theObj = obj;
  let theString = dotNotation;
  //invalid stringified json breaks jsonata.evaluate()
  try{
    if(obj === null || typeof obj !== "object" || typeof dotNotation !== "string"){
      console.warn("parameter type mismatch, expecting object and string got: ", typeof obj, typeof dotNotation);
      return false;
    }
    //jsonata does not like arrays as the root element. nest it in object as work-around
    if(Array.isArray(obj)){
      theObj = {
        "root": obj
      };
      theString = `root${dotNotation}`;
    }
    console.log("theString: ", theString);
    console.log("theObj: ", theObj);
    console.log("results: ", jsonata(theString).evaluate(theObj));
    if((jsonata(theString).evaluate(theObj))){
      return true
    };
    
    return false;

  } catch (error){
    //swallow error but warn
    console.warn("objectHasOwnProperty query error: ", error.hasOwnProperty("message") ? error.message : "unspecified");
    return false
  }
};

module.exports = {
  replaceVariableInput,
  getVariableSelectData,
  getContentEditableData, 
  getFlattenedObject, 
  buildTreeFromObject,
  objectHasOwnPropery
};