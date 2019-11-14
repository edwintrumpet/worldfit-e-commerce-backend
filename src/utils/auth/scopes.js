const rootScopes = [
    'create:products',
    'edit:products',
    'editBuy:products',
    'delete:products',
    'list:users',
    'getown:users',
    'getother:users',
    'create:users',
    'editown:users',
    'editother:users',
    'delete:users',
    'list:sales',
    'detail:sales',
    'listown:sales',
    'listother:sales',
    'create:sales',
    'edit:sales',
    'delete:sales'
]

const adminScopes = [
    'create:products',
    'edit:products',
    'editBuy:products',
    'delete:products',
    'list:users',
    'getown:users',
    'getother:users',
    'editown:users',
    'list:sales',
    'detail:sales',
    'listown:sales',
    'listother:sales',
    'create:sales',
    'edit:sales',
    'delete:sales'
]

const collaboratorScopes = [
    'create:products',
    'edit:products',
    'editBuy:products',
    'delete:products',
    'list:users',
    'getown:users',
    'getother:users',
    'editown:users',
    'list:sales',
    'detail:sales',
    'listown:sales',
    'listother:sales',
    'create:sales'
]

const clientScopes = [
    'editBuy:products',
    'getown:users',
    'editown:users',
    'listown:sales',
    'create:sales'
]

const scopes = {
    root: rootScopes,
    admin: adminScopes,
    collaborator: collaboratorScopes,
    client: clientScopes
}

module.exports = scopes
