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
        - tags: array of strings
        - nextId: string --> paginación
        - orderBy: string
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
- _/api/users_
    Métodos
    - _get_  
    Devuelve los datos del usuario logueado por medio del token
- _/api/users/:host_  
    - _get_  
    Devuelve los datos de un usuario que estoy visitando, solo si estoy autorizado para verlos
- _/api/users/login_
    - _post_  
    Inicia sesión con los valores de email y password pasados por body y devuelve los datos del usuario logueado
    