# Easy Jevko

<style>
.code {
  background-color: #222;
}
.ph {
  color: #666;
  background-color: #333;
  font-style: italic;
}
.str {
  color: #fa8;
  text-decoration: solid underline #430 4px;
}
.array {
  text-decoration: solid underline #240 4px;
}
.map {
  text-decoration: solid underline #024 4px;
}
.di {
  text-decoration: solid underline #642 4px;
}
.name {
  text-decoration: solid underline #246 4px;
}
.bad {
  color: red;
  background-color: #633;
}
.good {
  color: green;
  background-color: #363;
}
.ej {
  border-left: 4px solid #88f;
}
.ej:before {
  content: "Easy Jevko";
  display: block;
  border-bottom: 1px solid gray;
  font-style: italic;
  padding-left: 1rem;
}
.json {
  border-left: 4px solid orange;
}
.json:before {
  content: "JSON";
  display: block;
  border-bottom: 1px solid gray;
  font-style: italic;
  padding-left: 1rem;
}
.ej.bad {
  color: red;
}
.ej.good {
  color: green;
}
.ej.bad:before {
  content: "Easy Jevko: ok"
}
</style>

3 kinds of values: strings, arrays, maps.

<div class="ej"></div>
<pre class="code">
<small class="ph">value ...</small>
</pre>


## Strings

<div class="ej"></div>
<pre class="code">
<span class="str">my string</span>
</pre>

<div class="json"></div>

```json
"my string"
```

<div class="ej"></div>
<pre class="code">
<span class="str">my string with special chars: <span class="di">``</span> <span class="di">`[</span> <span class="di">`]</span></span>
</pre>

<div class="json"></div>

```json
"my string with special chars: ` [ ]"
```

## Arrays

<div class="ej"></div>
<pre class="code">
<span class="array">[<small class="ph">value 1</small>][<small class="ph">value 2</small>][<small class="ph">value 3</small>]</span>
</pre>

<div class="ej"></div>
<pre class="code">
<span class="array">[<small class="ph">value 1</small>]
[<small class="ph">value 2</small>]
[<small class="ph">value 3</small>]
</span>
</pre>

```
[<value 1>]
   [<value 2>][<value 3>]
```

<div class="ej"></div>

```
[my string 1]
[my string 2]
[my string 3]
```

<div class="ej bad"></div>
<pre class="code">
[my value]
<span class="bad">nonblank</span>
</pre>

<div class="ej good"></div>
<pre class="code">
[my value]
<span class="good">    </span>
</pre>


## Maps

<div class="ej"></div>
<pre class="code">
<span class="map">
<span class="ph">name</span> [<span class="ph">value</span>]
</span></pre>


<div class="ej"></div>
<pre class="code">
<span class="map"><span class="name">my name</span> [my value]</span>
</pre>

<div class="ej"></div>
<pre class="code">
<span class="map">    <span class="name">my name</span>     [my value]</span>
</pre>


<div class="json"></div>

```
{"my name": "my value"}
```

> BAD
```
my name [my value]
nonblank
```