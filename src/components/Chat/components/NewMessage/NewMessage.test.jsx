import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import NewMessage from './NewMessage';

describe('NewMessage component', () => {
    const onEnterMessage = jest.fn();

    const component = mount(<NewMessage onEnterMessage={onEnterMessage}/>);

    it('expect to render component', () => {
        expect(toJson(component)).toMatchSnapshot();
    });
});