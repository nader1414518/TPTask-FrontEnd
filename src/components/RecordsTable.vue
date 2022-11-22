<template>
    <table id="tableComponent" class="table table-bordered table-striped">
    <thead>
      <tr>
        <!-- loop through each value of the fields to get the table header -->
        <th>
            ID
        </th>
        <th>
            Name
        </th>
        <th>
            Phone
        </th>
        <th>
            Email
        </th>
        <th>
            Image
        </th>
      </tr>
    </thead>
    <tbody>
      <!-- Loop through the list get the each student data -->
      <tr v-for="item in tableData" :key='item'>
        <td>
            {{item['recordId']}}
        </td>
        <td>
            {{item['name']}}
        </td>
        <td>
            {{item['phone']}}
        </td>
        <td>
            {{item['email']}}
        </td>
        <td>
            <!-- {{item['imgUrl']}} -->
            <img :src="item['imgUrl']" />
        </td>
        <!-- <td><button class="btn btn-secondary" @click="editSimulation(item['id'])"> Open </button></td> -->
        <td><button class="btn btn-info" @click="goToEditRecordPage(item['recordId'])"> Edit </button></td>
        <td><button class="btn btn-danger" v-if="userType === 'admin'" @click="removeRecord(item['recordId'])"> Remove </button></td>
      </tr>
    </tbody>
    </table> 
    <!-- <router-view></router-view> -->
    </template>
    
<style scoped>
    .searchTextField {
        margin-right: 20px;
    }

    img {
        width: 10vw; /* or any custom size */
        height: 10vw; 
        object-fit:contain;
    }
</style>
    
    <script>
        import "bootstrap/dist/css/bootstrap.min.css";
        import { createToaster } from "@meforma/vue-toaster";
        import Cookies from 'js-cookie';
import utils from "@/utils/utils";
    
    
        const toaster = createToaster({ /* options */ });

    
        export default {
            props:{
                tableData:{
                    type: Array,
                },
                fields:{
                    type: Array,
                },
                userType: {
                    type: String,
                }
            }, 
            methods: {
                async removeRecord(itemId)
                {
                    this.$isLoading(true);

                    try {
                        var uid = Cookies.get('l_i');
                        var newTableData = this.$props.tableData.filter(item => item.recordId !== itemId);

                        // console.log(newTableData);

                        var token = Cookies.get('l_t');
                        const config = {
                            headers: { Authorization: `Bearer ${token}` }
                        };

                        await this.axios.delete(utils.apiUrl + '/records/' + itemId, config);

                        this.$emit('update', newTableData);
                    } catch (error) {
                        console.log(error);
                    }

                    this.$isLoading(false);
                },
                goToEditRecordPage(recordId)
                {
                    this.$router.push({
                        name: 'Edit Record',
                        params: {
                            id: recordId,
                        },
                    });
                }
            }
        }
    </script>