# gh-trunction-string-action

GitHub action that will truncate a passed string if it is greater than the passed max length

## Inputs

| name              | description                           |
| ----------------- | ------------------------------------- |
| `stringToTruncte` | The string to truncate                |
| `maxLength`       | The max length of the returned string |

## Outputs

| name     | description          |
| -------- | -------------------- |
| `string` | The truncated string |

## Usage

```yaml
Name: Truncate String

on: [ push ]

  jobs:
    truncate:
      runs-on: ubuntu-latest
      steps:
        - name: Truncate String
          uses: 2428392/gh-truncate-string-action@v1.0.0
          id: truncatedString
          with:
            stringToTruncate: 'abcdefghijklmnopqrstuvwxyz'
            maxLength: 10
        - name: Echo string
          run: echoa ${{ steps.truncatedString.outputs.string }}
```
