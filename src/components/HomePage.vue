<template>
    <div class="home-container">
        <div class="row">
            <div class="col-6">
                Records
            </div>
            <div class="col-6">
                <button class="btn btn-primary" @click="goToAddRecordPage">
                    Add Record
                </button>
            </div>
        </div>
        <br />
        <RecordsTable 
            :fields="fields" 
            :tableData="records"
            :userType="userType"
            @update="onRecordsTableUpdated" />
    </div>
    <button class="btn btn-danger button-top-right" @click="logOut">
        Log Out
    </button>
</template>

<style scoped>
.home-container {
    padding-left: 10vw;
    padding-right: 10vw;
}
.button-top-right {
     margin-top: 20px;
     margin-right: 20px;
     position:absolute;
     top:0;
     right:0;
 }
</style>

<script>
    import Cookies from 'js-cookie';
    import { createToaster } from "@meforma/vue-toaster";
    import RecordsTable from '@/components/RecordsTable';
    import utils from '@/utils/utils';

    const toaster = createToaster({ /* options */ });

    export default {
        data() {
            return {
                records: [],
                fields: [],
                userType: "user",
            };
        },  
        mounted: async function () {
            await this.checkLogin();

            await this.getUserData();

            await this.getRecords();
        },
        methods: {
            async logOut() {
                Cookies.remove('l_t');
                Cookies.remove('l_e');
                Cookies.remove('l_p');
                Cookies.remove('l_i');
                Cookies.remove('l_m');

                this.$router.push('/login');
            },  
            async checkLogin() {
                // Check if user is logged in 
                this.$isLoading(true);

                var token = Cookies.get('l_t');

                if (token === undefined || token === null)
                {
                    console.log("User is not logged in ... ");
                    this.$router.push({
                        name: 'Login',
                    });
                    this.$isLoading(false);
                    return;
                }

                try {
                    var email = Cookies.get('l_e');
                    var password = Cookies.get('l_p');
                    var uid = Cookies.get('l_i');
                    var userType = Cookies.get('l_m');
                    this.userType = userType;
                    if (email === undefined || email === null)
                    {
                        toaster.show("Your session expired. Please login again ... ");
                        this.$router.push({
                            name: 'Login',
                        });
                        this.$isLoading(false);
                        return;
                    }

                    if (password === undefined || password === null)
                    {
                        toaster.show("Your session expired. Please login again ... ");
                        this.$router.push({
                            name: 'Login',
                        });
                        this.$isLoading(false);
                        return;
                    }

                    if (uid === undefined || uid === null)
                    {
                        toaster.show("Your session expired. Please login again ... ");
                        this.$router.push({
                            name: 'Login',
                        });
                        this.$isLoading(false);
                        return;
                    }

                    
                } catch (error) {
                    toaster.show("Your session expired. Please login again ... ");
                    this.$router.push({
                        name: 'Login',
                    });
                }

                this.$isLoading(false);
            },
            async getUserData() {
                var uid = Cookies.get('l_i');

                var usersData = await this.axios.get(utils.apiUrl + '/users');
                if (usersData.data !== undefined || usersData.data !== null)
                {
                    for (var i = 0; i < usersData.data.length; i++)
                    {
                        if (uid === usersData.data[i].userId)
                        {
                            console.log(usersData.data[i]);
                            this.userType = usersData.data[i].type;
                        }
                    }
                }
            },  
            async getRecords() {
                this.$isLoading(true);

                try {
                    var token = Cookies.get('l_t');

                    const config = {
                        headers: { Authorization: `Bearer ${token}` }
                    };
                    var recordsRes = await this.axios.get(utils.apiUrl + '/records', config);
                    // console.log(recordsRes);
                    if (recordsRes.data === undefined || recordsRes.data === null)
                    {
                        toaster.show("No records found, Add a new one ... ");
                        return;
                    }     
                    
                    this.records = recordsRes.data;
                } catch (error) {
                    if (error.data !== undefined && error.data !== null)
                    {
                        toaster.error(error.data);
                    }
                }

                this.$isLoading(false);
            },  
            goToAddRecordPage() {
                this.$router.push({
                    name: 'Add Record',
                });
            },
            onRecordsTableUpdated(newData)
            {
                // Do something here with the new data
                this.records = newData;
                // console.log(this.records)
            }
        },
        components: {
            RecordsTable
        }
    }
</script>