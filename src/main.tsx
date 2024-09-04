import { Root } from './__library'

Root.create(document.getElementById('root')!).render(
    (feature) => import(`./${feature}/index.tsx`)
)
