const assert = require('assert');

const Validator = require('../../../entities/Validator');

describe('Validator', () => {
    describe('#isInvalid()', () => {
        it('should return TRUE when parameter obj contains undefined, null, or empty', () => {
            assert.strictEqual(Validator.isInvalid({key: undefined}), true);
            assert.strictEqual(Validator.isInvalid({key: null}), true);
            assert.strictEqual(Validator.isInvalid({key: ''}), true);
            assert.strictEqual(Validator.isInvalid({key1: 'mike', key2: undefined}), true);
            assert.strictEqual(Validator.isInvalid({key1: 'mike', key2: null}), true);
            assert.strictEqual(Validator.isInvalid({key1: 'mike', key2: ''}), true);
        });

        it('should return FALSE when parameter obj NOT contains undefined, null, or empty', () => {
            assert.strictEqual(Validator.isInvalid({key: 'mike'}), false);
            assert.strictEqual(Validator.isInvalid({key1: 'mike', key2: 'secret'}), false);
        });
    });
});