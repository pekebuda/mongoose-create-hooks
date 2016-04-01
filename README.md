# mongoose-create-hooks

Plugin para [Mongoose](https://github.com/Automattic/mongoose) que permite
generar `hooks` ejecutables cuando un nuevo documento es creado, y guardado
subsiguientemente en MongoDB, distinguiendo con ello de los hooks `post('save')`
y `pre('save')`, que son lanzados siempre que se produzca una accion de 
guardado, ya sea primigenia (sobre un nuevo objeto) o ulterior (sobre 
documentos antiguos).

## Instalacion

```shell
npm install --save mongoose-create-hooks
```

## Uso
```javascript
//TODO
```

## Creditos

Este plugin se basa en el trabajo realizado por Hackey en su 
[captain-hook](https://github.com/hackley/captain-hook).