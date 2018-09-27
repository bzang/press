A bit more complicated than the `datepicker`, the `daterangepicker` helps your
users select a range of dates. To use it, you'll need to provide html of the
following form.

```html
<div>
  <div>
    <label for="START_ID">START_LABEL</label>
    <input id="START_ID" name="START_NAME" placeholder="START_PLACEHOLDER" type="date">
  </div>
  <div>
    <label for="END_ID">END_LABEL</label>
    <input id="END_ID" name="END_NAME" placeholder="END_PLACEHOLDER" type="date">
  </div>
</div>
```

### Basic Use

```html
<press-daterangepicker start-key="start_date" end-key="end_date">
    <press-noscript>
        <input type="date" name="start_date" />
        <input type="date" name="end_date" />
    </press-noscript>
</press-daterangepicker>
```

with pre-filled dates:

```html
<press-daterangepicker
    start-key="start_date"
    end-key="end_date"
    value='{"start_date":"2022-01-01","end_date":"2022-02-02"}'
>
    <press-noscript>
        <input type="date" name="start_date" value="2022-01-01" />
        <input type="date" name="end_date" value="2022-01-02" />
    </press-noscript>
</press-daterangepicker>
```

> note the apostrophes instead of quotes for `press-daterangepicker.value`. This
> isn't quite valid Vue syntax, but it's interpreted during the PRESS
> bootstrapping process. We intend to change this to be more HTML- and Vue-
> compliant in the future, but this seems to work for now.

### Usage with Simple Form

```html
<press-daterangepicker
    name="my_date_range"
    start-key="start_date"
    end-key="end_date"
>
    <input type="date" name="my_date_range[start_date]" />
    <input type="date" name="my_date_range[end_date]" />
</press-daterangepicker>
```

with pre-filled dates:

```html
<press-daterangepicker
    name="my_date_range"
    start-key="start_date"
    end-key="end_date"
    value='{"date_rangepicker_form[start_date]":"2022-01-01","date_rangepicker_form[end_date]":"2022-02-02"}'
>
    <press-noscript>
        <input type="date" name="my_date_range[start_date]" value="2022-01-01" />
        <input type="date" name="my_date_range[end_date]" value="2022-01-02" />
    </press-noscript>
</press-daterangepicker>
```

> Again, note the apostrophes instead of quotes.
