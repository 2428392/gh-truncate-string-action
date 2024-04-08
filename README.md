# gh-trunction-string-action

GitHub action that will truncate a passed string if it is greater than the passed max length

## Inputs

| name                       | description                                                                                |
| -------------------------- | ------------------------------------------------------------------------------------------ |
| `stringToTruncte`          | The string to truncate                                                                     |
| `maxLength`                | The max length of the returned string                                                      |
| `removeDanglingCharacters` | Remove any of the provided dangling characters. No seperation between characters e.g. -,!% |
| `truncationSymbol`         | Appends a string to the end of the truncated string to indicate truncation has occurred    |

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
          uses: 2428392/gh-truncate-string-action@v1
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
          uses: 2428392/gh-truncate-string-action@v1
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
Name: Truncate String remove multiple dangling characters

on: [ push ]

  jobs:
    truncate:
      runs-on: ubuntu-latest
      steps:
        - name: Truncate String
          uses: 2428392/gh-truncate-string-action@v1
          id: truncatedString
          with:
            stringToTruncate: 'abcdefg#-?hijklmnopqrstuvwxyz'
            maxLength: 10
            removeDanglingCharacters: '?#-'
        - name: Echo string
          run: echo ${{ steps.truncatedString.outputs.string }}
```

Will return `abcdefg`

```yaml
Name: Truncate String and apply truncation symbol

on: [ push ]

  jobs:
    truncate:
      runs-on: ubuntu-latest
      steps:
        - name: Truncate String
          uses: 2428392/gh-truncate-string-action@v1
          id: truncatedString
          with:
            stringToTruncate: 'abcde'
            maxLength: 4
            truncationSymbol: '...'
        - name: Echo string
          run: echo ${{ steps.truncatedString.outputs.string }}
```

Will return `a...`
