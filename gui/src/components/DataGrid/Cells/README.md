#### How To Add a Cell Type

1. create a new file in the folder 'components' following the naming convention 'MyCell.tsx' (note that you should not choose a name that's already used globally by native classes like 'Date')
2. create and export a new class that extends the `Cell` class (for details see `abstract/Cell.tsx` class and already existing cell classes in `/components/*`)
3. add an instance of this new class the the `cells` array in the `./index.ts` file

That's it.
