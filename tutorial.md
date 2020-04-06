# Introduction to D3 (Data Driven Documents)

## First, Web Stuff

To understand how to use D3, we first need to understand some basic front-end
web development concepts. There are three main languages used for front-end
web dev:

1. HTML: the content
2. Javascript: the code
3. CSS: the styling

I won't go into much detail here at all, but hopefully this provides some basic
context and serves as a quick reference for those who are completely new to the
web world.

### HTML

HTML looks something like this:

```html
<div>
    <p class="question">Hello, what is your name?</p>
    <p class="answer">Naitian</p>
    <img src="https://placekitten.com/200/300" />
</div>
```

The stuff in angle brackets (`<div>`, `<p>`, `<img>`) are **tags**. Different
tags serve different purposes. For example, `p` is for paragraph, `img` is for
image, and `div` is a generic organizational element.

Each *instance* of a tag is an element in the web page. There are two paragraph
elements in this example.

Tags can be nested, and they can have attributes (like `class` or `src`). Some
attributes are universal (almost anything can have a class) while some are more
specialized (paragraphs can't have a source, but images can).

[Here](https://developer.mozilla.org/en-US/docs/Learn/HTML/Introduction_to_HTML)
is a great resource for getting started with HTML.

### CSS

CSS is how we style our elements. It makes use of **selectors** and looks
something like this:
```css
p {
    font-family: "Helvetica Neue", sans-serif;
    font-size: 16px;
}

.question {
    color: blue;
}
```

Selectors can be tag names, class names, IDs, and a lot more. In this example,
we selected all paragraph elements with the `p` selector and set their font and
font size. Then, we selected only the question by using the `.question` selector
(`.` is how we select by class), and we set its color.

[This](https://developer.mozilla.org/en-US/docs/Learn/CSS) is a good document to
learn more about CSS.

### Javascript

Javascript is where the coding happens. It's how we make things interactive and
where we do all the data manipulation and processing. Javascript is how we
insert _logic_ into our website.

It looks something like this:
```js
window.onload = function () {
  const el = document.querySelector(".question");
  let txt = el.innerText;
  txt = txt + "?";
  console.log("Hello");
}
```

There are two ways of declaring variables: `const` and `let`. `const` is used
if you don't plan on reassigning the variable (i.e. it won't ever be on the left
side of an equal side again). `let` is used for when you do.

Semicolons at the end of lines are optional but recommended.

`console.log` is the JS equivalent of Python's `print`. Very useful for
debugging!

`document` and `window` are globals you have access to whenever you run
Javascript from a web browser. `document` gives you access to the HTML elements
on the page (we assign `el` the element with class `question` by querying the
document with its CSS selector).

[Here](https://developer.mozilla.org/en-US/docs/Learn/JavaScript) is a great
intro to Javascript. I highly recommend you give this a read if this is the
first time you're using Javascript.


## Now, D3

### An Introduction
D3 is a Javascript library used for interactive visualizations. It was developed
by Mike Bostock during his PhD at Stanford. He went on to work at the New York
Times, where he led data visualization projects and developed interactive
articles.

### Setup

First step, we need to import the D3 library. Since we're not using any build
tools (don't worry if you don't know what those are), we just include a link to
the script in the HTML file. We'll also include our own Javascript code (located
in `./js/visualizations.js`) and our own CSS.

Finally, we add a `figure` tag to the body. This will be where our visualization
lives. Notice that it's completely empty. We'll be filling it in using
Javascript.

```html
<head>
    ... other stuff
    <script src="https://d3js.org/d3.v5.min.js"></script>
    <script src="./js/visualization.js" charset="utf-8"></script>
    <link rel="stylesheet" href="./css/visualization.css" type="text/css" />
</head>
<body>
    <figure class="vis"></figure>
</body>
```

This will be basically the last time we touch the HTML file. All our work will
be done in Javascript.

In the Javascript, I've already added a block of code:
```js
window.onload = function () {
  console.log("Hello");
}
```
I like to keep this as a sanity check, because I frequently forget to include
the Javascript file. Now, we can view the web page.

I like to serve my files locally using
```sh
python3 -m http.server -p 8000
```
This will try to serve your current directory on `localhost:8000`. Run the
command, then open your web browser and navigate to `localhost:8000`.

You should see an empty page, but if you open your browser developer tools
(Inspect Element) and find the console, you should see "Hello" printed.

### D3 Conceptually

D3 gives us a way to easily bind together our data and our DOM (read: web page)
elements. We can use our data to assign properties to DOM elements like
position, color, size, etc.

It also includes a lot of helper functions to make working with data and
creating complex visualizations a lot easier. It has implemented some very
interesting algorithms like force simulations (for spacing things out) and
Voronoi diagrams (for finding equidistant boundaries) so that you don't have to.

We'll be making our visualizations using SVGs. SVGs are a vector image format
whose elements we can interact with very similarly to DOM elements.

### Set Up for Success

First we'll want to insert an SVG tag into the `figure`. We can do this using by
first selecting the parent element (the `figure.vis`) and then appending an
`svg` element.
```js
const svg = d3.select("figure.vis").append("svg")
```
Frequently, when we make visualizations, we want to include axes, titles,
labels, etc.

We want our figure to contain all of these external elements, but when we plot,
we don't want to have to deal with this when calculating coordinates of
elements. That's why we use the margin pattern.

First, let's take a look at what we already have:
```js
svg.attr("style", "background-color: #eee");
```
Now, suppose we want a figure with size 200px by 100px and a margin of 50px.
We'll make the SVG element large enough to contain everything, then add a `g`
element.
```js
svg.attr("viewBox", "0 0 300 200"); // sets SVG size to 50 + 200 + 50, 50 + 300 + 50
const g = svg.append("g").attr("transform", "translate(50, 50)");
```
Now, we can add a couple of circles to our plot:
```js
g.append("circle")       // add the circle
 .attr("r", 1)           // give it radius 1
 .attr("fill", "black")  // make its color black
 .attr("cx", 50)         // center x = 50px right
 .attr("cy", 20);        // center y = 20px down

g.append("circle")       // add the circle
 .attr("r", 1)           // give it radius 1
 .attr("fill", "black")  // make its color black
 .attr("cx", 0)          // center x = "origin"
 .attr("cy", 0);         // center y = "origin"
```
Note that the origin is the top left corner, and grows positively down and to
the right.

If we want to make our points bigger, we can actually select all of the circles
at once.
```js
g.selectAll("circle").attr("r", 5);
```
I've put a helper setup function in the code which create the SVG and G elements
with the proper sizes and offsets.

To use this, pass in an element object for `el`, your desired width and height,
and an object representing margins:
```
{
    left: 10,
    right: 10,
    top: 20,
    bottom: 20
}
```

### Playing with Data

We can fetch CSV data using `d3.csv`.
```js
d3.csv("./data/listings.csv").then(d => console.log(d));
```
Confused about the `then`? See this
[reference](https://developer.mozilla.org/en-US/docs/Learn/JavaScript/Asynchronous/Promises)
for more about asynchronous code and promises.
