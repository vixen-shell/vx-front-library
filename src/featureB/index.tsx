import { Features } from '../__library'

const { feature, router } = Features.create({
    main: <p>Hello Extension B</p>,
})

export { router }
export default feature
