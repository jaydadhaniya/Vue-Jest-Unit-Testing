<!--
	This is the user profile page, it uses the dashboard layout in:
	"./layouts/Dashboard.vue" .
 -->

<template>
	<div>
		<a-spin :spinning="loading">
			<!-- Header Background Image -->
			<div class="profile-nav-bg" style="background-image: url('images/bg-profile.jpg')"></div>
			<!-- / Header Background Image -->

			<!-- User Profile Card -->
			<a-card :bordered="false" class="card-profile-head" :bodyStyle="{ padding: 0, }">
				<template #title>
					<a-row type="flex" align="middle">
						<a-col :span="24" :md="12" class="col-info">
							<div id="profileImage"></div>
							<div class="avatar-info">
								<h4 class="font-semibold m-0">{{ authUser.name }}</h4>
								<p>{{ authUser.role || 'CEO / Co-Founder' }}</p>
							</div>
						</a-col>
					</a-row>
				</template>
				<!-- User Profile Card -->

				<a-divider></a-divider>
				<div class="mx-25 mb-30">
					<a-form-model ref="user" :model="authUser" class="profile">
						<a-row type="flex" :gutter="20">
							<a-col :span="24" :md="12">
								<a-form-model-item label="Name" prop="name" :rules="req('Please enter the name.')">
									<a-input v-model="authUser.name" placeholder="User Name" size="large">
									</a-input>
								</a-form-model-item>
							</a-col>
							<a-col :span="24" :md="12">
								<a-form-model-item label="Mobile No" prop="mobileNo"
									:rules="req('Please enter the mobile number.')">
									<a-input-number v-model="authUser.mobileNo" placeholder="User Mobile No" size="large"
										style="width: 100%">
									</a-input-number>
								</a-form-model-item>
							</a-col>
						</a-row>
						<a-row type="flex" :gutter="20">
							<a-col :span="24" :md="12">
								<a-row type="flex" :gutter="40" align="stretch">
									<a-col :span="24" :md="16">
										<a-form-model-item label="Birth Date" prop="dateOfBirth"
											:rules="req('Please enter birth date')">
											<a-date-picker v-model="authUser.dateOfBirth" placeholder="User Birth Date"
												size="large" style="width: 100%" />
										</a-form-model-item>
									</a-col>
									<a-col :span="24" :md="8">
										<a-form-model-item label="Gender" prop="gender" required>
											<a-radio-group v-model="authUser.gender" default-value="female" size="large">
												<a-radio-button value="female">
													Female
												</a-radio-button>
												<a-radio-button value="male">
													Male
												</a-radio-button>
											</a-radio-group>
										</a-form-model-item>
									</a-col>
								</a-row>
							</a-col>
							<a-col :span="24" :md="12">
								<a-form-model-item label="Address" prop="address" :rules="req('Please enter user address')">
									<a-textarea v-model="authUser.address" placeholder="User Address" size="large" :rows="3">
									</a-textarea>
								</a-form-model-item>
							</a-col>
						</a-row>

						<a-row type="flex" :gutter="20">
							<a-col :span="24" :md="12">
								<a-form-model-item label="Username" prop="username"
									:rules="req('Please enter the username.')">
									<a-input v-model="authUser.username" placeholder="User Username" size="large">
									</a-input>
								</a-form-model-item>
							</a-col>
							<a-col :span="24" :md="12">
								<a-form-model-item label="Password" prop="password"
									:rules="req('Please enter the password.', false)">
									<a-input-password type="password" v-model="authUser.password" placeholder="User Password"
										size="large">
									</a-input-password>
								</a-form-model-item>
							</a-col>
						</a-row>
					</a-form-model>

					<div class="dF jE my-20">
						<a-button type="primary" @click="onUpdateUser">
							Update
						</a-button>
					</div>
				</div>
			</a-card>
		</a-spin>
	</div>
</template>

<script>
import moment from 'moment';
import Auth from '../services/auth'
import VueJwtDecode from "vue-jwt-decode";
import { mapState } from 'vuex';

export default ({
	components: {

	},
	data() {
		return {
			loading: false,
			authUser: {}
		}
	},

	computed: {
		...mapState(['user']),

		userInitials() {
			return this.authUser.name && this.authUser.name.split(' ').map(name => name[0]).join('').toUpperCase() || '';
		}
	},

	created() {
		this.authUser = this.user;

		this.$nextTick(() => {
			document.getElementById('profileImage').innerHTML = this.userInitials;
		});
	},

	methods: {
		req: (msg, required = true) => ({ required: required, message: msg }),

		onUpdateUser() {
			this.$refs.user.validate((valid) => {
				if (valid) {
					this.loading = true;

					const payload = {
						...this.authUser,
						mobileNo: Number(this.authUser.mobileNo),
					}

					this.$axios
						.put('/admin/update', {
							...payload
						})
						.then(() => {
							this.$message.success(
								`Successfully updated user Details!`
							);
						})
						.catch((error) => {
							this.$message.error(
								(error.response &&
									error.response.data &&
									error.response.data.message) ||
								`Error while editing user. Please try again!`
							);
						}).finally(() => {
							this.loading = false;
						});
				} else {
					return;
				}
			})
		},
	},
})

</script>

<style lang="scss" scoped>
#profileImage {
	font-family: Arial, Helvetica, sans-serif;
	width: 5rem;
	height: 5rem;
	border-radius: 50%;
	background: #0082fb;
	font-size: 2.5rem;
	color: #000;
	text-align: center;
	line-height: 5rem;
	margin: 2rem 0;
}
</style>
