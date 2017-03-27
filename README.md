[![Build Status](https://travis-ci.org/ohager/magic-mapper.svg?branch=master)](https://travis-ci.org/ohager/magic-mapper)
[![codecov](https://codecov.io/gh/ohager/magic-mapper/branch/master/graph/badge.svg)](https://codecov.io/gh/ohager/magic-mapper)

# magic-mapper
Minimalistic JSON mapper

``npm install magic-mapper --save``

``yarn add magic-mapper``


This tiny library helps you to map one JSON object into another.
Its basic features are:

- selective property transformations
- exclusive property selection
- global property and value transformation

## Selective Property Transformation
 
If using a schema you can define how to transform object properties selectively, e.g.

```javascript

const originalObject = {
	id : 1,
	name: 'John',
	lastName: 'Doe',
	birthDate: '1996-03-27T17:03:02Z'
}

const mapper = new MagicMapper();
const mappedObject = mapper.map(originalObject, {
	    birthDate: date => moment(date).locale('de').format('LLLL')
    })
/* 
mappedobject = {
	id : 1,
	name: 'John',
	lastName: 'Doe',
	birthDate: 'Mittwoch, 27. März 1996 14:03'
}
 */
    
```


## Exclusive Property Selection
 
Per default, _all_ properties are mapped, but you may want to select only a subset of the properties.

```javascript

const originalObject = {
	id : 1,
	name: 'John',
	lastName: 'Doe',
	birthDate: '1996-03-27T17:03:02Z'
}

const mapper = new MagicMapper({exclusive: true}); //< set exclusive flag 
const mappedObject = mapper.map(originalObject, {
	    birthDate: date => moment(date).locale('de').format('LLLL')
    })
/* 
mappedobject = {
	birthDate: 'Mittwoch, 27. März 1996 14:03'
}
 */
    
```

## Global Property and Value Transformation
 
Sometimes, you want to apply some transformations for _all_ properties. You can either use a global 
transformation function for the property values, or even for the property names itself.

```javascript

const originalObject = {
	id : 1,
	name: 'John',
	lastName: 'Doe',
	birthDate: '1996-03-27T17:03:02Z'
}

const mapper = new MagicMapper({
    propertyTransform: propertyName => propertyName[0].toUpperCase() + propertyName.substr(1),
    valueTransform: value => typeof value === 'string' ? value.toUpperCase() : value
});  

const mappedObject = mapper.map(originalObject, {
	    birthDate: date => moment(date).locale('de').format('LLLL')
    })
/* 
mappedobject = {
	Id : 1,
	Name: 'JOHN',
	LastName: 'DOE',
	BirthDate: 'Mittwoch, 27. März 1996 14:03'
}
*/    
```

# Advanced Mapping 

# Mapping Schema

The schema is used for two purposes,

- Define exclusive mapping
- Define property transformations
 
> Note: When used for exclusive mapping a schema is mandatory. 

A schema is just a JSON object, that should match structurally to the input object.
The values describe how to map the related property. Following value types are possible
  
  1. Function - use a _fn(value)_ or _(v) => {...}_  to transform the value into something new
  2. Fixed Value - to use the value directly
  3. MagicMapper.Direct - a symbol to express that original value shall be used 
     -> when using _options.exclusive=false_ the direct mapping is applied automatically for _all_ properties, 
     except the schema says something different. 
   
> Note: When using global property transformation, use the transformed property names instead.

### Schema Example

```
const originalObject = {
	id : 1,
	name: 'John',
	lastName: 'Doe',
	birthDate: '1996-03-27T17:03:02Z'
}

const mapper = new MagicMapper(); //< implicitely exclusive=false, no global transformation 
const mappedObject = mapper.map(originalObject, {
        id: null, // maps always 'null'
        name: MagicMapper.Direct, // uses original value        
	    birthDate: date => moment(date).locale('de').format('LLLL') // transforms date
    })
/* 
mappedobject = {
    id: null,
    name: 'John',
    lastName: 'Doe' //< was mapped implicitely
	birthDate: 'Mittwoch, 27. März 1996 14:03'
}
*/
```

## Mapping Nested Objects

Principally, mapping nested objects is no problem, i.e. global transformations are applied recursively.
When using a schema, you need to define explicitly a mapping function, as the current implementation detects 
a nested schema as object assignment only.

### Example
```
const originalObject = {
    id : 1,
    name: 'John',
    lastName: 'Doe',
    birthDate: '1996-03-27T17:03:02Z',
    father: {
        id : 1,
        name: 'John Sr.',
        lastName: 'Doe',
        birthDate: '1956-01-02T14:56:20Z',
    }
}

const personMapSchema = {
    birthDate: date => moment(date).locale('de').format('LLLL')
}

const toGermanDate = date => moment(date).locale('de').format('LLLL');

const mapper = new MagicMapper();
const mappedObject = mapper.map(originalObject, {
    birthDate : toGermanDate,
    father: f => mapper.map(f, { birthDate: toGermanDate }) // nested mapping
})
```
 
 
## Mapping Arrays

Arrays can be mapped as it were normal values. If you want to transform the arrays values you can simply do this:

```javascript

const originalObject = {
	values : [ 1,2,3 ]
}

const mapper = new MagicMapper();
const mappedObject = mapper.map(originalObject, {
	values : a => a.map( v => v*2 )
})

/*
mappedObject = {
    values: [2,4,6]
}
*/

```