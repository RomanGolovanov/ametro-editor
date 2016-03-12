# aMetro Editor

This is a experimental editor for transport maps in PMZ format.
Maps available via [pMetro](http://pmetro.su/Maps.html) web site ([english version](http://www.microsofttranslator.com/bv.aspx?from=ru&to=en&a=http%3A%2F%2Fpmetro.su%2FMaps.html)).

Demo (nightly builds): https://editor.ametro.org

## Project Status

Currently project is under heavy development.

Working features:
* PMZ file opening/saving.
* Displaying map with stations (but without connections) from PMZ file.
* Navigation between maps.
* Basic station manipulations (selection, moving, connecting).

## Installing

Need NodeJS with bower and gulp installed.

```shell

# Clone sources:
git clone https://github.com/RomanGolovanov/ametro-editor.git

# Install node modules:
npm install

# Install bower modules:
bower install

# To build sources:
gulp build

# To build and run:
gulp
```

## License

Copyright (c) 2016 by Roman Golovanov
All rights reserved.

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
