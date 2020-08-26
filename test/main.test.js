const test = require('ava');
const sinon = require('sinon');
const { EOL } = require('os');

function assertOutput(expectation, t) {
  t.truthy(process.stdout.write.called);
  t.truthy((process.stdout.write.callCount = 1));
  t.truthy(
    process.stdout.write.calledWith(
      `::set-output name=string::${expectation}${EOL}`,
    ),
  );
}

test.before((t) => {
  t.context = {
    str: 'abcdefghijklmnopqrstuvwxyz',
  };
});

test.beforeEach(() => {
  sinon.stub(process.stdout, 'write');
});

test.afterEach(() => {
  delete process.env.INPUT_STRINGTOTRUNCATE;
  delete process.env.INPUT_MAXLENGTH;
  sinon.restore();
  delete require.cache[require.resolve('../src/main')];
});

test.serial(
  'returns truncated string when passed string is greater than max length',
  (t) => {
    process.env.INPUT_STRINGTOTRUNCATE = t.context.str;
    process.env.INPUT_MAXLENGTH = 10;
    require('../src/main');
    assertOutput('abcdefghij', t);
  },
);

test.serial(
  'returns non truncated string when string length is less than max length',
  (t) => {
    process.env.INPUT_STRINGTOTRUNCATE = t.context.str;
    process.env.INPUT_MAXLENGTH = 27;
    require('../src/main');
    assertOutput(t.context.str, t);
  },
);

test.serial(
  'returns non truncated string when string length is equal to max length',
  (t) => {
    process.env.INPUT_STRINGTOTRUNCATE = t.context.str;
    process.env.INPUT_MAXLENGTH = 26;
    require('../src/main');
    assertOutput(t.context.str, t);
  },
);
