---
title: "The Jevko Syntax: Extensions Specification"
author: "by Darius J Chuck"
date: "First Draft: January 2024."
---

These extensions complement the [specification](spec-standard-grammar.md).

# FencedText

A Jevko extension which enables arbitrary text without escaping, 
delimited similarly to fenced code blocks in Markdown.

## Status

This extension is strongly recommended for implementation in all Jevko processors.

<!-- todo: syntax highlighting maybe -->

## Examples

Some examples of valid Jevkos using this extension:

```
`'hello'`
```

````
```'
some
lines
with [arbitrary] `characters`
'```
````

```
[`'hello'`]

[```'
some
lines
with [arbitrary] `characters`
'```]
```

Note that there is no whitespace or any other characters before and after the enclosing quotes in any of these examples.

These are also valid, but not recommended:

```
`'hello'`[]

[]```'
some
lines
with [arbitrary] `characters`
'```
```

## Formal definition

We will now formally define the `FencedText` extension in ABNF.

We change the definition of the Jevko Text rule as follows:

```abnf
Text = FencedText / OpenText
```

where `OpenText` is defined the same as the original `Text` rule:

```abnf
OpenText = *Symbol
```

and the new `FencedText` rule is defined as:

```abnf
FencedText = FencedText_1
           / FencedText_3
           / FencedText_5
           / FencedText_7
           / FencedText_9
           / FencedText_11
           / FencedText_13
           / FencedText_15

FencedText_1  = "`'" FencedContent_1 "'`"
FencedText_3  = "```'" FencedContent_3 "'```"
FencedText_5  = "`````'" FencedContent_5 "'`````"
FencedText_7  = "```````'" FencedContent_7 "'```````"
FencedText_9  = "`````````'" FencedContent_9 "'`````````"
FencedText_11 = "```````````'" 
                FencedContent_11 
                "'```````````"
FencedText_13 = "`````````````'" 
                FencedContent_13 
                "'`````````````"
FencedText_15 = "```````````````'" 
                FencedContent_15 
                "'```````````````"

FencedContent_1  = *AnyCodepoint 
  ; can't contain "'`" ("[" / "]" / EOF)
FencedContent_3  = *AnyCodepoint 
  ; can't contain "'```" ("[" / "]" / EOF)
FencedContent_5  = *AnyCodepoint 
  ; can't contain "'`````" ("[" / "]" / EOF)
FencedContent_7  = *AnyCodepoint 
  ; can't contain "'```````" ("[" / "]" / EOF)
FencedContent_9  = *AnyCodepoint 
  ; can't contain "'`````````" ("[" / "]" / EOF)
FencedContent_11 = *AnyCodepoint 
  ; can't contain "'```````````" ("[" / "]" / EOF)
FencedContent_13 = *AnyCodepoint 
  ; can't contain "'`````````````" ("[" / "]" / EOF)
FencedContent_15 = *AnyCodepoint 
  ; can't contain "'```````````````" ("[" / "]" / EOF)

; any Unicode codepoint
AnyCodepoint = %x0-10ffff
```

## Detailed formal definition

<!-- note: this is for completeness/detail -->

`FencedText` is abstractly defined as follows.

We'll use ABNF with some necessary additions which will be explained as we go.

```abnf
FencedText(n) = {n}Escaper Fencer 
                FencedContent(n) 
                Fencer {n}Escaper
```

where:

<!-- todo: math like $n > 0 && n <= 15 && n % 2 == 1$ -->
* `n > 0 && n <= 15 && n % 2 == 1`
  * in other words `n ∈ {1, 3, 5, 7, 9, 11, 13, 15}`
  * *the reason even numbers are excluded is backwards compatibility*
* `{n}Rule` means `Rule` repeated exactly `n` times

The upper limit of 15 for n is chosen conservatively for now. It may be extended in the future.

Note: `FencedText(n)` is technically not a valid ABNF rule. Rather, from a formal point of view it is a hyperrule with one parameter (`n`).

Similarly, `FencedContent(n)` is a hyperrule which matches an almost arbitrary sequence of codepoints:

```abnf
FencedContent(n) = *AnyCodepoint
```

where:

* `AnyCodepoint` means any Unicode codepoint (`%x0-10ffff`)
* `FencedContent(n)` can't contain the sequence `Fencer {n}Escaper (Opener / Closer / EOF)`
  * which is our closing delimiter/fence
  * `EOF` matches the End Of Input

Put in practical terms: we have to parse the input lazily, matching the rule as soon as we find the closing fence.

Now we define:

```abnf
Fencer = "'"
```

Equivalently:

```abnf
Fencer = %x27 ; apostrophe
```

So we can restate the rule more concretely:

```abnf
FencedText(n) = {n}"`" "'" FencedContent(n) "'" {n}"`"
```

* so `FencedContent(n)` can't contain `` "'" {n}"`" ("[" / "]" / EOF) ``

