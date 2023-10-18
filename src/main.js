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
    let text = core.getInput('stringToTruncate', {
        required: true,
    });
    const maxLength = core.getInput('maxLength', { required: true });
    const danglingCharactersInput = core.getInput('removeDanglingCharacters', { required: false });
    const danglingCharacters = [...danglingCharactersInput];
    const truncationSymbol = core.getInput('truncationSymbol', { required: false });

    if (text.length > maxLength) {
        if (truncationSymbol) {
            if (truncationSymbol.length > maxLength) {
                text = truncationSymbol.substring(0, maxLength);
            } else {
                text = text.substring(0, maxLength - truncationSymbol.length) + truncationSymbol;
            }
        } else {
            text = text.substring(0, maxLength);
        }
    }

    if (danglingCharacters.length && !truncationSymbol) {
        text = checkAndRemoveDangling(danglingCharacters, text);
    }

    core.setOutput('string', text);
}

main();
