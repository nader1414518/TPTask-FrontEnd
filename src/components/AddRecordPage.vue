<template>
    <div class="page-container">
        <div>
            <h4>
                Add new record
            </h4>
        </div>
        <br />
        <br />

        <div>
            <div class="form-group row">
                <label for="staticEmail" class="col-sm-2 col-form-label">Name</label>
                <div class="col-sm-10">
                <input type="text" v-model="Name" class="form-control" id="form2Example1" >
                </div>
            </div>
            <br />
            <div class="form-group row">
                <label for="form2Example2" class="col-sm-2 col-form-label">Email</label>
                <div class="col-sm-10">
                    <input type="email" v-model="Email" class="form-control" id="form2Example2" >
                </div>
            </div>
            <br />
            <div class="form-group row">
                <label for="staticEmail" class="col-sm-2 col-form-label">Phone</label>
                <div class="col-sm-10">
                    <input type="text" v-model="Phone" class="form-control" id="form2Example3" >
                </div>
            </div>
            <br />
            <div class="form-group row">
                <label for="form2Example2" class="col-sm-2 col-form-label">Photo</label>
                <div class="col-sm-10">
                    <input type="file" accept=".png, .jpg" @change="importImage" id="form2Example2" class="form-control" />
                </div>
            </div>
            <br />

            <!-- Submit button -->
            <button type="button" class="btn btn-primary btn-block mb-4" @click="addRecord">Edit</button>
        </div>
    </div>
</template>

<style scoped>
.page-container {
    padding-left: 10vw;
    padding-right: 10vw;
}
</style>

<script>
    import Cookies from 'js-cookie';
    import { createToaster } from "@meforma/vue-toaster";
    import utils from '@/utils/utils';
    import { getStorage, ref, uploadBytes, getDownloadURL } from "firebase/storage";
    import app from '../firebase';

    const toaster = createToaster({ /* options */ });

    export default {
        data() {
            return {
                Name: "",
                Email: "",
                Phone: "",
                ImgUrl: "",
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
            async addRecord()
            {
                if (this.Name === "")
                {
                    toaster.error("Name cannot be empty ... ");
                    return;
                }

                if (this.Email === "")
                {
                    toaster.error("Email cannot be empty ... ");
                    return;
                }

                if (this.Phone === "")
                {
                    toaster.error("Phone cannot be empty ... ");
                    return;
                }

                if (this.ImgUrl === "")
                {
                    toaster.error("Image cannot be empty ... ");
                    return;
                }

                this.$isLoading(true);
                try {
                    var uid = Cookies.get('l_i');
                    var token = Cookies.get('l_t');

                    const config = {
                        headers: { Authorization: `Bearer ${token}` }
                    };

                    await this.axios.post(utils.apiUrl + '/records', {
                            UserId: uid,
                            Name: this.Name,
                            Email: this.Email,
                            Phone: this.Phone,
                            ImgUrl: this.ImgUrl,
                        },
                        config
                    );

                    this.$router.back();
                } catch (error) {
                    if (error.data !== undefined && error.data !== null)
                    {
                        toaster.error(error.data);
                    }
                }

                this.$isLoading(false);
            },
            importImage(event)
            {
                var files = event.target.files;
                // console.log(files);
                var reader = new FileReader();

                const name = event.target.files[0].name;
                const lastDot = name.lastIndexOf('.');

                const fileName = name.substring(0, lastDot);
                const ext = name.substring(lastDot + 1);

                let self = this;
                reader.onload = async function (frEvent) {
                    self.$isLoading(true);
                    
                    try {
                        const storage = getStorage(app);
                        const storageRef = ref(storage, '/Photos/' + name + '.' + ext);

                        const bytes = frEvent.target.result;
                        await uploadBytes(storageRef, bytes);

                        self.ImgUrl = await getDownloadURL(storageRef);

                        // console.log(self.ImgUrl);
                    } catch (error) {
                        
                    }

                    self.$isLoading(false);
                }

                reader.readAsArrayBuffer(files[0]);
            }
        }
    }
</script>