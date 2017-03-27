import MagicMapper from '../src/magic-mapper'

const original = {
	A: 'valueA',
	B: [1,2,3],
	C: {
		CA: 'valueCA',
		CB: [4,5,6],
		CC: { cca: 'valueCCA', ccb: 'valueCCB'}
	},
	D: [{da:1},{db:'valueDDB'}]
};

test('global property transformation test', () => {
	const mapper = new MagicMapper({propertyTransform: (name) => name.toLowerCase() });

	const mapped = mapper.map(original);

	expect(mapped.a).toBeDefined();
	expect(mapped.b).toBeDefined();
	expect(mapped.c.ca).toBeDefined();
	expect(mapped.c.cb).toBeDefined();
	expect(mapped.c.cc.cca).toBeDefined();
});

test('global value transformation test', () => {
	const mapper = new MagicMapper({valueTransform: v => typeof(v) === 'string' ? v.toLowerCase() : v});

	const mapped = mapper.map(original);

	expect(mapped.A).toBe('valuea');
	expect(mapped.B).toEqual([1,2,3]);
	expect(mapped.C.CA).toBe('valueca');
	expect(mapped.C.CB).toEqual([4,5,6]);
	expect(mapped.C.CC).toEqual({cca:'valuecca', ccb: 'valueccb'});
	expect(mapped.D).toEqual([{da:1},{db: 'valueddb'}]);
});

test('mapping test', () => {
	const mapper = new MagicMapper();

	const mapped = mapper.map(original);

	expect(mapped.A).toBe('valueA');
	expect(mapped.B).toEqual([1,2,3]);
	expect(mapped.C.CA).toBe('valueCA');
	expect(mapped.C.CB).toEqual([4,5,6]);
	expect(mapped.C.CC).toEqual({cca:'valueCCA', ccb: 'valueCCB'});
	expect(mapped.D).toEqual([{da:1},{db: 'valueDDB'}]);
});

test('schema mapping test', () => {
	const mapper = new MagicMapper();

	const mappingSchema = {
		A: v => v.toUpperCase(),
		B: 1, // direct value
		C: v => mapper.map(v, { // maps deeply!
			CA: 'Foo',
			CB: a => a.map( v => v*2 )
		})
	};

	const mapped = mapper.map(original, mappingSchema);

	expect(mapped.A).toBe('VALUEA');
	expect(mapped.B).toEqual(1);
	expect(mapped.C.CA).toBe('Foo');
	expect(mapped.C.CB).toEqual([8,10,12]);
	expect(mapped.C.CC).toEqual({cca:'valueCCA', ccb: 'valueCCB'});
	expect(mapped.D).toEqual([{da:1},{db: 'valueDDB'}]);
});

test('exclusive mapping test', () => {
	const mapper = new MagicMapper({exclusive: true});

	const mapped = mapper.map(original, {A:MagicMapper.Direct, B:MagicMapper.Direct});

	expect(mapped.A).toBeDefined();
	expect(mapped.B).toBeDefined();
	expect(mapped.C).not.toBeDefined();
});

test('exclusive mapping test without schema', () => {
	const mapper = new MagicMapper({exclusive: true});
	expect( () => mapper.map(original)).toThrow();
});

test('mapper construction with wrong parameters', () => {
	expect( () => new MagicMapper({propertyTransform: true}) ).toThrow();
	expect( () => new MagicMapper({valueTransform: true}) ).toThrow();
});

