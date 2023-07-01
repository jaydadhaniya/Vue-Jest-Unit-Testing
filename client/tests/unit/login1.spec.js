import { createLocalVue, mount } from "@vue/test-utils";
import Login from "@/views/Login.vue";
import Vuex from "vuex";


let localVue = createLocalVue()
localVue.use(Vuex);

let login = jest.fn();

const store = new Vuex.Store({
    actions: {
        login
    }
})

let wrapper;
describe('Login component', () => {
    beforeEach(() => {
        wrapper = mount(Login, {
            localVue,
            store
        })
    })

    test('should init component with default values', () => {
        expect(login).toHaveBeenCalledTimes(0)
        expect(login).not.toHaveBeenCalled();
    })
});
