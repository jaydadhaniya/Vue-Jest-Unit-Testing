<!--
	This is the login page, it uses the dashboard layout in:
	"./layouts/Default.vue" .
 -->

<template>
    <div class="login mt-50" id="login">
        <a-row type="flex" :gutter="[24, 24]" justify="space-around" align="middle">
            <!-- Login Image Column -->
            <a-col :span="24" :md="6" :lg="6" :xl="7" class="col-form">
                <h2 class="mb-15">Login</h2>
                <h5 class="font-regular text-muted">
                    Enter your username and password to login
                </h5>

                <!-- Login Form -->
                <a-form-model id="login-form" ref="login" :model="login" class="profile login-form"
                    @submit.prevent="onSubmit">
                    <a-form-model-item class="mt-10" label="Username" prop="username"
                        :rules="req('Please input your username!')">
                        <a-input id="username" v-model="login.username" placeholder="Username" size="large" />
                    </a-form-model-item>
                    <a-form-model-item class="mt-10" label="Password" prop="password"
                        :rules="req('Please input your password!')">
                        <a-input-password id="password" v-model="login.password" type="password" placeholder="Password"
                            size="large" />
                    </a-form-model-item>
                    <div class="dF aC jSB mt-15">
                        <a-form-model-item>
                            <a-radio-group v-model="login.type" button-style="solid" id="type" size="large">
                                <a-radio-button value="admin">
                                    Admin
                                </a-radio-button>
                                <a-radio-button value="staff">
                                    Staff
                                </a-radio-button>
                            </a-radio-group>
                        </a-form-model-item>
                        <div @click="$router.push('/reset-password')" class="font-bold text-dark " id="forgot-password"
                            style="cursor: pointer;">Forgot Password?</div>
                    </div>
                    <a-form-model-item class="mt-5">
                        <a-button id="loginButton" type="primary" block html-type="submit" class="login-form-button">
                            Login
                        </a-button>
                    </a-form-model-item>
                </a-form-model>
                <!-- / Login Form -->
            </a-col>
            <!-- Login Image Column -->
        </a-row>
    </div>
</template>

<script>
import { mapActions } from "vuex";

export default {
    data() {
        return {
            login: {
                username: "",
                password: "",
                type: "admin",
            }
        };
    },

    methods: {
        ...mapActions(['logIn']),

        req: (msg) => ({ required: true, message: msg }),

        async onSubmit() {
            this.$refs.login.validate(async (valid) => {
                if (valid) {
                    await this.logIn({
                        ...this.login
                    })
                    this.$router.push("/dashboard");
                }
            });
        },
    },
};
</script>

<style lang="scss">
body {
    background-color: #ffffff;
}
</style>
