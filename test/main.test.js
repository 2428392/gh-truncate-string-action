const test = require('ava');
const { promises: fs } = require('fs');
const path = require('path');
const { EOL } = require('os');

async function assertOutput(expectation, t) {
    const filePath = path.join(__dirname, 'output');
    const contents = await fs.readFile(filePath, 'utf8');
    const uuidMatch = '[a-zA-Z0-9]{8}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{4}-[a-zA-Z0-9]{12}';
    const firstLine = `(string<<ghadelimiter_)(${uuidMatch})\n`;
    const thirdLine = `(ghadelimiter_)(${uuidMatch})`;
    const toMatch = `${firstLine}${expectation}\n${thirdLine}`;
    const regexMatch = new RegExp(toMatch, 'gm');
    t.log('toMatch', regexMatch);
    try {
        t.truthy(regexMatch.test(contents));
    } finally {
        await fs.unlink(filePath);
    }
}

test.before((t) => {
    t.context = {
        str: 'abcdefghijklmnopqrstuvwxyz',
        strWithHyphenLessThanMax: 'abcdefghi-jklmnopqrstuvwxyz',
        strWithHyphenAtMax: 'abcdefghijklmnopqrstuvwxyz-',
    };
});

test.beforeEach(async () => {
    const filePath = path.join(__dirname, 'output');
    process.env.GITHUB_OUTPUT = filePath;
    await fs.appendFile(filePath, '', { encoding: 'utf8' });
});

test.afterEach(() => {
    delete process.env.INPUT_STRINGTOTRUNCATE;
    delete process.env.INPUT_MAXLENGTH;
    delete process.env.INPUT_REMOVEDANGLINGCHARACTERS;
    delete process.env.GITHUB_OUTPUT;
    delete require.cache[require.resolve('../src/main')];
});

test.serial('returns truncated string when passed string is greater than max length', async (t) => {
    process.env.INPUT_STRINGTOTRUNCATE = t.context.str;
    process.env.INPUT_MAXLENGTH = 10;

    require('../src/main');
    await assertOutput('abcdefghij', t);
});

test.serial('returns non truncated string when string length is less than max length', async (t) => {
    process.env.INPUT_STRINGTOTRUNCATE = t.context.str;
    process.env.INPUT_MAXLENGTH = 27;
    require('../src/main');
    await assertOutput(t.context.str, t);
});

test.serial('returns non truncated string when string length is equal to max length', async (t) => {
    process.env.INPUT_STRINGTOTRUNCATE = t.context.str;
    process.env.INPUT_MAXLENGTH = 26;
    require('../src/main');
    await assertOutput(t.context.str, t);
});

test.serial('returns truncated string without dangaling hyphen', async (t) => {
    process.env.INPUT_STRINGTOTRUNCATE = t.context.strWithHyphenLessThanMax;
    process.env.INPUT_MAXLENGTH = 10;
    process.env.INPUT_REMOVEDANGLINGCHARACTERS = '-';
    require('../src/main');
    await assertOutput('abcdefghi', t);
});

test.serial('returns truncated string when length = max length but has dangaling hyphen', async (t) => {
    process.env.INPUT_STRINGTOTRUNCATE = t.context.strWithHyphenAtMax;
    process.env.INPUT_MAXLENGTH = 27;
    process.env.INPUT_REMOVEDANGLINGCHARACTERS = '-';
    require('../src/main');
    await assertOutput('abcdefghijklmnopqrstuvwxyz', t);
});

test.serial('returns truncated string without any of the provided dangling removable characters', async (t) => {
    process.env.INPUT_STRINGTOTRUNCATE = 'abcdefg#-?hijklmnopqrstuvwxyz';
    process.env.INPUT_MAXLENGTH = 10;
    process.env.INPUT_REMOVEDANGLINGCHARACTERS = '?#-';
    require('../src/main');
    await assertOutput('abcdefg', t);
});

test.serial(
    'returns truncated string without any of the provided dangling removable characters when not all removable charaters are matched',
    async (t) => {
        process.env.INPUT_STRINGTOTRUNCATE = 'abcd#-';
        process.env.INPUT_MAXLENGTH = 5;
        process.env.INPUT_REMOVEDANGLINGCHARACTERS = '?#-';
        require('../src/main');
        await assertOutput('abcd', t);
    },
);

test.serial(
    'returns truncated string with full truncation symbol appended when max length is greater than the length of the truncation symbol',
    async (t) => {
        process.env.INPUT_STRINGTOTRUNCATE = 'abcde';
        process.env.INPUT_MAXLENGTH = 4;
        process.env.INPUT_TRUNCATIONSYMBOL = '...';
        require('../src/main');
        await assertOutput('a...', t);
    },
);

test.serial(
    'returns truncation symbol only when max length is equal to the length of the truncation symbol',
    async (t) => {
        process.env.INPUT_STRINGTOTRUNCATE = 'abcde';
        process.env.INPUT_MAXLENGTH = 3;
        process.env.INPUT_TRUNCATIONSYMBOL = '...';
        require('../src/main');
        await assertOutput('...', t);
    },
);

test.serial(
    'returns partial truncation symbol when the max length is shorter than the length of the truncation symbol 1',
    async (t) => {
        process.env.INPUT_STRINGTOTRUNCATE = 'abcde';
        process.env.INPUT_MAXLENGTH = 2;
        process.env.INPUT_TRUNCATIONSYMBOL = '...';
        require('../src/main');
        await assertOutput('..', t);
    },
);

test.serial(
    'returns partial truncation symbol when the max length is shorter than the length of the truncation symbol 2',
    async (t) => {
        process.env.INPUT_STRINGTOTRUNCATE = 'abcde';
        process.env.INPUT_MAXLENGTH = 1;
        process.env.INPUT_TRUNCATIONSYMBOL = '...';
        require('../src/main');
        await assertOutput('.', t);
    },
);

test.serial('returns empty string when max length is 0', async (t) => {
    process.env.INPUT_STRINGTOTRUNCATE = 'abcde';
    process.env.INPUT_MAXLENGTH = 0;
    process.env.INPUT_TRUNCATIONSYMBOL = '...';
    require('../src/main');
    await assertOutput('', t);
});
