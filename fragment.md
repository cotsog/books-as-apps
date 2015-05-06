Further Notes on CSS Typography

Headings



```css
p.spread {word-spacing: 0.5em;}
p.tight {word-spacing: −0.5em;}
p.base {word-spacing: normal;}
p.norm {word-spacing: 0;}
```

```html
<p class="spread">The spaces between words in this paragraph will be increased by 0.5em.</p>
<p class="tight">The spaces between words in this paragraph will be decreased by 0.5em.</p>
<p class="base">The spaces between words in this paragraph will be normal.</p>
<p class="norm">The spaces between words in this paragraph will be normal.</p>
```

add letter and word spacing attributes to example 4

```css
p {letter-spacing: 0;}    /*  identical to 'normal'  */
p.spacious {letter-spacing: 0.25em;}
p.tight {letter-spacing: −0.25em;}
```

```html
<p>The letters in this paragraph are spaced as normal.</p>
<p class="spacious">The letters in this paragraph are spread out a bit.</p>
<p class="tight">The letters in this paragraph are a bit smashed together.</p>

```


```css
h1 {text-transform: capitalize;}
strong {text-transform: uppercase;}
p.cummings {text-transform: lowercase;}
p.raw {text-transform: none;}
```

```html
<h1>The heading-one at the beginninG</h1>
<p> By default, text is displayed in the capitalization it has in the source
document, but <strong>it is possible to change this</strong> using
the property 'text-transform'.
</p>
<p class="cummings">
For example, one could Create TEXT such as might have been Written by
the late Poet e.e.cummings.
</p>
<p class="raw">
If you feel the need to Explicitly Declare the transformation of text
to be 'none', that can be done as well.
</p>
````


