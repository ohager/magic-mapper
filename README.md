[![Build Status](https://travis-ci.org/ohager/magic-mapper.svg?branch=master)](https://travis-ci.org/ohager/magic-mapper)
[![codecov](https://codecov.io/gh/ohager/magic-mapper/branch/master/graph/badge.svg)](https://codecov.io/gh/ohager/magic-mapper)

# ✨ magic-mapper 
Minimalistic, flexible and easy-to-use JSON mapper 🍰 🍭 🎉 

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

## Mapping Schema

The schema is used for two purposes,

- Define exclusive mapping
- Define property transformations
 
> ☠ When used for exclusive mapping a schema is mandatory. 

A schema is just a JSON object, that should match structurally to the input object.
The values describe how to map the related property. Following value types are possible
  
  1. Function - use a _fn(value)_ or _(v) => {...}_  to transform the value into something new
  2. Fixed Value - to use the value directly
  3. MagicMapper.Direct - a symbol to express that original value shall be used 
     -> when using _options.exclusive=false_ the direct mapping is applied automatically for _all_ properties, 
     except the schema says something different. 
   
> ☠ When using global property transformation, use the transformed property names instead.

### Schema Example

```javascript
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

Mapping nested objects is straightforward. Just define a nested schema conforming your needs.  

### Example
```javascript
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


const toGermanDate = date => moment(date).locale('de').format('LLLL');

const mapper = new MagicMapper();
const mappedObject = mapper.map(originalObject, {
    birthDate : toGermanDate,
    father: { 
    	birthDate: toGermanDate 
    } // nested mapping
})
```
 
### Example with different mappers

You can also combine mapping functions to map nested objects with different mappers

```javascript
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

const toGermanDate = date => moment(date).locale('de').format('LLLL');

const mapper = new MagicMapper();
const fatherMapper = new MagicMapper({exclusive:true});

const mappedObject = mapper.map(originalObject, {
    birthDate : toGermanDate,
    father: f => fatherMapper.map(f, {
    	name: MagicMapper.Direct,
    	lastName : MagicMapper.Direct
    })
})
```
 
## Mapping Arrays

Arrays can be mapped as it were normal objects. 
If the initial object is an Array, the mapped result will be an Array, too.

```javascript

const originalObject = [ {a:1},{a:2} ]
const mapper = new MagicMapper();
const mappedObject = mapper.map(originalObject, {
	a : a => a * 2
})

/*
mappedObject = [{a:2},{a:4}]
*/


If you want to transform the arrays values you can simply do this:

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