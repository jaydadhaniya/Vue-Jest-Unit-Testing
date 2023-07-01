import { mount, createLocalVue } from "@vue/test-utils";
import Login from "@/views/Login.vue";
import Vuex from "vuex";

const localVue = createLocalVue();
localVue.use(Vuex);

let logIn = jest.fn();
let wrapper;

describe("Login.vue initialization", () => {
    beforeEach(async () => {
        const store = new Vuex.Store({
            actions: {
                logIn,
            },
        });

        wrapper = mount(Login, {
            localVue,
            store,
            mocks: {
                $route: { params: {} },
                $router: {
                    push: jest.fn(),
                },
            },
        });
    });

    afterEach(() => {
        wrapper.vm.$router.push.mockClear();
    });

    it("Should initialize template with default empty values", async () => {
        await wrapper.vm.$nextTick();
        expect(logIn).toHaveBeenCalledTimes(0);

        expect(wrapper.find("#username").element.value).toBe("");
        expect(wrapper.find("#password").element.value).toBe("");
        expect(wrapper.find("#type").vm.value).toBe("admin");
    });

    it("Should set values in the required model based on the input", async () => {
        await wrapper.find("#username").setValue("myUsername");
        expect(wrapper.find("#username").element.value).toBe("myUsername");
        expect(wrapper.vm.login.username).toBe("myUsername");

        await wrapper.find("#password").setValue("myPassword");
        expect(wrapper.find("#password").element.value).toBe("myPassword");
        expect(wrapper.vm.login.password).toBe("myPassword");

        expect(wrapper.vm.login.type).toBe("admin");

        wrapper.find('input[type="radio"][value="staff"]').element.selected = true;
        wrapper.find('input[type="radio"][value="staff"]').trigger("change");
        expect(wrapper.vm.login.type).toBe("staff");
    });

    it("Should throw error when form is invalid", async () => {
        await wrapper.find("#username").setValue("myUsername");
        await wrapper.find("#password").setValue("");

        expect(logIn).toHaveBeenCalledTimes(0);
        expect(wrapper.classes("ant-form-explain")).toBe(false);

        wrapper.find("form").trigger("submit.prevent");
        await wrapper.vm.$nextTick();

        expect(logIn).toHaveBeenCalledTimes(0);
        expect(wrapper.find(".ant-form-explain").text()).toBe(
            "Please input your password!"
        );
    });

    it("Should call login action when form is valid", async () => {
        await wrapper.find("#username").setValue("myUsername");
        await wrapper.find("#password").setValue("myPassword");

        expect(logIn).toHaveBeenCalledTimes(0);
        expect(wrapper.classes("ant-form-explain")).toBe(false);
        expect(wrapper.vm.$router.push).toHaveBeenCalledTimes(0);

        await wrapper.find("form").trigger("submit.prevent");
        await wrapper.vm.$nextTick();
        // await wrapper.vm.$nextTick();

        expect(wrapper.classes("ant-form-explain")).toBe(false);
        expect(logIn).toHaveBeenCalledTimes(1);
        expect(wrapper.vm.$router.push).toHaveBeenCalledTimes(1);
        expect(wrapper.vm.$router.push).toHaveBeenCalledWith("/dashboard");
    });

    it('Should redirect to forgot password page', async () => {
        expect(wrapper.vm.$router.push).toHaveBeenCalledTimes(0);

        await wrapper.find("#forgot-password").trigger("click");
        // await wrapper.vm.$nextTick();

        expect(wrapper.vm.$router.push).toHaveBeenCalledTimes(1);
        expect(wrapper.vm.$router.push).toHaveBeenCalledWith("/reset-password");
    })
});
