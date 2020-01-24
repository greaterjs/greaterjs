## Introducing Greater.js

Comparisons in JavaScript can lead to confusion. That’s why you end up with tables like this to explain how equality comparisons work:

![JavaScript Operator Comparison](https://raw.githubusercontent.com/greaterjs/greaterjs/master/lib/images/simplified_equals_vanilla_js.png)

There are several problems with disorganized comparison operators in JavaScript. First, people make fun of your programming language over it! Second, it makes it hard to reason about your programs.

Why not further redesign how JavaScript’s comparison operators work?

Consider this alternate table. This is what JavaScript might look like with more consistency to its operations:

![Greater.js Operator Comparison](https://raw.githubusercontent.com/greaterjs/greaterjs/master/lib/images/simplified_equals.png)

Greater.js is a collection of custom-designed comparison functions that work across types.

##### Equality Comparison
![Greater.js Operator Comparison - Equals](https://raw.githubusercontent.com/greaterjs/greaterjs/master/lib/images/equals.png)

##### Greater Than Comparison
![Greater.js Operator Comparison - Greater Than](https://raw.githubusercontent.com/greaterjs/greaterjs/master/lib/images/greater_than.png)

## Usage

```
npm install greater
```

```
var gt = require('greater').gt;
gt([1,2,3], 2); // true
```

## Extensibility

The library was designed for extension. It can be combined with a library that compares units to support comparisons like "3lb" > "1kg". Imagine having that kind of calculation ability without library support :)

## Disclaimer

This project was quick a proof of concept to imagine what might be possible by overloading the comparison operators. I hope you're convinced that there's a lot of potential in most programming languages.

Greater.js is just for fun and is not intended for production code.

## Related links

[Don't Make JavaScript Look Worse Than It Is](http://strilanc.com/visualization/2014/03/27/Better-JS-Equality-Table.html)  
[Javascript Equality Table by dorey](http://dorey.github.io/JavaScript-Equality-Table/)  
[My Friend Just Fixed JavaScript](http://imgur.com/rWoBHj4)
