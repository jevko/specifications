# Draft
# The Jevko Syntax: Standard Grammar Specification

First Draft, January 2022.

by Darius J Chuck

© 2022 [Jevko.org](https://jevko.org)

<div style="page-break-after: always;"></div>

## Copyright Notice

Copyright © 2022 Darius J Chuck. All rights reserved.

<div style="page-break-after: always;"></div>

## Introduction and scope

Jevko is a versatile minimal syntax for encoding tree-structured information.

It can be used to define simple and portable formats and languages in a variety of domains, such as data interchange, configuration, or text markup.

Jevko is completely programming-language independent and is intended to have no inherent semantics. It is a pure syntactic building block meant to lend itself to joining together with other syntactic or semantic building blocks in a modular way.

These additional building blocks are specified separately. The purpose of this specification is only to describe the basic syntax in terms of Unicode [[Unicode]](#ref-unicode) code points, providing a reference for implementations as well as other specifications.

The formal grammar definitions in this document use the ABNF notation [[RFC 5234]](#ref-rfc-5234).

<div style="page-break-after: always;"></div>

## Valid Jevko Sequence

A valid Jevko sequence is a sequence of Unicode code points which conforms to the Jevko rule defined in this document.

## The Standard Grammar and basic rules

The Standard Grammar described here is broken down and structured for optimal human-readability and to map directly to parse trees which are particularly useful for further processing.

There are two main grammatical rules: the `Jevko` rule and the `Subjevko` rule.

The `Jevko` rule is the *start symbol* of the grammar.

It is mutually recursive with the `Subjevko` rule, making the grammar recursive as well.

All other rules are non-recursive.

The rules are described in the following sections. The first section defines rules for delimiters characteristic to Jevko. The remaining sections describe the rest of the rules, top to bottom, starting with Jevko.

<div style="page-break-after: always;"></div>

### Delimiters

The Jevko Grammar is based around three delimiters, named by the Delimiter rule:

```abnf
Delimiter = Opener / Closer / Escaper
```

The delimiters are defined as the following code points:

```abnf
Opener  = %x5b ; left square bracket 
Closer  = %x5d ; right square bracket
Escaper = %x60 ; grave accent
```

Equivalently:

```abnf
Opener  = "["
Closer  = "]"
Escaper = "`"
```

### Jevko

A `Jevko` is a sequence of zero or more `Subjevko`s followed by a `Suffix`.

```abnf
Jevko = *Subjevko Suffix
```

### Subjevko

A `Subjevko` is a `Prefix` followed by an `Opener`, followed by a `Jevko`, followed by a `Closer`.

```abnf
Subjevko = Prefix Opener Jevko Closer
```

Equivalently:

```abnf
Subjevko = Prefix "[" Jevko "]"
```

### Prefix

A `Prefix` is an alias for `Text`:

```abnf
Prefix = Text
```

This alias identifies that the `Text` is a part of a `Subjevko`. A `Prefix` is *always* followed by an `Opener`.

<div style="page-break-after: always;"></div>

### Suffix

A `Suffix` is an alias for `Text`:

```abnf
Suffix = Text
```

This alias identifies that the `Text` is a part of `Jevko`. A `Suffix` is *never* followed by an `Opener`.

### Text

`Text` is a sequence of zero or more `Symbol`s:

```abnf
Text = *Symbol
```

### Symbol

A `Symbol` is either a `Digraph` or a `Character`:

```abnf
Symbol = Digraph / Character
```

### Digraph

A `Digraph` is an `Escaper` followed by a `Delimiter`:

```abnf
Digraph = Escaper Delimiter
```

Equivalently:

```abnf
Digraph = "`" ("`" / "[" / "]")
Digraph = "``" / "`[" / "`]"
```

### Character

A `Character` is any code point which is not a `Delimiter`:

```abnf
Character = %x0-5a / %x5c / %x5e-5f / %x61-10ffff
```

<div style="page-break-after: always;"></div>

## Normative references

<a id="ref-unicode"></a>
[Unicode] The Unicode Consortium, "The Unicode Standard", the latest version, <http://www.unicode.org/versions/latest/>.

<a id="ref-rfc-5234"></a>
[RFC 5234] Crocker, D., Ed. and P. Overell, "Augmented BNF for Syntax Specifications: ABNF", STD 68, RFC 5234, DOI 10.17487/RFC5234, January 2008, <https://www.rfc-editor.org/info/rfc5234>.

## Appendix

### The Standard Grammar ABNF in one page

```abnf
; start symbol, main rule #1
Jevko = *Subjevko Suffix
; main rule #2, mutually recursive with #1
Subjevko = Prefix Opener Jevko Closer

; delimiters
Delimiter = Opener / Closer / Escaper

Opener  = %x5b ; left square bracket 
Closer  = %x5d ; right square bracket
Escaper = %x60 ; grave accent

; aliases
Suffix = Text
Prefix = Text

; text
Text = *Symbol
Symbol = Digraph / Character
Digraph = Escaper Delimiter
; Character is any code point which is not a Delimiter
Character = %x0-5a / %x5c / %x5e-5f / %x61-10ffff
```

<div style="page-break-after: always;"></div>

### Examples

A possible Jevko encoding of an abstract tree structure:

```
Prefix 1 [Suffix 1] 
Prefix 2 [
  Prefix 2.1 [Suffix 2.1] 
  Prefix 2.2 [Suffix 2.2] 
  Suffix 2
]
Prefix 3 [Suffix 3]
Suffix
```

Example part which matches the Subjevko rule:

```
Prefix 1 [Suffix 1] 
```

Example part which matches the Prefix (Text) rule:

```

  Prefix 2.1 
```

Note: all whitespace characters are matched by the rule.

Example part which matches the Suffix (Text) rule:

```
Suffix 3
```

A possible Jevko encoding of a part of the structured content of this document:

```
document [
  title [The Jevko Syntax: Standard Grammar]
  section [
    title [Copyright Notice]
    paragraph [Copyright © 2022 Darius J Chuck. All rights reserved.]
  ]
  section [
    title [Introduction and scope]
    paragraph [Jevko is a versatile minimal syntax for encoding tree-structured information.]
    paragraph [It can be used to define simple and portable formats and languages in a variety of domains, such as data interchange, configuration, or text markup.]
  ]
]
```

A possible Jevko encoding of [structured data from Wikipedia](https://en.wikipedia.org/wiki/Horse):

```
Name [Horse]

Conservation status [Domesticated]
Scientific classification [
  Kingdom [Animalia]
  Phylum [Chordata]
  Class [Mammalia]
  Order [Perissodactyla]
  Family [Equidae]
  Genus [Equus]
  Species [E. ferus]
  Subspecies [E. f. caballus]
]
Trinomial name [
  [Equus ferus caballus]
  [Linnaeus, 1758]
] 
Synonyms [at least 48 published]
```

### Etymology and pronunciation

The name *Jevko* /ˈdʒef.kɔ/ is derived from Polish *drzewko* (/ˈdʐɛf.kɔ/), meaning *small tree*.

***

© 2022 [Jevko.org](https://jevko.org)