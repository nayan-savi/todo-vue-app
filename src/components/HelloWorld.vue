<template>
    <v-form>
        <div>
            <v-alert type="warning" dismissible @click="isDismissible" v-if="isExists">
                Event Already Exists.
            </v-alert>
            <v-alert type="success" v-if="isSaved" dismissible>
                Event saved successfully.
            </v-alert>
        </div>
        <div class="container">

            <div class="add-box">
              <h2>Enter the Tasks</h2>
              <br/>
              <v-text-field
                      v-model="eventName"
                      label="Event Name"
                      :error-messages="eventNameErrors"
                      @input="$v.eventName.$touch()"
                      @blur="$v.eventName.$touch()"
                      required
                      outlined
                      :disabled="isEditing"
              >
              </v-text-field>
              <v-text-field
                      v-model="eventDetails"
                      label="Event Details"
                      :error-messages="eventDetailsErrors"
                      @input="$v.eventDetails.$touch()"
                      @blur="$v.eventDetails.$touch()"
                      required
                      outlined
              >
              </v-text-field>
              <div class="my-2">
                <v-btn large color="primary" class="mx-4" @click="saveTasks" v-if="!isEditing">Add</v-btn>
                <v-btn large color="normal" @click="clear" v-if="!isEditing">Clear</v-btn>
                <v-btn large color="primary" @click="updateTask(eventName, eventDetails)" v-if="isEditing">Update
                </v-btn>
              </div>
            </div>

          <v-spacer></v-spacer>
          <div class="list-box">
                <v-card>
                    <v-simple-table fixed-header>
                        <template>
                            <thead>
                            <tr>
                                <th class="text-left">Event Name</th>
                                <th class="text-left">Event Details</th>
                                <th class="text-left">Actions</th>
                            </tr>
                            </thead>
                            <tbody>
                            <tr v-for="(event, index) in events" :key="index">
                                <td>{{ event.eventName }}</td>
                                <td>{{ event.eventDetails }}</td>
                                <td>
                                    <v-btn small color="primary" class="mx-2" @click="editEvent(event)">Edit</v-btn>
                                    <v-btn small color="error" @click="deleteEvent(event)">Delete</v-btn>
                                </td>
                            </tr>
                            </tbody>
                        </template>
                    </v-simple-table>
                </v-card>
            </div>
        </div>

    </v-form>
</template>


<script>
    import {validationMixin} from "vuelidate";
    import {required, maxLength} from "vuelidate/lib/validators";

    export default {
        mixins: [validationMixin],
        name: "HelloWorld",

        validations: {
            eventName: {required, maxLength: maxLength(10)},
            eventDetails: {required, maxLength: maxLength(20)}
        },
        data: () => ({
            eventName: "",
            eventDetails: "",
            isEditing: false,
            isExists: false,
            isSaved: false,
            headers: [
                {
                    text: 'Task Name',
                    align: 'start',
                    sortable: false,
                    value: 'eventName',
                },
                {text: 'Task Details', value: 'eventDetails'},
                {text: 'Actions', value: 'actions'}
            ],
            events:
                [
                    {
                        eventName: 'Meeting',
                        eventDetails: 'Business 10AM',
                    },
                    {
                        eventName: 'Birthday',
                        eventDetails: 'Birthday 12PM',
                    },
                    {
                        eventName: 'Marriage',
                        eventDetails: 'Marriage 12PM',
                    },

                ],
        }),
        computed: {
            eventNameErrors() {
                const errors = [];
                if (!this.$v.eventName.$dirty) return errors;
                !this.$v.eventName.maxLength && errors.push('Name must be at most 10 characters long');
                !this.$v.eventName.required && errors.push("Task Name is required.");
                return errors;
            }
            ,
            eventDetailsErrors() {
                const errors = [];
                if (!this.$v.eventDetails.$dirty) return errors;
                !this.$v.eventDetails.maxLength && errors.push('Name must be at most 20 characters long');
                !this.$v.eventDetails.required && errors.push("Task Details is required.");
                return errors;
            },


        }
        ,
        methods: {
            isDismissible() {
                this.isExists = false;
                return true;
            },
            saveTasks() {
                if (this.eventName !== '' && this.eventDetails !== '') {
                    let result = this.checkValidation(this.eventName);
                    if (result.length === 0) {
                        const task = {
                            eventName: this.eventName,
                            eventDetails: this.eventDetails,
                        };
                        this.events.push(task);
                        this.initialize();
                        this.isExists = false;
                        this.isSaved = true;
                    } else {
                        this.isExists = true;
                        console.log('event already exists');
                    }

                } else {
                    this.$v.$touch();
                }
            }
            ,
            updateTask(eventName, eventDetails) {
                this.events.forEach(event => {
                    if (event.eventName === eventName) {
                        event.eventDetails = eventDetails;
                    }
                });
                this.isEditing = false;
                this.initialize();
            }
            ,
            editEvent(event) {
                this.isEditing = true;
                this.eventName = event.eventName;
                this.eventDetails = event.eventDetails;
            }
            ,
            deleteEvent(event) {
                this.events = this.events.filter(e => e.eventName !== event.eventName);
            }
            ,
            initialize() {
                this.$v.$reset();
                this.eventName = '';
                this.eventDetails = '';
            }
            ,
            clear() {
                this.initialize();
            }
            ,
            checkValidation(eventName) {
                return this.events.filter(e => e.eventName === eventName);
            }
        }
    }
    ;
</script>

<style scoped>
    .container {
        display: flex;
    }

    .add-box {
        width: 40%;
        padding: 20px;
    }

    .list-box {
        width: 50%;
        padding-top: 30px;
    }

    .v-alert {
        margin: 20px;
    }
  .text-left {
    font-weight: bold;
  }

</style>
