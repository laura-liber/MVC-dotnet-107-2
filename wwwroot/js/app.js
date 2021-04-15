var important = false;
var myTasks = [];
var UI = {};
var serverUrl= "http://fsdi.azurewebsites.net/api";

function toggleImportant() {
    if(important) {
        $("#iconImp").removeClass('fas').addClass('far');
        important = false;
    }
    else {
        $("#iconImp").removeClass('far').addClass('fas');
        important = true;
    }  
}

function saveTask() {
    var title = UI.title.val();
    var description = UI.description.val();
    var dueDate = UI.dueDate.val();
    var location = UI.location.val();
    var alertText = UI.alertText.val();
    var status = UI.status.val();

    //validations
    if(title.length < 5) {
        //show the error 
        $("#alertTitle").removeClass('hide');

        //use a 1-time timer 
        setTimeout(function(){
            $("#alertTitle").addClass('hide');
        }, 5000 ); //2-> time in milliseconds

        //do not continue exec
        return;
    }

    let descLength = description.length;
    if( descLength >= 1 && descLength <= 30) {
        $("#alertDesc").removeClass('hide');

        setTimeout(function() {
            $("#alertDesc").addClass('hide');
        }, 5000 );

        return;
    }

    

    var task = new Task(title, description, important, dueDate, location, alertText, status);
    console.log(task);

    //save the task in BE
    $.ajax({
        type: "POST",
        url: serverUrl + "/tasks",
        data: JSON.stringify(task),
        contentType: 'application/json',
        success: function(res) {
            displayTask(res);
            console.log(res);
        },
        error: function(error) {
            console.log("Error", error);
        }
    });
}

function clearForm() {
    UI.title.val("");
    //clear the rest of inputs
    if(important) toggleImportant();
}

function taskClicked(id) {
    console.log("A task was clicked", id);

    myTasks
    //create a for loop
    for(let i=0;i<myTasks.length;i++) {
        let task= myTasks[i];
        if(task.id === id){
            console.log("Found it:", task);
            //show the task into the capture form\

            UI.title.val(task.title);
            UI.description.val(task.description);
            UI.dueDate.val(task.dueDate);
            UI.location.val(task.location);
            UI.alertText.val(task.alertText);
            UI.status.val(task.status);

            important = !task.important;
            toggleImportant();
        } 
    }   
}

function displayTask(task) {

    //parse date string into date object
    let theDate = new Date(task.dueDate);

    let syntax = 
    `<div onclick="taskClicked(${task.id});" class="task"> 
        <h5> ${task.title} </h5> 
        <p> ${task.description} </p>
        <p> ${task.location} </p>
        <label> ${theDate.toDateString()} </label>
        <h6> ${task.important} </h6>
    </div>`;

    $("#pendingTasks").append(syntax);
}

function fetchTasks() {
    $.ajax({
        type:"GET",
        url: serverUrl + "/tasks",
        success: function(data) {
            console.log(data);

            for(let i=0;i< data.length;i++) {
                let task = data[i];
                if (task.user === "LauraL") {
                    myTasks.push(task);
                    displayTask(task); 
                } 
            }
        },
        error: function(errDetails) {
            console.error(errDetails);
        }
    });
}

function init() {

    

    console.log("Task Manager");
    UI.id = $("#txtId");
    UI.title = $("#txtTitle");
    UI.description = $("#txtDescription");
    UI.dueDate = $("#txtDueDate");
    UI.location = $("#txtLocation");
    UI.alertText = $("#txtAlert");
    UI.status = $("#selStatus");

    //load data
    fetchTasks();

    //hook events
    $("#iconImp").click(toggleImportant);
    $("#btnSave").click(saveTask);
    $("#btnDetails").click(function() {
        $("#details").toggle();
    });
}


function testAjax() {
    $.ajax({
        url: "https://restclass.azurewebsites.net/api/test",
        type: "GET",
        success: function( res ) {
            console.log("Yay! It worked!", res);
        },
        error: function( error ) {
            console.log("We have a problem :(", error);
        },
    });
}


window.onload = init;

/**
 * Hide the panel
 * create a button
 * when button clicked, show the panel
 */



