import { mount } from 'enzyme';
import toJson from 'enzyme-to-json';
import SigninModal from './SigninModal';

describe('SiginModal component', () => {

    const component = mount(<SigninModal />);

    it('expect to render component', () => {
        expect(toJson(component)).toMatchSnapshot();
    });
});