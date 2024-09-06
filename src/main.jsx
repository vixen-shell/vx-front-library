import { Root } from './__lib'

Root.create(document.getElementById('root')).render((feature) =>
    import(`./${feature}/index.jsx`)
)
