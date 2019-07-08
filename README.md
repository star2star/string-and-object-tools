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