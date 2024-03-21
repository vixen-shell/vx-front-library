import { Features } from '../__library'

import Main from './main'
import Test from './test'

const { feature, router } = Features.create({
    main: <Main />,
    test: <Test />,
})

export { router }
export default feature
