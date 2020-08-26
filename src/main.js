const core = require('@actions/core');

function main() {
  const stringToTruncate = core.getInput('stringToTruncate', {
    required: true,
  });
  const maxLength = core.getInput('maxLength', { required: true });
  if (stringToTruncate.length > maxLength) {
    core.setOutput('string', stringToTruncate.substr(0, maxLength));
  } else {
    core.setOutput('string', stringToTruncate);
  }
}

main();
