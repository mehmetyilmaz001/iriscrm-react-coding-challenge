import { render, screen } from "@testing-library/react";
import ChatBuble from './ChatBuble';

const testProps = {
    name: 'test name',
    message: 'test message',
    createDate: '2020-01-01',
    isOwner: true
}

test("Renders ChatBuble component", async () => {
  render(<ChatBuble {...testProps}/>);
  const chatBuble = screen.getByTestId('chat-buble');

  expect(chatBuble).toBeInTheDocument();
});