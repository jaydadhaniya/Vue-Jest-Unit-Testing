<template>
	<a-spin :spinning="loading">
		<a-card :bordered="false" class="header-solid h-full">
			<a-table :rowKey="(e) => e.id" :columns="patientColumns" :data-source="patientRecords">
				<template #title>
					<a-row type="flex" :gutter="[8, 16]" justify="end">
						<a-col :span="24" :md="5">
							<a-input-search v-model="search" placeholder="Search here" id="search" style="width: 100%" />
						</a-col>
						<a-col :span="24" :md="3" style="
																					display: flex;
																					align-items: center;
																					justify-content: flex-end;
																				">
							<a-button type="primary" @click="resetData(); visible = true" id="addButton">Add Patient</a-button>
						</a-col>
					</a-row>
				</template>
				<template slot="actions" slot-scope="patient" class="mr-50">
					<div class="dF aC" style="gap: 20px">
						<a-button @click="editPatient(patient)" type="primary" id="editButton">
							Edit
						</a-button>
						<a-button @click="onDelete(patient)" type="danger" id="deleteButton">
							Delete
						</a-button>
					</div>
				</template>
			</a-table>
		</a-card>
		<a-modal v-model="visible" :title="edit ? 'Edit Patient' : 'Add New Patient'" centered width="1000px" id="modal">
			<a-form-model ref="patient" :model="patient" class="profile">
				<a-row type="flex" :gutter="20">
					<a-col :span="24" :md="12">
						<a-form-model-item label="Name" prop="name" :rules="req('Please enter the name.')">
							<a-input v-model="patient.name" placeholder="Patient Name" size="large" id="name">
							</a-input>
						</a-form-model-item>
					</a-col>
					<a-col :span="24" :md="8">
						<a-form-model-item label="Mobile No" prop="mobileNo"
							:rules="req('Please enter the mobile number.')">
							<a-input-number v-model="patient.mobileNo" placeholder="Patient Mobile No" size="large"
								style="width: 100%" id="mobileNo">
							</a-input-number>
						</a-form-model-item>
					</a-col>
					<a-col :span="24" :md="4">
						<a-form-model-item label="Gender" prop="gender">
							<a-radio-group v-model="patient.gender" default-value="Male">
								<a-radio-button value="Male">
									Male
								</a-radio-button>
								<a-radio-button value="Female">
									Female
								</a-radio-button>
							</a-radio-group>
						</a-form-model-item>
					</a-col>
				</a-row>

				<a-row type="flex" :gutter="20">
					<a-col :span="24" :md="12">
						<a-form-model-item label="Address" prop="address" :rules="req('Please enter patient address')">
							<a-textarea v-model="patient.address" placeholder="Patient Address" size="large" :rows="3" id="address">
							</a-textarea>
						</a-form-model-item>
					</a-col>

					<a-col :span="24" :md="12">
						<a-form-model-item label="Disease" prop="disease" :rules="req('Please enter patient Disease')">
							<a-textarea v-model="patient.disease" placeholder="Patient Disease" size="large" :rows="3" id="disease">
							</a-textarea>
						</a-form-model-item>
					</a-col>
				</a-row>
			</a-form-model>
			<template slot="footer">
		        <a-button key="back" @click="resetData();" id="cancelButton">
		          Cancel
		        </a-button>
		        <a-button key="submit" type="primary" :loading="loading" @click="onSubmit" id="submitButton">
		          {{edit ? 'Update' : 'Submit'}}
		        </a-button>
		      </template>
		</a-modal>
	</a-spin>
</template>

<script>
import { mapActions, mapState } from "vuex";

export default ({
	components: {
	},
	data() {
		return {
			loading: false,
			visible: false,
			edit: false,
			search: '',
			patient: {
				name: "",
				gender: "Male",
				address: "",
				mobileNo: null,
				disease: "",
			},
			patientColumns: [
				{
					title: "NAME",
					dataIndex: "name",
					sorter: (a, b) =>
						a.name < b.name ? -1 : a.name > b.name ? 1 : 0,
				},
				{
					title: "MOBILE NO.",
					dataIndex: "mobileNo",
					sorter: (a, b) =>
						a.mobileNo < b.mobileNo ? -1 : a.mobileNo > b.mobileNo ? 1 : 0,
				},
				{
					title: "GENDER",
					dataIndex: "gender",
					sorter: (a, b) =>
						a.gender < b.gender ? -1 : a.gender > b.gender ? 1 : 0,
				},
				{
					title: "ADDRESS",
					dataIndex: "address",
					sorter: (a, b) =>
						a.address < b.address ? -1 : a.address > b.address ? 1 : 0,
				},
				{
					title: "DISEASE",
					dataIndex: "disease",
					sorter: (a, b) =>
						a.disease < b.disease ? -1 : a.disease > b.disease ? 1 : 0,
				},
				{
					title: "",
					scopedSlots: { customRender: "actions" },
				},
			],
		}
	},

	computed: {
		...mapState(['patientList']),

		patientRecords() {
			return this.patientList.filter((d) =>
				d.name.toLowerCase().includes(this.search.toLowerCase())
			);
		},
	},

	created() {
		try {
			this.getPatientList();
		} catch (error) {
			this.$message.error('Error occurred while fetching patient list.')
		}
	},

	methods: {
		...mapActions(['getPatientList', 'addPatient', 'updatePatient', 'removePatient']),

		req: (msg, required = true) => ({ required: required, message: msg }),

		resetData() {
			this.loading = false;
			this.visible = false;
			this.edit = false;
			this.search = "";
			this.patient = {
				name: "",
				gender: "Male",
				address: "",
				mobileNo: null,
				disease: "",
			};
		},

		async onDelete(patient) {
			this.loading = true;
			try {
				await this.removePatient(patient.id)
				this.$message.success('Patient removed successfully!')
			} catch (error) {
				this.$message.error('Error occurred while removing patient')
			}
			this.loading = false;
		},

		editPatient(patient) {
			this.resetData()
			this.edit = true;
			this.patient = {
				...patient,
				id: Number(patient.id),
				mobileNo: Number(patient.mobileNo),
			};
			this.visible = true;
		},

		onSubmit() {
			this.$refs.patient.validate(async (valid) => {
				if (valid) {
					this.loading = true;

					if (this.edit) {
						try {
							await this.updatePatient({
								...this.patient,
								id: Number(this.patient.id),
								mobileNo: Number(this.patient.mobileNo),
							})
							this.$message.success(
								`Patient details updated successfully!`
							);
							this.edit = false;
							this.visible = false;
						} catch (error) {
							this.$message.error(
								(error.response &&
									error.response.data &&
									error.response.data.message) ||
								`Error while updating patient. Please try again!`
							);
						} finally {
							this.loading = false;
						}
					} else {
						try {
							await this.addPatient({ ...this.patient, mobileNo: Number(this.patient.mobileNo) })
							this.$message.success(
								`New patient added successfully!`
							);
							this.visible = false;
						} catch (error) {
							this.$message.error(
								(error.response &&
									error.response.data &&
									error.response.data.message) ||
								`Error while creating new patient. Please try again!`
							);
						} finally {
							this.loading = false;
						}
					}
				} else {
					return;
				}
			})
		},
	},
})

</script>

<style lang="scss">
</style>
