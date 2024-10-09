import { Template } from 'meteor/templating';
import { ReactiveVar } from 'meteor/reactive-var';
import { TasksCollection } from '../api/TasksCollection';
import './Task.html';

Template.task.onCreated(function () {
    this.isEditing = new ReactiveVar(false);
    this.isModalVisible = new ReactiveVar(false);
});

Template.task.helpers({
    isEditing() {
        return Template.instance().isEditing.get();
    },
    isModalVisible() {
        return Template.instance().isModalVisible.get();
    }
});

Template.task.events({
    'click .toggle-checked'() {
        TasksCollection.update(this._id, {
            $set: { isChecked: !this.isChecked },
        });
    },
    'click .delete-task'(event, instance) {
       
        instance.isModalVisible.set(true);
        instance.$(`#delete-modal-${this._id}`).fadeIn();
    },
    'click .cancel-btn'(event, instance) {
       
        instance.$(`#delete-modal-${this._id}`).fadeOut();
        instance.isModalVisible.set(false);
    },
    'click .delete-btn'(event, instance) {

        TasksCollection.remove(this._id);
        console.log("Task deleted:", this._id);

   
        instance.$(`#delete-modal-${this._id}`).fadeOut();
        instance.isModalVisible.set(false);
    },
    'click .edit-task'(event, instance) {
        instance.isEditing.set(true);
    },
    'click .save-edit'(event, instance) {
        const newText = instance.$('.edit-task-input').val();
        if (newText) {
            TasksCollection.update(this._id, {
                $set: { text: newText },
            });
            console.log("Task updated with new text:", newText);
        }
        instance.isEditing.set(false);
    },
    'click .cancel-edit'(event, instance) {
        instance.isEditing.set(false);
    }
});
