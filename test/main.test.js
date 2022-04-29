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
    strWithHyphenLessThanMax: 'abcdefghi-jklmnopqrstuvwxyz',
    strWithHyphenAtMax: 'abcdefghijklmnopqrstuvwxyz-',
  };
});

test.beforeEach(() => {
  sinon.stub(process.stdout, 'write');
});

test.afterEach(() => {
  delete process.env.INPUT_STRINGTOTRUNCATE;
  delete process.env.INPUT_MAXLENGTH;
  delete process.env.INPUT_REMOVEDANGLINGCHARACTERS;
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

test.serial(
  'returns truncated string without dangaling hyphen',
  (t) => {
    process.env.INPUT_STRINGTOTRUNCATE = t.context.strWithHyphenLessThanMax;
    process.env.INPUT_MAXLENGTH = 10;
    process.env.INPUT_REMOVEDANGLINGCHARACTERS = '-';
    require('../src/main');
    assertOutput('abcdefghi', t);
  },
);

test.serial(
  'returns truncated string when length = max length but has dangaling hyphen',
  (t) => {
    process.env.INPUT_STRINGTOTRUNCATE = t.context.strWithHyphenAtMax;
    process.env.INPUT_MAXLENGTH = 27;
    process.env.INPUT_REMOVEDANGLINGCHARACTERS = '-';
    require('../src/main');
    assertOutput('abcdefghijklmnopqrstuvwxyz', t);
  },
);

test.serial(
  'returns truncated string without any of the provided dangling removable characters',
  (t) => {
    process.env.INPUT_STRINGTOTRUNCATE = 'abcdefg#-?hijklmnopqrstuvwxyz';
    process.env.INPUT_MAXLENGTH = 10;
    process.env.INPUT_REMOVEDANGLINGCHARACTERS = '?#-';
    require('../src/main');
    assertOutput('abcdefg', t);
  },
);

test.serial(
  'returns truncated string without any of the provided dangling removable characters when not all removable charaters are matched',
  (t) => {
    process.env.INPUT_STRINGTOTRUNCATE = 'abcd#-';
    process.env.INPUT_MAXLENGTH = 5;
    process.env.INPUT_REMOVEDANGLINGCHARACTERS = '?#-';
    require('../src/main');
    assertOutput('abcd', t);
  },
);
