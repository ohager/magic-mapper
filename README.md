# Still under development

# magic-mapper
Minimalistic JSON mapper

This tiny library helps to map one JSON objects into another 
A common use case is that a Web API returns some JSON objects that does not fit exactly a web apps needs.

Example: 

Usually, a WebAPI (C#) service returns JSON objects with upper case properties  
```
{
    SomeProperty : 'value1',
    SomeOtherProperty : { Foo: 1, Bar : 2 }
}
```
In ES it's common to deal with lower case. So, you may use the magic-mapper to transform all property names into lower case, like so

```
const mapper = new MagicMapper( {propertyTransform : p => p[0].toLowerCase() + p.substr(1)} )
const mappedJson = mapper.map(fromServerJson);
```

### more to follow 