Finally, we can expand the hyperrules into multiple concrete pure-ABNF rules:

```abnf
FencedText = FencedText_1 
           / FencedText_3 
           / FencedText_5 
           / ... 
           / FencedText_15

FencedText_1 = "`'" FencedContent_1 "'`"
FencedText_3 = "```'" FencedContent_3 "'```"
FencedText_5 = "`````'" FencedContent_5 "'`````"
...
FencedText_15 = "```````````````'" 
                FencedContent_15 
                "'```````````````"

FencedContent_1 = *AnyCodepoint  
  ; can't contain "'`" ("[" / "]" / EOF)
FencedContent_3 = *AnyCodepoint  
  ; can't contain "'```" ("[" / "]" / EOF)
FencedContent_5 = *AnyCodepoint  
  ; can't contain "'`````" ("[" / "]" / EOF)
...
FencedContent_15 = *AnyCodepoint 
  ; can't contain "'```````````````" ("[" / "]" / EOF)
```

# TaggedText

A Jevko extension which enables arbitrary text without escaping, 
delimited similarly to heredocs or dollar quoted literals in PostgreSQL.

Even though this extension is technically independent, this description assumes `FencedText` has been implemented as well.

## Status

This extension is experimental and its specification may change in the future.

## Examples

Some examples of valid Jevkos using this extension:

```
`//hello//
```

````
`/tag/
some
lines
with [arbitrary] `characters`
/tag/
````

```
[`//hello//]

[`/end/
some
lines
with [arbitrary] `characters`
/end/]
```

These are also valid, but not recommended:

```
`//hello//[]

[]`/end/
some
lines
with [arbitrary] `characters`
/end/
```

## Formal definition

The `TaggedText` extension is formally defined similarly to `FencedText` (therefore see the definition of `FencedText` for more details).

We further extend the `Text` rule, assuming we've already added `FencedText`:

```abnf
Text = TaggedText / FencedText / OpenText
```

Exhaustive definition of `TaggedText` in terms of pure ABNF rules is not viable, as the rule admits an enormous number of unique user-defined tags to use as delimiters.

Because of that, we only show ABNF definitions only for a few example tags, namely the empty tag, `END`, and `done`.

```abnf
TaggedText = TaggedText_ 
           / TaggedText_END 
           / TaggedText_done 
           / ...

TaggedText_     = "`//" TaggedContent_ "//"
TaggedText_END  = "`/END/" TaggedContent_END "/END/"
TaggedText_done = "`/done/" TaggedContent_done "/done/"
...

TaggedContent_     = *AnyCodepoint
  ; can't contain "//" ("[" / "]" / EOF)
TaggedContent_END  = *AnyCodepoint
  ; can't contain "/END/" ("[" / "]" / EOF)
TaggedContent_done = *AnyCodepoint
  ; can't contain "/done/" ("[" / "]" / EOF)
...
```

## Detailed formal defintion

Abstractly we define two hyperrules:

```abnf
TaggedText(Tag) = Escaper Tagger Tag Tagger 
                  TaggedContent(Tag) 
                  Tagger Tag Tagger

TaggedContent(n) = *AnyCodepoint
```

where `TaggedContent(Tag)` can't contain `Tagger Tag Tagger (Opener / Closer / EOF)`.

Now we define:

```abnf
Tagger = "/"
```

Equivalently:

```abnf
Tagger = %x2f ; slash
```

and:

```abnf
Tag = *255(ALPHA / DIGIT / "_")
```

Equivalently:

```abnf
Tag = 0*255(%x41–5A / %x61–7A / %x30–39 / %x5f)
```

or, using a regular expression: 

```regexp
Tag = /[a-zA-Z0-9_]{0,255}/
```

In other words `Tag` is an identifier of length 0-255 characters which can contain only alphanumeric characters and underscores.

Note: the tag length is currently limited to 255. If need be, this maximum length as well as the allowed characters may be extended in the future.

Now we can restate the hyperrule more concretely:

```abnf
TaggedText(Tag) = "`/" Tag "/" 
                  TaggedContent(Tag) 
                  "/" Tag "/"
```

where `TaggedContent(Tag)` can't contain `"/" Tag "/" ("[" / "]" / EOF)`.

Finally, we can expand this into a very large number of pure ABNF rules:

```abnf
TaggedText = TaggedText_ 
           / TaggedText_END 
           / TaggedText_done 
           / ...

TaggedText_     = "`//" TaggedContent_ "//"
TaggedText_END  = "`/END/" TaggedContent_END "/END/"
TaggedText_done = "`/done/" TaggedContent_done "/done/"
...

TaggedContent_     = *AnyCodepoint
  ; can't contain "//" ("[" / "]" / EOF)
TaggedContent_END  = *AnyCodepoint
  ; can't contain "/END/" ("[" / "]" / EOF)
TaggedContent_done = *AnyCodepoint
  ; can't contain "/done/" ("[" / "]" / EOF)
...
```
