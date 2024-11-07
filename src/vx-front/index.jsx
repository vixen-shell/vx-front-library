import { Feature } from '../__lib'

import Main from './Main'

export default Feature.init({
    main: <Main />,
    popup: (
        <div
            style={{
                width: '100%',
                height: '100%',
                backgroundColor: 'black',
                color: 'white',
            }}
        >
            Hello !
        </div>
    ),
})
