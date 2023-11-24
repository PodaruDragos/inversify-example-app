
##### Run The Project
```js
  npm install
```

``` docker
  docker-compose up
```

This will bring up 2 containers
* postgres container *[postgres]*
* pgadmin container *[pgadmin]*

Ports Opened
 1. ``` postgres 5432 ```
 1. ``` pgadmin 5050 ```

&nbsp;


###### Build
```js
  npm run build // output is dist/
```

###### Start
```js
  npm run start
```

###### Lint
```js
  npm run lint
```

###### Create Migrations
```js
  npm run build
  npm run migration:create
```
