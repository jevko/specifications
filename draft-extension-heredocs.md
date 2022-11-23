---
title: "[DRAFT] The Jevko Syntax:  Heredoc Extension Specification"
author: "by Darius J Chuck"
date: "Draft: November 2022."
---

Extends the `Subjevko` rule from:

```abnf
Subjevko = Prefix Opener Jevko Closer
```

to:

```abnf
Subjevko = Prefix Opener Jevko Closer / Prefix Escaper "/" HeredocId "/" Heredoc "/" HeredocId "/"
```

where:

```abnf
HeredocId = *<any codepoint except "/">
Heredoc = *<any code point>
```

additionally:

* the second instance of `HeredocId` must be identical to the first 
* and `Heredoc` must not contain the sequence:

```abnf
"/" HeredocId "/"
```

where `HeredocId` is also identical to the first `HeredocId` instance.

## Examples of valid heredocs

Empty `Heredoc` with empty `HeredocId`:

```
some prefix `////
```

***

Empty `Heredoc` with `HeredocId` = `some id`

```
some prefix `/some id//some id/
```

***

Nonempty `Heredoc` with empty `HeredocId`:

```
some prefix `//heredoc contents which contain []`]//
```

in this case `Heredoc` = `` heredoc contents which contain []`] ``.

## Examples of invalid heredocs

What looks like empty Heredoc with `HeredocId` = `some id`, but the second instance of `HeredocId` (`some other id`) does not match the first:

```
some prefix `/some id//some other id/
```

in this case `/some other id/` would actually be considered part of the `Heredoc` and the second instance would be considered missing.

***

What looks like empty Heredoc with `HeredocId` = `some id`, but the `Heredoc` contains the forbidden sequence `/some id/`:

```
some prefix `/some id/content which contains /some id/ and continues until here/some id/
```

in this case `Heredoc` = `content which contains ` rather than `content which contains /some id/ and continues until here`. The remainder of the example (` and continues until here/some id/`) is actually a Suffix of the parent Jevko. 

Alternatively, if this example was to continue further like this:

```
some prefix `/some id/content which contains /some id/ and continues until here/some id/
another prefix [something else]
```

then the remainder is actually part of the Prefix of the next Subjevko, making the Prefix:

```
 and continues until here/some id/
another prefix 
```

rather than `another prefix `.