The `autocomplete` component decorates a text input with semantic ui attributes
and the semantic ui search plugin. It further populates html with results when
the request resolves.

> Results will be rendered in the order returned by the service.

### Backend API Configuration

As the user types, requests of the form:

`<METHOD> /<ROUTE>?<PARAM>=<userinput>` will be sent to your API. `METHOD`,
`ROUTE`, and `PARAM` may be overridden via component props.

Your API will need to respond with an array of items:

```json
[
    {
        "label": "San Francisco"
    }
]
```

```html
<press-autocomplete name="q">
    <input type="text" name="q">
</press-autocomplete>
```

If your API sends more complex objects, it may not make sense to alter your API
just for autocomplete.

Given an API like:

```json
[
    {
        "result": {
            "label": "San Francisco"
        }
    }
]
```

You can use `label-path` to tell `press-component` where to look:

```html
<press-autocomplete label-path="result.label" name="q">
    <input type="text" name="q">
</press-autocomplete>
```
