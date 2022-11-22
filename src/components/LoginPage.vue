<template>
    <div class="login-container">
        <div>
            <h4>
                Login with your credentials 
            </h4>
        </div>
        <br />
        <div>
            <!-- Email input -->
            <div class="form-outline mb-4">
                <input type="email" v-model="login_email" id="form2Example1" class="form-control" />
                <label class="form-label" for="form2Example1">Email address</label>
            </div>

            <!-- Password input -->
            <div class="form-outline mb-4">
                <input type="password" v-model="login_password" id="form2Example2" class="form-control" />
                <label class="form-label" for="form2Example2">Password</label>
            </div>

            <!-- Submit button -->
            <button type="button" class="btn btn-primary btn-block mb-4" @click="onLogin">Sign in</button>

            <!-- Register buttons -->
            <div class="text-center">
                <p>Not a member? <button class="btn btn-info" @click="goToSignUpPage">Register</button></p>
            </div>
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
                login_email: "",
                login_password: "",
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
            async onLogin() {
                // Login on firebase 
                this.$isLoading(true);

                if (this.login_email === "")
                {
                    toaster.show("Email can not be empty .. ");
                    this.$isLoading(false);
                    return;
                }

                if (this.login_password === "")
                {
                    toaster.show("Password can not be empty .. ");
                    this.$isLoading(false);
                    return;
                }

                if (!(this.login_email.trim().toLowerCase().includes('@')))
                {
                    toaster.show("Email is in an invalid format ... ");
                    this.$isLoading(false);
                    return;
                }

                try {
                    var loginRes = await this.axios.post(utils.apiUrl + '/users', {
                        Email: this.login_email,
                        Password: this.login_password,
                    });
                    // console.log(loginRes);
                    if (loginRes.data === undefined || loginRes.data === null)
                        return;

                    var userData = loginRes.data;
                    var tokenRes = await this.axios.post(utils.apiUrl + '/token', {
                        "email": this.login_email,
                        "password": this.login_password,
                    });

                    var token = tokenRes.data;
                    userData = {token, ...userData};
                    // console.log(userData);

                    Cookies.set('l_t', userData.token, {
                        expires: 1/24,
                        secure: true,
                    });

                    Cookies.set('l_e', this.login_email, {
                        expires: 1/24,
                        secure: true,
                    });

                    Cookies.set('l_p', this.login_password, {
                        expires: 1/24,
                        secure: true,
                    });

                    Cookies.set('l_i', userData.userId, {
                        expires: 1/24,
                        secure: true,
                    });

                    Cookies.set('l_m', userData.type, {
                        expires: 1/24,
                        secure: true,
                    });

                    this.$router.push({
                        name: 'Home',
                    });
                } catch (error) {
                    // console.log(error);
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
            goToSignUpPage() {
                this.$router.push({
                    name: 'Sign Up'
                });
            }
        }
    }
</script>