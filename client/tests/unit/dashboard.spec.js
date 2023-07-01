import { mount, createLocalVue } from "@vue/test-utils";
import Dashboard from "@/views/Dashboard.vue";
import Vuex from "vuex";

const patientList = [
    {
        id: 1,
        name: "Jay Patel",
        mobileNo: 85116,
        gender: "Male",
        address: "Morbi",
        disease: "Headache",
        present: false,
    },
    {
        id: 2,
        name: "Rinkal Patel",
        mobileNo: 92966,
        gender: "Female",
        address: "Morbi",
        disease: "Flu",
        present: false,
    }
]

let getPatientList = jest.fn();
let addPatient = jest.fn();
let updatePatient = jest.fn();
let removePatient = jest.fn();

const localVue = createLocalVue();
localVue.use(Vuex);
let wrapper = null

function getMockStore(listError = false, addError = false, updateError = false, deleteError = false) {
    if (listError) {
        getPatientList = jest.fn().mockImplementation(() => {
            throw new Error("Error occurred while fetching patient list.");
        });
    }

    if (addError) {
        addPatient = jest.fn().mockImplementation(() => {
            throw new Error("Error while creating new patient.");
        });
    }

    if (updateError) {
        updatePatient = jest.fn().mockImplementation(() => {
            throw new Error("Error while updating patient");
        });
    }

    if (deleteError) {
        removePatient = jest.fn().mockImplementation(() => {
            throw new Error("Error while removing patient");
        });
    }

    return new Vuex.Store({
        state() {
            return {
                patientList
            };
        },
        actions: {
            getPatientList,
            addPatient,
            updatePatient,
            removePatient,
        },
    });
}

describe("Dashboard.vue initialization", () => {
    beforeEach(async () => {
        const store = getMockStore();
        wrapper = mount(Dashboard, {
            localVue,
            store,
            mocks: {
                $message: {
                    error: jest.fn(),
                    success: jest.fn(),
                },
            },
        });
    });

    afterEach(() => {
        wrapper.vm.$message.success.mockClear();
        wrapper.vm.$message.error.mockClear();
        getPatientList.mockClear();
        addPatient.mockClear();
        updatePatient.mockClear();
        removePatient.mockClear();
    });

    it("Should call getPatientList action and get the records", async () => {
        await wrapper.vm.$nextTick();
        expect(getPatientList).toHaveBeenCalledTimes(1);
        expect(wrapper.vm.$message.error).toHaveBeenCalledTimes(0);
        expect(wrapper.vm.patientRecords.length).toBe(2);
        expect(addPatient).toHaveBeenCalledTimes(0);
        expect(wrapper.vm.visible).toBe(false);
    });

    it("Should filter records when user search anything", async () => {
        expect(wrapper.vm.patientRecords.length).toBe(2);
        await wrapper.find('#search').setValue('jay');
        expect(wrapper.vm.search).toBe("jay");
        expect(wrapper.vm.patientRecords.length).toBe(1);

    });

    it("Should open modal on click of add patient button", async () => {
        expect(wrapper.vm.visible).toBe(false);
        expect(wrapper.classes("profile")).toBe(false);

        wrapper.find("#addButton").trigger("click");
        await wrapper.vm.$nextTick();
        expect(wrapper.vm.visible).toBe(true);
        expect(wrapper.find('.profile').exists()).toBe(true);
    });

    describe('On Add patient action', () => {
        it('should throw error when form is not valid', async () => {
            wrapper.find("#addButton").trigger("click");
            await wrapper.vm.$nextTick();
            expect(wrapper.vm.visible).toBe(true);

            await wrapper.find("#name").setValue("myName");
            await wrapper.find("#mobileNo").setValue(123);
            await wrapper.find("#address").setValue('myAddress');

            expect(addPatient).toHaveBeenCalledTimes(0);
            expect(wrapper.classes("ant-form-explain")).toBe(false);

            wrapper.find("#submitButton").trigger("click");
            await wrapper.vm.$nextTick();

            expect(addPatient).toHaveBeenCalledTimes(0);
            expect(wrapper.find(".ant-form-explain").text()).toBe(
                "Please enter patient Disease"
            );
        });

        it("Should call addPatient action when form is valid", async () => {
            wrapper.find("#addButton").trigger("click");
            await wrapper.vm.$nextTick();
            expect(wrapper.vm.visible).toBe(true);

            await wrapper.find("#name").setValue("myName");
            await wrapper.find("#mobileNo").setValue(123);
            await wrapper.find("#address").setValue('myAddress');
            await wrapper.find("#disease").setValue('myDisease');

            expect(addPatient).toHaveBeenCalledTimes(0);
            expect(wrapper.classes("ant-form-explain")).toBe(false);

            wrapper.find("#submitButton").trigger("click");
            await wrapper.vm.$nextTick();

            expect(addPatient).toHaveBeenCalledTimes(1);
            expect(updatePatient).toHaveBeenCalledTimes(0);
            await wrapper.vm.$nextTick();
            expect(wrapper.vm.$message.success).toHaveBeenCalledWith(
                "New patient added successfully!"
            );
            expect(wrapper.vm.visible).toBe(false);
        });
    })

    describe('On delete patient action', () => {
        it('should call remove patient action with proper id', async () => {
            expect(removePatient).toHaveBeenCalledTimes(0);
            expect(wrapper.vm.$message.success).toHaveBeenCalledTimes(0);

            wrapper.findAll("#deleteButton").at(1).trigger("click");
            await wrapper.vm.$nextTick();
            await wrapper.vm.$nextTick();

            expect(removePatient).toHaveBeenCalledTimes(1);
            expect(removePatient).toHaveBeenCalledWith(expect.anything(), 2)
            expect(wrapper.vm.$message.success).toHaveBeenCalledWith(
                "Patient removed successfully!"
            );
        });
    })
});

