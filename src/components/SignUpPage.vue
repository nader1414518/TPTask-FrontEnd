<template>
    <div class="login-container">
        <div>
            <h4>
                Create an account
            </h4>
        </div>
        <br />
        <div>
            <!-- Email input -->
            <div class="form-outline mb-4">
                <input type="email" v-model="signup_email" id="form2Example1" class="form-control" />
                <label class="form-label" for="form2Example1">Email address</label>
            </div>

            <!-- Password input -->
            <div class="form-outline mb-4">
                <input type="password" v-model="signup_password" id="form2Example2" class="form-control" />
                <label class="form-label" for="form2Example2">Password</label>
            </div>

            <!-- Password input -->
            <div class="form-outline mb-4">
                <input type="password" v-model="signup_confirm_password" id="form2Example3" class="form-control" />
                <label class="form-label" for="form2Example3">Confirm Password</label>
            </div>

            <!-- Submit button -->
            <button type="button" class="btn btn-primary btn-block mb-4" @click="onSignUp">Sign Up</button>
        </div>
    </div>
</template>

<style scoped>
.login-container {
    width: 70vw;
    align-items: center;
    padding-left: 15vw;
    padding-right: 15vw;
}

.button-top-left {
     margin-top: 20px;
     margin-left: 20px;
     position:absolute;
     top:0;
     left:0;
 }
</style>

<script>
    import Cookies from 'js-cookie';
    import { createToaster } from "@meforma/vue-toaster";
    import utils from '@/utils/utils';

    const toaster = createToaster({ /* options */ });

    export default {
        data() {
            return {
                signup_email: "",
                signup_password: "",
                signup_confirm_password: "",
            };
        },      
        mounted: async function () {
            await this.checkLogin();
        },
        methods: {
            async checkLogin() {
                // Check if user is logged in 
                this.$isLoading(true);

                var token = Cookies.get('l_t');
                if (token !== undefined && token !== null)
                {
                    console.log("User is logged in ... ");
                    this.$router.push({
                        name: 'Home',
                    });
                    this.$isLoading(false);
                    return;
                }

                this.$isLoading(false);
            },
            async onSignUp() {
                // Login on firebase 
                this.$isLoading(true);

                if (this.signup_email === "")
                {
                    toaster.show("Email can not be empty .. ");
                    this.$isLoading(false);
                    return;
                }

                if (this.signup_password === "")
                {
                    toaster.show("Password can not be empty .. ");
                    this.$isLoading(false);
                    return;
                }

                if (!(this.signup_email.trim().toLowerCase().includes('@')))
                {
                    toaster.show("Email is in an invalid format ... ");
                    this.$isLoading(false);
                    return;
                }

                if (this.signup_password !== this.signup_confirm_password)
                {
                    toaster.show("Passwords don't match .. ");
                    this.$isLoading(false);
                    return;
                }

                try {
                    var signUpRes = await this.axios.post(utils.apiUrl + '/users/create', {
                        Email: this.signup_email,
                        Password: this.signup_password,
                        Name: "",
                        Type: "user",
                        Phone: "",
                    });
                    // console.log(loginRes);
                    if (signUpRes.data === undefined || signUpRes.data === null)
                        return;

                    toaster.success("Created account successfully ... ");

                    this.$router.push({
                        name: 'Login',
                    });
                } catch (error) {
                    console.log(error);
                    if (error.response !== undefined && error.response !== null)
                    {
                        if (error.response.data !== undefined && error.response.data !== null)
                        {
                            toaster.error(error.response.data);
                        }
                    }
                }

                this.$isLoading(false);
            },
        }
    }
</script>