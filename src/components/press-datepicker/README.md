The `datepicker` component is a single-value input datepicker. See
[http://daterangepicker.com/](http://daterangepicker.com/) for styling
instructions. Any `input[type="date"]` is automatically enhanced with
`datepicker`.

### Basic Use

```html
<press-datepicker name="my_date">
    <press-noscript>
        <input type="date" name="my_date" />
    </press-noscript>
</press-datepicker>
```

with prefilled date:

```html
<press-datepicker name="my_date" value="2022-01-01">
    <press-noscript>
        <input type="date" name="my_date" value="2022-01-01" />
    </press-noscript>
</press-datepicker>
```

### Inferrence

The `<press-datepicker>` is automatically applied to any date input on the page:

```html
<input type="date" name="start" />
```

effectively becomes

```html
<press-datepicker v-model="start">
    <press-noscript>
        <input type="date" name="start" />
    </press-noscript>
</press-datepicker>
```
