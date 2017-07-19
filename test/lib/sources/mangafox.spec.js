import Mangaka from '../../../src';

let originalTimeout;
describe('Manga Object Construction', () => {

    beforeEach(() => {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });

    test('Should pass if source is implemented', () => {
        const mangafox = new Mangaka({ source:'mangafox'});
        return mangafox.fromSource().then((api) => {
            expect(api).toEqual(expect.objectContaining({
                options: expect.any(Object)
            }));
        });
    });

    afterEach(() => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });
});

describe('getIndex', function () {
    beforeEach(() => {
        originalTimeout = jasmine.DEFAULT_TIMEOUT_INTERVAL;
        jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000;
    });

    test('should return index response when getIndex is called', (done) => {
        const mangafox = new Mangaka({ source:'mangafox'});
        return mangafox.fromSource().then((api) => {
            return api.getIndex().then((result) => {
                expect(result.data).toEqual(expect.any(Array));
                done()
            });
        });
    });

    test('should return index title object in the correct structure', () => {
        const mangafox = new Mangaka({ source:'mangafox'});
        return mangafox.fromSource().then((api) => {
            return api.getIndex().then((result) => {
                const title = result.data[0];
                expect(title).toHaveProperty('m_id');
                expect(title).toHaveProperty('title');
                expect(title).toHaveProperty('url');
                expect(title).toHaveProperty('url_name');
                expect(title).toHaveProperty('is_ongoing');
                expect(title).toHaveProperty('cover._s');
            });
        });
    });

    afterEach(() => {
        jasmine.DEFAULT_TIMEOUT_INTERVAL = originalTimeout;
    });
});