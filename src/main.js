const core = require('@actions/core');

function checkAndRemoveDangling(removableCharacters, str) {
    const stringLength = str.length;
    let mutatedString;
    if (removableCharacters.includes(str.charAt(stringLength - 1))) {
        mutatedString = str.slice(0, -1);
    } else {
        return str;
    }
    return checkAndRemoveDangling(removableCharacters, mutatedString);
}

function main() {
    const stringToTruncate = core.getInput('stringToTruncate', {
        required: true,
    });
    const maxLength = core.getInput('maxLength', { required: true });
    const danglingCharactersInput = core.getInput('removeDanglingCharacters', { required: false });
    const danglingCharacters = [...danglingCharactersInput];
    const truncationSymbol = core.getInput('truncationSymbol', { required: false });

    let acceptableString = stringToTruncate;
    if (stringToTruncate.length > maxLength) {
        if (truncationSymbol) {
            if (truncationSymbol.length > maxLength) {
                acceptableString = truncationSymbol.substring(0, maxLength);
            } else {
                acceptableString =
                    stringToTruncate.substring(0, maxLength - truncationSymbol.length) + truncationSymbol;
            }
        } else {
            acceptableString = stringToTruncate.substring(0, maxLength);
        }
    }

    if (danglingCharacters.length && !truncationSymbol) {
        acceptableString = checkAndRemoveDangling(danglingCharacters, acceptableString);
    }

    core.setOutput('string', acceptableString);
}

main();
