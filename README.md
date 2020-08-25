
##### Run The Project
```js
  npm install
```

``` docker
  docker-compose up
``` 

This will bring up 3 containers 
* node.js container *[server]*
* postgres container *[postgres]*
* pgadmin container *[pgadmin]*

Ports Opened
 1. ``` server 3000 ```
 1. ``` postgres  5432 ```
 1. ``` pgadmin 5050 ```

&nbsp;

##### Build / Rebuild Container
``` docker
  docker-compose up build [containerName]
``` 

##### Stop The Project
``` docker
  docker-compose down
``` 

&nbsp;

###### Build
```js
  npm run build // output is bin/
```

###### Start
```js
  npm run start // start node
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


&nbsp;


###### Stop All Containers
``` docker
  docker stop `docker ps -qa`
```

###### Remove All Containers
``` docker
  docker rm `docker ps -qa`
```

###### Remove All Images
``` docker
  docker rmi -f `docker images -qa`
```

###### Remove All Volumes
``` docker
  docker volume rm $(docker volume ls -qf dangling="true")
```

###### Remove All Networks
``` docker
  docker network rm `docker network ls -q`
```