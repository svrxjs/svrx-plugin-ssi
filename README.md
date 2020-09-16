svrx-plugin-ssi
---

[![svrx](https://img.shields.io/badge/svrx-plugin-%23ff69b4?style=flat-square)](https://svrx.io/)
[![npm](https://img.shields.io/npm/v/svrx-plugin-ssi.svg?style=flat-square)](https://www.npmjs.com/package/svrx-plugin-ssi)

support ssi(Server Side Include) like Nginx

## Usage

> Please make sure that you have installed [svrx](https://svrx.io/) already.


### Via CLI

```bash
svrx -p ssi
```

### Via API

```js
const svrx = require('@svrx/svrx');

svrx({ plugins: [ 'ssi' ] }).start();
```


### Example

**index.html(entry)**

```html
<html>
    <head>
    </head>
    <body>
        <!--# include file="./top.html" -->
    	<div>Middle</div>
        <!--# include file="./bottom.html" -->
    </body>
</html>
```

**top.html** in same folder

```html
<header>Top</header>
```

**bottom.html** in same folder

```html
<foot>Bottom</foot>
```

when visit index.html you will get

```html
<html>
    <head>
    </head>
    <body>
        <header>Top</header>
    	<div>Middle</div>
        <foot>Bottom</foot>
    </body>
</html>
```

## Options


<!-- TODO -->

## License

MIT