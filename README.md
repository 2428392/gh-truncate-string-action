# gh-trunction-string-action

GitHub action that will truncate a passed string if it is greater than the passed max length

## Inputs

| name                             | description                                                                                |
| -------------------------------- | ------------------------------------------------------------------------------------------ |
| `stringToTruncte`                | The string to truncate                                                                     |
| `maxLength`                      | The max length of the returned string                                                      |
| `removeDanglingCharacters`       | Remove any of the provided dangling characters. No seperation between characters e.g. -,!% |

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
          uses: 2428392/gh-truncate-string-action@v1.1.0
          id: truncatedString
          with:
            stringToTruncate: 'abcdefghijklmnopqrstuvwxyz'
            maxLength: 10
        - name: Echo string
          run: echo ${{ steps.truncatedString.outputs.string }}
```

Will return `abcdefghij`

```yaml
Name: Truncate String remove single dangling character

on: [ push ]

  jobs:
    truncate:
      runs-on: ubuntu-latest
      steps:
        - name: Truncate String
          uses: 2428392/gh-truncate-string-action@v1.1.0
          id: truncatedString
          with:
            stringToTruncate: 'abcdefghi-jklmnopqrstuvwxyz'
            maxLength: 10
            removeDanglingCharacters: '-'
        - name: Echo string
          run: echo ${{ steps.truncatedString.outputs.string }}
```

Will return `abcdefghi`

```yaml
Name: Truncate String remove muiltiple dangling characters

on: [ push ]

  jobs:
    truncate:
      runs-on: ubuntu-latest
      steps:
        - name: Truncate String
          uses: 2428392/gh-truncate-string-action@v1.1.0
          id: truncatedString
          with:
            stringToTruncate: 'abcdefg#-?hijklmnopqrstuvwxyz'
            maxLength: 10
            removeDanglingCharacters: '?#-'
        - name: Echo string
          run: echo ${{ steps.truncatedString.outputs.string }}
```

Will return `abcdefg`
