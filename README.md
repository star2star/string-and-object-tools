# Star2Star Communications String and Object Tools

## Installation

```bash
npm install string-and-object-tools --save
```

## Usage

```javascript
import stringTools from "string-and-object-tools";

```
If you see the following error when using the SDK:
 
```javascript
ReferenceError: regeneratorRuntime is not defined
```
You need to require or import babel polyfill it at the top of the entry point to your application.
```javascript
require("babel-polyfill");
```
## Methods

[Please click here for our documentation pages.](https://star2star.github.io/string-and-object-tools/ "Star2Star Communications String and Object Tools Documentation")

## Changes
* 0.0.1 - initial setup
* 0.0.2 - fixed issue with package.json main ... must be lib/index.js
* 0.0.3 - new method for contenteditible components
* 0.0.4 - missing stuff
* 0.0.5 - fixed and added new method called getFlattenedObject
* 0.0.6 - handle arrays as root element
* 0.0.7 - update bable
* 0.0.8 - fixed bug with flattened object with main object
* 0.0.9 - add more unit tests for error conditions
* 0.0.10 - buildTreeFromObject
* 0.0.11 - objectHasOwnProperty
* 0.0.12 - buildTreeFromApplication
* 0.0.13 - fix bug with versions 
* 0.0.14 - objectHasOwnProperty 
* 0.0.15 - null objects fix 
* 0.0.16 - fix to publish bad stuff 
* 0.0.17 - fix to null object take 2 
* 0.0.18 - fix issue with buildTreeFromApplication - defaultValue was object but string type 
* 0.0.19 - bug with buildTee from object missing prefixName 