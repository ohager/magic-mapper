import MagicMapper from '../src/magic-mapper'

const original = {
	A: 'valueA',
	B: [1,2,3],
	C: {
		CA: 'valueCA',
		CB: [4,5,6],
		CC: { cca: 'valueCCA', ccb: 'valueCCB'}
	}
};

test('property transformation test', () => {
	const mapper = new MagicMapper({propertyTransform: (name) => name.toLowerCase() });

	const mapped = mapper.map(original);

	expect(mapped.a).toBeDefined();
	expect(mapped.b).toBeDefined();
	expect(mapped.c.ca).toBeDefined();
	expect(mapped.c.cb).toBeDefined();
	expect(mapped.c.cc.cca).toBeDefined();
});

test('value transformation test', () => {
	const mapper = new MagicMapper({valueTransform: v => typeof(v) === 'string' ? v.toLowerCase() : v});

	const mapped = mapper.map(original);

	expect(mapped.A).toBe('valuea');
	expect(mapped.C.CA).toBe('valueca');
});

/*
test('exclusive transformation test', () => {
	const mapper = new MagicMapper({exclusive: true});

	const mapped = mapper.map(original, {A:undefined, B:undefined});

	expect(mapped.A).toBeDefined();
	expect(mapped.B).toBeDefined();
	expect(mapped.C).not.toBeDefined();
});
*/
