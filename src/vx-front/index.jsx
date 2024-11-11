import { Feature } from '../__lib'
import { DatesProvider, DatePicker } from '@mantine/dates'
import 'dayjs/locale/fr'

import Main from './Main'

export default Feature.init({
    main: <Main />,
    popup: <DatePicker locale="fr" />,
})
