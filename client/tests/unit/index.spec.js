import { createLocalVue } from '@vue/test-utils';
import Vuex from 'vuex';
import storeConfig from '../../src/store'
import { cloneDeep } from 'lodash'
import $axios from "../../src/services/axios";

jest.spyOn($axios, 'get').mockResolvedValue({ data: [{ id: 1, name: 'jay' }, { id: 2, name: 'jp' }] })
jest.spyOn($axios, 'post').mockResolvedValue({ data: { user: { name: 'jay' } } })
jest.spyOn($axios, 'put').mockResolvedValue()
jest.spyOn($axios, 'delete').mockResolvedValue()

const getStore = () => {
    const localVue = createLocalVue();
    localVue.use(Vuex);

    return new Vuex.Store(cloneDeep(storeConfig));
};

let store

describe('State and Mutation', () => {
    beforeEach(() => {
        store = getStore();
    });

    describe('User', () => {
        it('should set and get user details', async () => {
            expect(store.state.user).toEqual({})
            store.commit('setUser', { name: 'jay' })
            expect(store.state.user).toEqual({ name: 'jay' })
        });

        it('should set and get patient list', async () => {
            expect(store.state.patientList).toEqual([])
            store.commit('setPatientList', [{ name: 'jay' }])
            expect(store.state.patientList).toEqual([{ name: 'jay' }])
        });
    });
})

describe('Actions', () => {
    beforeEach(() => {
        store = getStore();
    });

    afterEach(() => {
        $axios.get.mockClear();
        $axios.post.mockClear();
        $axios.put.mockClear();
        $axios.delete.mockClear();
    });

    describe('User login', () => {
        it('should call login API for user based on their type', async () => {
            await store.dispatch('logIn', { username: 'username', password: 'password', type: 'admin' });

            expect($axios.post).toHaveBeenCalledWith('/adminLogin', { username: 'username', password: 'password' })

            await store.dispatch('logIn', { username: 'username', password: 'password', type: 'staff' });
            expect($axios.post.mock.calls[0]).toMatchObject(['/adminLogin', { username: 'username', password: 'password' }])
            expect($axios.post.mock.calls[1]).toMatchObject(['/login', { username: 'username', password: 'password' }])

            expect(store.state.user).toEqual({ name: 'jay' })
        });
    });

    describe('User Password reset', () => {
        it('should call reset password API for user', async () => {
            await store.dispatch('resetPassword', { username: 'username', password: 'password' });

            expect($axios.post).toHaveBeenCalledWith('/reset-password', { username: 'username', password: 'password' })
        });
    });

    describe('Patient list', () => {
        it('should call get API for patient list', async () => {
            await store.dispatch('getPatientList');

            expect($axios.get).toHaveBeenCalledWith('/patient/all')
            expect(store.state.patientList).toEqual([{ id: 1, name: 'jay' }, { id: 2, name: 'jp' }])
        });
    });

    describe('Add Patient', () => {
        it('should call post API for patient list', async () => {
            await store.dispatch('addPatient', { name: 'jay' });

            expect($axios.post).toHaveBeenCalledWith('/patient/add', { name: 'jay' })
        });
    });

    describe('Update Patient', () => {
        it('should call put API for patient list', async () => {
            await store.dispatch('updatePatient', { id: 1, name: 'jay' });

            expect($axios.put).toHaveBeenCalledWith('/patient/1', { id: 1, name: 'jay' })
        });
    });

    describe('Remove Patient', () => {
        it('should call delete API for patient list', async () => {
            await store.dispatch('removePatient', 1);

            expect($axios.delete).toHaveBeenCalledWith('/patient/1')
        });
    });
})