describe("Dashboard.vue initialization", () => {
    beforeEach(async () => {
        const store = getMockStore(true, true, true, true);
        wrapper = mount(Dashboard, {
            localVue,
            store,
            mocks: {
                $message: {
                    error: jest.fn(),
                    success: jest.fn(),
                },
            },
        });
    });

    afterEach(() => {
        wrapper.vm.$message.success.mockClear();
        wrapper.vm.$message.error.mockClear();
        getPatientList.mockClear();
        addPatient.mockClear();
        updatePatient.mockClear();
        removePatient.mockClear();
    });

    it("Should show error message when some issue with getPatientList action", async () => {
        await wrapper.vm.$nextTick();
        expect(getPatientList).toHaveBeenCalledTimes(1);
        expect(wrapper.vm.$message.error).toHaveBeenCalledTimes(1);
        expect(wrapper.vm.$message.error).toHaveBeenCalledWith(
            "Error occurred while fetching patient list."
        );
    });

    describe('On Add patient action', () => {
        it("Should show error message when some issue with updatePatient action", async () => {
            wrapper.find("#editButton").trigger("click");
            await wrapper.vm.$nextTick();
            expect(wrapper.vm.visible).toBe(true);
            expect(wrapper.vm.edit).toBe(true);

            expect(wrapper.find("#name").element.value).toBe("Jay Patel");
            expect(wrapper.find("#mobileNo").element.value).toBe("85116");

            await wrapper.find("#mobileNo").setValue(88888);
            wrapper.find("#submitButton").trigger("click");
            await wrapper.vm.$nextTick();

            expect(addPatient).toHaveBeenCalledTimes(0);
            expect(updatePatient).toHaveBeenCalledTimes(1);
            await wrapper.vm.$nextTick();
            expect(wrapper.vm.$message.error).toHaveBeenCalledWith(
                "Error while updating patient. Please try again!"
            );
        });
    })

    describe('On delete patient action', () => {
        it("Should show error message when some issue with removePatient action", async () => {
            wrapper.vm.$message.error.mockClear();
            expect(removePatient).toHaveBeenCalledTimes(0);
            expect(wrapper.vm.$message.error).toHaveBeenCalledTimes(0);

            wrapper.findAll("#deleteButton").at(0).trigger("click");
            await wrapper.vm.$nextTick();
            await wrapper.vm.$nextTick();

            expect(removePatient).toHaveBeenCalledTimes(1);
            expect(removePatient).toHaveBeenCalledWith(expect.anything(), 1)
            expect(wrapper.vm.$message.error).toHaveBeenCalledWith(
                "Error occurred while removing patient"
            );
        });
    })
});




