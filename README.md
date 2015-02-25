## Introducing Greater.js

Comparisons in JavaScript are finicky and can lead to confusion. That’s why you end up with tables like this to explain how equality comparisons work:

![JavaScript Operator Comparison](https://raw.githubusercontent.com/greaterjs/greaterjs/master/lib/images/simplified_equals_vanilla_js.png)

There are several problems with disorganized comparison operators in JavaScript. First, people make fun of your programming language over it. Second, it makes it hard to reason about your programs.

And these equality tables, despite their seeming complexity, are actually process improvements, compared to having to keep all the relationships straight in your head.

Aside: we’ve been keeping up with the dynamic visualization work of people like Bret Victor and took the opportunity here to do some visualization-driven development: starting with the visualization first and using it as a spec for the code. 

Douglas Crockford clarified much ambiguity around comparisons with the conceptions of “truthy” and “falsy”, helping us equate groups of similar comparisons. So why not further redesign how JavaScript’s comparison operators work, so that you can reason more comfortably about how your programs work?

Like so:

![Greater.js Operator Comparison](https://raw.githubusercontent.com/greaterjs/greaterjs/master/lib/images/simplified_equals.png)

Anyone who uses JavaScript could make use of this. For example, you could compare the string ‘yes’ to the string ‘true’ without a problem.

greater.js is, in short, is a collection of custom-designed comparison functions that work across types, like array comparisons and number comparisons. These functions borrow concepts from comparison in Python, PHP, and elsewhere to make JavaScript comparison both more powerful and easier to think about.

And even more values and operators are supported and managed via greater.js. For example:

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

## Coming Soon:

We're making greater.js exensible so you can arbitrarily extend your comparison operators. (also so the project doesn't evolve into something large). Imagine being able to do things like: "3lb" > "1kg". We'd like to eventually tackle the type issues in the mathematical operators as well.

## Related links:

![Javascript Equality Table by dorey](http://dorey.github.io/JavaScript-Equality-Table/)  


This is a project of 140 Proof Labs.
