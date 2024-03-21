import { Feature, ui } from '../../__library'

export default function Main() {
    return (
        <ui.Frame>
            <p>Test Route from feature A!</p>
            <p>Hello Noha!</p>
            <Feature.Link route="main">
                Click to return to the Main Route ...
            </Feature.Link>
        </ui.Frame>
    )
}
