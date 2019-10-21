# Configuración del entorno de desarrollo

Inicio el proyecto de javascript

```shell
npm init -y
```

Editamos el archivo `package.json` y agregamos los scritps

```json
"scripts": {
    "dev": "DEBUG=app:* nodemon src/index.js",
    "start": "NODE_ENV=production node src/index.js"
}
```

Creamos el archivo `.eslintrc.json`

```json
{
    "parserOptions": {
        "ecmaVersion": 2018
    },
    "extends": ["eslint:recommended", "prettier"],
    "env": {
        "es6": true,
        "node": true,
        "mocha": true
    },
    "rules": {
        "no-console": "warn"
    }
}
```

Creamos el archivo `.prettierrc.json`

```json
{
    "tabWidth": 2,
    "semi": true,
    "singleQuote": true
}
```

Instalamos las dependencias de producción **express** y **dotenv**

```shell
npm i express dotenv
```

Instalamos las dependencias de desarrollo

```shell
npm i -D nodemon eslint eslint-config-prettier eslint-plugin-prettier prettier
```

Para que cada que hagamos commit se apliquen los estilos del linter y prettier instalamos el siguiente hook

```shell
npx mrm lint-staged
```

Creamos el archivo de configuración `config/index.js` con las variables de entorno

```javascript
require('dotenv').config()

const config = {
    dev: process.env.NODE_ENV !== 'production',
    port: process.env.PORT || 3000
}

module.exports = { config }

```
