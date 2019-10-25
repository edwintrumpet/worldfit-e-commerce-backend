# Rutas

- _/api/products_  
    Métodos
    - _get_  
    Devuelve un array de productos y acepta valores por _body_ que actuan como filtro de los resultados
        - id: string
        - nameProduct: string
        - description: string
        - minPrice: number
        - maxPrice: number
        - gender: string
        - tags: array of strings
    - _post_  
    Crea un nuevo producto y acepta por _body_ las características del producto
- _/api/products/:productId_  
    Métodos
    - _get_  
    Devuelve el producto especificado
    - _put_  
    Edita el producto especificado, recibe por _body_ los campos y valores a modificar
    - _delete_  
    Elimina el producto especificado