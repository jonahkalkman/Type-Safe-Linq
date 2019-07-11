# Type-Safe-Linq
A type safe Linq in memory implementation with Typescript. The possible functions that can be used are select, include and orderBy.

## Select
Select one or more entities K from an object T. Select and be chained and is used inside the include function to select entities from an entity that is an Array.
Some use cases for select:

## Include
Include can be used to select entities from an entity K that must be an Array of entities.

## OrderBy
OrderBy one entity from your query / selection. OrderBy can be used inside the include function to order entities from entity K.

## Commands

Command        | Result
-------------- | -------------
npm run watch  | watches for changes and builds the source files if changes are made
npm run build  | builds the source files (ts) into js
npm run start  | runs Test.ts with ts-node to test your query
