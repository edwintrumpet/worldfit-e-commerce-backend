# Rutas

- _/listproducts_  
Retorna todos los productos si no se pasan parámetros como filtro, acepta los siguientes filtros.
    - id: string
    - nameProduct: string
    - description: string
    - minPrice: number
    - maxPrice: number
    - gender: string
    - tags: array of strings
- _/showproduct_  
Retorna un producto de acuerdo al _id: string_ pasado como parámetro
- _/createproduct_  
Crea un nuevo producto
- _/editproduct_
Edita el producto pasándole el id y el objeto producto con los campos a editar