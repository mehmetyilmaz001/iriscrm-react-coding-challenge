import { screen, render } from '@testing-library/react'
import ChatAppBar from './ChatAppBar';

test('Renders ChatAppBar component', async () => {
    render(<ChatAppBar user='mehmet test appbar' />)
    const chatAppBar = await screen.findByText(/mehmet test appbar/)
    expect(chatAppBar).toBeInTheDocument()
})